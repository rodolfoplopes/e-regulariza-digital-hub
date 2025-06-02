
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface GTMManagerProps {
  gtmId?: string;
}

export default function GTMManager({ gtmId }: GTMManagerProps) {
  useEffect(() => {
    if (!gtmId) return;

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // GTM script injection
    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [gtmId]);

  if (!gtmId) return null;

  return (
    <Helmet>
      <noscript>
        <iframe 
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0" 
          width="0" 
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </Helmet>
  );
}

// Helper function to track events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...parameters
    });
  }
};

// Predefined tracking events for e-regulariza
export const trackingEvents = {
  // User engagement
  pageView: (page: string) => trackEvent('page_view', { page }),
  userRegistration: (method: string) => trackEvent('user_registration', { method }),
  userLogin: (method: string) => trackEvent('user_login', { method }),
  
  // Process tracking
  processStart: (processType: string) => trackEvent('process_start', { process_type: processType }),
  processStageComplete: (processId: string, stage: string) => trackEvent('process_stage_complete', { 
    process_id: processId, 
    stage 
  }),
  processComplete: (processId: string, processType: string) => trackEvent('process_complete', { 
    process_id: processId, 
    process_type: processType 
  }),
  
  // Document interactions
  documentUpload: (documentType: string) => trackEvent('document_upload', { document_type: documentType }),
  documentDownload: (documentType: string) => trackEvent('document_download', { document_type: documentType }),
  
  // Communication
  chatMessage: (userType: 'client' | 'admin') => trackEvent('chat_message', { user_type: userType }),
  
  // Admin actions
  adminAction: (action: string, target: string) => trackEvent('admin_action', { action, target })
};

declare global {
  interface Window {
    dataLayer: any[];
  }
}
