import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Cadastro e Diagnóstico",
    description: "Crie sua conta e obtenha um diagnóstico inicial do seu caso com base em seus dados.",
  },
  {
    number: "02",
    title: "Documentação Digital",
    description: "Faça o upload de todos os documentos necessários através da plataforma de forma prática.",
  },
  {
    number: "03",
    title: "Acompanhamento em Tempo Real",
    description: "Acompanhe cada etapa do processo com notificações em tempo real e atualizações constantes.",
  },
  {
    number: "04",
    title: "Documentos Regularizados",
    description: "Receba seus documentos regularizados de forma digital e segura através da plataforma.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24" data-testid="section-how-it-works">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-how-title">Como funciona</h2>
          <p className="text-muted-foreground" data-testid="text-how-subtitle">
            Um processo simplificado e transparente, do início ao fim
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center" data-testid={`step-${index}`}>
              <div className="text-5xl font-bold text-primary/20 mb-4" data-testid={`step-number-${index}`}>
                {step.number}
              </div>
              <h3 className="font-semibold text-lg mb-2" data-testid={`step-title-${index}`}>{step.title}</h3>
              <p className="text-sm text-muted-foreground" data-testid={`step-desc-${index}`}>{step.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link to="/register" data-testid="link-start-process">
              Comece seu processo
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
