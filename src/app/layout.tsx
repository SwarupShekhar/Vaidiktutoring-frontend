// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import QueryProvider from "./providers";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import AdminRedirect from "./components/AdminRedirect";
import Script from "next/script";
import StyledComponentsRegistry from "./lib/registry";
import { NotificationProvider } from "./context/NotificationContext";
import GlobalNotification from "./components/GlobalNotification";
import VerificationModal from "./components/auth/VerificationModal";
import VerificationBanner from "./components/auth/VerificationBanner";
import { Analytics } from "@vercel/analytics/next";

import { ClerkProvider } from "@clerk/nextjs";

import { Luckiest_Guy } from "next/font/google";

const luckiestGuy = Luckiest_Guy({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-luckiest-guy",
});

export const metadata = {
  title: "StudyHours",
  description: "StudyHours Platform",
  alternates: {
    canonical: "https://studyhours.com",
  },
  verification: {
    google: "QIHTWX5Vy3mZhNRYxfyyTc5YDUOA2DSyS6BCx-7xwy0",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // Log current domain for debugging
  if (typeof window !== 'undefined') {
    console.log('[Clerk] Current domain:', window.location.origin);
    console.log('[Clerk] Publishable key present:', !!clerkPublishableKey);
  }
  
  // If Clerk key is missing, show a fallback layout without Clerk
  if (!clerkPublishableKey) {
    console.warn('Clerk publishable key not found. Authentication features will be disabled.');
    return (
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning className={`${luckiestGuy.variable}`}>
          <StyledComponentsRegistry>
            <QueryProvider>
              <AuthProvider>
                <NotificationProvider>
                  <Navbar />
                  {children}
                  <Footer />
                </NotificationProvider>
              </AuthProvider>
            </QueryProvider>
          </StyledComponentsRegistry>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning className={`${luckiestGuy.variable}`}>
          <StyledComponentsRegistry>
            <QueryProvider>
              <AuthProvider>
                <AdminRedirect />
                <NotificationProvider>
                  <Navbar />
                  <VerificationBanner />
                  <GlobalNotification />
                  <VerificationModal />
                  {children}
                  <Footer />
                </NotificationProvider>
              </AuthProvider>
            </QueryProvider>
          </StyledComponentsRegistry>
          <Script
            id="organization-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "StudyHours",
                url: "https://studyhours.com",
                logo: "https://studyhours.com/Studuhourslogo.svg",
                description:
                  "StudyHours is a structured, outcome-driven K-12 tutoring platform that blends expert educators with intelligent learning systems.",
                sameAs: [
                  "https://twitter.com/studyhours",
                  "https://facebook.com/studyhours",
                  "https://linkedin.com/company/studyhours",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+1-555-0123",
                  contactType: "customer service",
                  email: "support@studyhours.com",
                },
              }),
            }}
          />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
