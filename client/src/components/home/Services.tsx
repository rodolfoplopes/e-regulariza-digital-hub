import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileCheck, Building2, Search, MapPin, Scale, FileText, MessageCircle } from "lucide-react";
import familiaUsucapiaoImg from "@/assets/familia-usucapiao.jpg";

const services = [
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
  const whatsappLink = "https://wa.me/5521999011999?text=Olá! Gostaria de saber mais sobre Usucapião Extrajudicial.";

  return (
    <section className="py-16 md:py-24 bg-muted/30" data-testid="section-services-home">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-services-title">
            Serviços que resolvem sua vida imobiliária
          </h2>
        </div>

        {/* Banner Destaque - Usucapião Extrajudicial */}
        <div 
          className="relative rounded-lg overflow-hidden mb-8 max-w-5xl mx-auto"
          data-testid="banner-usucapiao"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Conteúdo */}
            <div className="flex-1 bg-gradient-to-br from-[#4318FF] to-[#6B4EFF] p-8 lg:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/80 text-sm font-medium uppercase tracking-wider">Serviço em Destaque</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4" data-testid="text-banner-title">
                Usucapião Extrajudicial
              </h3>
              <p className="text-white/90 mb-6 leading-relaxed" data-testid="text-banner-description">
                A usucapião extrajudicial permite a aquisição da propriedade de um imóvel por meio de procedimento administrativo em cartório, sem necessidade de ação judicial, desde que cumpridos os requisitos legais de posse prolongada e pacífica.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  asChild 
                  className="bg-[#06D7A5] hover:bg-[#05c496] text-white border-0"
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" data-testid="link-banner-whatsapp">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Fale com um especialista
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  asChild 
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Link to="/servicos#usucapiao" data-testid="link-banner-saiba-mais">
                    Saiba mais
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            {/* Imagem */}
            <div className="lg:w-2/5 h-64 lg:h-auto relative">
              <img 
                src={familiaUsucapiaoImg} 
                alt="Família em seu lar" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#4318FF]/30 to-transparent lg:from-[#6B4EFF]/50"></div>
            </div>
          </div>
        </div>

        {/* Outros Serviços */}
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
