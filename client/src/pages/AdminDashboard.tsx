
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTabContent from "@/components/admin/AdminTabContent";
import IntegrationSettings from "@/components/admin/IntegrationSettings";
import MetricsDashboard from "@/components/admin/MetricsDashboard";
import ProductionSettings from "@/components/production/ProductionSettings";
import ProductionChecklist from "@/components/production/ProductionChecklist";
import AuditLogPanel from "@/components/admin/AuditLogPanel";
import PermissionMatrixCard from "@/components/admin/PermissionMatrixCard";
import SystemOverview from "@/components/admin/SystemOverview";
import ProcessValidationDashboard from "@/components/process/ProcessValidationDashboard";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { Navigate } from "react-router-dom";

export default function AdminDashboard() {
  const { profile, isLoading: authLoading } = useSupabaseAuth();
  const permissions = usePermissions();
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-eregulariza-primary"></div>
          <p className="mt-4 text-eregulariza-description">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!profile || !permissions.canManageUsers) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader 
        clients={[]} 
        serviceTypes={[]} 
      />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-eregulariza-gray">Dashboard Administrativo</h1>
            <p className="text-eregulariza-description mt-1">Gerencie processos, clientes e configurações do sistema</p>
          </div>
          <Button 
            onClick={() => navigate('/admin/novo-processo')}
            className="bg-eregulariza-primary hover:bg-eregulariza-primary/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Processo
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-11 w-full lg:w-auto">
            {permissions.isSuperAdmin && (
              <TabsTrigger value="overview">Resumo</TabsTrigger>
            )}
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="processes">Processos</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="cms">CMS</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
            <TabsTrigger value="production">Produção</TabsTrigger>
            <TabsTrigger value="checklist">Go Live</TabsTrigger>
            {permissions.isSuperAdmin && (
              <>
                <TabsTrigger value="audit">Logs</TabsTrigger>
                <TabsTrigger value="permissions">Permissões</TabsTrigger>
              </>
            )}
          </TabsList>

          <Separator />

          {permissions.isSuperAdmin && (
            <TabsContent value="overview">
              <SystemOverview />
            </TabsContent>
          )}

          <TabsContent value="dashboard">
            <AdminTabContent 
              activeSection="dashboard"
              processes={[]}
              clients={[]}
              serviceTypes={[]}
            />
          </TabsContent>

          <TabsContent value="processes">
            <ProcessValidationDashboard />
          </TabsContent>

          <TabsContent value="clients">
            <AdminTabContent 
              activeSection="clients"
              processes={[]}
              clients={[]}
              serviceTypes={[]}
            />
          </TabsContent>

          <TabsContent value="cms">
            <AdminTabContent 
              activeSection="cms"
              processes={[]}
              clients={[]}
              serviceTypes={[]}
            />
          </TabsContent>

          <TabsContent value="metrics">
            <MetricsDashboard />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationSettings />
          </TabsContent>

          <TabsContent value="production">
            <ProductionSettings />
          </TabsContent>

          <TabsContent value="checklist">
            <ProductionChecklist />
          </TabsContent>

          {permissions.isSuperAdmin && (
            <>
              <TabsContent value="audit">
                <AuditLogPanel />
              </TabsContent>

              <TabsContent value="permissions">
                <PermissionMatrixCard />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
}
