import { Metadata } from 'next';
import { cookies } from 'next/headers';
import AppShell from '@/app/components/app-shell/AppShell';
import TutorAppSidebar from '@/app/components/app-shell/TutorAppSidebar';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://studyhours.com/tutor/dashboard',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TutorLayout({ children }: { children: React.ReactNode }) {
  const isAppShell = (await cookies()).get('sh_app')?.value === '1';

  if (isAppShell) {
    return (
      <AppShell sidebar={<TutorAppSidebar />} homePath="/tutor/dashboard">
        {children}
      </AppShell>
    );
  }

  return <>{children}</>;
}
