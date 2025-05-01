
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, Eye, UserCheck } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Acompanhamento de processos",
      description: "Visualize o status de todos os seus processos em uma única plataforma de forma simples e intuitiva.",
      icon: <FileText className="h-6 w-6 text-eregulariza-primary" />,
    },
    {
      title: "Transparência total",
      description: "Acompanhe a evolução do seu processo em tempo real, com atualizações e prazos claros.",
      icon: <Eye className="h-6 w-6 text-eregulariza-primary" />,
    },
    {
      title: "Comunicação direta",
      description: "Chat direto com nossos especialistas para esclarecer dúvidas a qualquer momento.",
      icon: <UserCheck className="h-6 w-6 text-eregulariza-primary" />,
    },
    {
      title: "Documentos digitais",
      description: "Envie e receba documentos pela plataforma, evitando deslocamentos e burocracia.",
      icon: <Clock className="h-6 w-6 text-eregulariza-primary" />,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Experiência de regularização reimaginada
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Nossa plataforma digital foi projetada para tornar seu processo de regularização 
            imobiliária o mais transparente e eficiente possível.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="animate-fade-in card-hover">
              <CardHeader>
                <div className="h-12 w-12 rounded-md bg-eregulariza-accent flex items-center justify-center">
                  {feature.icon}
                </div>
                <CardTitle className="mt-4 text-lg font-medium">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
