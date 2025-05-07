
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import DadosPessoaisForm from "@/components/user/DadosPessoaisForm";
import SecuritySettings from "@/components/user/SecuritySettings";
import PreferenciasUsuario from "@/components/user/PreferenciasUsuario";
import PoliciesLinks from "@/components/user/PoliciesLinks";
import { useToast } from "@/hooks/use-toast";

export default function UserSettings() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  
  // Mock user data - would be fetched from authentication context
  const [userData, setUserData] = useState({
    name: "João Silva",
    email: "joao.silva@example.com",
    phone: "(11) 98765-4321",
    cpf: "123.456.789-00" // Read-only field
  });

  const handleUserDataUpdate = (updatedData: typeof userData) => {
    setUserData(updatedData);
    
    // Show success toast notification
    toast({
      title: "Dados atualizados",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
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
              <DadosPessoaisForm 
                initialData={userData}
                onDataUpdate={handleUserDataUpdate}
              />
            </TabsContent>
            
            <TabsContent value="security">
              <SecuritySettings />
            </TabsContent>
            
            <TabsContent value="notifications">
              <PreferenciasUsuario />
            </TabsContent>
          </Tabs>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Políticas e Termos</h2>
            <PoliciesLinks />
          </div>
        </main>
      </div>
    </div>
  );
}
