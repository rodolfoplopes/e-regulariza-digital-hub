import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Building2, MapPinned, Sprout } from "lucide-react";

const pillars = [
  {
    id: "imoveis-empreendimentos",
    icon: Building2,
    title: "Imóveis e Empreendimentos",
    description: "Diagnosticamos, regularizamos e acompanhamos construções, condomínios e incorporações, com gestão de carteiras inteiras de imóveis em um único fluxo.",
  },
  {
    id: "territorios-reurb",
    icon: MapPinned,
    title: "Territórios e REURB",
    description: "Conduzimos REURB-S e REURB-E, regularizamos parcelamentos antigos e apoiamos operacionalmente governos na organização documental de territórios inteiros.",
  },
  {
    id: "rural-ambiental-credito",
    icon: Sprout,
    title: "Rural, Ambiental e Crédito",
    description: "Organizamos o CAR, atualizamos cadastros e ITR rural e preparamos dossiês técnicos para viabilizar linhas de crédito verde.",
  },
];

export function Services() {
  return (
    <section className="py-16 md:py-24" data-testid="section-pillars">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-pillars-title">
            Nossos três pilares de atuação
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pillars.map((pillar) => (
            <Card
              key={pillar.id}
              className="border-0 shadow-sm hover-elevate transition-all"
              data-testid={`card-pillar-${pillar.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#10223D]/10 flex items-center justify-center flex-shrink-0">
                    <pillar.icon className="w-6 h-6 text-[#10223D]" />
                  </div>
                  <h3 className="font-semibold text-lg" data-testid={`text-pillar-title-${pillar.id}`}>
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4" data-testid={`text-pillar-desc-${pillar.id}`}>
                  {pillar.description}
                </p>
                <a
                  href={`#${pillar.id}`}
                  className="inline-flex items-center text-sm font-medium text-[#10223D] hover:text-[#17335c]"
                  data-testid={`link-pillar-${pillar.id}`}
                >
                  Saiba mais
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
