
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Bell, Check, FileCheck, FileText, Mail, MessageSquare, Settings, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "document" | "message" | "status" | "system" | "approval";
  processId?: string;
  userId?: string;
  priority?: "low" | "medium" | "high";
}

export interface ProcessNotificationsProps {
  processId?: string;
  notifications?: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  isAdmin?: boolean;
}

export default function ProcessNotifications({
  processId,
  notifications = [],
  onMarkAsRead = () => {},
  onMarkAllAsRead = () => {},
  isAdmin = false
}: ProcessNotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Dados de exemplo caso nenhum seja fornecido
  const mockNotifications: Notification[] = notifications.length > 0 ? notifications : [
    {
      id: "1",
      title: "Documento enviado",
      message: "O documento 'Escritura.pdf' foi enviado com sucesso.",
      timestamp: "02/05/2023 14:30",
      isRead: false,
      type: "document",
      priority: "medium"
    },
    {
      id: "2",
      title: "Nova mensagem",
      message: "Você recebeu uma nova mensagem do advogado.",
      timestamp: "01/05/2023 10:15",
      isRead: true,
      type: "message",
      priority: "high"
    },
    {
      id: "3",
      title: "Documento aprovado",
      message: "O documento 'Procuração.pdf' foi aprovado pelo administrador.",
      timestamp: "01/05/2023 09:20",
      isRead: false,
      type: "approval",
      priority: "high"
    },
    {
      id: "4",
      title: "Etapa concluída",
      message: "A etapa 'Análise Preliminar' foi concluída com sucesso.",
      timestamp: "30/04/2023 16:45",
      isRead: false,
      type: "status",
      priority: "medium"
    },
    {
      id: "5",
      title: "Novo processo iniciado",
      message: "Um novo processo de usucapião foi iniciado para você.",
      timestamp: "28/04/2023 11:30",
      isRead: true,
      type: "system",
      priority: "low"
    }
  ];
  
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;
  
  const getNotificationIcon = (type: Notification["type"], priority: Notification["priority"] = "medium") => {
    const priorityColors = {
      low: "bg-gray-500",
      medium: "bg-blue-500",
      high: "bg-red-500",
    };
    
    const color = priorityColors[priority || "medium"];
    
    switch (type) {
      case "document":
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
        );
      case "message":
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
            <MessageSquare className="h-4 w-4 text-green-600" />
          </div>
        );
      case "status":
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100">
            <FileCheck className="h-4 w-4 text-yellow-600" />
          </div>
        );
      case "approval":
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
            <Check className="h-4 w-4 text-green-600" />
          </div>
        );
      case "system":
      default:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
            <Bell className="h-4 w-4 text-gray-600" />
          </div>
        );
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Notificações</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.preventDefault();
                onMarkAllAsRead();
              }}
              className="text-xs h-8 px-2"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-[300px]">
          {mockNotifications.length > 0 ? (
            <div className="py-2">
              {mockNotifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 cursor-default",
                    !notification.isRead && "bg-muted/50"
                  )}
                >
                  {getNotificationIcon(notification.type, notification.priority)}
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(notification.id);
                          }}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.timestamp}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhuma notificação no momento
              </p>
            </div>
          )}
        </ScrollArea>
        
        <DropdownMenuSeparator />
        
        <div className="p-2">
          <Button 
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-3 w-3 mr-2" />
            Configurar notificações
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
