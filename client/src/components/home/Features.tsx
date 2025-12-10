import { FileText, Eye, MessageCircle, FileCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "Acompanhamento de processos",
    description: "Visualize o status de todos os seus processos em uma única plataforma de forma simples e intuitiva.",
    color: "#4318FF",
    bgColor: "bg-[#4318FF]/10",
  },
  {
    icon: Eye,
    title: "Transparência total",
    description: "Acompanhe a evolução do seu processo em tempo real, com atualizações e prazos claros.",
    color: "#00D9A5",
    bgColor: "bg-[#00D9A5]/10",
  },
  {
    icon: MessageCircle,
    title: "Comunicação direta",
    description: "Chat direto com nossos especialistas para esclarecer dúvidas a qualquer momento.",
    color: "#4318FF",
    bgColor: "bg-[#4318FF]/10",
  },
  {
    icon: FileCheck,
    title: "Documentos digitais",
    description: "Envie e receba documentos pela plataforma, evitando deslocamentos e burocracia.",
    color: "#00D9A5",
    bgColor: "bg-[#00D9A5]/10",
  },
];

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#4318FF]/5 to-transparent" data-testid="section-features">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-features-title">
            Porque escolher a e-regulariza?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-features-subtitle">
            Nossa plataforma foi projetada para tornar seu processo de regularização imobiliária mais tranquila e eficiente.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow" data-testid={`card-feature-${index}`}>
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="font-semibold text-lg mb-2" data-testid={`text-feature-title-${index}`}>{feature.title}</h3>
                <p className="text-sm text-muted-foreground" data-testid={`text-feature-desc-${index}`}>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
