import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentType } from "@/components/process/DocumentUploader";
import DocumentStatsCards from "./DocumentStatsCards";
import DocumentList from "./DocumentList";

interface DocumentTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  clientDocuments: DocumentType[];
  adminDocuments: DocumentType[];
  isAdmin: boolean;
  onClientUpload: (documentId: string, file: File) => Promise<void>;
  onAdminUpload: (documentId: string, file: File) => Promise<void>;
  onRemoveDocument: (documentId: string) => Promise<void>;
  onStatusChange: (documentId: string, status: "approved" | "rejected", feedback?: string) => Promise<void>;
  onAddDocument: () => Promise<void>;
}

export default function DocumentTabs({
  activeTab,
  onTabChange,
  clientDocuments,
  adminDocuments,
  isAdmin,
  onClientUpload,
  onAdminUpload,
  onRemoveDocument,
  onStatusChange,
  onAddDocument,
}: DocumentTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="client">
          Documentos do Cliente
          <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
            {clientDocuments.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="admin">
          Documentos Internos
          <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
            {adminDocuments.length}
          </span>
        </TabsTrigger>
      </TabsList>

      <DocumentStatsCards 
        documents={activeTab === "client" ? clientDocuments : adminDocuments}
      />

      <TabsContent value="client" className="space-y-4">
        <DocumentList
          documents={clientDocuments}
          isAdmin={isAdmin}
          onUpload={onClientUpload}
          onRemove={onRemoveDocument}
          onStatusChange={onStatusChange}
          onAddDocument={onAddDocument}
          emptyMessage="Nenhum documento cadastrado para esta etapa."
        />
      </TabsContent>

      <TabsContent value="admin" className="space-y-4">
        <DocumentList
          documents={adminDocuments}
          isAdmin={isAdmin}
          onUpload={onAdminUpload}
          onRemove={onRemoveDocument}
          onStatusChange={onStatusChange}
          onAddDocument={onAddDocument}
          emptyMessage="Nenhum documento interno cadastrado para esta etapa."
          showAddButton={isAdmin}
        />
      </TabsContent>
    </Tabs>
  );
}