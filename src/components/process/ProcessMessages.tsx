
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    initials: string;
    type: "client" | "admin";
  };
  timestamp: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
}

interface ProcessMessagesProps {
  messages: Message[];
  onSendMessage: (content: string, attachments?: File[]) => Promise<void>;
  processId: string;
}

export default function ProcessMessages({ 
  messages, 
  onSendMessage,
  processId 
}: ProcessMessagesProps) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Convert FileList to Array
    const fileArray = Array.from(files);
    
    // Check file size (5MB limit per file)
    const oversizedFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "Arquivo(s) muito grande(s)",
        description: "Cada arquivo deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Add to existing attachments
    setAttachments(prev => [...prev, ...fileArray]);
    
    // Reset the input
    e.target.value = "";
  };
  
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && attachments.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      await onSendMessage(message.trim(), attachments.length > 0 ? attachments : undefined);
      setMessage("");
      setAttachments([]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Nenhuma mensagem enviada ainda. Inicie uma conversa com a equipe.
            </p>
          </div>
        ) : (
          messages.map(msg => (
            <div 
              key={msg.id} 
              className={cn(
                "flex items-start gap-3",
                msg.sender.type === "client" ? "flex-row-reverse" : ""
              )}
            >
              <Avatar className={msg.sender.type === "client" ? "border-eregulariza-primary" : "border-gray-300"}>
                <AvatarFallback className={
                  msg.sender.type === "client" 
                    ? "bg-eregulariza-primary text-white" 
                    : "bg-gray-100 text-gray-700"
                }>
                  {msg.sender.initials}
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[75%]">
                <div className={cn(
                  "rounded-lg py-2 px-3",
                  msg.sender.type === "client" 
                    ? "bg-eregulariza-primary/10 text-eregulariza-primary/90"
                    : "bg-gray-100 text-gray-800"
                )}>
                  <p className="text-sm font-medium">
                    {msg.sender.name}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.attachments.map(attachment => (
                        <a 
                          key={attachment.id}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-2 bg-white/50 rounded text-xs hover:bg-white/80 transition"
                        >
                          <Paperclip className="h-3 w-3 mr-1" />
                          <span className="truncate">{attachment.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4">
        {attachments.length > 0 && (
          <div className="mb-2 space-y-1">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center overflow-hidden">
                  <Paperclip className="h-3 w-3 mr-2 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
                <Button 
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => removeAttachment(index)}
                >
                  <span className="sr-only">Remover</span>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Escreva sua mensagem aqui..."
              className="resize-none min-h-[80px]"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="rounded-md border border-input hover:bg-gray-50 h-9 w-9 flex items-center justify-center">
                <Paperclip className="h-4 w-4" />
              </div>
              <input 
                id="file-upload" 
                type="file" 
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
            </label>
            <Button 
              type="submit"
              size="icon"
              disabled={isSubmitting || (!message.trim() && attachments.length === 0)}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
