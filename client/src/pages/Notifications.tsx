
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, FileCheck, FileText, MessageSquare, Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification } from "@/components/process/ProcessNotifications";
import NotificationCard from "@/components/dashboard/NotificationCard";
import { useToast } from "@/hooks/use-toast";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Example notifications
  const notifications: Notification[] = [
    {
      id: "1",
      title: "Documento enviado",
      message: "O documento 'Escritura.pdf' foi enviado com sucesso.",
      timestamp: "02/05/2023 14:30",
      isRead: false,
      type: "document",
      priority: "medium",
      processId: "proc-001"
    },
    {
      id: "2",
      title: "Nova mensagem",
      message: "Você recebeu uma nova mensagem do advogado.",
      timestamp: "01/05/2023 10:15",
      isRead: true,
      type: "message",
      priority: "high",
      processId: "proc-002"
    },
    {
      id: "3",
      title: "Documento aprovado",
      message: "O documento 'Procuração.pdf' foi aprovado pelo administrador.",
      timestamp: "01/05/2023 09:20",
      isRead: false,
      type: "approval",
      priority: "high",
      processId: "proc-001"
    },
    {
      id: "4",
      title: "Etapa concluída",
      message: "A etapa 'Análise Preliminar' foi concluída com sucesso.",
      timestamp: "30/04/2023 16:45",
      isRead: false,
      type: "status",
      priority: "medium",
      processId: "proc-003"
    },
    {
      id: "5",
      title: "Novo processo iniciado",
      message: "Um novo processo de usucapião foi iniciado para você.",
      timestamp: "28/04/2023 11:30",
      isRead: true,
      type: "system",
      priority: "low",
      processId: "proc-004"
    }
  ];
  
  const getNotificationType = (type: Notification["type"]): "info" | "success" | "warning" | "error" => {
    switch (type) {
      case "document":
        return "info";
      case "message":
        return "info";
      case "status":
        return "success";
      case "approval":
        return "success";
      case "system":
      default:
        return "warning";
    }
  };
  
  // Filter notifications based on active tab and search term
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") {
      return matchesSearch;
    }
    
    return notification.type === activeTab && matchesSearch;
  });
  
  const markAllAsRead = () => {
    // In a real app, this would update the notification status in the database
    toast({
      title: "Sucesso",
      description: "Todas as notificações foram marcadas como lidas.",
    });
  };
  
  const markAsRead = (id: string) => {
    // In a real app, this would update a single notification status
    toast({
      title: "Sucesso",
      description: `Notificação marcada como lida.`,
    });
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notificações</h1>
          <p className="text-gray-500">Gerencie todas as suas notificações</p>
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Buscar notificações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-[300px]"
          />
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Marcar todas como lidas
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="document">Documentos</TabsTrigger>
          <TabsTrigger value="message">Mensagens</TabsTrigger>
          <TabsTrigger value="status">Atualizações de Status</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "all" 
                  ? "Todas as Notificações" 
                  : activeTab === "document" 
                    ? "Notificações de Documentos" 
                    : activeTab === "message" 
                      ? "Mensagens Recebidas" 
                      : activeTab === "status" 
                        ? "Atualizações de Status" 
                        : "Notificações do Sistema"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                      <div key={notification.id} className="relative">
                        <NotificationCard 
                          notification={{
                            id: notification.id,
                            title: notification.title,
                            message: notification.message,
                            date: notification.timestamp,
                            isRead: notification.isRead,
                            type: getNotificationType(notification.type)
                          }} 
                        />
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Marcar como lida</span>
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">
                        Nenhuma notificação encontrada
                      </h3>
                      <p className="mt-1 text-gray-500">
                        Não há notificações para exibir com os filtros selecionados.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
