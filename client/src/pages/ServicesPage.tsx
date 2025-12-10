import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Home, Building, Scale, ArrowRight } from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "Usucapião Extrajudicial",
    description: "Regularização de imóveis através do procedimento extrajudicial, de forma mais rápida e menos burocrática que a via judicial.",
    features: ["Análise documental completa", "Acompanhamento em tempo real", "Suporte jurídico especializado"],
  },
  {
    icon: Home,
    title: "Regularização Fundiária",
    description: "Processos de regularização de áreas urbanas e rurais, incluindo REURB-S e REURB-E.",
    features: ["Diagnóstico inicial gratuito", "Elaboração de projetos técnicos", "Registro em cartório"],
  },
  {
    icon: Building,
    title: "Incorporação Imobiliária",
    description: "Assessoria completa para incorporação de empreendimentos imobiliários.",
    features: ["Análise de viabilidade", "Documentação completa", "Registro da incorporação"],
  },
  {
    icon: Scale,
    title: "Due Diligence Imobiliária",
    description: "Análise detalhada da situação jurídica, técnica e documental de imóveis.",
    features: ["Análise de riscos", "Verificação de ônus", "Relatório completo"],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Nossos Serviços
              </h1>
              <p className="text-lg text-muted-foreground">
                Oferecemos soluções completas para regularização imobiliária, 
                sempre com transparência e acompanhamento em tempo real.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="border-0 shadow-sm" data-testid={`card-service-${index}`}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ArrowRight className="w-4 h-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link to="/contato" data-testid="link-contact-services">
                  Solicitar orçamento
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
