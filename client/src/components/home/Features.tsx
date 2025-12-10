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

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experiência de regularização reimaginada
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nossa plataforma digital foi projetada para tornar seu processo de 
            regularização imobiliária o mais transparente e eficiente possível.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm" data-testid={`card-feature-${index}`}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
