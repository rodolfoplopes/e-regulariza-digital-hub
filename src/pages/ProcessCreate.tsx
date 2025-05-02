
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Plus, Trash2, ChevronRight, ChevronLeft, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { generateProcessNumber } from "@/utils/processUtils";

// Form schemas
const clientFormSchema = z.object({
  clientName: z.string().min(3, "Nome do cliente é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
});

const processFormSchema = z.object({
  processNumber: z.string().min(3, "Número do processo é obrigatório"),
  processName: z.string().min(3, "Nome do processo é obrigatório"),
  processType: z.string().min(1, "Tipo de processo é obrigatório"),
  startDate: z.date({
    required_error: "Data de início é obrigatória",
  }),
  description: z.string().optional(),
});

const stageSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Nome da etapa é obrigatório"),
  description: z.string().optional(),
  estimatedDays: z.string().transform(val => Number(val) || 0),
});

const stagesFormSchema = z.object({
  stages: z.array(stageSchema),
});

// Process types with their default stages
const processTypes = [
  {
    id: "usucapiao",
    name: "Usucapião",
    stages: [
      {
        id: "stage-1",
        name: "Análise Preliminar",
        description: "Verificação inicial da documentação e viabilidade do processo",
        estimatedDays: 7,
      },
      {
        id: "stage-2",
        name: "Coleta de Documentos",
        description: "Recebimento e validação de toda documentação necessária",
        estimatedDays: 30,
      },
      {
        id: "stage-3",
        name: "Elaboração da Petição",
        description: "Preparação dos documentos legais para o processo de usucapião",
        estimatedDays: 15,
      },
      {
        id: "stage-4",
        name: "Protocolo no Cartório",
        description: "Entrada do processo no cartório de registro de imóveis",
        estimatedDays: 5,
      },
      {
        id: "stage-5",
        name: "Acompanhamento e Prenotação",
        description: "Acompanhamento do andamento do processo no cartório",
        estimatedDays: 60,
      },
      {
        id: "stage-6",
        name: "Registro da Matrícula",
        description: "Finalização do processo com o registro da nova matrícula",
        estimatedDays: 10,
      },
    ],
  },
  {
    id: "retificacao",
    name: "Retificação de Área",
    stages: [
      {
        id: "stage-1",
        name: "Análise Documental",
        description: "Análise dos documentos existentes e identificação de discrepâncias",
        estimatedDays: 7,
      },
      {
        id: "stage-2",
        name: "Levantamento Topográfico",
        description: "Realização de medições técnicas para determinar a área correta",
        estimatedDays: 15,
      },
      {
        id: "stage-3",
        name: "Notificação de Confrontantes",
        description: "Comunicação aos proprietários de imóveis vizinhos",
        estimatedDays: 30,
      },
      {
        id: "stage-4",
        name: "Elaboração de Memorial",
        description: "Preparação do memorial descritivo com as novas medidas",
        estimatedDays: 10,
      },
      {
        id: "stage-5",
        name: "Protocolo de Retificação",
        description: "Entrada do pedido de retificação no registro de imóveis",
        estimatedDays: 5,
      },
      {
        id: "stage-6",
        name: "Averbação na Matrícula",
        description: "Finalização com a averbação das novas medidas na matrícula",
        estimatedDays: 20,
      },
    ],
  },
  {
    id: "regularizacao",
    name: "Regularização de Construção",
    stages: [
      {
        id: "stage-1",
        name: "Vistoria Técnica",
        description: "Inspeção da construção para verificar conformidade",
        estimatedDays: 5,
      },
      {
        id: "stage-2",
        name: "Elaboração de Projeto",
        description: "Desenvolvimento de projeto arquitetônico da edificação existente",
        estimatedDays: 15,
      },
      {
        id: "stage-3",
        name: "Aprovação na Prefeitura",
        description: "Obtenção de alvará de regularização junto à prefeitura",
        estimatedDays: 45,
      },
      {
        id: "stage-4",
        name: "Emissão de Habite-se",
        description: "Obtenção do habite-se ou documento equivalente",
        estimatedDays: 30,
      },
      {
        id: "stage-5",
        name: "Averbação da Construção",
        description: "Registro da construção regularizada na matrícula do imóvel",
        estimatedDays: 15,
      },
    ],
  },
];

export default function ProcessCreate() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    client: {},
    process: {},
    stages: [],
  });
  const [selectedProcessType, setSelectedProcessType] = useState("");
  const [processNumber, setProcessNumber] = useState(() => generateProcessNumber());
  const [isEditingNumber, setIsEditingNumber] = useState(false);

  // Client form
  const clientForm = useForm({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      clientName: "",
      email: "",
      phone: "",
      cpf: "",
    },
  });

  // Process form
  const processForm = useForm({
    resolver: zodResolver(processFormSchema),
    defaultValues: {
      processNumber: processNumber,
      processName: "",
      processType: "",
      startDate: new Date(),
      description: "",
    },
  });

  // Update the form when processNumber changes
  useEffect(() => {
    processForm.setValue("processNumber", processNumber);
  }, [processNumber, processForm]);

  // Stages form
  const stagesForm = useForm({
    resolver: zodResolver(stagesFormSchema),
    defaultValues: {
      stages: [],
    },
  });

  // Handle manual edit of process number
  const handleProcessNumberEdit = () => {
    setIsEditingNumber(!isEditingNumber);
  };

  // Handle process number change
  const handleProcessNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProcessNumber(e.target.value);
  };

  // Handle process type selection and load default stages
  const handleProcessTypeChange = (value: string) => {
    processForm.setValue("processType", value);
    setSelectedProcessType(value);
    
    const selectedType = processTypes.find((type) => type.id === value);
    if (selectedType) {
      stagesForm.setValue("stages", selectedType.stages);
    }
  };

  // Add a new custom stage
  const addCustomStage = () => {
    const currentStages = stagesForm.getValues("stages") || [];
    const newStage = {
      id: `custom-stage-${currentStages.length + 1}`,
      name: "",
      description: "",
      estimatedDays: 7,
    };
    stagesForm.setValue("stages", [...currentStages, newStage]);
  };

  // Remove a stage
  const removeStage = (index: number) => {
    const currentStages = stagesForm.getValues("stages");
    currentStages.splice(index, 1);
    stagesForm.setValue("stages", currentStages);
  };

  // Submit handlers for each step
  const handleClientSubmit = (data: z.infer<typeof clientFormSchema>) => {
    setFormData((prev) => ({ ...prev, client: data }));
    setCurrentStep(2);
  };

  const handleProcessSubmit = (data: z.infer<typeof processFormSchema>) => {
    setFormData((prev) => ({ ...prev, process: data }));
    setCurrentStep(3);
  };

  const handleStagesSubmit = (data: z.infer<typeof stagesFormSchema>) => {
    setFormData((prev) => ({ ...prev, stages: data.stages }));
    
    // Here we would normally submit the complete form data to an API
    console.log("Complete form data:", {
      ...formData,
      process: {
        ...formData.process,
        processNumber: processNumber
      },
      stages: data.stages,
    });
    
    toast({
      title: "Processo criado com sucesso!",
      description: "O novo processo foi criado e está pronto para acompanhamento.",
    });
    
    // Navigate to admin dashboard after successful creation
    navigate("/admin");
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Criar Novo Processo</h1>
        <p className="text-gray-500">Preencha os dados para iniciar um novo processo de regularização</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>1</div>
            <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>2</div>
            <div className={`h-1 w-16 ${currentStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>3</div>
          </div>
          <div className="text-sm font-medium">
            Passo {currentStep} de 3
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Cliente</CardTitle>
            <CardDescription>Informe os dados do cliente para este processo</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...clientForm}>
              <form onSubmit={clientForm.handleSubmit(handleClientSubmit)} className="space-y-6">
                <FormField
                  control={clientForm.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Cliente</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome completo" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nome completo do cliente responsável pelo processo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={clientForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Email para comunicação e acesso à plataforma
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={clientForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 98765-4321" {...field} />
                      </FormControl>
                      <FormDescription>
                        Telefone de contato com DDD
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={clientForm.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="123.456.789-00" {...field} />
                      </FormControl>
                      <FormDescription>
                        CPF do cliente (obrigatório e único no sistema)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <CardFooter className="px-0">
                  <Button type="submit">Próximo Passo</Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Processo</CardTitle>
            <CardDescription>Configure as informações básicas do processo</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...processForm}>
              <form onSubmit={processForm.handleSubmit(handleProcessSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <FormLabel>Número do Processo</FormLabel>
                    <Button type="button" variant="ghost" size="sm" onClick={handleProcessNumberEdit}>
                      <Edit className="h-4 w-4 mr-1" />
                      {isEditingNumber ? "Concluir" : "Editar"}
                    </Button>
                  </div>
                  {isEditingNumber ? (
                    <Input 
                      value={processNumber} 
                      onChange={handleProcessNumberChange}
                      className="font-mono"
                      placeholder="ER-YYMM-XXXX"
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md font-mono">
                      {processNumber}
                    </div>
                  )}
                  <FormDescription>
                    Número único gerado automaticamente para este processo
                  </FormDescription>
                </div>
                
                <FormField
                  control={processForm.control}
                  name="processName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Processo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Regularização Imóvel Rua das Flores" {...field} />
                      </FormControl>
                      <FormDescription>
                        Um nome único para identificação do processo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={processForm.control}
                  name="processType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Processo</FormLabel>
                      <Select 
                        onValueChange={handleProcessTypeChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de processo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {processTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        O tipo de processo determina as etapas padrão
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={processForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Início</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            locale={ptBR}
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Data oficial de início do processo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={processForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição do Processo</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva detalhes importantes sobre este processo"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Informações adicionais sobre o processo (opcional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <CardFooter className="px-0 flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button type="submit">
                    Próximo Passo
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Etapas do Processo</CardTitle>
            <CardDescription>Configure as etapas e prazos do processo</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...stagesForm}>
              <form onSubmit={stagesForm.handleSubmit(handleStagesSubmit)} className="space-y-6">
                {stagesForm.getValues("stages")?.map((stage, index) => (
                  <div key={stage.id} className="p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Etapa {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      <FormField
                        control={stagesForm.control}
                        name={`stages.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome da Etapa</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={stagesForm.control}
                        name={`stages.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Textarea className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={stagesForm.control}
                        name={`stages.${index}.estimatedDays`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prazo Estimado (dias)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            <FormDescription>
                              O sistema calculará a data final com base no prazo em dias
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="text-sm mt-2 text-muted-foreground">
                        Data estimada de conclusão: {
                          (() => {
                            const startDate = processForm.getValues("startDate") || new Date();
                            const days = parseInt(String(stage.estimatedDays)) || 0;
                            const endDate = new Date(startDate);
                            endDate.setDate(endDate.getDate() + days);
                            return format(endDate, "dd/MM/yyyy", { locale: ptBR });
                          })()
                        }
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addCustomStage}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Nova Etapa
                </Button>

                <CardFooter className="px-0 flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button type="submit">
                    Criar Processo
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
