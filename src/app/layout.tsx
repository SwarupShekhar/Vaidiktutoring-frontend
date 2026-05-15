// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import QueryProvider from "./providers";
import { AuthProvider } from "./context/AuthContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import StyledComponentsRegistry from "./lib/registry";
import { NotificationProvider } from "./context/NotificationContext";

const Navbar = dynamic(() => import("./components/navbar"), { ssr: true });
const Footer = dynamic(() => import("./components/Footer"), { ssr: true });
const CookieConsentBanner = dynamic(() => import("./components/CookieConsentBanner"), { ssr: false });
const GoogleAnalytics = dynamic(() => import("./components/GoogleAnalytics"), { ssr: false });
const GlobalNotification = dynamic(() => import("./components/GlobalNotification"), { ssr: false });
const VerificationModal = dynamic(() => import("./components/auth/VerificationModal"), { ssr: false });
const VerificationBanner = dynamic(() => import("./components/auth/VerificationBanner"), { ssr: false });
const AuthRoleRedirect = dynamic(() => import("./components/AuthRoleRedirect"), { ssr: false });



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
