import React from "react";
import { DocumentType } from "./DocumentUploader";

interface DocumentStatsCardsProps {
  documents: DocumentType[];
}

export default function DocumentStatsCards({ documents }: DocumentStatsCardsProps) {
  const getDocumentCountByStatus = (status: string) => {
    return documents.filter(doc => doc.status === status).length;
  };

  return (
    <div className="mb-4 grid grid-cols-4 gap-2">
      <div className="bg-slate-50 p-2 rounded text-center">
        <p className="text-sm text-gray-500">Total</p>
        <p className="font-bold text-lg">{documents.length}</p>
      </div>
      <div className="bg-slate-50 p-2 rounded text-center">
        <p className="text-sm text-gray-500">Pendentes</p>
        <p className="font-bold text-lg">{getDocumentCountByStatus("pending")}</p>
      </div>
      <div className="bg-slate-50 p-2 rounded text-center">
        <p className="text-sm text-gray-500">Enviados</p>
        <p className="font-bold text-lg">{getDocumentCountByStatus("uploaded")}</p>
      </div>
      <div className="bg-slate-50 p-2 rounded text-center">
        <p className="text-sm text-gray-500">Aprovados</p>
        <p className="font-bold text-lg">{getDocumentCountByStatus("approved")}</p>
      </div>
    </div>
  );
}