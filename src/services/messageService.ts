
/**
 * Serviço para melhorar mensagens do sistema com tom humano
 * @fileoverview Centraliza e humaniza todas as mensagens da aplicação
 */

export const systemMessages = {
  // Mensagens de confirmação
  confirmations: {
    documentSent: "✅ Documento enviado com sucesso! Nossa equipe analisará em breve e você receberá uma notificação.",
    profileUpdated: "✅ Seus dados foram atualizados! Obrigado por manter suas informações sempre em dia.",
    messagePosted: "✅ Mensagem enviada! Nossa equipe responderá o mais breve possível.",
    processCreated: "🎉 Processo criado com sucesso! Você receberá atualizações sobre cada etapa do seu processo."
  },

  // Mensagens informativas sobre prazos
  deadlines: {
    approaching: (days: number) => 
      `⏰ Atenção: Você tem ${days} dia${days > 1 ? 's' : ''} para enviar os documentos pendentes. Não se preocupe, estamos aqui para ajudar!`,
    missed: "⚠️ Ops! O prazo venceu, mas não há problema. Entre em contato conosco para reagendar.",
    extended: (newDate: string) => 
      `📅 Boa notícia! Conseguimos estender seu prazo até ${newDate}. Aproveite este tempo extra!`
  },

  // Mensagens sobre etapas do processo
  processSteps: {
    started: (stepName: string) => 
      `🚀 Ótimo! Iniciamos a etapa "${stepName}". Você pode acompanhar o progresso em tempo real no seu painel.`,
    completed: (stepName: string) => 
      `✅ Etapa "${stepName}" concluída! Estamos um passo mais próximos da finalização do seu processo.`,
    waiting: (stepName: string) => 
      `⏳ A etapa "${stepName}" está em andamento. Nossa equipe está trabalhando no seu processo.`,
    needsAction: (action: string) => 
      `📋 Sua atenção é necessária: ${action}. Acesse sua conta para prosseguir.`
  },

  // Mensagens sobre pendências
  pendencies: {
    documentMissing: (docName: string) => 
      `📄 Precisamos do documento "${docName}" para continuar. Você pode enviá-lo diretamente pelo sistema.`,
    informationNeeded: (info: string) => 
      `❓ Para prosseguir, precisamos da seguinte informação: ${info}. Nossa equipe está à disposição para esclarecer dúvidas.`,
    paymentPending: "💳 Há uma pendência de pagamento. Acesse a área financeira para regularizar.",
    allClear: "✨ Perfeito! Todas as pendências foram resolvidas. Seu processo segue normalmente."
  },

  // Mensagens motivacionais
  motivation: {
    welcome: "Bem-vindo à e-regulariza! Estamos felizes em ajudar você nesta jornada de regularização.",
    halfwayDone: "🎯 Você já está na metade do caminho! Continue assim, estamos quase lá.",
    finalStretch: "🏁 Estamos na reta final! Em breve você terá seu processo totalmente regularizado.",
    completed: "🎉 Parabéns! Seu processo foi concluído com sucesso. Obrigado por confiar em nossos serviços."
  },

  // Mensagens de erro humanizadas
  errors: {
    fileTooBig: "😅 Ops! O arquivo é muito grande. Tente compactar ou usar um arquivo menor que 10MB.",
    invalidFormat: "📎 Este tipo de arquivo não é aceito. Use PDF, JPG ou PNG para melhor compatibilidade.",
    networkError: "🌐 Parece que há um problema de conexão. Verifique sua internet e tente novamente.",
    serverError: "🔧 Nosso sistema está passando por uma manutenção rápida. Tente novamente em alguns minutos.",
    unauthorized: "🔒 Você precisa fazer login para acessar esta área. É rapidinho!"
  },

  // Mensagens de ajuda
  help: {
    uploadTip: "💡 Dica: Para upload mais rápido, use arquivos em PDF. Fotos também são aceitas!",
    navigationTip: "🧭 Use o menu lateral para navegar entre as diferentes seções da plataforma.",
    notificationTip: "🔔 Ative as notificações para receber atualizações importantes no seu celular.",
    contactTip: "💬 Tem dúvidas? Use o chat para falar diretamente com nossa equipe!"
  }
};

/**
 * Obtém mensagem humanizada baseada no contexto
 */
export const getContextualMessage = (
  type: keyof typeof systemMessages,
  key: string,
  ...params: any[]
): string => {
  const messageGroup = systemMessages[type] as any;
  if (!messageGroup || !messageGroup[key]) {
    return 'Mensagem não encontrada';
  }

  const message = messageGroup[key];
  if (typeof message === 'function') {
    return message(...params);
  }
  
  return message;
};

/**
 * Obtém mensagem de progresso baseada na porcentagem
 */
export const getProgressMessage = (progress: number): string => {
  if (progress < 25) {
    return "🌱 Seu processo está começando. Estamos organizando tudo para você!";
  } else if (progress < 50) {
    return "🌿 Ótimo progresso! Já temos uma boa base do seu processo.";
  } else if (progress < 75) {
    return "🌳 Excelente! Estamos na metade do caminho. Continue assim!";
  } else if (progress < 100) {
    return "🏁 Quase lá! Estamos finalizando os últimos detalhes.";
  } else {
    return "🎉 Processo concluído! Parabéns por chegar até aqui.";
  }
};
