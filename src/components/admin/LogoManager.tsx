
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/brand/Logo";
import { Image, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LogoManager() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, this would fetch the current logo URL from Supabase
    // For now, we'll just use a mock implementation
    setCurrentLogo("/lovable-uploads/3b439cb9-4071-4319-8787-a968cea832a7.png");
  }, []);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.includes('image/png')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione apenas arquivos PNG.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 1MB.",
        variant: "destructive",
      });
      return;
    }
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(url);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // In a real app, this would upload the file to Supabase Storage
    // and update the logo URL in the database
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update state with the new logo URL
      setCurrentLogo(previewUrl);
      
      toast({
        title: "Logo atualizado",
        description: "A logomarca foi atualizada com sucesso.",
      });
      
      // Clear selection
      setSelectedFile(null);
    } catch (error) {
      toast({
        title: "Erro ao fazer upload",
        description: "Ocorreu um erro ao atualizar a logomarca.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleReset = () => {
    // Reset to default logo
    setCurrentLogo("/lovable-uploads/3b439cb9-4071-4319-8787-a968cea832a7.png");
    setSelectedFile(null);
    setPreviewUrl(null);
    
    toast({
      title: "Logo restaurado",
      description: "A logomarca padrão foi restaurada.",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento da Logomarca</CardTitle>
        <CardDescription>
          Personalize a logomarca da sua plataforma. Use apenas imagens PNG com fundo transparente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="text-sm font-medium mb-2">Logo atual</h3>
            <div className="bg-gray-50 border rounded-md p-8 flex items-center justify-center">
              {currentLogo ? (
                <>
                  <div className="mb-4 flex flex-col items-center gap-4">
                    <Logo customUrl={currentLogo} size="lg" />
                    <Logo customUrl={currentLogo} size="md" />
                    <Logo customUrl={currentLogo} size="sm" />
                  </div>
                </>
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <Image className="h-10 w-10 mb-2" />
                  <span>Nenhuma logomarca definida</span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Restaurar logomarca padrão
              </Button>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-medium mb-2">Upload de nova logo</h3>
            <div className="bg-gray-50 border rounded-md p-8 flex flex-col items-center justify-center">
              {previewUrl ? (
                <div className="mb-4 flex flex-col items-center gap-4">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="h-32 w-32 object-contain"
                  />
                  <span className="text-sm text-gray-500">
                    {selectedFile?.name} ({(selectedFile?.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">PNG com fundo transparente</p>
                  <p className="text-xs text-gray-400">Máximo 1MB</p>
                </div>
              )}
              
              <div className="mt-4 w-full">
                <Input
                  type="file"
                  accept="image/png"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || isUploading}
                className="w-full"
              >
                {isUploading ? "Enviando..." : "Salvar nova logomarca"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
