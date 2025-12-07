import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { type AuditLogFilters } from "@/hooks/useAuditLogs";

interface AuditLogFiltersProps {
  filters: AuditLogFilters;
  onFiltersChange: (filters: AuditLogFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export default function AuditLogFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
}: AuditLogFiltersProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <Input
          placeholder="Buscar por ação..."
          value={filters.action}
          onChange={(e) => onFiltersChange({ ...filters, action: e.target.value })}
          className="flex-1 bg-white"
        />
        
        <Select 
          value={filters.target_type} 
          onValueChange={(value) => onFiltersChange({ ...filters, target_type: value })}
        >
          <SelectTrigger className="w-full lg:w-[200px] bg-white">
            <SelectValue placeholder="Tipo de entidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os tipos</SelectItem>
            <SelectItem value="user">Usuário</SelectItem>
            <SelectItem value="process">Processo</SelectItem>
            <SelectItem value="client">Cliente</SelectItem>
            <SelectItem value="system">Sistema</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button onClick={onApplyFilters} variant="outline" size="sm" className="bg-white">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button onClick={onClearFilters} variant="ghost" size="sm">
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
}