
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export default function SEOHead({
  title = "e-regulariza - Regularização Imobiliária Digital",
  description = "Simplifique sua regularização imobiliária com nossa plataforma digital. Acompanhe processos em tempo real com total transparência.",
  canonical,
  keywords = "regularização imobiliária, usucapião, inventário extrajudicial, retificação de área, digital, transparente",
  ogImage = "https://images.unsplash.com/photo-1527576539890-dfa815648363",
  noIndex = false
}: SEOHeadProps) {
  const currentUrl = canonical || window.location.href;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={currentUrl} />
      
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
