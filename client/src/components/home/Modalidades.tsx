import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const modalidades = [
  {
    title: "Diagnóstico e Projeto Pontual",
    description: "Para uma demanda específica, com início e fim definidos.",
    items: [
      "Diagnóstico de viabilidade documental e cadastral",
      "Mapeamento de pendências e caminhos legais aplicáveis",
      "Proposta de escopo com entregas e responsáveis definidos",
      "Acompanhamento até a entrega do dossiê organizado",
      "Indicação de profissionais habilitados para atos privativos",
    ],
    highlighted: false,
  },
  {
    title: "Gestão Contínua de Carteiras e Programas",
    description: "Para quem tem várias frentes ou um programa em andamento.",
    items: [
      "Tudo do Diagnóstico e Projeto Pontual",
      "Cadastro e acompanhamento contínuo de carteiras inteiras",
      "Relatórios de andamento a cada 15 dias",
      "Coordenação de múltiplas frentes e profissionais simultaneamente",
      "Interlocução com órgãos públicos e cartórios, sem prazo prometido por terceiros",
      "Coordenação de programas públicos de regularização fundiária",
    ],
    highlighted: true,
  },
];

export function Modalidades() {
  return (
    <section className="py-16 md:py-24" data-testid="section-modalidades">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-modalidades-title">
            Modalidades de contratação
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-modalidades-subtitle">
            O escopo e as condições são definidos em proposta, conforme o seu caso.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
          {modalidades.map((modalidade) => (
            <div
              key={modalidade.title}
              className={`rounded-lg border p-8 ${modalidade.highlighted ? "border-[#10223D] ring-1 ring-[#10223D]/15" : "border-border"}`}
              data-testid={`card-modalidade-${modalidade.title}`}
            >
              <h3 className="font-bold text-xl mb-2">{modalidade.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">{modalidade.description}</p>
              <ul className="space-y-3 mb-8">
                {modalidade.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-[#00B388] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={modalidade.highlighted ? "bg-[#10223D] hover:bg-[#17335c] text-white w-full rounded-full" : "w-full rounded-full"}
                variant={modalidade.highlighted ? "default" : "outline"}
              >
                <Link to="/contato">
                  Apresentar minha demanda
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
          A e-regulariza coordena a documentação e a execução do projeto. Atos privativos de profissão são assinados por profissionais habilitados; prazos de cartórios, bancos e órgãos públicos dependem de terceiros.
        </p>
      </div>
    </section>
  );
}
