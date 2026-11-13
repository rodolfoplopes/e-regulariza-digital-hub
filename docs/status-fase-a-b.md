# e-regulariza — Status do Plano de Desenvolvimento

> Atualizado em 04/08/2026. Referência: `docs/plano-desenvolvimento.md`. Cobre a execução das Fases A e B. Formato pensado pra virar tarefas no ClickUp (lista `Automação e Plataforma`, espaço `:) e-regulariza`).

---

## ✅ Fase A — Fundação (multi-tenant + segurança) — CONCLUÍDA

- [x] SMTP próprio configurado no Supabase (Resend, domínio `creation-pro.com` verificado; sender `notifications@creation-pro.com`) — testado com cadastro real, e-mail confirmado recebido
- [x] Tabela `organizations` criada; Ingrid Peleteiro Advocacia cadastrada como tenant piloto
- [x] `organization_id` adicionado às 12 tabelas por escritório (`profiles`, `processes`, `process_steps`, `process_documents`, `process_messages`, `notifications`, `audit_logs`, `document_audit_logs`, `process_feedback`, `process_counter`, `cms_contents`, `process_types`)
- [x] RLS multi-tenant implementado em todas as tabelas acima e **testado** (transação simulando um segundo escritório, com rollback — zero vazamento de leitura ou escrita entre organizações)
- [x] Trigger `handle_new_user` atualizado pra gravar `organization_id`, `cpf` e `phone`
- [x] Numeração de processo (`ER-YYMM-00001`) corrigida pra ser sequencial por escritório, não global
- [x] Dados de teste removidos da produção
- [x] Decisão registrada: `process_types` e `cms_contents` mantêm leitura pública (landing ainda não tem roteamento multi-tenant — fora de escopo desta fase)

---

## 🔄 Fase B — Auditar e fechar o fluxo central — QUASE CONCLUÍDA

Fluxo: **criar processo → etapas → documentos → aprovação → notificação**.

### Concluído
- [x] Registro de usuário corrigido — página era 100% mock (`Math.random()`), nunca criava conta real; conectada ao Supabase Auth de verdade
- [x] Trigger `handle_new_user` corrigido pra não descartar CPF/telefone
- [x] Fluxo pós-registro corrigido (detecta quando falta confirmar e-mail em vez de redirecionar pra um dashboard sem sessão)
- [x] **Bug crítico de autenticação corrigido**: deadlock real no login — `onAuthStateChange` chamava `getUser()` sincronamente enquanto o Supabase ainda segurava a trava interna de sessão. Travava login de qualquer usuário real, não só em teste
- [x] Criação de processo corrigida (`organization_id` não estava sendo enviado — bloquearia toda criação após a Fase A)
- [x] Criação de etapa de processo corrigida (mesmo tipo de bug)
- [x] Sistema de notificações confirmado real (não mockado) e corrigido (mesmo tipo de bug)
- [x] Log de auditoria (`audit_logs`) corrigido (mesmo tipo de bug)
- [x] **Gestão de documentos implementada de verdade** — antes era 100% mock (upload não persistia, some ao recarregar a página). Agora: bucket real no Supabase Storage, upload, reenvio, aprovação/rejeição e exclusão gravam no banco de verdade. Testado ponta a ponta (upload → aparece na tela → aprovar → excluir, sem resíduo)
- [x] Trigger de auditoria de documentos (`create_document_audit_log`) corrigido (mesmo tipo de bug, mas no banco em vez do frontend)
- [x] 6 links de navegação quebrados corrigidos (rota `/admin/...` incorreta em vários componentes — "Novo Processo", "Editar Processo")
- [x] Passada de design (referência Stripe): tokens de tipografia/radius/sombra atualizados, cor de marca alinhada nos componentes base (Button/Progress/foco), 6 colisões de layout corrigidas, cards duplicados de informação do processo unificados em um só bloco, classe de gradiente quebrada corrigida (barra de progresso estava invisível)

### Pendente
- [ ] **Criar cliente pelo admin está quebrado.** `clientService.createClient` insere direto em `profiles` com UUID aleatório, mas `profiles.id` referencia `auth.users.id` — falha sempre por violação de chave estrangeira. Precisa de endpoint no servidor usando a Admin API do Supabase (chave `service_role`, nunca pode rodar no cliente) ou um fluxo de convite por e-mail. **Bloqueado**: aguardando a `service_role key` do Supabase pra implementar.
- [ ] Endpoints do Express (`server/routes.ts`) não têm nenhuma verificação de autenticação — achado durante a investigação do item acima. Precisa de revisão antes de adicionar novas rotas administrativas ali.

---

## ⏳ Fase C — Portal e papéis — NÃO INICIADA

- [ ] Personalização visual do portal por organização (logo e cor da Ingrid)
- [ ] Revisar papéis (`org_admin`, `admin_editor`, `admin_viewer`, `cliente`) e validar acessos sob o modelo multi-tenant
- [ ] Auditar dashboard admin, gestão de usuários e CMS sob o novo modelo

## ⏳ Fase D — Piloto real com a Ingrid — NÃO INICIADA

- [ ] Migrar/cadastrar os processos reais da Ingrid
- [ ] Ingrid operando de verdade; clientes dela acompanhando pelo portal
- [ ] Coletar feedback de uso

## ⏳ Fase E — Preparação para mercado — FORA DE ESCOPO (pós-validação)

- [ ] Onboarding self-service de novos escritórios
- [ ] Billing/assinatura
- [ ] Reescrita da landing pra vender a ferramenta (não o serviço jurídico)
- [ ] Avaliar integrações jurídicas (Jusbrasil, cartórios)

---

## Notas técnicas pro time

- **Padrão de bug mais comum encontrado**: qualquer `.insert()` em tabela com `organization_id` (client-side ou em trigger de banco) escrito antes da Fase A precisa ser auditado manualmente — o TypeScript do projeto está com `strict: false`, então não pega esses casos sozinho.
- Todas as correções estão commitadas e no GitHub (`rodolfoplopes/e-regulariza-digital-hub`, branch `main`, até o commit `b1265cf`).
