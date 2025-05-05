
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PreferenciasUsuario() {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    newsUpdates: true,
    statusUpdates: true,
    documentUpdates: true
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  const handleSave = () => {
    // Simulate saving to the backend
    setTimeout(() => {
      toast({
        title: "Preferências atualizadas",
        description: "Suas configurações de notificação foram salvas com sucesso.",
      });
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificações</CardTitle>
        <CardDescription>
          Escolha como e quando deseja receber notificações.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Canais de Notificação</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <Label htmlFor="email-notifications" className="text-sm">Email</Label>
            </div>
            <Switch 
              id="email-notifications" 
              checked={preferences.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-gray-500" />
              <Label htmlFor="push-notifications" className="text-sm">Notificações Push</Label>
            </div>
            <Switch 
              id="push-notifications" 
              checked={preferences.pushNotifications}
              onCheckedChange={() => handleToggle('pushNotifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-gray-500" />
              <Label htmlFor="sms-notifications" className="text-sm">SMS</Label>
            </div>
            <Switch 
              id="sms-notifications" 
              checked={preferences.smsNotifications}
              onCheckedChange={() => handleToggle('smsNotifications')}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Tipo de Notificações</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="news-updates" className="text-sm">Novidades e atualizações</Label>
            <Switch 
              id="news-updates" 
              checked={preferences.newsUpdates}
              onCheckedChange={() => handleToggle('newsUpdates')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="status-updates" className="text-sm">Mudanças de status nos processos</Label>
            <Switch 
              id="status-updates" 
              checked={preferences.statusUpdates}
              onCheckedChange={() => handleToggle('statusUpdates')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="document-updates" className="text-sm">Atualizações de documentos</Label>
            <Switch 
              id="document-updates" 
              checked={preferences.documentUpdates}
              onCheckedChange={() => handleToggle('documentUpdates')}
            />
          </div>
        </div>
        
        <Button onClick={handleSave} className="w-full">Salvar Preferências</Button>
      </CardContent>
    </Card>
  );
}
