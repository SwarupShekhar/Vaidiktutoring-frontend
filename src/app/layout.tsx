// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import QueryProvider from "./providers";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import AuthRoleRedirect from "./components/AuthRoleRedirect";
import StyledComponentsRegistry from "./lib/registry";
import { NotificationProvider } from "./context/NotificationContext";
import GlobalNotification from "./components/GlobalNotification";
import VerificationModal from "./components/auth/VerificationModal";
import VerificationBanner from "./components/auth/VerificationBanner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CookieConsentBanner from "./components/CookieConsentBanner";
import GoogleAnalytics from "./components/GoogleAnalytics";
import Script from "next/script";

import { ClerkProvider } from "@clerk/nextjs";
import { Luckiest_Guy, Space_Grotesk, DM_Sans } from "next/font/google";
import { Metadata } from "next";

const luckiestGuy = Luckiest_Guy({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-luckiest-guy",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const dmSans = DM_Sans({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://studyhours.com"),
  title: {
    default: "StudyHours | Outcome-Driven K-12 Tutoring Platform",
    template: "%s | StudyHours",
  },
  description:
    "Expert-guided K-12 tutoring for Math, Science, English and more. Personalized 1-on-1 sessions aligned with IB, IGCSE, and US curricula.",
  verification: {
    google: "QIHTWX5Vy3mZhNRYxfyyTc5YDUOA2DSyS6BCx-7xwy0",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;


  // If Clerk key is missing, show a fallback layout without Clerk
  if (!clerkPublishableKey) {
    console.warn(
      "Clerk publishable key not found. Authentication features will be disabled.",
    );
    return (
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning className={`${luckiestGuy.variable} ${spaceGrotesk.variable} ${dmSans.variable}`}>
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
          <Analytics />
          <SpeedInsights />
          <CookieConsentBanner />
          <GoogleAnalytics />
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning className={`${luckiestGuy.variable} ${spaceGrotesk.variable} ${dmSans.variable}`}>
          <StyledComponentsRegistry>
            <QueryProvider>
              <AuthProvider>
                <AuthRoleRedirect />
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

          <Analytics />
          <SpeedInsights />
          <CookieConsentBanner />
          <GoogleAnalytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
