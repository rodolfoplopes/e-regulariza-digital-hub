import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-20" data-testid="section-hero">
      {/* Motivo gráfico: planta de lote + curvas de nível (referência cadastral/topográfica) */}
      <svg
        className="pointer-events-none absolute -right-10 -top-10 w-[70vw] max-w-[640px] opacity-90"
        viewBox="0 0 520 520"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="#10223D" strokeOpacity=".12" strokeWidth="1.2">
          <path d="M90 420 C70 330 100 230 170 170 C240 110 340 110 400 170 C450 220 460 300 420 360 C380 420 300 460 220 450 C160 442 105 460 90 420 Z" />
          <path d="M130 400 C115 325 140 245 195 200 C250 155 330 155 375 200 C415 240 420 300 390 345 C360 390 300 420 240 415 C195 410 140 430 130 400 Z" />
          <path d="M170 375 C160 320 178 265 215 232 C255 198 315 198 350 232 C378 260 382 305 360 338 C338 370 295 392 250 388 C218 385 178 400 170 375 Z" />
        </g>
        <g stroke="#00D9A5" strokeOpacity=".5" strokeWidth="1.6" strokeDasharray="5 5">
          <path d="M210 90 L430 150 L395 340 L150 300 Z" />
        </g>
        <g fill="#10223D" fillOpacity=".5">
          <circle cx="210" cy="90" r="3" />
          <circle cx="430" cy="150" r="3" />
          <circle cx="395" cy="340" r="3" />
          <circle cx="150" cy="300" r="3" />
        </g>
        <g fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#10223D" fillOpacity=".45">
          <text x="300" y="112">42,70 m</text>
          <text x="400" y="250">28,15 m</text>
          <text x="255" y="330">LOTE 14 · QD B</text>
        </g>
      </svg>

      <div className="relative container mx-auto px-4 lg:px-8 pb-20 md:pb-28">
        <div className="max-w-2xl">
          <span
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider rounded-full px-3 py-1 mb-7"
            style={{ color: "#047A5B", backgroundColor: "#CDEFE4" }}
            data-testid="text-hero-eyebrow"
          >
            Gestão da regularização imobiliária
          </span>

          <h1
            className="font-extrabold leading-[1.02] tracking-tight mb-6 text-4xl md:text-5xl lg:text-6xl"
            data-testid="text-hero-title"
          >
            <span className="block">Inteligência e gestão</span>
            <span className="block">
              para <span className="text-[#00B388]">regularizar</span>
            </span>
            <span className="block">imóveis.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10" data-testid="text-hero-description">
            Organizamos documentos, identificamos pendências cadastrais e coordenamos as etapas da regularização para empresas, condomínios e proprietários.
          </p>

          <div className="relative inline-flex mb-14">
            <span className="absolute -inset-4 rounded-full border border-[#00B388]/25 pointer-events-none" aria-hidden="true" />
            <span className="absolute -inset-[22px] rounded-full border border-[#00B388]/15 pointer-events-none" aria-hidden="true" />
            <Button asChild size="lg" className="relative bg-[#10223D] hover:bg-[#17335c] text-white rounded-full px-8">
              <Link to="/contato" data-testid="link-hero-contact">
                Conte sobre seu imóvel
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 md:gap-14 pt-7 border-t text-xs uppercase tracking-wider text-muted-foreground font-medium" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            <span>Organização <b className="text-[#10223D] font-semibold">documental</b></span>
            <span>Gestão <b className="text-[#10223D] font-semibold">por projeto</b></span>
            <span>Acompanhamento de <b className="text-[#10223D] font-semibold">carteira</b></span>
          </div>
        </div>
      </div>
    </section>
  );
}
