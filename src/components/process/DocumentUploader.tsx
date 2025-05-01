
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileCheck, AlertCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  status: "pending" | "uploaded" | "approved" | "rejected";
  fileUrl?: string;
  uploadDate?: string;
  feedback?: string;
}

interface DocumentUploaderProps {
  documentType: DocumentType;
  onUpload: (documentId: string, file: File) => Promise<void>;
  onRemove?: (documentId: string) => Promise<void>;
}

export default function DocumentUploader({ 
  documentType, 
  onUpload, 
  onRemove 
}: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Basic validation
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB",
        variant: "destructive",
      });
      return;
    }
    
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Formato não suportado",
        description: "Apenas arquivos PDF, JPEG e PNG são permitidos",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      await onUpload(documentType.id, file);
      toast({
        title: "Upload realizado com sucesso",
        description: `${documentType.name} foi enviado e está aguardando aprovação.`,
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Erro ao fazer upload",
        description: "Não foi possível enviar o documento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemove = async () => {
    if (!onRemove) return;
    
    try {
      await onRemove(documentType.id);
      toast({
        title: "Documento removido",
        description: `${documentType.name} foi removido com sucesso.`,
      });
    } catch (error) {
      console.error("Error removing document:", error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o documento. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const renderStatusIcon = () => {
    switch (documentType.status) {
      case "approved":
        return <FileCheck className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "uploaded":
        return <FileCheck className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="rounded-lg border p-4 mb-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          {renderStatusIcon()}
          <h3 className="font-medium ml-2">{documentType.name}</h3>
          {documentType.required && (
            <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
              Obrigatório
            </span>
          )}
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mb-4">{documentType.description}</p>
      
      {documentType.status === "rejected" && documentType.feedback && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-700">
          <p className="font-medium">Motivo da rejeição:</p>
          <p>{documentType.feedback}</p>
        </div>
      )}
      
      {documentType.status === "uploaded" || documentType.status === "approved" ? (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center">
              <FileCheck className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700 truncate">
                {documentType.fileUrl?.split('/').pop() || "Arquivo enviado"}
              </span>
            </div>
            {documentType.status === "uploaded" && onRemove && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRemove}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Enviado em: {documentType.uploadDate || "Data não disponível"}
          </p>
          {documentType.status === "approved" && (
            <p className="text-xs text-green-600">Aprovado pela equipe</p>
          )}
        </div>
      ) : (
        <div className="mt-2">
          <label htmlFor={`document-${documentType.id}`}>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:bg-gray-50 transition cursor-pointer">
              <Upload className="h-6 w-6 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Clique para selecionar ou arraste o arquivo
              </p>
              <p className="text-xs text-gray-400">
                PDF, JPEG ou PNG (máx. 5MB)
              </p>
              <Button 
                variant="outline" 
                className="mt-2" 
                disabled={isUploading}
              >
                {isUploading ? "Enviando..." : "Selecionar arquivo"}
              </Button>
            </div>
            <input
              id={`document-${documentType.id}`}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      )}
    </div>
  );
}
