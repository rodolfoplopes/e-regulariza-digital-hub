import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import BackButton from "./BackButton";
import AuditLogFilters from "./AuditLogFilters";
import AuditLogTable from "./AuditLogTable";

export default function AuditLogPanel() {
  const {
    logs,
    isLoading,
    filters,
    setFilters,
    handleFilter,
    clearFilters,
  } = useAuditLogs();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <BackButton />
          
          <Card className="shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="page-title flex items-center gap-2">
                <Search className="h-5 w-5" />
                Logs de Auditoria
              </CardTitle>
              <CardDescription>
                Registro completo de ações realizadas por administradores do sistema
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6">
              <AuditLogFilters
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={handleFilter}
                onClearFilters={clearFilters}
              />

              <AuditLogTable logs={logs} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}