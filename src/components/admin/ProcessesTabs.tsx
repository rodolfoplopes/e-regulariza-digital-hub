
import React, { useState } from "react";
import { Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProcessFilters from "./ProcessFilters";
import ProcessesTable from "./ProcessesTable";

interface Process {
  id: string;
  title: string;
  client: string;
  type: string;
  status: string;
  progress: number;
  creationDate: string;
  lastUpdate: string;
}

interface Client {
  id: string;
  name: string;
}

interface ProcessesTabsProps {
  processes: Process[];
  clients: Client[];
  serviceTypes: string[];
}

export default function ProcessesTabs({ processes, clients, serviceTypes }: ProcessesTabsProps) {
  const [activeTab, setActiveTab] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    clientName: "",
    serviceType: "",
    status: "",
    startDate: "",
    endDate: "",
    processNumber: ""
  });

  // Status labels mapping
  const statusLabels: Record<string, string> = {
    pendente: "Pendente",
    em_andamento: "Em Andamento",
    concluido: "Concluído",
    rejeitado: "Rejeitado"
  };

  // Filter processes based on the active tab, search term, and advanced filters
  const filteredProcesses = processes.filter(process => {
    // First check the tab filter
    if (activeTab !== "todos" && process.status !== activeTab) {
      return false;
    }
    
    // Then check search term
    const matchesSearch = 
      process.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) {
      return false;
    }
    
    // Then check advanced filters
    if (filters.clientName && !process.client.toLowerCase().includes(filters.clientName.toLowerCase())) {
      return false;
    }
    
    if (filters.serviceType && process.type !== filters.serviceType) {
      return false;
    }
    
    if (filters.status && process.status !== filters.status) {
      return false;
    }
    
    if (filters.processNumber && !process.id.toLowerCase().includes(filters.processNumber.toLowerCase())) {
      return false;
    }
    
    // Date filtering
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      const processDate = new Date(process.creationDate.split('/').reverse().join('-'));
      if (processDate < startDate) {
        return false;
      }
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      const processDate = new Date(process.creationDate.split('/').reverse().join('-'));
      if (processDate > endDate) {
        return false;
      }
    }
    
    return true;
  });

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters });
  };
  
  const clearFilters = () => {
    setFilters({
      clientName: "",
      serviceType: "",
      status: "",
      startDate: "",
      endDate: "",
      processNumber: ""
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex flex-col space-y-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="pendente">Pendentes</TabsTrigger>
            <TabsTrigger value="em_andamento">Em Andamento</TabsTrigger>
            <TabsTrigger value="concluido">Concluídos</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Ocultar Filtros' : 'Filtros Avançados'}
            </Button>
            
            <div className="relative">
              <Input
                placeholder="Buscar processos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-[300px]"
              />
            </div>
          </div>
        </div>
        
        {showFilters && (
          <ProcessFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            clients={clients}
            serviceTypes={serviceTypes}
          />
        )}
      </div>
      
      <TabsContent value={activeTab} className="mt-0">
        <ProcessesTable 
          processes={filteredProcesses} 
          statusLabels={statusLabels} 
        />
      </TabsContent>
    </Tabs>
  );
}
