
export interface FooterLink {
  label: string;
  url: string;
}

export interface SocialLink extends FooterLink {
  platform: string;
}

export interface FooterData {
  about: string;
  companyLinks: FooterLink[];
  serviceLinks: FooterLink[];
  contactInfo: {
    email: string;
    phone: string;
    location: string;
  };
  socialLinks: SocialLink[];
  legalLinks: FooterLink[];
  copyright: string;
  websiteUrl: string;
}
