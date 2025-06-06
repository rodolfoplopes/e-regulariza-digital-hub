
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
  target_type: 'user' | 'process' | 'client' | 'system';
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
        ...log,
        admin_name: log.admin?.name || 'Usuário Desconhecido'
      }));
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }
  }
};
