
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  MessageSquare, 
  User, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  X
} from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Client {
  id: string;
  name: string;
  email: string;
  processCount: number;
}

interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: "update" | "request" | "reminder" | "general";
}

interface AdminMessageSenderProps {
  clients?: Client[];
  processId?: string;
  clientId?: string;
}

export default function AdminMessageSender({ 
  clients = [], 
  processId,
  clientId 
}: AdminMessageSenderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>(clientId || "");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<"normal" | "high" | "urgent">("normal");
  const [sendConfirmation, setSendConfirmation] = useState(false);

  const { toast } = useToast();

  // Mock clients if none provided
  const mockClients: Client[] = clients.length > 0 ? clients : [
    { id: "client-1", name: "João da Silva", email: "joao@email.com", processCount: 2 },
    { id: "client-2", name: "Maria Souza", email: "maria@email.com", processCount: 1 },
    { id: "client-3", name: "Pedro Santos", email: "pedro@email.com", processCount: 3 }
  ];

  const messageTemplates: MessageTemplate[] = [
    {
      id: "update-1",
      name: "Atualização de Status",
      subject: "Atualização do seu processo",
      content: "Olá {cliente},\n\nTemos uma atualização importante sobre o seu processo {processo}.\n\nO status foi alterado para: {status}\n\nEm caso de dúvidas, entre em contato conosco.\n\nAtenciosamente,\nEquipe E-regulariza",
      category: "update"
    },
    {
      id: "request-1",
      name: "Solicitação de Documentos",
      subject: "Documentos necessários para seu processo",
      content: "Olá {cliente},\n\nPara dar continuidade ao seu processo {processo}, precisamos dos seguintes documentos:\n\n- [Lista de documentos]\n\nPor favor, envie os documentos através da plataforma ou por e-mail.\n\nAtenciosamente,\nEquipe E-regulariza",
      category: "request"
    },
    {
      id: "reminder-1",
      name: "Lembrete de Prazo",
      subject: "Lembrete: Prazo importante",
      content: "Olá {cliente},\n\nEste é um lembrete sobre um prazo importante relacionado ao seu processo {processo}.\n\nPrazo: {data}\n\nPor favor, não deixe de cumprir este prazo para evitar atrasos.\n\nAtenciosamente,\nEquipe E-regulariza",
      category: "reminder"
    },
    {
      id: "general-1",
      name: "Mensagem Geral",
      subject: "Comunicado importante",
      content: "Olá {cliente},\n\n[Sua mensagem aqui]\n\nAtenciosamente,\nEquipe E-regulariza",
      category: "general"
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setMessage(template.content);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedClient || !subject.trim() || !message.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const selectedClientData = mockClients.find(c => c.id === selectedClient);

      console.log("Sending message:", {
        clientId: selectedClient,
        clientEmail: selectedClientData?.email,
        subject,
        message,
        priority,
        processId,
        timestamp: new Date().toISOString()
      });

      setSendConfirmation(true);

      toast({
        title: "Mensagem enviada com sucesso!",
        description: `Mensagem enviada para ${selectedClientData?.name}`,
        className: "bg-white border-green-100",
      });

      // Auto close confirmation after 3 seconds
      setTimeout(() => {
        setSendConfirmation(false);
        setIsOpen(false);
        resetForm();
      }, 3000);

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setSelectedClient(clientId || "");
    setSelectedTemplate("");
    setSubject("");
    setMessage("");
    setPriority("normal");
  };

  const getPriorityBadge = (priority: "normal" | "high" | "urgent") => {
    const config = {
      normal: { color: "bg-gray-100 text-gray-800", icon: Clock, label: "Normal" },
      high: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "Alta" },
      urgent: { color: "bg-red-100 text-red-800", icon: AlertCircle, label: "Urgente" }
    };

    const { color, icon: IconComponent, label } = config[priority];

    return (
      <Badge variant="outline" className={color}>
        <IconComponent className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const selectedClientData = mockClients.find(c => c.id === selectedClient);

  if (sendConfirmation) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center bg-primary hover:bg-primary/90 text-white">
            <MessageSquare className="mr-2 h-4 w-4" />
            Enviar Mensagem
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-eregulariza-text mb-2">
              Mensagem Enviada!
            </h3>
            <p className="text-gray-600">
              Sua mensagem foi enviada para <strong>{selectedClientData?.name}</strong> com sucesso.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              O cliente receberá uma notificação por e-mail.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center bg-primary hover:bg-primary/90 text-white">
          <MessageSquare className="mr-2 h-4 w-4" />
          Enviar Mensagem
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-eregulariza-text">
            Enviar Mensagem ao Cliente
          </DialogTitle>
          <DialogDescription>
            Envie uma mensagem direta para o cliente através da plataforma.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Client Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <User className="h-4 w-4 mr-2" />
                Destinatário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Clientes</SelectLabel>
                    {mockClients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{client.name}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {client.processCount} processo(s)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {selectedClientData && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                  <strong>Email:</strong> {selectedClientData.email}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Template de Mensagem (Opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedTemplate} onValueChange={(value) => {
                setSelectedTemplate(value);
                handleTemplateSelect(value);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Templates Disponíveis</SelectLabel>
                    <SelectItem value="">Mensagem personalizada</SelectItem>
                    {messageTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Message Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Conteúdo da Mensagem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <Label htmlFor="subject">Assunto *</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Digite o assunto da mensagem"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Prioridade</Label>
                  <Select value={priority} onValueChange={(value: "normal" | "high" | "urgent") => setPriority(value)}>
                    <SelectTrigger className="w-32 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="message">Mensagem *</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem aqui..."
                  rows={6}
                  className="mt-1"
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Use {"{cliente}"}, {"{processo}"} para personalização automática
                  </p>
                  <span className="text-xs text-gray-500">
                    {message.length}/1000 caracteres
                  </span>
                </div>
              </div>

              {priority !== "normal" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">Prioridade:</span>
                  {getPriorityBadge(priority)}
                </div>
              )}
            </CardContent>
          </Card>
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
            onClick={handleSendMessage}
            disabled={isSending || !selectedClient || !subject.trim() || !message.trim()}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isSending ? (
              "Enviando..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Mensagem
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
