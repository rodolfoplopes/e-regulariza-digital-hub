
/**
 * Serviço para gerenciamento de conteúdos CMS
 * @fileoverview Operações CRUD para conteúdos institucionais
 */

import { BaseService } from "./core/base";
import { CMSContent, CMSContentType } from "./core/types";

class CMSService extends BaseService {
  constructor() {
    super('CMSService');
  }

  /**
   * Busca conteúdo por tipo
   * @param tipo Tipo do conteúdo (politica-privacidade, termos-uso, etc.)
   * @returns Conteúdo encontrado ou null
   */
  async getContentByType(tipo: CMSContentType): Promise<CMSContent | null> {
    return this.executeOperation(
      `getContentByType(${tipo})`,
      async () => {
        // For now, return mock data since the table is not in the types yet
        console.log('Getting CMS content by type:', tipo);
        return {
          id: '1',
          tipo,
          titulo: 'Título do conteúdo',
          conteudo: 'Conteúdo de exemplo',
          data_ultima_edicao: new Date().toISOString(),
          created_at: new Date().toISOString()
        };
      }
    );
  }

  /**
   * Busca todos os conteúdos CMS
   * @returns Array de conteúdos
   */
  async getAllContents(): Promise<CMSContent[]> {
    return this.executeArrayOperation(
      'getAllContents',
      async () => {
        // For now, return mock data since the table is not in the types yet
        console.log('Getting all CMS contents');
        return [];
      }
    );
  }

  /**
   * Atualiza conteúdo existente
   * @param tipo Tipo do conteúdo
   * @param titulo Título do conteúdo
   * @param conteudo Conteúdo HTML
   * @param editorId ID do usuário que está editando
   * @returns Conteúdo atualizado ou null
   */
  async updateContent(
    tipo: CMSContentType,
    titulo: string,
    conteudo: string,
    editorId: string
  ): Promise<CMSContent | null> {
    return this.executeOperation(
      `updateContent(${tipo})`,
      async () => {
        // For now, return mock data since the table is not in the types yet
        console.log('Updating CMS content:', { tipo, titulo, editorId });
        return {
          id: '1',
          tipo,
          titulo,
          conteudo,
          data_ultima_edicao: new Date().toISOString(),
          editor: editorId,
          created_at: new Date().toISOString()
        };
      }
    );
  }

  /**
   * Cria novo conteúdo
   * @param tipo Tipo do conteúdo
   * @param titulo Título do conteúdo
   * @param conteudo Conteúdo HTML
   * @param editorId ID do usuário que está criando
   * @returns Conteúdo criado ou null
   */
  async createContent(
    tipo: CMSContentType,
    titulo: string,
    conteudo: string,
    editorId: string
  ): Promise<CMSContent | null> {
    return this.executeOperation(
      `createContent(${tipo})`,
      async () => {
        // For now, return mock data since the table is not in the types yet
        console.log('Creating CMS content:', { tipo, titulo, editorId });
        return {
          id: '1',
          tipo,
          titulo,
          conteudo,
          data_ultima_edicao: new Date().toISOString(),
          editor: editorId,
          created_at: new Date().toISOString()
        };
      }
    );
  }

  /**
   * Busca informações do último editor
   * @param tipo Tipo do conteúdo
   * @returns Informações do editor
   */
  async getLastEditorInfo(tipo: CMSContentType): Promise<{ data_ultima_edicao: string; editor: string } | null> {
    try {
      console.log('Getting last editor info for:', tipo);
      return {
        data_ultima_edicao: new Date().toISOString(),
        editor: 'system'
      };
    } catch (error) {
      this.logError('getLastEditorInfo', error);
      return null;
    }
  }

  /**
   * Valida conteúdo HTML básico
   * @param content Conteúdo a ser validado
   * @returns Array de erros encontrados
   */
  validateContent(content: string): string[] {
    const errors: string[] = [];

    if (!content || content.trim().length === 0) {
      errors.push('Conteúdo não pode estar vazio');
    }

    if (content.length > 50000) {
      errors.push('Conteúdo muito longo (máximo 50.000 caracteres)');
    }

    // Validação básica de HTML malicioso
    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ];

    dangerousPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        errors.push('Conteúdo contém código potencialmente perigoso');
      }
    });

    return errors;
  }

  /**
   * Gera preview do conteúdo
   * @param content Conteúdo completo
   * @param maxLength Tamanho máximo do preview
   * @returns Preview do conteúdo
   */
  generatePreview(content: string, maxLength: number = 200): string {
    // Remove tags HTML para preview
    const textOnly = content.replace(/<[^>]*>/g, '');
    
    if (textOnly.length <= maxLength) {
      return textOnly;
    }

    return textOnly.substring(0, maxLength).trim() + '...';
  }
}

export const cmsService = new CMSService();
