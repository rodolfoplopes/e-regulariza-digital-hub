import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
export default function Hero() {
  return <div className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32 bg-white">
          <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Regularização imobiliária</span>{" "}
                <span className="block text-eregulariza-primary">simplificada e transparente</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">A e-regulariza simplifica todo o processo para você, desde a análise até a entrega da documentação. Vem para a e-regulariza! É mais simples do que você imagina.</p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button asChild size="lg" className="eregulariza-gradient hover:opacity-90 w-full">
                    <a href="https://wa.me/5521999011999" target="_blank" rel="noopener noreferrer">
                      Falar com especialista
                    </a>
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button asChild size="lg" variant="outline" className="w-full">
                    <Link to="/servicos">
                      Nossos serviços
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full" src="https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" alt="Imagem arquitetônica representando propriedades para regularização" />
      </div>
    </div>;
}