
/**
 * Hook para gerenciamento de conteúdos CMS
 * @fileoverview Hook customizado com TanStack Query para operações de CMS
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';
import { useSupabaseAuth } from './useSupabaseAuth';
import { CMSContentType } from '@/services/core/types';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook para obter conteúdo por tipo
 * @param tipo Tipo do conteúdo
 * @returns Query com dados do conteúdo
 */
export const useCMSContent = (tipo: CMSContentType) => {
  return useQuery({
    queryKey: ['cms-content', tipo],
    queryFn: () => cmsService.getContentByType(tipo),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obter todos os conteúdos CMS
 * @returns Query com array de conteúdos
 */
export const useAllCMSContents = () => {
  return useQuery({
    queryKey: ['cms-contents'],
    queryFn: () => cmsService.getAllContents(),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para atualizar conteúdo CMS
 * @returns Mutation para atualização
 */
export const useUpdateCMSContent = () => {
  const queryClient = useQueryClient();
  const { profile } = useSupabaseAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      tipo,
      titulo,
      conteudo
    }: {
      tipo: CMSContentType;
      titulo: string;
      conteudo: string;
    }) => {
      if (!profile?.id) {
        throw new Error('Usuário não autenticado');
      }

      return cmsService.updateContent(tipo, titulo, conteudo, profile.id);
    },
    onSuccess: (data, variables) => {
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['cms-content', variables.tipo] });
      queryClient.invalidateQueries({ queryKey: ['cms-contents'] });

      toast({
        title: 'Sucesso',
        description: 'Conteúdo atualizado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error?.message || 'Erro ao atualizar conteúdo',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook para criar novo conteúdo CMS
 * @returns Mutation para criação
 */
export const useCreateCMSContent = () => {
  const queryClient = useQueryClient();
  const { profile } = useSupabaseAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      tipo,
      titulo,
      conteudo
    }: {
      tipo: CMSContentType;
      titulo: string;
      conteudo: string;
    }) => {
      if (!profile?.id) {
        throw new Error('Usuário não autenticado');
      }

      return cmsService.createContent(tipo, titulo, conteudo, profile.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-contents'] });
      
      toast({
        title: 'Sucesso',
        description: 'Conteúdo criado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error?.message || 'Erro ao criar conteúdo',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook para validação de conteúdo CMS
 * @returns Função de validação
 */
export const useCMSValidation = () => {
  const validateContent = (content: string): string[] => {
    return cmsService.validateContent(content);
  };

  const generatePreview = (content: string, maxLength?: number): string => {
    return cmsService.generatePreview(content, maxLength);
  };

  return {
    validateContent,
    generatePreview,
  };
};

/**
 * Hook para verificar permissões de CMS
 * @returns Permissões do usuário atual
 */
export const useCMSPermissions = () => {
  const { profile } = useSupabaseAuth();

  const canEdit = profile?.role === 'admin';
  const canView = true; // Qualquer um pode visualizar

  return {
    canEdit,
    canView,
  };
};
