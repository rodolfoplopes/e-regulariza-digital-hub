import { FileText, Eye, MessageCircle, FileCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "Acompanhamento de processos",
    description: "Visualize o status de todos os seus processos em uma única plataforma de forma simples e intuitiva.",
  },
  {
    icon: Eye,
    title: "Transparência total",
    description: "Acompanhe a evolução do seu processo em tempo real, com atualizações e prazos claros.",
  },
  {
    icon: MessageCircle,
    title: "Comunicação direta",
    description: "Chat direto com nossos especialistas para esclarecer dúvidas a qualquer momento.",
  },
  {
    icon: FileCheck,
    title: "Documentos digitais",
    description: "Envie e receba documentos pela plataforma, evitando deslocamentos e burocracia.",
  },
];

export function Platform() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#1a1a2e] to-[#16213e]" data-testid="section-platform">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white" data-testid="text-platform-title">
            Regularize seu imóvel com simplicidade
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto" data-testid="text-platform-subtitle">
            Desenvolvemos uma plataforma digital intuitiva que torna cada etapa da regularização imobiliária clara, eficiente e sob seu controle.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm" data-testid={`card-platform-${index}`}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 mx-auto">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white" data-testid={`text-platform-title-${index}`}>{feature.title}</h3>
                <p className="text-sm text-white/70" data-testid={`text-platform-desc-${index}`}>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
