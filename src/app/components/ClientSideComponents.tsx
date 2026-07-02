'use client';

import dynamic from "next/dynamic";

const CookieConsentBanner = dynamic(() => import("./CookieConsentBanner"), { ssr: false });
const GoogleAnalytics = dynamic(() => import("./GoogleAnalytics"), { ssr: false });
const GlobalNotification = dynamic(() => import("./GlobalNotification"), { ssr: false });
const VerificationModal = dynamic(() => import("./auth/VerificationModal"), { ssr: false });
const VerificationBanner = dynamic(() => import("./auth/VerificationBanner"), { ssr: false });
const AuthRoleRedirect = dynamic(() => import("./AuthRoleRedirect"), { ssr: false });

import { useEffect } from 'react';

export function ClientSideComponents() {
  useEffect(() => {
    // Notify Electron that the React app has hydrated and is ready to be shown.
    // Skip if we're on a transient 404 (not-found sets __shSuppressReady) so the
    // splash keeps covering the bad route instead of revealing it. The next real
    // route's hydrate — or main.js's 8s fallback — reveals the window.
    if (typeof window !== 'undefined' && (window as any).electron?.windowReady) {
      if ((window as any).__shSuppressReady) return;
      (window as any).electron.windowReady();
    }
  }, []);

  return (
    <>
      <AuthRoleRedirect />
      <VerificationBanner />
      <GlobalNotification />
      <VerificationModal />
      <CookieConsentBanner />
      <GoogleAnalytics />
    </>
  );
}
