
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import { useNavigate } from "react-router-dom";

// Define the form schema
const processFormSchema = z.object({
  title: z.string().min(3, { message: "Título deve ter pelo menos 3 caracteres" }),
  client: z.string().min(1, { message: "Selecione um cliente" }),
  type: z.string().min(1, { message: "Selecione um tipo de processo" }),
  description: z.string().optional(),
});

type ProcessFormValues = z.infer<typeof processFormSchema>;

// Define process stage type
interface ProcessStage {
  id: string;
  title: string;
  description: string;
  estimatedDays: number;
  isRequired: boolean;
}

// Predefined stages for different process types
const processTypeStages: Record<string, ProcessStage[]> = {
  usucapiao: [
    { 
      id: "stage-1", 
      title: "Análise Preliminar", 
      description: "Verificação inicial da documentação e viabilidade do processo.", 
      estimatedDays: 7,
      isRequired: true
    },
    {
      id: "stage-2",
      title: "Coleta de Documentos",
      description: "Recebimento e validação de toda documentação necessária.",
      estimatedDays: 30,
      isRequired: true
    },
    {
      id: "stage-3",
      title: "Elaboração da Petição",
      description: "Preparação dos documentos legais para o processo de usucapião.",
      estimatedDays: 15,
      isRequired: true
    },
    {
      id: "stage-4",
      title: "Protocolo no Cartório",
      description: "Entrada do processo no cartório de registro de imóveis.",
      estimatedDays: 5,
      isRequired: true
    },
    {
      id: "stage-5",
      title: "Acompanhamento e Prenotação",
      description: "Acompanhamento do andamento do processo no cartório.",
      estimatedDays: 60,
      isRequired: true
    },
    {
      id: "stage-6",
      title: "Registro da Matrícula",
      description: "Finalização do processo com o registro da nova matrícula.",
      estimatedDays: 15,
      isRequired: true
    }
  ],
  retificacao: [
    { 
      id: "stage-1", 
      title: "Análise Documental", 
      description: "Verificação dos documentos do imóvel e planejamento do processo.", 
      estimatedDays: 7,
      isRequired: true
    },
    {
      id: "stage-2",
      title: "Levantamento Topográfico",
      description: "Realização de medição e elaboração de planta e memorial.",
      estimatedDays: 15,
      isRequired: true
    },
    {
      id: "stage-3",
      title: "Protocolo da Retificação",
      description: "Entrada com o pedido de retificação no cartório competente.",
      estimatedDays: 5,
      isRequired: true
    },
    {
      id: "stage-4",
      title: "Notificação de Confrontantes",
      description: "Notificação dos proprietários vizinhos para anuência.",
      estimatedDays: 30,
      isRequired: true
    },
    {
      id: "stage-5",
      title: "Averbação na Matrícula",
      description: "Averbação da nova descrição na matrícula do imóvel.",
      estimatedDays: 20,
      isRequired: true
    }
  ],
  inventario: [
    { 
      id: "stage-1", 
      title: "Análise do Caso", 
      description: "Verificação da viabilidade do inventário extrajudicial.", 
      estimatedDays: 5,
      isRequired: true
    },
    {
      id: "stage-2",
      title: "Coleta de Documentos",
      description: "Obtenção de certidões de óbito, casamento, nascimento, etc.",
      estimatedDays: 20,
      isRequired: true
    },
    {
      id: "stage-3",
      title: "Declaração de Bens",
      description: "Levantamento do patrimônio e elaboração da declaração.",
      estimatedDays: 15,
      isRequired: true
    },
    {
      id: "stage-4",
      title: "Cálculo do ITCMD",
      description: "Apuração e pagamento do imposto de transmissão causa mortis.",
      estimatedDays: 10,
      isRequired: true
    },
    {
      id: "stage-5",
      title: "Escritura de Inventário",
      description: "Lavratura da escritura pública em tabelionato de notas.",
      estimatedDays: 7,
      isRequired: true
    },
    {
      id: "stage-6",
      title: "Registro nos Órgãos Competentes",
      description: "Registro da escritura nos cartórios de imóveis ou outros órgãos.",
      estimatedDays: 15,
      isRequired: true
    }
  ],
  adjudicacao: [
    { 
      id: "stage-1", 
      title: "Análise Inicial", 
      description: "Verificação do contrato e possibilidade de adjudicação.", 
      estimatedDays: 7,
      isRequired: true
    },
    {
      id: "stage-2",
      title: "Notificação Extrajudicial",
      description: "Notificação da parte vendedora para outorga da escritura.",
      estimatedDays: 15,
      isRequired: true
    },
    {
      id: "stage-3",
      title: "Elaboração de Petição Inicial",
      description: "Preparação da documentação para o processo judicial.",
      estimatedDays: 10,
      isRequired: true
    },
    {
      id: "stage-4",
      title: "Acompanhamento Processual",
      description: "Acompanhamento do trâmite judicial até sentença.",
      estimatedDays: 180,
      isRequired: true
    },
    {
      id: "stage-5",
      title: "Registro da Carta de Adjudicação",
      description: "Registro do título no cartório de registro de imóveis.",
      estimatedDays: 15,
      isRequired: true
    }
  ]
};

export default function ProcessCreate() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [processType, setProcessType] = useState("");
  const [stages, setStages] = useState<ProcessStage[]>([]);
  const [customStages, setCustomStages] = useState<ProcessStage[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock data for clients
  const clients = [
    { id: "client-001", name: "João Silva" },
    { id: "client-002", name: "Maria Souza" },
    { id: "client-003", name: "Pedro Santos" },
    { id: "client-004", name: "Ana Oliveira" },
  ];

  // Form definition
  const form = useForm<ProcessFormValues>({
    resolver: zodResolver(processFormSchema),
    defaultValues: {
      title: "",
      client: "",
      type: "",
      description: "",
    },
  });

  // Watch for changes to the type field
  const currentType = form.watch("type");
  
  // Update stages when process type changes
  React.useEffect(() => {
    if (currentType) {
      setProcessType(currentType);
      setStages(processTypeStages[currentType] || []);
      setCustomStages([]);
    }
  }, [currentType]);

  // Add custom stage
  const addCustomStage = () => {
    const newStage: ProcessStage = {
      id: `custom-${Date.now()}`,
      title: "Nova Etapa",
      description: "Descrição da etapa personalizada",
      estimatedDays: 7,
      isRequired: false,
    };
    
    setCustomStages([...customStages, newStage]);
  };

  // Remove custom stage
  const removeCustomStage = (id: string) => {
    setCustomStages(customStages.filter(stage => stage.id !== id));
  };

  // Update custom stage
  const updateCustomStage = (id: string, field: keyof ProcessStage, value: string | number | boolean) => {
    setCustomStages(
      customStages.map(stage => 
        stage.id === id ? { ...stage, [field]: value } : stage
      )
    );
  };

  // Handle form submission
  const onSubmit = (data: ProcessFormValues) => {
    // Combine default and custom stages
    const allStages = [...stages, ...customStages];
    
    console.log("Form data:", data);
    console.log("Process stages:", allStages);
    
    toast({
      title: "Processo criado com sucesso",
      description: `O processo "${data.title}" foi criado e está pronto para ser iniciado.`,
    });
    
    // Navigate to admin dashboard after successful creation
    setTimeout(() => {
      navigate("/admin");
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <MobileNav isOpen={isMobileMenuOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Criar Novo Processo</h1>
            <p className="text-gray-500">Cadastre um novo processo de regularização</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="info">Informações Básicas</TabsTrigger>
                <TabsTrigger value="stages">Etapas do Processo</TabsTrigger>
              </TabsList>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <TabsContent value="info" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título do Processo</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Usucapião Extraordinária - Rua das Flores, 123" {...field} />
                          </FormControl>
                          <FormDescription>
                            Nome descritivo que identifique o processo.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="client"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cliente</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o cliente" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Cliente responsável pelo processo.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Processo</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="usucapiao">Usucapião</SelectItem>
                              <SelectItem value="retificacao">Retificação de Área</SelectItem>
                              <SelectItem value="inventario">Inventário Extrajudicial</SelectItem>
                              <SelectItem value="adjudicacao">Adjudicação Compulsória</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            O tipo define as etapas padrão do processo.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição (Opcional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Informações adicionais sobre o processo..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button type="button" onClick={() => setActiveTab("stages")}>
                        Próximo: Configurar Etapas
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="stages">
                    {processType ? (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Etapas Padrão</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Estas são as etapas pré-definidas para o tipo de processo selecionado.
                          </p>
                          
                          <div className="space-y-4">
                            {stages.map((stage, index) => (
                              <div key={stage.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium">
                                    Etapa {index + 1}: {stage.title}
                                  </h4>
                                  <span className="text-sm text-gray-500">
                                    {stage.estimatedDays} dias
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {stage.description}
                                </p>
                                <div className="flex items-center">
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    Etapa obrigatória
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Etapas Personalizadas</h3>
                            <Button type="button" variant="outline" onClick={addCustomStage}>
                              Adicionar Etapa
                            </Button>
                          </div>
                          
                          {customStages.length > 0 ? (
                            <div className="space-y-4">
                              {customStages.map((stage, index) => (
                                <div key={stage.id} className="border rounded-lg p-4">
                                  <div className="flex justify-between items-center mb-4">
                                    <Input
                                      value={stage.title}
                                      onChange={(e) => updateCustomStage(stage.id, 'title', e.target.value)}
                                      className="font-medium"
                                      placeholder={`Etapa ${stages.length + index + 1}`}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeCustomStage(stage.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  
                                  <Textarea
                                    value={stage.description}
                                    onChange={(e) => updateCustomStage(stage.id, 'description', e.target.value)}
                                    className="mb-4 text-sm"
                                    placeholder="Descrição da etapa"
                                  />
                                  
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                      <label className="text-sm">Dias estimados:</label>
                                      <Input
                                        type="number"
                                        value={stage.estimatedDays}
                                        onChange={(e) => updateCustomStage(stage.id, 'estimatedDays', parseInt(e.target.value) || 0)}
                                        className="w-20"
                                        min="1"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 border border-dashed rounded-lg">
                              <p className="text-gray-500">
                                Nenhuma etapa personalizada adicionada.
                              </p>
                              <Button type="button" variant="link" onClick={addCustomStage}>
                                Adicionar uma etapa
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between pt-4">
                          <Button type="button" variant="outline" onClick={() => setActiveTab("info")}>
                            Voltar
                          </Button>
                          <Button type="submit">
                            Criar Processo
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-lg text-gray-500">
                          Selecione um tipo de processo na aba de Informações Básicas primeiro.
                        </p>
                        <Button type="button" onClick={() => setActiveTab("info")} className="mt-4">
                          Voltar para Informações Básicas
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </form>
              </Form>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
