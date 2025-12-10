import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground" data-testid="section-cta">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-cta-title">
          Pronto para simplificar sua regularização imobiliária?
        </h2>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8" data-testid="text-cta-description">
          Inicie agora mesmo seu processo de forma digital e acompanhe cada 
          etapa com total transparência.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" variant="secondary">
            <Link to="/register" data-testid="link-cta-register">
              Começar agora
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/contato" data-testid="link-cta-contact">
              Falar com especialista
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
