
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, FileText, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import ProcessTimeline from "@/components/process/ProcessTimeline";
import EnhancedChat from "@/components/process/EnhancedChat";
import DocumentManager from "@/components/process/DocumentManager";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { processService, type ProcessWithDetails } from "@/services/supabaseService";

export default function ProcessDetail() {
  const { processId } = useParams();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [process, setProcess] = useState<ProcessWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useSupabaseAuth();

  useEffect(() => {
    const fetchProcess = async () => {
      if (!processId) return;
      
      try {
        setIsLoading(true);
        const data = await processService.getProcessById(processId);
        setProcess(data);
      } catch (error) {
        console.error('Error fetching process:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcess();
  }, [processId]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eregulariza-primary"></div>
          </main>
        </div>
      </div>
    );
  }

  if (!process) {
    return (
      <div className="flex h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Processo não encontrado</h2>
              <p className="text-gray-500 mt-2">O processo solicitado não foi encontrado.</p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="mt-4"
              >
                Voltar ao Dashboard
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800';
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluido':
        return 'Concluído';
      case 'rejeitado':
        return 'Rejeitado';
      default:
        return status;
    }
  };

  // Convert process steps to timeline format
  const timelineStages = process.process_steps?.map(step => ({
    id: step.id,
    title: step.title,
    description: step.description || '',
    status: step.status,
    date: step.completed_at || step.deadline?.toString(),
    estimatedDays: step.deadline ? Math.ceil((new Date(step.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : undefined,
  })) || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{process.title}</h1>
                <p className="text-gray-500">Processo {process.process_number}</p>
              </div>
              <Badge className={getStatusColor(process.status)}>
                {getStatusText(process.status)}
              </Badge>
            </div>
          </div>

          {/* Process Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tipo de Processo</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{process.process_type?.name}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progresso</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{process.progress || 0}%</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cliente</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{process.client?.name}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
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
                isAdmin={profile?.role === 'admin'}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
