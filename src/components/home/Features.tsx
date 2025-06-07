
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, Eye, UserCheck } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Acompanhamento de processos",
      description: "Visualize o status de todos os seus processos em uma única plataforma de forma simples e intuitiva.",
      icon: <FileText className="h-6 w-6 text-white" />,
      bgColor: "bg-eregulariza-primary"
    },
    {
      title: "Transparência total",
      description: "Acompanhe a evolução do seu processo em tempo real, com atualizações e prazos claros.",
      icon: <Eye className="h-6 w-6 text-white" />,
      bgColor: "bg-eregulariza-secondary"
    },
    {
      title: "Comunicação direta",
      description: "Chat direto com nossos especialistas para esclarecer dúvidas a qualquer momento.",
      icon: <UserCheck className="h-6 w-6 text-white" />,
      bgColor: "eregulariza-gradient"
    },
    {
      title: "Documentos digitais",
      description: "Envie e receba documentos pela plataforma, evitando deslocamentos e burocracia.",
      icon: <Clock className="h-6 w-6 text-white" />,
      bgColor: "bg-eregulariza-primary"
    },
  ];

  return (
    <section className="py-16 bg-eregulariza-surface">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-eregulariza-gray sm:text-4xl">
            Experiência de regularização reimaginada
          </h2>
          <p className="mt-4 text-lg text-eregulariza-description">
            Nossa plataforma digital foi projetada para tornar seu processo de regularização 
            imobiliária o mais transparente e eficiente possível.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="animate-fade-in hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className={`h-12 w-12 rounded-md ${feature.bgColor} flex items-center justify-center`}>
                  {feature.icon}
                </div>
                <CardTitle className="mt-4 text-lg font-medium text-eregulariza-gray">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-eregulariza-description">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
