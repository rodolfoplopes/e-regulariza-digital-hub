
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";
import SEOHead from "@/components/seo/SEOHead";
import { analytics } from "@/services/analyticsService";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    analytics.trackPageView('home');
  }, []);

  return (
    <Layout>
      <SEOHead 
        title="e-regulariza - Regularização Imobiliária Digital e Transparente"
        description="Simplifique sua regularização imobiliária com nossa plataforma digital. Acompanhe processos de usucapião, inventário e retificação em tempo real com total transparência."
        keywords="regularização imobiliária, usucapião digital, inventário extrajudicial, retificação de área, cartório digital, processo transparente"
      />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTA />
    </Layout>
  );
};

export default Index;
