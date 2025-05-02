import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import UserManagement from "@/components/admin/UserManagement";
import { Link } from "react-router-dom";
import { Calendar, FilePlus, FileText, Users } from "lucide-react";

export default function AdminDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
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
      lastUpdate: "10/04/2023"
    },
    {
      id: "proc-002",
      title: "Retificação de Área - Lote 45",
      client: "Maria Souza",
      type: "Retificação de Área",
      status: "pendente",
      progress: 15,
      lastUpdate: "02/05/2023"
    },
    {
      id: "proc-003",
      title: "Inventário Extrajudicial - Família Silva",
      client: "Pedro Santos",
      type: "Inventário",
      status: "concluido",
      progress: 100,
      lastUpdate: "20/02/2023"
    },
    {
      id: "proc-004",
      title: "Adjudicação Compulsória - Casa Verde",
      client: "Ana Oliveira",
      type: "Adjudicação",
      status: "rejeitado",
      progress: 60,
      lastUpdate: "15/03/2023"
    }
  ];

  // Clients data
  const clients = [
    { id: "client-001", name: "João Silva", email: "joao@example.com", processes: 1 },
    { id: "client-002", name: "Maria Souza", email: "maria@example.com", processes: 1 },
    { id: "client-003", name: "Pedro Santos", email: "pedro@example.com", processes: 1 },
    { id: "client-004", name: "Ana Oliveira", email: "ana@example.com", processes: 1 },
  ];

  // Filter processes based on the active tab and search term
  const filteredProcesses = processes.filter(process => {
    const matchesSearch = 
      process.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.type.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (activeTab === "todos") {
      return matchesSearch;
    }
    
    return process.status === activeTab && matchesSearch;
  });
  
  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados serão enviados para seu e-mail em breve.",
    });
  };
  
  const statusLabels: Record<string, string> = {
    pendente: "Pendente",
    em_andamento: "Em Andamento",
    concluido: "Concluído",
    rejeitado: "Rejeitado"
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <MobileNav isOpen={isMobileMenuOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Painel Administrativo</h1>
              <p className="text-gray-500">Gerencie processos, clientes e configurações</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline">
                <Link to="/admin/novo-processo">
                  <FilePlus className="h-4 w-4 mr-2" />
                  Novo Processo
                </Link>
              </Button>
              <Button onClick={handleExportData}>
                <FileText className="h-4 w-4 mr-2" />
                Exportar Relatório
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total de Processos</h3>
              <p className="text-2xl font-bold">{processes.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Em Andamento</h3>
              <p className="text-2xl font-bold">{processes.filter(p => p.status === 'em_andamento').length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Concluídos</h3>
              <p className="text-2xl font-bold">{processes.filter(p => p.status === 'concluido').length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total de Clientes</h3>
              <p className="text-2xl font-bold">{clients.length}</p>
            </div>
          </div>
          
          <Tabs value={activeSection} onValueChange={setActiveSection} className="mb-6">
            <TabsList>
              <TabsTrigger value="processos">Processos</TabsTrigger>
              <TabsTrigger value="usuarios">Usuários</TabsTrigger>
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="processos" className="mt-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <TabsList>
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="pendente">Pendentes</TabsTrigger>
                    <TabsTrigger value="em_andamento">Em Andamento</TabsTrigger>
                    <TabsTrigger value="concluido">Concluídos</TabsTrigger>
                  </TabsList>
                  
                  <div className="relative">
                    <Input
                      placeholder="Buscar processos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-[300px]"
                    />
                  </div>
                </div>
                
                <TabsContent value={activeTab} className="mt-0">
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Processo</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Progresso</TableHead>
                          <TableHead>Última Atualização</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProcesses.map((process) => (
                          <TableRow key={process.id}>
                            <TableCell className="font-medium">{process.title}</TableCell>
                            <TableCell>{process.client}</TableCell>
                            <TableCell>{process.type}</TableCell>
                            <TableCell>
                              <span className={`status-badge status-badge-${process.status}`}>
                                {statusLabels[process.status]}
                              </span>
                            </TableCell>
                            <TableCell className="w-[180px]">
                              <div className="flex items-center space-x-2">
                                <Progress value={process.progress} className="h-2" />
                                <span className="text-xs text-gray-500">{process.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{process.lastUpdate}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/processo/${process.id}`}>
                                  Gerenciar
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        
                        {filteredProcesses.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                              Nenhum processo encontrado com os filtros selecionados.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            <TabsContent value="usuarios" className="mt-4">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="configuracoes" className="mt-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Configurações do Sistema</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Páginas de Políticas</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Edite o conteúdo das páginas de políticas e termos do sistema.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <h4 className="font-medium">Política de Privacidade</h4>
                          <p className="text-sm text-muted-foreground">
                            Última atualização: 01/05/2025
                          </p>
                        </div>
                        <Button variant="outline">Editar Conteúdo</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <h4 className="font-medium">Política de Cookies</h4>
                          <p className="text-sm text-muted-foreground">
                            Última atualização: 01/05/2025
                          </p>
                        </div>
                        <Button variant="outline">Editar Conteúdo</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <h4 className="font-medium">Termos de Uso</h4>
                          <p className="text-sm text-muted-foreground">
                            Última atualização: 01/05/2025
                          </p>
                        </div>
                        <Button variant="outline">Editar Conteúdo</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Configurações de E-mail</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Configure os templates e remetentes de e-mails automatizados.
                    </p>
                    
                    <Button variant="outline">Gerenciar E-mails</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Clientes</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Processos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.processes}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Ver detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
