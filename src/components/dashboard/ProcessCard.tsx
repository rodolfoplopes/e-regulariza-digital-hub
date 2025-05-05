
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, CheckCircle, AlertTriangle, FileText, Calendar, File, MessageSquare } from "lucide-react";

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

  // Process type icons mapping
  const typeIcons = {
    "Usucapião": <File className="h-4 w-4 mr-1 text-eregulariza-primary" />,
    "Regularização": <Calendar className="h-4 w-4 mr-1 text-eregulariza-primary" />,
    "Inventário": <FileText className="h-4 w-4 mr-1 text-eregulariza-primary" />,
    "Retificação": <MessageSquare className="h-4 w-4 mr-1 text-eregulariza-primary" />
  };

  // Default icon for process types not in the mapping
  const defaultTypeIcon = <File className="h-4 w-4 mr-1 text-eregulariza-primary" />;

  // Get process type icon
  const getTypeIcon = (type: string) => {
    return typeIcons[type as keyof typeof typeIcons] || defaultTypeIcon;
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
    <Card className="card-hover transition-all hover:border-eregulariza-primary/30">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center">
            {getTypeIcon(process.type)}
            <span className="font-bold">{process.title}</span>
          </CardTitle>
          <span className={`status-badge ${statusClasses[process.status]} flex items-center transition-all duration-300`}>
            {statusIcons[process.status]}
            {statusLabels[process.status]}
          </span>
        </div>
        <p className="text-sm text-gray-500 ml-5">{process.type}</p>
      </CardHeader>
      <CardContent className="py-2">
        <div className="bg-gray-50 p-3 rounded-md mb-3 border-l-4 border-[#06D7A5] flex items-center shadow-sm hover:shadow-md transition-all duration-300">
          <ArrowRight className="h-4 w-4 text-[#06D7A5] mr-2 flex-shrink-0" />
          <span className="text-sm font-medium">Próxima ação: {getNextAction(process.status)}</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso</span>
            <span className="font-medium">{process.progress}%</span>
          </div>
          <Progress value={process.progress} className="h-2 transition-all duration-300" />
          <p className="text-xs text-gray-500 flex items-center mt-2">
            <Clock className="h-3 w-3 mr-1 inline text-gray-400" />
            Última atualização: {process.lastUpdate}
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild variant="outline" className="w-full hover:border-eregulariza-primary hover:text-eregulariza-primary transition-all duration-300 hover:shadow-sm">
          <Link to={`/processo/${process.id}`} className="flex items-center justify-center gap-2">
            Ver detalhes
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
