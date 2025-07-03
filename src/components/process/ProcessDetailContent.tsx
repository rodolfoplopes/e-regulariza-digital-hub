
import { MessageSquare, FileText, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProcessTimeline from "@/components/process/ProcessTimeline";
import EnhancedChat from "@/components/process/EnhancedChat";
import DocumentManager from "@/components/process/DocumentManager";
import ManualStepEditor from "@/components/process/ManualStepEditor";
import { ProcessWithDetails } from "@/services/core/types";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface ProcessDetailContentProps {
  process: ProcessWithDetails;
  isAdmin: boolean;
  onProcessUpdate?: () => void;
}

export default function ProcessDetailContent({ 
  process, 
  isAdmin, 
  onProcessUpdate 
}: ProcessDetailContentProps) {
  const { profile } = useSupabaseAuth();

  // Helper function to normalize status to ProcessStage type
  const normalizeStatus = (status: string): "pendente" | "em_andamento" | "concluido" | "pending" | "in_progress" | "completed" => {
    switch (status) {
      case 'pendente':
      case 'pending':
        return 'pendente';
      case 'em_andamento':
      case 'in_progress':
        return 'em_andamento';
      case 'concluido':
      case 'completed':
        return 'concluido';
      default:
        return 'pendente'; // fallback to pendente
    }
  };

  // Convert process steps to timeline format
  const timelineStages = process.steps?.map(step => ({
    id: step.id,
    title: step.title,
    description: step.description || '',
    status: normalizeStatus(step.status),
    date: step.completed_at || step.deadline?.toString(),
    estimatedDays: step.deadline ? Math.ceil((new Date(step.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : undefined,
  })) || [];

  return (
    <Tabs defaultValue="timeline" className="space-y-4">
      <TabsList>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="chat">
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat
        </TabsTrigger>
        <TabsTrigger value="documents">
          <FileText className="h-4 w-4 mr-2" />
          Documentos
        </TabsTrigger>
        {isAdmin && (
          <TabsTrigger value="manage">
            <Settings className="h-4 w-4 mr-2" />
            Gerenciar
          </TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="timeline">
        <ProcessTimeline stages={timelineStages} />
      </TabsContent>
      
      <TabsContent value="chat">
        <EnhancedChat processId={process.id} />
      </TabsContent>
      
      <TabsContent value="documents">
        <DocumentManager 
          processId={process.id}
          etapaId="current"
          etapaNome="Documentos do Processo"
          isAdmin={isAdmin}
        />
      </TabsContent>

      {isAdmin && (
        <TabsContent value="manage">
          <ManualStepEditor
            processId={process.id}
            processTitle={process.title}
            clientId={process.client_id}
            onStepsChange={onProcessUpdate}
          />
        </TabsContent>
      )}
    </Tabs>
  );
}
