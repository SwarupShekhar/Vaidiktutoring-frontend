// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import QueryProvider from "./providers";
import { AuthProvider } from "./context/AuthContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NotificationProvider } from "./context/NotificationContext";

import { ClientSideComponents } from "./components/ClientSideComponents";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";



import { ClerkProvider } from "@clerk/nextjs";
import { Luckiest_Guy, Space_Grotesk, DM_Sans } from "next/font/google";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

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

export default async function RootLayout({ children }: { children: ReactNode }) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isDraftMode = (await draftMode()).isEnabled;

  // If Clerk key is missing, show a fallback layout without Clerk
  if (!clerkPublishableKey) {
    console.warn(
      "Clerk publishable key not found. Authentication features will be disabled.",
    );
    return (
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning className={`${luckiestGuy.variable} ${spaceGrotesk.variable} ${dmSans.variable}`}>
          <QueryProvider>
              <AuthProvider>
                <NotificationProvider>
                  <ClientSideComponents />
                  <Navbar />
                  {children}
                  {isDraftMode && <VisualEditing />}
                  <Footer />
                </NotificationProvider>
              </AuthProvider>
            </QueryProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* ── Preconnect to critical third-party origins for faster resource loading ── */}
          <link rel="preconnect" href="https://res.cloudinary.com" />
          <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://clerk.studyhours.com" />
          <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        </head>
        <body suppressHydrationWarning className={`${luckiestGuy.variable} ${spaceGrotesk.variable} ${dmSans.variable}`}>
          <QueryProvider>
              <AuthProvider>
                <NotificationProvider>
                  <ClientSideComponents />
                  <Navbar />
                  {children}
                  {isDraftMode && <VisualEditing />}
                  <Footer />
                </NotificationProvider>
              </AuthProvider>
            </QueryProvider>

          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
