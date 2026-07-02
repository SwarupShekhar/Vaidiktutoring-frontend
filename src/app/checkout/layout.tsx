import { Metadata } from 'next';
import { cookies } from 'next/headers';
import AppShell from '@/app/components/app-shell/AppShell';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  // Inside the desktop app, wrap checkout in the native shell so upgrading happens
  // in-app (Razorpay runs in the renderer). Web is unchanged.
  const isAppShell = (await cookies()).get('sh_app')?.value === '1';

  if (isAppShell) {
    return <AppShell>{children}</AppShell>;
  }

  return <>{children}</>;
}
