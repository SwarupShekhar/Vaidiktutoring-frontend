import { cookies } from 'next/headers';
import AppShell from '@/app/components/app-shell/AppShell';

export default async function PricingLayout({ children }: { children: React.ReactNode }) {
  // Inside the desktop app, wrap pricing in the native shell (sidebar + back +
  // dark frame) so upgrading happens in-app. Web is unchanged.
  const isAppShell = (await cookies()).get('sh_app')?.value === '1';

  if (isAppShell) {
    return <AppShell>{children}</AppShell>;
  }

  return <>{children}</>;
}
