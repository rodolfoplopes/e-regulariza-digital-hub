import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Por que é necessário regularizar um imóvel?",
    answer: "A regularização assegura que o imóvel esteja conforme as normas legais e urbanísticas, permitindo transações legais como venda, financiamento ou herança. Também protege o proprietário contra reivindicações futuras e litígios sobre a propriedade.",
  },
  {
    question: "O que é a Reurb (Regularização Fundiária Urbana)?",
    answer: "A Reurb é o conjunto de medidas jurídicas, urbanísticas e ambientais que regulariza núcleos urbanos informais, levando titulação e acesso à infraestrutura urbana a quem já ocupa um imóvel de fato, mas não tem a documentação em dia.",
  },
  {
    question: "Qual a diferença entre Reurb-E e Reurb-S?",
    answer: "A Reurb-E (interesse específico) se aplica a ocupações em que os moradores têm condição de arcar com os custos do processo. A Reurb-S (interesse social) é voltada a núcleos ocupados predominantemente por população de baixa renda, com isenção de custas e emolumentos cartorários.",
  },
  {
    question: "O que é a Reurb Nominal?",
    answer: "É a modalidade em que a titulação é outorgada diretamente a cada ocupante, de forma individualizada, em vez de uma solução coletiva ou condominial. Indicamos essa modalidade quando é possível identificar e separar claramente a posse de cada beneficiário.",
  },
  {
    question: "O que é due diligence imobiliária e quando fazer?",
    answer: "É a análise minuciosa da documentação de um imóvel — registros, certidões, contratos — para identificar riscos e confirmar a regularidade jurídica antes de uma compra, venda ou incorporação. Recomendamos sempre antes de fechar negócio.",
  },
  {
    question: "O que é o ITCMD (ITD no Rio de Janeiro)?",
    answer: "É o imposto estadual devido na transmissão de bens por herança ou doação. No Rio de Janeiro é chamado de ITD. O pagamento é condição para o registro do imóvel em nome do herdeiro ou donatário.",
  },
  {
    question: "O que é instituição de condomínio?",
    answer: "É o ato jurídico que formaliza a divisão de um prédio ou conjunto de prédios em unidades autônomas, com áreas comuns e exclusivas definidas, viabilizando o registro individual de cada unidade.",
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
