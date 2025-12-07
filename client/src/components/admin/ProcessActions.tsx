
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, MessageSquare, Calendar, AlertTriangle } from "lucide-react";

interface ProcessActionsProps {
  processId: string;
  currentStage: string;
  isAdmin: boolean;
}

export default function ProcessActions({ processId, currentStage, isAdmin }: ProcessActionsProps) {
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const actions = [
    { value: "complete_stage", label: "Marcar Etapa como Concluída", icon: CheckCircle, color: "text-green-600" },
    { value: "add_comment", label: "Adicionar Comentário", icon: MessageSquare, color: "text-blue-600" },
    { value: "schedule_follow_up", label: "Agendar Acompanhamento", icon: Calendar, color: "text-purple-600" },
    { value: "flag_issue", label: "Sinalizar Problema", icon: AlertTriangle, color: "text-red-600" }
  ];

  const handleAction = async () => {
    if (!selectedAction || !comment.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione uma ação e adicione um comentário."
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const actionLabel = actions.find(a => a.value === selectedAction)?.label;
      
      toast({
        title: "Ação executada",
        description: `${actionLabel} realizada com sucesso para o processo ${processId}.`
      });
      
      setIsActionDialogOpen(false);
      setSelectedAction("");
      setComment("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível executar a ação. Tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Ações do Processo</h3>
        <Badge variant="outline">{currentStage}</Badge>
      </div>
      
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-eregulariza-primary hover:bg-eregulariza-primary/90">
            Executar Ação
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ações do Processo</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Selecionar Ação</label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma ação..." />
                </SelectTrigger>
                <SelectContent>
                  {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <SelectItem key={action.value} value={action.value}>
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${action.color}`} />
                          {action.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Comentário</label>
              <Textarea
                placeholder="Adicione detalhes sobre a ação..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsActionDialogOpen(false)}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAction}
                disabled={isLoading || !selectedAction || !comment.trim()}
                className="flex-1 bg-eregulariza-primary hover:bg-eregulariza-primary/90"
              >
                {isLoading ? "Executando..." : "Confirmar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
