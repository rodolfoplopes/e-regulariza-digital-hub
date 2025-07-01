
/**
 * Serviço para gerenciamento de processos
 * @fileoverview Operações CRUD e lógica de negócio para processos
 */

import { supabase } from "@/integrations/supabase/client";

export interface ProcessType {
  id: string;
  name: string;
  description: string | null;
  estimated_duration_days: number | null;
}

export interface Process {
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
}

export interface ProcessWithDetails extends Process {
  process_type?: ProcessType;
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

export interface CreateProcessData {
  title: string;
  description?: string;
  client_id: string;
  process_type_id: string;
  deadline?: string;
}

class ProcessService {
  /**
   * Busca todos os processos com filtros opcionais
   */
  async getProcesses(clientId?: string): Promise<ProcessWithDetails[]> {
    try {
      let query = supabase
        .from('processes')
        .select(`
          *,
          process_type:process_types(*),
          client:profiles(*)
        `)
        .order('created_at', { ascending: false });

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching processes:', error);
      throw error;
    }
  }

  /**
   * Busca processo por ID
   */
  async getProcessById(id: string): Promise<ProcessWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('processes')
        .select(`
          *,
          process_type:process_types(*),
          client:profiles(*),
          steps:process_steps(*),
          documents:process_documents(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching process by ID:', error);
      throw error;
    }
  }

  /**
   * Cria novo processo
   */
  async createProcess(processData: CreateProcessData): Promise<Process | null> {
    try {
      const { data, error } = await supabase
        .from('processes')
        .insert({
          ...processData,
          process_number: '' // Will be replaced by trigger
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating process:', error);
      throw error;
    }
  }

  /**
   * Atualiza processo
   */
  async updateProcess(id: string, updates: Partial<Process>): Promise<Process | null> {
    try {
      const { data, error } = await supabase
        .from('processes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating process:', error);
      throw error;
    }
  }

  /**
   * Busca tipos de processo
   */
  async getProcessTypes(): Promise<ProcessType[]> {
    try {
      const { data, error } = await supabase
        .from('process_types')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching process types:', error);
      throw error;
    }
  }

  /**
   * Deleta processo
   */
  async deleteProcess(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('processes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting process:', error);
      throw error;
    }
  }
}

export const processService = new ProcessService();
