
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, File, Download, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

// Type definitions
interface Client {
  id: string;
  name: string;
}

interface ServiceType {
  id: string;
  name: string;
}

type ProcessStatus = "pendente" | "em_andamento" | "concluido" | "rejeitado";

interface ReportExportProps {
  clients?: Client[];
  serviceTypes?: ServiceType[];
}

export default function ReportExport({ clients = [], serviceTypes = [] }: ReportExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<ProcessStatus | "">("");
  const [processNumber, setProcessNumber] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");
  const [includeFields, setIncludeFields] = useState({
    progress: true,
    stages: true,
    deadline: true,
    client: true,
  });

  const { toast } = useToast();
  
  // Mock data if none provided
  const mockClients: Client[] = clients.length > 0 ? clients : [
    { id: "client-1", name: "João da Silva" },
    { id: "client-2", name: "Maria Souza" },
    { id: "client-3", name: "Pedro Santos" }
  ];
  
  const mockServices: ServiceType[] = serviceTypes.length > 0 ? serviceTypes : [
    { id: "service-1", name: "Usucapião" },
    { id: "service-2", name: "Retificação de Área" },
    { id: "service-3", name: "Inventário Extrajudicial" },
    { id: "service-4", name: "Regularização Fundiária" }
  ];
  
  const statusOptions: { value: ProcessStatus | ""; label: string }[] = [
    { value: "", label: "Todos" },
    { value: "pendente", label: "Pendente" },
    { value: "em_andamento", label: "Em Andamento" },
    { value: "concluido", label: "Concluído" },
    { value: "rejeitado", label: "Rejeitado" }
  ];

  // Simulated export progress function
  const simulateExportProgress = () => {
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  };
  
  const handleGenerateReport = async () => {
    // Validate dates if both are provided
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast({
        title: "Erro de validação",
        description: "A data inicial não pode ser posterior à data final.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Start progress simulation
    const stopProgress = simulateExportProgress();
    
    // Prepare filter parameters
    const filters = {
      clientId: selectedClient || null,
      serviceId: selectedService || null,
      status: selectedStatus || null,
      processNumber: processNumber || null,
      startDate: startDate || null,
      endDate: endDate || null,
      includeFields,
    };
    
    try {
      // In a real app, this would call an API to generate the report
      console.log("Generating report with filters:", filters);
      console.log("Export format:", exportFormat);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle download based on format
      const filename = `relatorio-processos-${new Date().toISOString().split('T')[0]}`;
      const extension = exportFormat === 'csv' ? 'csv' : 'pdf';
      
      // Simulate file download - in a real app, this would be a blob from the API
      const link = document.createElement('a');
      link.setAttribute('download', `${filename}.${extension}`);
      
      // In a real implementation, this would be the URL to the generated report
      // For now, we're just simulating the download
      link.setAttribute('href', '#');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Mock success
      toast({
        title: "Relatório gerado com sucesso!",
        description: `O relatório em formato ${exportFormat.toUpperCase()} foi gerado e está pronto para download.`,
        className: "bg-white border-green-100",
      });
      
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Ocorreu um erro ao gerar o relatório. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      stopProgress();
      setExportProgress(0);
      setIsGenerating(false);
    }
  };
  
  const resetForm = () => {
    setSelectedClient("");
    setSelectedService("");
    setSelectedStatus("");
    setProcessNumber("");
    setStartDate("");
    setEndDate("");
    setExportFormat("csv");
    setIncludeFields({
      progress: true,
      stages: true,
      deadline: true,
      client: true,
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center hover:bg-primary-transparent hover:text-primary transition-colors">
          <FileText className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Exportar Relatório de Processos</DialogTitle>
          <DialogDescription>
            Gere relatórios personalizados dos processos com os filtros de sua preferência.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">
              Cliente
            </Label>
            <Select 
              value={selectedClient} 
              onValueChange={setSelectedClient}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Todos os clientes" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Clientes</SelectLabel>
                  <SelectItem value="">Todos os clientes</SelectItem>
                  {mockClients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="process-number" className="text-right">
              Nº Processo
            </Label>
            <Input
              id="process-number"
              placeholder="Digite o número do processo"
              value={processNumber}
              onChange={(e) => setProcessNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="service" className="text-right">
              Tipo de Serviço
            </Label>
            <Select 
              value={selectedService} 
              onValueChange={setSelectedService}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Todos os serviços" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Serviços</SelectLabel>
                  <SelectItem value="">Todos os serviços</SelectItem>
                  {mockServices.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select 
              value={selectedStatus} 
              onValueChange={(value) => setSelectedStatus(value as ProcessStatus | "")}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value || 'all'} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date-range" className="text-right">
              Período
            </Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="start-date" className="whitespace-nowrap">De:</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="end-date" className="whitespace-nowrap">Até:</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Incluir
            </Label>
            <div className="col-span-3 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-progress"
                  checked={includeFields.progress}
                  onCheckedChange={(checked) => 
                    setIncludeFields({...includeFields, progress: checked as boolean})
                  }
                />
                <Label htmlFor="include-progress">Progresso (%)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-stages"
                  checked={includeFields.stages}
                  onCheckedChange={(checked) => 
                    setIncludeFields({...includeFields, stages: checked as boolean})
                  }
                />
                <Label htmlFor="include-stages">Etapas finalizadas/pendentes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-deadline"
                  checked={includeFields.deadline}
                  onCheckedChange={(checked) => 
                    setIncludeFields({...includeFields, deadline: checked as boolean})
                  }
                />
                <Label htmlFor="include-deadline">Data prevista de entrega</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-client"
                  checked={includeFields.client}
                  onCheckedChange={(checked) => 
                    setIncludeFields({...includeFields, client: checked as boolean})
                  }
                />
                <Label htmlFor="include-client">Informações do cliente</Label>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Formato
            </Label>
            <div className="col-span-3 flex space-x-4">
              <div className="flex items-center space-x-2">
                <Button 
                  type="button" 
                  variant={exportFormat === "csv" ? "default" : "outline"}
                  className="flex items-center"
                  onClick={() => setExportFormat("csv")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  CSV (Planilha)
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  type="button" 
                  variant={exportFormat === "pdf" ? "default" : "outline"}
                  className="flex items-center"
                  onClick={() => setExportFormat("pdf")}
                >
                  <File className="h-4 w-4 mr-2" />
                  PDF (Relatório)
                </Button>
              </div>
            </div>
          </div>

          {isGenerating && (
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Gerando relatório...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              resetForm();
            }}
          >
            Cancelar
          </Button>
          <Button 
            type="button" 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="relative flex items-center"
          >
            {isGenerating ? (
              <>Gerando...<Download className="ml-2 h-4 w-4 animate-pulse" /></>
            ) : (
              <>Gerar Relatório<Download className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
