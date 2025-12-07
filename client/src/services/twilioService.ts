
// Twilio service structure - requires backend implementation
export interface TwilioConfig {
  accountSid?: string;
  authToken?: string;
  phoneNumber?: string;
  enabled: boolean;
}

export interface SMSTemplate {
  id: string;
  name: string;
  message: string;
  variables: string[];
}

export const smsTemplates: SMSTemplate[] = [
  {
    id: 'welcome',
    name: 'Mensagem de Boas-vindas',
    message: 'Bem-vindo(a) à e-regulariza, {nome}! Sua senha temporária é: {senha}. Acesse: {link}',
    variables: ['nome', 'senha', 'link']
  },
  {
    id: 'process_completed',
    name: 'Processo Concluído',
    message: 'Parabéns {nome}! Seu processo "{processo}" foi concluído com sucesso. Acesse sua conta para mais detalhes.',
    variables: ['nome', 'processo']
  },
  {
    id: 'cartorio_entry',
    name: 'Entrada em Cartório',
    message: 'Olá {nome}, seu processo "{processo}" deu entrada no cartório. Protocolo: {protocolo}',
    variables: ['nome', 'processo', 'protocolo']
  }
];

export class TwilioService {
  private config: TwilioConfig;

  constructor(config: TwilioConfig) {
    this.config = config;
  }

  // This would need to be implemented in the backend with actual Twilio SDK
  async sendSMS(to: string, templateId: string, variables: Record<string, string>): Promise<boolean> {
    if (!this.config.enabled) {
      console.log('Twilio não está habilitado');
      return false;
    }

    const template = smsTemplates.find(t => t.id === templateId);
    if (!template) {
      console.error('Template não encontrado:', templateId);
      return false;
    }

    let message = template.message;
    template.variables.forEach(variable => {
      if (variables[variable]) {
        message = message.replace(`{${variable}}`, variables[variable]);
      }
    });

    console.log('SMS seria enviado para:', to, 'Mensagem:', message);
    
    // TODO: Implement actual Twilio API call in backend
    // This requires backend integration with Twilio
    return true;
  }

  async sendWelcomeSMS(userPhone: string, userName: string, tempPassword: string, loginLink: string) {
    return this.sendSMS(userPhone, 'welcome', {
      nome: userName,
      senha: tempPassword,
      link: loginLink
    });
  }

  async sendProcessCompletedSMS(userPhone: string, userName: string, processTitle: string) {
    return this.sendSMS(userPhone, 'process_completed', {
      nome: userName,
      processo: processTitle
    });
  }

  async sendCartorioEntrySMS(userPhone: string, userName: string, processTitle: string, protocol: string) {
    return this.sendSMS(userPhone, 'cartorio_entry', {
      nome: userName,
      processo: processTitle,
      protocolo: protocol
    });
  }
}
