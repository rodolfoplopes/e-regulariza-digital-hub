
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, X as CloseIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    initials: string;
    type: "admin" | "client";
  };
  timestamp: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

export interface ProcessMessagesProps {
  messages?: Message[];
  onSendMessage?: (content: string, attachments?: File[]) => Promise<void>;
  processId: string;
  isAdmin?: boolean;
}

export default function ProcessMessages({
  messages = [],
  onSendMessage = async () => {},
  processId,
  isAdmin = false
}: ProcessMessagesProps) {
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Simulando mensagens caso não sejam passadas
  const mockMessages: Message[] = messages.length > 0 ? messages : [
    {
      id: '1',
      content: 'Bom dia! Precisamos dos documentos do terreno para dar continuidade ao processo.',
      sender: {
        id: 'admin1',
        name: 'Advogado E-regulariza',
        initials: 'ER',
        type: 'admin'
      },
      timestamp: '01/05/2023 10:30'
    },
    {
      id: '2',
      content: 'Olá, acabei de enviar os documentos solicitados. Por favor, confirme o recebimento.',
      sender: {
        id: 'client1',
        name: 'João da Silva',
        initials: 'JS',
        type: 'client'
      },
      timestamp: '01/05/2023 14:22'
    }
  ];
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [mockMessages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() && !attachments.length) return;
    
    setIsSending(true);
    
    try {
      await onSendMessage(newMessage, attachments.length > 0 ? attachments : undefined);
      setNewMessage("");
      setAttachments([]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convert FileList to Array and add to attachments
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  
  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  mockMessages.forEach(message => {
    const date = message.timestamp.split(' ')[0]; // Extract date part
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Mensagens do Processo</h3>
        <p className="text-sm text-gray-500">
          Entre em contato com a equipe de suporte
        </p>
      </div>
      
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-6">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-xs text-gray-500">
                    {date}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {dateMessages.map(message => (
                  <div 
                    key={message.id}
                    className={`flex ${
                      message.sender.type === "admin" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div className="flex max-w-[70%]">
                      {message.sender.type === "admin" && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {message.sender.initials}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div>
                        <div 
                          className={`rounded-lg p-3 ${
                            message.sender.type === "admin" 
                              ? "bg-gray-100" 
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <p>{message.content}</p>
                          
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map(attachment => (
                                <a 
                                  key={attachment.name}
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-xs p-2 bg-white/20 rounded hover:bg-white/30"
                                >
                                  <Paperclip className="h-3 w-3 mr-1" />
                                  {attachment.name}
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
                          {message.timestamp.split(' ')[1]} • {message.sender.name}
                        </div>
                      </div>
                      
                      {message.sender.type === "client" && (
                        <Avatar className="h-8 w-8 ml-2">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {message.sender.initials}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div 
              key={index}
              className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center"
            >
              <Paperclip className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[100px]">{file.name}</span>
              <button 
                type="button"
                onClick={() => removeAttachment(index)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <CloseIcon className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="px-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 border-0 focus:ring-0 focus:outline-none bg-transparent"
        />
        
        <Button
          type="submit"
          size="sm"
          disabled={isSending || (!newMessage.trim() && !attachments.length)}
        >
          {isSending ? "Enviando..." : "Enviar"}
          <Send className="h-4 w-4 ml-2" />
        </Button>
      </form>
    </div>
  );
}
