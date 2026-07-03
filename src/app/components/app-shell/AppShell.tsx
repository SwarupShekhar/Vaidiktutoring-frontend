'use client';

import AppSidebar from './AppSidebar';
import ParentAppSidebar from './ParentAppSidebar';
import TutorAppSidebar from './TutorAppSidebar';
import NotificationBell from './NotificationBell';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, Crown, Clock } from 'lucide-react';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { useAuthContext } from '@/app/context/AuthContext';
import { useCreditStatus } from '@/app/Hooks/useCreditStatus';
import { getPlanBadge, planDaysSuffix } from '@/app/lib/plan';
import type { CreditStatus } from '@/app/types/credits';

// Maps the shared plan tone → app-shell (dark) palette. Mirrors AppTopBar.
const TONE_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  paid: { bg: 'rgba(129,140,248,0.14)', border: 'rgba(129,140,248,0.35)', text: 'rgb(165,180,252)' },
  trial: { bg: 'rgba(16,185,129,0.14)', border: 'rgba(16,185,129,0.35)', text: 'rgb(52,211,153)' },
  warning: { bg: 'rgba(245,158,11,0.14)', border: 'rgba(245,158,11,0.35)', text: 'rgb(251,191,36)' },
  none: { bg: 'rgba(148,163,184,0.14)', border: 'rgba(148,163,184,0.3)', text: 'rgb(148,163,184)' },
};

function PlanBadge({ credit }: { credit?: CreditStatus | null }) {
  const info = getPlanBadge(credit);
  if (!info) return null;
  const s = TONE_STYLE[info.tone] ?? TONE_STYLE.none;
  const suffix = planDaysSuffix(info);
  return (
    <span
      className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
    >
      <Crown size={12} />
      {info.label}
      {suffix && (
        <span className="inline-flex items-center gap-1 font-semibold opacity-80">
          <span aria-hidden>·</span>
          <Clock size={10} />
          {suffix}
        </span>
      )}
    </span>
  );
}

/** Prettify a raw name/handle: "swarup.shekhar" → "Swarup". */
function firstNameOf(user: any): string | null {
  const raw =
    user?.first_name ||
    user?.firstName ||
    user?.name?.split(' ')?.[0] ||
    user?.email?.split('@')?.[0] ||
    '';
  if (!raw) return null;
  const token = String(raw).split(/[._\s]/)[0];
  if (!token) return null;
  return token.charAt(0).toUpperCase() + token.slice(1);
}

// Inner-page route → human title for the top bar. Prefix-matched, with a
// title-cased last-segment fallback so new routes still get a sane label.
const ROUTE_TITLES: Record<string, string> = {
  '/bookings/new': 'Book a session',
  '/bookings': 'Bookings',
  '/checkout': 'Checkout',
  '/pricing': 'Plans',
  '/students/vault': 'Vault',
  '/students/notes': 'Notes',
  '/students/recordings': 'Recordings',
  '/students/assignments': 'Assignments',
  '/students/sessions': 'Sessions',
  '/students/practice': 'Practice',
  '/students/profile': 'Profile',
  '/parent/vault': 'Vault',
  '/parent/notes': 'Notes',
  '/parent/recordings': 'Recordings',
  '/parent/child': 'My child',
  '/parent/profile': 'Profile',
  '/tutor/profile': 'Profile',
};

function titleFor(path: string): string {
  if (ROUTE_TITLES[path]) return ROUTE_TITLES[path];
  for (const key of Object.keys(ROUTE_TITLES)) {
    if (path.startsWith(`${key}/`)) return ROUTE_TITLES[key];
  }
  const seg = path.split('/').filter(Boolean).pop() ?? '';
  return seg ? seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ') : '';
}

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

  // The top bar is uniform across every app page. On home it shows the personal
  // greeting + plan badge + date; on inner pages it shows Back + the page title.
  // The bell always sits on the right. Credit only matters for parent/student.
  const { status: credit } = useCreditStatus();
  const firstName = firstNameOf(user);
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);
  const today = useMemo(() => format(new Date(), 'EEEE, d MMMM'), []);
  const title = showBack ? titleFor(pathname) : '';

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
        {/* Uniform top bar — ONE chrome pattern on every page so the app never
            reads as a website. Home: greeting + plan badge + date + bell.
            Inner: Back + page title + bell. Same height/style throughout. */}
        <div
          className="sticky top-0 z-30 flex h-[52px] items-center justify-between gap-3 border-b border-white/5 px-4 backdrop-blur"
          style={{ background: `${hue.base}d9` /* ~85% opaque */ }}
        >
          <div className="flex min-w-0 items-center gap-2">
            {showBack ? (
              <>
                <button
                  onClick={() => router.back()}
                  aria-label="Go back"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                {title && (
                  <h1 className="truncate text-base font-bold tracking-tight text-white">
                    {title}
                  </h1>
                )}
              </>
            ) : (
              <h1 className="truncate text-lg font-extrabold tracking-tight text-white">
                {greeting}
                {firstName ? `, ${firstName}` : ''}
              </h1>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {!showBack && <PlanBadge credit={credit} />}
            {!showBack && (
              <span className="hidden text-sm font-medium text-white/40 md:inline">{today}</span>
            )}
            <NotificationBell />
          </div>
        </div>
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
