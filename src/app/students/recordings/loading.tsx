import { cookies } from 'next/headers';
import { AppListSkeleton, WebListSkeleton } from '@/app/components/loading/RouteSkeletons';

// RecordingsPage branches on useIsAppShell() between a dark app-shell view
// and a light web view — mirror that with the same sh_app cookie check the
// dashboard loading.tsx files use.
export default async function Loading() {
  const isApp = (await cookies()).get('sh_app')?.value === '1';
  const columns = 'sm:grid-cols-2 lg:grid-cols-3';
  if (isApp) return <AppListSkeleton rows={6} columns={columns} label="Loading recordings…" />;
  return <WebListSkeleton rows={6} columns={columns} label="Loading recordings…" />;
}
