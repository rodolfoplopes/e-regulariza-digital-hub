
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import ReportExport from "@/components/admin/ReportExport";
import EmailSender from "@/components/admin/EmailSender";

interface Client {
  id: string;
  name: string;
}

interface AdminHeaderProps {
  clients: Client[];
  serviceTypes: string[];
}

export default function AdminHeader({ clients, serviceTypes }: AdminHeaderProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <p className="text-gray-500">Gerencie processos, clientes e configurações</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild variant="outline">
          <Link to="/admin/novo-processo">
            <FilePlus className="h-4 w-4 mr-2" />
            Novo Processo
          </Link>
        </Button>
        
        <ReportExport 
          clients={clients}
          serviceTypes={serviceTypes.map(type => ({ id: type, name: type }))}
        />
        
        <EmailSender />
      </div>
    </div>
  );
}
