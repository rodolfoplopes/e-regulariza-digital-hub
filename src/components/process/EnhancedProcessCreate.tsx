
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, User, Mail, Phone, CreditCard, FileText, Calendar, ArrowRight } from "lucide-react";
import { clientService } from "@/services/clientService";
import { processService, ProcessType } from "@/services/processService";
import { auditService } from "@/services/auditService";
import { supabase } from "@/integrations/supabase/client";

interface Client {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  phone: string | null;
}

export default function EnhancedProcessCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [processTypes, setProcessTypes] = useState<ProcessType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    processNumber: "",
    title: "",
    description: "",
    processType: "",
    estimatedDays: 0
  });

  const [selectedProcessType, setSelectedProcessType] = useState<ProcessType | null>(null);

  // Gerar número do processo
  useEffect(() => {
    const generateNumber = async () => {
      try {
        const { data, error } = await supabase.rpc('generate_process_number');
        if (error) throw error;
        setFormData(prev => ({ ...prev, processNumber: data || 'ER-0000-00001' }));
      } catch (error) {
        console.error('Erro ao gerar número:', error);
        const currentYM = new Date().toISOString().slice(2, 7).replace('-', '');
        setFormData(prev => ({ ...prev, processNumber: `ER-${currentYM}-00001` }));
      }
    };
    generateNumber();
  }, []);

  // Carregar tipos de processo
  useEffect(() => {
    const loadProcessTypes = async () => {
      setIsLoadingTypes(true);
      try {
        const types = await processService.getProcessTypes();
        setProcessTypes(types);
      } catch (error) {
        console.error('Erro ao carregar tipos:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar tipos de processo",
          description: "Tente novamente"
        });
      } finally {
        setIsLoadingTypes(false);
      }
    };
    loadProcessTypes();
  }, []);

  // Buscar clientes
  const searchClients = async (term: string) => {
    if (term.length < 3) {
      setClients([]);
      return;
    }

    setIsLoadingClients(true);
    try {
      const allClients = await clientService.getClients();
      const filtered = allClients.filter(client => 
        client.name.toLowerCase().includes(term.toLowerCase()) ||
        client.email.toLowerCase().includes(term.toLowerCase()) ||
        (client.cpf && client.cpf.includes(term.replace(/\D/g, '')))
      );
      setClients(filtered);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast({
        variant: "destructive",
        title: "Erro ao buscar clientes",
        description: "Tente novamente"
      });
    } finally {
      setIsLoadingClients(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        searchClients(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleProcessTypeChange = (typeId: string) => {
    const type = processTypes.find(t => t.id === typeId);
    setSelectedProcessType(type || null);
    setFormData(prev => ({ 
      ...prev, 
      processType: typeId,
      estimatedDays: type?.estimated_duration_days || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient) {
      toast({
        variant: "destructive",
        title: "Cliente obrigatório",
        description: "Selecione um cliente para o processo"
      });
      return;
    }

    if (!selectedProcessType) {
      toast({
        variant: "destructive",
        title: "Tipo obrigatório",
        description: "Selecione o tipo de processo"
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        variant: "destructive",
        title: "Título obrigatório",
        description: "Digite um título para o processo"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Criar processo
      const process = await processService.createProcess({
        title: formData.title,
        description: formData.description,
        client_id: selectedClient.id,
        process_type_id: selectedProcessType.id
      });

      if (process) {
        // Registrar log de auditoria
        await auditService.createAuditLog({
          action: 'CREATE_PROCESS',
          target_type: 'process',
          target_id: process.id,
          target_name: process.title,
          details: {
            client_name: selectedClient.name,
            process_type: selectedProcessType.name,
            estimated_days: selectedProcessType.estimated_duration_days
          }
        });

        toast({
          title: "Processo criado com sucesso!",
          description: `Processo ${process.process_number} foi criado para ${selectedClient.name}`
        });

        navigate('/admin');
      }
    } catch (error) {
      console.error('Erro ao criar processo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar processo",
        description: error instanceof Error ? error.message : "Erro inesperado"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-eregulariza-gray font-montserrat">Criar Novo Processo</h1>
        <p className="text-eregulariza-description mt-2">Preencha os dados para iniciar um novo processo de regularização</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seleção de Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-eregulariza-primary" />
              Selecionar Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">Buscar por nome, email ou CPF</Label>
                <Input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite nome, email ou CPF do cliente..."
                />
              </div>

              {clients.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => {
                        setSelectedClient(client);
                        setSearchTerm("");
                        setClients([]);
                      }}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-eregulariza-surface transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-eregulariza-gray">{client.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-eregulariza-description">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {client.email}
                            </span>
                            {client.cpf && (
                              <span className="flex items-center gap-1">
                                <CreditCard className="h-3 w-3" />
                                {client.cpf}
                              </span>
                            )}
                            {client.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {client.phone}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-eregulariza-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedClient && (
                <Card className="border-eregulariza-primary bg-eregulariza-surface">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-eregulariza-gray flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {selectedClient.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-eregulariza-description mt-1">
                          <span>{selectedClient.email}</span>
                          {selectedClient.cpf && <span>{selectedClient.cpf}</span>}
                          {selectedClient.phone && <span>{selectedClient.phone}</span>}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-eregulariza-primary border-eregulariza-primary">
                        Selecionado
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dados do Processo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-eregulariza-primary" />
              Dados do Processo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="processNumber">Número do Processo</Label>
              <Input
                id="processNumber"
                value={formData.processNumber}
                readOnly
                className="bg-gray-50 font-mono"
              />
            </div>

            <div>
              <Label htmlFor="title">Título do Processo *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Regularização Imóvel Rua das Flores"
                required
              />
            </div>

            <div>
              <Label htmlFor="processType">Tipo de Processo *</Label>
              <Select value={formData.processType} onValueChange={handleProcessTypeChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de processo" />
                </SelectTrigger>
                <SelectContent>
                  {processTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div>
                        <div className="font-medium">{type.name}</div>
                        {type.description && (
                          <div className="text-sm text-gray-500">{type.description}</div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProcessType && (
              <Card className="border-l-4 border-l-eregulariza-primary bg-eregulariza-surface">
                <CardContent className="p-4">
                  <h4 className="font-medium text-eregulariza-gray mb-2">Detalhes do Tipo de Processo</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">Nome:</span>
                      <span>{selectedProcessType.name}</span>
                    </div>
                    {selectedProcessType.description && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">Descrição:</span>
                        <span>{selectedProcessType.description}</span>
                      </div>
                    )}
                    {selectedProcessType.estimated_duration_days && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-eregulariza-primary" />
                        <span className="font-medium">Prazo estimado: {selectedProcessType.estimated_duration_days} dias</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <Label htmlFor="description">Descrição/Observações</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Informações adicionais sobre o processo..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={!selectedClient || !selectedProcessType || !formData.title.trim() || isSubmitting}
            className="eregulariza-gradient btn-eregulariza-hover text-white"
          >
            {isSubmitting ? "Criando..." : "Criar Processo"}
          </Button>
        </div>
      </form>
    </div>
  );
}
