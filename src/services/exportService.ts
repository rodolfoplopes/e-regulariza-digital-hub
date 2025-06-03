
import { exportService, ProcessWithDetails } from './supabaseService';

export interface ExportFilters {
  clientId?: string;
  processTypeId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export const generateCSVReport = async (filters?: ExportFilters): Promise<string> => {
  const processes = await exportService.exportProcesses(filters);
  
  const headers = [
    'Número do Processo',
    'Título',
    'Cliente',
    'Tipo',
    'Status',
    'Progresso (%)',
    'Data de Criação',
    'Última Atualização',
    'Prazo'
  ].join(',');

  const rows = processes.map(process => [
    process.process_number,
    `"${process.title}"`,
    `"${process.client?.name || 'N/A'}"`,
    `"${process.process_type?.name || 'N/A'}"`,
    process.status,
    process.progress || 0,
    new Date(process.created_at).toLocaleDateString('pt-BR'),
    new Date(process.updated_at).toLocaleDateString('pt-BR'),
    process.deadline ? new Date(process.deadline).toLocaleDateString('pt-BR') : 'N/A'
  ].join(','));

  return [headers, ...rows].join('\n');
};

export const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateProcessReport = async (filters?: ExportFilters): Promise<void> => {
  try {
    const csvContent = await generateCSVReport(filters);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `relatorio-processos-${timestamp}.csv`;
    downloadCSV(csvContent, filename);
  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error('Erro ao gerar relatório');
  }
};
