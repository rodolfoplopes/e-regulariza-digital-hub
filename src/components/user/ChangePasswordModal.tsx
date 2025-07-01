
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      return false;
    }
    // Check for at least one letter and one number
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasLetter && hasNumber;
  };

  const validateForm = () => {
    const newErrors = {
      newPassword: "",
      confirmPassword: ""
    };
    
    if (!newPassword) {
      newErrors.newPassword = "A nova senha é obrigatória";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "A senha deve ter pelo menos 8 caracteres";
    } else if (!validatePassword(newPassword)) {
      newErrors.newPassword = "A senha deve conter pelo menos uma letra e um número";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirme a nova senha";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não conferem";
    }
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) {
        console.error('Password change error:', error);
        toast({
          variant: "destructive",
          title: "Erro ao alterar senha",
          description: error.message || "Ocorreu um erro ao alterar sua senha. Tente novamente.",
        });
      } else {
        toast({
          title: "Senha alterada com sucesso",
          description: "Sua senha foi atualizada com segurança.",
        });
        
        // Reset form and close modal
        setNewPassword("");
        setConfirmPassword("");
        setErrors({ newPassword: "", confirmPassword: "" });
        onClose();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setErrors({ newPassword: "", confirmPassword: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar senha</DialogTitle>
          <DialogDescription>
            Digite sua nova senha. Ela deve ter pelo menos 8 caracteres e conter letras e números.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">            
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isLoading}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.newPassword ? (
                <p className="text-sm text-destructive">{errors.newPassword}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  A senha deve ter pelo menos 8 caracteres, incluindo letras e números.
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirme a nova senha</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-[#3C00F8] hover:bg-[#3C00F8]/90 text-white"
              disabled={isLoading || !newPassword || !confirmPassword}
            >
              {isLoading ? "Alterando..." : "Alterar senha"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
