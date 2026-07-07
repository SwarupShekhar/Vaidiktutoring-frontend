// Server-safe (no hooks, no 'use client') skeleton primitives shared by route
// `loading.tsx` files across the app. Two families:
//   - App*  : dark app-shell look, rendered when the `sh_app` cookie is set
//             (mirrors AppDashboardSkeleton / ui/AppSkeleton's card surface)
//   - Web*  : website look, rendered otherwise (uses the same bg-surface /
//             border-border / gray-200 dark:gray-800 tokens the web pages
//             and VaultManagementSection already use for their own inline
//             loading states)
//
// Kept free of client-only APIs (no framer-motion, no hooks) so a route's
// `loading.tsx` (an async server component) can render these directly
// without adding an extra client boundary before the real page mounts.

function AppSkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-white/[0.06] ${className}`} />;
}

function AppSkeletonGridCard() {
  return (
    <div
      className="animate-pulse rounded-2xl p-5"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="mb-4 h-10 w-10 rounded-xl bg-white/[0.06]" />
      <div className="mb-2 h-5 w-3/4 rounded bg-white/[0.06]" />
      <div className="h-4 w-1/2 rounded bg-white/[0.06]" />
    </div>
  );
}

/**
 * Dark app-shell list/grid skeleton: icon + title header, then a card grid.
 * Use for list-shaped pages (recordings, notes, vault, child space) in their
 * `isAppShell` state.
 */
export function AppListSkeleton({
  rows = 4,
  columns = 'sm:grid-cols-2 lg:grid-cols-3',
  label = 'Loading…',
}: {
  rows?: number;
  columns?: string;
  label?: string;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      <div className="mx-auto max-w-6xl space-y-6" aria-hidden="true">
        <div className="flex items-center gap-4">
          <AppSkeletonBlock className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <AppSkeletonBlock className="h-6 w-48" />
            <AppSkeletonBlock className="h-4 w-64" />
          </div>
        </div>
        <div className={`grid gap-4 ${columns}`}>
          {Array.from({ length: rows }).map((_, i) => (
            <AppSkeletonGridCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Website list/grid skeleton: icon + title header, then a card grid, using
 * the same bg-surface / border-border / gray-200 dark:gray-800 tokens the
 * pages themselves use so it also respects the site's own light/dark toggle.
 */
export function WebListSkeleton({
  rows = 4,
  columns = 'sm:grid-cols-2 lg:grid-cols-3',
  maxWidth = 'max-w-5xl',
  label = 'Loading…',
}: {
  rows?: number;
  columns?: string;
  maxWidth?: string;
  label?: string;
}) {
  return (
    <div
      className="min-h-screen bg-background p-4 md:p-8 animate-pulse"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{label}</span>
      <div className={`mx-auto space-y-8 ${maxWidth}`} aria-hidden="true">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-2">
            <div className="h-7 w-48 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-64 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
        <div className={`grid grid-cols-1 gap-4 ${columns}`}>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-5">
              <div className="mb-4 h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-800" />
              <div className="mb-2 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Dark app-shell form/profile skeleton: avatar + name block, then a card of
 * labeled field placeholders.
 */
export function AppFormSkeleton({ fields = 6, label = 'Loading profile…' }: { fields?: number; label?: string }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      <div className="mx-auto max-w-3xl space-y-6" aria-hidden="true">
        <div className="flex items-center gap-4">
          <AppSkeletonBlock className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <AppSkeletonBlock className="h-6 w-40" />
            <AppSkeletonBlock className="h-4 w-56" />
          </div>
        </div>
        <div
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {Array.from({ length: fields }).map((_, i) => (
              <div key={i} className="space-y-2">
                <AppSkeletonBlock className="h-3 w-20" />
                <AppSkeletonBlock className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Website form/profile skeleton: avatar + name block, then a card of labeled
 * field placeholders, using the same light/dark-adaptive tokens as the web
 * profile pages.
 */
export function WebFormSkeleton({ fields = 6, label = 'Loading profile…' }: { fields?: number; label?: string }) {
  return (
    <div
      className="min-h-screen bg-background p-4 md:p-8 animate-pulse"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{label}</span>
      <div className="mx-auto max-w-3xl space-y-6" aria-hidden="true">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-2">
            <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-56 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {Array.from({ length: fields }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-10 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
