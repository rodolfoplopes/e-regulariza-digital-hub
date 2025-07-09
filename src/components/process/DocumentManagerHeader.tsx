import React from "react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import AuditHistoryPanel from "./AuditHistoryPanel";

interface DocumentManagerHeaderProps {
  etapaNome: string;
  processId: string;
  isAdmin: boolean;
  onAddDocument: () => void;
}

export default function DocumentManagerHeader({
  etapaNome,
  processId,
  isAdmin,
  onAddDocument,
}: DocumentManagerHeaderProps) {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle>Documentos da Etapa: {etapaNome}</CardTitle>
          <CardDescription>Gerenciamento de documentos necessários para esta etapa</CardDescription>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <AuditHistoryPanel processId={processId} />
            <Button onClick={onAddDocument}>
              <Upload className="h-4 w-4 mr-2" />
              Adicionar Documento
            </Button>
          </div>
        )}
      </div>
    </CardHeader>
  );
}