
import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { Facebook, Instagram, Linkedin } from "lucide-react";

// This would normally come from an API/CMS
// For now we'll use static data that would typically be fetched from Supabase or another CMS
const footerContent = {
  about: "Transformando a experiência de regularização imobiliária em algo simples, transparente e confiável.",
  companyLinks: [
    { label: "Sobre nós", url: "/sobre" },
    { label: "Casos de sucesso", url: "/cases" },
    { label: "Blog", url: "/blog" },
    { label: "Carreiras", url: "/carreiras" }
  ],
  serviceLinks: [
    { label: "Usucapião Extrajudicial", url: "/servicos/usucapiao-extrajudicial" },
    { label: "Incorporação Imobiliária", url: "/servicos/incorporacao-imobiliaria" },
    { label: "Due Diligence", url: "/servicos/due-diligence" },
    { label: "Reurb", url: "/servicos/reurb" }
  ],
  contactInfo: {
    email: "sac@e-regulariza.com",
    phone: "+55 (21) 99901-1999",
    location: "Itaguaí, RJ"
  },
  socialLinks: [
    { platform: "Facebook", url: "https://www.facebook.com/eregulariza", icon: <Facebook className="h-5 w-5" /> },
    { platform: "Instagram", url: "https://www.instagram.com/e_regulariza/#", icon: <Instagram className="h-5 w-5" /> },
    { platform: "LinkedIn", url: "https://www.linkedin.com/company/e-regulariza/", icon: <Linkedin className="h-5 w-5" /> }
  ],
  legalLinks: [
    { label: "Política de Privacidade", url: "/politica-de-privacidade" },
    { label: "Termos de Uso", url: "/termos-de-uso" },
    { label: "Política de Cookies", url: "/politica-de-cookies" }
  ],
  copyright: "© 2025 e-regulariza. Todos os direitos reservados."
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="inline-block" aria-label="e-regulariza">
              <Logo variant="without-circle" size="lg" />
            </Link>
            <p className="text-sm text-gray-500">
              {footerContent.about}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-eregulariza-gray">Empresa</h3>
            <ul className="space-y-2">
              {footerContent.companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.url} className="text-gray-500 hover:text-eregulariza-primary text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-eregulariza-gray">Serviços</h3>
            <ul className="space-y-2">
              {footerContent.serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.url} className="text-gray-500 hover:text-eregulariza-primary text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-eregulariza-gray">Contato</h3>
            <ul className="space-y-2">
              <li className="text-gray-500 text-sm">
                {footerContent.contactInfo.email}
              </li>
              <li className="text-gray-500 text-sm">
                {footerContent.contactInfo.phone}
              </li>
              <li className="text-gray-500 text-sm">
                {footerContent.contactInfo.location}
              </li>
              <li className="flex space-x-3 mt-4">
                {footerContent.socialLinks.map((social) => (
                  <a 
                    key={social.platform} 
                    href={social.url} 
                    className="text-gray-500 hover:text-eregulariza-primary transition-colors"
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={`Visite nossa página no ${social.platform}`}
                  >
                    <span className="sr-only">{social.platform}</span>
                    {social.icon}
                  </a>
                ))}
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-gray-500">
            {footerContent.copyright.replace("2025", currentYear.toString())}
          </p>
          <div className="flex space-x-4">
            {footerContent.legalLinks.map((link) => (
              <Link key={link.label} to={link.url} className="text-xs text-gray-500 hover:text-eregulariza-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
