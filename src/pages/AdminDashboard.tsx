
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTabContent from "@/components/admin/AdminTabContent";
import IntegrationSettings from "@/components/admin/IntegrationSettings";
import MetricsDashboard from "@/components/admin/MetricsDashboard";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { Navigate } from "react-router-dom";

export default function AdminDashboard() {
  const { profile, isLoading: authLoading } = useSupabaseAuth();
  const permissions = usePermissions();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-eregulariza-primary"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!profile || !permissions.canManageUsers) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        clients={[]} 
        serviceTypes={[]} 
      />
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-6 w-full lg:w-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="processes">Processos</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="cms">CMS</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
          </TabsList>

          <Separator />

          <TabsContent value="dashboard">
            <AdminTabContent 
              activeSection="dashboard"
              processes={[]}
              clients={[]}
              serviceTypes={[]}
            />
          </TabsContent>

          <TabsContent value="processes">
            <AdminTabContent 
              activeSection="processes"
              processes={[]}
              clients={[]}
              serviceTypes={[]}
            />
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
        </Tabs>
      </main>
    </div>
  );
}
