# e-regulariza - Plataforma de Regularização Imobiliária Digital

## Overview

Esta é uma plataforma digital para regularização imobiliária, originalmente desenvolvida no Lovable e migrada para o Replit. A aplicação permite gerenciamento de processos de regularização, documentos, notificações, e inclui dashboards para administradores e clientes.

## Arquitetura

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Express.js com rotas API
- **Banco de Dados**: PostgreSQL (Neon) com Drizzle ORM
- **Autenticação**: Supabase Auth (requer configuração)

## Estrutura de Pastas

```
├── client/              # Código do frontend React
│   ├── src/
│   │   ├── components/  # Componentes React reutilizáveis
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # Serviços de API
│   │   └── integrations/supabase/  # Cliente Supabase
├── server/              # Backend Express
│   ├── index.ts         # Ponto de entrada do servidor
│   ├── routes.ts        # Rotas da API
│   └── storage.ts       # Interface de armazenamento
├── shared/              # Código compartilhado
│   └── schema.ts        # Schema do Drizzle para o banco de dados
└── supabase/            # Supabase Edge Functions (original do Lovable)
    └── functions/       # Funções serverless para integrações
```

## Configuração Necessária

### Variáveis de Ambiente para Supabase

Para funcionalidade completa de autenticação, configure as seguintes variáveis:

- `VITE_SUPABASE_URL` - URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY` - Chave anônima do Supabase

A aplicação funciona sem Supabase, mas as funcionalidades de login/registro não funcionarão.

### Banco de Dados

O projeto usa PostgreSQL com Drizzle ORM. As tabelas incluem:

- `profiles` - Perfis de usuário
- `processes` - Processos de regularização
- `documents` - Documentos dos processos
- `notifications` - Notificações do sistema
- `audit_logs` - Logs de auditoria
- E outras tabelas de suporte

## Comandos

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run db:push` - Sincroniza o schema do Drizzle com o banco

## Páginas Principais

- `/` - Landing page
- `/login` - Página de login
- `/register` - Página de cadastro
- `/dashboard` - Dashboard do cliente
- `/admin` - Dashboard administrativo
- `/servicos` - Página de serviços
- `/sobre` - Página sobre
- `/contato` - Página de contato

## Notas de Migração

Esta aplicação foi migrada do Lovable para Replit. Algumas considerações:

1. O código foi reorganizado de `src/` para `client/src/`
2. O backend Express foi adicionado para servir a aplicação
3. O schema Drizzle foi criado baseado na estrutura do Supabase original
4. O cliente Supabase foi modificado para lidar graciosamente quando não configurado

## Correções Técnicas Aplicadas (Dezembro 2024)

### Segurança
- Removido JWT hardcoded do IntegrationSettings.tsx - agora usa API local

### Schema e Tipos
- Corrigidos tipos de exportação no shared/schema.ts usando $inferInsert
- Criado arquivo types.ts com interface Database correta para process_counter (year_month, counter)

### Backend
- Adicionada validação Zod manual nos endpoints POST (processes, messages, documents)
- Implementado endpoint /api/integrations/sheets/export funcional

### Limpeza
- Removida dependência wouter (conflito com react-router-dom)
- Removido arquivo duplicado AdminUserManagementPage.tsx
- Atualizado components.json com path CSS correto

## Tabelas do Banco de Dados

- `profiles` - Perfis de usuário
- `process_types` - Tipos de processo
- `processes` - Processos de regularização
- `process_steps` - Etapas dos processos
- `process_documents` - Documentos dos processos
- `process_messages` - Mensagens dos processos
- `notifications` - Notificações do sistema
- `audit_logs` - Logs de auditoria
- `document_audit_logs` - Logs de auditoria de documentos
- `process_feedback` - Feedback dos processos
- `process_counter` - Contador de processos (year_month, counter)
- `cms_contents` - Conteúdos CMS
- `system_settings` - Configurações do sistema

## Data de Migração

Dezembro 2024
