
import { supabase } from '@/integrations/supabase/client';
import { notificationService } from './supabaseService';
import { CreateNotificationData } from './core/types';

export interface NotificationTemplate {
  title: string;
  message: string;
  type: 'document' | 'message' | 'status' | 'system' | 'approval' | 'deadline' | 'action_required';
  priority: 'low' | 'medium' | 'high';
}

export const notificationTemplates = {
  processCreated: (processNumber: string): NotificationTemplate => ({
    title: 'Novo processo criado',
    message: `Seu processo ${processNumber} foi criado com sucesso e está em análise.`,
    type: 'status',
    priority: 'medium'
  }),
  
  stepCompleted: (processNumber: string, stepTitle: string): NotificationTemplate => ({
    title: 'Etapa concluída',
    message: `A etapa "${stepTitle}" do processo ${processNumber} foi concluída.`,
    type: 'status',
    priority: 'medium'
  }),
  
  stepAdded: (processNumber: string, stepTitle: string): NotificationTemplate => ({
    title: 'Nova etapa adicionada',
    message: `Uma nova etapa "${stepTitle}" foi adicionada ao processo ${processNumber}.`,
    type: 'status',
    priority: 'medium'
  }),
  
  processUpdated: (processNumber: string): NotificationTemplate => ({
    title: 'Processo atualizado',
    message: `O processo ${processNumber} foi atualizado pela equipe administrativa.`,
    type: 'status',
    priority: 'medium'
  }),
  
  documentRequired: (processNumber: string, documentName: string): NotificationTemplate => ({
    title: 'Documento pendente',
    message: `É necessário enviar o documento "${documentName}" para o processo ${processNumber}.`,
    type: 'action_required',
    priority: 'high'
  }),
  
  documentApproved: (processNumber: string, documentName: string): NotificationTemplate => ({
    title: 'Documento aprovado',
    message: `O documento "${documentName}" do processo ${processNumber} foi aprovado.`,
    type: 'approval',
    priority: 'medium'
  }),
  
  processCompleted: (processNumber: string): NotificationTemplate => ({
    title: 'Processo concluído',
    message: `Parabéns! O processo ${processNumber} foi concluído com sucesso.`,
    type: 'status',
    priority: 'high'
  }),
  
  deadlineApproaching: (processNumber: string, days: number): NotificationTemplate => ({
    title: 'Prazo próximo',
    message: `O prazo do processo ${processNumber} vence em ${days} dia(s).`,
    type: 'deadline',
    priority: 'high'
  })
};

export const sendNotification = async (
  userId: string,
  template: NotificationTemplate,
  processId?: string,
  actionUrl?: string
) => {
  try {
    const notificationData: CreateNotificationData = {
      user_id: userId,
      process_id: processId || null,
      title: template.title,
      message: template.message,
      type: template.type,
      priority: template.priority,
      action_url: actionUrl || null,
      is_read: false
    };

    await notificationService.createNotification(notificationData);
    console.log('Notification sent successfully:', template.title);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const sendSMSNotification = async (
  phone: string,
  message: string,
  type: 'sms' | 'whatsapp' = 'sms'
) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: {
        phone,
        message,
        type
      }
    });

    if (error) {
      console.error('Error sending SMS:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error: 'Erro ao enviar SMS' };
  }
};

// Function to send combined notification (in-app + SMS)
export const sendCombinedNotification = async (
  userId: string,
  phone: string | null,
  template: NotificationTemplate,
  processId?: string,
  actionUrl?: string
) => {
  // Send in-app notification
  await sendNotification(userId, template, processId, actionUrl);
  
  // Send SMS if phone number is available
  if (phone) {
    await sendSMSNotification(phone, template.message);
  }
};
