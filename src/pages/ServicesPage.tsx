import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { analytics } from "@/services/analyticsService";
import { useEffect } from "react";

const services = [
  {
    id: 1,
    title: "Adjudicação Compulsória",
    description: "A adjudicação compulsória é um procedimento judicial que garante ao comprador de um imóvel a transferência formal da propriedade quando o vendedor se recusa ou está impossibilitado de lavrar a escritura definitiva, mesmo após o pagamento total do valor acordado.",
    category: "Judicial"
  },
  {
    id: 2,
    title: "Contrato de Compra e Venda",
    description: "Este serviço formaliza contratos de compra e venda de imóveis, garantindo a segurança jurídica da transação. Inclui a elaboração do documento e seu registro em cartório para efetivar a transferência de propriedade.",
    category: "Contratos"
  },
  {
    id: 3,
    title: "Convenção de Condomínio",
    description: "A convenção de condomínio é o documento que estabelece as regras de convivência, administração e uso das áreas comuns e privativas de um condomínio. Esse serviço envolve a elaboração e registro do documento, garantindo conformidade legal e organização do empreendimento.",
    category: "Condomínio"
  },
  {
    id: 4,
    title: "Due Diligence",
    description: "A due diligence imobiliária consiste na análise minuciosa de documentos e informações de um imóvel, como registros, certidões e contratos, para verificar sua regularidade jurídica e identificar possíveis riscos antes de transações como compra, venda ou incorporação.",
    category: "Consultoria"
  },
  {
    id: 5,
    title: "Escrituras em Geral",
    description: "Esse serviço abrange a elaboração e formalização de escrituras públicas para diversos atos imobiliários, como compra, venda, doação ou permuta, realizados em cartório para assegurar a validade jurídica e a segurança das transações.",
    category: "Cartório"
  },
  {
    id: 6,
    title: "Emissão de Certidões",
    description: "Inclui a obtenção de certidões imobiliárias e pessoais, como certidão de ônus reais, negativa de débitos ou de propriedade, essenciais para comprovar a regularidade de imóveis e garantir segurança em negociações ou processos legais.",
    category: "Documentação"
  },
  {
    id: 7,
    title: "Emissão de ITBI e ITCMD",
    description: "Envolve a gestão e emissão de guias para pagamento do Imposto sobre Transmissão de Bens Imóveis (ITBI), aplicável em transações de compra e venda, e do Imposto sobre Transmissão Causa Mortis e Doação (ITCMD), para heranças e doações, garantindo conformidade fiscal.",
    category: "Tributário"
  },
  {
    id: 8,
    title: "Georreferenciamento",
    description: "O georreferenciamento é o processo técnico de mapeamento e delimitação de imóveis, especialmente rurais, utilizando coordenadas geográficas. Este serviço atende às exigências do INCRA e dos cartórios para regularização e atualização de registros.",
    category: "Topografia"
  },
  {
    id: 9,
    title: "Incorporação Imobiliária",
    description: "A incorporação imobiliária viabiliza a construção e comercialização de unidades autônomas (apartamentos ou casas) em edifícios ou conjuntos habitacionais antes da conclusão das obras, envolvendo a elaboração de memoriais, registros e cumprimento de normas legais.",
    category: "Incorporação"
  },
  {
    id: 10,
    title: "Instituição e Especificação de Condomínio",
    description: "Este serviço formaliza juridicamente a criação de um condomínio, dividindo um prédio ou conjunto de prédios em unidades autônomas com áreas comuns e exclusivas definidas. Inclui a elaboração de documentos e registros necessários em cartório.",
    category: "Condomínio"
  },
  {
    id: 11,
    title: "Registros de Loteamentos",
    description: "Compreende os procedimentos para regularização e registro de loteamentos, garantindo que o parcelamento do solo para criação de lotes residenciais ou comerciais esteja em conformidade com a legislação urbanística e ambiental.",
    category: "Urbanismo"
  },
  {
    id: 12,
    title: "Regularização de Imóveis Adquiridos por Leilão",
    description: "Envolve a análise e regularização de imóveis adquiridos em leilões judiciais ou extrajudiciais, incluindo a obtenção de documentos, pagamento de impostos e registro da propriedade para assegurar a legalidade da transação.",
    category: "Regularização"
  },
  {
    id: 13,
    title: "Regularização de Imóveis em Terrenos de Marinha",
    description: "Este serviço regulariza imóveis localizados em terrenos de marinha, pertencentes à União, por meio de procedimentos como obtenção de aforamento, pagamento de taxas e atualização de registros, garantindo segurança jurídica aos ocupantes.",
    category: "Regularização"
  },
  {
    id: 14,
    title: "Retificação de Registros",
    description: "A retificação de registros corrige erros ou omissões em informações registradas no cartório, como descrições de área, confrontações ou titularidade do imóvel, assegurando a exatidão dos dados e evitando problemas em transações futuras.",
    category: "Retificação"
  },
  {
    id: 15,
    title: "Reurb (Reurb-E e Reurb-S)",
    description: "A Regularização Fundiária Urbana (Reurb) promove a legalização de ocupações irregulares, dividida em Reurb-E (interesse específico, para imóveis de maior valor) e Reurb-S (interesse social, para populações de baixa renda), garantindo titulação e acesso a serviços urbanos.",
    category: "Regularização"
  },
  {
    id: 16,
    title: "Usucapião Extrajudicial",
    description: "A usucapião extrajudicial permite a aquisição da propriedade de um imóvel por posse prolongada, realizada diretamente em cartório, sem processo judicial, desde que atendidos os requisitos legais, como tempo de posse e ausência de oposição.",
    category: "Extrajudicial"
  }
];

const ServicesPage = () => {
  useEffect(() => {
    analytics.trackPageView('services');
  }, []);

  const categories = [...new Set(services.map(service => service.category))];

  return (
    <Layout>
      <SEOHead 
        title="Serviços - e-regulariza"
        description="Conheça todos os serviços de regularização imobiliária oferecidos pela e-regulariza. Desde adjudicação compulsória até usucapião extrajudicial."
        keywords="serviços imobiliários, regularização de imóveis, cartório, escrituras, certidões, usucapião, adjudicação compulsória"
      />
      
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Nossos Serviços
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Oferecemos uma ampla gama de serviços de regularização imobiliária para atender todas as suas necessidades jurídicas e documentais.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card key={service.id} className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="secondary" className="mb-2">
                        {service.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-foreground leading-tight">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Precisa de algum desses serviços?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Nossa equipe especializada está pronta para ajudar você com qualquer processo de regularização imobiliária.
            </p>
            <a 
              href="/contato" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              Entre em Contato
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ServicesPage;