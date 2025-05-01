
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-16 eregulariza-gradient">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Pronto para simplificar sua regularização imobiliária?
          </h2>
          <p className="mt-4 text-lg text-white opacity-90">
            Inicie agora mesmo seu processo de forma digital e acompanhe cada etapa com total transparência.
          </p>
          <div className="mt-8 flex justify-center gap-x-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/register">
                Começar agora
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              <Link to="/contato">
                Falar com especialista
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
