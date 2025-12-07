
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, User, Mail, Phone, CreditCard } from "lucide-react";
import { clientService } from "@/services/clientService";
import { auditService } from "@/services/auditService";

interface EnhancedCreateClientDialogProps {
  onClientCreated?: () => void;
}

export default function EnhancedCreateClientDialog({ onClientCreated }: EnhancedCreateClientDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    observations: ""
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    handleInputChange('cpf', formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    handleInputChange('phone', formatted);
  };

  const validateForm = (): string[] => {
    const errors = clientService.validateClientData(formData);
    return errors;
  };

  const simulateEmailSending = (clientData: any) => {
    console.log('📧 Simulando envio de email para:', clientData.email);
    console.log('📋 Dados do cliente criado:', {
      nome: clientData.name,
      email: clientData.email,
      cpf: clientData.cpf,
      telefone: clientData.phone
    });
    console.log('🔗 Link de acesso: https://e-regulariza-digital-hub.lovable.app/login');
    console.log('📝 Instruções: O cliente deve usar este link para fazer o primeiro login e definir sua senha.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        variant: "destructive",
        title: "Erro na validação",
        description: errors.join(', ')
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const client = await clientService.createClient({
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf,
        phone: formData.phone
      });

      if (client) {
        // Registrar log de auditoria
        await auditService.createAuditLog({
          action: 'CREATE_CLIENT',
          target_type: 'client',
          target_id: client.id,
          target_name: client.name,
          details: {
            email: client.email,
            cpf: client.cpf,
            phone: client.phone
          }
        });

        // Simular envio de email
        simulateEmailSending(client);

        toast({
          title: "Cliente criado com sucesso!",
          description: `${client.name} foi cadastrado. Email de acesso simulado (veja o console).`
        });

        setFormData({
          name: "",
          email: "",
          cpf: "",
          phone: "",
          observations: ""
        });
        
        setIsOpen(false);
        onClientCreated?.();
      }
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar cliente",
        description: error instanceof Error ? error.message : "Erro inesperado"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="eregulariza-gradient btn-eregulariza-hover text-white">
          <Plus className="h-4 w-4 mr-2" />
          Cadastrar Novo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-eregulariza-gray">Cadastrar Novo Cliente</DialogTitle>
          <DialogDescription className="text-eregulariza-description">
            Preencha os dados do cliente. Um email com link de acesso será enviado automaticamente.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4 text-eregulariza-primary" />
              Nome Completo *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Digite o nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-eregulariza-primary" />
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@exemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-eregulariza-primary" />
              CPF *
            </Label>
            <Input
              id="cpf"
              type="text"
              value={formData.cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              maxLength={14}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-eregulariza-primary" />
              Telefone
            </Label>
            <Input
              id="phone"
              type="text"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleInputChange('observations', e.target.value)}
              placeholder="Observações adicionais sobre o cliente (opcional)"
              className="resize-none"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="eregulariza-gradient btn-eregulariza-hover text-white"
            >
              {isLoading ? "Criando..." : "Criar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
