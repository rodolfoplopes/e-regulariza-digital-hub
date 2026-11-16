import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface MiniBlock {
  title: string;
  description: string;
}

interface DetailSection {
  id: string;
  eyebrow: string;
  title: string;
  blocks: MiniBlock[];
  stat?: { value: string; caption: string };
  background: string;
}

const sections: DetailSection[] = [
  {
    id: "imoveis-empreendimentos",
    eyebrow: "Pilar 1",
    title: "Imóveis e Empreendimentos",
    background: "bg-background",
    blocks: [
      {
        title: "Diagnóstico de viabilidade documental",
        description: "Avaliamos a situação registral e cadastral do imóvel antes de qualquer proposta, identificando pendências e caminhos legais aplicáveis.",
      },
      {
        title: "Coordenação de condomínios e incorporações",
        description: "Organizamos documentos, prazos e responsáveis técnicos de condomínios e incorporações, da instituição à entrega da documentação final.",
      },
      {
        title: "Gestão contínua de carteiras",
        description: "Acompanhamos carteiras inteiras de imóveis, com cadastro atualizado, pendências mapeadas e relatórios periódicos para cada ativo.",
      },
    ],
    stat: {
      value: "18 frentes",
      caption: "Cobrimos desde atualização cadastral e CAR até incorporações, REURB e crédito verde em um fluxo único.",
    },
  },
  {
    id: "territorios-reurb",
    eyebrow: "Pilar 2",
    title: "Territórios e REURB",
    background: "bg-muted/40",
    blocks: [
      {
        title: "Condução de REURB-S e REURB-E",
        description: "Conduzimos os dois caminhos da Reurb, Interesse Social e Interesse Específico, conforme a situação de cada núcleo urbano.",
      },
      {
        title: "Regularização de parcelamentos antigos",
        description: "Organizamos a documentação de loteamentos e parcelamentos antigos, identificando pendências cartorárias e técnicas para cada caso.",
      },
      {
        title: "Apoio operacional a governos",
        description: "Estruturamos equipes e fluxos documentais para programas públicos de regularização fundiária, sob coordenação do poder público.",
      },
    ],
    stat: {
      value: "15 dias",
      caption: "É a frequência dos relatórios de acompanhamento, com marcos, protocolos e pendências mapeadas.",
    },
  },
  {
    id: "rural-ambiental-credito",
    eyebrow: "Pilar 3",
    title: "Rural, Ambiental e Crédito",
    background: "bg-background",
    blocks: [
      {
        title: "Organização do CAR rural",
        description: "Estruturamos o Cadastro Ambiental Rural e os cadastros e ITR do imóvel, com apoio técnico especializado quando necessário.",
      },
      {
        title: "Dossiês para crédito verde",
        description: "Preparamos dossiês técnicos e documentais que sustentam pedidos de linhas de crédito verde junto a instituições financeiras.",
      },
      {
        title: "Acompanhamento técnico especializado",
        description: "Coordenamos profissionais habilitados para os atos técnicos e jurídicos que a legislação rural e ambiental exige em cada etapa.",
      },
    ],
  },
];

export function PillarDetails() {
  return (
    <>
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className={`py-16 md:py-24 scroll-mt-20 ${section.background}`}
          data-testid={`section-detail-${section.id}`}
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-2xl mb-10">
              <span
                className="inline-flex items-center text-xs font-medium uppercase tracking-wider rounded-full px-3 py-1 mb-4"
                style={{ color: "#047A5B", backgroundColor: "#CDEFE4" }}
              >
                {section.eyebrow}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold" data-testid={`text-detail-title-${section.id}`}>
                {section.title}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {section.blocks.map((block, i) => (
                <div key={i} data-testid={`block-${section.id}-${i}`}>
                  <h3 className="font-semibold text-base mb-2">{block.title}</h3>
                  <p className="text-sm text-muted-foreground">{block.description}</p>
                </div>
              ))}
            </div>

            {section.stat && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 border-t pt-8 mb-10">
                <span
                  className="font-extrabold text-4xl md:text-5xl text-[#10223D] whitespace-nowrap"
                  data-testid={`text-stat-value-${section.id}`}
                >
                  {section.stat.value}
                </span>
                <p className="text-sm text-muted-foreground max-w-md" data-testid={`text-stat-caption-${section.id}`}>
                  {section.stat.caption}
                </p>
              </div>
            )}

            <Button asChild className="bg-[#10223D] hover:bg-[#17335c] text-white rounded-full px-8">
              <Link to="/contato" data-testid={`link-cta-${section.id}`}>
                Apresentar minha demanda
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      ))}
    </>
  );
}
