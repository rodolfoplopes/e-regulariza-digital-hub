import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, CheckCircle, AlertTriangle, FileText, Calendar, File, MessageSquare, X, FileWarning, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ProcessProps {
  id: string;
  title: string;
  type: string;
  status: "pendente" | "em_andamento" | "concluido" | "rejeitado";
  progress: number;
  lastUpdate: string;
  nextAction?: string;
  deadline?: string;
  pendingDocuments?: number;
}

export default function ProcessCard({ process }: { process: ProcessProps }) {
  const statusLabels = {
    pendente: "Pendente",
    em_andamento: "Em Andamento",
    concluido: "Concluído",
    rejeitado: "Rejeitado"
  };

  const statusClasses = {
    pendente: "status-badge-pending",
    em_andamento: "status-badge-in-progress",
    concluido: "status-badge-completed",
    rejeitado: "status-badge-rejected"
  };

  // Status icons mapping
  const statusIcons = {
    pendente: <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />,
    em_andamento: <Clock className="h-4 w-4 mr-1 text-blue-500" />,
    concluido: <CheckCircle className="h-4 w-4 mr-1 text-green-500" />,
    rejeitado: <X className="h-4 w-4 mr-1 text-red-500" />
  };

  // Process type icons mapping
  const typeIcons = {
    "Usucapião": <File className="h-4 w-4 mr-1 text-eregulariza-primary" />,
    "Regularização": <Calendar className="h-4 w-4 mr-1 text-eregulariza-primary" />,
    "Inventário": <FileText className="h-4 w-4 mr-1 text-eregulariza-primary" />,
    "Retificação": <MessageSquare className="h-4 w-4 mr-1 text-eregulariza-primary" />
  };

  // Default icon for process types not in the mapping
  const defaultTypeIcon = <File className="h-4 w-4 mr-1 text-eregulariza-primary" />;

  // Get process type icon
  const getTypeIcon = (type: string) => {
    return typeIcons[type as keyof typeof typeIcons] || defaultTypeIcon;
  };

  // Get next expected action based on status if not provided
  const getNextAction = () => {
    if (process.nextAction) {
      return process.nextAction;
    }
    
    switch (process.status) {
      case "pendente":
        return "Aguardando documentação inicial";
      case "em_andamento":
        return "Análise em andamento";
      case "concluido":
        return "Processo finalizado";
      case "rejeitado":
        return "Revisão necessária";
      default:
        return "Verificar status com suporte";
    }
  };

  // Get next action icon based on status
  const getNextActionIcon = () => {
    if (process.pendingDocuments && process.pendingDocuments > 0) {
      return <FileWarning className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />;
    }
    
    switch (process.status) {
      case "pendente":
        return <FileText className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />;
      case "em_andamento":
        return <CalendarClock className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />;
      case "concluido":
        return <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />;
      case "rejeitado":
        return <AlertTriangle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />;
      default:
        return <ArrowRight className="h-4 w-4 text-[#06D7A5] mr-2 flex-shrink-0" />;
    }
  };

  // Get progress color based on progress value
  const getProgressColor = () => {
    if (process.progress < 25) return "bg-red-500";
    if (process.progress < 50) return "bg-yellow-500";
    if (process.progress < 75) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <Card className="card-hover transition-all hover:border-eregulariza-primary/30">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center">
            {getTypeIcon(process.type)}
            <span className="font-bold">{process.title}</span>
          </CardTitle>
          <Badge className={cn(
            "transition-all duration-300 flex items-center",
            process.status === "pendente" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" :
            process.status === "em_andamento" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" :
            process.status === "concluido" ? "bg-green-100 text-green-800 hover:bg-green-200" :
            "bg-red-100 text-red-800 hover:bg-red-200"
          )}>
            {statusIcons[process.status]}
            {statusLabels[process.status]}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 ml-5">{process.type}</p>
      </CardHeader>
      <CardContent className="py-2">
        <div className="bg-gray-50 p-3 rounded-md mb-3 border-l-4 border-[#06D7A5] flex items-center shadow-sm hover:shadow-md transition-all duration-300">
          {getNextActionIcon()}
          <span className="text-sm font-medium">Próxima ação: {getNextAction()}</span>
        </div>
        
        {process.pendingDocuments && process.pendingDocuments > 0 && (
          <div className="bg-yellow-50 p-2 rounded-md mb-3 border-l-4 border-yellow-500 flex items-center">
            <FileWarning className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
            <span className="text-sm text-yellow-800">
              {process.pendingDocuments} documento{process.pendingDocuments > 1 ? 's' : ''} pendente{process.pendingDocuments > 1 ? 's' : ''}
            </span>
          </div>
        )}
        
        {process.deadline && (
          <div className="flex items-center mb-2 text-sm">
            <CalendarClock className="h-4 w-4 text-gray-500 mr-1" />
            <span>Prazo: <span className="font-semibold">{process.deadline}</span></span>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso</span>
            <span className="font-medium">{process.progress}%</span>
          </div>
          <Progress 
            value={process.progress} 
            className={cn(
              "h-2 transition-all duration-300",
              getProgressColor()
            )}
          />
          <p className="text-xs text-gray-500 flex items-center mt-2">
            <Clock className="h-3 w-3 mr-1 inline text-gray-400" />
            Última atualização: {process.lastUpdate}
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild variant="outline" className="w-full hover:border-eregulariza-primary hover:text-eregulariza-primary transition-all duration-300 hover:shadow-sm">
          <Link to={`/processo/${process.id}`} className="flex items-center justify-center gap-2">
            Ver detalhes
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
