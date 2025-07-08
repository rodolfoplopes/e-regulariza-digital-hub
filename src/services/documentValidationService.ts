import { supabase } from "@/integrations/supabase/client";
import { sendNotification, notificationTemplates } from "./notificationHelperService";

export interface DocumentValidationData {
  documentId: string;
  status: 'aprovado' | 'rejeitado';
  observation?: string;
  reviewerId: string;
}

export interface DocumentAuditLog {
  id: string;
  document_id: string;
  action: string;
  previous_status: string | null;
  new_status: string;
  observation: string | null;
  user_id: string;
  created_at: string;
  reviewer?: {
    name: string;
    email: string;
  };
}

export interface DocumentWithAudit {
  id: string;
  name: string;
  status: string;
  file_url: string;
  uploaded_by: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  created_at: string;
  process_id: string;
  uploader?: {
    name: string;
    email: string;
  };
  reviewer?: {
    name: string;
    email: string;
  };
  audit_logs?: DocumentAuditLog[];
}

export const documentValidationService = {
  async validateDocument(data: DocumentValidationData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('process_documents')
        .update({
          status: data.status,
          review_notes: data.observation,
          reviewed_by: data.reviewerId,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', data.documentId);

      if (error) {
        console.error('Error validating document:', error);
        return false;
      }

      // Send notification to document uploader
      await this.sendDocumentNotification(data.documentId, data.status, data.observation);

      return true;
    } catch (error) {
      console.error('Error validating document:', error);
      return false;
    }
  },

  async sendDocumentNotification(documentId: string, status: string, observation?: string): Promise<void> {
    try {
      // Get document and process info
      const { data: document, error: docError } = await supabase
        .from('process_documents')
        .select(`
          *,
          processes!inner(
            process_number,
            client_id,
            profiles!inner(
              name,
              phone
            )
          )
        `)
        .eq('id', documentId)
        .single();

      if (docError || !document) {
        console.error('Error fetching document for notification:', docError);
        return;
      }

      const client = document.processes.profiles;
      const processNumber = document.processes.process_number;

      // Create notification template
      const template = status === 'aprovado' 
        ? notificationTemplates.documentApproved(processNumber, document.name)
        : {
            title: 'Documento rejeitado',
            message: `O documento "${document.name}" do processo ${processNumber} foi rejeitado. ${observation ? `Motivo: ${observation}` : ''}`,
            type: 'document' as const,
            priority: 'high' as const
          };

      // Send in-app notification
      await sendNotification(
        document.processes.client_id,
        template,
        document.process_id,
        `/processo/${document.process_id}`
      );

      // Send SMS if phone is available
      if (client.phone) {
        const { sendSMSNotification } = await import('./notificationHelperService');
        await sendSMSNotification(client.phone, template.message);
      }
    } catch (error) {
      console.error('Error sending document notification:', error);
    }
  },

  async getDocumentAuditLogs(documentId: string): Promise<DocumentAuditLog[]> {
    try {
      const { data, error } = await supabase
        .from('document_audit_logs')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching document audit logs:', error);
        return [];
      }

      // Get reviewer info for each log
      const logsWithReviewer = await Promise.all(
        (data || []).map(async (log) => {
          const { data: reviewer } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', log.user_id)
            .single();

          return {
            id: log.id,
            document_id: log.document_id,
            action: log.action,
            previous_status: log.previous_status,
            new_status: log.new_status,
            observation: log.observation,
            user_id: log.user_id,
            created_at: log.created_at,
            reviewer: reviewer ? {
              name: reviewer.name,
              email: reviewer.email
            } : undefined
          };
        })
      );

      return logsWithReviewer;
    } catch (error) {
      console.error('Error fetching document audit logs:', error);
      return [];
    }
  },

  async getDocumentsWithAudit(processId?: string): Promise<DocumentWithAudit[]> {
    try {
      let query = supabase
        .from('process_documents')
        .select(`
          *,
          uploader:profiles!process_documents_uploaded_by_fkey(name, email),
          reviewer:profiles!process_documents_reviewed_by_fkey(name, email),
          processes!inner(process_number, client_id)
        `)
        .order('created_at', { ascending: false });

      if (processId) {
        query = query.eq('process_id', processId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching documents with audit:', error);
        return [];
      }

      const documentsWithAudit = await Promise.all(
        (data || []).map(async (doc) => {
          const auditLogs = await this.getDocumentAuditLogs(doc.id);
          return {
            id: doc.id,
            name: doc.name,
            status: doc.status,
            file_url: doc.file_url,
            uploaded_by: doc.uploaded_by,
            reviewed_by: doc.reviewed_by,
            reviewed_at: doc.reviewed_at,
            review_notes: doc.review_notes,
            created_at: doc.created_at,
            process_id: doc.process_id,
            uploader: doc.uploader,
            reviewer: doc.reviewer,
            audit_logs: auditLogs
          };
        })
      );

      return documentsWithAudit;
    } catch (error) {
      console.error('Error fetching documents with audit:', error);
      return [];
    }
  },

  async getPendingDocuments(): Promise<DocumentWithAudit[]> {
    try {
      const { data, error } = await supabase
        .from('process_documents')
        .select(`
          *,
          uploader:profiles!process_documents_uploaded_by_fkey(name, email),
          processes!inner(process_number, client_id)
        `)
        .eq('status', 'pendente')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching pending documents:', error);
        return [];
      }

      return (data || []).map(doc => ({
        id: doc.id,
        name: doc.name,
        status: doc.status,
        file_url: doc.file_url,
        uploaded_by: doc.uploaded_by,
        reviewed_by: doc.reviewed_by,
        reviewed_at: doc.reviewed_at,
        review_notes: doc.review_notes,
        created_at: doc.created_at,
        process_id: doc.process_id,
        uploader: doc.uploader
      }));
    } catch (error) {
      console.error('Error fetching pending documents:', error);
      return [];
    }
  }
};