
import FAQSearch from "@/components/faq/FAQSearch";

export default function FAQ() {
  const faqs = [
    {
      id: "1",
      question: "O que é usucapião?",
      answer: "Usucapião é um instituto jurídico que permite a aquisição da propriedade de um bem imóvel mediante a posse prolongada e contínua, sob certas condições. A posse deve ser pacífica, pública e ininterrupta, com um período variando conforme o tipo de usucapião, e deve estar acompanhada da intenção de ser dono do bem.",
      category: "Usucapião",
      tags: ["usucapião", "propriedade", "posse"]
    },
    {
      id: "2",
      question: "Por que fazer uma usucapião?",
      answer: "Realizar uma usucapião é uma forma de legalizar a propriedade de um imóvel que já é possuído de fato por um indivíduo, mas não de direito, por falta de documentação formal ou adequada. É especialmente útil em casos onde o possuidor não possui título formal de propriedade ou o título existente possui problemas.",
      category: "Usucapião",
      tags: ["legalização", "propriedade", "documentação"]
    },
    {
      id: "3",
      question: "Por que é necessário regularizar um imóvel?",
      answer: "A regularização assegura que o imóvel esteja conforme as normas legais e urbanísticas, permitindo transações legais como venda, financiamento ou herança. Também protege o proprietário contra reivindicações futuras e litígios sobre a propriedade.",
      category: "Regularização",
      tags: ["regularização", "normas", "transações"]
    },
    {
      id: "4",
      question: "O que acontece se não regularizar o imóvel?",
      answer: "Não regularizar um imóvel pode resultar em uma série de complicações legais, como impedimentos em vendas ou financiamentos, multas, e até ações judiciais. Além disso, o proprietário pode enfrentar dificuldades em realizar melhorias ou construções no imóvel.",
      category: "Regularização",
      tags: ["consequências", "problemas", "multas"]
    },
    {
      id: "5",
      question: "Qualquer imóvel pode ser desmembrado?",
      answer: "Não todos; o desmembramento de um imóvel depende de normas urbanísticas locais, que podem incluir limitações sobre o tamanho mínimo dos lotes e a necessidade de infraestrutura adequada. Imóveis em áreas protegidas ou de preservação também podem ter restrições adicionais.",
      category: "Desmembramento",
      tags: ["desmembramento", "normas", "lotes"]
    },
    {
      id: "6",
      question: "Quais imóveis não são passíveis de usucapião?",
      answer: "Imóveis públicos, como aqueles pertencentes ao governo municipal, estadual ou federal, não são passíveis de usucapião. Além disso, propriedades utilizadas por empresas públicas para a prestação de serviços públicos também são excluídas.",
      category: "Usucapião",
      tags: ["limitações", "imóveis públicos", "restrições"]
    },
    {
      id: "7",
      question: "O que significa RGI?",
      answer: "RGI significa Registro Geral de Imóveis. É o documento oficial emitido pelo cartório de registro de imóveis que contém todas as informações pertinentes sobre um imóvel, incluindo a identificação do proprietário, a localização, descrição detalhada, e o histórico de todas as transações e alterações jurídicas associadas ao imóvel.",
      category: "Documentação",
      tags: ["RGI", "registro", "cartório"]
    },
    {
      id: "8",
      question: "Quais são os tipos de usucapião existentes?",
      answer: "Existem vários tipos de usucapião no Brasil, cada um com requisitos específicos. Aqui estão os principais: Usucapião Extraordinária; Usucapião Ordinária; Usucapião Especial Urbana; Usucapião Especial Rural; Usucapião de Bem Móvel; Usucapião Familiar; Usucapião Administrativa. Cada tipo de usucapião atende a diferentes situações legais e sociais, facilitando a regularização de posses longevas onde não existe oposição clara ou onde há interesse social evidente em resolver a questão da propriedade de forma pacífica e eficiente.",
      category: "Usucapião",
      tags: ["tipos", "modalidades", "requisitos"]
    },
    {
      id: "9",
      question: "O que é adjudicação compulsória?",
      answer: "É uma ação que permite a alguém obter formalmente a propriedade de um imóvel quando o vendedor se recusa a realizar a escritura pública definitiva de compra e venda, apesar de existir um contrato que estipula a transferência. É um recurso jurídico usado para forçar a transferência da propriedade ao comprador.",
      category: "Adjudicação",
      tags: ["adjudicação", "compra e venda", "transferência"]
    },
    {
      id: "10",
      question: "Qual a diferença entre adjudicação compulsória e usucapião?",
      answer: "A usucapião baseia-se na posse prolongada do imóvel sob certas condições, enquanto a adjudicação compulsória é baseada em um contrato de compra e venda. A adjudicação é geralmente mais direta quando há documentos claros e um acordo prévio, enquanto a usucapião pode ser mais complexa e demorada.",
      category: "Comparação",
      tags: ["diferenças", "adjudicação", "usucapião"]
    },
    {
      id: "11",
      question: "Por que fazer uma instituição de condomínio?",
      answer: "A instituição de condomínio é um processo importante por várias razões, principalmente quando se trata de propriedades divididas em unidades autônomas, como prédios de apartamentos ou complexos de escritórios. Aqui estão alguns dos principais motivos para formalizar um condomínio: Legalidade e Organização; Gestão dos Espaços Comuns; Regularidade Financeira; Resolução de Conflitos; Valorização do Imóvel; Segurança Jurídica. Portanto, instituir um condomínio é uma etapa crucial para garantir que a gestão e manutenção de propriedades com múltiplas unidades sejam eficazes, transparentes e conformes à legislação, beneficiando todos os envolvidos.",
      category: "Condomínio",
      tags: ["condomínio", "organização", "gestão"]
    },
    {
      id: "12",
      question: "Quem pode requerer a usucapião e para que serve?",
      answer: "O indivíduo que exerça posse mansa, pacífica e ininterrupta de um imóvel pode requerer a usucapião. Este instituto jurídico serve para regularizar a situação registral de um imóvel quando o possuidor, não sendo o titular de domínio registrado, busca reconhecer e formalizar sua propriedade. A usucapião é particularmente útil quando os titulares de domínio estão ausentes ou desconhecidos, facilitando assim a transferência legal da propriedade ao possuidor.",
      category: "Usucapião",
      tags: ["requisitos", "posse", "regularização"]
    },
    {
      id: "13",
      question: "Possuo um imóvel que foi objeto de usucapião, posso usucapir outro?",
      answer: "Sim, a lei não impede que uma pessoa que já tenha adquirido um imóvel por usucapião adquira outro da mesma forma, desde que cumpra os requisitos legais, como o prazo prescricional de posse que varia de 5 a 15 anos, dependendo do caso específico, e a função social do imóvel.",
      category: "Usucapião",
      tags: ["múltiplas", "requisitos", "prazos"]
    },
    {
      id: "14",
      question: "Posso usucapir apenas uma parte do terreno?",
      answer: "Sim, é possível usucapir apenas uma fração do terreno, desde que você detenha a posse exclusiva e incontestada dessa parte específica. A usucapião de parte de um imóvel é comum em situações onde múltiplos indivíduos possuem diferentes partes de um mesmo terreno.",
      category: "Usucapião",
      tags: ["parte", "fração", "posse exclusiva"]
    },
    {
      id: "15",
      question: "Comprar um imóvel que foi usucapido não me trará problemas com o antigo proprietário?",
      answer: "Em geral, a compra de um imóvel usucapido é segura após a finalização do processo de usucapião, que inclui a notificação dos proprietários anteriores e confrontantes. Contudo, é fundamental verificar se o processo foi concluído corretamente e se o título de propriedade foi devidamente registrado no cartório de registro de imóveis.",
      category: "Compra e Venda",
      tags: ["compra", "segurança", "verificação"]
    },
    {
      id: "16",
      question: "Comprei um terreno há pouco mais de 1 (um) ano, mas a pessoa que me vendeu está no imóvel há muito tempo. Posso requerer a usucapião?",
      answer: "Sim, é possível requerer a usucapião por meio da soma das posses (sua e do vendedor anterior), se o total atingir o período prescricional necessário (geralmente 10 ou 15 anos) e se a posse foi contínua, pacífica e sem oposição. Isso é conhecido como \"posse derivada\" e pode ser utilizada para fundamentar um pedido de usucapião.",
      category: "Usucapião",
      tags: ["soma de posses", "posse derivada", "continuidade"]
    },
    {
      id: "17",
      question: "O proprietário do imóvel que comprei faleceu, posso usucapir?",
      answer: "Neste caso, a usucapião não é o procedimento apropriado. Em vez disso, deve-se iniciar um processo de inventário para tratar da sucessão dos bens do falecido. A abertura de inventário é essencial para resolver as questões de propriedade e garantir o recolhimento de impostos devidos (como o ITCMD). A transmissão da propriedade só pode ocorrer legalmente após a conclusão do inventário.",
      category: "Inventário",
      tags: ["inventário", "sucessão", "falecimento"]
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

        <div className="max-w-4xl mx-auto">
          <FAQSearch faqs={faqs} />
        </div>
      </div>
    </section>
  );
}
