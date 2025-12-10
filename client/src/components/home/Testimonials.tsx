import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "O processo de regularização do meu imóvel foi surpreendentemente fácil com a e-regulariza. Consegui acompanhar cada etapa do processo e me senti confiante o tempo todo.",
    name: "Maria Silva",
    role: "Proprietária em São Paulo",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    quote: "A transparência da plataforma é impressionante. Recebi notificações em cada etapa e pude enviar todos os documentos de forma digital, sem sair de casa.",
    name: "Carlos Mendes",
    role: "Proprietário em Campinas",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    quote: "Minha usucapião foi resolvida em tempo recorde. A plataforma digital realmente faz diferença, poupando tempo e evitando burocracia desnecessária.",
    name: "Ana Pereira",
    role: "Proprietária em Ribeirão Preto",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#4318FF]/5 to-transparent" data-testid="section-testimonials">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-testimonials-title">
            O que nossos clientes dizem
          </h2>
          <p className="text-muted-foreground" data-testid="text-testimonials-subtitle">
            Depoimentos de clientes que regularizaram seus imóveis com nossa ajuda
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border shadow-sm" data-testid={`card-testimonial-${index}`}>
              <CardContent className="p-6">
                <Quote className="w-10 h-10 text-[#4318FF] mb-4" />
                <p className="text-muted-foreground mb-6" data-testid={`text-testimonial-quote-${index}`}>
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar data-testid={`avatar-testimonial-${index}`}>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm" data-testid={`text-testimonial-name-${index}`}>{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
