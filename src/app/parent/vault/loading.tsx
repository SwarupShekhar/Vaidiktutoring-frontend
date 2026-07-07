import { AppListSkeleton } from '@/app/components/loading/RouteSkeletons';

// ParentVaultPage always renders the dark app-shell UI (AppPage/AppCard),
// on web and in the desktop app alike — no isAppShell branch to match here.
export default function Loading() {
  return <AppListSkeleton rows={6} columns="sm:grid-cols-2 lg:grid-cols-3" label="Loading vault…" />;
}
