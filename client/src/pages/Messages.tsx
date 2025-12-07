
import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, FileText } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

export default function Messages() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { profile } = useSupabaseAuth();

  // Mock messages data - in real app would come from Supabase
  const messages = [
    {
      id: "1",
      processTitle: "Regularização Imóvel - Rua das Flores, 123",
      message: "Documentação recebida com sucesso. Iniciando análise.",
      date: "2024-01-15",
      time: "14:30",
      isFromAdmin: true,
      sender: "Equipe e-regulariza"
    },
    {
      id: "2", 
      processTitle: "Regularização Imóvel - Rua das Flores, 123",
      message: "Tenho uma dúvida sobre os documentos necessários para a próxima etapa.",
      date: "2024-01-14",
      time: "09:15",
      isFromAdmin: false,
      sender: profile?.name || "Você"
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here would send message to Supabase
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-eregulariza-gray font-montserrat">Mensagens</h1>
            <p className="text-eregulariza-description">Converse com nossa equipe sobre seus processos</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de conversas */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-eregulariza-primary" />
                    Seus Processos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg cursor-pointer hover:bg-eregulariza-surface transition-colors">
                      <h4 className="font-medium text-sm text-eregulariza-gray">Regularização Imóvel</h4>
                      <p className="text-xs text-eregulariza-description">Rua das Flores, 123</p>
                      <p className="text-xs text-eregulariza-secondary mt-1">2 mensagens</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Área de mensagens */}
            <div className="lg:col-span-2">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-eregulariza-primary" />
                    Regularização Imóvel - Rua das Flores, 123
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {/* Histórico de mensagens */}
                  <div className="flex-1 space-y-4 mb-4 max-h-96 overflow-y-auto">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.isFromAdmin ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isFromAdmin 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-eregulariza-primary text-white'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                          <div className="flex justify-between items-center mt-2 text-xs opacity-75">
                            <span>{message.sender}</span>
                            <span>{message.date} às {message.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Campo de nova mensagem */}
                  <div className="border-t pt-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Digite sua mensagem..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 min-h-[60px] resize-none"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="eregulariza-gradient text-white"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
