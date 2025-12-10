import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    category: "Judicial",
    title: "Adjudicação Compulsória",
    description: "A adjudicação compulsória é um procedimento judicial que garante ao comprador de um imóvel a transferência formal da propriedade quando o vendedor se recusa ou está impossibilitado de lavrar a escritura definitiva, mesmo após o pagamento total do valor acordado.",
  },
  {
    category: "Contratos",
    title: "Contrato de Compra e Venda",
    description: "Este serviço formaliza contratos de compra e venda de imóveis, garantindo a segurança jurídica da transação. Inclui a elaboração do documento e seu registro em cartório para efetivar a transferência de propriedade.",
  },
  {
    category: "Condomínio",
    title: "Convenção de Condomínio",
    description: "A convenção de condomínio é o documento que estabelece as regras de convivência, administração e uso das áreas comuns e privativas de um condomínio. Esse serviço envolve a elaboração e registro do documento, garantindo conformidade legal e organização do empreendimento.",
  },
  {
    category: "Consultoria",
    title: "Due Diligence",
    description: "A due diligence imobiliária consiste na análise minuciosa de documentos e informações de um imóvel, como registros, certidões e contratos, para verificar sua regularidade jurídica e identificar possíveis riscos antes de transações como compra, venda ou incorporação.",
  },
  {
    category: "Cartório",
    title: "Escrituras em Geral",
    description: "Esse serviço abrange a elaboração e formalização de escrituras públicas para diversos atos imobiliários, como compra, venda, doação ou permuta, realizados em cartório para assegurar a validade jurídica e a segurança das transações.",
  },
  {
    category: "Documentação",
    title: "Emissão de Certidões",
    description: "Inclui a obtenção de certidões imobiliárias e pessoais, como certidão de ônus reais, negativa de débitos ou de propriedade, essenciais para comprovar a regularidade de imóveis e garantir segurança em negociações ou processos legais.",
  },
  {
    category: "Tributário",
    title: "Emissão de ITBI e ITCMD",
    description: "Envolve a gestão e emissão de guias para pagamento do Imposto sobre Transmissão de Bens Imóveis (ITBI), aplicável em transações de compra e venda, e do Imposto sobre Transmissão Causa Mortis e Doação (ITCMD), para heranças e doações, garantindo conformidade fiscal.",
  },
  {
    category: "Topografia",
    title: "Georreferenciamento",
    description: "O georreferenciamento é o processo técnico de mapeamento e delimitação de imóveis, especialmente rurais, utilizando coordenadas geográficas. Este serviço atende às exigências do INCRA e dos cartórios para regularização e atualização de registros.",
  },
  {
    category: "Incorporação",
    title: "Incorporação Imobiliária",
    description: "A incorporação imobiliária viabiliza a construção e comercialização de unidades autônomas (apartamentos ou casas) em edifícios ou conjuntos habitacionais antes da conclusão das obras, envolvendo a elaboração de memoriais, registros e cumprimento de normas legais.",
  },
  {
    category: "Condomínio",
    title: "Instituição e Especificação de Condomínio",
    description: "Este serviço formaliza juridicamente a criação de um condomínio, dividindo um prédio ou conjunto de prédios em unidades autônomas com áreas comuns e exclusivas definidas. Inclui a elaboração de documentos e registros necessários em cartório.",
  },
  {
    category: "Urbanismo",
    title: "Registros de Loteamentos",
    description: "Compreende os procedimentos para regularização e registro de loteamentos, garantindo que o parcelamento do solo para criação de lotes residenciais ou comerciais esteja em conformidade com a legislação urbanística e ambiental.",
  },
  {
    category: "Regularização",
    title: "Regularização de Imóveis Adquiridos por Leilão",
    description: "Envolve a análise e regularização de imóveis adquiridos em leilões judiciais ou extrajudiciais, incluindo a obtenção de documentos, pagamento de impostos e registro da propriedade para assegurar a legalidade da transação.",
  },
  {
    category: "Regularização",
    title: "Regularização de Imóveis em Terrenos de Marinha",
    description: "Este serviço regulariza imóveis localizados em terrenos de marinha, pertencentes à União, por meio de procedimentos como obtenção de aforamento, pagamento de taxas e atualização de registros, garantindo segurança jurídica aos ocupantes.",
  },
  {
    category: "Retificação",
    title: "Retificação de Registros",
    description: "A retificação de registros corrige erros ou omissões em informações registradas no cartório, como descrições de área, confrontações ou titularidade do imóvel, assegurando a exatidão dos dados e evitando problemas em transações futuras.",
  },
  {
    category: "Regularização",
    title: "Reurb (Reurb-E e Reurb-S)",
    description: "A Regularização Fundiária Urbana (Reurb) promove a legalização de ocupações irregulares, dividida em Reurb-E (interesse específico, para imóveis de maior valor) e Reurb-S (interesse social, para populações de baixa renda), garantindo titulação e acesso a serviços urbanos.",
  },
  {
    category: "Extrajudicial",
    title: "Usucapião Extrajudicial",
    description: "A usucapião extrajudicial permite a aquisição da propriedade de um imóvel por meio de procedimento administrativo em cartório, sem necessidade de ação judicial, desde que cumpridos os requisitos legais de posse prolongada e pacífica.",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-to-b from-[#4318FF]/5 to-transparent">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-services-title">
                Nossos Serviços
              </h1>
              <p className="text-lg text-muted-foreground" data-testid="text-services-subtitle">
                Oferecemos uma ampla gama de serviços de regularização imobiliária para atender todas as suas necessidades jurídicas e documentais.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow" data-testid={`card-service-${index}`}>
                  <CardHeader className="pb-2">
                    <Badge variant="outline" className="w-fit text-[#4318FF] border-[#4318FF]">
                      {service.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <h3 className="font-bold text-lg">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
