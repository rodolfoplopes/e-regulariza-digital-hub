import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  AlertTriangle,
  Filter,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { documentValidationService, DocumentWithAudit } from "@/services/documentValidationService";
import { formatRelativeTime } from "@/utils/dateUtils";
import DocumentValidationModal from "./DocumentValidationModal";
import DocumentAuditHistory from "./DocumentAuditHistory";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";

export default function DocumentValidationPanel() {
  const [documents, setDocuments] = useState<DocumentWithAudit[]>([]);
  const [pendingDocuments, setPendingDocuments] = useState<DocumentWithAudit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDocument, setSelectedDocument] = useState<{ id: string; name: string } | null>(null);
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const [allDocs, pendingDocs] = await Promise.all([
        documentValidationService.getDocumentsWithAudit(),
        documentValidationService.getPendingDocuments()
      ]);
      
      setDocuments(allDocs);
      setPendingDocuments(pendingDocs);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: "Erro ao carregar documentos",
        description: "Não foi possível carregar os documentos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidationComplete = () => {
    loadDocuments();
    setSelectedDocument(null);
    setModalAction(null);
  };

  const handleApprove = (document: DocumentWithAudit) => {
    setSelectedDocument({ id: document.id, name: document.name });
    setModalAction('approve');
  };

  const handleReject = (document: DocumentWithAudit) => {
    setSelectedDocument({ id: document.id, name: document.name });
    setModalAction('reject');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejeitado':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'rejeitado':
        return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const DocumentCard = ({ document }: { document: DocumentWithAudit }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <div>
              <CardTitle className="text-base">{document.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-3 w-3 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {document.uploader?.name || 'Usuário desconhecido'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  {formatRelativeTime(document.created_at)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(document.status)}
            {getStatusBadge(document.status)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(document.file_url, '_blank')}
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </Button>
            
            {document.status === 'pendente' && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => handleApprove(document)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Aprovar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleReject(document)}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Rejeitar
                </Button>
              </div>
            )}
          </div>
        </div>

        {document.review_notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Observação:</span>
            </div>
            <p className="text-sm text-gray-700">{document.review_notes}</p>
          </div>
        )}

        <div className="mt-4">
          <DocumentAuditHistory 
            documentId={document.id}
            documentName={document.name}
          />
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" text="Carregando documentos..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Validação de Documentos</h1>
        <Button onClick={loadDocuments} variant="outline">
          Atualizar
        </Button>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            Pendentes ({pendingDocuments.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Todos ({documents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingDocuments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum documento pendente
                </h3>
                <p className="text-gray-500 text-center">
                  Todos os documentos foram validados.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingDocuments.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="aprovado">Aprovados</SelectItem>
                <SelectItem value="rejeitado">Rejeitados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum documento encontrado
                </h3>
                <p className="text-gray-500 text-center">
                  Ajuste os filtros ou tente uma busca diferente.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedDocument && modalAction && (
        <DocumentValidationModal
          isOpen={true}
          onClose={() => {
            setSelectedDocument(null);
            setModalAction(null);
          }}
          documentId={selectedDocument.id}
          documentName={selectedDocument.name}
          action={modalAction}
          onValidationComplete={handleValidationComplete}
        />
      )}
    </div>
  );
}