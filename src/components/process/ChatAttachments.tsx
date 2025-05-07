
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paperclip, Tag, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ChatAttachmentsProps {
  onAttach: (files: File[]) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  tags: string[];
  maxFileSize?: number; // In MB
  maxFiles?: number;
}

export default function ChatAttachments({
  onAttach,
  onAddTag,
  onRemoveTag,
  tags = [],
  maxFileSize = 5, // Default 5MB
  maxFiles = 3
}: ChatAttachmentsProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [newTag, setNewTag] = useState<string>('');
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    // Convert FileList to array for easier manipulation
    const filesArray = Array.from(fileList);
    
    // Check if adding these files would exceed the limit
    if (selectedFiles.length + filesArray.length > maxFiles) {
      toast({
        title: "Limite excedido",
        description: `Você pode anexar no máximo ${maxFiles} arquivos.`,
        variant: "destructive"
      });
      return;
    }

    // Check file size
    const oversizedFiles = filesArray.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "Arquivo muito grande",
        description: `Cada arquivo deve ter no máximo ${maxFileSize}MB.`,
        variant: "destructive"
      });
      return;
    }

    // Update state and trigger callback
    setSelectedFiles(prev => [...prev, ...filesArray]);
    onAttach(filesArray);
    
    // Reset input
    e.target.value = '';
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    
    // Avoid duplicate tags
    if (tags.includes(newTag.trim())) {
      toast({
        title: "Tag duplicada",
        description: "Esta tag já foi adicionada.",
      });
      return;
    }
    
    onAddTag(newTag.trim());
    setNewTag('');
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      {/* File attachments */}
      <div>
        <Label htmlFor="file-upload" className="flex items-center cursor-pointer">
          <Paperclip className="mr-2 h-4 w-4" />
          <span>Anexar arquivos</span>
        </Label>
        <Input 
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Max: {maxFiles} arquivos, {maxFileSize}MB cada
        </p>
      </div>

      {/* File previews */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <Label>Arquivos selecionados:</Label>
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div 
                key={`${file.name}-${index}`}
                className="bg-gray-100 rounded px-2 py-1 flex items-center text-sm"
              >
                <span className="truncate max-w-[150px]">{file.name}</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      <div>
        <form onSubmit={handleAddTag} className="flex items-center space-x-2">
          <div className="flex items-center flex-1">
            <Tag className="h-4 w-4 mr-2 text-gray-500" />
            <Input
              placeholder="Adicionar tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1"
            />
          </div>
          <Button type="submit" size="sm" variant="secondary">
            Adicionar
          </Button>
        </form>
      </div>

      {/* Tag previews */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div 
              key={tag}
              className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 flex items-center text-sm"
            >
              <span>{tag}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1"
                onClick={() => onRemoveTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
