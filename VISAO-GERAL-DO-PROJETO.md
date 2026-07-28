# e-regulariza — Visão Geral do Projeto

> Documento gerado em 28/07/2026 após recuperação do projeto (zip do GitHub) e primeira auditoria funcional. Serve como ponto de partida para decisões estratégicas e para retomar o desenvolvimento.

## 1. O que é

A e-regulariza é uma plataforma digital que conecta **clientes/proprietários** a **advogados** que prestam serviços de **regularização imobiliária** (ex: usucapião extrajudicial), oferecendo:

- Um ambiente de **gestão de processos** para o advogado organizar o trabalho.
- **Transparência para o cliente**, que acompanha em tempo real o andamento do seu processo — etapas concluídas, documentos pendentes, prazos.
- Cada tipo de processo (ex: usucapião extrajudicial) tem uma **metodologia própria com etapas sequenciais** (reunião de documentação, planta baixa, confrontantes, cartório, custas, etc.), modeladas no sistema.

## 2. Contexto e histórico

- Projeto **originalmente construído no Lovable**. Em algum momento, uma versão que "estava boa" foi perdida/sobrescrita por iterações da IA do Lovable — daí a necessidade de resgate.
- Posteriormente **migrado para o Replit** (dezembro de 2024), que reorganizou `src/` → `client/src/`, adicionou um backend Express, e aplicou algumas correções técnicas (removeu JWT hardcoded, corrigiu tipos do schema, removeu arquivo duplicado).
- **Pivot de negócio**: por motivos legais, a oferta do serviço jurídico em si foi absorvida pelo novo site da **Ingrid Peleteiro** (advogada). A decisão tomada nesta sessão foi que o e-regulariza **mantém landing page + plataforma** — ou seja, segue existindo como produto/ferramenta (possível caminho SaaS B2B para outros advogados), não mais como o canal direto de captação do serviço jurídico da Ingrid.
- Domínio de produção: `www.e-regulariza.com.br` (arquivo `CNAME` no repo).
- Repositório: `https://github.com/rodolfoplopes/e-regulariza-digital-hub`.

## 3. Modelo de dados (o motor do produto)

13 tabelas no Postgres (Supabase), via Drizzle ORM (`shared/schema.ts`):

| Tabela | Papel |
|---|---|
| `profiles` | Usuários (advogados/admins e clientes), com `role` |
| `process_types` | Tipos de processo (ex: Usucapião) e duração estimada |
| `processes` | Processos de um cliente, com status e progresso (%) |
| `process_steps` | Etapas ordenadas de cada processo, com status e prazo |
| `process_documents` | Documentos anexados, com fluxo de revisão (aprovado/pendente + quem revisou) |
| `process_messages` | Chat entre cliente e equipe, por processo |
| `notifications` | Notificações direcionadas ao usuário |
| `audit_logs` / `document_audit_logs` | Trilha de auditoria de ações administrativas e de documentos |
| `process_feedback` | Avaliação do cliente sobre o processo |
| `process_counter` | Numeração sequencial de processos por mês |
| `cms_contents` | Conteúdo institucional editável (CMS simples) |
| `system_settings` | Configurações gerais do sistema |

Esse modelo já reflete bem a visão descrita: **processo → etapas → documentos → notificações**, com papel duplo (advogado/admin organiza, cliente acompanha).

## 4. Papéis e permissões

- `admin_master`, `admin`, `admin_editor`, `admin_viewer` — variações de acesso administrativo.
- `cliente` — acesso apenas aos próprios processos.
- Rotas públicas: `/`, `/login`, `/register`, `/politica-privacidade`, `/termos-uso`, `/servicos`, `/sobre`, `/contato`.
- Rotas de cliente: `/dashboard`, `/processo/:id`, `/configuracoes`.
- Rotas de admin: `/admin/*`.

## 5. Mapa de páginas existentes (18)

Landing, Login, Register, Dashboard (cliente), AdminDashboard, AdminUserManagement, ProcessCreate, ProcessDetail, EditProcess, Messages, Notifications, UserProfile, UserSettings, LogoManagementPage (CMS), AboutPage, ServicesPage, ContactPage, PolicyPage, NotFound.

## 6. Stack técnica

- **Frontend**: React 18 + TypeScript + Vite, Tailwind + shadcn/ui, TanStack Query, React Router, Recharts.
- **Backend**: Express (rotas em `server/routes.ts`) — cobre principalmente integrações (Twilio, HubSpot, export para Google Sheets); a maior parte do app fala **direto com o Supabase** pelo client-side.
- **Banco de dados**: PostgreSQL hospedado no **Supabase** (projeto `ntnqgfrspuafnlctkrfk`, região São Paulo). Backend usa driver `pg` padrão via connection pooler (session pooler, compatível com IPv4).
- **Autenticação**: Supabase Auth (JWT), com `profiles` sincronizado via trigger `handle_new_user` no Postgres.
- **Ambiente local**: `.env` com `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `DATABASE_URL`. Roda com `npm run dev`, porta 5000.

## 7. Auditoria de hoje — o que é real vs. o que era placeholder

| Item | Estado antes | Estado agora |
|---|---|---|
| Landing page | — | ✅ Funciona |
| Login | Já usava Supabase Auth real, com rate-limit de tentativas e suporte a reCAPTCHA | ✅ Confirmado funcionando |
| **Registro** | 🔴 **100% mockado** — `Math.random()` simulava sucesso/erro, nunca criava usuário real | ✅ Corrigido: conectado ao `useSupabaseAuth().register()`, que já existia mas não era usado |
| Trigger `handle_new_user` (Postgres) | 🔴 Só gravava `id, name, email, role` — CPF e telefone eram descartados silenciosamente | ✅ Corrigido via migration, agora grava `cpf` e `phone` |
| Fluxo pós-registro | 🔴 Redirecionava para `/dashboard` mesmo sem sessão válida (quando confirmação de e-mail é obrigatória), gerando "Olá, undefined!" | ✅ Agora detecta ausência de sessão e mostra tela "confirme seu e-mail" |
| Dashboard cliente | — | ✅ Renderiza com dados reais; "Processos por Tipo" já lista **Usucapião** |
| Criação de processo, upload de documento, notificações, dashboard admin, chat, CMS, integrações (Twilio/HubSpot/Sheets) | — | ⏸️ **Ainda não auditados** |

## 8. Pontos de atenção antes de qualquer lançamento

1. **Rate limit de e-mail do Supabase**: o plano usado está limitado a poucos e-mails de confirmação por hora (limite padrão do free tier). Antes de qualquer teste real com usuários, **configurar um provedor SMTP próprio** (Resend, SendGrid, etc.) nas configurações de Auth do Supabase.
2. **Dados de teste no banco de produção**: existem hoje 2 registros de teste em `profiles`/`auth.users` (`lopes.rod+teste@gmail.com`, `+teste2@gmail.com`) criados durante esta auditoria. Vale limpar antes de considerar a base "limpa" para lançamento.
3. **Projeto Supabase pausado por padrão**: no plano free, o projeto pausa por inatividade — é preciso reativar manualmente (`Resume project`) sempre que ficar muito tempo sem uso, ou fazer upgrade para Pro.
4. **Screenshots soltos** em `attached_assets/` (28 arquivos) não commitados — parecem capturas de tela de desenvolvimento, não usadas pelo código. Candidatos a limpeza.

## 9. Perguntas estratégicas em aberto

Estas são decisões de negócio, não técnicas — ficam registradas para reflexão:

- **Posicionamento**: com o serviço jurídico migrado para o site da Ingrid, o e-regulariza vira (a) uma ferramenta interna que a Ingrid usa para atender os próprios clientes, (b) um produto SaaS para **outros** advogados/escritórios de regularização imobiliária usarem, ou (c) ambos?
- **Monetização**: se vira SaaS, qual o modelo — assinatura por advogado, por processo, comissão?
- **Landing page atual**: o conteúdo hoje (`Regularização imobiliária simplificada e transparente`, CTA "Fale Conosco") ainda fala com o público certo dado o pivot, ou precisa ser reescrita para vender a *ferramenta* em vez do *serviço*?
- **Relação com o site da Ingrid**: os dois sites devem se referenciar/linkar? A Ingrid é a primeira "advogada-cliente" da plataforma?

## 10. Próximos passos técnicos sugeridos

1. Configurar SMTP próprio no Supabase (desbloqueia testes reais de cadastro).
2. Auditar o fluxo completo de processo: criar tipo de processo → criar processo para um cliente → cliente vê no dashboard → upload de documento → aprovação → notificação.
3. Testar o dashboard administrativo (gestão de usuários, CMS).
4. Decidir sobre o Express backend: já que a maior parte do app fala direto com Supabase, vale avaliar se as rotas em `server/routes.ts` (Twilio, HubSpot, Sheets) ainda são necessárias ou se podem virar Supabase Edge Functions (o projeto já tem `supabase/functions/` com implementações parecidas).
5. Limpar dados de teste e screenshots soltos antes de qualquer demo externa.
