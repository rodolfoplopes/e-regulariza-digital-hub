
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  name: string;
  email: string;
}

interface Process {
  id: string;
  title: string;
  clientId: string;
}

interface EmailSenderProps {
  clients?: Client[];
  processes?: Process[];
}

export default function EmailSender({ clients = [], processes = [] }: EmailSenderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedProcess, setSelectedProcess] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  
  // Mock data in case no clients/processes are provided
  const mockClients: Client[] = clients.length > 0 ? clients : [
    { id: "client-1", name: "João da Silva", email: "joao@exemplo.com" },
    { id: "client-2", name: "Maria Souza", email: "maria@exemplo.com" },
    { id: "client-3", name: "Pedro Santos", email: "pedro@exemplo.com" }
  ];
  
  const mockProcesses: Process[] = processes.length > 0 ? processes : [
    { id: "proc-1", title: "Usucapião - Lote 123", clientId: "client-1" },
    { id: "proc-2", title: "Retificação de Área", clientId: "client-2" },
    { id: "proc-3", title: "Inventário Extrajudicial", clientId: "client-3" }
  ];
  
  const emailTemplates = [
    {
      id: "welcome",
      name: "Boas-vindas",
      subject: "Bem-vindo à E-regulariza",
      content: "Olá [nome], bem-vindo à E-regulariza. Estamos felizes em tê-lo como cliente e prontos para ajudá-lo no processo de regularização do seu imóvel."
    },
    {
      id: "document-pending",
      name: "Pendência de Documentos",
      subject: "Documentação Pendente - [processo]",
      content: "Prezado(a) [nome], identificamos que há documentos pendentes no seu processo. Por favor, acesse nossa plataforma e verifique os documentos necessários."
    },
    {
      id: "deadline-update",
      name: "Atualização de Prazo",
      subject: "Prazo Atualizado - [processo]",
      content: "Prezado(a) [nome], o prazo do seu processo foi atualizado. A nova data prevista de conclusão é [data]."
    }
  ];
  
  const handleTemplateSelect = (selectedTemplateId: string) => {
    const template = emailTemplates.find(t => t.id === selectedTemplateId);
    if (template) {
      let clientName = "";
      let processTitle = "";
      
      if (selectedClient) {
        const client = mockClients.find(c => c.id === selectedClient);
        clientName = client ? client.name : "";
      }
      
      if (selectedProcess) {
        const process = mockProcesses.find(p => p.id === selectedProcess);
        processTitle = process ? process.title : "";
      }
      
      let newSubject = template.subject;
      let newContent = template.content;
      
      if (clientName) {
        newContent = newContent.replace("[nome]", clientName);
      }
      
      if (processTitle) {
        newSubject = newSubject.replace("[processo]", processTitle);
        newContent = newContent.replace("[processo]", processTitle);
      }
      
      setSubject(newSubject);
      setMessage(newContent);
      setTemplate(selectedTemplateId);
    }
  };
  
  const handleSendEmail = async () => {
    // Validate form
    if (!selectedClient || !subject || !message) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    // In a real app, this would call an API to send the email
    // using SendGrid, Postmark, or another email service
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "E-mail enviado com sucesso!",
        description: "O cliente receberá o e-mail em breve.",
      });
      
      // Reset form and close dialog
      setSelectedClient("");
      setSelectedProcess("");
      setSubject("");
      setMessage("");
      setTemplate("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Erro ao enviar e-mail",
        description: "Ocorreu um erro ao enviar o e-mail. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Mail className="mr-2 h-4 w-4" />
          Enviar E-mail ao Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Enviar E-mail</DialogTitle>
          <DialogDescription>
            Envie um e-mail personalizado para o cliente. Utilize os templates disponíveis ou crie sua própria mensagem.
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
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Clientes</SelectLabel>
                  {mockClients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} ({client.email})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="process" className="text-right">
              Processo
            </Label>
            <Select 
              value={selectedProcess} 
              onValueChange={setSelectedProcess}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione um processo (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Processos</SelectLabel>
                  {mockProcesses.map(process => (
                    <SelectItem key={process.id} value={process.id}>
                      {process.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="template" className="text-right">
              Template
            </Label>
            <Select 
              value={template} 
              onValueChange={handleTemplateSelect}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione um template (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Templates</SelectLabel>
                  {emailTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Assunto
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="message" className="text-right pt-2">
              Mensagem
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3"
              rows={6}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </Button>
          <Button 
            type="button" 
            onClick={handleSendEmail} 
            disabled={isSending}
          >
            {isSending ? "Enviando..." : "Enviar E-mail"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
