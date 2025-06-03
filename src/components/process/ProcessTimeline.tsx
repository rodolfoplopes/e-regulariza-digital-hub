
import { CheckIcon, ClockIcon, AlertTriangle, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProcessStage {
  id: string;
  title: string;
  description: string;
  status: "pendente" | "em_andamento" | "concluido" | "pending" | "in_progress" | "completed";
  date?: string;
  startDate?: Date;
  endDate?: Date;
  estimatedDays?: number;
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
  const getNextActionText = (stage: ProcessStage) => {
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
    if (!dateString) return "Data não definida";
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString; // Fallback to the string if parsing fails
    }
  };

  if (!stages || stages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Nenhuma etapa encontrada para este processo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-gray-200">
      {stages.map((stage, index) => {
        const isActive = activeStage ? stage.id === activeStage : stage.id === currentStageId;
        const isCompleted = stage.status === "completed" || stage.status === "concluido";
        const isInProgress = stage.status === "in_progress" || stage.status === "em_andamento";

        return (
          <div 
            key={stage.id} 
            className={cn(
              "relative pl-10 transition-all duration-300 ease-in-out", 
              isActive ? "scale-[1.02]" : "",
              onStageClick ? "cursor-pointer hover:scale-[1.02]" : ""
            )}
            onClick={() => onStageClick && onStageClick(stage.id)}
          >
            <div 
              className={cn(
                "absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border text-white transition-all duration-300",
                isCompleted ? "bg-green-500 border-green-600" : 
                isActive ? "bg-[#06D7A5] border-[#06D7A5]/70 shadow-md" : 
                isInProgress ? "bg-blue-500 border-blue-600" :
                "bg-gray-300 border-gray-400"
              )}
            >
              {getStageIcon(stage.status)}
            </div>
            <div className={cn(
              "rounded-lg border p-4 shadow-sm transition-all duration-300 hover:shadow-md",
              isActive ? "border-[#06D7A5]/30 bg-[#06D7A5]/5" : 
              isCompleted ? "border-green-100 bg-green-50" :
              isInProgress ? "border-blue-100 bg-blue-50" :
              "bg-white"
            )}>
              <h3 className={cn(
                "font-bold flex items-center",
                isActive ? "text-[#06D7A5]" : 
                isCompleted ? "text-green-600" :
                isInProgress ? "text-blue-600" :
                "text-gray-900"
              )}>
                {isCompleted && <CheckIcon className="h-4 w-4 mr-1 text-green-500" />}
                {isInProgress && <ClockIcon className="h-4 w-4 mr-1 text-blue-500" />}
                {!isCompleted && !isInProgress && <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />}
                {stage.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{stage.description}</p>
              
              {isActive && (
                <div className="mt-3 bg-[#06D7A5]/10 p-2 rounded-md flex items-center transition-all duration-300 hover:bg-[#06D7A5]/20">
                  <ArrowRight className="h-4 w-4 text-[#06D7A5] mr-1" />
                  <span className="text-sm font-medium text-[#06D7A5]">
                    Próxima ação: {getNextActionText(stage)}
                  </span>
                </div>
              )}
              
              {stage.date && (
                <p className="mt-2 text-xs flex items-center text-gray-500">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  {isCompleted ? "Concluído em: " : 
                   isActive ? "Iniciado em: " : 
                   "Previsto para: "}
                  {formatDate(stage.date)}
                </p>
              )}
              
              {stage.estimatedDays && !isCompleted && (
                <p className="mt-1 text-xs text-gray-500">
                  Estimativa: {stage.estimatedDays} {stage.estimatedDays === 1 ? 'dia' : 'dias'}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
