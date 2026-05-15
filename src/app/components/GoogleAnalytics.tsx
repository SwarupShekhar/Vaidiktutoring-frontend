'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function GoogleAnalytics() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    // Check for consent on mount and when it changes
    const checkConsent = () => {
      const storedConsent = localStorage.getItem('studyhours_cookie_consent');
      setConsent(storedConsent);
    };

    checkConsent();

    // Listen for custom event or storage changes if needed
    window.addEventListener('storage', checkConsent);
    window.addEventListener('cookie-consent-updated', checkConsent);

    return () => {
      window.removeEventListener('storage', checkConsent);
      window.removeEventListener('cookie-consent-updated', checkConsent);
    };
  }, []);

  if (consent !== 'accepted') {
    return null;
  }

  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-N9YTHTRMH1"
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-N9YTHTRMH1', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
