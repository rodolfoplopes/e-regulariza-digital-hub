
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarDays, FileText, Clock, CheckCircle, AlertTriangle, Eye, MessageSquare, Edit, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

export interface ProcessProps {
  id: string;
  title: string;
  type: string;
  status: "pendente" | "em_andamento" | "concluido" | "rejeitado";
  progress: number;
  lastUpdate: string;
  pendingDocuments?: number;
  deadline?: string;
  nextAction?: string;
  client?: {
    name: string;
    email: string;
  };
  process_number?: string;
  created_at?: string;
}

interface ProcessCardProps {
  process: ProcessProps;
}

export default function ProcessCard({ process }: ProcessCardProps) {
  const navigate = useNavigate();
  const { profile } = useSupabaseAuth();
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const isAdmin = profile?.role === 'admin' || 
                  profile?.role === 'admin_master' || 
                  profile?.role === 'admin_editor' || 
                  profile?.role === 'admin_viewer';

  const getStatusConfig = (status: ProcessProps["status"]) => {
    const configs = {
      pendente: {
        label: "Pendente",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: AlertTriangle,
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        progressColor: "bg-yellow-500"
      },
      em_andamento: {
        label: "Em Andamento",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock,
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        progressColor: "bg-blue-500"
      },
      concluido: {
        label: "Concluído",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        progressColor: "bg-green-500"
      },
      rejeitado: {
        label: "Rejeitado",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: AlertTriangle,
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        progressColor: "bg-red-500"
      }
    };
    return configs[status];
  };

  const statusConfig = getStatusConfig(process.status);
  const StatusIcon = statusConfig.icon;

  const handleViewProcess = async () => {
    setIsViewLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    navigate(`/processo/${process.id}`);
  };

  const handleOpenChat = async () => {
    setIsChatLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    navigate(`/processo/${process.id}?tab=chat`);
  };

  const handleEditProcess = () => {
    navigate(`/admin/processo/${process.id}/editar`);
  };

  const getDeadlineStatus = () => {
    if (!process.deadline) return null;
    
    const deadlineDate = new Date(process.deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'overdue', text: `${Math.abs(diffDays)} dia(s) em atraso`, color: 'text-red-600' };
    } else if (diffDays <= 3) {
      return { status: 'urgent', text: `${diffDays} dia(s) restante(s)`, color: 'text-orange-600' };
    } else {
      return { status: 'normal', text: `${diffDays} dia(s) restante(s)`, color: 'text-gray-600' };
    }
  };

  const deadlineInfo = getDeadlineStatus();
  const showClientWaiting = process.status === 'pendente' && process.nextAction;

  return (
    <TooltipProvider>
      <Card className={`card-hover border-2 ${statusConfig.bgColor} ${statusConfig.borderColor} transition-all duration-300 hover:shadow-lg`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-eregulariza-text leading-tight mb-1">
                {process.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm text-gray-600 font-medium">{process.type}</p>
                {process.process_number && (
                  <Badge variant="outline" className="text-xs">
                    {process.process_number}
                  </Badge>
                )}
              </div>
              {isAdmin && process.client && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <User className="h-3 w-3" />
                  <span>{process.client.name}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={`${statusConfig.color} flex items-center gap-1`}>
                <StatusIcon className="h-3 w-3" />
                {statusConfig.label}
              </Badge>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditProcess}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Progresso</span>
              <span className="text-sm font-semibold text-eregulariza-primary">{process.progress}%</span>
            </div>
            <div className="relative">
              <Progress 
                value={process.progress} 
                className="h-2"
              />
              {process.status === 'em_andamento' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
              <span>Última atualização: {process.lastUpdate}</span>
            </div>
            
            {process.pendingDocuments && process.pendingDocuments > 0 && (
              <div className="flex items-center text-sm text-orange-600">
                <FileText className="h-4 w-4 mr-2" />
                <span>{process.pendingDocuments} documento(s) pendente(s)</span>
              </div>
            )}
            
            {deadlineInfo && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`flex items-center text-sm ${deadlineInfo.color}`}>
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Prazo: {deadlineInfo.text}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Prazo final: {new Date(process.deadline!).toLocaleDateString()}</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {showClientWaiting && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <p className="text-sm text-amber-800 font-medium">Aguardando ação do cliente</p>
                </div>
                <p className="text-sm text-amber-700">{process.nextAction}</p>
              </div>
            )}
            
            {process.status === 'concluido' && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-800 font-medium">Processo concluído com sucesso!</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleViewProcess}
              disabled={isViewLoading}
              className="flex-1 bg-eregulariza-primary hover:bg-eregulariza-primary/90 text-white transition-all duration-300 transform hover:scale-105 focus:scale-95"
            >
              {isViewLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Carregando...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Processo
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleOpenChat}
              disabled={isChatLoading}
              variant="outline"
              className="flex-1 border-eregulariza-primary text-eregulariza-primary hover:bg-eregulariza-primary hover:text-white transition-all duration-300 transform hover:scale-105 focus:scale-95"
            >
              {isChatLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-eregulariza-primary border-t-transparent mr-2"></div>
                  Abrindo...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
