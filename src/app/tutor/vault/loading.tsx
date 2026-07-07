import { WebListSkeleton } from '@/app/components/loading/RouteSkeletons';

// TutorVaultPage renders VaultManagementSection unconditionally (no
// isAppShell branch — it's the same admin-style UI on web and in the app),
// and that component's own inline loading state already uses the same
// bg-surface/border-border/gray-200 dark:gray-800 tokens WebListSkeleton
// uses, so no cookie check is needed here.
export default function Loading() {
  return <WebListSkeleton rows={3} columns="md:grid-cols-2 lg:grid-cols-3" label="Loading vault…" />;
}
