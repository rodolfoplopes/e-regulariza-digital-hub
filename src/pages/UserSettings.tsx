
import { useState, useEffect } from "react";
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
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import BackButton from "@/components/admin/BackButton";

export default function UserSettings() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const { user, profile } = useSupabaseAuth();
  
  // Mock user data - would be fetched from authentication context
  const [userData, setUserData] = useState({
    name: profile?.name || "João Silva",
    email: profile?.email || user?.email || "joao.silva@example.com",
    phone: profile?.phone || "(11) 98765-4321",
    cpf: profile?.cpf || "123.456.789-00" // Read-only field
  });

  // Effect to sync dashboard data with settings
  useEffect(() => {
    if (profile || user) {
      setUserData(prevData => ({
        ...prevData,
        name: profile?.name || prevData.name,
        email: profile?.email || user?.email || prevData.email,
        phone: profile?.phone || prevData.phone,
        cpf: profile?.cpf || prevData.cpf
      }));
    }
  }, [profile, user]);

  const handleUserDataUpdate = (updatedData: typeof userData) => {
    setUserData(updatedData);
    
    // Validate that the data matches what's in the dashboard
    const isDataValid = 
      (profile?.name === updatedData.name || !profile?.name) &&
      (profile?.email === updatedData.email || !profile?.email) &&
      (profile?.cpf === updatedData.cpf || !profile?.cpf);

    // Show appropriate toast notification
    if (isDataValid) {
      toast({
        title: "Dados atualizados com sucesso!",
        description: "Suas informações foram salvas",
      });
    } else {
      toast({
        title: "Atenção",
        description: "Alguns dados não correspondem ao seu perfil principal.",
        variant: "destructive"
      });

      // Update user data in local storage to keep in sync
      if (user) {
        const updatedUser = {
          ...user,
          name: updatedData.name,
          email: updatedData.email
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex items-center gap-4 mb-6">
            <BackButton to="/dashboard" label="Voltar ao Dashboard" />
            <div>
              <h1 className="page-title page-header">Configurações da Conta</h1>
              <p className="text-eregulariza-description">Gerencie suas informações pessoais e preferências</p>
            </div>
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
            <h2 className="section-title section-header">Políticas e Termos</h2>
            <PoliciesLinks />
          </div>
        </main>
      </div>
    </div>
  );
}
