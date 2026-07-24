// Server-safe (no hooks) dark loading skeleton that matches the desktop app-shell
// homescreen, so the Suspense fallback doesn't flash the light website skeleton
// inside the app. Route loading.tsx files pick this when the `sh_app` cookie is set.
export function AppDashboardSkeleton({ themeAware = false }: { themeAware?: boolean }) {
  return (
    <div className={`min-h-screen ${themeAware ? '' : 'bg-slate-50 dark:bg-[#0a0a0f]'} p-6`}>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2.5">
            <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200 dark:bg-white/10" />
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-white/[0.06]" />
          </div>
          <div className="h-9 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
        </div>

        {/* hero next-class band */}
        <div className="h-40 w-full animate-pulse rounded-3xl bg-slate-200 dark:bg-white/[0.06]" />

        {/* stat / bento grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/[0.05]" />
          ))}
        </div>
      </div>
    </div>
  );
}
