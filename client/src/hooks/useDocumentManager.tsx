import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentType } from "@/components/process/DocumentUploader";
import { auditService } from "@/services/auditService";
import { useNotifications } from "@/hooks/useNotifications";
import { sendNotification, notificationTemplates } from "@/services/notificationHelperService";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { documentService } from "@/services/documentService";

interface UseDocumentManagerProps {
  processId: string;
  clientId?: string;
}

interface UseDocumentManagerReturn {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  clientDocuments: DocumentType[];
  adminDocuments: DocumentType[];
  isLoading: boolean;
  handleClientUpload: (documentId: string, file: File) => Promise<void>;
  handleAdminUpload: (documentId: string, file: File) => Promise<void>;
  handleRemoveDocument: (documentId: string) => Promise<void>;
  handleDocumentStatusChange: (documentId: string, status: "approved" | "rejected", feedback?: string) => Promise<void>;
  handleAddDocument: () => Promise<void>;
}

export function useDocumentManager({ processId, clientId }: UseDocumentManagerProps): UseDocumentManagerReturn {
  const { toast } = useToast();
  const { profile } = useSupabaseAuth();
  const { refreshNotifications } = useNotifications();
  const [activeTab, setActiveTab] = useState<string>("client");
  const [isLoading, setIsLoading] = useState(true);
  const [clientDocuments, setClientDocuments] = useState<DocumentType[]>([]);
  const [adminDocuments, setAdminDocuments] = useState<DocumentType[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const { clientDocuments: cDocs, adminDocuments: aDocs } = await documentService.getDocuments(processId);
      setClientDocuments(cDocs);
      setAdminDocuments(aDocs);
    } catch (error) {
      console.error("Error loading documents:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar documentos",
        description: "Não foi possível carregar os documentos deste processo.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [processId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const findDocumentAllLists = (documentId: string) =>
    clientDocuments.find((d) => d.id === documentId) || adminDocuments.find((d) => d.id === documentId);

  const handleReplaceUpload = async (documentId: string, file: File) => {
    try {
      await documentService.replaceDocumentFile({ documentId, processId, file });
      const document = findDocumentAllLists(documentId);
      if (document) {
        await auditService.logDocumentUpload(documentId, document.name, processId);
        toast({ title: "Documento enviado", description: `${document.name} foi enviado com sucesso` });
      }
      await loadDocuments();
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar documento",
        description: "Ocorreu um erro ao enviar o documento",
      });
    }
  };

  // Upload/re-upload: same underlying operation regardless of which tab
  // triggered it, since the "client vs interno" split comes from who
  // uploaded, not from separate storage.
  const handleClientUpload = (documentId: string, file: File) => handleReplaceUpload(documentId, file);
  const handleAdminUpload = (documentId: string, file: File) => handleReplaceUpload(documentId, file);

  const handleRemoveDocument = async (documentId: string) => {
    try {
      const document = findDocumentAllLists(documentId);
      if (!document?.fileUrl) return;

      await documentService.deleteDocument(documentId, document.fileUrl);
      await auditService.logDocumentDeletion(documentId, document.name, processId);
      toast({ title: "Documento removido", description: `${document.name} foi removido com sucesso` });
      await loadDocuments();
    } catch (error) {
      console.error("Error removing document:", error);
      toast({
        variant: "destructive",
        title: "Erro ao remover documento",
        description: "Ocorreu um erro ao remover o documento",
      });
    }
  };

  const handleDocumentStatusChange = async (documentId: string, status: "approved" | "rejected", feedback?: string) => {
    try {
      const document = findDocumentAllLists(documentId);
      if (!document || !profile?.id) return;

      const dbStatus = status === "approved" ? "aprovado" : "rejeitado";
      await documentService.updateStatus(documentId, dbStatus, profile.id, feedback);

      if (status === "approved") {
        await auditService.logDocumentApproval(documentId, document.name, processId);
      } else {
        await auditService.logDocumentRejection(documentId, document.name, processId, feedback);
      }

      if (clientId) {
        const template = status === "approved"
          ? notificationTemplates.documentApproved(`ER-${processId}`, document.name)
          : {
              title: "Documento rejeitado",
              message: `O documento "${document.name}" foi rejeitado${feedback ? `: ${feedback}` : ""}`,
              type: "document" as const,
              priority: "high" as const,
            };

        await sendNotification(clientId, template, processId, `/processo/${processId}`);
      }

      refreshNotifications();
      toast({
        title: `Documento ${status === "approved" ? "aprovado" : "rejeitado"}`,
        description: `O documento ${status === "approved" ? "foi aprovado" : "foi rejeitado"}${feedback ? " com comentários" : ""}.`,
      });
      await loadDocuments();
    } catch (error) {
      console.error("Error changing document status:", error);
      toast({
        variant: "destructive",
        title: "Erro ao processar documento",
        description: "Ocorreu um erro ao alterar o status do documento",
      });
    }
  };

  // "Adicionar documento" precisa de um arquivo real pra existir (o
  // schema não modela um "requisito" vazio à espera de upload), então
  // isso abre o seletor de arquivo e faz upload+registro assim que algo
  // for escolhido.
  const handleAddDocument = async () => {
    if (!profile?.organization_id || !profile?.id) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar documento",
        description: "Não foi possível identificar seu escritório. Tente recarregar a página.",
      });
      return;
    }

    if (!fileInputRef.current) {
      const input = document.createElement("input");
      input.type = "file";
      fileInputRef.current = input;
    }

    const organizationId = profile.organization_id;
    const uploadedBy = profile.id;

    fileInputRef.current.onchange = async () => {
      const file = fileInputRef.current?.files?.[0];
      if (!file) return;

      try {
        await documentService.uploadNewDocument({ processId, organizationId, uploadedBy, file });
        toast({ title: "Documento adicionado com sucesso!", description: `${file.name} foi enviado.` });
        await loadDocuments();
      } catch (error) {
        console.error("Error adding document:", error);
        toast({
          variant: "destructive",
          title: "Erro ao adicionar documento",
          description: "Ocorreu um erro ao enviar o documento",
        });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    fileInputRef.current.click();
  };

  return {
    activeTab,
    setActiveTab,
    clientDocuments,
    adminDocuments,
    isLoading,
    handleClientUpload,
    handleAdminUpload,
    handleRemoveDocument,
    handleDocumentStatusChange,
    handleAddDocument,
  };
}
