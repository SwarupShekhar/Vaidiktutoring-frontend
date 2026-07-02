import { Metadata } from 'next';
import { cookies } from 'next/headers';
import AppShell from '@/app/components/app-shell/AppShell';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://studyhours.com/bookings/new',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BookingsLayout({ children }: { children: React.ReactNode }) {
  // Inside the desktop app, wrap booking pages in the same shell as the rest of the
  // app (persistent sidebar + back button + dark frame). Web is unchanged.
  const isAppShell = (await cookies()).get('sh_app')?.value === '1';

  if (isAppShell) {
    return <AppShell>{children}</AppShell>;
  }

  return <>{children}</>;
}
