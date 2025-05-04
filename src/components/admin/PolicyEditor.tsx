
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";

interface PolicyData {
  title: string;
  content: string;
  description: string;
  lastUpdated: string;
}

type PolicyType = "politica-de-privacidade" | "termos-de-uso" | "politica-de-cookies";

// This would be fetched from an API/database in a real app
const initialPolicies: Record<PolicyType, PolicyData> = {
  "politica-de-privacidade": {
    title: "Política de Privacidade",
    content: `<h2>Política de Privacidade da e-regulariza</h2>
      <p class="mb-4">Última atualização: 01 de Maio de 2025</p>
      
      <h3>1. Introdução</h3>
      <p>A e-regulariza está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais quando você utiliza nossa plataforma de regularização imobiliária.</p>
      
      <h3>2. Informações que Coletamos</h3>
      <p>Podemos coletar os seguintes tipos de informações pessoais:</p>
      <ul>
        <li>Informações de identificação (nome, CPF, RG)</li>
        <li>Informações de contato (e-mail, telefone, endereço)</li>
        <li>Documentos imobiliários relacionados ao seu processo</li>
        <li>Informações de pagamento</li>
        <li>Dados de uso da plataforma</li>
      </ul>
      
      <h3>3. Como Utilizamos suas Informações</h3>
      <p>Utilizamos suas informações para:</p>
      <ul>
        <li>Fornecer e gerenciar nossos serviços de regularização imobiliária</li>
        <li>Processar transações e pagamentos</li>
        <li>Comunicar atualizações sobre seu processo</li>
        <li>Melhorar nossos serviços</li>
        <li>Cumprir obrigações legais</li>
      </ul>`,
    description: "Informações sobre como tratamos e protegemos os dados pessoais dos usuários da plataforma e-regulariza.",
    lastUpdated: "2025-05-01"
  },
  "termos-de-uso": {
    title: "Termos de Uso",
    content: `<h2>Termos de Uso da e-regulariza</h2>
      <p class="mb-4">Última atualização: 01 de Maio de 2025</p>
      
      <h3>1. Aceitação dos Termos</h3>
      <p>Ao acessar ou usar a plataforma e-regulariza, você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá usar nossos serviços.</p>
      
      <h3>2. Descrição dos Serviços</h3>
      <p>A e-regulariza oferece uma plataforma para gerenciamento e acompanhamento de processos de regularização imobiliária. Nossos serviços incluem, mas não se limitam a:</p>
      <ul>
        <li>Gestão de processos de regularização</li>
        <li>Upload e armazenamento de documentos</li>
        <li>Comunicação entre clientes e equipe técnica</li>
        <li>Acompanhamento de status e prazos</li>
      </ul>`,
    description: "Os termos e condições que regem o uso da plataforma e-regulariza e seus serviços de regularização imobiliária.",
    lastUpdated: "2025-05-01"
  },
  "politica-de-cookies": {
    title: "Política de Cookies",
    content: `<h2>Política de Cookies da e-regulariza</h2>
      <p class="mb-4">Última atualização: 01 de Maio de 2025</p>
      
      <h3>1. O que são Cookies</h3>
      <p>Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo quando você visita nosso site. Eles são amplamente utilizados para fazer os sites funcionarem de maneira mais eficiente e fornecer informações aos proprietários do site.</p>
      
      <h3>2. Como Utilizamos Cookies</h3>
      <p>Utilizamos cookies para:</p>
      <ul>
        <li>Garantir o funcionamento adequado da plataforma</li>
        <li>Lembrar suas preferências e configurações</li>
        <li>Manter sua sessão ativa enquanto navega pelo site</li>
        <li>Coletar dados analíticos para melhorar nossa plataforma</li>
        <li>Personalizar sua experiência</li>
      </ul>`,
    description: "Informações sobre como utilizamos cookies e tecnologias semelhantes na plataforma e-regulariza.",
    lastUpdated: "2025-05-01"
  }
};

export function PolicyEditor() {
  const { toast } = useToast();
  const [activePolicy, setActivePolicy] = useState<PolicyType>("politica-de-privacidade");
  const [policies, setPolicies] = useState<Record<PolicyType, PolicyData>>(initialPolicies);
  const [isSaving, setIsSaving] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPolicies({
      ...policies,
      [activePolicy]: {
        ...policies[activePolicy],
        content: e.target.value
      }
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPolicies({
      ...policies,
      [activePolicy]: {
        ...policies[activePolicy],
        title: e.target.value
      }
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPolicies({
      ...policies,
      [activePolicy]: {
        ...policies[activePolicy],
        description: e.target.value
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Here you would typically save to a database or API
      // For now, we'll simulate a successful save
      setTimeout(() => {
        setPolicies({
          ...policies,
          [activePolicy]: {
            ...policies[activePolicy],
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        });
        
        toast({
          title: "Conteúdo salvo com sucesso",
          description: `${policies[activePolicy].title} foi atualizado.`,
        });
        
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o conteúdo.",
        variant: "destructive",
      });
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Editor de Políticas</h1>
      
      <Tabs value={activePolicy} onValueChange={(value) => setActivePolicy(value as PolicyType)} className="space-y-6">
        <TabsList>
          <TabsTrigger value="politica-de-privacidade">Política de Privacidade</TabsTrigger>
          <TabsTrigger value="termos-de-uso">Termos de Uso</TabsTrigger>
          <TabsTrigger value="politica-de-cookies">Política de Cookies</TabsTrigger>
        </TabsList>
        
        {Object.entries(policies).map(([key, policy]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Editar {policy.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  Última atualização: {format(new Date(policy.lastUpdated), "dd/MM/yyyy")}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input 
                    id="title" 
                    value={policy.title}
                    onChange={handleTitleChange}
                    placeholder="Título da política"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Meta Descrição (para SEO)</Label>
                  <Input 
                    id="description" 
                    value={policy.description}
                    onChange={handleDescriptionChange}
                    placeholder="Breve descrição para SEO (140+ caracteres)"
                  />
                  <p className="text-xs text-muted-foreground">
                    {policy.description.length} caracteres - recomendado mínimo de 140
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo HTML</Label>
                  <Textarea 
                    id="content" 
                    value={policy.content}
                    onChange={handleContentChange}
                    placeholder="Conteúdo HTML da política"
                    rows={15}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Este editor aceita tags HTML como &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;, &lt;strong&gt;
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="bg-eregulariza-primary hover:bg-eregulariza-primary/90"
                  >
                    {isSaving ? "Salvando..." : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar alterações
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Prévia</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: policy.content }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
