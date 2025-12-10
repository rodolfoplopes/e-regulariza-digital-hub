import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center" data-testid="section-hero">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" data-testid="text-hero-title">
              Regularização imobiliária{" "}
              <span className="text-[#4318FF]">simplificada e transparente</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg" data-testid="text-hero-description">
              Chega de complicações. A e-regulariza simplifica todo o processo para você, desde a análise até a entrega da sua documentação. É mais rápido do que você imagina!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-[#00D9A5] hover:bg-[#00C495] text-white">
                <Link to="/contato" data-testid="link-hero-contact">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Fale Conosco
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              alt="Imagem arquitetônica representando propriedades para regularização"
              className="w-full h-[500px] object-cover rounded-lg"
              data-testid="img-hero"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
