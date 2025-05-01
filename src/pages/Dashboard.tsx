
import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import ProcessCard, { ProcessProps } from "@/components/dashboard/ProcessCard";
import NotificationCard, { NotificationProps } from "@/components/dashboard/NotificationCard";

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock data for processes
  const processes: ProcessProps[] = [
    {
      id: "proc-001",
      title: "Usucapião Extraordinária",
      type: "Usucapião",
      status: "em_andamento",
      progress: 45,
      lastUpdate: "10/04/2023"
    },
    {
      id: "proc-002",
      title: "Retificação de Área - Lote 45",
      type: "Retificação de Área",
      status: "pendente",
      progress: 15,
      lastUpdate: "02/05/2023"
    },
    {
      id: "proc-003",
      title: "Inventário Extrajudicial - Família Silva",
      type: "Inventário",
      status: "concluido",
      progress: 100,
      lastUpdate: "20/02/2023"
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

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <MobileNav isOpen={isMobileMenuOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Olá, João!</h1>
            <p className="text-gray-500">Bem-vindo ao seu painel de regularização imobiliária.</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Meus Processos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {processes.map((process) => (
                <ProcessCard key={process.id} process={process} />
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Notificações Recentes</h2>
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
