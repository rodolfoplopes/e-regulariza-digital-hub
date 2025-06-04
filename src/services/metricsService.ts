
/**
 * Serviço para métricas e relatórios do sistema
 * @fileoverview Coleta e processa dados para dashboards e relatórios
 */

import { supabase } from "@/integrations/supabase/client";
import { BaseService } from "./core/base";
import { ProcessMetrics, ProcessStatus } from "./core/types";

class MetricsService extends BaseService {
  constructor() {
    super('MetricsService');
  }

  /**
   * Calcula métricas gerais de processos
   * @returns Objeto com todas as métricas
   */
  async getProcessMetrics(): Promise<ProcessMetrics | null> {
    return this.executeOperation(
      'getProcessMetrics',
      async () => {
        // Buscar todos os processos
        const { data: processes, error } = await supabase
          .from('processes')
          .select('status, created_at, updated_at');

        if (error) throw error;

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Calcular métricas
        const totalProcesses = processes.length;
        
        const processesByStatus = processes.reduce((acc, process) => {
          acc[process.status as ProcessStatus] = (acc[process.status as ProcessStatus] || 0) + 1;
          return acc;
        }, {} as Record<ProcessStatus, number>);

        const processesThisWeek = processes.filter(
          p => new Date(p.created_at) >= weekAgo
        ).length;

        const processesThisMonth = processes.filter(
          p => new Date(p.created_at) >= monthAgo
        ).length;

        // Calcular tempo médio de conclusão
        const completedProcesses = processes.filter(p => p.status === 'concluido');
        const averageCompletionTime = completedProcesses.length > 0
          ? completedProcesses.reduce((acc, process) => {
              const created = new Date(process.created_at);
              const updated = new Date(process.updated_at);
              return acc + (updated.getTime() - created.getTime());
            }, 0) / completedProcesses.length / (1000 * 60 * 60 * 24) // em dias
          : 0;

        return {
          totalProcesses,
          processesByStatus,
          averageCompletionTime: Math.round(averageCompletionTime),
          processesThisWeek,
          processesThisMonth
        };
      }
    );
  }

  /**
   * Calcula métricas por período
   * @param startDate Data inicial
   * @param endDate Data final
   * @returns Métricas do período
   */
  async getMetricsByPeriod(startDate: string, endDate: string): Promise<any> {
    return this.executeOperation(
      `getMetricsByPeriod(${startDate} - ${endDate})`,
      async () => {
        const { data, error } = await supabase
          .from('processes')
          .select(`
            status,
            created_at,
            updated_at,
            process_type:process_types(name),
            client:profiles(name)
          `)
          .gte('created_at', startDate)
          .lte('created_at', endDate);

        if (error) throw error;

        return {
          total: data.length,
          byStatus: data.reduce((acc, curr) => {
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
          }, {}),
          byType: data.reduce((acc, curr) => {
            const typeName = curr.process_type?.name || 'Sem tipo';
            acc[typeName] = (acc[typeName] || 0) + 1;
            return acc;
          }, {}),
          data
        };
      }
    );
  }

  /**
   * Exporta dados para relatório
   * @param filters Filtros para aplicar
   * @returns Dados formatados para exportação
   */
  async exportProcessData(filters?: any): Promise<any[]> {
    return this.executeArrayOperation(
      'exportProcessData',
      async () => {
        let query = supabase
          .from('processes')
          .select(`
            process_number,
            title,
            status,
            progress,
            created_at,
            updated_at,
            deadline,
            process_type:process_types(name),
            client:profiles(name, email)
          `);

        if (filters?.startDate) {
          query = query.gte('created_at', filters.startDate);
        }
        if (filters?.endDate) {
          query = query.lte('created_at', filters.endDate);
        }
        if (filters?.status) {
          query = query.eq('status', filters.status);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        return data.map(process => ({
          numero: process.process_number,
          titulo: process.title,
          cliente: process.client?.name || 'N/A',
          email: process.client?.email || 'N/A',
          tipo: process.process_type?.name || 'N/A',
          status: process.status,
          progresso: process.progress || 0,
          criado_em: new Date(process.created_at).toLocaleDateString('pt-BR'),
          atualizado_em: new Date(process.updated_at).toLocaleDateString('pt-BR'),
          prazo: process.deadline ? new Date(process.deadline).toLocaleDateString('pt-BR') : 'N/A'
        }));
      }
    );
  }
}

export const metricsService = new MetricsService();
