
import { CheckIcon, ClockIcon, AlertTriangle, FileText, ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface ProcessStage {
  id: string;
  title: string;
  description: string;
  status: "pendente" | "em_andamento" | "concluido" | "pending" | "in_progress" | "completed";
  date?: string;
  startDate?: Date;
  endDate?: Date;
  estimatedDays?: number;
  deadline?: string;
}

interface ProcessTimelineProps {
  stages: ProcessStage[];
  currentStageId?: string;
  activeStage?: string;
  onStageClick?: (stageId: string) => void;
  isAdmin?: boolean;
}

export default function ProcessTimeline({ 
  stages, 
  currentStageId, 
  activeStage, 
  onStageClick,
  isAdmin 
}: ProcessTimelineProps) {
  // Helper function to get the appropriate icon based on stage status
  const getStageIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "concluido":
        return <CheckIcon className="h-4 w-4" />;
      case "in_progress":
      case "em_andamento":
        return <ClockIcon className="h-4 w-4" />;
      case "pending":
      case "pendente":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Helper function to get the next action text based on stage status
  const getStatusText = (stage: ProcessStage) => {
    switch (stage.status) {
      case "completed":
      case "concluido":
        return "Etapa concluída";
      case "in_progress":
      case "em_andamento":
        return "Em andamento";
      case "pending":
      case "pendente":
        return "Aguardando início";
      default:
        return "Status indeterminado";
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // Calculate estimated completion date
  const getEstimatedDate = (stage: ProcessStage) => {
    if (stage.deadline) {
      return formatDate(stage.deadline);
    }
    if (stage.estimatedDays) {
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + stage.estimatedDays);
      return estimatedDate.toLocaleDateString('pt-BR');
    }
    return null;
  };

  if (!stages || stages.length === 0) {
    return (
      <div className="text-center py-8 text-eregulariza-description">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Nenhuma etapa encontrada para este processo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stages.map((stage, index) => {
        const isActive = activeStage ? stage.id === activeStage : stage.id === currentStageId;
        const isCompleted = stage.status === "completed" || stage.status === "concluido";
        const isInProgress = stage.status === "in_progress" || stage.status === "em_andamento";
        const isPending = stage.status === "pending" || stage.status === "pendente";

        return (
          <Card 
            key={stage.id} 
            className={cn(
              "relative transition-all duration-300 hover:shadow-md", 
              isCompleted ? "border-green-200 bg-green-50/50" :
              isInProgress ? "border-blue-200 bg-blue-50/50" :
              isPending ? "border-gray-200 bg-white" : "border-gray-200",
              isActive ? "ring-2 ring-eregulariza-primary/20" : "",
              onStageClick ? "cursor-pointer hover:scale-[1.01]" : ""
            )}
            onClick={() => onStageClick && onStageClick(stage.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Timeline icon */}
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-white transition-all duration-300 shrink-0",
                  isCompleted ? "bg-green-500 border-green-600" : 
                  isInProgress ? "bg-blue-500 border-blue-600" :
                  isPending ? "bg-gray-400 border-gray-500" :
                  "bg-gray-300 border-gray-400"
                )}>
                  {getStageIcon(stage.status)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <h3 className={cn(
                      "font-semibold text-lg flex items-center gap-2",
                      isCompleted ? "text-green-700" :
                      isInProgress ? "text-blue-700" :
                      "text-eregulariza-gray"
                    )}>
                      {stage.title}
                      {isInProgress && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Em andamento
                        </span>
                      )}
                    </h3>
                    
                    {/* Status indicator */}
                    <div className={cn(
                      "text-xs px-3 py-1 rounded-full font-medium",
                      isCompleted ? "bg-green-100 text-green-800" :
                      isInProgress ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-600"
                    )}>
                      {getStatusText(stage)}
                    </div>
                  </div>

                  <p className="text-eregulariza-description mb-4">
                    {stage.description}
                  </p>

                  {/* Date information */}
                  <div className="flex flex-wrap gap-4 text-sm text-eregulariza-description">
                    {stage.date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {isCompleted ? "Concluído em: " : 
                           isInProgress ? "Iniciado em: " : 
                           "Previsto para: "}
                          {formatDate(stage.date)}
                        </span>
                      </div>
                    )}
                    
                    {!isCompleted && getEstimatedDate(stage) && (
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>Prazo: {getEstimatedDate(stage)}</span>
                      </div>
                    )}
                    
                    {stage.estimatedDays && !isCompleted && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        <span>
                          Estimativa: {stage.estimatedDays} {stage.estimatedDays === 1 ? 'dia' : 'dias'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Next action for current stage */}
                  {isInProgress && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-700">
                        <ArrowRight className="h-4 w-4" />
                        <span className="font-medium">
                          Etapa atual - {stage.title}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Connector line for non-last items */}
              {index < stages.length - 1 && (
                <div className="absolute left-9 top-16 bottom-0 w-0.5 bg-gray-200"></div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
