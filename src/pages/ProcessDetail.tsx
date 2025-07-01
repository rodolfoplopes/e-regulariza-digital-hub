
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import ProcessDetailHeader from "@/components/process/ProcessDetailHeader";
import ProcessInfoCards from "@/components/process/ProcessInfoCards";
import ProcessDetailContent from "@/components/process/ProcessDetailContent";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { processService, ProcessWithDetails } from "@/services/processService";

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

  const isAdmin = profile?.role === 'admin' || 
                  profile?.role === 'admin_master' || 
                  profile?.role === 'admin_editor' || 
                  profile?.role === 'admin_viewer';

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
          <ProcessDetailHeader process={process} />
          <ProcessInfoCards process={process} />
          <ProcessDetailContent 
            process={process} 
            isAdmin={isAdmin} 
          />
        </main>
      </div>
    </div>
  );
}
