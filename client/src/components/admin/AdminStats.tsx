
import React from "react";

interface Process {
  status: string;
}

interface AdminStatsProps {
  processes: Process[];
  clientsCount: number;
}

export default function AdminStats({ processes, clientsCount }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total de Processos</h3>
        <p className="text-2xl font-bold">{processes.length}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Em Andamento</h3>
        <p className="text-2xl font-bold">{processes.filter(p => p.status === 'em_andamento').length}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Concluídos</h3>
        <p className="text-2xl font-bold">{processes.filter(p => p.status === 'concluido').length}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total de Clientes</h3>
        <p className="text-2xl font-bold">{clientsCount}</p>
      </div>
    </div>
  );
}
