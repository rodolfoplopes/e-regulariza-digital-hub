
import { useState, useEffect } from 'react';
import { processService, ProcessWithDetails } from '@/services/supabaseService';
import { useSupabaseAuth } from './useSupabaseAuth';

export const useProcesses = (clientId?: string) => {
  const [processes, setProcesses] = useState<ProcessWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useSupabaseAuth();

  const fetchProcesses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // If user is a client, only fetch their processes
      const targetClientId = profile?.role === 'cliente' ? profile.id : clientId;
      const data = await processService.getProcesses(targetClientId);
      setProcesses(data);
    } catch (err) {
      console.error('Error fetching processes:', err);
      setError('Erro ao carregar processos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchProcesses();
    }
  }, [profile, clientId]);

  const refreshProcesses = () => {
    fetchProcesses();
  };

  return {
    processes,
    isLoading,
    error,
    refreshProcesses
  };
};
