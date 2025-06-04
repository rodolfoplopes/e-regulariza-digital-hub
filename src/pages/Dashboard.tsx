import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import ProcessCard, { ProcessProps } from "@/components/dashboard/ProcessCard";
import NotificationCard, { NotificationProps } from "@/components/dashboard/NotificationCard";
import EnhancedDashboardStats from "@/components/dashboard/EnhancedDashboardStats";
import { Clock, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useProcesses } from "@/hooks/useProcesses";
import { useNotifications } from "@/hooks/useNotifications";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import OnboardingTutorial from "@/components/onboarding/OnboardingTutorial";
import { useOnboarding } from "@/hooks/useOnboarding";

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { profile } = useSupabaseAuth();
  const { showOnboarding, completeOnboarding } = useOnboarding();
  
  // Use real data from Supabase
  const { processes, isLoading: processesLoading } = useProcesses();
  const { notifications, isLoading: notificationsLoading } = useNotifications();

  // Transform Supabase data to match component interfaces
  const transformedProcesses: ProcessProps[] = processes.map(process => ({
    id: process.id,
    title: process.title,
    type: process.process_type?.name || 'Processo',
    status: process.status as "pendente" | "em_andamento" | "concluido" | "rejeitado",
    progress: process.progress || 0,
    lastUpdate: new Date(process.updated_at).toLocaleDateString('pt-BR'),
    deadline: process.deadline ? new Date(process.deadline).toLocaleDateString('pt-BR') : undefined,
    nextAction: process.status === 'pendente' ? 'Aguardando início do processo' : 
                process.status === 'em_andamento' ? 'Em análise' :
                process.status === 'concluido' ? 'Processo concluído com sucesso' : undefined
  }));

  const transformedNotifications: NotificationProps[] = notifications.slice(0, 5).map(notification => ({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    date: new Date(notification.created_at).toLocaleDateString('pt-BR'),
    isRead: notification.is_read || false,
    type: notification.type === 'document' ? 'info' as const :
          notification.type === 'status' ? 'success' as const :
          notification.type === 'approval' ? 'success' as const :
          'warning' as const
  }));

  const isLoading = processesLoading || notificationsLoading;

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="sidebar-navigation">
        <DashboardSidebar />
      </div>
      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 dashboard-welcome">
            <h1 className="text-2xl font-bold">Olá, {profile?.name}!</h1>
            <p className="text-gray-500">Bem-vindo ao seu painel de regularização imobiliária.</p>
          </div>
          
          {/* Enhanced Dashboard Stats */}
          <EnhancedDashboardStats processes={transformedProcesses} isLoading={isLoading} />
          
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
            ) : transformedProcesses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {transformedProcesses.map((process) => (
                  <div key={process.id} className="process-card">
                    <ProcessCard process={process} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum processo encontrado.</p>
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
            ) : transformedNotifications.length > 0 ? (
              <div className="space-y-4">
                {transformedNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma notificação encontrada.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Onboarding Tutorial */}
      <OnboardingTutorial
        isOpen={showOnboarding}
        onComplete={completeOnboarding}
      />
    </div>
  );
}
