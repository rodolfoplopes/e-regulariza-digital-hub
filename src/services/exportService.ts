
import { supabase } from "@/integrations/supabase/client";
import { ExportFilters } from "./core/types";

export const exportService = {
  async exportProcesses(filters: ExportFilters = {}) {
    try {
      let query = supabase
        .from('processes')
        .select(`
          *,
          process_type:process_types(name),
          client:profiles(name, email, cpf)
        `);

      // Apply filters
      if (filters.clientId) {
        query = query.eq('client_id', filters.clientId);
      }
      
      if (filters.processTypeId) {
        query = query.eq('process_type_id', filters.processTypeId);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error exporting processes:', error);
      return [];
    }
  },

  downloadCSV(data: any[], filename: string) {
    if (!data.length) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
