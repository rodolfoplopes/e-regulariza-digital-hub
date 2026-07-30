
/**
 * Serviço real de documentos de processo (Supabase Storage + process_documents).
 * Substitui o estado mockado que existia em useDocumentManager.
 */

import { supabase } from "@/integrations/supabase/client";
import { DocumentType } from "@/components/process/DocumentUploader";

const BUCKET = "process-documents";

interface ProcessDocumentRow {
  id: string;
  process_id: string;
  name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  status: string;
  uploaded_by: string;
  review_notes: string | null;
  created_at: string;
  uploader: { role: string } | null;
}

function mapStatus(dbStatus: string): DocumentType["status"] {
  switch (dbStatus) {
    case "aprovado":
      return "approved";
    case "rejeitado":
      return "rejected";
    default:
      return "uploaded";
  }
}

function mapRowToDocumentType(row: ProcessDocumentRow): DocumentType {
  return {
    id: row.id,
    name: row.name,
    description: row.file_type || "",
    required: false,
    status: mapStatus(row.status),
    fileUrl: row.file_url,
    uploadDate: new Date(row.created_at).toLocaleDateString("pt-BR"),
    feedback: row.review_notes || undefined,
  };
}

export const documentService = {
  /**
   * Busca os documentos de um processo, já separados em "do cliente" vs
   * "internos" com base no papel de quem enviou (não existe uma coluna
   * dedicada pra essa categoria no schema atual).
   */
  async getDocuments(processId: string): Promise<{ clientDocuments: DocumentType[]; adminDocuments: DocumentType[] }> {
    const { data, error } = await supabase
      .from("process_documents")
      .select("*, uploader:profiles!process_documents_uploaded_by_fkey(role)")
      .eq("process_id", processId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const rows = (data || []) as unknown as ProcessDocumentRow[];
    const clientDocuments = rows.filter((r) => r.uploader?.role === "cliente").map(mapRowToDocumentType);
    const adminDocuments = rows.filter((r) => r.uploader?.role !== "cliente").map(mapRowToDocumentType);

    return { clientDocuments, adminDocuments };
  },

  /**
   * Envia um arquivo novo (sem documento existente pra substituir) e cria
   * o registro em process_documents.
   */
  async uploadNewDocument(params: {
    processId: string;
    organizationId: string;
    uploadedBy: string;
    file: File;
    name?: string;
  }): Promise<DocumentType> {
    const { processId, organizationId, uploadedBy, file, name } = params;
    const path = `${processId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file);
    if (uploadError) throw uploadError;

    const { data, error } = await supabase
      .from("process_documents")
      .insert({
        organization_id: organizationId,
        process_id: processId,
        name: name || file.name,
        file_url: path,
        file_type: file.type,
        file_size: file.size,
        status: "pendente",
        uploaded_by: uploadedBy,
      })
      .select("*, uploader:profiles!process_documents_uploaded_by_fkey(role)")
      .single();

    if (error) throw error;
    return mapRowToDocumentType(data as unknown as ProcessDocumentRow);
  },

  /**
   * Substitui o arquivo de um documento já existente (reenvio).
   */
  async replaceDocumentFile(params: {
    documentId: string;
    processId: string;
    file: File;
  }): Promise<void> {
    const { documentId, processId, file } = params;
    const path = `${processId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file);
    if (uploadError) throw uploadError;

    const { error } = await supabase
      .from("process_documents")
      .update({
        file_url: path,
        file_type: file.type,
        file_size: file.size,
        status: "pendente",
        review_notes: null,
      })
      .eq("id", documentId);

    if (error) throw error;
  },

  async updateStatus(documentId: string, status: "aprovado" | "rejeitado", reviewerId: string, reviewNotes?: string): Promise<void> {
    const { error } = await supabase
      .from("process_documents")
      .update({
        status,
        reviewed_by: reviewerId,
        review_notes: reviewNotes || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", documentId);

    if (error) throw error;
  },

  async deleteDocument(documentId: string, fileUrl: string): Promise<void> {
    await supabase.storage.from(BUCKET).remove([fileUrl]);
    const { error } = await supabase.from("process_documents").delete().eq("id", documentId);
    if (error) throw error;
  },

  async getSignedUrl(fileUrl: string): Promise<string | null> {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(fileUrl, 60 * 10);
    if (error) {
      console.error("Error creating signed URL:", error);
      return null;
    }
    return data.signedUrl;
  },
};
