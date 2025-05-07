
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash } from "lucide-react";
import { FooterData } from "@/types/footer";

interface ContactTabProps {
  footerData: FooterData;
  updateContactInfo: (field: keyof typeof FooterData.prototype.contactInfo, value: string) => void;
  updateLink: (section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks', index: number, field: string, value: string) => void;
  removeLink: (section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks', index: number) => void;
  addLink: (section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks') => void;
}

export function ContactTab({ 
  footerData, 
  updateContactInfo, 
  updateLink, 
  removeLink, 
  addLink 
}: ContactTabProps) {
  return (
    <>
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
      
      <Card className="mt-4">
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
    </>
  );
}
