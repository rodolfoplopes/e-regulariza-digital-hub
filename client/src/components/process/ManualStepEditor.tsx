
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Save, X, Trash2, Calendar, Clock, CheckCircle } from "lucide-react";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";
import { auditService } from "@/services/auditService";
import { sendNotification, notificationTemplates } from "@/services/notificationHelperService";

interface ProcessStep {
  id: string;
  title: string;
  description: string | null;
  status: string;
  order_number: number;
  deadline: string | null;
  completed_at: string | null;
  process_id: string;
}

interface ManualStepEditorProps {
  processId: string;
  processTitle: string;
  clientId: string;
  onStepsChange?: () => void;
}

export default function ManualStepEditor({ 
  processId, 
  processTitle, 
  clientId, 
  onStepsChange 
}: ManualStepEditorProps) {
  const { toast } = useToast();
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [notifyClient, setNotifyClient] = useState(true);
  
  const [newStep, setNewStep] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "pendente"
  });

  const statusOptions = [
    { value: "pendente", label: "Pendente", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
    { value: "em_andamento", label: "Em Andamento", icon: Clock, color: "bg-blue-100 text-blue-800" },
    { value: "concluido", label: "Concluído", icon: CheckCircle, color: "bg-green-100 text-green-800" }
  ];

  useEffect(() => {
    fetchSteps();
  }, [processId]);

  const fetchSteps = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('process_steps')
        .select('*')
        .eq('process_id', processId)
        .order('order_number');

      if (error) throw error;
      setSteps(data || []);
    } catch (error) {
      console.error('Erro ao carregar etapas:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar etapas",
        description: "Não foi possível carregar as etapas do processo"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStep = async () => {
    if (!newStep.title.trim()) {
      toast({
        variant: "destructive",
        title: "Título obrigatório",
        description: "Digite um título para a etapa"
      });
      return;
    }

    try {
      const nextOrderNumber = Math.max(...steps.map(s => s.order_number), 0) + 1;
      
      const { data, error } = await supabase
        .from('process_steps')
        .insert({
          process_id: processId,
          title: newStep.title,
          description: newStep.description || null,
          status: newStep.status,
          order_number: nextOrderNumber,
          deadline: newStep.deadline || null
        })
        .select()
        .single();

      if (error) throw error;

      // Registrar log de auditoria
      await auditService.createAuditLog({
        action: 'ADD_PROCESS_STEP',
        target_type: 'process',
        target_id: processId,
        target_name: processTitle,
        details: {
          step_title: newStep.title,
          step_order: nextOrderNumber,
          step_status: newStep.status
        }
      });

      // Enviar notificação se habilitado
      if (notifyClient) {
        const template = notificationTemplates.stepCompleted(processId, newStep.title);
        await sendNotification(clientId, template, processId, `/processo/${processId}`);
      }

      setSteps(prev => [...prev, data]);
      setNewStep({ title: "", description: "", deadline: "", status: "pendente" });
      setIsAddingNew(false);
      onStepsChange?.();

      toast({
        title: "Etapa criada com sucesso!",
        description: `A etapa "${newStep.title}" foi adicionada ao processo`
      });
    } catch (error) {
      console.error('Erro ao adicionar etapa:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar etapa",
        description: "Não foi possível criar a nova etapa"
      });
    }
  };

  const handleUpdateStep = async (stepId: string, updates: Partial<ProcessStep>) => {
    try {
      const { error } = await supabase
        .from('process_steps')
        .update({
          ...updates,
          completed_at: updates.status === 'concluido' ? new Date().toISOString() : null
        })
        .eq('id', stepId);

      if (error) throw error;

      const step = steps.find(s => s.id === stepId);
      
      // Registrar log de auditoria
      await auditService.createAuditLog({
        action: 'UPDATE_PROCESS_STEP',
        target_type: 'process',
        target_id: processId,
        target_name: processTitle,
        details: {
          step_title: step?.title,
          previous_status: step?.status,
          new_status: updates.status,
          changes: updates
        }
      });

      // Enviar notificação se status mudou para concluído
      if (notifyClient && updates.status === 'concluido' && step?.status !== 'concluido') {
        const template = notificationTemplates.stepCompleted(processId, step?.title || '');
        await sendNotification(clientId, template, processId, `/processo/${processId}`);
      }

      setSteps(prev => prev.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      ));
      setEditingStep(null);
      onStepsChange?.();

      toast({
        title: "Alterações salvas com sucesso!",
        description: "A etapa foi atualizada"
      });
    } catch (error) {
      console.error('Erro ao atualizar etapa:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar etapa",
        description: "Não foi possível salvar as alterações"
      });
    }
  };

  const handleDeleteStep = async (stepId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta etapa?')) return;

    try {
      const { error } = await supabase
        .from('process_steps')
        .delete()
        .eq('id', stepId);

      if (error) throw error;

      const step = steps.find(s => s.id === stepId);
      
      // Registrar log de auditoria
      await auditService.createAuditLog({
        action: 'DELETE_PROCESS_STEP',
        target_type: 'process',
        target_id: processId,
        target_name: processTitle,
        details: {
          step_title: step?.title,
          step_order: step?.order_number
        }
      });

      setSteps(prev => prev.filter(step => step.id !== stepId));
      onStepsChange?.();

      toast({
        title: "Etapa removida com sucesso!",
        description: "A etapa foi excluída do processo"
      });
    } catch (error) {
      console.error('Erro ao excluir etapa:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir etapa",
        description: "Não foi possível remover a etapa"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <LoadingSpinner size="md" text="Carregando etapas..." />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Gerenciar Etapas</CardTitle>
          <div className="flex items-center gap-2">
            <Label className="text-sm">Notificar cliente:</Label>
            <input
              type="checkbox"
              checked={notifyClient}
              onChange={(e) => setNotifyClient(e.target.checked)}
              className="rounded"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step) => (
          <StepCard
            key={step.id}
            step={step}
            isEditing={editingStep === step.id}
            onEdit={() => setEditingStep(step.id)}
            onCancel={() => setEditingStep(null)}
            onSave={(updates) => handleUpdateStep(step.id, updates)}
            onDelete={() => handleDeleteStep(step.id)}
            statusOptions={statusOptions}
          />
        ))}

        {isAddingNew ? (
          <Card className="border-dashed border-2 border-eregulariza-primary">
            <CardContent className="p-4 space-y-3">
              <div>
                <Label>Título da Etapa *</Label>
                <Input
                  value={newStep.title}
                  onChange={(e) => setNewStep(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Digite o título da etapa"
                />
              </div>
              
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={newStep.description}
                  onChange={(e) => setNewStep(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da etapa (opcional)"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Status</Label>
                  <Select
                    value={newStep.status}
                    onValueChange={(value) => setNewStep(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Prazo</Label>
                  <Input
                    type="date"
                    value={newStep.deadline}
                    onChange={(e) => setNewStep(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewStep({ title: "", description: "", deadline: "", status: "pendente" });
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleAddStep}>
                  <Save className="h-4 w-4 mr-2" />
                  Adicionar Etapa
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsAddingNew(true)}
            className="w-full border-dashed border-2 border-eregulariza-primary text-eregulariza-primary hover:bg-eregulariza-primary hover:text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Nova Etapa
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface StepCardProps {
  step: ProcessStep;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (updates: Partial<ProcessStep>) => void;
  onDelete: () => void;
  statusOptions: Array<{
    value: string;
    label: string;
    icon: any;
    color: string;
  }>;
}

function StepCard({ step, isEditing, onEdit, onCancel, onSave, onDelete, statusOptions }: StepCardProps) {
  const [editData, setEditData] = useState({
    title: step.title,
    description: step.description || "",
    status: step.status,
    deadline: step.deadline || ""
  });

  const statusConfig = statusOptions.find(s => s.value === step.status);
  const StatusIcon = statusConfig?.icon || Clock;

  if (isEditing) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4 space-y-3">
          <div>
            <Label>Título</Label>
            <Input
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div>
            <Label>Descrição</Label>
            <Textarea
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Status</Label>
              <Select
                value={editData.status}
                onValueChange={(value) => setEditData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Prazo</Label>
              <Input
                type="date"
                value={editData.deadline}
                onChange={(e) => setEditData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={() => onSave(editData)}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={statusConfig?.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig?.label}
              </Badge>
              <span className="text-sm text-gray-500">Etapa #{step.order_number}</span>
            </div>
            
            <h4 className="font-medium text-gray-900 mb-1">{step.title}</h4>
            
            {step.description && (
              <p className="text-sm text-gray-600 mb-2">{step.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {step.deadline && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Prazo: {new Date(step.deadline).toLocaleDateString()}
                </span>
              )}
              {step.completed_at && (
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Concluído: {new Date(step.completed_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
