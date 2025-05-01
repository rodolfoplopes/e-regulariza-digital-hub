
import { CheckIcon, ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProcessStage {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  date?: string;
}

interface ProcessTimelineProps {
  stages: ProcessStage[];
  currentStageId: string;
}

export default function ProcessTimeline({ stages, currentStageId }: ProcessTimelineProps) {
  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-gray-200">
      {stages.map((stage, index) => {
        const isActive = stage.id === currentStageId;
        const isCompleted = stage.status === "completed";

        return (
          <div key={stage.id} className="relative pl-10">
            <div 
              className={cn(
                "absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border text-white",
                isCompleted ? "bg-green-500 border-green-600" : 
                isActive ? "bg-eregulariza-primary border-eregulariza-primary/70" : 
                "bg-gray-300 border-gray-400"
              )}
            >
              {isCompleted ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <ClockIcon className="h-4 w-4" />
              )}
            </div>
            <div className={cn(
              "rounded-lg border p-4",
              isActive ? "border-eregulariza-primary/20 bg-eregulariza-primary/5" : "bg-white"
            )}>
              <h3 className={cn(
                "font-medium",
                isActive ? "text-eregulariza-primary" : "text-gray-900"
              )}>
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
