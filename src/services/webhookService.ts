
/**
 * Serviço para gerenciamento de webhooks e integrações
 * @fileoverview Handles webhook calls and external integrations
 */

import { supabase } from "@/integrations/supabase/client";
import { BaseService } from "./core/base";
import { WebhookPayload, AutomationConfig } from "./core/types";

class WebhookService extends BaseService {
  constructor() {
    super('WebhookService');
  }

  /**
   * Envia dados para HubSpot
   * @param data Dados a serem enviados
   * @returns Success status
   */
  async sendToHubSpot(data: any): Promise<boolean> {
    return this.executeBooleanOperation(
      'sendToHubSpot',
      async () => {
        const { data: response, error } = await supabase.functions.invoke('hubspot-integration', {
          body: { data, action: 'sync' }
        });

        if (error) throw error;
        return response;
      }
    );
  }

  /**
   * Envia dados para Google Sheets
   * @param data Dados a serem enviados
   * @returns Success status
   */
  async sendToGoogleSheets(data: any): Promise<boolean> {
    return this.executeBooleanOperation(
      'sendToGoogleSheets',
      async () => {
        const { data: response, error } = await supabase.functions.invoke('sheets-integration', {
          body: { data, action: 'append' }
        });

        if (error) throw error;
        return response;
      }
    );
  }

  /**
   * Envia webhook genérico
   * @param url URL do webhook
   * @param payload Dados a serem enviados
   * @returns Success status
   */
  async sendWebhook(url: string, payload: WebhookPayload): Promise<boolean> {
    return this.executeBooleanOperation(
      `sendWebhook(${url})`,
      async () => {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Webhook failed: ${response.status}`);
        }

        return true;
      }
    );
  }

  /**
   * Busca configurações de automação
   * @returns Configurações atuais
   */
  async getAutomationConfig(): Promise<AutomationConfig | null> {
    return this.executeOperation(
      'getAutomationConfig',
      async () => {
        const { data, error } = await supabase
          .from('system_settings')
          .select('key, value')
          .in('key', [
            'hubspot_enabled',
            'hubspot_api_key',
            'hubspot_sync_contacts',
            'hubspot_sync_deals',
            'sheets_enabled',
            'sheets_spreadsheet_id',
            'sheets_sync_processes',
            'sheets_auto_export',
            'notifications_sms',
            'notifications_email',
            'notifications_webhook'
          ]);

        if (error) throw error;

        const settings = data.reduce((acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {} as Record<string, string>);

        return {
          hubspot: {
            enabled: settings.hubspot_enabled === 'true',
            apiKey: settings.hubspot_api_key,
            syncContacts: settings.hubspot_sync_contacts === 'true',
            syncDeals: settings.hubspot_sync_deals === 'true'
          },
          googleSheets: {
            enabled: settings.sheets_enabled === 'true',
            spreadsheetId: settings.sheets_spreadsheet_id,
            syncProcesses: settings.sheets_sync_processes === 'true',
            autoExport: settings.sheets_auto_export === 'true'
          },
          notifications: {
            sms: settings.notifications_sms === 'true',
            email: settings.notifications_email === 'true',
            webhook: settings.notifications_webhook === 'true'
          }
        };
      }
    );
  }

  /**
   * Atualiza configurações de automação
   * @param config Novas configurações
   * @returns Success status
   */
  async updateAutomationConfig(config: AutomationConfig): Promise<boolean> {
    return this.executeBooleanOperation(
      'updateAutomationConfig',
      async () => {
        const settings = [
          { key: 'hubspot_enabled', value: config.hubspot.enabled.toString() },
          { key: 'hubspot_api_key', value: config.hubspot.apiKey || '' },
          { key: 'hubspot_sync_contacts', value: config.hubspot.syncContacts.toString() },
          { key: 'hubspot_sync_deals', value: config.hubspot.syncDeals.toString() },
          { key: 'sheets_enabled', value: config.googleSheets.enabled.toString() },
          { key: 'sheets_spreadsheet_id', value: config.googleSheets.spreadsheetId || '' },
          { key: 'sheets_sync_processes', value: config.googleSheets.syncProcesses.toString() },
          { key: 'sheets_auto_export', value: config.googleSheets.autoExport.toString() },
          { key: 'notifications_sms', value: config.notifications.sms.toString() },
          { key: 'notifications_email', value: config.notifications.email.toString() },
          { key: 'notifications_webhook', value: config.notifications.webhook.toString() }
        ];

        for (const setting of settings) {
          const { error } = await supabase
            .from('system_settings')
            .upsert(setting);

          if (error) throw error;
        }

        return true;
      }
    );
  }
}

export const webhookService = new WebhookService();
