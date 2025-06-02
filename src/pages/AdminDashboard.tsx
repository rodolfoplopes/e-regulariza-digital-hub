
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import AdminStats from "@/components/admin/AdminStats";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTabContent from "@/components/admin/AdminTabContent";
import ClientsTable from "@/components/admin/ClientsTable";
import SystemSettings from "@/components/admin/SystemSettings";
import SystemValidation from "@/components/admin/SystemValidation";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function AdminDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("processos");
  const { toast } = useToast();
  
  // Mock data for processes
  const processes = [
    {
      id: "proc-001",
      title: "Usucapião Extraordinária",
      client: "João Silva",
      type: "Usucapião",
      status: "em_andamento",
      progress: 45,
      lastUpdate: "10/04/2023",
      creationDate: "01/03/2023"
    },
    {
      id: "proc-002",
      title: "Retificação de Área - Lote 45",
      client: "Maria Souza",
      type: "Retificação de Área",
      status: "pendente",
      progress: 15,
      lastUpdate: "02/05/2023",
      creationDate: "15/04/2023"
    },
    {
      id: "proc-003",
      title: "Inventário Extrajudicial - Família Silva",
      client: "Pedro Santos",
      type: "Inventário",
      status: "concluido",
      progress: 100,
      lastUpdate: "20/02/2023",
      creationDate: "05/01/2023"
    },
    {
      id: "proc-004",
      title: "Adjudicação Compulsória - Casa Verde",
      client: "Ana Oliveira",
      type: "Adjudicação",
      status: "rejeitado",
      progress: 60,
      lastUpdate: "15/03/2023",
      creationDate: "10/02/2023"
    }
  ];

  // Clients data
  const clients = [
    { id: "client-001", name: "João Silva", email: "joao@example.com", processes: 1 },
    { id: "client-002", name: "Maria Souza", email: "maria@example.com", processes: 1 },
    { id: "client-003", name: "Pedro Santos", email: "pedro@example.com", processes: 1 },
    { id: "client-004", name: "Ana Oliveira", email: "ana@example.com", processes: 1 },
  ];

  // Get unique service types for filter dropdown
  const serviceTypes = [...new Set(processes.map(process => process.type))];

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
          <AdminHeader 
            clients={clients}
            serviceTypes={serviceTypes}
          />
          
          <div className="flex items-center justify-between mb-6">
            <AdminStats 
              processes={processes}
              clientsCount={clients.length}
            />
            
            <Link to="/admin/logo">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Settings className="h-4 w-4 mr-2" />
                Configurar Logo
              </Button>
            </Link>
          </div>
          
          <Tabs value={activeSection} onValueChange={setActiveSection} className="mb-6">
            <TabsList>
              <TabsTrigger value="processos">Processos</TabsTrigger>
              <TabsTrigger value="usuarios">Usuários</TabsTrigger>
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
              <TabsTrigger value="sistema">Sistema</TabsTrigger>
              <TabsTrigger value="validacao">Validação</TabsTrigger>
            </TabsList>
            
            <AdminTabContent 
              activeSection={activeSection}
              processes={processes}
              clients={clients}
              serviceTypes={serviceTypes}
            />
            
            {activeSection === 'sistema' && <SystemSettings />}
            {activeSection === 'validacao' && <SystemValidation />}
          </Tabs>
          
          {activeSection === 'processos' && <ClientsTable clients={clients} />}
        </main>
      </div>
    </div>
  );
}
