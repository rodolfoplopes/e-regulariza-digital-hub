
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "Quanto tempo leva para regularizar meu imóvel?",
      answer: "O tempo de regularização varia conforme o tipo de processo e a complexidade do caso. Com nossa plataforma digital, você terá visibilidade sobre cada etapa e estimativas de prazos atualizadas em tempo real."
    },
    {
      question: "Quais documentos são necessários para iniciar o processo?",
      answer: "Os documentos necessários dependem do tipo de regularização. Após o cadastro inicial, nossa plataforma indicará exatamente quais documentos você precisa enviar, e você poderá fazer o upload diretamente pelo sistema."
    },
    {
      question: "Como acompanho o andamento do meu processo?",
      answer: "Através da nossa plataforma digital, você terá acesso a um painel personalizado onde poderá visualizar o status atualizado do seu processo, as etapas concluídas e as próximas ações, além de receber notificações sobre atualizações importantes."
    },
    {
      question: "Consigo falar diretamente com a equipe que está cuidando do meu processo?",
      answer: "Sim! Nossa plataforma possui um sistema de mensagens integrado onde você pode se comunicar diretamente com nossos especialistas, tirar dúvidas e solicitar informações adicionais a qualquer momento."
    },
    {
      question: "O processo de regularização é 100% digital?",
      answer: "Trabalhamos para que a maior parte do processo seja digital, desde o envio de documentos até a comunicação com nossa equipe. Em alguns casos específicos, pode ser necessário algum procedimento presencial, mas sempre buscamos minimizar a necessidade de deslocamentos."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Perguntas frequentes
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Tire suas dúvidas sobre o processo de regularização
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-500">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
