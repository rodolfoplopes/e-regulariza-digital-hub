
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, TestTube, Eye } from 'lucide-react';
import { smsTemplates } from '@/services/twilioService';

export default function SystemSettings() {
  const { toast } = useToast();
  
  // GTM Settings
  const [gtmId, setGtmId] = useState(localStorage.getItem('gtm_id') || '');
  const [gtmEnabled, setGtmEnabled] = useState(localStorage.getItem('gtm_enabled') === 'true');
  
  // Twilio Settings
  const [twilioAccountSid, setTwilioAccountSid] = useState(localStorage.getItem('twilio_account_sid') || '');
  const [twilioAuthToken, setTwilioAuthToken] = useState(localStorage.getItem('twilio_auth_token') || '');
  const [twilioPhoneNumber, setTwilioPhoneNumber] = useState(localStorage.getItem('twilio_phone_number') || '');
  const [twilioEnabled, setTwilioEnabled] = useState(localStorage.getItem('twilio_enabled') === 'true');
  
  // SEO Settings
  const [defaultSeoTitle, setDefaultSeoTitle] = useState(localStorage.getItem('default_seo_title') || 'e-regulariza - Regularização Imobiliária Digital');
  const [defaultSeoDescription, setDefaultSeoDescription] = useState(localStorage.getItem('default_seo_description') || 'Simplifique sua regularização imobiliária com nossa plataforma digital.');

  const handleSaveGTM = () => {
    localStorage.setItem('gtm_id', gtmId);
    localStorage.setItem('gtm_enabled', gtmEnabled.toString());
    
    toast({
      title: 'GTM Configurado',
      description: 'Configurações do Google Tag Manager salvas com sucesso.'
    });
  };

  const handleSaveTwilio = () => {
    localStorage.setItem('twilio_account_sid', twilioAccountSid);
    localStorage.setItem('twilio_auth_token', twilioAuthToken);
    localStorage.setItem('twilio_phone_number', twilioPhoneNumber);
    localStorage.setItem('twilio_enabled', twilioEnabled.toString());
    
    toast({
      title: 'Twilio Configurado',
      description: 'Configurações do Twilio salvas com sucesso.'
    });
  };

  const handleSaveSEO = () => {
    localStorage.setItem('default_seo_title', defaultSeoTitle);
    localStorage.setItem('default_seo_description', defaultSeoDescription);
    
    toast({
      title: 'SEO Configurado',
      description: 'Configurações padrão de SEO salvas com sucesso.'
    });
  };

  const handleTestTwilio = () => {
    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Preencha todas as configurações do Twilio antes de testar.'
      });
      return;
    }

    // Simulate test
    toast({
      title: 'Teste Twilio',
      description: 'SMS de teste seria enviado (funcionalidade requer backend).'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Configurações do Sistema</h2>
        <p className="text-gray-500">Configure integrações e ferramentas de rastreamento</p>
      </div>

      <Tabs defaultValue="gtm" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gtm">Google Tag Manager</TabsTrigger>
          <TabsTrigger value="twilio">Twilio SMS</TabsTrigger>
          <TabsTrigger value="seo">SEO Padrão</TabsTrigger>
        </TabsList>

        <TabsContent value="gtm">
          <Card>
            <CardHeader>
              <CardTitle>Google Tag Manager</CardTitle>
              <CardDescription>
                Configure o GTM para rastreamento de eventos e conversões
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={gtmEnabled} 
                  onCheckedChange={setGtmEnabled}
                />
                <Label>Habilitar Google Tag Manager</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gtm-id">GTM Container ID</Label>
                <Input
                  id="gtm-id"
                  placeholder="GTM-XXXXXXX"
                  value={gtmId}
                  onChange={(e) => setGtmId(e.target.value)}
                  disabled={!gtmEnabled}
                />
                <p className="text-sm text-gray-500">
                  Formato: GTM-XXXXXXX (encontre no painel do Google Tag Manager)
                </p>
              </div>

              <Button onClick={handleSaveGTM} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações GTM
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="twilio">
          <Card>
            <CardHeader>
              <CardTitle>Twilio SMS</CardTitle>
              <CardDescription>
                Configure o Twilio para envio automático de SMS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={twilioEnabled} 
                  onCheckedChange={setTwilioEnabled}
                />
                <Label>Habilitar Twilio SMS</Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twilio-sid">Account SID</Label>
                  <Input
                    id="twilio-sid"
                    type="password"
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    value={twilioAccountSid}
                    onChange={(e) => setTwilioAccountSid(e.target.value)}
                    disabled={!twilioEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twilio-token">Auth Token</Label>
                  <Input
                    id="twilio-token"
                    type="password"
                    placeholder="•••••••••••••••••••••••••••••••"
                    value={twilioAuthToken}
                    onChange={(e) => setTwilioAuthToken(e.target.value)}
                    disabled={!twilioEnabled}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twilio-phone">Número Twilio</Label>
                <Input
                  id="twilio-phone"
                  placeholder="+5511999999999"
                  value={twilioPhoneNumber}
                  onChange={(e) => setTwilioPhoneNumber(e.target.value)}
                  disabled={!twilioEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label>Templates de SMS Disponíveis</Label>
                <div className="space-y-2">
                  {smsTemplates.map((template) => (
                    <div key={template.id} className="p-3 border rounded-lg">
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-gray-500">{template.message}</p>
                      <p className="text-xs text-gray-400">
                        Variáveis: {template.variables.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveTwilio} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
                <Button onClick={handleTestTwilio} variant="outline">
                  <TestTube className="h-4 w-4 mr-2" />
                  Testar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Padrão</CardTitle>
              <CardDescription>
                Configure metadados padrão para todas as páginas públicas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo-title">Título Padrão</Label>
                <Input
                  id="seo-title"
                  value={defaultSeoTitle}
                  onChange={(e) => setDefaultSeoTitle(e.target.value)}
                  maxLength={60}
                />
                <p className="text-sm text-gray-500">
                  Máximo 60 caracteres para melhor exibição nos resultados de busca
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seo-description">Descrição Padrão</Label>
                <Textarea
                  id="seo-description"
                  value={defaultSeoDescription}
                  onChange={(e) => setDefaultSeoDescription(e.target.value)}
                  maxLength={160}
                  rows={3}
                />
                <p className="text-sm text-gray-500">
                  Máximo 160 caracteres para melhor exibição nos resultados de busca
                </p>
              </div>

              <Button onClick={handleSaveSEO} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações SEO
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
