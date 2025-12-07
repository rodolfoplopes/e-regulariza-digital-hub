/**
 * Serviço para gerenciamento de perfis de usuário
 * @fileoverview Operações CRUD e validações para perfis de usuários
 */

import { supabase } from "@/integrations/supabase/client";
import { BaseService } from "./core/base";
import { Profile, CreateClientData } from "./core/types";
import { sanitizeForStorage } from "@/utils/sanitization";

class ProfileService extends BaseService {
  constructor() {
    super('ProfileService');
  }

  /**
   * Obtém o perfil do usuário logado
   * @returns Perfil do usuário ou null se não encontrado
   */
  async getCurrentProfile(): Promise<Profile | null> {
    return this.executeOperation('getCurrentProfile', async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    });
  }

  /**
   * Atualiza dados do perfil do usuário
   * @param id ID do usuário
   * @param updates Dados a serem atualizados
   * @returns Perfil atualizado ou null se erro
   */
  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | null> {
    return this.executeOperation('updateProfile', async () => {
      // Sanitize all text inputs before updating
      const sanitizedUpdates = {
        ...updates,
        ...(updates.name && { name: sanitizeForStorage(updates.name) }),
        ...(updates.email && { email: sanitizeForStorage(updates.email) }),
        ...(updates.phone && { phone: sanitizeForStorage(updates.phone) }),
        ...(updates.cpf && { cpf: sanitizeForStorage(updates.cpf) })
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(sanitizedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    });
  }

  /**
   * Lista todos os clientes cadastrados
   * @returns Array de perfis com role 'cliente'
   */
  async getClients(): Promise<Profile[]> {
    return this.executeArrayOperation('getClients', async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'cliente')
        .order('name');

      if (error) {
        throw error;
      }

      return data || [];
    });
  }

  /**
   * Cria um novo cliente
   * @param clientData Dados do cliente a ser criado
   * @returns Perfil criado ou null se erro
   */
  async createClient(clientData: CreateClientData): Promise<Profile | null> {
    return this.executeOperation('createClient', async () => {
      // Sanitize all text inputs before creating
      const sanitizedClientData = {
        ...clientData,
        name: sanitizeForStorage(clientData.name),
        email: sanitizeForStorage(clientData.email),
        ...(clientData.phone && { phone: sanitizeForStorage(clientData.phone) }),
        ...(clientData.cpf && { cpf: sanitizeForStorage(clientData.cpf) })
      };

      // Validações básicas
      if (!sanitizedClientData.email || !sanitizedClientData.name) {
        throw new Error('Email e nome são obrigatórios');
      }

      // Verificar se email já existe
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', sanitizedClientData.email)
        .single();

      if (existingUser) {
        throw new Error('Email já cadastrado no sistema');
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          ...sanitizedClientData,
          id: crypto.randomUUID(),
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
   * Busca perfil por ID
   * @param id ID do perfil
   * @returns Perfil encontrado ou null
   */
  async getProfileById(id: string): Promise<Profile | null> {
    return this.executeOperation('getProfileById', async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    });
  }

  /**
   * Desativa um usuário (soft delete)
   * @param id ID do usuário
   * @returns true se sucesso, false se erro
   */
  async deactivateUser(id: string): Promise<boolean> {
    return this.executeBooleanOperation('deactivateUser', async () => {
      // Como não temos campo 'active', vamos usar um role especial
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'inactive' })
        .eq('id', id);

      if (error) {
        throw error;
      }
    });
  }

  /**
   * Valida dados de perfil
   * @param profileData Dados a serem validados
   * @returns Array de erros encontrados
   */
  validateProfileData(profileData: Partial<Profile>): string[] {
    const errors: string[] = [];

    if (profileData.email && !this.isValidEmail(profileData.email)) {
      errors.push('Email inválido');
    }

    if (profileData.cpf && !this.isValidCPF(profileData.cpf)) {
      errors.push('CPF inválido');
    }

    if (profileData.phone && !this.isValidPhone(profileData.phone)) {
      errors.push('Telefone inválido');
    }

    return errors;
  }

  /**
   * Valida formato de email
   * @param email Email a ser validado
   * @returns true se válido
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida formato de CPF
   * @param cpf CPF a ser validado
   * @returns true se válido
   */
  private isValidCPF(cpf: string): boolean {
    // Remove formatação
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cleanCPF.length !== 11) return false;
    
    // Verifica se não são todos números iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Validação básica (algoritmo completo seria mais complexo)
    return true;
  }

  /**
   * Valida formato de telefone
   * @param phone Telefone a ser validado
   * @returns true se válido
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
  }
}

// Exporta instância singleton
export const profileService = new ProfileService();
