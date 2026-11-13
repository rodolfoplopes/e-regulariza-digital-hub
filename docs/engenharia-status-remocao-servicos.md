# e-regulariza — Engenharia de Status: Remoção de 3 Serviços (OAB/RJ)

> 13/11/2026. Decisão de negócio: para dar continuidade à plataforma sem risco de conflito com a OAB/RJ e sem depender de advogados na operação, saem do portfólio **Usucapião (e Usucapião Extrajudicial)**, **Adjudicação Compulsória Extrajudicial** e **Inventário Extrajudicial** — os três eram tratados até aqui como serviços principais.

---

## 1. Status da infraestrutura (bloqueio atual)

O projeto Supabase (`ntnqgfrspuafnlctkrfk`) está **pausado** de novo — mesmo comportamento de antes, free tier pausa por inatividade (passaram ~3 meses desde a última sessão de trabalho). Não dei conta de consultar o banco ao vivo pra confirmar dados reais (processos existentes, usuários). Precisa reativar no [dashboard do Supabase](https://supabase.com/dashboard/project/ntnqgfrspuafnlctkrfk) antes de qualquer execução técnica.

**Onde o Fase B parou** (sem mudanças desde então, confirmado pelo git log — último commit `b1265cf`):
- Processo → etapas → documentos → notificações: real e funcionando
- Criar cliente pelo admin: continua quebrado, bloqueado esperando a `service_role key` do Supabase (nunca foi fornecida)
- `docs/status-fase-a-b.md` existe no repo mas nunca foi commitado

---

## 2. Mapeamento de impacto da remoção

A varredura no código achou um problema maior do que a simples remoção de 3 linhas: **o conteúdo de marketing é muito mais amplo do que o produto que existe de verdade.**

### 2.1. Banco de dados (`process_types`)
4 tipos cadastrados hoje: **Usucapião**, **Adjudicação**, **Inventário**, **Retificação de Área**. Removendo os 3 primeiros, sobra só **Retificação de Área** como serviço com fluxo de processo real (etapas, documentos, acompanhamento) na plataforma.

⚠️ Não consegui checar se existem **processos reais já criados** com esses tipos (banco pausado) — isso muda a estratégia de remoção (apagar o tipo vs. desativar mantendo histórico).

### 2.2. Conteúdo público (`/` e `/servicos`) — maior superfície de risco

Achado chave: existem **três listas de serviço diferentes e independentes** no frontend, desalinhadas entre si e com o banco:

| Onde | O que lista | Usucapião | Adjudicação | Inventário |
|---|---|---|---|---|
| `components/home/Services.tsx` (cards da home) | 6 serviços | ✅ card dedicado | ✅ card dedicado | não aparece |
| `pages/ServicesPage.tsx` (`/servicos`) | 15 cards **+ 1 banner de destaque** | ⚠️ só como banner hero (não é card da lista) | ✅ card dedicado | não aparece |
| `process_types` (banco) | 4 tipos | ✅ | ✅ | ✅ |

Ou seja: **Inventário Extrajudicial já não tem nenhum card de venda na home nem em `/servicos`** — só sobrevive em rodapé, FAQ e dados mockados (ver 2.3). Usucapião, por outro lado, é hoje o **destaque principal da página de serviços** (banner dedicado + link de WhatsApp pré-preenchido especificamente pra ele) — é a peça de maior visibilidade a remover.

Também acendeu um alerta à parte, sem relação direta com a remoção: `/servicos` promete **15 serviços**, dos quais só 1 (Retificação) tem qualquer processo real por trás no produto. Isso já era uma lacuna antes da remoção; fica mais exposta agora que o catálogo encolhe pra praticamente um serviço só com entrega de verdade na plataforma.

### 2.3. Arquivo por arquivo

| Arquivo | O que precisa mudar |
|---|---|
| `pages/ServicesPage.tsx` | Remover o banner-destaque de Usucapião (headline, imagem `familia-usucapiao.jpg`, link de WhatsApp dedicado) e o card de Adjudicação Compulsória |
| `components/home/Services.tsx` | Remover os cards "Usucapião Extrajudicial" e "Adjudicação Compulsória" (sobram 4 dos 6) |
| `components/home/FAQ.tsx` | Remover ~4 perguntas inteiramente sobre usucapião (o que é, por que fazer, imóveis não passíveis, tipos existentes) |
| `components/faq/FAQSearch.tsx` | Remover 'Usucapião', 'Inventário', 'Adjudicação' das categorias de busca |
| `components/layout/Footer.tsx` | Remover link "Usucapião Extrajudicial" |
| `components/admin/footer/useFooterState.ts` | Remover links "Usucapião" e "Inventário Extrajudicial" (configuração do rodapé editável pelo admin) |
| `components/seo/SEOHead.tsx` | Tirar "usucapião" e "inventário extrajudicial" das keywords de SEO do site |
| `pages/PolicyPage.tsx` | Dois trechos genéricos citando "usucapião" como exemplo de serviço — ajustar texto |
| `components/dashboard/EnhancedDashboardStats.tsx` | Os cards de contagem "Usucapião" e "Inventário" no dashboard do cliente ficam sem sentido (nenhum processo novo desse tipo) |
| `components/process/ProcessNotifications.tsx`, `pages/Notifications.tsx` | Texto mock de notificação cita "processo de usucapião" como exemplo |
| `admin/EmailSender.tsx`, `admin/ReportExport.tsx`, `admin/EnhancedReportExport.tsx` | Dados **mockados** (placeholders de demonstração, não ligados ao banco) citando os 3 serviços — baixa prioridade, mas inconsistente se alguém usar esses mocks como referência |
| `docs/plano-desenvolvimento.md` | Documento de planejamento já cita Usucapião como exemplo recorrente — vale uma nota de atualização, não reescrita completa (é histórico) |

---

## 3. Plano de ação recomendado

**Fase 0 — Decisão de posicionamento (precisa de você antes de eu mexer em copy):**
Com Usucapião, Adjudicação e Inventário fora, o que a `/servicos` deveria comunicar como carro-chefe? Opções que vejo:
- **Retificação de Área vira o serviço principal**, os outros 12 itens da lista de 15 (incorporação, due diligence, Reurb, contratos, escrituras, certidões, ITBI/ITCMD, georreferenciamento, etc.) continuam como estão, já que nenhum deles é um "ato privativo de advocacia" da mesma forma que os 3 removidos
- Revisão mais ampla do catálogo inteiro de 15 serviços à luz do mesmo critério OAB/RJ (alguns desses também podem ter o mesmo problema — due diligence e georreferenciamento provavelmente não, mas vale confirmar com critério jurídico, não só o meu palpite)

**Fase 1 — Remoção técnica** (depois da decisão acima, e com o Supabase reativado):
1. Decidir destino dos tipos no banco: `DELETE` em `process_types` (se não há processos reais associados) ou marcar como inativo/arquivado (se há histórico a preservar)
2. Aplicar as remoções de conteúdo listadas na tabela da seção 2.3
3. Atualizar `EnhancedDashboardStats.tsx` pra não exibir contadores de tipos descontinuados

**Fase 2 — Validação jurídica** (fora do meu escopo, mas acho que vale registrar): como a motivação é compliance com a OAB/RJ, provavelmente vale uma checagem com quem orienta juridicamente o projeto — pra confirmar se mais algum dos 15 serviços remanescentes também é "ato privativo de advocacia" e deveria sair junto.

---

## 4. Perguntas em aberto

1. Quer que eu já reative o Supabase (preciso que você clique em "Resume project" no dashboard) e confirme se existem processos reais de Usucapião/Adjudicação/Inventário antes de decidir apagar vs. arquivar os tipos?
2. Qual o posicionamento novo pra `/servicos` — Retificação de Área como destaque único, ou prefere que eu aguarde uma direção de copy maior?
3. Sigo e já aplico as remoções de conteúdo listadas (banners, cards, FAQ, SEO, rodapé), ou isso fica pra uma etapa separada depois da Fase 0?
