-- RLS multi-tenant: isolamento de dados entre escritórios.
-- Requisito de segurança número 1 da Fase A (ver docs/plano-desenvolvimento.md).
--
-- Princípio: toda tabela com organization_id passa a exigir
-- organization_id = current_user_org_id() em TODAS as suas políticas,
-- além das condições de dono/role já existentes.
--
-- Exceção deliberada (não alterada nesta migration): "Everyone can view
-- process types" e "Anyone can view CMS content" continuam públicas,
-- porque a landing pública ainda não tem roteamento por organização
-- (fora de escopo da Fase A, ver seção 4.3 do plano). Com apenas um
-- tenant hoje isso não vaza dado real, mas é um ponto a revisitar
-- quando existir mais de um escritório com conteúdo público distinto.

-- SECURITY DEFINER é obrigatório aqui: sem isso, esta função (usada dentro
-- das próprias policies de `profiles`) causa recursão infinita, porque sua
-- consulta interna a `profiles` reavalia as policies de `profiles`, que
-- chamam esta função de novo. SECURITY DEFINER faz a consulta interna
-- rodar sem RLS, quebrando o ciclo.
CREATE OR REPLACE FUNCTION public.current_user_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid()
$$;

-- Mesma razão do current_user_org_id(): usada dentro de policies de
-- `profiles`, precisa ser SECURITY DEFINER para não recursar. Uma
-- subquery inline (EXISTS ... FROM profiles ...) dentro de uma policy
-- DA PRÓPRIA profiles dispara "infinite recursion detected in policy"
-- no Postgres, independente do conteúdo dos dados — é estrutural.
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

-- profiles
DROP POLICY "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (organization_id = current_user_org_id() AND auth.uid() = id);

DROP POLICY "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (organization_id = current_user_org_id() AND auth.uid() = id);

DROP POLICY "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (organization_id = current_user_org_id() AND current_user_role() = 'admin');

DROP POLICY "Admins can insert profiles" ON public.profiles;
CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (organization_id = current_user_org_id() AND current_user_role() = 'admin');

-- process_types (mantém leitura pública deliberadamente; escreve escopado)
DROP POLICY "Admins can manage process types" ON public.process_types;
CREATE POLICY "Admins can manage process types" ON public.process_types
  FOR ALL USING (
    organization_id = current_user_org_id()
    AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- processes
DROP POLICY "Users can view own processes" ON public.processes;
CREATE POLICY "Users can view own processes" ON public.processes
  FOR SELECT USING (
    organization_id = current_user_org_id()
    AND (client_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  );

DROP POLICY "Admins can manage all processes" ON public.processes;
CREATE POLICY "Admins can manage all processes" ON public.processes
  FOR ALL USING (
    organization_id = current_user_org_id()
    AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- process_steps
DROP POLICY "Users can view steps of own processes" ON public.process_steps;
CREATE POLICY "Users can view steps of own processes" ON public.process_steps
  FOR SELECT USING (
    organization_id = current_user_org_id()
    AND EXISTS (
      SELECT 1 FROM public.processes
      WHERE processes.id = process_steps.process_id
        AND (processes.client_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
    )
  );

DROP POLICY "Admins can manage all process steps" ON public.process_steps;
CREATE POLICY "Admins can manage all process steps" ON public.process_steps
  FOR ALL USING (
    organization_id = current_user_org_id()
    AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- process_documents
DROP POLICY "Users can view documents of own processes" ON public.process_documents;
CREATE POLICY "Users can view documents of own processes" ON public.process_documents
  FOR SELECT USING (
    organization_id = current_user_org_id()
    AND EXISTS (
      SELECT 1 FROM public.processes
      WHERE processes.id = process_documents.process_id
        AND (processes.client_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
    )
  );

DROP POLICY "Users can upload documents to own processes" ON public.process_documents;
CREATE POLICY "Users can upload documents to own processes" ON public.process_documents
  FOR INSERT WITH CHECK (
    organization_id = current_user_org_id()
    AND uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.processes
      WHERE processes.id = process_documents.process_id
        AND (processes.client_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
    )
  );

DROP POLICY "Admins can manage all documents" ON public.process_documents;
CREATE POLICY "Admins can manage all documents" ON public.process_documents
  FOR ALL USING (
    organization_id = current_user_org_id()
    AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- process_messages
DROP POLICY "Users can view messages of own processes" ON public.process_messages;
CREATE POLICY "Users can view messages of own processes" ON public.process_messages
  FOR SELECT USING (
    organization_id = current_user_org_id()
    AND EXISTS (
      SELECT 1 FROM public.processes
      WHERE processes.id = process_messages.process_id
        AND (processes.client_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
    )
  );

DROP POLICY "Users can send messages to own processes" ON public.process_messages;
CREATE POLICY "Users can send messages to own processes" ON public.process_messages
  FOR INSERT WITH CHECK (
    organization_id = current_user_org_id()
    AND sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.processes
      WHERE processes.id = process_messages.process_id
        AND (processes.client_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
    )
  );

-- notifications
DROP POLICY "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (organization_id = current_user_org_id() AND user_id = auth.uid());

DROP POLICY "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (organization_id = current_user_org_id() AND user_id = auth.uid());

DROP POLICY "System can create notifications" ON public.notifications;
CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (organization_id = current_user_org_id());

-- audit_logs
DROP POLICY "Admins can create audit logs" ON public.audit_logs;
CREATE POLICY "Admins can create audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (
    organization_id = current_user_org_id()
    AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = ANY (ARRAY['admin_master','admin','admin_editor','admin_viewer']))
  );

DROP POLICY "Only admin_master can view audit logs" ON public.audit_logs;
CREATE POLICY "Only admin_master can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    organization_id = current_user_org_id()
    AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin_master')
  );

-- document_audit_logs
DROP POLICY "Admins can create document audit logs" ON public.document_audit_logs;
CREATE POLICY "Admins can create document audit logs" ON public.document_audit_logs
  FOR INSERT WITH CHECK (
    organization_id = current_user_org_id()
    AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = ANY (ARRAY['admin','admin_master','admin_editor']))
  );

DROP POLICY "Admins can view all document audit logs" ON public.document_audit_logs;
CREATE POLICY "Admins can view all document audit logs" ON public.document_audit_logs
  FOR SELECT USING (
    organization_id = current_user_org_id()
    AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = ANY (ARRAY['admin','admin_master','admin_editor','admin_viewer']))
  );

-- process_feedback
DROP POLICY "Users can create their own feedback" ON public.process_feedback;
CREATE POLICY "Users can create their own feedback" ON public.process_feedback
  FOR INSERT WITH CHECK (organization_id = current_user_org_id() AND auth.uid() = user_id);

DROP POLICY "Users can view their own feedback" ON public.process_feedback;
CREATE POLICY "Users can view their own feedback" ON public.process_feedback
  FOR SELECT USING (organization_id = current_user_org_id() AND auth.uid() = user_id);

-- process_counter
DROP POLICY "Admins can view process counter" ON public.process_counter;
CREATE POLICY "Admins can view process counter" ON public.process_counter
  FOR SELECT USING (
    organization_id = current_user_org_id()
    AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- cms_contents (mantém leitura pública deliberadamente; escreve escopado)
DROP POLICY "Only admins can manage CMS content" ON public.cms_contents;
CREATE POLICY "Only admins can manage CMS content" ON public.cms_contents
  FOR ALL USING (
    organization_id = current_user_org_id()
    AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Numeração de processo é bookkeeping interno (contador), não dado de
-- usuário: roda com privilégio elevado para não depender de uma policy
-- de INSERT em process_counter (que hoje não existe e bloquearia toda
-- criação de processo sob RLS).
ALTER FUNCTION public.generate_process_number(uuid) SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.set_process_number() SECURITY DEFINER SET search_path = public;
