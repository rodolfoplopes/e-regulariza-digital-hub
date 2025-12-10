import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Regularização imobiliária{" "}
              <span className="text-primary">simplificada e transparente</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Acompanhe seu processo de regularização em tempo real, com total 
              transparência e previsibilidade. Transformamos processos 
              burocráticos em experiências digitais.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/register" data-testid="link-hero-register">
                  Iniciar agora
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/servicos" data-testid="link-hero-services">
                  Nossos serviços
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
