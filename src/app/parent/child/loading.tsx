import { AppListSkeleton } from '@/app/components/loading/RouteSkeletons';

// Backs the /parent/child/[childId] dynamic segment, which always renders
// the dark app-shell UI (AppPage/AppCard) — no isAppShell branch to match.
export default function Loading() {
  return <AppListSkeleton rows={3} columns="sm:grid-cols-2 lg:grid-cols-3" label="Loading child space…" />;
}
