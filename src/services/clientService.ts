
/**
 * Serviço para gerenciamento de clientes
 * @fileoverview Operações CRUD e validações para clientes
 */

import { supabase } from "@/integrations/supabase/client";
import { BaseService } from "./core/base";
import { Profile } from "./core/types";

class ClientService extends BaseService {
  constructor() {
    super('ClientService');
  }

  /**
   * Lista todos os clientes ativos
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
   * Busca cliente por CPF
   * @param cpf CPF do cliente
   * @returns Cliente encontrado ou null
   */
  async getClientByCPF(cpf: string): Promise<Profile | null> {
    return this.executeOperation(`getClientByCPF(${cpf})`, async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('cpf', cpf)
        .eq('role', 'cliente')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    });
  }

  /**
   * Busca cliente por email
   * @param email Email do cliente
   * @returns Cliente encontrado ou null
   */
  async getClientByEmail(email: string): Promise<Profile | null> {
    return this.executeOperation(`getClientByEmail(${email})`, async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .eq('role', 'cliente')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    });
  }

  /**
   * Cria novo cliente
   * @param clientData Dados do cliente
   * @returns Cliente criado ou null
   */
  async createClient(clientData: {
    name: string;
    email: string;
    cpf: string;
    phone?: string;
  }): Promise<Profile | null> {
    return this.executeOperation('createClient', async () => {
      // Verificar se CPF já existe
      const existingByCPF = await this.getClientByCPF(clientData.cpf);
      if (existingByCPF) {
        throw new Error('CPF já cadastrado no sistema');
      }

      // Verificar se email já existe
      const existingByEmail = await this.getClientByEmail(clientData.email);
      if (existingByEmail) {
        throw new Error('Email já cadastrado no sistema');
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: crypto.randomUUID(),
          name: clientData.name,
          email: clientData.email,
          cpf: clientData.cpf,
          phone: clientData.phone,
          role: 'cliente'
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
   * Atualiza dados do cliente
   * @param id ID do cliente
   * @param updates Dados para atualizar
   * @returns Cliente atualizado ou null
   */
  async updateClient(id: string, updates: Partial<Profile>): Promise<Profile | null> {
    return this.executeOperation(`updateClient(${id})`, async () => {
      // Não permitir alteração de CPF
      const { cpf, ...allowedUpdates } = updates;

      const { data, error } = await supabase
        .from('profiles')
        .update(allowedUpdates)
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
   * Valida dados de cliente
   * @param clientData Dados para validar
   * @returns Array de erros encontrados
   */
  validateClientData(clientData: Partial<Profile>): string[] {
    const errors: string[] = [];

    if (!clientData.name || clientData.name.trim().length < 3) {
      errors.push('Nome deve ter pelo menos 3 caracteres');
    }

    if (!clientData.email || !this.isValidEmail(clientData.email)) {
      errors.push('Email inválido');
    }

    if (!clientData.cpf || !this.isValidCPF(clientData.cpf)) {
      errors.push('CPF inválido');
    }

    if (clientData.phone && !this.isValidPhone(clientData.phone)) {
      errors.push('Telefone inválido');
    }

    return errors;
  }

  /**
   * Valida formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida formato de CPF
   */
  private isValidCPF(cpf: string): boolean {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    
    if (cleanCPF.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    return true;
  }

  /**
   * Valida formato de telefone
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
  }
}

export const clientService = new ClientService();
