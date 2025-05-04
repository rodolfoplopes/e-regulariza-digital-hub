
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PreferenciasUsuario() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificações</CardTitle>
        <CardDescription>
          Escolha como e quando deseja receber notificações.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Preferências de notificação serão implementadas em breve.
        </p>
      </CardContent>
    </Card>
  );
}
