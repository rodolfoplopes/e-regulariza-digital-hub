
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type PolicyContent = {
  title: string;
  content: string;
  description: string;
  lastUpdated: string;
};

const policyTypes: Record<string, PolicyContent> = {
  "politica-de-privacidade": {
    title: "Política de Privacidade",
    content: `
      <h2>Política de Privacidade da e-regulariza</h2>
      <p class="mb-4">Última atualização: 01 de Maio de 2025</p>
      
      <h3>1. Introdução</h3>
      <p>A e-regulariza está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais quando você utiliza nossa plataforma de regularização imobiliária.</p>
      
      <h3>2. Informações que Coletamos</h3>
      <p>Podemos coletar os seguintes tipos de informações pessoais:</p>
      <ul>
        <li>Informações de identificação (nome, CPF, RG)</li>
        <li>Informações de contato (e-mail, telefone, endereço)</li>
        <li>Documentos imobiliários relacionados ao seu processo</li>
        <li>Informações de pagamento</li>
        <li>Dados de uso da plataforma</li>
      </ul>
      
      <h3>3. Como Utilizamos suas Informações</h3>
      <p>Utilizamos suas informações para:</p>
      <ul>
        <li>Fornecer e gerenciar nossos serviços de regularização imobiliária</li>
        <li>Processar transações e pagamentos</li>
        <li>Comunicar atualizações sobre seu processo</li>
        <li>Melhorar nossos serviços</li>
        <li>Cumprir obrigações legais</li>
      </ul>
      
      <h3>4. Compartilhamento de Informações</h3>
      <p>Podemos compartilhar suas informações com:</p>
      <ul>
        <li>Órgãos públicos necessários para seu processo de regularização</li>
        <li>Prestadores de serviços que nos auxiliam</li>
        <li>Quando exigido por lei ou ordem judicial</li>
      </ul>
      
      <h3>5. Segurança dos Dados</h3>
      <p>Implementamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.</p>
      
      <h3>6. Seus Direitos</h3>
      <p>Você tem direito a:</p>
      <ul>
        <li>Acessar seus dados pessoais</li>
        <li>Solicitar correções de informações imprecisas</li>
        <li>Solicitar exclusão de seus dados (quando aplicável)</li>
        <li>Revogar consentimento para uso de seus dados</li>
      </ul>
      
      <h3>7. Contato</h3>
      <p>Para questões sobre privacidade, entre em contato pelo e-mail: privacidade@eregulariza.com.br</p>
    `,
    description: "Informações sobre como a e-regulariza coleta, usa e protege seus dados pessoais, bem como seus direitos em relação a essas informações.",
    lastUpdated: "2025-05-01"
  },
  "politica-de-cookies": {
    title: "Política de Cookies",
    content: `
      <h2>Política de Cookies da e-regulariza</h2>
      <p class="mb-4">Última atualização: 01 de Maio de 2025</p>
      
      <h3>1. O que são Cookies</h3>
      <p>Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo quando você visita nosso site. Eles são amplamente utilizados para fazer os sites funcionarem de maneira mais eficiente e fornecer informações aos proprietários do site.</p>
      
      <h3>2. Como Utilizamos Cookies</h3>
      <p>Utilizamos cookies para:</p>
      <ul>
        <li>Garantir o funcionamento adequado da plataforma</li>
        <li>Lembrar suas preferências e configurações</li>
        <li>Manter sua sessão ativa enquanto navega pelo site</li>
        <li>Coletar dados analíticos para melhorar nossa plataforma</li>
        <li>Personalizar sua experiência</li>
      </ul>
      
      <h3>3. Tipos de Cookies que Utilizamos</h3>
      <p><strong>Cookies essenciais:</strong> Necessários para o funcionamento básico do site</p>
      <p><strong>Cookies funcionais:</strong> Permitem lembrar suas preferências</p>
      <p><strong>Cookies analíticos:</strong> Nos ajudam a entender como você interage com o site</p>
      <p><strong>Cookies de terceiros:</strong> Fornecidos por serviços externos que usamos</p>
      
      <h3>4. Controle de Cookies</h3>
      <p>Você pode controlar e gerenciar cookies nas configurações do seu navegador. Observe que desativar certos cookies pode afetar a funcionalidade do site.</p>
      
      <h3>5. Alterações na Política de Cookies</h3>
      <p>Esta política pode ser atualizada periodicamente. Recomendamos que você revise esta página regularmente para estar ciente de quaisquer alterações.</p>
      
      <h3>6. Contato</h3>
      <p>Para dúvidas sobre nossa política de cookies, entre em contato pelo e-mail: privacidade@eregulariza.com.br</p>
    `,
    description: "Saiba como a e-regulariza utiliza cookies e outras tecnologias de rastreamento para melhorar sua experiência em nossa plataforma.",
    lastUpdated: "2025-05-01"
  },
  "termos-de-uso": {
    title: "Termos de Uso",
    content: `
      <h2>Termos de Uso da e-regulariza</h2>
      <p class="mb-4">Última atualização: 01 de Maio de 2025</p>
      
      <h3>1. Aceitação dos Termos</h3>
      <p>Ao acessar ou usar a plataforma e-regulariza, você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá usar nossos serviços.</p>
      
      <h3>2. Descrição dos Serviços</h3>
      <p>A e-regulariza oferece uma plataforma para gerenciamento e acompanhamento de processos de regularização imobiliária. Nossos serviços incluem, mas não se limitam a:</p>
      <ul>
        <li>Gestão de processos de regularização</li>
        <li>Upload e armazenamento de documentos</li>
        <li>Comunicação entre clientes e equipe técnica</li>
        <li>Acompanhamento de status e prazos</li>
      </ul>
      
      <h3>3. Cadastro e Conta</h3>
      <p>Para utilizar nossos serviços, você deve criar uma conta com informações precisas e completas. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrerem em sua conta.</p>
      
      <h3>4. Responsabilidades do Usuário</h3>
      <p>Ao usar nossa plataforma, você concorda em:</p>
      <ul>
        <li>Fornecer informações verdadeiras e documentos autênticos</li>
        <li>Não violar leis ou regulamentos</li>
        <li>Não infringir direitos de propriedade intelectual</li>
        <li>Não interferir no funcionamento normal da plataforma</li>
      </ul>
      
      <h3>5. Limitação de Responsabilidade</h3>
      <p>A e-regulariza não garante que os serviços serão ininterruptos ou isentos de erros. Não somos responsáveis por atrasos causados por terceiros ou órgãos públicos no processo de regularização.</p>
      
      <h3>6. Alterações nos Termos</h3>
      <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão notificadas aos usuários.</p>
      
      <h3>7. Lei Aplicável</h3>
      <p>Estes termos são regidos pelas leis do Brasil.</p>
      
      <h3>8. Contato</h3>
      <p>Para questões sobre estes termos, entre em contato pelo e-mail: contato@eregulariza.com.br</p>
    `,
    description: "Os termos e condições que regem o uso da plataforma e-regulariza, incluindo os direitos e responsabilidades dos usuários e da empresa.",
    lastUpdated: "2025-05-01"
  }
};

export default function PolicyPage() {
  const { policyType } = useParams<{ policyType: string }>();
  const [policy, setPolicy] = useState<PolicyContent | null>(null);
  
  useEffect(() => {
    if (policyType && policyTypes[policyType]) {
      // In a real app, this would fetch from an API or CMS
      // For demo purposes, we're using the static content
      setPolicy(policyTypes[policyType]);
    }
  }, [policyType]);
  
  if (!policy) {
    return (
      <Layout>
        <Helmet>
          <title>Página não encontrada | e-regulariza</title>
          <meta name="description" content="A página solicitada não está disponível." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="container mx-auto py-12 px-4">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-4">Política não encontrada</h1>
            <p>A política solicitada não está disponível.</p>
            <Button asChild className="mt-4">
              <Link to="/">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Voltar para o início
              </Link>
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{policy.title} | e-regulariza</title>
        <meta name="description" content={policy.description} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`${policy.title} | e-regulariza`} />
        <meta property="og:description" content={policy.description} />
        <meta property="og:type" content="article" />
        <meta name="author" content="e-regulariza" />
        <meta name="revisit-after" content="7 days" />
      </Helmet>
      <div className="container mx-auto py-12 px-4">
        <Card className="p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6">{policy.title}</h1>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: policy.content }}
          />
          <div className="mt-8 pt-4 border-t text-sm text-muted-foreground">
            <p>Última atualização: {new Date(policy.lastUpdated).toLocaleDateString()}</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
