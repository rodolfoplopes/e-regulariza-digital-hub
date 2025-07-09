import { useState, useEffect } from "react";
import { auditService } from "@/services/auditService";

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

interface AuditLogFilters {
  action: string;
  target_type: string;
  admin_id: string;
}

interface UseAuditLogsReturn {
  logs: AuditLog[];
  isLoading: boolean;
  filters: AuditLogFilters;
  setFilters: (filters: AuditLogFilters) => void;
  handleFilter: () => void;
  clearFilters: () => void;
}

export function useAuditLogs(): UseAuditLogsReturn {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<AuditLogFilters>({
    action: "",
    target_type: "",
    admin_id: "",
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const data = await auditService.getAuditLogs(filters);
      setLogs(data);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = () => {
    fetchLogs();
  };

  const clearFilters = () => {
    setFilters({
      action: "",
      target_type: "",
      admin_id: "",
    });
  };

  return {
    logs,
    isLoading,
    filters,
    setFilters,
    handleFilter,
    clearFilters,
  };
}

export type { AuditLog, AuditLogFilters };