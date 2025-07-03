
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Edit, 
  MessageSquare, 
  FileText,
  Calendar,
  User
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface ProcessProps {
  id: string;
  title: string;
  type: string;
  status: "pendente" | "em_andamento" | "concluido" | "rejeitado";
  progress: number;
  lastUpdate: string;
  deadline?: string;
  nextAction?: string;
  clientName?: string;
  processNumber?: string;
}

interface ProcessCardProps {
  process: ProcessProps;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pendente":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "em_andamento":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "concluido":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejeitado":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "pendente":
      return "Pendente";
    case "em_andamento":
      return "Em Andamento";
    case "concluido":
      return "Concluído";
    case "rejeitado":
      return "Rejeitado";
    default:
      return status;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pendente":
      return <Clock className="h-4 w-4" />;
    case "em_andamento":
      return <AlertTriangle className="h-4 w-4" />;
    case "concluido":
      return <CheckCircle className="h-4 w-4" />;
    case "rejeitado":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const isDeadlineNear = (deadline?: string) => {
  if (!deadline) return false;
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7 && diffDays >= 0;
};

const isOverdue = (deadline?: string) => {
  if (!deadline) return false;
  const deadlineDate = new Date(deadline);
  const today = new Date();
  return deadlineDate < today;
};

export default function ProcessCard({ process }: ProcessCardProps) {
  const { profile } = useSupabaseAuth();
  const isAdmin = profile?.role === 'admin' || 
                  profile?.role === 'admin_master' || 
                  profile?.role === 'admin_editor' || 
                  profile?.role === 'admin_viewer';

  const statusColor = getStatusColor(process.status);
  const statusText = getStatusText(process.status);
  const statusIcon = getStatusIcon(process.status);
  const nearDeadline = isDeadlineNear(process.deadline);
  const overdue = isOverdue(process.deadline);

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      process.status === 'pendente' ? 'border-l-4 border-l-yellow-400' :
      process.status === 'em_andamento' ? 'border-l-4 border-l-blue-400' :
      process.status === 'concluido' ? 'border-l-4 border-l-green-400' :
      'border-l-4 border-l-red-400'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-eregulariza-gray line-clamp-2">
              {process.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              {process.processNumber && (
                <span className="text-xs text-eregulariza-description font-mono">
                  {process.processNumber}
                </span>
              )}
              <Badge variant="outline" className="text-xs">
                {process.type}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge className={`${statusColor} border text-xs`}>
              {statusIcon}
              <span className="ml-1">{statusText}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-eregulariza-gray">Progresso</span>
            <span className="text-sm text-eregulariza-description">{process.progress}%</span>
          </div>
          <Progress 
            value={process.progress} 
            className={`h-2 ${
              process.status === 'em_andamento' ? 'animate-pulse' : ''
            }`}
          />
        </div>

        {/* Client Info (Admin view) */}
        {isAdmin && process.clientName && (
          <div className="flex items-center gap-2 text-sm text-eregulariza-description">
            <User className="h-4 w-4" />
            <span>{process.clientName}</span>
          </div>
        )}

        {/* Deadline Info */}
        {process.deadline && (
          <div className={`flex items-center gap-2 text-sm ${
            overdue ? 'text-red-600' : 
            nearDeadline ? 'text-yellow-600' : 
            'text-eregulariza-description'
          }`}>
            <Calendar className="h-4 w-4" />
            <span>Prazo: {process.deadline}</span>
            {overdue && <AlertTriangle className="h-4 w-4 text-red-500" />}
            {nearDeadline && !overdue && <Clock className="h-4 w-4 text-yellow-500" />}
          </div>
        )}

        {/* Next Action */}
        {process.nextAction && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">
              Próxima ação: {process.nextAction}
            </p>
          </div>
        )}

        {/* Last Update */}
        <div className="text-xs text-eregulariza-description">
          Última atualização: {process.lastUpdate}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link to={`/processo/${process.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Visualizar detalhes do processo</p>
            </TooltipContent>
          </Tooltip>

          {isAdmin && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/admin/processo/${process.id}/editar`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar processo</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/processo/${process.id}?tab=chat`}>
                  <MessageSquare className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chat do processo</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/processo/${process.id}?tab=documents`}>
                  <FileText className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Documentos do processo</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}
