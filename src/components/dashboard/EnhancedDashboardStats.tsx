
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, AlertTriangle, FileWarning, Hourglass, Home, FileText, Users } from "lucide-react";

interface ProcessType {
  type: string;
  count: number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface EnhancedDashboardStatsProps {
  processes: any[];
  isLoading: boolean;
}

export default function EnhancedDashboardStats({ processes, isLoading }: EnhancedDashboardStatsProps) {
  // Calculate process counters by status
  const processCounters = {
    active: processes.filter(p => p.status === "em_andamento").length,
    pending: processes.filter(p => p.status === "pendente").length,
    completed: processes.filter(p => p.status === "concluido").length,
    pendingDocs: processes.reduce((acc, curr) => acc + (curr.pendingDocuments || 0), 0)
  };

  // Calculate process types
  const processTypes: ProcessType[] = [
    {
      type: "Usucapião",
      count: processes.filter(p => p.type.includes("Usucapião")).length,
      icon: Home,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      type: "Retificação",
      count: processes.filter(p => p.type.includes("Retificação")).length,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      type: "Inventário",
      count: processes.filter(p => p.type.includes("Inventário")).length,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      type: "Outros",
      count: processes.filter(p => 
        !p.type.includes("Usucapião") && 
        !p.type.includes("Retificação") && 
        !p.type.includes("Inventário")
      ).length,
      icon: FileWarning,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <>
      {/* Status Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-4 flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <Hourglass className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Processos Ativos</p>
              <p className="text-2xl font-bold">{isLoading ? '...' : processCounters.active}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-yellow-500">
          <CardContent className="p-4 flex items-center">
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Processos Pendentes</p>
              <p className="text-2xl font-bold">{isLoading ? '...' : processCounters.pending}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-green-500">
          <CardContent className="p-4 flex items-center">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Finalizados</p>
              <p className="text-2xl font-bold">{isLoading ? '...' : processCounters.completed}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-orange-500">
          <CardContent className="p-4 flex items-center">
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
              <FileWarning className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Docs. Pendentes</p>
              <p className="text-2xl font-bold">{isLoading ? '...' : processCounters.pendingDocs}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Process Types Counter */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-[#06D7A5]" />
          Processos por Tipo
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {processTypes.map((processType) => {
            const Icon = processType.icon;
            return (
              <Card key={processType.type} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center">
                  <div className={`h-10 w-10 rounded-full ${processType.bgColor} flex items-center justify-center mr-3`}>
                    <Icon className={`h-5 w-5 ${processType.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{processType.type}</p>
                    <p className="text-xl font-bold">{isLoading ? '...' : processType.count}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
