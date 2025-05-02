
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getFormattedDeadline, getDeadlineInfo } from "@/utils/dateUtils";
import ProcessTimeline, { ProcessStage } from "@/components/process/ProcessTimeline";
import ProcessMessages from "@/components/process/ProcessMessages";
import ProcessNotifications from "@/components/process/ProcessNotifications";
import DocumentManager from "@/components/process/DocumentManager";

// Mock process data
const process = {
  id: "proc-001",
  title: "Usucapião Extraordinária - Lote 123",
  type: "Usucapião",
  client: "João da Silva",
  status: "em_andamento",
  progress: 45,
  startDate: new Date("2023-03-15"),
  estimatedDays: 180,
  number: "ER-2305-0042",
  currentStage: "Análise Documental",
};

// Mock stages data
const stages: ProcessStage[] = [
  {
    id: "stage-1",
    title: "Análise Preliminar",
    description: "Verificação inicial da documentação e viabilidade do processo",
    status: "concluido",
    startDate: new Date("2023-03-15"),
    endDate: new Date("2023-03-22"),
    estimatedDays: 7,
  },
  {
    id: "stage-2",
    title: "Análise Documental",
    description: "Análise detalhada de toda a documentação fornecida",
    status: "em_andamento",
    startDate: new Date("2023-03-23"),
    estimatedDays: 30,
  },
  {
    id: "stage-3",
    title: "Elaboração da Petição",
    description: "Elaboração dos documentos legais para entrada do processo",
    status: "pendente",
    estimatedDays: 15,
  },
  {
    id: "stage-4",
    title: "Protocolo no Cartório",
    description: "Entrada do processo no cartório competente",
    status: "pendente",
    estimatedDays: 5,
  },
  {
    id: "stage-5",
    title: "Acompanhamento",
    description: "Acompanhamento do processo no cartório até sua conclusão",
    status: "pendente",
    estimatedDays: 120,
  },
];

export default function ProcessDetail() {
  const { processId } = useParams<{ processId: string }>();
  const [activeTab, setActiveTab] = useState("timeline");
  const [activeStage, setActiveStage] = useState(stages[1].id); // Currently active stage
  const { toast } = useToast();

  // Get deadline info
  const deadlineInfo = getDeadlineInfo(process.estimatedDays, process.startDate);

  // Find active stage details
  const currentStage = stages.find(stage => stage.id === activeStage);
  
  // Check if user is admin (in a real app, this would come from auth context)
  const isAdmin = true;

  // Format status for display
  const formatStatus = (status: string) => {
    switch (status) {
      case "em_andamento":
        return "Em Andamento";
      case "concluido":
        return "Concluído";
      case "pendente":
        return "Pendente";
      case "rejeitado":
        return "Rejeitado";
      default:
        return status;
    }
  };

  // Get status badge styling
  const getStatusClass = (status: string) => {
    switch (status) {
      case "em_andamento":
        return "bg-blue-100 text-blue-800";
      case "concluido":
        return "bg-green-100 text-green-800";
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "rejeitado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{process.title}</h1>
              <p className="text-gray-500">
                Processo: {process.number} • Cliente: {process.client}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap md:text-base md:px-4 md:py-1.5 inline-flex items-center gap-1.5 
                              ${getStatusClass(process.status)}`}>
                {formatStatus(process.status)}
              </div>
              
              {isAdmin && (
                <Button variant="outline">Editar Processo</Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium">Progresso Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Progress value={process.progress} className="h-2" />
                  <span className="text-sm font-medium">{process.progress}%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium">Prazo Estimado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {process.estimatedDays} dias ({getFormattedDeadline(process.estimatedDays, process.startDate)})
                </p>
                <p className={`text-sm ${deadlineInfo.status === 'late' ? 'text-red-500' : 
                              deadlineInfo.status === 'approaching' ? 'text-yellow-500' : 'text-green-500'}`}>
                  {deadlineInfo.remainingDays > 0 
                    ? `${deadlineInfo.remainingDays} dias restantes` 
                    : `${Math.abs(deadlineInfo.remainingDays)} dias de atraso`}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium">Etapa Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{process.currentStage}</p>
                <p className="text-sm text-gray-500">
                  {stages.find(stage => stage.title === process.currentStage)?.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Linha do Tempo do Processo</CardTitle>
                <CardDescription>
                  Acompanhe o progresso de cada etapa do seu processo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProcessTimeline 
                  stages={stages} 
                  activeStage={activeStage}
                  onStageClick={(stageId) => setActiveStage(stageId)}
                  isAdmin={isAdmin}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            {currentStage && (
              <DocumentManager
                processId={process.id}
                etapaId={currentStage.id}
                etapaNome={currentStage.title}
                isAdmin={isAdmin}
              />
            )}
          </TabsContent>
          
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Mensagens</CardTitle>
                <CardDescription>
                  Comunicações relacionadas a este processo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProcessMessages processId={process.id} isAdmin={isAdmin} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                  Histórico de notificações relacionadas a este processo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProcessNotifications processId={process.id} isAdmin={isAdmin} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
