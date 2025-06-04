
/**
 * Classe base para todos os serviços
 * @fileoverview Fornece funcionalidades comuns para tratamento de erros e logging
 */

export abstract class BaseService {
  protected serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * Loga erro de forma padronizada
   * @param operation Nome da operação que falhou
   * @param error Erro capturado
   * @param details Detalhes adicionais para debug
   */
  protected logError(operation: string, error: any, details?: any): void {
    console.error(`[${this.serviceName}] ${operation} failed:`, {
      error: error?.message || error,
      details,
      timestamp: new Date().toISOString(),
      service: this.serviceName
    });
  }

  /**
   * Loga informação de sucesso
   * @param operation Nome da operação realizada
   * @param details Detalhes da operação
   */
  protected logSuccess(operation: string, details?: any): void {
    console.log(`[${this.serviceName}] ${operation} completed successfully`, {
      details,
      timestamp: new Date().toISOString(),
      service: this.serviceName
    });
  }

  /**
   * Wrapper para operações que podem falhar
   * @param operation Nome da operação
   * @param fn Função a ser executada
   * @returns Resultado da operação ou null em caso de erro
   */
  protected async executeOperation<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T | null> {
    try {
      const result = await fn();
      this.logSuccess(operation);
      return result;
    } catch (error) {
      this.logError(operation, error);
      return null;
    }
  }

  /**
   * Wrapper para operações que retornam arrays
   * @param operation Nome da operação
   * @param fn Função a ser executada
   * @returns Array de resultados ou array vazio em caso de erro
   */
  protected async executeArrayOperation<T>(
    operation: string,
    fn: () => Promise<T[]>
  ): Promise<T[]> {
    try {
      const result = await fn();
      this.logSuccess(operation, { count: result.length });
      return result;
    } catch (error) {
      this.logError(operation, error);
      return [];
    }
  }

  /**
   * Wrapper para operações booleanas
   * @param operation Nome da operação
   * @param fn Função a ser executada
   * @returns true em caso de sucesso, false em caso de erro
   */
  protected async executeBooleanOperation(
    operation: string,
    fn: () => Promise<any>
  ): Promise<boolean> {
    try {
      await fn();
      this.logSuccess(operation);
      return true;
    } catch (error) {
      this.logError(operation, error);
      return false;
    }
  }
}
