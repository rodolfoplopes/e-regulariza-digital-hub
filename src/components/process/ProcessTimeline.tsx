
import { CheckIcon, ClockIcon, AlertTriangle, FileText } from "lucide-react";
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

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-gray-200">
      {stages.map((stage, index) => {
        const isActive = activeStage ? stage.id === activeStage : stage.id === currentStageId;
        const isCompleted = stage.status === "completed" || stage.status === "concluido";
        const isInProgress = stage.status === "in_progress" || stage.status === "em_andamento";

        return (
          <div 
            key={stage.id} 
            className={cn("relative pl-10 transition-all", 
              isActive ? "scale-[1.02]" : "",
              onStageClick ? "cursor-pointer hover:scale-[1.02]" : ""
            )}
            onClick={() => onStageClick && onStageClick(stage.id)}
          >
            <div 
              className={cn(
                "absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border text-white",
                isCompleted ? "bg-green-500 border-green-600" : 
                isActive ? "bg-[#06D7A5] border-[#06D7A5]/70" : 
                isInProgress ? "bg-blue-500 border-blue-600" :
                "bg-gray-300 border-gray-400"
              )}
            >
              {getStageIcon(stage.status)}
            </div>
            <div className={cn(
              "rounded-lg border p-4",
              isActive ? "border-[#06D7A5]/20 bg-[#06D7A5]/5" : "bg-white"
            )}>
              <h3 className={cn(
                "font-medium flex items-center",
                isActive ? "text-[#06D7A5]" : "text-gray-900"
              )}>
                {isCompleted && <CheckIcon className="h-4 w-4 mr-1 text-green-500" />}
                {isInProgress && <ClockIcon className="h-4 w-4 mr-1 text-blue-500" />}
                {!isCompleted && !isInProgress && <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />}
                {stage.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{stage.description}</p>
              {stage.date && (
                <p className="mt-1 text-xs text-gray-400">
                  {isCompleted ? "Concluído em: " : isActive ? "Iniciado em: " : "Previsto para: "}
                  {stage.date}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
