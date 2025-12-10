import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-[#4318FF] to-[#00D9A5]" data-testid="section-cta">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white" data-testid="text-cta-title">
          Pronto para simplificar sua regularização imobiliária?
        </h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-8" data-testid="text-cta-description">
          Inicie agora mesmo seu processo de forma digital e acompanhe cada etapa com total transparência.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" variant="outline" className="bg-white text-[#4318FF] border-white hover:bg-white/90">
            <Link to="/contato" data-testid="link-cta-contact">
              Falar com especialista
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
