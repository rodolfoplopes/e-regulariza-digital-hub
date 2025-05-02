
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Client {
  id: string;
  name: string;
}

interface ProcessFiltersProps {
  filters: {
    clientName: string;
    serviceType: string;
    status: string;
    startDate: string;
    endDate: string;
    processNumber: string;
  };
  onFilterChange: (filters: Partial<ProcessFiltersProps["filters"]>) => void;
  onClearFilters: () => void;
  clients: Client[];
  serviceTypes: string[];
}

export default function ProcessFilters({
  filters,
  onFilterChange,
  onClearFilters,
  clients,
  serviceTypes,
}: ProcessFiltersProps) {
  const statusOptions = [
    { value: "", label: "Todos" },
    { value: "pendente", label: "Pendente" },
    { value: "em_andamento", label: "Em Andamento" },
    { value: "concluido", label: "Concluído" },
    { value: "rejeitado", label: "Rejeitado" }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Filtros avançados</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearFilters}
        >
          Limpar filtros
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Client filter */}
        <div className="space-y-2">
          <Label htmlFor="client-filter">Cliente</Label>
          <Input
            id="client-filter"
            placeholder="Nome do cliente"
            value={filters.clientName}
            onChange={(e) => onFilterChange({ clientName: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Service type filter */}
        <div className="space-y-2">
          <Label htmlFor="service-filter">Tipo de Serviço</Label>
          <Select 
            value={filters.serviceType} 
            onValueChange={(value) => onFilterChange({ serviceType: value })}
          >
            <SelectTrigger id="service-filter">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os tipos</SelectItem>
              {serviceTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status filter */}
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select 
            value={filters.status} 
            onValueChange={(value) => onFilterChange({ status: value })}
          >
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value || 'all'} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Process number filter */}
        <div className="space-y-2">
          <Label htmlFor="process-number">Número do Processo</Label>
          <Input
            id="process-number"
            placeholder="Ex: proc-001"
            value={filters.processNumber}
            onChange={(e) => onFilterChange({ processNumber: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Date range filter */}
        <div className="space-y-2">
          <Label htmlFor="start-date">Data Inicial</Label>
          <Input
            id="start-date"
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange({ startDate: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-date">Data Final</Label>
          <Input
            id="end-date"
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange({ endDate: e.target.value })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
