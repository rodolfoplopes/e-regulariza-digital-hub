
import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import LogoManager from "@/components/admin/LogoManager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function LogoManagementPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Gerenciamento de Logomarca | e-regulariza</title>
      </Helmet>
      
      <div className="flex h-screen bg-gray-50">
        <DashboardSidebar />
        <MobileNav 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <Link to="/configuracoes">
                  <Button variant="ghost" size="sm" className="mr-2">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold">Gerenciamento de Logomarca</h1>
              </div>
              <p className="text-gray-500">
                Personalize a logomarca da plataforma que será exibida no cabeçalho e em outros lugares.
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <LogoManager />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
