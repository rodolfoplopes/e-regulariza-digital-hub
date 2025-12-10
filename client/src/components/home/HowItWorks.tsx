import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    title: "Solicite um Orçamento",
    description: "Preencha nosso formulário em poucos minutos.",
  },
  {
    title: "Análise de Viabilidade",
    description: "Avaliação do seu caso e preparação inicial do processo.",
  },
  {
    title: "Reunião com Consultor",
    description: "Realização de uma reunião presencial ou online.",
  },
  {
    title: "Contrato do Serviço",
    description: "A partir da aprovação do orçamento, elaboramos o contrato de serviço.",
  },
  {
    title: "Desenvolvimento",
    description: "Desenvolvemos o processo mantendo você informado em cada passo.",
  },
  {
    title: "Conclusão",
    description: "Tudo pronto e legalizado, você recebe a documentação da sua propriedade.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24" data-testid="section-how-it-works">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-how-title">
            Por que escolher a e-regulariza?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-how-subtitle">
            Simplificamos o processo de legalização do seu imóvel para que você tenha uma experiência tranquila e eficiente. Veja como funciona:
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="border shadow-sm" data-testid={`step-${index}`}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-[#4318FF]" data-testid={`step-title-${index}`}>
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground" data-testid={`step-desc-${index}`}>
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
