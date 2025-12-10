import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Quanto tempo leva para regularizar meu imóvel?",
    answer: "O tempo varia de acordo com o tipo de regularização e a complexidade do caso. Em média, processos simples podem levar de 3 a 6 meses, enquanto casos mais complexos como usucapião podem levar de 1 a 2 anos. Através da nossa plataforma, você acompanha cada etapa em tempo real.",
  },
  {
    question: "Quais documentos são necessários para iniciar o processo?",
    answer: "Os documentos básicos incluem: documento de identidade, comprovante de residência, matrícula do imóvel (se houver), planta do imóvel, e comprovantes de posse. Nossa equipe fará uma análise inicial e indicará todos os documentos específicos necessários para seu caso.",
  },
  {
    question: "Como acompanho o andamento do meu processo?",
    answer: "Através da nossa plataforma digital, você tem acesso a um painel completo com todas as informações do seu processo. Você recebe notificações a cada atualização e pode verificar o status, prazos e próximos passos a qualquer momento.",
  },
  {
    question: "Consigo falar diretamente com a equipe que está cuidando do meu processo?",
    answer: "Sim! Nossa plataforma conta com um sistema de mensagens integrado onde você pode se comunicar diretamente com os especialistas responsáveis pelo seu caso. Respondemos em até 24 horas úteis.",
  },
  {
    question: "O processo de regularização é 100% digital?",
    answer: "Grande parte do processo é digital, incluindo envio de documentos, acompanhamento e comunicação. Porém, algumas etapas podem exigir presença física em cartórios ou órgãos públicos. Nesses casos, orientamos você sobre todos os procedimentos necessários.",
  },
];

export function FAQ() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground">
            Tire suas dúvidas sobre o processo de regularização
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} data-testid={`faq-item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
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
