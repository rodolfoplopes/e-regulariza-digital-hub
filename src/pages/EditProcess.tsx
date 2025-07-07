
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Calendar, FileText } from "lucide-react";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import { processService } from "@/services/processService";
import { auditService } from "@/services/auditService";
import { ProcessWithDetails, ProcessType } from "@/services/core/types";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function EditProcess() {
  const { processId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [process, setProcess] = useState<ProcessWithDetails | null>(null);
  const [processTypes, setProcessTypes] = useState<ProcessType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    process_type_id: "",
    deadline: ""
  });

  useEffect(() => {
    const loadData = async () => {
      if (!processId) return;
      
      try {
        setIsLoading(true);
        const [processData, typesData] = await Promise.all([
          processService.getProcessById(processId),
          processService.getProcessTypes()
        ]);
        
        if (processData) {
          setProcess(processData);
          setFormData({
            title: processData.title,
            description: processData.description || "",
            process_type_id: processData.process_type_id,
            deadline: processData.deadline || ""
          });
        }
        
        setProcessTypes(typesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar processo",
          description: "Não foi possível carregar os dados do processo"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [processId]);

  const handleSave = async () => {
    if (!processId || !process) return;
    
    if (!formData.title.trim()) {
      toast({
        variant: "destructive",
        title: "Título obrigatório",
        description: "Digite um título para o processo"
      });
      return;
    }

    setIsSaving(true);
    try {
      const updates = {
        title: formData.title,
        description: formData.description,
        process_type_id: formData.process_type_id,
        deadline: formData.deadline || null
      };

      await processService.updateProcess(processId, updates);

      // Registrar log de auditoria
      await auditService.createAuditLog({
        action: 'UPDATE_PROCESS',
        target_type: 'process',
        target_id: processId,
        target_name: formData.title,
        details: {
          previous_title: process.title,
          new_title: formData.title,
          previous_type: process.process_type?.name,
          new_type: processTypes.find(t => t.id === formData.process_type_id)?.name,
          changes: updates
        }
      });

      toast({
        title: "Alterações salvas com sucesso!",
        description: "O processo foi atualizado"
      });

      navigate(`/processo/${processId}`);
    } catch (error) {
      console.error('Erro ao salvar processo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 flex items-center justify-center">
            <LoadingSpinner size="lg" text="Carregando processo..." />
          </main>
        </div>
      </div>
    );
  }

  if (!process) {
    return (
      <div className="flex h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Processo não encontrado</h2>
              <Button onClick={() => navigate('/admin')} className="mt-4">
                Voltar ao Dashboard
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={() => navigate(`/processo/${processId}`)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div>
                <h1 className="page-title page-header">Editar Processo</h1>
                <p className="text-eregulariza-description">
                  {process.process_number} - {process.client?.name}
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-eregulariza-primary" />
                  Dados do Processo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Título do Processo *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Digite o título do processo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="processType">Tipo de Processo *</Label>
                  <Select
                    value={formData.process_type_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, process_type_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de processo" />
                    </SelectTrigger>
                    <SelectContent>
                      {processTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div>
                            <div className="font-medium">{type.name}</div>
                            {type.description && (
                              <div className="text-sm text-gray-500">{type.description}</div>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="deadline">Prazo Final</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição/Observações</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Informações adicionais sobre o processo..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => navigate(`/processo/${processId}`)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !formData.title.trim()}
                className="bg-eregulariza-primary hover:bg-eregulariza-primary/90 text-white"
              >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
