
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash } from "lucide-react";
import { FooterData, FooterLink } from "@/types/footer";

interface LinksTabProps {
  footerData: FooterData;
  updateLink: (section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks', index: number, field: string, value: string) => void;
  removeLink: (section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks', index: number) => void;
  addLink: (section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks') => void;
}

export function LinksTab({ footerData, updateLink, removeLink, addLink }: LinksTabProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Links da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {footerData.companyLinks.map((link, index) => (
            <LinkEditor
              key={index}
              link={link}
              index={index}
              section="companyLinks"
              updateLink={updateLink}
              removeLink={removeLink}
            />
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
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Links de Serviços</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {footerData.serviceLinks.map((link, index) => (
            <LinkEditor
              key={index}
              link={link}
              index={index}
              section="serviceLinks"
              updateLink={updateLink}
              removeLink={removeLink}
            />
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
    </>
  );
}

interface LinkEditorProps {
  link: FooterLink;
  index: number;
  section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks';
  updateLink: (section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks', index: number, field: string, value: string) => void;
  removeLink: (section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks', index: number) => void;
}

function LinkEditor({ link, index, section, updateLink, removeLink }: LinkEditorProps) {
  return (
    <div className="flex gap-2">
      <Input 
        value={link.label}
        onChange={(e) => updateLink(section, index, 'label', e.target.value)}
        placeholder="Título do link"
        className="flex-1"
      />
      <Input 
        value={link.url}
        onChange={(e) => updateLink(section, index, 'url', e.target.value)}
        placeholder="/caminho-do-link"
        className="flex-1"
      />
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => removeLink(section, index)}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
