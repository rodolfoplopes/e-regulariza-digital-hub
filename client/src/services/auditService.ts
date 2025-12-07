
import { supabase } from "@/integrations/supabase/client";

interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id?: string;
  target_name?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  admin_name?: string;
}

interface CreateAuditLogData {
  action: string;
  target_type: 'user' | 'process' | 'client' | 'system' | 'document';
  target_id?: string;
  target_name?: string;
  details?: any;
}

export const auditService = {
  async createAuditLog(data: CreateAuditLogData): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Get user agent and IP (in a real app, IP would come from server)
      const userAgent = navigator.userAgent;

      const { error } = await supabase
        .from('audit_logs')
        .insert({
          admin_id: user.id,
          action: data.action,
          target_type: data.target_type,
          target_id: data.target_id,
          target_name: data.target_name,
          details: data.details,
          user_agent: userAgent
        });

      if (error) {
        console.error('Error creating audit log:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error creating audit log:', error);
      return false;
    }
  },

  async getAuditLogs(filters?: {
    action?: string;
    target_type?: string;
    admin_id?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<AuditLog[]> {
    try {
      let query = supabase
        .from('audit_logs')
        .select(`
          *,
          admin:profiles!audit_logs_admin_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (filters?.action) {
        query = query.ilike('action', `%${filters.action}%`);
      }

      if (filters?.target_type) {
        query = query.eq('target_type', filters.target_type);
      }

      if (filters?.admin_id) {
        query = query.eq('admin_id', filters.admin_id);
      }

      if (filters?.from_date) {
        query = query.gte('created_at', filters.from_date);
      }

      if (filters?.to_date) {
        query = query.lte('created_at', filters.to_date);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(log => ({
        id: log.id,
        admin_id: log.admin_id,
        action: log.action,
        target_type: log.target_type,
        target_id: log.target_id || undefined,
        target_name: log.target_name || undefined,
        details: log.details,
        ip_address: log.ip_address ? String(log.ip_address) : undefined,
        user_agent: log.user_agent || undefined,
        created_at: log.created_at,
        admin_name: log.admin?.name || 'Usuário Desconhecido'
      }));
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }
  },

  // Document-specific audit functions
  async logDocumentUpload(documentId: string, documentName: string, processId: string): Promise<void> {
    await this.createAuditLog({
      action: 'UPLOAD_DOCUMENT',
      target_type: 'document',
      target_id: documentId,
      target_name: documentName,
      details: {
        processId,
        action: 'uploaded'
      }
    });
  },

  async logDocumentApproval(documentId: string, documentName: string, processId: string): Promise<void> {
    await this.createAuditLog({
      action: 'APPROVE_DOCUMENT',
      target_type: 'document',
      target_id: documentId,
      target_name: documentName,
      details: {
        processId,
        action: 'approved'
      }
    });
  },

  async logDocumentRejection(documentId: string, documentName: string, processId: string, feedback?: string): Promise<void> {
    await this.createAuditLog({
      action: 'REJECT_DOCUMENT',
      target_type: 'document',
      target_id: documentId,
      target_name: documentName,
      details: {
        processId,
        action: 'rejected',
        feedback
      }
    });
  },

  async logDocumentDeletion(documentId: string, documentName: string, processId: string): Promise<void> {
    await this.createAuditLog({
      action: 'DELETE_DOCUMENT',
      target_type: 'document',
      target_id: documentId,
      target_name: documentName,
      details: {
        processId,
        action: 'deleted'
      }
    });
  },

  // Get audit logs for a specific process
  async getProcessAuditLogs(processId: string, filters?: {
    action?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<AuditLog[]> {
    try {
      let query = supabase
        .from('audit_logs')
        .select(`
          *,
          admin:profiles!audit_logs_admin_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.action) {
        query = query.ilike('action', `%${filters.action}%`);
      }

      if (filters?.from_date) {
        query = query.gte('created_at', filters.from_date);
      }

      if (filters?.to_date) {
        query = query.lte('created_at', filters.to_date);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter logs related to the process
      const processLogs = (data || []).filter(log => {
        // Check if log is related to the process
        if (log.target_type === 'process' && log.target_id === processId) {
          return true;
        }
        
        // Check if log is for a document related to the process
        if (log.target_type === 'document' && log.details && 
            typeof log.details === 'object' && 
            (log.details as any).processId === processId) {
          return true;
        }
        
        return false;
      });

      return processLogs.map(log => ({
        id: log.id,
        admin_id: log.admin_id,
        action: log.action,
        target_type: log.target_type,
        target_id: log.target_id || undefined,
        target_name: log.target_name || undefined,
        details: log.details,
        ip_address: log.ip_address ? String(log.ip_address) : undefined,
        user_agent: log.user_agent || undefined,
        created_at: log.created_at,
        admin_name: log.admin?.name || 'Usuário Desconhecido'
      }));
    } catch (error) {
      console.error('Error fetching process audit logs:', error);
      return [];
    }
  }
};
