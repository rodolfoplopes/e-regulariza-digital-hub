import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, FileText, MessageSquare } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import ProcessTimeline, { ProcessStage } from "@/components/process/ProcessTimeline";
import DocumentUploader, { DocumentType } from "@/components/process/DocumentUploader";
import ProcessMessages, { Message } from "@/components/process/ProcessMessages";
import ProcessNotifications, { Notification } from "@/components/process/ProcessNotifications";
import { useToast } from "@/hooks/use-toast";

export default function ProcessDetail() {
  const { processId } = useParams();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");
  const [stageDetailsOpen, setStageDetailsOpen] = useState<Record<string, boolean>>({});

  // Mock data - This would come from your API or state management
  const process = {
    id: processId || "proc-001",
    title: "Usucapião Extraordinária",
    type: "Usucapião",
    status: "em_andamento" as const,
    progress: 45,
    lastUpdate: "10/04/2023",
    description: "Processo de usucapião para regularização de imóvel localizado na Rua das Flores, 123, São Paulo/SP.",
    property: {
      address: "Rua das Flores, 123",
      city: "São Paulo",
      state: "SP",
      area: "150m²",
    },
    currentStageId: "stage-2"
  };

  // Mock stages data
  const stages: ProcessStage[] = [
    {
      id: "stage-1",
      title: "Análise Preliminar",
      description: "Verificação inicial da documentação e viabilidade do processo.",
      status: "completed",
      date: "15/03/2023"
    },
    {
      id: "stage-2",
      title: "Coleta de Documentos",
      description: "Recebimento e validação de toda documentação necessária.",
      status: "in_progress",
      date: "10/04/2023"
    },
    {
      id: "stage-3",
      title: "Elaboração da Petição",
      description: "Preparação dos documentos legais para o processo de usucapião.",
      status: "pending",
      date: "Previsto para 15/06/2023"
    },
    {
      id: "stage-4",
      title: "Protocolo no Cartório",
      description: "Entrada do processo no cartório de registro de imóveis.",
      status: "pending",
      date: "Previsto para 01/07/2023"
    },
    {
      id: "stage-5",
      title: "Acompanhamento e Prenotação",
      description: "Acompanhamento do andamento do processo no cartório.",
      status: "pending",
      date: "Previsto para 15/07/2023"
    },
    {
      id: "stage-6",
      title: "Registro da Matrícula",
      description: "Finalização do processo com o registro da nova matrícula.",
      status: "pending",
      date: "Previsto para 15/08/2023"
    }
  ];

  // Mock documents data
  const documents: Record<string, DocumentType[]> = {
    "stage-1": [
      {
        id: "doc-1",
        name: "RG e CPF",
        description: "Cópias do RG e CPF do proprietário",
        required: true,
        status: "approved",
        fileUrl: "/documents/rg-cpf.pdf",
        uploadDate: "16/03/2023"
      },
      {
        id: "doc-2",
        name: "Comprovante de Residência",
        description: "Comprovante de residência atual do proprietário",
        required: true,
        status: "approved",
        fileUrl: "/documents/comprovante.pdf",
        uploadDate: "16/03/2023"
      }
    ],
    "stage-2": [
      {
        id: "doc-3",
        name: "Certidão de Ônus Reais",
        description: "Certidão negativa de ônus reais do imóvel",
        required: true,
        status: "pending"
      },
      {
        id: "doc-4",
        name: "Comprovantes de Posse",
        description: "Documentos que comprovem a posse mansa e pacífica por 15 anos",
        required: true,
        status: "uploaded",
        fileUrl: "/documents/posse.pdf",
        uploadDate: "12/04/2023"
      },
      {
        id: "doc-5",
        name: "Declarações de Testemunhas",
        description: "Declarações assinadas por testemunhas que confirmem a posse",
        required: false,
        status: "pending"
      }
    ],
    "stage-3": [
      {
        id: "doc-6",
        name: "Memorial Descritivo",
        description: "Descrição técnica dos limites e confrontações do imóvel",
        required: true,
        status: "pending"
      },
      {
        id: "doc-7",
        name: "Planta do Imóvel",
        description: "Planta do imóvel assinada por profissional habilitado",
        required: true,
        status: "pending"
      }
    ]
  };

  // Mock messages data
  const messages: Message[] = [
    {
      id: "msg-1",
      content: "Olá, gostaria de saber quais documentos ainda preciso enviar para a etapa atual do processo.",
      sender: {
        id: "user-1",
        name: "João Silva",
        initials: "JS",
        type: "client"
      },
      timestamp: "10/04/2023 09:30"
    },
    {
      id: "msg-2",
      content: "Bom dia, João! Para a etapa atual, precisamos da Certidão de Ônus Reais do imóvel. O documento 'Comprovantes de Posse' que você enviou já está em análise pela nossa equipe.",
      sender: {
        id: "admin-1",
        name: "Maria Assessora",
        initials: "MA",
        type: "admin"
      },
      timestamp: "10/04/2023 10:15"
    },
    {
      id: "msg-3",
      content: "Entendi. Vou providenciar a certidão o quanto antes. Obrigado!",
      sender: {
        id: "user-1",
        name: "João Silva",
        initials: "JS",
        type: "client"
      },
      timestamp: "10/04/2023 10:20"
    }
  ];

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif-1",
      title: "Documento aprovado",
      message: "Seu documento 'RG e CPF' foi aprovado pela nossa equipe.",
      timestamp: "Hoje, 10:15",
      isRead: false,
      type: "document"
    },
    {
      id: "notif-2",
      title: "Nova mensagem",
      message: "Maria Assessora respondeu à sua dúvida sobre documentos.",
      timestamp: "Hoje, 09:30",
      isRead: false,
      type: "message"
    },
    {
      id: "notif-3",
      title: "Atualização de status",
      message: "Seu processo avançou para a etapa 'Coleta de Documentos'.",
      timestamp: "Ontem, 14:20",
      isRead: true,
      type: "status"
    },
    {
      id: "notif-4",
      title: "Prazo atualizado",
      message: "O prazo estimado para conclusão da etapa atual foi ajustado.",
      timestamp: "15/04/2023",
      isRead: true,
      type: "system"
    },
  ]);

  // Handlers for interactions
  const toggleStageDetails = (stageId: string) => {
    setStageDetailsOpen(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const handleDocumentUpload = async (documentId: string, file: File) => {
    console.log(`Uploading document ${documentId}:`, file);
    // This would call your API to upload the file
    
    // Add notification for document upload
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      title: "Documento enviado",
      message: `Seu documento '${file.name}' foi enviado e está aguardando aprovação.`,
      timestamp: "Agora",
      isRead: false,
      type: "document"
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    return Promise.resolve();
  };

  const handleDocumentRemove = async (documentId: string) => {
    console.log(`Removing document ${documentId}`);
    // This would call your API to remove the file
    return Promise.resolve();
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    console.log("Sending message:", content);
    if (attachments) {
      console.log("With attachments:", attachments);
    }
    
    // Add notification for new message
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      title: "Mensagem enviada",
      message: "Sua mensagem foi enviada à equipe de suporte.",
      timestamp: "Agora",
      isRead: false,
      type: "message"
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // This would call your API to send the message
    return Promise.resolve();
  };
  
  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true } 
          : notif
      )
    );
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    
    toast({
      title: "Notificações lidas",
      description: "Todas as notificações foram marcadas como lidas",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <MobileNav isOpen={isMobileMenuOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{process.title}</h1>
                <p className="text-gray-500">{process.type}</p>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <ProcessNotifications 
                  processId={process.id}
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                />
                <Button>Contatar Equipe</Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="text-lg font-medium mb-2">Informações do Processo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Endereço do imóvel</p>
                  <p>{process.property.address}, {process.property.city}/{process.property.state}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Área do imóvel</p>
                  <p>{process.property.area}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status atual</p>
                  <div className="flex items-center">
                    <span className="inline-block h-2 w-2 rounded-full bg-yellow-400 mr-2"></span>
                    <span>Em andamento</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Última atualização</p>
                  <p>{process.lastUpdate}</p>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeline" className="flex items-center">
                <ChevronDown className="h-4 w-4 mr-2" />
                Linha do Tempo
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Documentos
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Mensagens
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="mt-6">
              <ProcessTimeline 
                stages={stages} 
                currentStageId={process.currentStageId} 
              />
            </TabsContent>
            
            <TabsContent value="documents" className="mt-6">
              <div className="space-y-6">
                {stages.map(stage => {
                  const stageDocuments = documents[stage.id] || [];
                  if (stageDocuments.length === 0) return null;
                  
                  return (
                    <Collapsible
                      key={stage.id}
                      open={stageDetailsOpen[stage.id]}
                      onOpenChange={() => toggleStageDetails(stage.id)}
                      className="bg-white rounded-lg shadow overflow-hidden"
                    >
                      <CollapsibleTrigger asChild>
                        <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                          <div className="flex items-center">
                            <div
                              className={`h-3 w-3 rounded-full mr-3 ${
                                stage.status === "completed" ? "bg-green-500" :
                                stage.status === "in_progress" ? "bg-yellow-500" : "bg-gray-300"
                              }`}
                            />
                            <h3 className="font-medium">{stage.title}</h3>
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 text-gray-500 transition-transform ${
                              stageDetailsOpen[stage.id] ? "transform rotate-180" : ""
                            }`}
                          />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-4 pt-0 border-t">
                          {stageDocuments.map(doc => (
                            <DocumentUploader
                              key={doc.id}
                              documentType={doc}
                              onUpload={handleDocumentUpload}
                              onRemove={handleDocumentRemove}
                            />
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="messages" className="mt-6">
              <div className="bg-white rounded-lg shadow h-[600px] flex flex-col">
                <ProcessMessages
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  processId={process.id}
                />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
