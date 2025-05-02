
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import ChangePasswordModal from "@/components/user/ChangePasswordModal";

export default function UserSettings() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { toast } = useToast();
  
  // Mock user data - would be fetched from authentication context
  const [userData, setUserData] = useState({
    name: "João Silva",
    email: "joao.silva@example.com",
    phone: "(11) 98765-4321",
    cpf: "123.456.789-00" // Read-only field
  });

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
      
      toast({
        title: "Alterações salvas com sucesso",
        description: "Seus dados foram atualizados.",
      });
    } catch (error) {
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
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <MobileNav isOpen={isMobileMenuOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Configurações da Conta</h1>
            <p className="text-gray-500">Gerencie suas informações pessoais e preferências</p>
          </div>
          
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList>
              <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
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
                    <Button type="submit" className="eregulariza-gradient hover:opacity-90" disabled={isLoading}>
                      {isLoading ? "Salvando..." : "Salvar alterações"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>
                    Gerencie sua senha e configurações de segurança.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Senha</Label>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">••••••••••••</p>
                      <Button onClick={() => setIsPasswordModalOpen(true)} variant="outline">
                        Alterar senha
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <Label>Autenticação de dois fatores</Label>
                    <p className="text-sm text-muted-foreground">
                      Aumente a segurança da sua conta ativando a autenticação de dois fatores.
                    </p>
                    <Button variant="outline" className="mt-2">
                      Configurar 2FA
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificações</CardTitle>
                  <CardDescription>
                    Escolha como e quando deseja receber notificações.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Preferências de notificação serão implementadas em breve.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Políticas e Termos</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Política de Privacidade</h3>
                      <p className="text-sm text-muted-foreground">
                        Como seus dados são protegidos e utilizados.
                      </p>
                    </div>
                    <Button variant="link" asChild>
                      <a href="/politica-de-privacidade" target="_blank">Visualizar</a>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Política de Cookies</h3>
                      <p className="text-sm text-muted-foreground">
                        Como utilizamos cookies para melhorar sua experiência.
                      </p>
                    </div>
                    <Button variant="link" asChild>
                      <a href="/politica-de-cookies" target="_blank">Visualizar</a>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Termos de Uso</h3>
                      <p className="text-sm text-muted-foreground">
                        Termos e condições de uso da plataforma.
                      </p>
                    </div>
                    <Button variant="link" asChild>
                      <a href="/termos-de-uso" target="_blank">Visualizar</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
}
