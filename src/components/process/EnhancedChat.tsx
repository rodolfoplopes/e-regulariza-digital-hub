import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Paperclip, 
  Send, 
  X as CloseIcon, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  User, 
  FileWarning, 
  FileQuestion, 
  AlertOctagon,
  File,
  Image
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { sanitizeForStorage, sanitizeText } from "@/utils/sanitization";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface MessageAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export type MessageTag = "urgente" | "documento" | "importante" | "pergunta" | "respondido" | "aguardando" | "interno";

export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    initials: string;
    type: "admin" | "client";
  };
  timestamp: string;
  attachments?: MessageAttachment[];
  tags?: MessageTag[];
}

export interface EnhancedChatProps {
  messages?: ChatMessage[];
  onSendMessage?: (content: string, attachments?: File[], tags?: MessageTag[]) => Promise<void>;
  processId: string;
  isAdmin?: boolean;
  recipientName?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.png', '.jpg', '.jpeg'];

export default function EnhancedChat({
  messages = [],
  onSendMessage = async () => {},
  processId,
  isAdmin = false,
  recipientName = "Cliente"
}: EnhancedChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedTags, setSelectedTags] = useState<MessageTag[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [filter, setFilter] = useState<"all" | "urgent" | "documents">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Mock messages if none provided
  const mockMessages: ChatMessage[] = messages.length > 0 ? messages : [
    {
      id: '1',
      content: 'Olá! Bem-vindo ao chat do seu processo. Como posso ajudá-lo hoje?',
      sender: {
        id: 'admin1',
        name: 'Equipe E-regulariza',
        initials: 'ER',
        type: 'admin'
      },
      timestamp: new Date().toLocaleString('pt-BR'),
      tags: ['importante']
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [mockMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Arquivo muito grande",
        description: `O tamanho máximo permitido é de 10MB. Seu arquivo tem ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
        variant: "destructive"
      });
      return false;
    }

    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      toast({
        title: "Formato não suportado",
        description: `Apenas arquivos ${ALLOWED_EXTENSIONS.join(', ')} são permitidos.`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() && !attachments.length) return;
    
    setIsSending(true);
    
    try {
      // Sanitize message content before sending
      const sanitizedMessage = sanitizeForStorage(newMessage);
      
      await onSendMessage(sanitizedMessage, attachments.length > 0 ? attachments : undefined, selectedTags.length > 0 ? selectedTags : undefined);
      setNewMessage("");
      setAttachments([]);
      setSelectedTags([]);
      
      toast({
        title: "Mensagem enviada",
        description: attachments.length > 0 
          ? `Mensagem enviada com ${attachments.length} anexo(s)` 
          : "Sua mensagem foi enviada com sucesso",
        className: "bg-white border-green-100",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(validateFile);
      
      if (validFiles.length > 0) {
        setAttachments(prev => [...prev, ...validFiles]);
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const toggleTag = (tag: MessageTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const getTagBadge = (tag: MessageTag) => {
    const tagConfig = {
      urgente: { color: "bg-red-100 text-red-800 border-red-200", icon: AlertOctagon, label: "Urgente" },
      importante: { color: "bg-orange-100 text-orange-800 border-orange-200", icon: AlertCircle, label: "Importante" },
      documento: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: FileWarning, label: "Documento" },
      pergunta: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: FileQuestion, label: "Pergunta" },
      respondido: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle, label: "Respondido" },
      aguardando: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock, label: "Aguardando" },
      interno: { color: "bg-gray-100 text-gray-800 border-gray-200", icon: User, label: "Interno" }
    };

    const config = tagConfig[tag];
    const IconComponent = config.icon;

    return (
      <Badge variant="outline" className={config.color}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.toLowerCase().split('.').pop();
    if (extension === 'pdf' || extension === 'docx') {
      return <File className="h-4 w-4" />;
    }
    return <Image className="h-4 w-4" />;
  };

  const filteredMessages = mockMessages.filter(message => {
    if (filter === "all") return true;
    if (filter === "urgent") return message.tags?.includes("urgente") || message.tags?.includes("importante");
    if (filter === "documents") return message.tags?.includes("documento");
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Chat do Processo
            </h3>
            <p className="text-sm text-gray-600">
              {isAdmin ? `Conversando com ${recipientName}` : "Suporte E-regulariza"}
            </p>
          </div>
          
          <Select value={filter} onValueChange={(value: "all" | "urgent" | "documents") => setFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="urgent">Urgentes</SelectItem>
              <SelectItem value="documents">Documentos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {filteredMessages.map(message => (
            <div 
              key={message.id}
              className={`flex ${message.sender.type === "admin" ? "justify-start" : "justify-end"}`}
            >
              <div className="flex max-w-[80%]">
                {message.sender.type === "admin" && (
                  <Avatar className="h-8 w-8 mr-2 mt-1">
                    <AvatarFallback className="bg-[#3C00F8] text-white text-xs">
                      {message.sender.initials}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div>
                  <div 
                    className={cn(
                      "rounded-lg p-3 shadow-sm",
                      message.sender.type === "admin" 
                        ? "bg-gray-100 text-gray-900" 
                        : "bg-[#3C00F8] text-white"
                    )}
                  >
                    {message.tags && message.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {message.tags.map(tag => (
                          <div key={tag}>
                            {getTagBadge(tag)}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Sanitize message content for display */}
                    <p className="text-sm">{sanitizeText(message.content)}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment, index) => (
                          <a 
                            key={index}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "flex items-center text-xs p-2 rounded hover:bg-opacity-80 transition-colors",
                              message.sender.type === "admin" 
                                ? "bg-white/90 text-gray-700" 
                                : "bg-white/20 text-white hover:bg-white/30"
                            )}
                          >
                            {getFileIcon(attachment.name)}
                            <span className="ml-2">{sanitizeText(attachment.name)}</span>
                            <span className="ml-1 text-xs opacity-75">
                              ({(attachment.size / 1024).toFixed(0)}KB)
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className={`text-xs mt-1 text-gray-500 ${
                      message.sender.type === "admin" ? "text-left" : "text-right"
                    }`}
                  >
                    {message.timestamp} • {sanitizeText(message.sender.name)}
                  </div>
                </div>
                
                {message.sender.type === "client" && (
                  <Avatar className="h-8 w-8 ml-2 mt-1">
                    <AvatarFallback className="bg-[#3C00F8] text-white text-xs">
                      {message.sender.initials}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Anexos ({attachments.length})
          </Label>
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div 
                key={index}
                className="bg-white rounded px-3 py-2 text-sm flex items-center shadow-sm border"
              >
                {getFileIcon(file.name)}
                <span className="ml-2 truncate max-w-[120px]">{sanitizeText(file.name)}</span>
                <span className="ml-1 text-xs text-gray-500">
                  ({(file.size / 1024).toFixed(0)}KB)
                </span>
                <button 
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags Preview */}
      {isAdmin && selectedTags.length > 0 && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Tags da mensagem
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <div key={tag} className="flex items-center">
                {getTagBadge(tag)}
                <button 
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white rounded-b-lg">
        {/* Admin Tags */}
        {isAdmin && (
          <div className="flex flex-wrap gap-2 mb-3">
            {(['urgente', 'importante', 'documento', 'pergunta', 'respondido', 'aguardando', 'interno'] as MessageTag[]).map(tag => (
              <Button 
                key={tag}
                type="button"
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                className="text-xs h-7"
                onClick={() => toggleTag(tag)}
              >
                {getTagBadge(tag)}
              </Button>
            ))}
          </div>
        )}
        
        <div className="flex items-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="p-2 h-10"
            onClick={() => fileInputRef.current?.click()}
            title="Anexar arquivo (máx. 10MB)"
          >
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
          
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="border-gray-200 focus:border-[#3C00F8]"
              maxLength={1000}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSending || (!newMessage.trim() && !attachments.length)}
            className="h-10 bg-[#3C00F8] hover:bg-[#3C00F8]/90 text-white"
          >
            {isSending ? (
              "Enviando..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-1" />
                Enviar
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
