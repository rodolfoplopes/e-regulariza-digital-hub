import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Landmark, UserCheck, ScanSearch, Bot, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const audiences = [
  {
    icon: Building2,
    title: "Incorporadoras e construtoras",
    description: "Diagnóstico e regularização documental de empreendimentos, do registro inicial à entrega das unidades.",
  },
  {
    icon: Users,
    title: "Condomínios e síndicos",
    description: "Organização cadastral e acompanhamento de pendências para condomínios já instituídos ou em regularização.",
  },
  {
    icon: UserCheck,
    title: "Patrimônio e herdeiros",
    description: "Atualização cadastral e dossiês documentais para imóveis sob sucessão ou gestão patrimonial.",
  },
  {
    icon: Landmark,
    title: "Setor público",
    description: "Apoio operacional e documental a programas de regularização fundiária conduzidos pelo poder público.",
  },
];

const governance = [
  {
    icon: ScanSearch,
    title: "Rastreabilidade documental",
    description: "Cada etapa, documento e pendência fica registrado e disponível para consulta a qualquer momento.",
  },
  {
    icon: Bot,
    title: "Revisão humana AI First",
    description: "A inteligência artificial apoia a organização das informações; toda extração e classificação passa por revisão humana.",
  },
  {
    icon: ShieldCheck,
    title: "Validação técnica especializada",
    description: "Atos privativos de profissão são sempre assinados por profissionais habilitados e devidamente registrados.",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#10223D]/5 to-transparent" data-testid="section-governance">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-governance-title">
            Públicos e governança
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-governance-subtitle">
            Quem contrata a e-regulariza e como garantimos rastreabilidade em cada etapa do trabalho.
          </p>
        </div>

        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Quem contrata</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {audiences.map((item, index) => (
            <Card key={index} className="border shadow-sm" data-testid={`card-audience-${index}`}>
              <CardContent className="p-6">
                <item.icon className="w-8 h-8 text-[#10223D] mb-3" />
                <h3 className="font-semibold text-sm mb-2" data-testid={`text-audience-title-${index}`}>{item.title}</h3>
                <p className="text-xs text-muted-foreground" data-testid={`text-audience-desc-${index}`}>{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Como garantimos</p>
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {governance.map((item, index) => (
            <Card key={index} className="border shadow-sm" data-testid={`card-governance-${index}`}>
              <CardContent className="p-6">
                <item.icon className="w-8 h-8 text-[#00B388] mb-3" />
                <h3 className="font-semibold text-sm mb-2" data-testid={`text-governance-title-${index}`}>{item.title}</h3>
                <p className="text-xs text-muted-foreground" data-testid={`text-governance-desc-${index}`}>{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild className="bg-[#10223D] hover:bg-[#17335c] text-white rounded-full px-8">
            <Link to="/contato" data-testid="link-cta-governance">
              Apresentar minha demanda
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
