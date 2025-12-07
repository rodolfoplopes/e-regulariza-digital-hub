
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Smartphone, Save, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  newsUpdates: boolean;
  statusUpdates: boolean;
  documentUpdates: boolean;
}

export default function PreferenciasUsuario() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    newsUpdates: true,
    statusUpdates: true,
    documentUpdates: true
  });

  // Load preferences from localStorage on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userNotificationPreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(parsed);
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem('userNotificationPreferences', JSON.stringify(preferences));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setHasUnsavedChanges(false);
      
      toast({
        title: "Preferências atualizadas",
        description: "Suas configurações de notificação foram salvas com sucesso.",
        className: "bg-white border-green-100",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas preferências. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-eregulariza-primary" />
          Preferências de Notificações
        </CardTitle>
        <CardDescription>
          Escolha como e quando deseja receber notificações sobre seus processos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Mail className="h-4 w-4 text-eregulariza-primary" />
            Canais de Notificação
          </h3>
          
          <div className="space-y-4 pl-6 border-l-2 border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <Label htmlFor="email-notifications" className="text-sm font-medium">Email</Label>
                  <p className="text-xs text-gray-500">Receba atualizações por e-mail</p>
                </div>
              </div>
              <Switch 
                id="email-notifications" 
                checked={preferences.emailNotifications}
                onCheckedChange={() => handleToggle('emailNotifications')}
                className="data-[state=checked]:bg-eregulariza-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-4 w-4 text-gray-500" />
                <div>
                  <Label htmlFor="push-notifications" className="text-sm font-medium">Notificações Push</Label>
                  <p className="text-xs text-gray-500">Alertas diretos no seu dispositivo</p>
                </div>
              </div>
              <Switch 
                id="push-notifications" 
                checked={preferences.pushNotifications}
                onCheckedChange={() => handleToggle('pushNotifications')}
                className="data-[state=checked]:bg-eregulariza-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-4 w-4 text-gray-500" />
                <div>
                  <Label htmlFor="sms-notifications" className="text-sm font-medium">SMS</Label>
                  <p className="text-xs text-gray-500">Mensagens de texto importantes</p>
                </div>
              </div>
              <Switch 
                id="sms-notifications" 
                checked={preferences.smsNotifications}
                onCheckedChange={() => handleToggle('smsNotifications')}
                className="data-[state=checked]:bg-eregulariza-primary"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-eregulariza-primary" />
            Tipo de Notificações
          </h3>
          
          <div className="space-y-4 pl-6 border-l-2 border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="news-updates" className="text-sm font-medium">Novidades e atualizações</Label>
                <p className="text-xs text-gray-500">Informações sobre novos recursos</p>
              </div>
              <Switch 
                id="news-updates" 
                checked={preferences.newsUpdates}
                onCheckedChange={() => handleToggle('newsUpdates')}
                className="data-[state=checked]:bg-eregulariza-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="status-updates" className="text-sm font-medium">Mudanças de status nos processos</Label>
                <p className="text-xs text-gray-500">Quando seu processo avança ou muda</p>
              </div>
              <Switch 
                id="status-updates" 
                checked={preferences.statusUpdates}
                onCheckedChange={() => handleToggle('statusUpdates')}
                className="data-[state=checked]:bg-eregulariza-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="document-updates" className="text-sm font-medium">Atualizações de documentos</Label>
                <p className="text-xs text-gray-500">Quando documentos são solicitados ou aprovados</p>
              </div>
              <Switch 
                id="document-updates" 
                checked={preferences.documentUpdates}
                onCheckedChange={() => handleToggle('documentUpdates')}
                className="data-[state=checked]:bg-eregulariza-primary"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <Button 
            onClick={handleSave} 
            disabled={!hasUnsavedChanges || isSaving}
            className="w-full bg-eregulariza-primary hover:bg-eregulariza-primary/90 text-white transition-all duration-300"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {hasUnsavedChanges ? "Salvar Preferências" : "Preferências Salvas"}
              </>
            )}
          </Button>
          
          {hasUnsavedChanges && (
            <p className="text-xs text-orange-600 text-center mt-2">
              Você tem alterações não salvas
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
