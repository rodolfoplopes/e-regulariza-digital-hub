
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, FileText, User, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { ProcessWithDetails } from "@/services/supabaseService";

interface ProcessDetailHeaderProps {
  process: ProcessWithDetails;
}

export default function ProcessDetailHeader({ process }: ProcessDetailHeaderProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'em_andamento':
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'em_andamento':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'concluido':
      case 'completed':
        return 'Concluído';
      case 'em_andamento':
      case 'in_progress':
        return 'Em Andamento';
      default:
        return 'Pendente';
    }
  };

  // Get next action based on current status and steps
  const getNextAction = () => {
    if (process.status === 'concluido' || process.status === 'completed') {
      return 'Processo finalizado com sucesso';
    }

    // Find the current active step
    const currentStep = process.steps?.find(step => 
      step.status === 'em_andamento' || step.status === 'in_progress'
    );

    if (currentStep) {
      return `Aguardando: ${currentStep.title}`;
    }

    // If no active step, find the next pending step
    const nextStep = process.steps?.find(step => 
      step.status === 'pendente' || step.status === 'pending'
    );

    if (nextStep) {
      return `Próximo: ${nextStep.title}`;
    }

    return 'Aguardando próxima etapa';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-eregulariza-gray">{process.title}</h1>
          <p className="text-sm text-eregulariza-description mt-1">
            Processo #{process.process_number}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`flex items-center gap-1 ${getStatusColor(process.status)}`}>
            {getStatusIcon(process.status)}
            {getStatusText(process.status)}
          </Badge>
        </div>
      </div>

      {/* Next Action Card - Highlighted section */}
      <Card className="border-l-4 border-l-eregulariza-primary bg-gradient-to-r from-eregulariza-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-eregulariza-primary/10">
              <AlertCircle className="h-5 w-5 text-eregulariza-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-eregulariza-gray">Próxima Ação</h3>
              <p className="text-sm text-eregulariza-description">
                {getNextAction()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <User className="h-5 w-5 text-eregulariza-primary" />
            <div>
              <p className="text-sm text-eregulariza-description">Cliente</p>
              <p className="font-medium text-eregulariza-gray">
                {process.client?.name || 'Não informado'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <FileText className="h-5 w-5 text-eregulariza-primary" />
            <div>
              <p className="text-sm text-eregulariza-description">Tipo</p>
              <p className="font-medium text-eregulariza-gray">
                {process.process_type?.name || 'Não informado'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-eregulariza-primary" />
            <div>
              <p className="text-sm text-eregulariza-description">Criado em</p>
              <p className="font-medium text-eregulariza-gray">
                {new Date(process.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {process.description && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-eregulariza-gray mb-2">Descrição</h3>
            <p className="text-eregulariza-description">{process.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
