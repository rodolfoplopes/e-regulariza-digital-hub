import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-[#10223D] to-[#00D9A5]" data-testid="section-cta">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white" data-testid="text-cta-title">
          Leve sua demanda de regularização para um fluxo único.
        </h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-8" data-testid="text-cta-description">
          Avaliamos a viabilidade, apresentamos os caminhos legais e conduzimos a regularização até a conclusão, com marcos e responsáveis definidos desde o início.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" variant="outline" className="bg-white text-[#10223D] border-white hover:bg-white/90 rounded-full px-8">
            <Link to="/contato" data-testid="link-cta-contact">
              Apresentar minha demanda
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
