
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FooterData } from "@/types/footer";

interface GeneralInfoTabProps {
  footerData: FooterData;
  setFooterData: React.Dispatch<React.SetStateAction<FooterData>>;
}

export function GeneralInfoTab({ footerData, setFooterData }: GeneralInfoTabProps) {
  return (
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
  );
}
