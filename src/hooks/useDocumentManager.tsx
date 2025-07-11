import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentType } from "@/components/process/DocumentUploader";
import { auditService } from "@/services/auditService";
import { useNotifications } from "@/hooks/useNotifications";
import { sendNotification, notificationTemplates } from "@/services/notificationHelperService";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface UseDocumentManagerProps {
  processId: string;
}

interface UseDocumentManagerReturn {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  clientDocuments: DocumentType[];
  adminDocuments: DocumentType[];
  handleClientUpload: (documentId: string, file: File) => Promise<void>;
  handleAdminUpload: (documentId: string, file: File) => Promise<void>;
  handleRemoveDocument: (documentId: string) => Promise<void>;
  handleDocumentStatusChange: (documentId: string, status: "approved" | "rejected", feedback?: string) => Promise<void>;
  handleAddDocument: () => Promise<void>;
}

export function useDocumentManager({ processId }: UseDocumentManagerProps): UseDocumentManagerReturn {
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

  return {
    activeTab,
    setActiveTab,
    clientDocuments,
    adminDocuments,
    handleClientUpload,
    handleAdminUpload,
    handleRemoveDocument,
    handleDocumentStatusChange,
    handleAddDocument,
  };
}