
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
import { Calendar, Filter, Search, User, FileText, Users, Settings } from "lucide-react";
import { auditService } from "@/services/auditService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eregulariza-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Logs de Auditoria
        </CardTitle>
        <CardDescription>
          Registro completo de ações realizadas por administradores do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Buscar por ação..."
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            className="flex-1"
          />
          
          <Select value={filters.target_type} onValueChange={(value) => setFilters({ ...filters, target_type: value })}>
            <SelectTrigger className="w-full sm:w-[200px]">
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
            <Button onClick={handleFilter} variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button onClick={clearFilters} variant="ghost" size="sm">
              Limpar
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Administrador</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Entidade Afetada</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{log.admin_name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{log.action}</div>
                  </TableCell>
                  <TableCell>
                    {getTargetTypeBadge(log.target_type)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {log.target_name || log.target_id || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.details && (
                      <div className="text-xs text-gray-600 max-w-xs truncate">
                        {JSON.stringify(log.details)}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              
              {logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Nenhum log de auditoria encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
