
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { GeneralInfoTab } from "./footer/GeneralInfoTab";
import { LinksTab } from "./footer/LinksTab";
import { ContactTab } from "./footer/ContactTab";
import { LegalTab } from "./footer/LegalTab";
import { useFooterState } from "./footer/useFooterState";

export function FooterEditor() {
  const { toast } = useToast();
  const { 
    footerData, 
    setFooterData, 
    updateContactInfo, 
    addLink, 
    updateLink, 
    removeLink 
  } = useFooterState();

  const handleSave = () => {
    // Here you would typically save to a database
    // For now, we'll just show a toast
    toast({
      title: "Configurações de rodapé salvas",
      description: "Suas alterações foram salvas com sucesso.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Editor de Rodapé</h1>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <GeneralInfoTab footerData={footerData} setFooterData={setFooterData} />
        </TabsContent>
        
        <TabsContent value="links" className="space-y-4">
          <LinksTab 
            footerData={footerData}
            updateLink={updateLink}
            removeLink={removeLink}
            addLink={addLink}
          />
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4">
          <ContactTab 
            footerData={footerData}
            updateContactInfo={updateContactInfo}
            updateLink={updateLink}
            removeLink={removeLink}
            addLink={addLink}
          />
        </TabsContent>
        
        <TabsContent value="legal" className="space-y-4">
          <LegalTab 
            footerData={footerData}
            updateLink={updateLink}
            removeLink={removeLink}
            addLink={addLink}
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSave} className="bg-eregulariza-primary hover:bg-eregulariza-primary/90">
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
