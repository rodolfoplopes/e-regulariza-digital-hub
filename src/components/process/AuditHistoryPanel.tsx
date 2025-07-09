import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  History,
  Clock,
  User,
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  Trash2,
  Plus,
  Filter,
  Calendar,
} from 'lucide-react';
import { useAuditHistory } from '@/hooks/useAuditHistory';
import { usePermissions } from '@/hooks/usePermissions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AuditHistoryPanelProps {
  processId: string;
  trigger?: React.ReactNode;
}

export default function AuditHistoryPanel({ processId, trigger }: AuditHistoryPanelProps) {
  const { logs, isLoading, error, refetch } = useAuditHistory(processId);
  const { isViewer } = usePermissions();
  const [actionFilter, setActionFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Only show for users with viewer permissions or higher
  if (!isViewer) {
    return null;
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'UPLOAD_DOCUMENT':
        return <Upload className="h-4 w-4 text-blue-500" />;
      case 'APPROVE_DOCUMENT':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'REJECT_DOCUMENT':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'DELETE_DOCUMENT':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'ADD_DOCUMENT_REQUIREMENT':
        return <Plus className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'UPLOAD_DOCUMENT':
        return 'Documento enviado';
      case 'APPROVE_DOCUMENT':
        return 'Documento aprovado';
      case 'REJECT_DOCUMENT':
        return 'Documento rejeitado';
      case 'DELETE_DOCUMENT':
        return 'Documento removido';
      case 'ADD_DOCUMENT_REQUIREMENT':
        return 'Requisito adicionado';
      default:
        return action;
    }
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'UPLOAD_DOCUMENT':
        return 'secondary' as const;
      case 'APPROVE_DOCUMENT':
        return 'default' as const;
      case 'REJECT_DOCUMENT':
        return 'destructive' as const;
      case 'DELETE_DOCUMENT':
        return 'destructive' as const;
      case 'ADD_DOCUMENT_REQUIREMENT':
        return 'outline' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getActionDescription = (log: any) => {
    const adminName = log.admin_name || 'Usuário';
    const targetName = log.target_name || 'item';
    
    switch (log.action) {
      case 'UPLOAD_DOCUMENT':
        return `${adminName} enviou o documento "${targetName}"`;
      case 'APPROVE_DOCUMENT':
        return `${adminName} aprovou o documento "${targetName}"`;
      case 'REJECT_DOCUMENT':
        const feedback = log.details?.feedback ? ` - ${log.details.feedback}` : '';
        return `${adminName} rejeitou o documento "${targetName}"${feedback}`;
      case 'DELETE_DOCUMENT':
        return `${adminName} removeu o documento "${targetName}"`;
      case 'ADD_DOCUMENT_REQUIREMENT':
        return `${adminName} adicionou o requisito "${targetName}"`;
      default:
        return `${adminName} realizou ação em "${targetName}"`;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesAction = !actionFilter || log.action === actionFilter;
    const matchesSearch = !searchTerm || 
      log.target_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.admin_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesAction && matchesSearch;
  });

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <History className="h-4 w-4 mr-2" />
      Histórico
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Auditoria
          </DialogTitle>
          <DialogDescription>
            Registro cronológico de todas as ações realizadas nos documentos deste processo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Buscar por documento ou usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as ações</SelectItem>
                <SelectItem value="UPLOAD_DOCUMENT">Envio</SelectItem>
                <SelectItem value="APPROVE_DOCUMENT">Aprovação</SelectItem>
                <SelectItem value="REJECT_DOCUMENT">Rejeição</SelectItem>
                <SelectItem value="DELETE_DOCUMENT">Remoção</SelectItem>
                <SelectItem value="ADD_DOCUMENT_REQUIREMENT">Requisito</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={refetch} variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>Erro ao carregar histórico: {error}</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum evento encontrado</p>
                <p className="text-sm">Ajuste os filtros ou aguarde novas ações</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log, index) => (
                  <Card key={log.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {getActionIcon(log.action)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={getActionBadgeVariant(log.action)}>
                              {getActionLabel(log.action)}
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-2">
                            {getActionDescription(log)}
                          </p>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <User className="h-3 w-3" />
                            <span>{log.admin_name || 'Usuário desconhecido'}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}