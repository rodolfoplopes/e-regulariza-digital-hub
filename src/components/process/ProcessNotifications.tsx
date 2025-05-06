
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Check, 
  FileCheck, 
  FileText, 
  Mail, 
  MessageSquare, 
  Settings, 
  X,
  AlertTriangle,
  Clock,
  CheckCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type NotificationType = "document" | "message" | "status" | "system" | "approval" | "deadline" | "action_required";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: NotificationType;
  processId?: string;
  userId?: string;
  priority?: "low" | "medium" | "high";
  action?: string;
}

export interface ProcessNotificationsProps {
  processId?: string;
  notifications?: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  isAdmin?: boolean;
  onFilterChange?: (types: NotificationType[]) => void;
}

export default function ProcessNotifications({
  processId,
  notifications = [],
  onMarkAsRead = () => {},
  onMarkAllAsRead = () => {},
  isAdmin = false,
  onFilterChange
}: ProcessNotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<NotificationType[]>([]);
  
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
    },
    {
      id: "6",
      title: "Ação pendente",
      message: "É necessário enviar o comprovante de residência atualizado.",
      timestamp: "03/05/2023 09:15",
      isRead: false,
      type: "action_required",
      priority: "high",
      action: "Enviar documento"
    },
    {
      id: "7",
      title: "Prazo se aproximando",
      message: "O prazo para envio de documentos termina em 3 dias.",
      timestamp: "02/05/2023 11:20",
      isRead: false,
      type: "deadline",
      priority: "high"
    }
  ];

  const filteredNotifications = activeFilters.length > 0
    ? mockNotifications.filter(n => activeFilters.includes(n.type))
    : mockNotifications;
  
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  const handleFilterChange = (type: NotificationType) => {
    setActiveFilters(prev => {
      const newFilters = prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type];
      
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
      
      return newFilters;
    });
  };
  
  const getNotificationIcon = (type: NotificationType, priority: Notification["priority"] = "medium") => {
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
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        );
      case "action_required":
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
        );
      case "deadline":
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100">
            <Clock className="h-4 w-4 text-amber-600" />
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

  const getPriorityBadge = (priority: Notification["priority"]) => {
    if (!priority) return null;
    
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-red-100 text-red-800"
    };
    
    const labels = {
      low: "Baixa",
      medium: "Média",
      high: "Alta"
    };
    
    return (
      <Badge className={cn("text-xs", colors[priority])}>
        {labels[priority]}
      </Badge>
    );
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Notificações</h3>
          <div className="flex gap-2">
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
        </div>

        <DropdownMenuGroup>
          <DropdownMenuLabel>Filtrar por tipo</DropdownMenuLabel>
          <div className="px-2 py-1.5 flex flex-wrap gap-1">
            <Button 
              size="sm"
              variant={activeFilters.includes("document") ? "default" : "outline"}
              className="text-xs h-7 rounded-full"
              onClick={() => handleFilterChange("document")}
            >
              <FileText className="h-3 w-3 mr-1" /> Documentos
            </Button>
            <Button 
              size="sm"
              variant={activeFilters.includes("message") ? "default" : "outline"}
              className="text-xs h-7 rounded-full"
              onClick={() => handleFilterChange("message")}
            >
              <MessageSquare className="h-3 w-3 mr-1" /> Mensagens
            </Button>
            <Button 
              size="sm"
              variant={activeFilters.includes("action_required") ? "default" : "outline"}
              className="text-xs h-7 rounded-full"
              onClick={() => handleFilterChange("action_required")}
            >
              <AlertTriangle className="h-3 w-3 mr-1" /> Ações
            </Button>
            <Button 
              size="sm"
              variant={activeFilters.includes("status") ? "default" : "outline"}
              className="text-xs h-7 rounded-full"
              onClick={() => handleFilterChange("status")}
            >
              <FileCheck className="h-3 w-3 mr-1" /> Status
            </Button>
          </div>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-[300px]">
          {filteredNotifications.length > 0 ? (
            <div className="py-2">
              {filteredNotifications.map((notification) => (
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
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </span>
                      {notification.priority && getPriorityBadge(notification.priority)}
                    </div>
                    {notification.action && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-2 h-7 text-xs w-full justify-center eregulariza-gradient text-white border-0"
                      >
                        {notification.action}
                      </Button>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground">
                {activeFilters.length > 0 
                  ? "Nenhuma notificação encontrada para os filtros selecionados" 
                  : "Nenhuma notificação no momento"}
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
