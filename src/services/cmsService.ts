
/**
 * Serviço para gerenciamento de conteúdos do CMS
 * @fileoverview Operações CRUD para conteúdos institucionais
 */

import { supabase } from "@/integrations/supabase/client";
import { BaseService } from "./core/base";
import { CMSContent, CMSContentType } from "./core/types";

class CMSService extends BaseService {
  constructor() {
    super('CMSService');
  }

  /**
   * Obtém conteúdo por tipo
   * @param tipo Tipo do conteúdo (politica-privacidade, termos-uso, etc.)
   * @returns Conteúdo encontrado ou null
   */
  async getContentByType(tipo: CMSContentType): Promise<CMSContent | null> {
    return this.executeOperation('getContentByType', async () => {
      const { data, error } = await supabase
        .from('cms_contents')
        .select('*')
        .eq('tipo', tipo)
        .single();

      if (error) {
        throw error;
      }

      return data;
    });
  }

  /**
   * Lista todos os conteúdos do CMS
   * @returns Array de conteúdos
   */
  async getAllContents(): Promise<CMSContent[]> {
    return this.executeArrayOperation('getAllContents', async () => {
      const { data, error } = await supabase
        .from('cms_contents')
        .select('*')
        .order('tipo');

      if (error) {
        throw error;
      }

      return data || [];
    });
  }

  /**
   * Atualiza conteúdo existente
   * @param tipo Tipo do conteúdo
   * @param titulo Novo título
   * @param conteudo Novo conteúdo
   * @param editorId ID do usuário que está editando
   * @returns Conteúdo atualizado ou null
   */
  async updateContent(
    tipo: CMSContentType,
    titulo: string,
    conteudo: string,
    editorId: string
  ): Promise<CMSContent | null> {
    return this.executeOperation('updateContent', async () => {
      // Validações
      if (!titulo.trim()) {
        throw new Error('Título é obrigatório');
      }

      if (!conteudo.trim()) {
        throw new Error('Conteúdo é obrigatório');
      }

      // Sanitizar HTML básico (remover scripts)
      const sanitizedContent = this.sanitizeHTML(conteudo);

      const { data, error } = await supabase
        .from('cms_contents')
        .update({
          titulo: titulo.trim(),
          conteudo: sanitizedContent,
          editor: editorId,
          data_ultima_edicao: new Date().toISOString()
        })
        .eq('tipo', tipo)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    });
  }

  /**
   * Cria novo conteúdo
   * @param tipo Tipo do conteúdo
   * @param titulo Título
   * @param conteudo Conteúdo
   * @param editorId ID do usuário que está criando
   * @returns Conteúdo criado ou null
   */
  async createContent(
    tipo: CMSContentType,
    titulo: string,
    conteudo: string,
    editorId: string
  ): Promise<CMSContent | null> {
    return this.executeOperation('createContent', async () => {
      // Verificar se já existe conteúdo deste tipo
      const existing = await this.getContentByType(tipo);
      if (existing) {
        throw new Error('Já existe conteúdo deste tipo. Use a função de atualização.');
      }

      const sanitizedContent = this.sanitizeHTML(conteudo);

      const { data, error } = await supabase
        .from('cms_contents')
        .insert({
          tipo,
          titulo: titulo.trim(),
          conteudo: sanitizedContent,
          editor: editorId
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    });
  }

  /**
   * Obtém histórico de edições de um conteúdo
   * @param tipo Tipo do conteúdo
   * @returns Dados do histórico
   */
  async getContentHistory(tipo: CMSContentType): Promise<{
    data_ultima_edicao: string;
    editor: string;
  } | null> {
    return this.executeOperation('getContentHistory', async () => {
      const { data, error } = await supabase
        .from('cms_contents')
        .select('data_ultima_edicao, editor')
        .eq('tipo', tipo)
        .single();

      if (error) {
        throw error;
      }

      return data;
    });
  }

  /**
   * Sanitiza HTML para prevenir XSS
   * @param html HTML a ser sanitizado
   * @returns HTML limpo
   */
  private sanitizeHTML(html: string): string {
    // Remove scripts e outros elementos perigosos
    const sanitized = html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '');

    return sanitized;
  }

  /**
   * Valida conteúdo HTML
   * @param content Conteúdo a ser validado
   * @returns Array de erros encontrados
   */
  validateContent(content: string): string[] {
    const errors: string[] = [];

    // Verificar se contém scripts
    if (/<script/i.test(content)) {
      errors.push('Conteúdo não pode conter scripts');
    }

    // Verificar se contém iframes
    if (/<iframe/i.test(content)) {
      errors.push('Conteúdo não pode conter iframes');
    }

    // Verificar handlers de eventos
    if (/on\w+=/i.test(content)) {
      errors.push('Conteúdo não pode conter handlers de eventos JavaScript');
    }

    return errors;
  }

  /**
   * Gera preview do conteúdo
   * @param content Conteúdo HTML
   * @param maxLength Tamanho máximo do preview
   * @returns Preview em texto plano
   */
  generatePreview(content: string, maxLength: number = 150): string {
    // Remove tags HTML
    const textContent = content.replace(/<[^>]*>/g, '');
    
    // Limita tamanho e adiciona reticências
    if (textContent.length > maxLength) {
      return textContent.substring(0, maxLength) + '...';
    }

    return textContent;
  }
}

// Exporta instância singleton
export const cmsService = new CMSService();
