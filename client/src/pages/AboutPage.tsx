import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, Clock } from "lucide-react";

import teamIngrid from "@/assets/team-ingrid.jpeg";
import teamRodolfo from "@/assets/team-rodolfo.jpg";
import teamFabio from "@/assets/team-fabio.png";

const stats = [
  { icon: Users, label: "Clientes atendidos", value: "500+" },
  { icon: Target, label: "Processos concluídos", value: "1.200+" },
  { icon: Award, label: "Anos de experiência", value: "10+" },
  { icon: Clock, label: "Tempo médio de resposta", value: "24h" },
];

const teamMembers = [
  {
    name: "Ingrid Peleteiro",
    role: "Advogada Sênior",
    image: teamIngrid,
  },
  {
    name: "Fábio Macieira",
    role: "Consultor Jurídico",
    image: teamFabio,
  },
  {
    name: "Rodolfo Lopes",
    role: "Negócios",
    image: teamRodolfo,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Sobre a <span className="text-[#4318FF]">e-regulariza</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Somos uma empresa especializada em regularização imobiliária, 
                comprometida em transformar processos burocráticos em experiências 
                simples e transparentes para nossos clientes.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-sm text-center" data-testid={`card-stat-${index}`}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-[#4318FF]/10 flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-6 h-6 text-[#4318FF]" />
                    </div>
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="max-w-3xl mx-auto space-y-8 mb-16">
              <div>
                <h2 className="text-2xl font-bold mb-4">Nossa Missão</h2>
                <p className="text-muted-foreground">
                  Facilitar o acesso à regularização imobiliária através de uma 
                  plataforma digital que oferece transparência, agilidade e 
                  segurança em cada etapa do processo.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Nossa Visão</h2>
                <p className="text-muted-foreground">
                  Ser a principal referência em regularização imobiliária digital 
                  no Brasil, reconhecida pela excelência no atendimento e pela 
                  inovação nos processos.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Nossos Valores</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Transparência em todas as etapas do processo</li>
                  <li>Compromisso com a satisfação do cliente</li>
                  <li>Inovação e melhoria contínua</li>
                  <li>Ética e responsabilidade profissional</li>
                </ul>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Nossa Equipe</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  A e-regulariza surgiu para revolucionar a legalização de imóveis no Brasil. Através da união entre expertise jurídica e tecnologia queremos proporcionar uma experiência ágil, transparente e eficiente, facilitando a regularização de imóveis de forma rápida, segura e confiável.
                </p>
                <p className="text-muted-foreground mt-4">
                  Conheça nosso time de especialistas dedicados a ajudá-lo em cada etapa do processo.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
