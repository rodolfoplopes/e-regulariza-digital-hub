
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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

  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{process.title}</CardTitle>
          <span className={`status-badge ${statusClasses[process.status]}`}>
            {statusLabels[process.status]}
          </span>
        </div>
        <p className="text-sm text-gray-500">{process.type}</p>
      </CardHeader>
      <CardContent className="py-2">
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
