
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Download, AlertCircle, Filter } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Client {
  id: string;
  name: string;
}

interface ServiceType {
  id: string;
  name: string;
}

type ProcessStatus = "pendente" | "em_andamento" | "concluido" | "rejeitado";

interface EnhancedReportExportProps {
  clients?: Client[];
  serviceTypes?: ServiceType[];
}

export default function EnhancedReportExport({ clients = [], serviceTypes = [] }: EnhancedReportExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<ProcessStatus | "">("");
  const [processNumber, setProcessNumber] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeFields, setIncludeFields] = useState({
    progress: true,
    stages: true,
    deadline: true,
    client: true,
    documents: true,
    messages: false,
  });
  const [exportType, setExportType] = useState<"filtered" | "batch">("filtered");

  const { toast } = useToast();

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

  const generateCSVReport = async () => {
    const filters = {
      clientId: selectedClient || null,
      serviceId: selectedService || null,
      status: selectedStatus || null,
      processNumber: processNumber || null,
      startDate: startDate || null,
      endDate: endDate || null,
      includeFields,
      exportType,
    };

    console.log("Generating CSV report with filters:", filters);

    // Simulate CSV generation
    const csvContent = [
      "Processo,Cliente,Tipo,Status,Progresso,Data Criação,Prazo",
      "ER-240101-00001,João da Silva,Usucapião,Em Andamento,75%,01/01/2024,01/06/2024",
      "ER-240102-00002,Maria Souza,Retificação,Pendente,25%,02/01/2024,02/06/2024",
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-processos-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleGenerateReport = async () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast({
        title: "Erro de validação",
        description: "A data inicial não pode ser posterior à data final.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    const stopProgress = simulateExportProgress();

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await generateCSVReport();

      toast({
        title: "Relatório gerado com sucesso!",
        description: "O relatório CSV foi gerado e baixado automaticamente.",
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
    setExportType("filtered");
    setIncludeFields({
      progress: true,
      stages: true,
      deadline: true,
      client: true,
      documents: true,
      messages: false,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center bg-primary hover:bg-primary/90 text-white">
          <FileText className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-eregulariza-text">
            Exportar Relatório de Processos
          </DialogTitle>
          <DialogDescription>
            Gere relatórios detalhados em formato CSV com os filtros de sua preferência.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Export Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tipo de Exportação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filtered"
                  checked={exportType === "filtered"}
                  onCheckedChange={() => setExportType("filtered")}
                />
                <Label htmlFor="filtered">Exportação Filtrada</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="batch"
                  checked={exportType === "batch"}
                  onCheckedChange={() => setExportType("batch")}
                />
                <Label htmlFor="batch">Exportação em Lote (Todos os processos)</Label>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          {exportType === "filtered" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros de Busca
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cliente</Label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger>
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

                  <div>
                    <Label>Tipo de Serviço</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as ProcessStatus | "")}>
                      <SelectTrigger>
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

                  <div>
                    <Label>Número do Processo</Label>
                    <Input
                      placeholder="ER-YYMM-00001"
                      value={processNumber}
                      onChange={(e) => setProcessNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Data Inicial</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Data Final</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fields to Include */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Campos a Incluir</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="include-stages">Etapas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-deadline"
                    checked={includeFields.deadline}
                    onCheckedChange={(checked) => 
                      setIncludeFields({...includeFields, deadline: checked as boolean})
                    }
                  />
                  <Label htmlFor="include-deadline">Prazos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-client"
                    checked={includeFields.client}
                    onCheckedChange={(checked) => 
                      setIncludeFields({...includeFields, client: checked as boolean})
                    }
                  />
                  <Label htmlFor="include-client">Dados do Cliente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-documents"
                    checked={includeFields.documents}
                    onCheckedChange={(checked) => 
                      setIncludeFields({...includeFields, documents: checked as boolean})
                    }
                  />
                  <Label htmlFor="include-documents">Documentos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-messages"
                    checked={includeFields.messages}
                    onCheckedChange={(checked) => 
                      setIncludeFields({...includeFields, messages: checked as boolean})
                    }
                  />
                  <Label htmlFor="include-messages">Mensagens</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {isGenerating && (
            <div className="space-y-2">
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
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isGenerating ? (
              "Gerando..."
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Gerar Relatório CSV
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
