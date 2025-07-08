import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { DocumentType } from "./DocumentUploader";
import DocumentUploader from "./DocumentUploader";

interface DocumentItemProps {
  document: DocumentType;
  isAdmin: boolean;
  onUpload: (documentId: string, file: File) => Promise<void>;
  onRemove?: (documentId: string) => Promise<void>;
  onStatusChange: (documentId: string, status: "approved" | "rejected", feedback?: string) => void;
}

export default function DocumentItem({
  document,
  isAdmin,
  onUpload,
  onRemove,
  onStatusChange,
}: DocumentItemProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="destructive">Reprovado</Badge>;
      case "uploaded":
        return <Badge className="bg-yellow-500">Enviado</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            {document.name}
            {document.required && (
              <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                Obrigatório
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-500">{document.description}</p>
        </div>
        <div>{getStatusBadge(document.status)}</div>
      </div>

      {document.status === "rejected" && document.feedback && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-700">
          <p className="font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Motivo da rejeição:
          </p>
          <p>{document.feedback}</p>
        </div>
      )}

      {(document.status === "uploaded" || document.status === "approved" || document.status === "rejected") && document.fileUrl && (
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded mb-3">
          <div className="flex items-center overflow-hidden">
            <FileText className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
            <span className="text-sm text-gray-700 truncate">
              {document.fileUrl.split('/').pop()}
            </span>
          </div>
          <Button variant="ghost" size="sm" className="shrink-0">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isAdmin && document.status === "uploaded" && (
        <div className="flex space-x-2 mt-3">
          <Button 
            variant="outline" 
            size="sm"
            className="text-green-600 border-green-200 hover:bg-green-50"
            onClick={() => onStatusChange(document.id, "approved")}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Aprovar
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => {
              const feedback = prompt("Motivo da rejeição:");
              if (feedback) {
                onStatusChange(document.id, "rejected", feedback);
              }
            }}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Rejeitar
          </Button>
        </div>
      )}

      {document.status !== "approved" && (
        <DocumentUploader
          documentType={document}
          onUpload={onUpload}
          onRemove={document.status === "uploaded" ? onRemove : undefined}
        />
      )}
    </div>
  );
}