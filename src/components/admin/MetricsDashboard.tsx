
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  TrendingUp, 
  Clock, 
  Users, 
  FileText, 
  Download,
  RefreshCw
} from "lucide-react";
import { metricsService } from "@/services/metricsService";
import { ProcessMetrics } from "@/services/core/types";

const COLORS = ['#06D7A5', '#0EA5E9', '#F59E0B', '#EF4444'];

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<ProcessMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [exportData, setExportData] = useState<any[]>([]);
  const { toast } = useToast();

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const data = await metricsService.getProcessMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar métricas"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await metricsService.exportProcessData();
      setExportData(data);
      
      // Converter para CSV e fazer download
      const csvContent = convertToCSV(data);
      downloadCSV(csvContent, `relatorio-processos-${new Date().toISOString().split('T')[0]}.csv`);
      
      toast({
        title: "Sucesso",
        description: "Relatório exportado com sucesso!"
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao exportar relatório"
      });
    }
  };

  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = (csvContent: string, filename: string) => {
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

  useEffect(() => {
    loadMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Métricas e Relatórios</h2>
          <Button disabled>
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            Carregando...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Erro ao carregar métricas</p>
        <Button onClick={loadMetrics} className="mt-4">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  const statusData = Object.entries(metrics.processesByStatus).map(([status, count]) => ({
    name: status,
    value: count,
    label: status === 'pendente' ? 'Pendente' : 
           status === 'em_andamento' ? 'Em Andamento' :
           status === 'concluido' ? 'Concluído' : 'Rejeitado'
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-[#06D7A5]" />
          Métricas e Relatórios
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadMetrics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={handleExport} className="bg-[#06D7A5] hover:bg-[#06D7A5]/90">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-[#06D7A5]">
          <CardContent className="p-6 flex items-center">
            <div className="h-12 w-12 rounded-full bg-[#06D7A5]/10 flex items-center justify-center mr-4">
              <FileText className="h-6 w-6 text-[#06D7A5]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de Processos</p>
              <p className="text-2xl font-bold">{metrics.totalProcesses}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-6 flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tempo Médio (dias)</p>
              <p className="text-2xl font-bold">{metrics.averageCompletionTime}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-yellow-500">
          <CardContent className="p-6 flex items-center">
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
              <TrendingUp className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Esta Semana</p>
              <p className="text-2xl font-bold">{metrics.processesThisWeek}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <CardContent className="p-6 flex items-center">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Este Mês</p>
              <p className="text-2xl font-bold">{metrics.processesThisMonth}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Processos por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#06D7A5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {statusData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm font-medium">{item.label}</span>
                <Badge variant="secondary">{item.value}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
