import { Metadata } from 'next';
import { cookies } from 'next/headers';
import AppShell from '@/app/components/app-shell/AppShell';
import ParentAppSidebar from '@/app/components/app-shell/ParentAppSidebar';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://studyhours.com/parent/dashboard',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const isAppShell = (await cookies()).get('sh_app')?.value === '1';

  if (isAppShell) {
    return (
      <AppShell sidebar={<ParentAppSidebar />} homePath="/parent/dashboard">
        {children}
      </AppShell>
    );
  }

  return <>{children}</>;
}
