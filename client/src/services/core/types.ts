
/**
 * Tipos centralizados para os serviços da aplicação
 * @fileoverview Define todas as interfaces e tipos utilizados nos serviços
 */

import { Database } from "@/integrations/supabase/types";

// Tipos base do Supabase
type Tables = Database['public']['Tables'];

export type Profile = Tables['profiles']['Row'];
export type Process = Tables['processes']['Row'];
export type ProcessStep = Tables['process_steps']['Row'];
export type ProcessMessage = Tables['process_messages']['Row'];
export type ProcessDocument = Tables['process_documents']['Row'];
export type ProcessType = Tables['process_types']['Row'];
export type Notification = Tables['notifications']['Row'];

// Tipos para as novas tabelas (usando any temporariamente até o types.ts ser atualizado)
export interface ProcessFeedback {
  id: string;
  process_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface CMSContent {
  id: string;
  tipo: string;
  titulo: string;
  conteudo: string;
  data_ultima_edicao: string;
  editor?: string;
  created_at: string;
}

// Tipos estendidos para uso na aplicação
export interface ProcessWithDetails extends Process {
  process_type: ProcessType;
  client: Profile;
  steps?: ProcessStep[];
  documents?: ProcessDocument[];
}

// Tipos para criação de novos registros
export type CreateProcessData = {
  title: string;
  description?: string;
  client_id: string;
  process_type_id: string;
  deadline?: string;
};

export type CreateClientData = {
  name: string;
  email: string;
  role: string;
  cpf?: string;
  phone?: string;
};

export type CreateMessageData = Omit<ProcessMessage, 'id' | 'created_at'>;
export type CreateDocumentData = Omit<ProcessDocument, 'id' | 'created_at'>;
export type CreateNotificationData = Omit<Notification, 'id' | 'created_at'>;
export type CreateStepData = Omit<ProcessStep, 'id' | 'created_at' | 'updated_at'>;

// Tipos para filtros e buscas
export interface ExportFilters {
  clientId?: string;
  processTypeId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

// Tipos para respostas de serviços
export interface ServiceResponse<T> {
  data: T | null;
  error?: string;
  success: boolean;
}

// Status possíveis para processos
export type ProcessStatus = 'pendente' | 'em_andamento' | 'concluido' | 'rejeitado';

// Status possíveis para documentos
export type DocumentStatus = 'pendente' | 'aprovado' | 'rejeitado';

// Tipos de usuário
export type UserRole = 'admin' | 'cliente';

// Tipos para CMS
export type CMSContentType = 'politica-privacidade' | 'termos-uso' | 'sobre-plataforma' | 'ajuda-faq';

// Tipos para métricas e automações
export interface ProcessMetrics {
  totalProcesses: number;
  processesByStatus: Record<ProcessStatus, number>;
  averageCompletionTime: number;
  processesThisWeek: number;
  processesThisMonth: number;
}

export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface AutomationConfig {
  hubspot: {
    enabled: boolean;
    apiKey?: string;
    syncContacts: boolean;
    syncDeals: boolean;
  };
  googleSheets: {
    enabled: boolean;
    spreadsheetId?: string;
    syncProcesses: boolean;
    autoExport: boolean;
  };
  notifications: {
    sms: boolean;
    email: boolean;
    webhook: boolean;
  };
}

// Tipos para permissões
export interface PermissionConfig {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  isAdmin: boolean;
}

// Tipos para onboarding e tutorial
export interface TutorialStep {
  target: string;
  content: string;
  title: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  disableBeacon?: boolean;
}

export interface OnboardingState {
  hasCompletedTutorial: boolean;
  currentStep: number;
  isActive: boolean;
}

// Tipos para feedback
export interface NPSData {
  score: number;
  comment?: string;
  process_id: string;
  user_id: string;
}
