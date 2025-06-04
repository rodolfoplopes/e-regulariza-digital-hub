
/**
 * Serviço para gerenciamento de processos
 * @fileoverview Operações CRUD e lógica de negócio para processos
 */

import { supabase } from "@/integrations/supabase/client";
import { BaseService } from "./core/base";
import { Process, ProcessWithDetails, CreateProcessData, ProcessStatus } from "./core/types";

class ProcessService extends BaseService {
  constructor() {
    super('ProcessService');
  }

  /**
   * Busca todos os processos com filtros opcionais
   * @param clientId ID do cliente (opcional)
   * @returns Array de processos
   */
  async getProcesses(clientId?: string): Promise<ProcessWithDetails[]> {
    return this.executeArrayOperation(
      `getProcesses${clientId ? `(client: ${clientId})` : ''}`,
      async () => {
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
      }
    );
  }

  /**
   * Busca processo por ID
   * @param id ID do processo
   * @returns Processo com detalhes ou null
   */
  async getProcessById(id: string): Promise<ProcessWithDetails | null> {
    return this.executeOperation(
      `getProcessById(${id})`,
      async () => {
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
      }
    );
  }

  /**
   * Cria novo processo
   * @param processData Dados do processo
   * @returns Processo criado ou null
   */
  async createProcess(processData: CreateProcessData): Promise<Process | null> {
    return this.executeOperation(
      'createProcess',
      async () => {
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
      }
    );
  }

  /**
   * Atualiza processo
   * @param id ID do processo
   * @param updates Dados para atualizar
   * @returns Processo atualizado ou null
   */
  async updateProcess(id: string, updates: Partial<Process>): Promise<Process | null> {
    return this.executeOperation(
      `updateProcess(${id})`,
      async () => {
        const { data, error } = await supabase
          .from('processes')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    );
  }

  /**
   * Atualiza status do processo
   * @param id ID do processo
   * @param status Novo status
   * @returns Sucesso da operação
   */
  async updateProcessStatus(id: string, status: ProcessStatus): Promise<boolean> {
    return this.executeBooleanOperation(
      `updateProcessStatus(${id}, ${status})`,
      async () => {
        const { error } = await supabase
          .from('processes')
          .update({ status })
          .eq('id', id);

        if (error) throw error;
      }
    );
  }

  /**
   * Deleta processo
   * @param id ID do processo
   * @returns Sucesso da operação
   */
  async deleteProcess(id: string): Promise<boolean> {
    return this.executeBooleanOperation(
      `deleteProcess(${id})`,
      async () => {
        const { error } = await supabase
          .from('processes')
          .delete()
          .eq('id', id);

        if (error) throw error;
      }
    );
  }
}

export const processService = new ProcessService();
