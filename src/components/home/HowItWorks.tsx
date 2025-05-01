
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Cadastro e Diagnóstico",
      description: "Crie sua conta e obtenha um diagnóstico inicial do seu caso com base em seus dados."
    },
    {
      number: "02",
      title: "Documentação Digital",
      description: "Faça o upload de todos os documentos necessários através da plataforma de forma prática."
    },
    {
      number: "03",
      title: "Acompanhamento em Tempo Real",
      description: "Acompanhe cada etapa do processo com notificações em tempo real e atualizações constantes."
    },
    {
      number: "04",
      title: "Documentos Regularizados",
      description: "Receba seus documentos regularizados de forma digital e segura através da plataforma."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Como funciona
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Um processo simplificado e transparente, do início ao fim
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-lg shadow-sm border p-6 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <span className="text-3xl font-bold text-eregulariza-primary">{step.number}</span>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute left-full top-8 w-12 h-0.5 bg-gray-200 -ml-6 -mr-6 transform translate-x-1/2" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm flex-grow">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="eregulariza-gradient hover:opacity-90">
            <Link to="/register">
              Comece seu processo
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
