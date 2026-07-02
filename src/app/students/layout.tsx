import { Metadata } from 'next';
import { cookies } from 'next/headers';
import AppShell from '@/app/components/app-shell/AppShell';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://studyhours.com/students/dashboard',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function StudentsLayout({ children }: { children: React.ReactNode }) {
  const isAppShell = (await cookies()).get('sh_app')?.value === '1';

  if (isAppShell) {
    return <AppShell>{children}</AppShell>;
  }

  return <>{children}</>;
}
