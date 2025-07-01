
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from './useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

interface ProcessWithDetails {
  id: string;
  title: string;
  description: string | null;
  status: string;
  progress: number | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
  process_number: string;
  client_id: string;
  process_type_id: string;
  process_type?: {
    id: string;
    name: string;
    description: string | null;
  };
  client?: {
    id: string;
    name: string;
    email: string;
    cpf: string | null;
  };
  steps?: Array<{
    id: string;
    title: string;
    description: string | null;
    status: string;
    order_number: number;
    deadline: string | null;
    completed_at: string | null;
  }>;
  documents?: Array<{
    id: string;
    name: string;
    file_url: string;
    status: string;
    uploaded_by: string;
  }>;
}

export const useProcesses = (clientId?: string) => {
  const [processes, setProcesses] = useState<ProcessWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useSupabaseAuth();

  const fetchProcesses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let query = supabase
        .from('processes')
        .select(`
          *,
          process_type:process_types(*),
          client:profiles(*)
        `)
        .order('created_at', { ascending: false });

      // If user is a client, only fetch their processes
      if (profile?.role === 'cliente') {
        query = query.eq('client_id', profile.id);
      } else if (clientId) {
        // Admin filtering by specific client
        query = query.eq('client_id', clientId);
      }

      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        console.error('Error fetching processes:', fetchError);
        throw fetchError;
      }

      setProcesses(data || []);
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
