
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, CheckCircle, AlertTriangle, FileText } from "lucide-react";

export interface ProcessProps {
  id: string;
  title: string;
  type: string;
  status: "pendente" | "em_andamento" | "concluido" | "rejeitado";
  progress: number;
  lastUpdate: string;
}

export default function ProcessCard({ process }: { process: ProcessProps }) {
  const statusLabels = {
    pendente: "Pendente",
    em_andamento: "Em Andamento",
    concluido: "Concluído",
    rejeitado: "Rejeitado"
  };

  const statusClasses = {
    pendente: "status-badge-pending",
    em_andamento: "status-badge-in-progress",
    concluido: "status-badge-completed",
    rejeitado: "status-badge-rejected"
  };

  // Status icons mapping
  const statusIcons = {
    pendente: <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />,
    em_andamento: <Clock className="h-4 w-4 mr-1 text-blue-500" />,
    concluido: <CheckCircle className="h-4 w-4 mr-1 text-green-500" />,
    rejeitado: <FileText className="h-4 w-4 mr-1 text-red-500" />
  };

  // Get next expected action based on status
  const getNextAction = (status: string) => {
    switch (status) {
      case "pendente":
        return "Aguardando documentação inicial";
      case "em_andamento":
        return "Análise em andamento";
      case "concluido":
        return "Processo finalizado";
      case "rejeitado":
        return "Revisão necessária";
      default:
        return "Verificar status com suporte";
    }
  };

  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{process.title}</CardTitle>
          <span className={`status-badge ${statusClasses[process.status]} flex items-center`}>
            {statusIcons[process.status]}
            {statusLabels[process.status]}
          </span>
        </div>
        <p className="text-sm text-gray-500">{process.type}</p>
      </CardHeader>
      <CardContent className="py-2">
        <div className="bg-gray-50 p-2 rounded-md mb-2 border-l-4 border-[#06D7A5] flex items-center">
          <ArrowRight className="h-4 w-4 text-[#06D7A5] mr-1" />
          <span className="text-sm font-medium">Próxima ação: {getNextAction(process.status)}</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso</span>
            <span>{process.progress}%</span>
          </div>
          <Progress value={process.progress} className="h-2" />
          <p className="text-xs text-gray-500">
            Última atualização: {process.lastUpdate}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="w-full">
          <Link to={`/processo/${process.id}`} className="flex items-center justify-center gap-2">
            Ver detalhes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
