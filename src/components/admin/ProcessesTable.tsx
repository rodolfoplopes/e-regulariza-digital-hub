
import React from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Process {
  id: string;
  title: string;
  client: string;
  type: string;
  status: string;
  progress: number;
  creationDate: string;
  lastUpdate: string;
}

interface ProcessesTableProps {
  processes: Process[];
  statusLabels: Record<string, string>;
}

export default function ProcessesTable({ processes, statusLabels }: ProcessesTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Processo</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progresso</TableHead>
            <TableHead>Criação</TableHead>
            <TableHead>Última Atualização</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processes.length > 0 ? (
            processes.map((process) => (
              <TableRow key={process.id}>
                <TableCell className="font-medium">{process.title}</TableCell>
                <TableCell>{process.client}</TableCell>
                <TableCell>{process.type}</TableCell>
                <TableCell>
                  <span className={`status-badge status-badge-${process.status}`}>
                    {statusLabels[process.status]}
                  </span>
                </TableCell>
                <TableCell className="w-[180px]">
                  <div className="flex items-center space-x-2">
                    <Progress value={process.progress} className="h-2" />
                    <span className="text-xs text-gray-500">{process.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>{process.creationDate}</TableCell>
                <TableCell>{process.lastUpdate}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/processo/${process.id}`}>
                      Gerenciar
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                Nenhum processo encontrado com os filtros selecionados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
