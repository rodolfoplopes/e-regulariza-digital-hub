
import { useState } from "react";
import { FooterData } from "@/types/footer";

// Initial footer data - in a real app this would be fetched from an API/database
const initialFooterData: FooterData = {
  about: "Transformando a experiência de regularização imobiliária em algo simples, transparente e confiável.",
  companyLinks: [
    { label: "Sobre nós", url: "/sobre" },
    { label: "Casos de sucesso", url: "/cases" },
    { label: "Blog", url: "/blog" },
    { label: "Carreiras", url: "/carreiras" }
  ],
  serviceLinks: [
    { label: "Usucapião", url: "/servicos/usucapiao" },
    { label: "Inventário Extrajudicial", url: "/servicos/inventario" },
    { label: "Retificação de Área", url: "/servicos/retificacao" },
    { label: "Demarcação de Imóvel", url: "/servicos/demarcacao" }
  ],
  contactInfo: {
    email: "contato@eregulariza.com.br",
    phone: "+55 (11) 9999-9999",
    location: "São Paulo, SP"
  },
  socialLinks: [
    { platform: "Facebook", label: "Facebook", url: "https://facebook.com/eregulariza" },
    { platform: "Instagram", label: "Instagram", url: "https://instagram.com/eregulariza" },
    { platform: "LinkedIn", label: "LinkedIn", url: "https://linkedin.com/company/eregulariza" }
  ],
  legalLinks: [
    { label: "Política de Privacidade", url: "/privacidade" },
    { label: "Termos de Uso", url: "/termos" },
    { label: "Política de Cookies", url: "/cookies" }
  ],
  copyright: "© 2025 e-regulariza. Todos os direitos reservados.",
  websiteUrl: "https://www.e-regulariza.com"
};

export function useFooterState() {
  const [footerData, setFooterData] = useState<FooterData>(initialFooterData);
  
  const updateContactInfo = (field: keyof typeof footerData.contactInfo, value: string) => {
    setFooterData({
      ...footerData,
      contactInfo: {
        ...footerData.contactInfo,
        [field]: value
      }
    });
  };

  const addLink = (section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks') => {
    if (section === 'socialLinks') {
      setFooterData({
        ...footerData,
        [section]: [...footerData[section], { platform: '', label: '', url: '' }]
      });
    } else {
      setFooterData({
        ...footerData,
        [section]: [...footerData[section], { label: '', url: '' }]
      });
    }
  };

  const updateLink = (
    section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks',
    index: number,
    field: string,
    value: string
  ) => {
    const updatedLinks = [...footerData[section]];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    
    setFooterData({
      ...footerData,
      [section]: updatedLinks
    });
  };

  const removeLink = (
    section: 'companyLinks' | 'serviceLinks' | 'legalLinks' | 'socialLinks',
    index: number
  ) => {
    setFooterData({
      ...footerData,
      [section]: footerData[section].filter((_, i) => i !== index)
    });
  };

  return {
    footerData,
    setFooterData,
    updateContactInfo,
    addLink,
    updateLink,
    removeLink
  };
}
