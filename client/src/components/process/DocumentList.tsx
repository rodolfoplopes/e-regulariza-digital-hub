import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { DocumentType } from "./DocumentUploader";
import DocumentItem from "./DocumentItem";

interface DocumentListProps {
  documents: DocumentType[];
  isAdmin: boolean;
  onUpload: (documentId: string, file: File) => Promise<void>;
  onRemove?: (documentId: string) => Promise<void>;
  onStatusChange: (documentId: string, status: "approved" | "rejected", feedback?: string) => void;
  onAddDocument: () => void;
  emptyMessage: string;
  showAddButton?: boolean;
}

export default function DocumentList({
  documents,
  isAdmin,
  onUpload,
  onRemove,
  onStatusChange,
  onAddDocument,
  emptyMessage,
  showAddButton = false,
}: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-gray-500">{emptyMessage}</p>
        {showAddButton && (
          <Button variant="outline" onClick={onAddDocument} className="mt-4">
            <Upload className="h-4 w-4 mr-2" />
            Adicionar novo documento
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <DocumentItem
          key={doc.id}
          document={doc}
          isAdmin={isAdmin}
          onUpload={onUpload}
          onRemove={onRemove}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}