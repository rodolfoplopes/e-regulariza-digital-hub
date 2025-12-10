import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const footerContent = {
  about: "Transformando a experiência de regularização imobiliária em algo simples, transparente e confiável.",
  companyLinks: [
    { label: "Sobre nós", url: "/sobre" },
    { label: "Casos de sucesso", url: "/cases" },
    { label: "Blog", url: "/blog" },
    { label: "Carreiras", url: "/carreiras" }
  ],
  serviceLinks: [
    { label: "Usucapião Extrajudicial", url: "/servicos#usucapiao" },
    { label: "Incorporação Imobiliária", url: "/servicos#incorporacao" },
    { label: "Due Diligence", url: "/servicos#duediligence" },
    { label: "Reurb", url: "/servicos#reurb" }
  ],
  contactInfo: {
    email: "sac@e-regulariza.com",
    phone: "+55 (21) 99901-1999",
    location: "Itaguaí, RJ"
  },
  legalLinks: [
    { label: "Política de Privacidade", url: "/politica-de-privacidade" },
    { label: "Termos de Uso", url: "/termos-de-uso" },
    { label: "Política de Cookies", url: "/politica-de-cookies" }
  ],
  copyright: "© 2025 e-regulariza. Todos os direitos reservados."
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappLink = "https://wa.me/5521999011999";

  return (
    <footer className="bg-gradient-to-r from-[#4318FF] to-[#00D9A5]">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="inline-block" aria-label="e-regulariza">
              <Logo variant="gradient" size="lg" />
            </Link>
            <p className="text-sm text-white/80">
              {footerContent.about}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white">Empresa</h3>
            <ul className="space-y-2">
              {footerContent.companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.url} className="text-white/70 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white">Serviços</h3>
            <ul className="space-y-2">
              {footerContent.serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.url} className="text-white/70 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white">Contato</h3>
            <ul className="space-y-2">
              <li>
                <a href={`mailto:${footerContent.contactInfo.email}`} className="text-white/70 hover:text-white text-sm transition-colors">
                  {footerContent.contactInfo.email}
                </a>
              </li>
              <li>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm transition-colors">
                  {footerContent.contactInfo.phone}
                </a>
              </li>
              <li className="text-white/70 text-sm">
                {footerContent.contactInfo.location}
              </li>
              <li className="flex gap-3 mt-4">
                <a 
                  href="https://www.facebook.com/eregulariza" 
                  className="text-white/70 hover:text-white transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.instagram.com/e_regulariza" 
                  className="text-white/70 hover:text-white transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/company/e-regulariza/" 
                  className="text-white/70 hover:text-white transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/70">
            {footerContent.copyright.replace("2025", currentYear.toString())}
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            {footerContent.legalLinks.map((link) => (
              <Link key={link.label} to={link.url} className="text-xs text-white/70 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
