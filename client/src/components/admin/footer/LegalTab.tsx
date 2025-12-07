
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash } from "lucide-react";
import { FooterData } from "@/types/footer";

interface LegalTabProps {
  footerData: FooterData;
  updateLink: (section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks', index: number, field: string, value: string) => void;
  removeLink: (section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks', index: number) => void;
  addLink: (section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks') => void;
}

export function LegalTab({ footerData, updateLink, removeLink, addLink }: LegalTabProps) {
  return (
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
  );
}
