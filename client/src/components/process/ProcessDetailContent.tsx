
import { MessageSquare, FileText, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProcessTimeline from "@/components/process/ProcessTimeline";
import EnhancedChat from "@/components/process/EnhancedChat";
import DocumentManager from "@/components/process/DocumentManager";
import ManualStepEditor from "@/components/process/ManualStepEditor";
import { ProcessWithDetails } from "@/services/core/types";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("timeline");

  // Handle tab parameter from URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['timeline', 'chat', 'documents', 'manage'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', tab);
    setSearchParams(newSearchParams);
  };

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
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-4">
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <span className="hidden sm:inline">Timeline</span>
            <span className="sm:hidden">📅</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Documentos</span>
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Gerenciar</span>
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="timeline" className="mt-6">
          <div className="bg-white rounded-lg border p-6">
            <ProcessTimeline stages={timelineStages} />
          </div>
        </TabsContent>
        
        <TabsContent value="chat" className="mt-6">
          <div className="bg-white rounded-lg border">
            <EnhancedChat processId={process.id} />
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <div className="bg-white rounded-lg border p-6">
            <DocumentManager 
              processId={process.id}
              etapaId="current"
              etapaNome="Documentos do Processo"
              isAdmin={isAdmin}
            />
          </div>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="manage" className="mt-6">
            <div className="bg-white rounded-lg border p-6">
              <ManualStepEditor
                processId={process.id}
                processTitle={process.title}
                clientId={process.client_id}
                onStepsChange={onProcessUpdate}
              />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
