
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FooterLink {
  label: string;
  url: string;
}

interface SocialLink extends FooterLink {
  platform: string;
}

interface FooterData {
  about: string;
  companyLinks: FooterLink[];
  serviceLinks: FooterLink[];
  contactInfo: {
    email: string;
    phone: string;
    location: string;
  };
  socialLinks: SocialLink[];
  legalLinks: FooterLink[];
  copyright: string;
  websiteUrl: string;
}

export function FooterEditor() {
  const { toast } = useToast();
  
  // Initial data - in a real app this would be fetched from an API/database
  const [footerData, setFooterData] = useState<FooterData>({
    about: "Transformando a experiência de regularização imobiliária em algo simples, transparente e confiável.",
    companyLinks: [
      { label: "Sobre nós", url: "/sobre" },
      { label: "Casos de sucesso", url: "/cases" },
      { label: "Blog", url: "/blog" },
      { label: "Carreiras", url: "/carreiras" }
    ],
    serviceLinks: [
      { label: "Usucapião", url: "/servicos/usucapiao" },
      { label: "Inventário Extrajudicial", url: "/servicos/inventario" },
      { label: "Retificação de Área", url: "/servicos/retificacao" },
      { label: "Demarcação de Imóvel", url: "/servicos/demarcacao" }
    ],
    contactInfo: {
      email: "contato@eregulariza.com.br",
      phone: "+55 (11) 9999-9999",
      location: "São Paulo, SP"
    },
    socialLinks: [
      { platform: "Facebook", label: "Facebook", url: "https://facebook.com/eregulariza" },
      { platform: "Instagram", label: "Instagram", url: "https://instagram.com/eregulariza" },
      { platform: "LinkedIn", label: "LinkedIn", url: "https://linkedin.com/company/eregulariza" }
    ],
    legalLinks: [
      { label: "Política de Privacidade", url: "/privacidade" },
      { label: "Termos de Uso", url: "/termos" },
      { label: "Política de Cookies", url: "/cookies" }
    ],
    copyright: "© 2025 e-regulariza. Todos os direitos reservados.",
    websiteUrl: "https://www.e-regulariza.com"
  });

  const handleSave = () => {
    // Here you would typically save to a database
    // For now, we'll just show a toast
    toast({
      title: "Configurações de rodapé salvas",
      description: "Suas alterações foram salvas com sucesso.",
    });
  };

  const updateContactInfo = (field: keyof typeof footerData.contactInfo, value: string) => {
    setFooterData({
      ...footerData,
      contactInfo: {
        ...footerData.contactInfo,
        [field]: value
      }
    });
  };

  const addLink = (section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks') => {
    if (section === 'socialLinks') {
      setFooterData({
        ...footerData,
        [section]: [...footerData[section], { platform: '', label: '', url: '' }]
      });
    } else {
      setFooterData({
        ...footerData,
        [section]: [...footerData[section], { label: '', url: '' }]
      });
    }
  };

  const updateLink = (
    section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks',
    index: number,
    field: string,
    value: string
  ) => {
    const updatedLinks = [...footerData[section]];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    
    setFooterData({
      ...footerData,
      [section]: updatedLinks
    });
  };

  const removeLink = (
    section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks',
    index: number
  ) => {
    setFooterData({
      ...footerData,
      [section]: footerData[section].filter((_, i) => i !== index)
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Editor de Rodapé</h1>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about">Texto Institucional</Label>
                <Textarea 
                  id="about" 
                  value={footerData.about}
                  onChange={(e) => setFooterData({ ...footerData, about: e.target.value })}
                  placeholder="Texto sobre a empresa"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="copyright">Texto de Copyright</Label>
                <Input 
                  id="copyright" 
                  value={footerData.copyright}
                  onChange={(e) => setFooterData({ ...footerData, copyright: e.target.value })}
                  placeholder="© 2025 Empresa. Todos os direitos reservados."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Link para Website Institucional</Label>
                <Input 
                  id="website" 
                  value={footerData.websiteUrl}
                  onChange={(e) => setFooterData({ ...footerData, websiteUrl: e.target.value })}
                  placeholder="https://www.seusite.com.br"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Links da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {footerData.companyLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    value={link.label}
                    onChange={(e) => updateLink('companyLinks', index, 'label', e.target.value)}
                    placeholder="Título do link"
                    className="flex-1"
                  />
                  <Input 
                    value={link.url}
                    onChange={(e) => updateLink('companyLinks', index, 'url', e.target.value)}
                    placeholder="/caminho-do-link"
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeLink('companyLinks', index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => addLink('companyLinks')}
                className="mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Link
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Links de Serviços</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {footerData.serviceLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    value={link.label}
                    onChange={(e) => updateLink('serviceLinks', index, 'label', e.target.value)}
                    placeholder="Título do serviço"
                    className="flex-1"
                  />
                  <Input 
                    value={link.url}
                    onChange={(e) => updateLink('serviceLinks', index, 'url', e.target.value)}
                    placeholder="/caminho-do-servico"
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeLink('serviceLinks', index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => addLink('serviceLinks')}
                className="mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Serviço
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={footerData.contactInfo.email}
                  onChange={(e) => updateContactInfo('email', e.target.value)}
                  placeholder="contato@empresa.com.br"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone" 
                  value={footerData.contactInfo.phone}
                  onChange={(e) => updateContactInfo('phone', e.target.value)}
                  placeholder="+55 (11) 9999-9999"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input 
                  id="location" 
                  value={footerData.contactInfo.location}
                  onChange={(e) => updateContactInfo('location', e.target.value)}
                  placeholder="São Paulo, SP"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {footerData.socialLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-3 gap-2">
                  <Input 
                    value={link.platform}
                    onChange={(e) => updateLink('socialLinks', index, 'platform', e.target.value)}
                    placeholder="Plataforma"
                  />
                  <Input 
                    value={link.url}
                    onChange={(e) => updateLink('socialLinks', index, 'url', e.target.value)}
                    placeholder="https://plataforma.com/perfil"
                  />
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeLink('socialLinks', index)}
                      className="ml-auto"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => addLink('socialLinks')}
                className="mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Rede Social
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="legal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Links Legais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {footerData.legalLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    value={link.label}
                    onChange={(e) => updateLink('legalLinks', index, 'label', e.target.value)}
                    placeholder="Título do documento legal"
                    className="flex-1"
                  />
                  <Input 
                    value={link.url}
                    onChange={(e) => updateLink('legalLinks', index, 'url', e.target.value)}
                    placeholder="/caminho-do-documento"
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeLink('legalLinks', index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => addLink('legalLinks')}
                className="mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Link Legal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSave} className="bg-eregulariza-primary hover:bg-eregulariza-primary/90">
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
