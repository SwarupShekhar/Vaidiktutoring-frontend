import { cookies } from 'next/headers';
import { DashboardLoadingSkeleton } from '@/app/components/dashboard/student/DashboardLoadingSkeleton';
import { AppDashboardSkeleton } from '@/app/components/app-shell/AppDashboardSkeleton';

// Dark app skeleton inside the desktop shell, light web skeleton on the site.
export default async function Loading() {
  const isApp = (await cookies()).get('sh_app')?.value === '1';
  return isApp ? <AppDashboardSkeleton /> : <DashboardLoadingSkeleton />;
}
