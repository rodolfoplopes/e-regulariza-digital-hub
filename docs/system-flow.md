
# Fluxograma do Sistema e-regulariza

## 🔄 Fluxo Principal do Usuário

### Cliente (Role: cliente)
```
Login → Dashboard → Visualizar Processo → Interagir (Chat/Documentos) → Notificações
```

### Admin (Role: admin)
```
Login → Admin Dashboard → Gerenciar Processos/Clientes → CMS → Relatórios → Configurações
```

## 📊 Arquitetura do Sistema

```
Frontend (React/TypeScript)
    ↓
Supabase Client
    ↓
Supabase Backend
    ├── Auth (Autenticação)
    ├── Database (PostgreSQL)
    ├── Storage (Arquivos)
    └── Edge Functions (Lógica customizada)
```

## 🔐 Fluxo de Autenticação

1. **Login**
   - Usuário informa email/senha
   - Supabase Auth valida credenciais
   - Busca perfil na tabela `profiles`
   - Redireciona baseado no role (admin → `/admin`, cliente → `/dashboard`)

2. **Proteção de Rotas**
   - `useSupabaseAuth` hook verifica autenticação
   - `usePermissions` hook valida permissões
   - Redirecionamento automático se não autorizado

## 📝 Fluxo de Processos

### Criação de Processo (Admin)
```
Admin Dashboard → Novo Processo → Selecionar Cliente → Definir Tipo → Criar Etapas → Salvar
```

### Acompanhamento (Cliente)
```
Dashboard → Meu Processo → Ver Timeline → Chat → Documentos → Notificações
```

## 🗂️ Fluxo de Documentos

1. **Upload**
   - Cliente/Admin faz upload via `DocumentManager`
   - Arquivo é validado (tipo, tamanho)
   - Salvo na tabela `process_documents`
   - Notificação criada automaticamente

2. **Revisão (Admin)**
   - Admin visualiza documentos pendentes
   - Aprova ou rejeita com comentários
   - Status atualizado na base de dados
   - Cliente é notificado da decisão

## 💬 Fluxo de Comunicação

### Chat em Tempo Real
```
Cliente/Admin → Escreve mensagem → Salva em process_messages → Notificação automática → Destinatário recebe
```

### Sistema de Notificações
```
Evento no Sistema → Criar notificação → Exibir badge → Marcar como lida
```

## 📋 Estados dos Processos

- **pendente**: Processo criado, aguardando documentação
- **em_andamento**: Documentos recebidos, em análise
- **concluido**: Processo finalizado com sucesso
- **rejeitado**: Processo rejeitado por problemas nos documentos

## 🔄 Ciclo de Vida Completo

1. **Início**: Admin cria processo para cliente
2. **Documentação**: Cliente upload documentos necessários
3. **Análise**: Equipe técnica revisa documentos
4. **Comunicação**: Troca de mensagens via chat
5. **Finalização**: Processo concluído ou rejeitado
6. **Histórico**: Registro completo mantido no sistema
