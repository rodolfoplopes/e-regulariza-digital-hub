import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { documentValidationService } from "@/services/documentValidationService";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface DocumentValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentName: string;
  action: 'approve' | 'reject';
  onValidationComplete: () => void;
}

export default function DocumentValidationModal({
  isOpen,
  onClose,
  documentId,
  documentName,
  action,
  onValidationComplete,
}: DocumentValidationModalProps) {
  const [observation, setObservation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { profile } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (action === 'reject' && !observation.trim()) {
      toast({
        title: "Observação obrigatória",
        description: "Por favor, informe o motivo da rejeição.",
        variant: "destructive",
      });
      return;
    }

    if (!profile?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await documentValidationService.validateDocument({
        documentId,
        status: action === 'approve' ? 'aprovado' : 'rejeitado',
        observation: observation.trim() || undefined,
        reviewerId: profile.id,
      });

      if (success) {
        toast({
          title: action === 'approve' ? "Documento aprovado" : "Documento rejeitado",
          description: `O documento "${documentName}" foi ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso.`,
        });
        
        onValidationComplete();
        onClose();
        setObservation("");
      } else {
        toast({
          title: "Erro ao validar documento",
          description: "Ocorreu um erro ao processar a validação. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error validating document:', error);
      toast({
        title: "Erro interno",
        description: "Ocorreu um erro interno. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setObservation("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {action === 'approve' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            {action === 'approve' ? 'Aprovar Documento' : 'Rejeitar Documento'}
          </DialogTitle>
          <DialogDescription>
            {action === 'approve' 
              ? `Confirme a aprovação do documento "${documentName}".`
              : `Informe o motivo da rejeição do documento "${documentName}".`
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="observation">
                {action === 'approve' ? 'Observação (opcional)' : 'Motivo da rejeição *'}
              </Label>
              <Textarea
                id="observation"
                placeholder={
                  action === 'approve' 
                    ? "Adicione uma observação sobre a aprovação..."
                    : "Descreva o motivo da rejeição..."
                }
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="min-h-[100px]"
                required={action === 'reject'}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant={action === 'approve' ? 'default' : 'destructive'}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processando...' : (action === 'approve' ? 'Aprovar' : 'Rejeitar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}