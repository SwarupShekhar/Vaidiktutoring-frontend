import { cookies } from 'next/headers';
import { AppFormSkeleton, WebFormSkeleton } from '@/app/components/loading/RouteSkeletons';

// TutorProfilePage branches on useIsAppShell() between a dark app-shell view
// and a light web view — mirror that with the same sh_app cookie check the
// dashboard loading.tsx files use.
export default async function Loading() {
  const isApp = (await cookies()).get('sh_app')?.value === '1';
  if (isApp) return <AppFormSkeleton label="Loading profile…" />;
  return <WebFormSkeleton label="Loading profile…" />;
}
