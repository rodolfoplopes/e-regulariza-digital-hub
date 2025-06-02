
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import ProcessCard, { ProcessProps } from "@/components/dashboard/ProcessCard";
import NotificationCard, { NotificationProps } from "@/components/dashboard/NotificationCard";
import EnhancedDashboardStats from "@/components/dashboard/EnhancedDashboardStats";
import { Clock, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Mock data for processes
  const [processes, setProcesses] = useState<ProcessProps[]>([
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
  ]);
  
  // Mock data for notifications
  const [notifications, setNotifications] = useState<NotificationProps[]>([
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
  ]);

  // Simular carregamento de dados
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

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
          
          {/* Enhanced Dashboard Stats */}
          <EnhancedDashboardStats processes={processes} isLoading={isLoading} />
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-[#06D7A5]" />
              Meus Processos
            </h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-[#06D7A5]"></div>
                <p className="mt-2 text-gray-500">Carregando processos...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {processes.map((process) => (
                  <ProcessCard key={process.id} process={process} />
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-[#06D7A5]" />
              Notificações Recentes
            </h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-[#06D7A5]"></div>
                <p className="mt-2 text-gray-500">Carregando notificações...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
