
import React, { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProcessesTabs from "./ProcessesTabs";
import UserManagement from "./UserManagement";
import ClientsTable from "./ClientsTable";
import { FooterEditor } from "./FooterEditor";
import { PolicyEditor } from "./PolicyEditor";
import IntegrationSettings from "./IntegrationSettings";

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
  const [activeConfigSection, setActiveConfigSection] = useState<'footer' | 'policies' | 'integrations' | null>(null);

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
              <h3 className="text-lg font-medium mb-3">Rodapé do Site</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Gerencie o conteúdo do rodapé que aparece em todas as páginas do site.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setActiveConfigSection('footer');
                  const footerEditorSection = document.getElementById('footer-editor');
                  if (footerEditorSection) {
                    footerEditorSection.classList.remove('hidden');
                    footerEditorSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Editar Rodapé
              </Button>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Páginas de Políticas</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Edite o conteúdo das páginas de políticas e termos do sistema.
              </p>
              
              <Button 
                variant="outline"
                onClick={() => {
                  setActiveConfigSection('policies');
                  const policyEditorSection = document.getElementById('policy-editor');
                  if (policyEditorSection) {
                    policyEditorSection.classList.remove('hidden');
                    policyEditorSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Editar Políticas
              </Button>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Integrações</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure integrações com HubSpot, Google Sheets e outras ferramentas.
              </p>
              
              <Button 
                variant="outline"
                onClick={() => {
                  setActiveConfigSection('integrations');
                  const integrationSection = document.getElementById('integration-settings');
                  if (integrationSection) {
                    integrationSection.classList.remove('hidden');
                    integrationSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Gerenciar Integrações
              </Button>
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
        
        <div id="footer-editor" className={activeConfigSection === 'footer' ? 'mt-8' : 'mt-8 hidden'}>
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => setActiveConfigSection(null)}
          >
            ← Voltar para Configurações
          </Button>
          <FooterEditor />
        </div>
        
        <div id="policy-editor" className={activeConfigSection === 'policies' ? 'mt-8' : 'mt-8 hidden'}>
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => setActiveConfigSection(null)}
          >
            ← Voltar para Configurações
          </Button>
          <PolicyEditor />
        </div>
        
        <div id="integration-settings" className={activeConfigSection === 'integrations' ? 'mt-8' : 'mt-8 hidden'}>
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => setActiveConfigSection(null)}
          >
            ← Voltar para Configurações
          </Button>
          <IntegrationSettings />
        </div>
      </TabsContent>
    </>
  );
}
