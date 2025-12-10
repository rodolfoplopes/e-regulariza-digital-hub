import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Shield, FileText, Cookie } from "lucide-react";

interface PolicySectionProps {
  id: string;
  title: string;
  icon: typeof Shield;
  summary: string;
  content: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function PolicySection({ id, title, icon: Icon, summary, content, isOpen, onToggle }: PolicySectionProps) {
  return (
    <Card id={id} className="border-0 shadow-sm scroll-mt-24" data-testid={`card-${id}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#4318FF]/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-[#4318FF]" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{title}</CardTitle>
            <p className="text-muted-foreground text-sm">{summary}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          onClick={onToggle}
          className="mb-4 border-[#4318FF] text-[#4318FF] hover:bg-[#4318FF] hover:text-white"
          data-testid={`button-toggle-${id}`}
        >
          {isOpen ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Fechar
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Leia mais
            </>
          )}
        </Button>
        {isOpen && (
          <div className="prose prose-sm max-w-none text-muted-foreground" data-testid={`content-${id}`}>
            {content}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const currentDate = new Date().toLocaleDateString('pt-BR', { 
  day: '2-digit', 
  month: 'long', 
  year: 'numeric' 
});

const privacyContent = (
  <div className="space-y-6">
    <p>
      A e-regulariza valoriza a sua privacidade e se compromete com a proteção dos seus dados pessoais. 
      Esta Política explica como coletamos, utilizamos, armazenamos e compartilhamos seus dados em 
      conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei n 13.709/2018 - LGPD).
    </p>
    
    <div>
      <h4 className="font-semibold text-foreground mb-2">1. Quais dados coletamos?</h4>
      <p className="mb-2">Coletamos apenas os dados necessários para oferecer nossos serviços de regularização imobiliária, tais como:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Nome completo, CPF/CNPJ;</li>
        <li>Endereço do imóvel e documentos correlatos;</li>
        <li>E-mail, telefone e informações de contato;</li>
        <li>Informações de navegação (cookies, IP, geolocalização).</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-foreground mb-2">2. Para que usamos seus dados?</h4>
      <p className="mb-2">Utilizamos seus dados para:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Analisar e processar serviços solicitados (ex: usucapião, Reurb, retificações);</li>
        <li>Elaborar documentos jurídicos;</li>
        <li>Cumprir obrigações legais e regulatórias;</li>
        <li>Aperfeiçoar nossa plataforma e atendimento.</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-foreground mb-2">3. Com quem compartilhamos?</h4>
      <p className="mb-2">Compartilhamos dados apenas quando necessário:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Com cartórios, prefeituras, INCRA e demais órgãos públicos;</li>
        <li>Com parceiros técnicos envolvidos em processos de regularização;</li>
        <li>Com prestadores de serviço que apoiam nossa operação, sob contrato de confidencialidade.</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-foreground mb-2">4. Seus direitos como titular:</h4>
      <p className="mb-2">Você pode, a qualquer momento:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Acessar, corrigir ou excluir seus dados;</li>
        <li>Solicitar portabilidade ou anonimização;</li>
        <li>Revogar consentimentos;</li>
        <li>Saber com quem seus dados foram compartilhados.</li>
      </ul>
      <p className="mt-2">
        Para exercer seus direitos, entre em contato: <strong>sac@e-regulariza.com</strong>
      </p>
    </div>

    <div>
      <h4 className="font-semibold text-foreground mb-2">5. Segurança das informações</h4>
      <p>
        Adotamos medidas técnicas e organizacionais para proteger seus dados contra acessos 
        não autorizados, perda ou uso indevido.
      </p>
    </div>
  </div>
);

const termsContent = (
  <div className="space-y-6">
    <p>
      Bem-vindo à e-regulariza! Ao acessar nosso site e utilizar nossos serviços, você concorda 
      com os presentes Termos de Uso. Leia com atenção.
    </p>

    <div>
      <h4 className="font-semibold text-foreground mb-2">1. Sobre a e-regulariza</h4>
      <p>
        Somos uma plataforma jurídica especializada em regularização de imóveis, com foco em 
        soluções extrajudiciais, como usucapião, Reurb, retificações e registros.
      </p>
    </div>

    <div>
      <h4 className="font-semibold text-foreground mb-2">2. Utilização dos serviços</h4>
      <p className="mb-2">Você se compromete a:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Fornecer informações verdadeiras e completas;</li>
        <li>Utilizar nossos serviços apenas para fins legais;</li>
        <li>Não compartilhar acesso não autorizado à plataforma.</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-foreground mb-2">3. Propriedade intelectual</h4>
      <p>
        Todo o conteúdo do site (textos, logotipos, documentos, imagens e códigos) pertence à 
        e-regulariza e não pode ser copiado ou reproduzido sem autorização.
      </p>
    </div>

    <div>
      <h4 className="font-semibold text-foreground mb-2">4. Responsabilidade</h4>
      <p className="mb-2">Prestamos serviços com diligência e respaldo jurídico. No entanto:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Não garantimos prazos ou resultados definitivos dependentes de terceiros (ex: cartórios, prefeituras);</li>
        <li>Não nos responsabilizamos por dados incorretos enviados pelos usuários.</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-foreground mb-2">5. Alterações e atualizações</h4>
      <p>
        Podemos atualizar estes termos periodicamente. Recomendamos revisá-los regularmente.
      </p>
    </div>
  </div>
);

const cookiesContent = (
  <div className="space-y-6">
    <p>
      Usamos cookies para melhorar sua experiência em nosso site.
    </p>

    <div>
      <h4 className="font-semibold text-foreground mb-2">O que são cookies?</h4>
      <p>
        Cookies são pequenos arquivos de texto armazenados no seu navegador para lembrar 
        preferências, analisar tráfego e personalizar conteúdo.
      </p>
    </div>

    <div>
      <h4 className="font-semibold text-foreground mb-2">Tipos de cookies que usamos:</h4>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Essenciais:</strong> Necessários para o funcionamento básico do site;</li>
        <li><strong>De desempenho:</strong> Coletam dados para melhorar funcionalidades;</li>
        <li><strong>De marketing:</strong> Usados para exibir anúncios relevantes.</li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-foreground mb-2">Como gerenciar cookies?</h4>
      <p>
        Você pode ajustar as preferências de cookies diretamente em seu navegador, ou configurar 
        diretamente no aviso de cookies ao acessar o site.
      </p>
      <p className="mt-2">
        Ao continuar navegando, você concorda com o uso de cookies conforme esta política.
      </p>
    </div>
  </div>
);

export default function PolicyPage() {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    privacy: false,
    terms: false,
    cookies: false,
  });

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['privacy', 'terms', 'cookies'].includes(hash)) {
      setOpenSections(prev => ({ ...prev, [hash]: true }));
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const policies = [
    {
      id: "privacy",
      title: "Política de Privacidade",
      icon: Shield,
      summary: `Última atualização: ${currentDate}. Saiba como coletamos, utilizamos e protegemos seus dados pessoais em conformidade com a LGPD.`,
      content: privacyContent,
    },
    {
      id: "terms",
      title: "Termos de Uso",
      icon: FileText,
      summary: "Conheça as regras e condições para utilização dos nossos serviços e plataforma.",
      content: termsContent,
    },
    {
      id: "cookies",
      title: "Política de Cookies",
      icon: Cookie,
      summary: "Entenda como utilizamos cookies para melhorar sua experiência de navegação.",
      content: cookiesContent,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-policy-title">
                Políticas e Termos
              </h1>
              <p className="text-lg text-muted-foreground" data-testid="text-policy-subtitle">
                Transparência e segurança são prioridades para a e-regulariza. 
                Confira nossas políticas e termos de uso.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {policies.map((policy) => (
                <PolicySection
                  key={policy.id}
                  {...policy}
                  isOpen={openSections[policy.id]}
                  onToggle={() => toggleSection(policy.id)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
