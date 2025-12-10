import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Quanto tempo leva para regularizar meu imóvel?",
    answer: "O tempo varia conforme a complexidade do caso. Através da nossa plataforma, você acompanha cada etapa em tempo real.",
  },
  {
    question: "Quais documentos são necessários para iniciar o processo?",
    answer: "Nossa equipe fará uma análise inicial e indicará todos os documentos específicos necessários para seu caso.",
  },
  {
    question: "Como acompanho o andamento do meu processo?",
    answer: "Através da nossa plataforma digital, você tem acesso a um painel completo com todas as informações do seu processo.",
  },
  {
    question: "Consigo falar diretamente com a equipe que está cuidando do meu processo?",
    answer: "Sim! Nossa plataforma conta com um sistema de mensagens integrado onde você pode se comunicar diretamente com os especialistas.",
  },
  {
    question: "O processo de regularização é 100% digital?",
    answer: "Grande parte do processo é digital. Algumas etapas podem exigir presença física, e nesses casos orientamos você sobre os procedimentos.",
  },
];

export function FAQ() {
  return (
    <section className="py-16 md:py-24" data-testid="section-faq">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-faq-title">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground" data-testid="text-faq-subtitle">
            Tire suas dúvidas sobre o processo de regularização
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} data-testid={`faq-item-${index}`}>
                <AccordionTrigger className="text-left" data-testid={`faq-question-${index}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid={`faq-answer-${index}`}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
