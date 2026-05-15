'use client';

import dynamic from "next/dynamic";

const CookieConsentBanner = dynamic(() => import("./CookieConsentBanner"), { ssr: false });
const GoogleAnalytics = dynamic(() => import("./GoogleAnalytics"), { ssr: false });
const GlobalNotification = dynamic(() => import("./GlobalNotification"), { ssr: false });
const VerificationModal = dynamic(() => import("./auth/VerificationModal"), { ssr: false });
const VerificationBanner = dynamic(() => import("./auth/VerificationBanner"), { ssr: false });
const AuthRoleRedirect = dynamic(() => import("./AuthRoleRedirect"), { ssr: false });

export function ClientSideComponents() {
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
