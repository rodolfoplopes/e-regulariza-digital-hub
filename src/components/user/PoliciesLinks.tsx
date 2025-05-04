
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PoliciesLinks() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Política de Privacidade</h3>
              <p className="text-sm text-muted-foreground">
                Como seus dados são protegidos e utilizados.
              </p>
            </div>
            <Button variant="link" asChild>
              <a href="/politica-de-privacidade" target="_blank">Visualizar</a>
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Política de Cookies</h3>
              <p className="text-sm text-muted-foreground">
                Como utilizamos cookies para melhorar sua experiência.
              </p>
            </div>
            <Button variant="link" asChild>
              <a href="/politica-de-cookies" target="_blank">Visualizar</a>
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Termos de Uso</h3>
              <p className="text-sm text-muted-foreground">
                Termos e condições de uso da plataforma.
              </p>
            </div>
            <Button variant="link" asChild>
              <a href="/termos-de-uso" target="_blank">Visualizar</a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
