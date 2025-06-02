
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Settings, Link2, Database, Upload, Download } from "lucide-react";

interface IntegrationConfig {
  hubspot: {
    enabled: boolean;
    apiKey: string;
    syncContacts: boolean;
    syncDeals: boolean;
  };
  googleSheets: {
    enabled: boolean;
    spreadsheetId: string;
    syncProcesses: boolean;
    autoExport: boolean;
  };
}

export default function IntegrationSettings() {
  const [config, setConfig] = useState<IntegrationConfig>({
    hubspot: {
      enabled: false,
      apiKey: "",
      syncContacts: false,
      syncDeals: false,
    },
    googleSheets: {
      enabled: false,
      spreadsheetId: "",
      syncProcesses: false,
      autoExport: false,
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveConfig = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call to save configuration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Configurações salvas",
        description: "As integrações foram configuradas com sucesso."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar as configurações."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async (integration: 'hubspot' | 'googleSheets') => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Conexão testada",
        description: `Integração com ${integration === 'hubspot' ? 'HubSpot' : 'Google Sheets'} funcionando corretamente.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Verifique as credenciais e tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Integrações
        </h2>
        <Badge variant="outline">Em Desenvolvimento</Badge>
      </div>

      {/* HubSpot Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            HubSpot CRM
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="hubspot-enabled">Habilitar integração HubSpot</Label>
            <Switch
              id="hubspot-enabled"
              checked={config.hubspot.enabled}
              onCheckedChange={(checked) => 
                setConfig(prev => ({
                  ...prev,
                  hubspot: { ...prev.hubspot, enabled: checked }
                }))
              }
            />
          </div>
          
          {config.hubspot.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="hubspot-api">API Key do HubSpot</Label>
                <Input
                  id="hubspot-api"
                  type="password"
                  placeholder="pat-na1-..."
                  value={config.hubspot.apiKey}
                  onChange={(e) => 
                    setConfig(prev => ({
                      ...prev,
                      hubspot: { ...prev.hubspot, apiKey: e.target.value }
                    }))
                  }
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sync-contacts"
                    checked={config.hubspot.syncContacts}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({
                        ...prev,
                        hubspot: { ...prev.hubspot, syncContacts: checked }
                      }))
                    }
                  />
                  <Label htmlFor="sync-contacts">Sincronizar contatos</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sync-deals"
                    checked={config.hubspot.syncDeals}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({
                        ...prev,
                        hubspot: { ...prev.hubspot, syncDeals: checked }
                      }))
                    }
                  />
                  <Label htmlFor="sync-deals">Sincronizar negócios</Label>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => testConnection('hubspot')}
                disabled={isLoading || !config.hubspot.apiKey}
              >
                Testar Conexão
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Google Sheets Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Google Sheets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sheets-enabled">Habilitar integração Google Sheets</Label>
            <Switch
              id="sheets-enabled"
              checked={config.googleSheets.enabled}
              onCheckedChange={(checked) => 
                setConfig(prev => ({
                  ...prev,
                  googleSheets: { ...prev.googleSheets, enabled: checked }
                }))
              }
            />
          </div>
          
          {config.googleSheets.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="sheet-id">ID da Planilha</Label>
                <Input
                  id="sheet-id"
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  value={config.googleSheets.spreadsheetId}
                  onChange={(e) => 
                    setConfig(prev => ({
                      ...prev,
                      googleSheets: { ...prev.googleSheets, spreadsheetId: e.target.value }
                    }))
                  }
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sync-processes"
                    checked={config.googleSheets.syncProcesses}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({
                        ...prev,
                        googleSheets: { ...prev.googleSheets, syncProcesses: checked }
                      }))
                    }
                  />
                  <Label htmlFor="sync-processes">Sincronizar processos</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-export"
                    checked={config.googleSheets.autoExport}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({
                        ...prev,
                        googleSheets: { ...prev.googleSheets, autoExport: checked }
                      }))
                    }
                  />
                  <Label htmlFor="auto-export">Exportação automática</Label>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => testConnection('googleSheets')}
                disabled={isLoading || !config.googleSheets.spreadsheetId}
              >
                Testar Conexão
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSaveConfig}
          disabled={isLoading}
          className="bg-eregulariza-primary hover:bg-eregulariza-primary/90"
        >
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
}
