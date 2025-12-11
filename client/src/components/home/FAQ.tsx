import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "O que é usucapião?",
    answer: "Usucapião é um instituto jurídico que permite a aquisição da propriedade de um bem imóvel mediante a posse prolongada e contínua, sob certas condições. A posse deve ser pacífica, pública e ininterrupta, com um período variando conforme o tipo de usucapião, e deve estar acompanhada da intenção de ser dono do bem.",
  },
  {
    question: "Por que fazer uma usucapião?",
    answer: "Realizar uma usucapião é uma forma de legalizar a propriedade de um imóvel que já é possuído de fato por um indivíduo, mas não de direito, por falta de documentação formal ou adequada. É especialmente útil em casos onde o possuidor não possui título formal de propriedade ou o título existente possui problemas.",
  },
  {
    question: "Por que é necessário regularizar um imóvel?",
    answer: "A regularização assegura que o imóvel esteja conforme as normas legais e urbanísticas, permitindo transações legais como venda, financiamento ou herança. Também protege o proprietário contra reivindicações futuras e litígios sobre a propriedade.",
  },
  {
    question: "Quais imóveis não são passíveis de usucapião?",
    answer: "Imóveis públicos, como aqueles pertencentes ao governo municipal, estadual ou federal, não são passíveis de usucapião. Além disso, propriedades utilizadas por empresas públicas para a prestação de serviços públicos também são excluídas.",
  },
  {
    question: "Quais são os tipos de usucapião existentes?",
    answer: "Existem vários tipos de usucapião no Brasil, cada um com requisitos específicos: Usucapião Extraordinária, Usucapião Ordinária, Usucapião Especial Urbana, Usucapião Especial Rural, Usucapião de Bem Móvel, Usucapião Familiar e Usucapião Administrativa. Cada tipo atende a diferentes situações legais e sociais.",
  },
  {
    question: "O que é adjudicação compulsória?",
    answer: "É uma ação que permite a alguém obter formalmente a propriedade de um imóvel quando o vendedor se recusa a realizar a escritura pública definitiva de compra e venda, apesar de existir um contrato que estipula a transferência. É um recurso jurídico usado para forçar a transferência da propriedade ao comprador.",
  },
  {
    question: "Qual a diferença entre adjudicação compulsória e usucapião?",
    answer: "A usucapião baseia-se na posse prolongada do imóvel sob certas condições, enquanto a adjudicação compulsória é baseada em um contrato de compra e venda. A adjudicação é geralmente mais direta quando há documentos claros e um acordo prévio, enquanto a usucapião pode ser mais complexa e demorada.",
  },
  {
    question: "Quem pode requerer a usucapião e para que serve?",
    answer: "O indivíduo que exerça posse mansa, pacífica e ininterrupta de um imóvel pode requerer a usucapião. Este instituto jurídico serve para regularizar a situação registral de um imóvel quando o possuidor, não sendo o titular de domínio registrado, busca reconhecer e formalizar sua propriedade.",
  },
  {
    question: "Possuo um imóvel que foi objeto de usucapião, posso usucapir outro?",
    answer: "Sim, a lei não impede que uma pessoa que já tenha adquirido um imóvel por usucapião adquira outro da mesma forma, desde que cumpra os requisitos legais, como o prazo prescricional de posse que varia de 5 a 15 anos, dependendo do caso específico, e a função social do imóvel.",
  },
  {
    question: "Posso usucapir apenas uma parte do terreno?",
    answer: "Sim, é possível usucapir apenas uma fração do terreno, desde que você detenha a posse exclusiva e incontestada dessa parte específica. A usucapião de parte de um imóvel é comum em situações onde múltiplos indivíduos possuem diferentes partes de um mesmo terreno.",
  },
  {
    question: "O proprietário do imóvel que comprei faleceu, posso usucapir?",
    answer: "Neste caso, a usucapião não é o procedimento apropriado. Em vez disso, deve-se iniciar um processo de inventário para tratar da sucessão dos bens do falecido. A abertura de inventário é essencial para resolver as questões de propriedade e garantir o recolhimento de impostos devidos.",
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
