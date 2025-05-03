
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const { toast } = useToast();
  
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const validateForm = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
    
    if (!currentPassword) {
      newErrors.currentPassword = "A senha atual é obrigatória";
    }
    
    if (!newPassword) {
      newErrors.newPassword = "A nova senha é obrigatória";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "A senha deve ter pelo menos 8 caracteres";
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(newPassword)) {
      newErrors.newPassword = "A senha deve conter letras e números";
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
      // Check if we have reached the attempt limit
      if (attemptCount >= 3) {
        toast({
          variant: "destructive",
          title: "Muitas tentativas",
          description: "Por favor, aguarde alguns minutos antes de tentar novamente.",
        });
        setIsLoading(false);
        return;
      }
      
      // This is where we would integrate with Supabase
      // In a real implementation, you would use:
      // 
      // 1. First authenticate the current password:
      // const { error: signInError } = await supabase.auth.signInWithPassword({
      //   email: currentUserEmail, // You would need to get this from your auth context
      //   password: currentPassword,
      // });
      // 
      // 2. If current password is correct, update to the new password:
      // if (!signInError) {
      //   const { error: updateError } = await supabase.auth.updateUser({ 
      //     password: newPassword 
      //   });
      //  
      //   if (!updateError) {
      //     // Success
      //   }
      // }
      
      // For now, we'll simulate the API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate random success/failure for demonstration
      const isSuccessful = true; // In real implementation, this would depend on the API response
      
      if (isSuccessful) {
        toast({
          title: "Senha alterada com sucesso",
          description: "Sua senha foi atualizada com segurança.",
        });
        
        // Reset form and close modal
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setAttemptCount(0);
        onClose();
      } else {
        setAttemptCount(prev => prev + 1);
        toast({
          variant: "destructive",
          title: "Erro ao alterar senha",
          description: "Por favor, verifique se sua senha atual está correta.",
        });
      }
    } catch (error) {
      setAttemptCount(prev => prev + 1);
      toast({
        variant: "destructive",
        title: "Erro ao alterar senha",
        description: "Por favor, verifique se sua senha atual está correta.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar senha</DialogTitle>
          <DialogDescription>
            Para sua segurança, informe sua senha atual antes de definir uma nova senha.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha atual</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={isLoading}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-destructive">{errors.currentPassword}</p>
              )}
            </div>
            
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
              className="eregulariza-gradient hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? "Alterando..." : "Alterar senha"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
