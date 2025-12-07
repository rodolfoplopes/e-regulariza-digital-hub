
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MetricCard from "./MetricCard";
import { 
  Users, 
  FileText, 
  Shield, 
  Activity,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SystemStats {
  totalUsers: number;
  activeProcesses: number;
  activeAdmins: number;
  totalLogs: number;
}

export default function SystemOverview() {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeProcesses: 0,
    activeAdmins: 0,
    totalLogs: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      setIsLoading(true);

      // Buscar total de usuários
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Buscar processos ativos
      const { count: processesCount } = await supabase
        .from('processes')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pendente', 'em_andamento']);

      // Buscar admins ativos
      const { count: adminsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .in('role', ['admin', 'admin_master', 'admin_editor', 'admin_viewer'])
        .neq('role', 'inactive');

      // Buscar total de logs
      const { count: logsCount } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: usersCount || 0,
        activeProcesses: processesCount || 0,
        activeAdmins: adminsCount || 0,
        totalLogs: logsCount || 0
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceStatus = (service: string) => {
    // Mock status - em produção seria verificado via API
    const services = {
      supabase: { status: 'online', lastCheck: '2 min atrás' },
      twilio: { status: 'online', lastCheck: '5 min atrás' },
      system: { status: 'online', lastCheck: 'agora' }
    };
    
    return services[service as keyof typeof services] || { status: 'offline', lastCheck: 'N/A' };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Resumo do Sistema</h1>
        <p className="text-gray-600 mt-1">Visão geral da plataforma e métricas principais</p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Usuários"
          value={stats.totalUsers}
          icon={Users}
          color="text-eregulariza-primary"
          description="Clientes e admins ativos"
        />
        
        <MetricCard
          title="Processos Ativos"
          value={stats.activeProcesses}
          icon={FileText}
          color="text-eregulariza-secondary"
          description="Em andamento ou pendentes"
        />
        
        <MetricCard
          title="Admins Ativos"
          value={stats.activeAdmins}
          icon={Shield}
          color="text-eregulariza-primary"
          description="Equipe administrativa"
        />
        
        <MetricCard
          title="Logs de Auditoria"
          value={stats.totalLogs}
          icon={Activity}
          color="text-eregulariza-secondary"
          description="Registro de ações"
        />
      </div>

      {/* Status do Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="section-title flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-eregulariza-secondary" />
              Status das Integrações
            </CardTitle>
            <CardDescription>
              Monitoramento em tempo real dos serviços conectados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-eregulariza-surface rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-eregulariza-secondary rounded-full"></div>
                <span className="font-medium">Supabase Database</span>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Online
                </Badge>
                <p className="text-xs text-gray-500 mt-1">
                  Verificado {getServiceStatus('supabase').lastCheck}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-eregulariza-surface rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-eregulariza-secondary rounded-full"></div>
                <span className="font-medium">Twilio SMS</span>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Online
                </Badge>
                <p className="text-xs text-gray-500 mt-1">
                  Verificado {getServiceStatus('twilio').lastCheck}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-eregulariza-surface rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-eregulariza-secondary rounded-full"></div>
                <span className="font-medium">Sistema Principal</span>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Online
                </Badge>
                <p className="text-xs text-gray-500 mt-1">
                  Verificado {getServiceStatus('system').lastCheck}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="section-title flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              Informações da Plataforma
            </CardTitle>
            <CardDescription>
              Dados sobre atualizações e versão do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Versão Atual</span>
                <span className="font-medium">v2.1.3</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Última Atualização</span>
                <span className="font-medium">15 Jan 2025</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ambiente</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  Produção
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="font-medium text-eregulariza-secondary">99.9%</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle className="h-4 w-4" />
                <span>Próxima manutenção: 20 Jan 2025, 02:00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
