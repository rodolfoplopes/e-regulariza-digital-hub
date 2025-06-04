
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Settings, Link2, Database, Upload, Download, Zap, Clock } from "lucide-react";
import { webhookService } from "@/services/webhookService";
import { AutomationConfig } from "@/services/core/types";

export default function IntegrationSettings() {
  const [config, setConfig] = useState<AutomationConfig>({
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
    },
    notifications: {
      sms: false,
      email: false,
      webhook: false,
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const currentConfig = await webhookService.getAutomationConfig();
      if (currentConfig) {
        setConfig(currentConfig);
      }
    } catch (error) {
      console.error('Error loading config:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar configurações"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    
    try {
      await webhookService.updateAutomationConfig(config);
      
      toast({
        title: "Configurações salvas",
        description: "As integrações foram configuradas com sucesso."
      });
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar as configurações."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async (integration: 'hubspot' | 'googleSheets') => {
    setIsLoading(true);
    
    try {
      let success = false;
      
      if (integration === 'hubspot') {
        success = await webhookService.sendToHubSpot({
          test: true,
          client: { name: 'Test User', email: 'test@example.com' }
        });
      } else {
        success = await webhookService.sendToGoogleSheets({
          test: true,
          process_number: 'TEST-001',
          title: 'Teste de Conexão'
        });
      }
      
      if (success) {
        toast({
          title: "Conexão testada",
          description: `Integração com ${integration === 'hubspot' ? 'HubSpot' : 'Google Sheets'} funcionando corretamente.`
        });
      } else {
        throw new Error('Test failed');
      }
    } catch (error) {
      console.error('Connection test error:', error);
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Verifique as credenciais e tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerManualExport = async () => {
    setIsLoading(true);
    
    try {
      // Trigger the automated export function manually
      const response = await fetch(`https://ntnqgfrspuafnlctkrfk.supabase.co/functions/v1/automated-export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bnFnZnJzcHVhZm5sY3RrcmZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NTkxMzUsImV4cCI6MjA2NDUzNTEzNX0.FWoQYCVUu1isxEyDtFPYrpKfSbajPp0G-R73aCJesIY'}`
        },
        body: JSON.stringify({ manual: true })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Exportação concluída",
          description: `${result.exported} processos exportados com sucesso!`
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Manual export error:', error);
      toast({
        variant: "destructive",
        title: "Erro na exportação",
        description: "Erro ao executar exportação manual."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !config.hubspot.enabled && !config.googleSheets.enabled) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Integrações
          </h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Integrações e Automações
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={triggerManualExport}
            disabled={isLoading}
          >
            <Zap className="h-4 w-4 mr-2" />
            Exportar Agora
          </Button>
          <Badge variant={config.hubspot.enabled || config.googleSheets.enabled ? "default" : "secondary"}>
            {config.hubspot.enabled || config.googleSheets.enabled ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
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
                  value={config.hubspot.apiKey || ""}
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
                  value={config.googleSheets.spreadsheetId || ""}
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

      {/* Automated Export Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Exportação Automatizada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Exportação Semanal Automática</h4>
            <p className="text-sm text-blue-700 mb-3">
              O sistema exporta automaticamente os dados semanalmente para as integrações habilitadas.
            </p>
            <Button 
              onClick={triggerManualExport}
              disabled={isLoading}
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Executar Exportação Manual
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSaveConfig}
          disabled={isSaving}
          className="bg-eregulariza-primary hover:bg-eregulariza-primary/90"
        >
          {isSaving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
}
