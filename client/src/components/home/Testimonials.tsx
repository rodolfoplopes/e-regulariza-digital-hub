
import { Card, CardContent } from "@/components/ui/card";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "O processo de regularização do meu imóvel foi surpreendentemente fácil com a e-regulariza. Consegui acompanhar cada etapa do processo e me senti confiante o tempo todo.",
      author: "Maria Silva",
      role: "Proprietária em São Paulo",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      quote: "A transparência da plataforma é impressionante. Recebi notificações em cada etapa e pude enviar todos os documentos de forma digital, sem sair de casa.",
      author: "Carlos Mendes",
      role: "Proprietário em Campinas",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      quote: "Minha usucapião foi resolvida em tempo recorde. A plataforma digital realmente faz diferença, poupando tempo e evitando burocracia desnecessária.",
      author: "Ana Pereira",
      role: "Proprietária em Ribeirão Preto",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-eregulariza-gray sm:text-4xl">
            O que nossos clientes dizem
          </h2>
          <p className="mt-4 text-lg text-eregulariza-description">
            Depoimentos de clientes que regularizaram seus imóveis com nossa ajuda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <svg
                  className="h-8 w-8 text-eregulariza-primary mb-4"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-sm text-eregulariza-description mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full mr-3"
                    src={testimonial.image}
                    alt={testimonial.author}
                  />
                  <div>
                    <p className="text-sm font-medium text-eregulariza-gray">{testimonial.author}</p>
                    <p className="text-sm text-eregulariza-description">{testimonial.role}</p>
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
