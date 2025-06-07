
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { validateCPF, formatCPF } from "@/utils/userUtils";
import { UserPlus } from "lucide-react";

interface CreateClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated?: () => void;
}

interface ClientData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

export default function CreateClientDialog({ 
  open, 
  onOpenChange, 
  onClientCreated 
}: CreateClientDialogProps) {
  const [clientData, setClientData] = useState<ClientData>({
    name: "",
    email: "",
    phone: "",
    cpf: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ClientData>>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Partial<ClientData> = {};

    if (!clientData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!clientData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(clientData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!clientData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (!validateCPF(clientData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    if (!clientData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ClientData, value: string) => {
    setClientData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCPFChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 11) {
      const formattedCPF = formatCPF(numericValue);
      handleInputChange("cpf", formattedCPF);
    }
  };

  const handlePhoneChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 11) {
      let formattedPhone = numericValue;
      if (numericValue.length > 2) {
        formattedPhone = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
      }
      if (numericValue.length > 7) {
        formattedPhone = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7)}`;
      }
      handleInputChange("phone", formattedPhone);
    }
  };

  const generateTemporaryPassword = (): string => {
    // Generate a secure temporary password
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to create client
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate temporary password
      const tempPassword = generateTemporaryPassword();
      
      // Mock successful creation
      const mockSuccess = Math.random() > 0.1; // 90% success rate for demo
      
      if (!mockSuccess) {
        throw new Error("Email ou CPF já cadastrado no sistema");
      }

      toast({
        title: "Cliente criado com sucesso",
        description: `${clientData.name} foi cadastrado. Um email com instruções de acesso foi enviado para ${clientData.email}.`,
      });

      // Reset form
      setClientData({
        name: "",
        email: "",
        phone: "",
        cpf: ""
      });
      setErrors({});
      
      // Close dialog
      onOpenChange(false);
      
      // Notify parent component
      onClientCreated?.();
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar cliente",
        description: error.message || "Ocorreu um erro ao tentar criar o cliente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-eregulariza-primary" />
            Criar Novo Cliente
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do cliente. Um email com instruções de acesso será enviado automaticamente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Nome Completo *</Label>
              <Input
                id="client-name"
                value={clientData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="João Silva"
                disabled={isLoading}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-email">Email *</Label>
              <Input
                id="client-email"
                type="email"
                value={clientData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="joao@email.com"
                disabled={isLoading}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-cpf">CPF *</Label>
              <Input
                id="client-cpf"
                value={clientData.cpf}
                onChange={(e) => handleCPFChange(e.target.value)}
                placeholder="000.000.000-00"
                disabled={isLoading}
                className={errors.cpf ? "border-red-500" : ""}
              />
              {errors.cpf && <p className="text-xs text-red-500">{errors.cpf}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-phone">Telefone *</Label>
              <Input
                id="client-phone"
                value={clientData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(11) 99999-9999"
                disabled={isLoading}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="eregulariza-gradient hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? "Criando cliente..." : "Criar cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
