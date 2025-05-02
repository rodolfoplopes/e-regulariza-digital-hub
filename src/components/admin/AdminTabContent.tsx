
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProcessesTabs from "./ProcessesTabs";
import UserManagement from "./UserManagement";
import ClientsTable from "./ClientsTable";

interface Process {
  id: string;
  title: string;
  client: string;
  type: string;
  status: string;
  progress: number;
  creationDate: string;
  lastUpdate: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  processes: number;
}

interface AdminTabContentProps {
  activeSection: string;
  processes: Process[];
  clients: Client[];
  serviceTypes: string[];
}

export default function AdminTabContent({ 
  activeSection, 
  processes, 
  clients,
  serviceTypes 
}: AdminTabContentProps) {
  return (
    <>
      <TabsContent value="processos" className="mt-4">
        <ProcessesTabs 
          processes={processes}
          clients={clients}
          serviceTypes={serviceTypes}
        />
      </TabsContent>
      
      <TabsContent value="usuarios" className="mt-4">
        <UserManagement />
      </TabsContent>
      
      <TabsContent value="configuracoes" className="mt-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Configurações do Sistema</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Páginas de Políticas</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Edite o conteúdo das páginas de políticas e termos do sistema.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Política de Privacidade</h4>
                    <p className="text-sm text-muted-foreground">
                      Última atualização: 01/05/2025
                    </p>
                  </div>
                  <Button variant="outline">Editar Conteúdo</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Política de Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      Última atualização: 01/05/2025
                    </p>
                  </div>
                  <Button variant="outline">Editar Conteúdo</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Termos de Uso</h4>
                    <p className="text-sm text-muted-foreground">
                      Última atualização: 01/05/2025
                    </p>
                  </div>
                  <Button variant="outline">Editar Conteúdo</Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Configurações de E-mail</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure os templates e remetentes de e-mails automatizados.
              </p>
              
              <Button variant="outline">Gerenciar E-mails</Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </>
  );
}
