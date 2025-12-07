import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Clock, User, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { documentValidationService, DocumentAuditLog } from "@/services/documentValidationService";
import { formatRelativeTime } from "@/utils/dateUtils";

interface DocumentAuditHistoryProps {
  documentId: string;
  documentName: string;
}

export default function DocumentAuditHistory({ documentId, documentName }: DocumentAuditHistoryProps) {
  const [auditLogs, setAuditLogs] = useState<DocumentAuditLog[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && auditLogs.length === 0) {
      loadAuditLogs();
    }
  }, [isOpen, documentId]);

  const loadAuditLogs = async () => {
    setIsLoading(true);
    try {
      const logs = await documentValidationService.getDocumentAuditLogs(documentId);
      setAuditLogs(logs);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-blue-600" />;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      default:
        return 'Atualizado';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'rejeitado':
        return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Histórico de Validações
              </CardTitle>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-eregulariza-primary"></div>
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Nenhum histórico de validação encontrado.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {auditLogs.map((log, index) => (
                  <div key={log.id} className="border-l-2 border-gray-200 pl-4 pb-4 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{getActionText(log.action)}</span>
                            {log.previous_status && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                {getStatusBadge(log.previous_status)}
                                <span>→</span>
                                {getStatusBadge(log.new_status)}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <User className="h-3 w-3" />
                            <span>{log.reviewer?.name || 'Usuário desconhecido'}</span>
                            <span>•</span>
                            <span>{formatRelativeTime(log.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {log.observation && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-700">{log.observation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}