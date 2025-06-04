
# API Reference - e-regulariza

## 🗄️ Serviços Supabase

### ProfileService
**Localização**: `src/services/supabaseService.ts`

#### `getCurrentProfile()`
Obtém o perfil do usuário logado.

```typescript
const profile = await profileService.getCurrentProfile();
```

**Retorna**: `Profile | null`

#### `updateProfile(id, updates)`
Atualiza dados do perfil do usuário.

```typescript
await profileService.updateProfile(userId, {
  name: "Novo Nome",
  phone: "(11) 99999-9999"
});
```

**Parâmetros**:
- `id`: string (UUID)
- `updates`: Partial<Profile>

#### `getClients()`
Lista todos os clientes cadastrados.

```typescript
const clients = await profileService.getClients();
```

**Retorna**: `Profile[]` (apenas usuários com role 'cliente')

### ProcessService

#### `getProcesses(clientId?)`
Lista processos, opcionalmente filtrados por cliente.

```typescript
// Todos os processos (admin)
const allProcesses = await processService.getProcesses();

// Processos de um cliente específico
const clientProcesses = await processService.getProcesses(clientId);
```

**Parâmetros**:
- `clientId`: string | undefined (UUID do cliente)

**Retorna**: `ProcessWithDetails[]`

#### `getProcessById(id)`
Obtém detalhes completos de um processo.

```typescript
const process = await processService.getProcessById(processId);
```

**Parâmetros**:
- `id`: string (UUID)

**Retorna**: `ProcessWithDetails | null`

#### `createProcess(processData)`
Cria um novo processo.

```typescript
await processService.createProcess({
  title: "Regularização Residencial",
  client_id: clientId,
  process_type_id: typeId,
  deadline: "2024-12-31"
});
```

**Parâmetros**:
- `processData`: Objeto com dados do processo

#### `updateProcess(id, updates)`
Atualiza dados de um processo.

```typescript
await processService.updateProcess(processId, {
  status: "em_andamento",
  progress: 50
});
```

### DocumentService

#### `getDocumentsByProcessId(processId)`
Lista documentos de um processo.

```typescript
const documents = await documentService.getDocumentsByProcessId(processId);
```

#### `uploadDocument(documentData)`
Faz upload de um novo documento.

```typescript
await documentService.uploadDocument({
  process_id: processId,
  name: "documento.pdf",
  file_url: fileUrl,
  uploaded_by: userId
});
```

#### `updateDocumentStatus(id, status, reviewedBy?, reviewNotes?)`
Atualiza status de um documento (aprovação/rejeição).

```typescript
await documentService.updateDocumentStatus(
  documentId, 
  "aprovado", 
  adminId, 
  "Documento válido"
);
```

### MessageService

#### `getMessagesByProcessId(processId)`
Lista mensagens de um processo.

```typescript
const messages = await messageService.getMessagesByProcessId(processId);
```

#### `sendMessage(messageData)`
Envia nova mensagem no chat.

```typescript
await messageService.sendMessage({
  process_id: processId,
  sender_id: userId,
  message: "Olá, preciso de ajuda com os documentos."
});
```

### NotificationService

#### `getNotifications(userId)`
Lista notificações do usuário.

```typescript
const notifications = await notificationService.getNotifications(userId);
```

#### `markAsRead(id)`
Marca notificação como lida.

```typescript
await notificationService.markAsRead(notificationId);
```

#### `markAllAsRead(userId)`
Marca todas as notificações como lidas.

```typescript
await notificationService.markAllAsRead(userId);
```

## 🔐 Políticas RLS (Row Level Security)

### Profiles
- **SELECT**: Todos podem ver perfis públicos
- **UPDATE**: Usuários podem atualizar próprio perfil
- **ADMIN**: Admins podem ver/editar todos os perfis

### Processes
- **SELECT**: Clientes veem apenas próprios processos, admins veem todos
- **INSERT/UPDATE/DELETE**: Apenas admins

### Process Documents
- **SELECT**: Cliente vê docs do próprio processo, admins veem todos
- **INSERT**: Cliente pode uplodar, admins podem uplodar em qualquer processo
- **UPDATE**: Apenas admins podem atualizar status

### Process Messages
- **SELECT**: Participantes do processo podem ver mensagens
- **INSERT**: Participantes podem enviar mensagens

### Notifications
- **SELECT**: Usuários veem apenas próprias notificações
- **UPDATE**: Usuários podem marcar próprias notificações como lidas

## 📊 Tipos TypeScript

### ProcessWithDetails
```typescript
interface ProcessWithDetails extends Process {
  process_type: ProcessType;
  client: Profile;
  steps?: ProcessStep[];
  documents?: ProcessDocument[];
}
```

### Profile
```typescript
interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cliente';
  cpf?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}
```

### Process
```typescript
interface Process {
  id: string;
  title: string;
  description?: string;
  process_number: string;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'rejeitado';
  progress?: number;
  client_id: string;
  process_type_id: string;
  deadline?: string;
  created_at: string;
  updated_at: string;
}
```

## 🚨 Tratamento de Erros

### Padrão de Retorno
Todos os serviços seguem o padrão:
- **Sucesso**: Retorna dados ou `null` se não encontrado
- **Erro**: Loga erro no console e retorna `null` ou array vazio

### Exemplo de Uso Seguro
```typescript
try {
  const process = await processService.getProcessById(id);
  if (!process) {
    console.warn('Processo não encontrado');
    return;
  }
  // Usar process normalmente
} catch (error) {
  console.error('Erro ao buscar processo:', error);
  // Tratar erro na UI
}
```

## 🔄 Hooks de Estado

### useQuery (TanStack Query)
Para busca de dados:

```typescript
const { data: processes, isLoading, error } = useQuery({
  queryKey: ['processes', clientId],
  queryFn: () => processService.getProcesses(clientId),
});
```

### useMutation (TanStack Query)
Para operações de escrita:

```typescript
const { mutate: updateProcess } = useMutation({
  mutationFn: (data) => processService.updateProcess(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries(['processes']);
  },
});
```
