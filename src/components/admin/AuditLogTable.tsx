import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { type AuditLog } from "@/hooks/useAuditLogs";
import { 
  getTargetTypeBadge, 
  getRoleChangeDisplay, 
  getActionTooltip 
} from "@/utils/auditLogUtils";

interface AuditLogTableProps {
  logs: AuditLog[];
}

export default function AuditLogTable({ logs }: AuditLogTableProps) {
  return (
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
  );
}