-- Multi-tenancy foundation (Fase A do plano de desenvolvimento).
-- Introduz organizations como tenant explícito, com Ingrid Peleteiro
-- como escritório-piloto, e escopa todas as tabelas "por escritório".

-- 1. Tabela organizations
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  primary_color text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamp NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

INSERT INTO public.organizations (name, slug, status)
VALUES ('Ingrid Peleteiro Advocacia', 'ingrid-peleteiro', 'active');

-- 2. organization_id nas tabelas com dados existentes (backfill p/ Ingrid)
ALTER TABLE public.profiles ADD COLUMN organization_id uuid;
UPDATE public.profiles SET organization_id = (SELECT id FROM public.organizations WHERE slug = 'ingrid-peleteiro');
ALTER TABLE public.profiles ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

ALTER TABLE public.process_types ADD COLUMN organization_id uuid;
UPDATE public.process_types SET organization_id = (SELECT id FROM public.organizations WHERE slug = 'ingrid-peleteiro');
ALTER TABLE public.process_types ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE public.process_types ADD CONSTRAINT process_types_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

-- 3. organization_id nas tabelas vazias (NOT NULL direto, sem backfill)
ALTER TABLE public.processes ADD COLUMN organization_id uuid NOT NULL REFERENCES public.organizations(id);
ALTER TABLE public.process_steps ADD COLUMN organization_id uuid NOT NULL REFERENCES public.organizations(id);
ALTER TABLE public.process_documents ADD COLUMN organization_id uuid NOT NULL REFERENCES public.organizations(id);
ALTER TABLE public.process_messages ADD COLUMN organization_id uuid NOT NULL REFERENCES public.organizations(id);
ALTER TABLE public.notifications ADD COLUMN organization_id uuid NOT NULL REFERENCES public.organizations(id);
ALTER TABLE public.audit_logs ADD COLUMN organization_id uuid NOT NULL REFERENCES public.organizations(id);
ALTER TABLE public.document_audit_logs ADD COLUMN organization_id uuid NOT NULL REFERENCES public.organizations(id);
ALTER TABLE public.process_feedback ADD COLUMN organization_id uuid NOT NULL REFERENCES public.organizations(id);
ALTER TABLE public.process_counter ADD COLUMN organization_id uuid NOT NULL REFERENCES public.organizations(id);
ALTER TABLE public.cms_contents ADD COLUMN organization_id uuid NOT NULL REFERENCES public.organizations(id);

-- 4. Numeração de processo e contador passam a ser únicos POR escritório,
--    não globalmente.
ALTER TABLE public.processes DROP CONSTRAINT processes_process_number_key;
ALTER TABLE public.processes ADD CONSTRAINT processes_org_process_number_key UNIQUE (organization_id, process_number);

ALTER TABLE public.process_counter DROP CONSTRAINT process_counter_year_month_key;
ALTER TABLE public.process_counter ADD CONSTRAINT process_counter_org_year_month_key UNIQUE (organization_id, year_month);

-- 5. generate_process_number passa a receber o org_id e gerar sequência
--    isolada por escritório.
DROP FUNCTION IF EXISTS public.generate_process_number();

CREATE OR REPLACE FUNCTION public.generate_process_number(org_id uuid)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  current_ym TEXT;
  current_counter INTEGER;
  process_number TEXT;
BEGIN
  current_ym := TO_CHAR(NOW(), 'YYMM');

  INSERT INTO public.process_counter (organization_id, year_month, counter)
  VALUES (org_id, current_ym, 1)
  ON CONFLICT (organization_id, year_month)
  DO UPDATE SET
    counter = process_counter.counter + 1,
    updated_at = NOW()
  RETURNING counter INTO current_counter;

  process_number := 'ER-' || current_ym || '-' || LPAD(current_counter::TEXT, 5, '0');

  RETURN process_number;
END;
$function$;

-- 6. Trigger que preenche process_number automaticamente passa a repassar
--    o organization_id do processo sendo inserido.
CREATE OR REPLACE FUNCTION public.set_process_number()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.process_number IS NULL OR NEW.process_number = '' THEN
    NEW.process_number := generate_process_number(NEW.organization_id);
  END IF;
  RETURN NEW;
END;
$function$;

-- 7. handle_new_user passa a gravar organization_id. Por padrão (piloto),
--    novos usuários entram no escritório da Ingrid, a menos que o cadastro
--    informe um organization_id explícito via metadata (fluxo de convite).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  default_org_id uuid;
BEGIN
  SELECT id INTO default_org_id FROM public.organizations WHERE slug = 'ingrid-peleteiro' LIMIT 1;

  INSERT INTO public.profiles (id, organization_id, name, email, role, cpf, phone)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'organization_id')::uuid, default_org_id),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'cliente'),
    NEW.raw_user_meta_data->>'cpf',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$function$;
