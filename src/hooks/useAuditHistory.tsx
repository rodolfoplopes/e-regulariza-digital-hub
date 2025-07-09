import { useState, useEffect } from 'react';
import { auditService } from '@/services/auditService';

interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id?: string;
  target_name?: string;
  details?: any;
  created_at: string;
  admin_name?: string;
}

interface UseAuditHistoryReturn {
  logs: AuditLog[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAuditHistory(processId: string): UseAuditHistoryReturn {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the new method to get process-specific logs
      const processLogs = await auditService.getProcessAuditLogs(processId);
      setLogs(processLogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (processId) {
      fetchLogs();
    }
  }, [processId]);

  return {
    logs,
    isLoading,
    error,
    refetch: fetchLogs
  };
}