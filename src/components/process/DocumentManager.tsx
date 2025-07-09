import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import DocumentManagerHeader from "./DocumentManagerHeader";
import DocumentTabs from "./DocumentTabs";

interface DocumentManagerProps {
  processId: string;
  etapaId: string;
  etapaNome: string;
  isAdmin: boolean;
}

export default function DocumentManager({
  processId,
  etapaId,
  etapaNome,
  isAdmin = false,
}: DocumentManagerProps) {
  const {
    activeTab,
    setActiveTab,
    clientDocuments,
    adminDocuments,
    handleClientUpload,
    handleAdminUpload,
    handleRemoveDocument,
    handleDocumentStatusChange,
    handleAddDocument,
  } = useDocumentManager({ processId });

  return (
    <Card>
      <DocumentManagerHeader
        etapaNome={etapaNome}
        processId={processId}
        isAdmin={isAdmin}
        onAddDocument={handleAddDocument}
      />
      <CardContent>
        <DocumentTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          clientDocuments={clientDocuments}
          adminDocuments={adminDocuments}
          isAdmin={isAdmin}
          onClientUpload={handleClientUpload}
          onAdminUpload={handleAdminUpload}
          onRemoveDocument={handleRemoveDocument}
          onStatusChange={handleDocumentStatusChange}
          onAddDocument={handleAddDocument}
        />
      </CardContent>
    </Card>
  );
}