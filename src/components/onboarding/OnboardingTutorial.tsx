
import { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

interface OnboardingTutorialProps {
  isOpen: boolean;
  onComplete: () => void;
}

const steps: Step[] = [
  {
    target: '.dashboard-welcome',
    content: 'Bem-vindo ao seu painel! Aqui você encontra todas as informações sobre seus processos.',
    title: 'Painel Principal',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '.sidebar-navigation',
    content: 'Use o menu lateral para navegar entre as diferentes seções da plataforma.',
    title: 'Menu de Navegação',
    placement: 'right',
  },
  {
    target: '.process-card',
    content: 'Cada cartão representa um processo. Clique para ver detalhes e acompanhar o progresso.',
    title: 'Cartões de Processo',
    placement: 'top',
  },
];

export default function OnboardingTutorial({ isOpen, onComplete }: OnboardingTutorialProps) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM elements are rendered
      setTimeout(() => {
        setRun(true);
      }, 500);
    }
  }, [isOpen]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      onComplete();
    }
  };

  if (!isOpen) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#06D7A5',
          zIndex: 10000,
        },
        tooltip: {
          fontSize: 16,
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#06D7A5',
          color: 'white',
        },
        buttonBack: {
          marginRight: 10,
        },
      }}
      locale={{
        back: 'Voltar',
        close: 'Fechar',
        last: 'Finalizar',
        next: 'Próximo',
        skip: 'Pular',
      }}
    />
  );
}
