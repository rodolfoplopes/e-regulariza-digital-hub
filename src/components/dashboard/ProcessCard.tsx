
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, FileText, Clock, CheckCircle, AlertTriangle, Eye, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
}

interface ProcessCardProps {
  process: ProcessProps;
}

export default function ProcessCard({ process }: ProcessCardProps) {
  const navigate = useNavigate();
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const getStatusConfig = (status: ProcessProps["status"]) => {
    const configs = {
      pendente: {
        label: "Pendente",
        color: "status-badge-pending",
        icon: AlertTriangle,
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200"
      },
      em_andamento: {
        label: "Em Andamento",
        color: "status-badge-in-progress",
        icon: Clock,
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
      },
      concluido: {
        label: "Concluído",
        color: "status-badge-completed",
        icon: CheckCircle,
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      },
      rejeitado: {
        label: "Rejeitado",
        color: "status-badge-rejected",
        icon: AlertTriangle,
        bgColor: "bg-red-50",
        borderColor: "border-red-200"
      }
    };
    return configs[status];
  };

  const statusConfig = getStatusConfig(process.status);
  const StatusIcon = statusConfig.icon;

  const handleViewProcess = async () => {
    setIsViewLoading(true);
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 600));
    navigate(`/processo/${process.id}`);
  };

  const handleOpenChat = async () => {
    setIsChatLoading(true);
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 400));
    navigate(`/processo/${process.id}?tab=chat`);
  };

  return (
    <Card className={`card-hover border-2 ${statusConfig.bgColor} ${statusConfig.borderColor} transition-all duration-300`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-eregulariza-text leading-tight">
            {process.title}
          </CardTitle>
          <Badge className={`${statusConfig.color} status-badge flex items-center gap-1`}>
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 font-medium">{process.type}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Progresso</span>
            <span className="text-sm font-semibold text-eregulariza-primary">{process.progress}%</span>
          </div>
          <Progress value={process.progress} className="h-2" />
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
          
          {process.deadline && (
            <div className="flex items-center text-sm text-red-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>Prazo: {process.deadline}</span>
            </div>
          )}
          
          {process.nextAction && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800 font-medium">Próxima ação:</p>
              <p className="text-sm text-blue-700">{process.nextAction}</p>
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
  );
}
