
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface UserData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

interface DadosPessoaisFormProps {
  initialData: UserData;
  onDataUpdate?: (data: UserData) => void;
}

export default function DadosPessoaisForm({ initialData, onDataUpdate }: DadosPessoaisFormProps) {
  const [userData, setUserData] = useState<UserData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Mock API call to save user data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data in local state to ensure UI reflects changes
      if (onDataUpdate) {
        onDataUpdate(userData);
      }
      
      toast({
        title: "Alterações salvas com sucesso",
        description: "Seus dados foram atualizados.",
      });
      
      // In a real implementation with Supabase, you would update the user profile here
      // const { error } = await supabase
      //   .from('profiles')
      //   .update({ name: userData.name, phone: userData.phone })
      //   .eq('email', userData.email);
      
      // if (error) throw error;
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar alterações",
        description: "Por favor, tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados Pessoais</CardTitle>
        <CardDescription>
          Atualize suas informações pessoais. Seu CPF não pode ser alterado.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSaveChanges}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input 
              id="name" 
              name="name"
              value={userData.name} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              value={userData.email} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input 
              id="phone" 
              name="phone"
              value={userData.phone} 
              onChange={handleInputChange}
              placeholder="(00) 00000-0000"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input 
              id="cpf" 
              name="cpf"
              value={userData.cpf} 
              disabled 
              className="bg-gray-100"
            />
            <p className="text-xs text-muted-foreground">O CPF não pode ser alterado.</p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
