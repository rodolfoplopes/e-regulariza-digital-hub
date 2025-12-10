import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Finalmente consegui a regularização do meu imóvel! O processo foi muito mais rápido do que eu esperava e a equipe da e-regulariza me manteve informado em cada passo.",
    name: "Alexandre M.",
    role: "Proprietário no Rio de Janeiro",
  },
  {
    quote: "Eu estava há anos tentando resolver a documentação da minha propriedade, mas só a e-regulariza fez acontecer. O atendimento é excelente. Muito obrigado!",
    name: "Joana V.",
    role: "Proprietária em Duque de Caxias",
  },
  {
    quote: "Nosso empreendimento imobiliário exigia uma regularização complexa, e a e-regulariza foi parceira essencial em todo o processo.",
    name: "José P.",
    role: "Proprietário em Itaguaí",
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
                <div>
                  <p className="font-semibold" data-testid={`text-testimonial-name-${index}`}>{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
