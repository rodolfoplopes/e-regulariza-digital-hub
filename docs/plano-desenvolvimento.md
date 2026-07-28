# e-regulariza — Plano de Desenvolvimento (Spin-off → SaaS Fechado)

> Documento para o desenvolvedor. Define a direção técnica da plataforma a partir da decisão estratégica de julho/2026: construir com **arquitetura de SaaS fechado multi-escritório (cenário 2)**, tendo a advogada **Ingrid Peleteiro como primeiro escritório-piloto (spin-off)**.
>
> Princípio-guia do produto: **"processo visível ao usuário, organizado para o advogado"**.

---

## 0. Contexto para quem for desenvolver

A e-regulariza é uma plataforma de gestão de processos de regularização imobiliária (ex: usucapião extrajudicial) com **portal do cliente**: o escritório organiza o trabalho, e o cliente acompanha o andamento em tempo real (etapas, documentos pendentes, prazos, mensagens).

O produto já existe e funciona parcialmente (React + Supabase). Ele foi originalmente construído para **um único escritório**. A mudança central deste plano é evoluí-lo para suportar **múltiplos escritórios isolados (multi-tenant)**, mesmo que no início apenas um (o da Ingrid) esteja em uso.

**Por que fazer isso agora e não depois:** adicionar multi-tenancy a uma base com dados de produção já em uso é caro e arriscado (migração de dados vivos, risco de vazamento entre tenants). É muito mais barato acertar a estrutura enquanto a base ainda está praticamente vazia. Fazemos a **estrutura** de multi-tenant agora; deixamos **billing, onboarding self-service e marketplace** para depois da validação de mercado.

**O que NÃO construir nesta fase (importante):**
- Cobrança / assinatura / billing automatizado.
- Cadastro self-service de novos escritórios (onboarding será manual, feito por nós, no piloto).
- Qualquer funcionalidade de marketplace (conectar cliente a advogado). Não é o modelo desta fase.
- Integrações externas novas (Jusbrasil, cartórios). Ficam registradas como visão futura na seção 9, não como escopo.

---

## 1. Estado atual (baseline)

Resumo do que a auditoria de 28/07/2026 encontrou. O desenvolvedor deve confirmar cada ponto antes de construir em cima.

**Stack:**
- Frontend: React 18 + TypeScript + Vite, Tailwind + shadcn/ui, TanStack Query, React Router, Recharts.
- Backend: Express (`server/routes.ts`) cobrindo integrações (Twilio, HubSpot, export Google Sheets). A maior parte do app fala **direto com o Supabase** pelo client-side.
- Banco: PostgreSQL no Supabase (projeto `ntnqgfrspuafnlctkrfk`, região São Paulo), Drizzle ORM (`shared/schema.ts`).
- Auth: Supabase Auth (JWT), com `profiles` sincronizado via trigger `handle_new_user`.

**Modelo de dados atual (13 tabelas):** `profiles`, `process_types`, `processes`, `process_steps`, `process_documents`, `process_messages`, `notifications`, `audit_logs`, `document_audit_logs`, `process_feedback`, `process_counter`, `cms_contents`, `system_settings`.

**Já funcional:** landing page, login (Supabase Auth real, com rate-limit e reCAPTCHA), registro (corrigido para criar usuário real), dashboard do cliente com dados reais.

**Ainda não auditado (tratar como não confiável até verificar):** criação de processo, upload de documento, notificações, dashboard admin, chat, CMS, integrações.

**Pendências operacionais herdadas:** SMTP próprio não configurado (rate limit de e-mail do Supabase); 2 registros de teste em produção; projeto Supabase pausa por inatividade (free tier).

---

## 2. A mudança central: multi-tenancy (`organizations`)

Hoje o sistema assume implicitamente um único escritório. Vamos tornar o escritório uma entidade explícita.

### 2.1. Nova tabela `organizations`

Representa um escritório/tenant. No piloto haverá **uma linha**: a Ingrid.

Campos sugeridos (o desenvolvedor ajusta nomes/tipos ao padrão do schema atual):
- `id` (uuid, pk)
- `name` (nome do escritório, ex: "Ingrid Peleteiro Advocacia")
- `slug` (identificador para URL, ex: `ingrid-peleteiro`)
- `logo_url`, `primary_color` (personalização visual do portal — o cliente da Ingrid vê a marca dela)
- `status` (`active` / `suspended`)
- `created_at`

### 2.2. Adicionar `organization_id` às tabelas que são "por escritório"

Recebem `organization_id` (fk → `organizations`), **not null**:
`profiles`, `process_types`, `processes`, `process_steps`, `process_documents`, `process_messages`, `notifications`, `audit_logs`, `document_audit_logs`, `process_feedback`, `process_counter`, `cms_contents`.

Permanecem globais (sem `organization_id`): `system_settings` (config da plataforma inteira).

**Atenção com `process_counter`:** a numeração sequencial de processos deve passar a ser **por escritório** (cada escritório tem sua própria sequência mensal), não global. Isso muda a lógica de geração do número.

### 2.3. Isolamento de dados via RLS — item crítico de segurança

Como boa parte do app fala **direto com o Supabase pelo client-side**, o isolamento entre escritórios **não pode** depender do código React. Tem que ser garantido no banco, via **Row Level Security (RLS)** do Postgres/Supabase.

Regra geral a implementar em todas as tabelas com `organization_id`:
- um usuário só enxerga/edita linhas cujo `organization_id` seja igual ao da sua própria organização;
- exceção controlada para um papel de super-admin da plataforma (nós), que enxerga tudo — ver seção 3.

Isto é o que impede o cliente (ou advogado) de um escritório de ver dados de outro. **É o requisito de segurança número um desta fase.** Nenhuma tela nova deve ir para produção antes de o RLS estar ativo e testado nas tabelas que ela toca.

### 2.4. Trigger `handle_new_user`

Hoje o trigger grava `id, name, email, role, cpf, phone` no `profiles`. Precisa passar a gravar também o `organization_id` correto do usuário recém-criado. Definir como o `organization_id` chega no momento do cadastro (ex: via metadata do convite / link de registro do escritório).

---

## 3. Papéis e permissões (revisados para multi-tenant)

Hoje os papéis (`admin_master`, `admin`, `admin_editor`, `admin_viewer`, `cliente`) existem sem noção de escritório. Passam a operar **dentro** de uma organização, com uma camada nova acima.

Dois níveis:

**Nível plataforma (nós, donos da e-regulariza):**
- `platform_admin` — enxerga e administra todos os escritórios. Cria organizações, faz o onboarding manual, dá suporte. É o único papel que cruza tenants.

**Nível escritório (dentro de uma organização):**
- `org_admin` — o advogado dono do escritório (a Ingrid). Gerencia sua equipe, processos, clientes, CMS do seu portal.
- papéis administrativos internos (equivalentes aos atuais `admin_editor`, `admin_viewer`) — membros da equipe do escritório com acesso reduzido.
- `cliente` — cliente final, vê apenas os próprios processos, dentro daquele escritório.

O desenvolvedor deve mapear os papéis atuais para esse novo desenho sem quebrar os acessos existentes.

---

## 4. Impacto na aplicação (frontend + rotas)

### 4.1. Contexto de organização

Toda a aplicação autenticada passa a operar sob um "escritório atual". Para o cliente e para o advogado, isso é implícito (deriva do seu `profile.organization_id`). Para o `platform_admin`, pode ser explícito (ele escolhe qual escritório está administrando).

Consultas do client-side (TanStack Query) devem sempre resolver dados no escopo da organização do usuário — reforçado pelo RLS no banco como rede de segurança.

### 4.2. Personalização do portal (white-label leve)

O portal do cliente deve exibir a marca do escritório (logo, cor) vinda de `organizations`. No piloto: a marca da Ingrid. Isso já deixa a arquitetura pronta para o cenário 2 (cada escritório com sua identidade) sem construir nada específico de um cliente só.

### 4.3. Landing page

Decisão registrada: a landing continua existindo, mas seu papel muda. Ela deixa de vender o *serviço jurídico* (que migrou para o site da Ingrid) e passa a apresentar a *ferramenta*.

**Nesta fase (spin-off/piloto), não reescrever a landing ainda.** A reescrita definitiva depende do resultado da validação de mercado (saber para quem vender). Por ora: ajustar o conteúdo atual para não conflitar com o site da Ingrid (evitar captação direta do serviço jurídico) e manter um CTA de contato. A landing de venda do SaaS é trabalho da fase seguinte.

---

## 5. Comunicação e notificações

O eixo de valor do produto ("transparência para o cliente") depende de comunicação funcionando de verdade. Prioridades:

1. **SMTP próprio no Supabase** (Resend, SendGrid ou similar). É pré-requisito de tudo que envolve e-mail (confirmação de cadastro, convites, avisos de andamento). Sem isso, testes reais de cadastro esbarram no rate limit do free tier. **Fazer isso primeiro.**
2. **Notificações in-app** (`notifications`): auditar e garantir que disparam nos eventos certos (nova etapa concluída, documento aprovado/rejeitado, nova mensagem).
3. **Notificação por e-mail** desses mesmos eventos ao cliente — é o que faz o cliente parar de ligar perguntando do processo.
4. **Twilio (WhatsApp/SMS):** já há integração no `server/routes.ts`. Avaliar se entra no piloto ou fica para depois. Não é bloqueante.

---

## 6. Roadmap de execução (ordem sugerida)

Sequência pensada para nunca colocar tela nova em produção sem isolamento de dados, e para destravar o uso real pela Ingrid o quanto antes.

**Fase A — Fundação (multi-tenant + segurança)**
1. Configurar SMTP próprio no Supabase.
2. Criar tabela `organizations`; criar a linha da Ingrid.
3. Adicionar `organization_id` às tabelas da seção 2.2 (migration).
4. Implementar e **testar** RLS em todas essas tabelas.
5. Atualizar trigger `handle_new_user` para gravar `organization_id`.
6. Ajustar `process_counter` para numeração por escritório.
7. Limpar os 2 registros de teste em produção.

**Fase B — Auditar e fechar o fluxo central**
Auditar de ponta a ponta, já sob multi-tenant, o fluxo que é o coração do produto:
criar tipo de processo → criar processo para um cliente → cliente vê no dashboard → upload de documento → aprovação/rejeição → notificação (in-app + e-mail).
Corrigir o que estiver mockado ou quebrado. Este fluxo funcionando é o que a Ingrid precisa para operar.

**Fase C — Portal e papéis**
1. Personalização visual do portal por organização (marca da Ingrid).
2. Revisar papéis/permissões conforme seção 3; validar acessos.
3. Auditar dashboard admin, gestão de usuários e CMS sob o novo modelo.

**Fase D — Piloto real com a Ingrid**
1. Migrar/cadastrar os processos reais da Ingrid.
2. Ingrid opera de verdade; clientes dela acompanham pelo portal.
3. Coletar feedback de uso (`process_feedback` e conversa direta).

**Fase E — Preparação para mercado (só após sinal de validação)**
Fora do escopo de construção agora; listado para orientar decisões da Fase A-D e não fechar portas. Inclui: onboarding de novos escritórios, billing/assinatura, reescrita da landing de venda, e as integrações da seção 9.

---

## 7. Decisão pendente sobre o backend Express

A maior parte do app fala direto com o Supabase; o Express hoje cobre Twilio/HubSpot/Sheets, e o projeto já tem `supabase/functions/` com implementações parecidas.

**Recomendação:** não refatorar agora (não destrava nada). Registrar como decisão futura: avaliar mover as rotas do Express para Supabase Edge Functions, reduzindo superfície de manutenção. Só encarar isso se/quando houver motivo concreto.

---

## 8. Checklist de "pronto para o piloto"

- [ ] SMTP próprio configurado e enviando.
- [ ] `organizations` criada; Ingrid cadastrada como tenant.
- [ ] `organization_id` em todas as tabelas da seção 2.2.
- [ ] RLS ativo e testado (tentativa de acesso cross-tenant falha).
- [ ] `handle_new_user` grava `organization_id`, `cpf`, `phone`.
- [ ] Numeração de processo por escritório funcionando.
- [ ] Fluxo central (processo → documento → aprovação → notificação) auditado e real.
- [ ] Notificação por e-mail ao cliente nos eventos-chave.
- [ ] Portal exibindo a marca da Ingrid.
- [ ] Dados de teste removidos da produção.
- [ ] Processos reais da Ingrid migrados.

---

## 9. Visão futura (registrada, fora do escopo atual)

Não construir agora. Serve para orientar escolhas e conversas de validação.

- **Integrações jurídicas:** APIs de andamento processual (ex: Jusbrasil) e de cartórios. Seriam o principal fosso competitivo do SaaS fechado (tornam a ferramenta difícil de largar e de copiar), mas são caras/complexas e só se justificam após escritórios pagantes confirmarem demanda. **Antes de qualquer investimento aqui, verificar disponibilidade, termos e custo atuais dessas APIs — informação que muda com frequência.**
- **Onboarding self-service** de novos escritórios.
- **Billing/assinatura** (modelo provável: mensalidade por escritório).
- **Marketplace** (conectar cliente ↔ advogado): outro modelo de negócio, com dinâmica de rede e implicações da OAB sobre captação/publicidade. Não confundir com o SaaS fechado desta fase.

---

## 10. Riscos e pontos de atenção

- **Vazamento entre tenants:** o maior risco técnico. Mitigado por RLS bem testado. Tratar como bloqueante de release.
- **Free tier do Supabase:** projeto pausa por inatividade; rate limit de e-mail. Avaliar upgrade para Pro antes do piloto real com clientes.
- **Relação com o site da Ingrid:** alinhar para os dois não se canibalizarem nem gerarem problema de captação (o serviço jurídico é lá; a ferramenta é aqui).
- **Escopo:** resistir à tentação de construir billing/marketplace/integrações antes da validação. A régua desta fase é: multi-tenant sólido + fluxo central real + Ingrid operando.
