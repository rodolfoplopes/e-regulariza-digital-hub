
# Guia de Componentes - e-regulariza

## 📱 Componentes Base (UI)

### Button
**Localização**: `src/components/ui/button.tsx`
**Descrição**: Componente base para botões com variantes predefinidas.

```tsx
// Exemplo de uso
<Button variant="default" size="md">
  Salvar
</Button>

<Button variant="outline" onClick={handleClick}>
  Cancelar
</Button>
```

**Props**:
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"

### Card
**Localização**: `src/components/ui/card.tsx`
**Descrição**: Container para agrupar conteúdo relacionado.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição opcional</CardDescription>
  </CardHeader>
  <CardContent>
    Conteúdo principal
  </CardContent>
</Card>
```

## 🏗️ Componentes de Layout

### DashboardSidebar
**Localização**: `src/components/dashboard/DashboardSidebar.tsx`
**Descrição**: Barra lateral de navegação do dashboard.

**Funcionalidades**:
- Menu responsivo para mobile/desktop
- Navegação baseada em permissões
- Logo da empresa
- Logout integrado

### DashboardHeader
**Localização**: `src/components/dashboard/DashboardHeader.tsx`
**Descrição**: Cabeçalho com notificações e perfil do usuário.

**Funcionalidades**:
- Badge de notificações não lidas
- Menu de perfil
- Pesquisa global (futuro)

## 📋 Componentes de Processo

### ProcessCard
**Localização**: `src/components/dashboard/ProcessCard.tsx`
**Descrição**: Card resumido de processo no dashboard.

```tsx
<ProcessCard 
  process={processData}
  onClick={() => navigate(`/processo/${process.id}`)}
/>
```

**Props**:
- `process`: ProcessWithDetails
- `onClick`: () => void

### ProcessTimeline
**Localização**: `src/components/process/ProcessTimeline.tsx`
**Descrição**: Timeline visual das etapas do processo.

```tsx
<ProcessTimeline stages={timelineStages} />
```

**Props**:
- `stages`: Array de objetos com status e informações

### DocumentManager
**Localização**: `src/components/process/DocumentManager.tsx`
**Descrição**: Gerenciador completo de documentos.

**Funcionalidades**:
- Upload de arquivos
- Visualização de documentos
- Status de aprovação
- Download de arquivos

## 💬 Componentes de Comunicação

### EnhancedChat
**Localização**: `src/components/process/EnhancedChat.tsx`
**Descrição**: Sistema de chat em tempo real.

```tsx
<EnhancedChat processId={processId} />
```

**Props**:
- `processId`: string (UUID)

**Funcionalidades**:
- Envio de mensagens de texto
- Anexos de arquivos
- Scroll automático
- Indicadores de status

## 🛡️ Componentes de Admin

### ProcessesTable
**Localização**: `src/components/admin/ProcessesTable.tsx`
**Descrição**: Tabela completa de processos com ações.

**Funcionalidades**:
- Listagem paginada
- Filtros por status
- Ações inline (editar, excluir)
- Exportação de dados

### UserManagement
**Localização**: `src/components/admin/UserManagement.tsx`
**Descrição**: Gestão de usuários e clientes.

**Funcionalidades**:
- Criar novos clientes
- Editar perfis existentes
- Alterar permissões
- Desativar usuários

## 🔧 Hooks Customizados

### useSupabaseAuth
**Localização**: `src/hooks/useSupabaseAuth.tsx`
**Descrição**: Hook principal para autenticação.

```tsx
const { user, profile, isLoading, login, logout } = useSupabaseAuth();
```

**Retorna**:
- `user`: User | null
- `profile`: Profile | null
- `isLoading`: boolean
- `login`: (email, password) => Promise
- `logout`: () => Promise

### usePermissions
**Localização**: `src/hooks/usePermissions.tsx`
**Descrição**: Hook para verificação de permissões.

```tsx
const { canEditProcesses, canViewReports } = usePermissions();
```

### useProcesses
**Localização**: `src/hooks/useProcesses.tsx`
**Descrição**: Hook para gerenciamento de processos.

```tsx
const { processes, isLoading, refreshProcesses } = useProcesses(clientId);
```

## 📝 Padrões de Desenvolvimento

### Nomenclatura
- **Componentes**: PascalCase (ex: `ProcessCard`)
- **Hooks**: camelCase com prefixo 'use' (ex: `useProcesses`)
- **Funções**: camelCase (ex: `handleSubmit`)
- **Constantes**: UPPER_CASE (ex: `API_URL`)

### Estrutura de Arquivos
```
ComponentName/
├── index.tsx           # Exportação principal
├── ComponentName.tsx   # Componente principal
├── hooks.ts           # Hooks específicos (se necessário)
└── types.ts           # Tipos específicos (se necessário)
```

### Props e TypeScript
```tsx
interface ComponentProps {
  /** Descrição da prop */
  title: string;
  /** Descrição opcional */
  description?: string;
  /** Callback obrigatório */
  onAction: (id: string) => void;
}

const Component: React.FC<ComponentProps> = ({ title, description, onAction }) => {
  // Implementação
};
```

## 🎨 Design System

### Cores Principais
- **Primary**: #06D7A5 (Verde e-regulariza)
- **Secondary**: #333333 (Cinza escuro)
- **Success**: #10B981
- **Warning**: #F59E0B
- **Error**: #EF4444

### Tipografia
- **Font Family**: Montserrat
- **Heading**: font-bold
- **Body**: font-normal
- **Caption**: font-light

### Espaçamentos
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
