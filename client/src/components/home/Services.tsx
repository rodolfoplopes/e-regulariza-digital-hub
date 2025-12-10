import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileCheck, Building2, Search, MapPin, Scale, FileText } from "lucide-react";

const services = [
  {
    id: "usucapiao",
    icon: FileCheck,
    title: "Usucapião Extrajudicial",
    url: "/servicos#usucapiao",
  },
  {
    id: "incorporacao",
    icon: Building2,
    title: "Incorporação Imobiliária",
    url: "/servicos#incorporacao",
  },
  {
    id: "duediligence",
    icon: Search,
    title: "Due Diligence",
    url: "/servicos#duediligence",
  },
  {
    id: "reurb",
    icon: MapPin,
    title: "Reurb",
    url: "/servicos#reurb",
  },
  {
    id: "adjudicacao",
    icon: Scale,
    title: "Adjudicação Compulsória",
    url: "/servicos#adjudicacao",
  },
  {
    id: "retificacao",
    icon: FileText,
    title: "Retificação de Registros",
    url: "/servicos#retificacao",
  },
];

export function Services() {
  return (
    <section className="py-16 md:py-24 bg-muted/30" data-testid="section-services-home">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-services-title">
            Serviços que resolvem sua vida imobiliária
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((service) => (
            <Card 
              key={service.id} 
              className="border-0 shadow-sm hover-elevate transition-all" 
              data-testid={`card-service-${service.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#4318FF]/10 flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-6 h-6 text-[#4318FF]" />
                  </div>
                  <h3 className="font-semibold text-lg" data-testid={`text-service-title-${service.id}`}>
                    {service.title}
                  </h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild 
                  className="text-[#4318FF] hover:text-[#4318FF]/80 p-0 h-auto"
                >
                  <Link to={service.url} data-testid={`link-service-${service.id}`}>
                    Saiba mais
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
