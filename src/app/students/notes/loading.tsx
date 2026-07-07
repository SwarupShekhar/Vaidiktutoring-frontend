import { cookies } from 'next/headers';
import { AppListSkeleton, WebListSkeleton } from '@/app/components/loading/RouteSkeletons';

// NotesPage branches on useIsAppShell() between a dark app-shell view and a
// light web view — mirror that with the same sh_app cookie check the
// dashboard loading.tsx files use.
export default async function Loading() {
  const isApp = (await cookies()).get('sh_app')?.value === '1';
  if (isApp) return <AppListSkeleton rows={4} columns="sm:grid-cols-2" label="Loading notes…" />;
  return <WebListSkeleton rows={4} columns="sm:grid-cols-2" maxWidth="max-w-4xl" label="Loading notes…" />;
}
