import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { analytics } from "@/services/analyticsService";
import { useEffect } from "react";

const teamMembers = [
  {
    id: 1,
    name: "Ingrid Peleteiro",
    role: "Advogada Sênior",
    image: "/lovable-uploads/7ada2960-1e90-40c3-a47a-ecdc756e14a7.png"
  },
  {
    id: 2,
    name: "Fábio Macieira",
    role: "Consultor Jurídico",
    image: "/placeholder.svg" // Using placeholder for the middle person as we don't have their individual photo
  },
  {
    id: 3,
    name: "Rodolfo Lopes",
    role: "Negócios",
    image: "/lovable-uploads/b0877c40-e9ca-497e-80c0-141bad905a92.png"
  }
];

const AboutPage = () => {
  useEffect(() => {
    analytics.trackPageView('about');
  }, []);

  return (
    <Layout>
      <SEOHead 
        title="Sobre Nós - e-regulariza"
        description="Conheça a e-regulariza e nossa equipe de especialistas dedicados a revolucionar a legalização de imóveis no Brasil através da tecnologia."
        keywords="sobre e-regulariza, equipe, advogados, consultores jurídicos, regularização imobiliária, tecnologia jurídica"
      />
      
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Sobre Nós
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Revolucionando a legalização de imóveis no Brasil
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Nossa Missão
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                A e-regulariza surgiu para revolucionar a legalização de imóveis no Brasil. Através da união entre expertise 
                jurídica e tecnologia queremos proporcionar uma experiência ágil, transparente e eficiente, facilitando a 
                regularização de imóveis de forma rápida, segura e confiável.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Conheça nosso time de especialistas dedicados a ajudá-lo em cada etapa do processo.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nossa Equipe
              </h2>
              <p className="text-xl text-muted-foreground">
                Especialistas comprometidos com sua regularização imobiliária
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {teamMembers.map((member) => (
                <Card key={member.id} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {member.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {member.role}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Nossos Valores
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Transparência</h3>
                <p className="text-muted-foreground">
                  Mantemos você informado sobre cada etapa do processo com total clareza e honestidade.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Agilidade</h3>
                <p className="text-muted-foreground">
                  Utilizamos tecnologia de ponta para acelerar processos e entregar resultados rapidamente.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Segurança</h3>
                <p className="text-muted-foreground">
                  Garantimos a máxima segurança jurídica em todos os nossos procedimentos e documentações.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Pronto para regularizar seu imóvel?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Entre em contato conosco e descubra como podemos ajudar você a resolver sua situação imobiliária.
            </p>
            <a 
              href="/contato" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              Fale Conosco
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AboutPage;