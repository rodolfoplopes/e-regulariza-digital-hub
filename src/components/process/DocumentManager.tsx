
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { DocumentType } from "@/components/process/DocumentUploader";
import { Upload } from "lucide-react";
import DocumentStatsCards from "./DocumentStatsCards";
import DocumentList from "./DocumentList";
import { auditService } from "@/services/auditService";
import { useNotifications } from "@/hooks/useNotifications";
import { sendNotification, notificationTemplates } from "@/services/notificationHelperService";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

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
  const { toast } = useToast();
  const { profile } = useSupabaseAuth();
  const { refreshNotifications } = useNotifications();
  const [activeTab, setActiveTab] = useState<string>("client");
  const [clientDocuments, setClientDocuments] = useState<DocumentType[]>([
    {
      id: "doc-1",
      name: "RG do Proprietário",
      description: "Documento de identidade do proprietário do imóvel",
      required: true,
      status: "pending",
    },
    {
      id: "doc-2",
      name: "Comprovante de Residência",
      description: "Documento que comprove residência no imóvel (conta de luz, água, etc.)",
      required: true,
      status: "uploaded",
      fileUrl: "/documentos/comprovante-123.pdf",
      uploadDate: "01/05/2023",
    },
    {
      id: "doc-3",
      name: "Certidão de Casamento",
      description: "Caso seja casado, a certidão atualizada",
      required: false,
      status: "rejected",
      fileUrl: "/documentos/certidao.pdf",
      uploadDate: "15/04/2023",
      feedback: "Documento ilegível. Por favor, envie uma cópia mais clara.",
    },
    {
      id: "doc-4",
      name: "Declaração de Testemunha",
      description: "Declaração de vizinhos confirmando o tempo de posse",
      required: true,
      status: "approved",
      fileUrl: "/documentos/declaracao.pdf",
      uploadDate: "20/04/2023",
    },
  ]);

  const [adminDocuments, setAdminDocuments] = useState<DocumentType[]>([
    {
      id: "adm-doc-1",
      name: "Memorial Descritivo",
      description: "Memorial descritivo elaborado pelo topógrafo",
      required: false,
      status: "uploaded",
      fileUrl: "/documentos/memorial.pdf",
      uploadDate: "05/05/2023",
    },
    {
      id: "adm-doc-2",
      name: "Parecer Jurídico",
      description: "Parecer jurídico sobre o caso",
      required: false,
      status: "uploaded",
      fileUrl: "/documentos/parecer.pdf",
      uploadDate: "10/05/2023",
    },
  ]);

  // Handle document upload by client
  const handleClientUpload = async (documentId: string, file: File) => {
    try {
      console.log(`Upload client document ${documentId}:`, file);
      
      // Update document status
      setClientDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === documentId 
            ? { 
                ...doc, 
                status: "uploaded", 
                fileUrl: URL.createObjectURL(file),
                uploadDate: new Date().toLocaleDateString('pt-BR')
              }
            : doc
        )
      );

      // Find document for audit logging
      const document = clientDocuments.find(doc => doc.id === documentId);
      if (document) {
        // Log audit event
        await auditService.logDocumentUpload(documentId, document.name, processId);
        
        // Send notification to admins about new document
        // This would typically be sent to all admins, for demo we'll show the concept
        toast({
          title: "Documento enviado",
          description: `${document.name} foi enviado com sucesso`,
        });
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Erro ao enviar documento",
        description: "Ocorreu um erro ao enviar o documento",
        variant: "destructive"
      });
    }
  };

  // Handle document upload by admin
  const handleAdminUpload = async (documentId: string, file: File) => {
    try {
      console.log(`Upload admin document ${documentId}:`, file);
      
      // Update document status
      setAdminDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === documentId 
            ? { 
                ...doc, 
                status: "uploaded", 
                fileUrl: URL.createObjectURL(file),
                uploadDate: new Date().toLocaleDateString('pt-BR')
              }
            : doc
        )
      );

      // Find document for audit logging
      const document = adminDocuments.find(doc => doc.id === documentId);
      if (document) {
        // Log audit event
        await auditService.logDocumentUpload(documentId, document.name, processId);
        
        toast({
          title: "Documento interno enviado",
          description: `${document.name} foi enviado com sucesso`,
        });
      }
    } catch (error) {
      console.error('Error uploading admin document:', error);
      toast({
        title: "Erro ao enviar documento",
        description: "Ocorreu um erro ao enviar o documento interno",
        variant: "destructive"
      });
    }
  };

  // Handle document removal
  const handleRemoveDocument = async (documentId: string) => {
    try {
      console.log(`Remove document ${documentId}`);
      
      // Find document for audit logging
      const clientDoc = clientDocuments.find(doc => doc.id === documentId);
      const adminDoc = adminDocuments.find(doc => doc.id === documentId);
      const document = clientDoc || adminDoc;
      
      // Update client documents
      setClientDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: "pending", fileUrl: undefined, uploadDate: undefined }
            : doc
        )
      );
      
      // Update admin documents
      setAdminDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: "pending", fileUrl: undefined, uploadDate: undefined }
            : doc
        )
      );

      if (document) {
        // Log audit event
        await auditService.logDocumentDeletion(documentId, document.name, processId);
        
        toast({
          title: "Documento removido",
          description: `${document.name} foi removido com sucesso`,
        });
      }
    } catch (error) {
      console.error('Error removing document:', error);
      toast({
        title: "Erro ao remover documento",
        description: "Ocorreu um erro ao remover o documento",
        variant: "destructive"
      });
    }
  };

  // Handle document status change (approve/reject)
  const handleDocumentStatusChange = async (documentId: string, status: "approved" | "rejected", feedback?: string) => {
    try {
      // Find document for audit logging and notifications
      const document = clientDocuments.find(doc => doc.id === documentId);
      if (!document) return;

      // Update document status
      setClientDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === documentId 
            ? { ...doc, status, feedback }
            : doc
        )
      );

      // Log audit event
      if (status === "approved") {
        await auditService.logDocumentApproval(documentId, document.name, processId);
      } else {
        await auditService.logDocumentRejection(documentId, document.name, processId, feedback);
      }

      // Send notification to client
      if (profile?.id) {
        const template = status === "approved" 
          ? notificationTemplates.documentApproved(`ER-${processId}`, document.name)
          : {
              title: 'Documento rejeitado',
              message: `O documento "${document.name}" foi rejeitado${feedback ? `: ${feedback}` : ''}`,
              type: 'document' as const,
              priority: 'high' as const
            };

        // In a real app, this would send to the client who owns the process
        // For demo, we'll show the notification concept
        await sendNotification(
          profile.id, // This would be the client_id from the process
          template,
          processId,
          `/processo/${processId}`
        );
      }

      // Refresh notifications
      refreshNotifications();
      
      toast({
        title: `Documento ${status === "approved" ? "aprovado" : "rejeitado"}`,
        description: `O documento ${status === "approved" ? "foi aprovado" : "foi rejeitado"}${feedback ? " com comentários" : ""}.`,
      });
    } catch (error) {
      console.error('Error changing document status:', error);
      toast({
        title: "Erro ao processar documento",
        description: "Ocorreu um erro ao alterar o status do documento",
        variant: "destructive"
      });
    }
  };

  // Handle addition of new document requirement
  const handleAddDocument = async () => {
    try {
      const newDocument: DocumentType = {
        id: `doc-${Date.now()}`,
        name: "Novo Documento",
        description: "Descrição do novo documento",
        required: false,
        status: "pending",
      };
      
      if (activeTab === "client") {
        setClientDocuments(prev => [...prev, newDocument]);
      } else {
        setAdminDocuments(prev => [...prev, newDocument]);
      }

      // Log audit event
      await auditService.createAuditLog({
        action: 'ADD_DOCUMENT_REQUIREMENT',
        target_type: 'document',
        target_id: newDocument.id,
        target_name: newDocument.name,
        details: {
          processId,
          documentType: activeTab,
          action: 'requirement_added'
        }
      });
      
      toast({
        title: "Documento adicionado com sucesso!",
        description: "O requisito de documento foi adicionado ao processo",
      });
    } catch (error) {
      console.error('Error adding document:', error);
      toast({
        title: "Erro ao adicionar documento",
        description: "Ocorreu um erro ao adicionar o requisito de documento",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Documentos da Etapa: {etapaNome}</CardTitle>
            <CardDescription>Gerenciamento de documentos necessários para esta etapa</CardDescription>
          </div>
          {isAdmin && (
            <Button onClick={handleAddDocument}>
              <Upload className="h-4 w-4 mr-2" />
              Adicionar Documento
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
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
              onUpload={handleClientUpload}
              onRemove={handleRemoveDocument}
              onStatusChange={handleDocumentStatusChange}
              onAddDocument={handleAddDocument}
              emptyMessage="Nenhum documento cadastrado para esta etapa."
            />
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            <DocumentList
              documents={adminDocuments}
              isAdmin={isAdmin}
              onUpload={handleAdminUpload}
              onRemove={handleRemoveDocument}
              onStatusChange={handleDocumentStatusChange}
              onAddDocument={handleAddDocument}
              emptyMessage="Nenhum documento interno cadastrado para esta etapa."
              showAddButton={isAdmin}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
