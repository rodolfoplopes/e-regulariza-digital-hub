
import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const tutorialSteps: Step[] = [
  {
    target: '.dashboard-welcome',
    content: 'Bem-vindo à e-regulariza! Este é seu painel principal onde você pode acompanhar todos os seus processos.',
    title: 'Painel Principal',
    placement: 'bottom'
  },
  {
    target: '.process-card',
    content: 'Aqui você vê seus processos ativos. Clique em qualquer processo para ver detalhes completos.',
    title: 'Seus Processos',
    placement: 'top'
  },
  {
    target: '.notifications-button',
    content: 'As notificações mantêm você informado sobre atualizações importantes nos seus processos.',
    title: 'Notificações',
    placement: 'bottom'
  },
  {
    target: '.sidebar-navigation',
    content: 'Use a navegação lateral para acessar diferentes seções da plataforma.',
    title: 'Navegação',
    placement: 'right'
  }
];

interface OnboardingTutorialProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function OnboardingTutorial({ isOpen, onComplete }: OnboardingTutorialProps) {
  const [runTutorial, setRunTutorial] = useState(false);
  const { profile } = useSupabaseAuth();

  useEffect(() => {
    if (isOpen) {
      setRunTutorial(true);
    }
  }, [isOpen]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTutorial(false);
      onComplete();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Joyride
        steps={tutorialSteps}
        run={runTutorial}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#06D7A5',
            textColor: '#333',
            backgroundColor: '#fff',
            arrowColor: '#fff',
            overlayColor: 'rgba(0, 0, 0, 0.4)',
          }
        }}
        locale={{
          back: 'Voltar',
          close: 'Fechar',
          last: 'Finalizar',
          next: 'Próximo',
          skip: 'Pular tutorial'
        }}
      />
      
      {/* Welcome Modal */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>Bem-vindo à e-regulariza!</CardTitle>
            <CardDescription>
              Olá {profile?.name}! Vamos fazer um tour rápido pela plataforma para você conhecer as principais funcionalidades.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Este tutorial levará apenas alguns minutos e vai ajudar você a aproveitar melhor nossa plataforma.
            </p>
            <div className="flex space-x-2">
              <Button 
                onClick={() => setRunTutorial(true)}
                className="eregulariza-gradient flex-1"
              >
                Iniciar tour
              </Button>
              <Button 
                variant="outline" 
                onClick={onComplete}
                className="flex-1"
              >
                Pular
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
