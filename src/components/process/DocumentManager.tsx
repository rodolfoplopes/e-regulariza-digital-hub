
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import DocumentUploader, { DocumentType } from "@/components/process/DocumentUploader";
import { FileText, Download, ThumbsUp, ThumbsDown, AlertTriangle, Upload } from "lucide-react";

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
    // This would normally involve an API call to upload the file
    console.log(`Upload client document ${documentId}:`, file);
    
    // For demo purposes, we'll simulate a successful upload
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
    
    return Promise.resolve();
  };

  // Handle document upload by admin
  const handleAdminUpload = async (documentId: string, file: File) => {
    // This would normally involve an API call to upload the file
    console.log(`Upload admin document ${documentId}:`, file);
    
    // For demo purposes, we'll simulate a successful upload
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
    
    return Promise.resolve();
  };

  // Handle document removal
  const handleRemoveDocument = async (documentId: string) => {
    // This would normally involve an API call to delete the file
    console.log(`Remove document ${documentId}`);
    
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
    
    return Promise.resolve();
  };

  // Handle document status change (approve/reject)
  const handleDocumentStatusChange = (documentId: string, status: "approved" | "rejected", feedback?: string) => {
    setClientDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.id === documentId 
          ? { ...doc, status, feedback }
          : doc
      )
    );
    
    toast({
      title: `Documento ${status === "approved" ? "aprovado" : "rejeitado"}`,
      description: `O documento ${status === "approved" ? "foi aprovado" : "foi rejeitado"}${feedback ? " com comentários" : ""}.`,
    });
  };

  // Handle addition of new document requirement
  const handleAddDocument = () => {
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
    
    toast({
      title: "Documento adicionado",
      description: "Um novo documento foi adicionado à lista.",
    });
  };

  // Get status badge styling based on status
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

  // Get document count by status
  const getDocumentCountByStatus = (documents: DocumentType[], status: string) => {
    return documents.filter(doc => doc.status === status).length;
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

          <div className="mb-4 grid grid-cols-4 gap-2">
            <div className="bg-slate-50 p-2 rounded text-center">
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-bold text-lg">
                {activeTab === "client" ? clientDocuments.length : adminDocuments.length}
              </p>
            </div>
            <div className="bg-slate-50 p-2 rounded text-center">
              <p className="text-sm text-gray-500">Pendentes</p>
              <p className="font-bold text-lg">
                {activeTab === "client" 
                  ? getDocumentCountByStatus(clientDocuments, "pending") 
                  : getDocumentCountByStatus(adminDocuments, "pending")}
              </p>
            </div>
            <div className="bg-slate-50 p-2 rounded text-center">
              <p className="text-sm text-gray-500">Enviados</p>
              <p className="font-bold text-lg">
                {activeTab === "client" 
                  ? getDocumentCountByStatus(clientDocuments, "uploaded") 
                  : getDocumentCountByStatus(adminDocuments, "uploaded")}
              </p>
            </div>
            <div className="bg-slate-50 p-2 rounded text-center">
              <p className="text-sm text-gray-500">Aprovados</p>
              <p className="font-bold text-lg">
                {activeTab === "client" 
                  ? getDocumentCountByStatus(clientDocuments, "approved") 
                  : getDocumentCountByStatus(adminDocuments, "approved")}
              </p>
            </div>
          </div>

          <TabsContent value="client" className="space-y-4">
            {clientDocuments.map((doc) => (
              <div key={doc.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      {doc.name}
                      {doc.required && (
                        <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                          Obrigatório
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">{doc.description}</p>
                  </div>
                  <div>{getStatusBadge(doc.status)}</div>
                </div>

                {doc.status === "rejected" && doc.feedback && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-700">
                    <p className="font-medium flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Motivo da rejeição:
                    </p>
                    <p>{doc.feedback}</p>
                  </div>
                )}

                {(doc.status === "uploaded" || doc.status === "approved" || doc.status === "rejected") && doc.fileUrl && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded mb-3">
                    <div className="flex items-center overflow-hidden">
                      <FileText className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                      <span className="text-sm text-gray-700 truncate">
                        {doc.fileUrl.split('/').pop()}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {isAdmin && doc.status === "uploaded" && (
                  <div className="flex space-x-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => handleDocumentStatusChange(doc.id, "approved")}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        const feedback = prompt("Motivo da rejeição:");
                        if (feedback) {
                          handleDocumentStatusChange(doc.id, "rejected", feedback);
                        }
                      }}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                )}

                {doc.status !== "approved" && (
                  <DocumentUploader
                    documentType={doc}
                    onUpload={handleClientUpload}
                    onRemove={doc.status === "uploaded" ? handleRemoveDocument : undefined}
                  />
                )}
              </div>
            ))}

            {clientDocuments.length === 0 && (
              <div className="text-center py-8 border rounded-md">
                <p className="text-gray-500">Nenhum documento cadastrado para esta etapa.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            {adminDocuments.map((doc) => (
              <div key={doc.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      {doc.name}
                    </h3>
                    <p className="text-sm text-gray-500">{doc.description}</p>
                  </div>
                  <div>{getStatusBadge(doc.status)}</div>
                </div>

                {(doc.status === "uploaded" || doc.status === "approved") && doc.fileUrl && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded mb-3">
                    <div className="flex items-center overflow-hidden">
                      <FileText className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                      <span className="text-sm text-gray-700 truncate">
                        {doc.fileUrl.split('/').pop()}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {isAdmin && (
                  <DocumentUploader
                    documentType={doc}
                    onUpload={handleAdminUpload}
                    onRemove={doc.status === "uploaded" ? handleRemoveDocument : undefined}
                  />
                )}
              </div>
            ))}

            {adminDocuments.length === 0 && (
              <div className="text-center py-8 border rounded-md">
                <p className="text-gray-500">Nenhum documento interno cadastrado para esta etapa.</p>
                {isAdmin && (
                  <Button variant="outline" onClick={handleAddDocument} className="mt-4">
                    <Upload className="h-4 w-4 mr-2" />
                    Adicionar novo documento
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
