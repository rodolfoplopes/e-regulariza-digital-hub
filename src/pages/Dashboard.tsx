import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import ProcessCard, { ProcessProps } from "@/components/dashboard/ProcessCard";
import NotificationCard, { NotificationProps } from "@/components/dashboard/NotificationCard";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, AlertTriangle, FileWarning, Hourglass } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Mock data for processes
  const processes: ProcessProps[] = [
    {
      id: "proc-001",
      title: "Usucapião Extraordinária",
      type: "Usucapião",
      status: "em_andamento",
      progress: 45,
      lastUpdate: "10/04/2023",
      pendingDocuments: 2,
      deadline: "15/07/2023"
    },
    {
      id: "proc-002",
      title: "Retificação de Área - Lote 45",
      type: "Retificação de Área",
      status: "pendente",
      progress: 15,
      lastUpdate: "02/05/2023",
      nextAction: "Enviar documentação de posse do imóvel"
    },
    {
      id: "proc-003",
      title: "Inventário Extrajudicial - Família Silva",
      type: "Inventário",
      status: "concluido",
      progress: 100,
      lastUpdate: "20/02/2023",
      nextAction: "Processo concluído com sucesso"
    }
  ];
  
  // Mock data for notifications
  const notifications: NotificationProps[] = [
    {
      id: "notif-001",
      title: "Documento aprovado",
      message: "Sua Certidão de Matrícula foi aprovada com sucesso.",
      date: "Hoje, 14:30",
      isRead: false,
      type: "success"
    },
    {
      id: "notif-002",
      title: "Nova etapa iniciada",
      message: "O processo 'Usucapião Extraordinária' avançou para a etapa 'Análise documental'.",
      date: "Ontem, 09:15",
      isRead: false,
      type: "info"
    },
    {
      id: "notif-003",
      title: "Documento pendente",
      message: "É necessário enviar a Certidão de Ônus Reais para prosseguir com o processo.",
      date: "22/04/2023, 16:45",
      isRead: true,
      type: "warning"
    }
  ];

  // Process counters
  const processCounters = {
    active: processes.filter(p => p.status === "em_andamento").length,
    pending: processes.filter(p => p.status === "pendente").length,
    completed: processes.filter(p => p.status === "concluido").length,
    pendingDocs: processes.reduce((acc, curr) => acc + (curr.pendingDocuments || 0), 0)
  };

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Olá, João!</h1>
            <p className="text-gray-500">Bem-vindo ao seu painel de regularização imobiliária.</p>
          </div>
          
          {/* Status Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-l-4 border-blue-500">
              <CardContent className="p-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Hourglass className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Processos Ativos</p>
                  <p className="text-2xl font-bold">{processCounters.active}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-yellow-500">
              <CardContent className="p-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Processos Pendentes</p>
                  <p className="text-2xl font-bold">{processCounters.pending}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-green-500">
              <CardContent className="p-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Finalizados</p>
                  <p className="text-2xl font-bold">{processCounters.completed}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-orange-500">
              <CardContent className="p-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <FileWarning className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Docs. Pendentes</p>
                  <p className="text-2xl font-bold">{processCounters.pendingDocs}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-[#06D7A5]" />
              Meus Processos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {processes.map((process) => (
                <ProcessCard key={process.id} process={process} />
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-[#06D7A5]" />
              Notificações Recentes
            </h2>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
