
import { useEffect, useState } from 'react';

interface RecaptchaWrapperProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  siteKey?: string;
}

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad: () => void;
  }
}

export default function RecaptchaWrapper({ onVerify, onExpire, siteKey }: RecaptchaWrapperProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [widgetId, setWidgetId] = useState<number | null>(null);

  const recaptchaSiteKey = siteKey || localStorage.getItem('recaptcha_site_key') || '';

  useEffect(() => {
    if (!recaptchaSiteKey) return;

    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
    script.async = true;
    script.defer = true;

    // Define callback function
    window.onRecaptchaLoad = () => {
      setIsLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      delete window.onRecaptchaLoad;
    };
  }, [recaptchaSiteKey]);

  useEffect(() => {
    if (isLoaded && window.grecaptcha && recaptchaSiteKey) {
      const id = window.grecaptcha.render('recaptcha-container', {
        sitekey: recaptchaSiteKey,
        callback: onVerify,
        'expired-callback': onExpire,
        theme: 'light',
        size: 'normal'
      });
      setWidgetId(id);
    }
  }, [isLoaded, onVerify, onExpire, recaptchaSiteKey]);

  const reset = () => {
    if (window.grecaptcha && widgetId !== null) {
      window.grecaptcha.reset(widgetId);
    }
  };

  if (!recaptchaSiteKey) {
    return (
      <div className="text-sm text-gray-500 italic">
        Configure a chave do reCAPTCHA nas configurações do sistema
      </div>
    );
  }

  return (
    <div className="my-4">
      <div id="recaptcha-container"></div>
    </div>
  );
}

export { RecaptchaWrapper };
