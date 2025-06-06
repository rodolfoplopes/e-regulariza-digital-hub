
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar, Filter, Search, User, FileText, Users, Settings, ArrowRight } from "lucide-react";
import { auditService } from "@/services/auditService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import BackButton from "./BackButton";

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

export default function AuditLogPanel() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
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

  const getTargetIcon = (targetType: string) => {
    switch (targetType) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'process':
        return <FileText className="h-4 w-4" />;
      case 'client':
        return <Users className="h-4 w-4" />;
      case 'system':
        return <Settings className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTargetTypeBadge = (targetType: string) => {
    const config = {
      user: { label: 'Usuário', variant: 'default' as const },
      process: { label: 'Processo', variant: 'secondary' as const },
      client: { label: 'Cliente', variant: 'outline' as const },
      system: { label: 'Sistema', variant: 'destructive' as const },
    };

    const typeConfig = config[targetType as keyof typeof config] || config.system;

    return (
      <Badge variant={typeConfig.variant} className="flex items-center gap-1">
        {getTargetIcon(targetType)}
        {typeConfig.label}
      </Badge>
    );
  };

  const getRoleChangeDisplay = (log: AuditLog) => {
    if (log.details && log.details.old_role && log.details.new_role) {
      const getRoleLabel = (role: string) => {
        switch (role) {
          case 'admin_master': return 'Super Admin';
          case 'admin': return 'Admin';
          case 'admin_editor': return 'Editor';
          case 'admin_viewer': return 'Viewer';
          default: return role;
        }
      };

      return (
        <div className="flex items-center gap-2 text-sm">
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
            {getRoleLabel(log.details.old_role)}
          </span>
          <ArrowRight className="h-3 w-3 text-gray-400" />
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
            {getRoleLabel(log.details.new_role)}
          </span>
        </div>
      );
    }
    return null;
  };

  const getActionTooltip = (log: AuditLog) => {
    let description = `Ação realizada por ${log.admin_name}`;
    
    if (log.details) {
      if (log.details.old_role && log.details.new_role) {
        description += ` - Alterou permissão de ${log.details.old_role} para ${log.details.new_role}`;
      }
      if (log.details.user_email) {
        description += ` - Email: ${log.details.user_email}`;
      }
    }
    
    return description;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eregulariza-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <BackButton />
          
          <Card className="shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="page-title flex items-center gap-2">
                <Search className="h-5 w-5" />
                Logs de Auditoria
              </CardTitle>
              <CardDescription>
                Registro completo de ações realizadas por administradores do sistema
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6">
              {/* Filters */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <Input
                    placeholder="Buscar por ação..."
                    value={filters.action}
                    onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                    className="flex-1 bg-white"
                  />
                  
                  <Select value={filters.target_type} onValueChange={(value) => setFilters({ ...filters, target_type: value })}>
                    <SelectTrigger className="w-full lg:w-[200px] bg-white">
                      <SelectValue placeholder="Tipo de entidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os tipos</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="process">Processo</SelectItem>
                      <SelectItem value="client">Cliente</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Button onClick={handleFilter} variant="outline" size="sm" className="bg-white">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtrar
                    </Button>
                    <Button onClick={clearFilters} variant="ghost" size="sm">
                      Limpar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Logs Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow className="border-b border-gray-200">
                        <TableHead className="font-medium text-gray-900">Data/Hora</TableHead>
                        <TableHead className="font-medium text-gray-900">Administrador</TableHead>
                        <TableHead className="font-medium text-gray-900">Ação</TableHead>
                        <TableHead className="font-medium text-gray-900">Tipo</TableHead>
                        <TableHead className="font-medium text-gray-900">Entidade</TableHead>
                        <TableHead className="font-medium text-gray-900 hidden lg:table-cell">Alteração</TableHead>
                        <TableHead className="font-medium text-gray-900 hidden xl:table-cell">Detalhes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id} className="hover:bg-gray-50 border-b border-gray-100">
                          <TableCell className="font-mono text-sm py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-xs">
                                {format(new Date(log.created_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                              </span>
                            </div>
                          </TableCell>
                          
                          <TableCell className="py-4">
                            <div className="font-medium text-gray-900">{log.admin_name}</div>
                          </TableCell>
                          
                          <TableCell className="py-4">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="font-medium text-gray-900 cursor-help hover:text-blue-600 transition-colors">
                                    {log.action}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{getActionTooltip(log)}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          
                          <TableCell className="py-4">
                            {getTargetTypeBadge(log.target_type)}
                          </TableCell>
                          
                          <TableCell className="py-4">
                            <div className="text-sm">
                              {log.target_name || log.target_id || 'N/A'}
                            </div>
                          </TableCell>
                          
                          <TableCell className="py-4 hidden lg:table-cell">
                            {getRoleChangeDisplay(log) || '—'}
                          </TableCell>
                          
                          <TableCell className="py-4 hidden xl:table-cell">
                            {log.details && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="text-xs text-gray-600 max-w-xs truncate cursor-help">
                                      {JSON.stringify(log.details)}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <pre className="text-xs max-w-sm whitespace-pre-wrap">
                                      {JSON.stringify(log.details, null, 2)}
                                    </pre>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {logs.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                            <div className="space-y-2">
                              <p>Nenhum log de auditoria encontrado</p>
                              <p className="text-sm">Ajuste os filtros para ver mais resultados</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
