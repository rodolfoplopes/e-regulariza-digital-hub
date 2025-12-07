
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ChangePasswordModal from "./ChangePasswordModal";

export default function SecuritySettings() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>
            Gerencie sua senha e configurações de segurança.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Senha</Label>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">••••••••••••</p>
              <Button onClick={() => setIsPasswordModalOpen(true)} variant="outline">
                Alterar senha
              </Button>
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            <Label>Autenticação de dois fatores</Label>
            <p className="text-sm text-muted-foreground">
              Aumente a segurança da sua conta ativando a autenticação de dois fatores.
            </p>
            <Button variant="outline" className="mt-2">
              Configurar 2FA
            </Button>
          </div>
        </CardContent>
      </Card>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </>
  );
}
