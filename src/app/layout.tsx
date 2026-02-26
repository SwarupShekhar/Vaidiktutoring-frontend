// src/app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import QueryProvider from './providers';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import AdminRedirect from './components/AdminRedirect';
import Script from 'next/script';
import StyledComponentsRegistry from './lib/registry';
import { NotificationProvider } from './context/NotificationContext';
import GlobalNotification from './components/GlobalNotification';
import VerificationModal from './components/auth/VerificationModal';
import VerificationBanner from './components/auth/VerificationBanner';
import { Analytics } from '@vercel/analytics/next';

import { ClerkProvider } from '@clerk/nextjs';

import { Luckiest_Guy } from 'next/font/google';

const luckiestGuy = Luckiest_Guy({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-luckiest-guy',
});

export const metadata = {
  title: 'StudyHours',
  description: 'StudyHours Platform',
  verification: {
    google: 'QIHTWX5Vy3mZhNRYxfyyTc5YDUOA2DSyS6BCx-7xwy0',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
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
          <Analytics />
        </body>
      </html >
    </ClerkProvider>
  );
}