'use client';

import AppSidebar from './AppSidebar';
import ParentAppSidebar from './ParentAppSidebar';
import TutorAppSidebar from './TutorAppSidebar';
import NotificationBell from './NotificationBell';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuthContext } from '@/app/context/AuthContext';

export default function AppShell({
  children,
  sidebar,
  homePath,
}: {
  children: React.ReactNode;
  /** Role-specific sidebar. When omitted, picked from the signed-in user's role. */
  sidebar?: React.ReactNode;
  /** Home route for this role — no Back affordance is shown on it. */
  homePath?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthContext();
  const role = user?.role;

  // Shared layouts (pricing/checkout/bookings) mount a BARE <AppShell> with no
  // sidebar/homePath. Without role-awareness a parent/tutor would get the student
  // sidebar there, whose "Home" -> /students/dashboard 403s them. So when a caller
  // doesn't pass these, derive them from the actual role. Role dashboards that pass
  // explicit props are unaffected.
  const effectiveSidebar =
    sidebar ??
    (role === 'parent' ? <ParentAppSidebar /> : role === 'tutor' ? <TutorAppSidebar /> : <AppSidebar />);
  const effectiveHome =
    homePath ??
    (role === 'parent' ? '/parent/dashboard' : role === 'tutor' ? '/tutor/dashboard' : '/students/dashboard');

  // Show a back affordance on every page except the home dashboard.
  const showBack = pathname !== effectiveHome;

  // A faint per-role hue over the near-black base — a subtle way to tell the
  // three experiences apart at a glance. Tutor = green, student = warm amber,
  // parent = indigo. Unknown/logged-out stays neutral.
  const hue =
    role === 'tutor'
      ? { base: '#070d0a', glow: '16, 185, 129' }
      : role === 'parent'
        ? { base: '#0a0912', glow: '129, 140, 248' }
        : role === 'student'
          ? { base: '#100c07', glow: '245, 158, 11' }
          : { base: '#0a0a0f', glow: '148, 163, 184' };
  const mainBg = `radial-gradient(120% 60% at 50% 0%, rgba(${hue.glow}, 0.05) 0%, rgba(${hue.glow}, 0) 55%), ${hue.base}`;

  return (
    <div
      className="grid grid-cols-[220px_1fr] overflow-hidden"
      style={{ height: 'calc(100vh - 32px)', background: hue.base }}
    >
      {/* Persistent sidebar — does not scroll with content */}
      <div style={{ height: 'calc(100vh - 32px)' }}>
        {effectiveSidebar}
      </div>

      {/* Main content — the ONLY scrollable region */}
      <main
        className="app-shell-scroll overflow-y-auto overflow-x-hidden"
        style={{ height: 'calc(100vh - 32px)', background: mainBg }}
      >
        {/* Inner-page top bar: Back on the left, notification bell on the right.
            The HOME dashboard renders NO bar here — an empty full-width band read
            as a website navbar and ate vertical space. On home the bell lives in
            the dashboard's own header (AppTopBar / tutor header) instead. */}
        {showBack && (
          <div
            className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 px-4 py-2 backdrop-blur"
            style={{ background: `${hue.base}d9` /* ~85% opaque */ }}
          >
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <NotificationBell />
          </div>
        )}
        {children}
      </main>

      {/* Subtle, dark thin scrollbar for the native feel */}
      <style jsx global>{`
        .app-shell-scroll::-webkit-scrollbar {
          width: 10px;
        }
        .app-shell-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .app-shell-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.18);
          border-radius: 9999px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .app-shell-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(148, 163, 184, 0.35);
          background-clip: padding-box;
        }
        .app-shell-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.25) transparent;
        }
      `}</style>
    </div>
  );
}
