import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

const teamMembers = [
  {
    name: "Ingrid Peleteiro",
    role: "Advogada Sênior",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
  },
  {
    name: "Fábio Macieira",
    role: "Consultor Jurídico",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
  },
  {
    name: "Rodolfo Lopes",
    role: "Negócios",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Sobre a <span className="text-[#4318FF]">e-regulariza</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                A e-regulariza surgiu para revolucionar a legalização de imóveis no Brasil. Através da união entre expertise jurídica e tecnologia queremos proporcionar uma experiência ágil, transparente e eficiente, facilitando a regularização de imóveis de forma rápida, segura e confiável.
              </p>
              <p className="text-lg text-muted-foreground">
                Conheça nosso time de especialistas dedicados a ajudá-lo em cada etapa do processo.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {teamMembers.map((member, index) => (
                <Card key={index} className="overflow-hidden border-0 shadow-lg" data-testid={`card-team-${index}`}>
                  <div className="aspect-[4/5] relative">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="font-semibold text-lg text-white" data-testid={`text-team-name-${index}`}>
                        {member.name}
                      </h3>
                      <p className="text-sm text-white/80" data-testid={`text-team-role-${index}`}>
                        {member.role}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
