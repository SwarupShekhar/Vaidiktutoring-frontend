'use client';

// Single source of truth for the tutor dashboard's Magic Bento cards.
// Consumed by BOTH the desktop app-shell (TutorAppDashboard, dark surface) and
// the web dashboard (theme-aware). Card text/borders resolve through
// `--bento-*` CSS vars whose fallbacks are the original dark values, so the
// app-shell (which sets none) looks identical to before, while the web wrapper
// can override them per light/dark theme.

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  CalendarClock,
  CalendarDays,
  Briefcase,
  Users,
  Star,
  CheckCircle2,
  FileText,
  Vault,
  Video,
  ArrowRight,
  CalendarRange,
} from 'lucide-react';
import type { BentoCardProps } from '@/app/components/MagicBento';
import { useTutorDashboard } from '@/app/Hooks/useTutorDashboard';
import { useAuthContext } from '@/app/context/AuthContext';
import { api } from '@/app/lib/api';
import { ACCENT } from '@/app/components/app-shell/ui';

// Theme-var handles with dark fallbacks (app-shell sets none → original look).
const FG = 'var(--bento-fg, #fff)';
const FG_MUTED = 'var(--bento-fg-muted, rgba(255,255,255,0.6))';
const HAIRLINE = 'var(--bento-hairline, rgba(255,255,255,0.15))';
const ROW_BG = 'var(--bento-row, rgba(255,255,255,0.04))';

/** Solid accent pill button (Join / Claim / Browse). White text reads on any saturated accent. */
const CardButton: React.FC<{
  accent: string;
  disabled?: boolean;
  pulse?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}> = ({ accent, disabled, pulse, onClick, children }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`relative inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
      disabled 
        ? 'cursor-not-allowed opacity-40' 
        : `text-white hover:opacity-90 active:scale-95 ${pulse ? 'animate-pulse' : ''}`
    }`}
    style={
      disabled
        ? { background: `rgba(${accent},0.15)`, color: FG }
        : { 
            background: `rgb(${accent})`,
            boxShadow: pulse ? `0 0 15px rgba(${accent}, 0.6)` : 'none'
          }
    }
  >
    {children}
  </button>
);

function formatSessionLabel(start: Date | null): string {
  if (!start) return '';
  const day = start.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  const time = start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${day} · ${time}`;
}

function sessionStartOf(s: any): Date | null {
  const raw = s?.start_time ?? s?.requested_start ?? s?.date;
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

interface UseTutorBentoCardsOpts {
  /** Explicit card background (app-shell passes its dark CARD_COLOR). Omit on web to stay theme-aware. */
  cardColor?: string;
  /** Opens the Share Notes modal for a session (owned by the consumer). */
  onShareNotes: (sessionId: string) => void;
}

export function useTutorBentoCards({ cardColor, onShareNotes }: UseTutorBentoCardsOpts) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { todaySessions, upcomingBookings, availableJobs, stats, loading } = useTutorDashboard();

  const { data: studentsCount } = useQuery({
    queryKey: ['tutor-my-students-count', user?.id],
    queryFn: async () => {
      const res = await api.get('/tutor/my-students');
      return Array.isArray(res.data) ? res.data.length : 0;
    },
    enabled: !!user?.id,
    staleTime: 60_000,
  });

  const nextSession = todaySessions?.[0] ?? upcomingBookings?.[0] ?? null;
  const nextStart = sessionStartOf(nextSession);
  // No time gate: the tutor can always open the session room (backend access is by
  // assignment, not time). Matches the original dashboard behaviour.
  const canJoin = !!nextSession;

  const handleJoin = () => {
    if (nextSession?.id) router.push(`/session/${nextSession.id}`);
  };

  const quality = stats.quality;
  const ratingLabel = quality.isInitial ? 'New' : Number(quality.rating).toFixed(1);

  const cards = useMemo<BentoCardProps[]>(() => {
    const list: BentoCardProps[] = [];

    // 1. NEXT CLASS TO TEACH (hero, 8 cols)
    if (nextSession) {
      list.push({
        color: cardColor,
        accent: ACCENT.indigo,
        colSpan: 8,
        label: 'Next class to teach',
        icon: <CalendarClock className="h-4 w-4" />,
        title: nextSession.subject_name
          ? `${nextSession.subject_name}${nextSession.child_name ? ` · ${nextSession.child_name}` : ''}`
          : nextSession.child_name || 'Upcoming class',
        description: [
          formatSessionLabel(nextStart),
          nextSession.grade ? `Grade ${nextSession.grade}` : null,
          nextSession.curriculum_name || null,
        ]
          .filter(Boolean)
          .join(' · '),
        children: (
          <div className="flex flex-wrap gap-2">
            <CardButton
              accent={ACCENT.indigo}
              disabled={!canJoin}
              pulse={true}
              onClick={(e) => {
                e.stopPropagation();
                handleJoin();
              }}
            >
              <Video size={14} /> Join class
            </CardButton>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShareNotes(nextSession.id);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-bold transition-all hover:opacity-80 active:scale-95"
              style={{ color: FG, borderColor: HAIRLINE }}
            >
              <FileText size={14} /> Share notes
            </button>
          </div>
        ),
      });
    } else {
      list.push({
        color: cardColor,
        accent: ACCENT.indigo,
        colSpan: 8,
        href: '/tutor/jobs',
        label: 'Next class to teach',
        icon: <Briefcase className="h-4 w-4" />,
        title: 'No classes scheduled',
        description: 'Claim an open session from the job board and it shows up right here.',
        children: (
          <CardButton accent={ACCENT.indigo}>
            <Briefcase size={14} /> Browse jobs
          </CardButton>
        ),
      });
    }

    // 2. TODAY (4 cols)
    list.push({
      color: cardColor,
      accent: ACCENT.amber,
      colSpan: 4,
      label: 'Today',
      icon: <CalendarDays className="h-4 w-4" />,
      value: `${stats.todayCount}`,
      description: stats.todayCount === 1 ? 'class today' : 'classes today',
      children:
        todaySessions.length > 0 ? (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {todaySessions.slice(0, 4).map((s: any) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{
                  color: FG,
                  background: `rgba(${ACCENT.amber},0.14)`,
                  border: `1px solid rgba(${ACCENT.amber},0.3)`,
                }}
              >
                {sessionStartOf(s)?.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                {s.subject_name ? ` · ${s.subject_name}` : ''}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs" style={{ color: FG_MUTED }}>Nothing on today — enjoy the breather.</p>
        ),
    });

    // 3. OPEN JOBS (4 cols)
    if (availableJobs.length > 0) {
      list.push({
        color: cardColor,
        accent: ACCENT.emerald,
        colSpan: 4,
        href: '/tutor/jobs',
        label: 'Open jobs',
        icon: <Briefcase className="h-4 w-4" />,
        value: `${availableJobs.length}`,
        description: availableJobs.length === 1 ? 'session to claim' : 'sessions to claim',
        children: (
          <CardButton accent={ACCENT.emerald}>
            <Briefcase size={14} /> Claim now
          </CardButton>
        ),
      });
    } else {
      list.push({
        color: cardColor,
        accent: ACCENT.teal,
        colSpan: 4,
        href: '/tutor/jobs',
        label: 'Open jobs',
        icon: <CheckCircle2 className="h-4 w-4" />,
        title: 'No open jobs',
        description: 'New matching sessions appear here as they come in.',
      });
    }

    // 4. MY STUDENTS (4 cols)
    list.push({
      color: cardColor,
      accent: ACCENT.cyan,
      colSpan: 4,
      href: '/tutor/students',
      label: 'My students',
      icon: <Users className="h-4 w-4" />,
      value: `${studentsCount ?? 0}`,
      description: 'students taught',
      children: (
        <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: `rgb(${ACCENT.cyan})` }}>
          View &amp; share notes <ArrowRight size={13} />
        </span>
      ),
    });

    // 5. RATING (4 cols)
    list.push({
      color: cardColor,
      accent: ACCENT.violet,
      colSpan: 4,
      label: 'Rating',
      icon: <Star className="h-4 w-4" />,
      value: ratingLabel,
      description: quality.isInitial
        ? 'awaiting first feedback'
        : `from ${quality.reviewsCount} review${quality.reviewsCount === 1 ? '' : 's'}`,
    });

    // 6. COMPLETED (4 cols)
    list.push({
      color: cardColor,
      accent: ACCENT.amber,
      colSpan: 4,
      label: 'Completed',
      icon: <CheckCircle2 className="h-4 w-4" />,
      value: `${stats.completedCount}`,
      description: 'sessions taught lifetime',
    });

    // 7. VAULT (4 cols)
    list.push({
      color: cardColor,
      accent: ACCENT.magenta,
      colSpan: 4,
      href: '/tutor/vault',
      label: 'Vault',
      icon: <Vault className="h-4 w-4" />,
      title: 'Curriculum Vault',
      description: 'Browse & share teaching materials',
      children: (
        <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: `rgb(${ACCENT.magenta})` }}>
          Open vault <ArrowRight size={13} />
        </span>
      ),
    });

    // 8. UPCOMING ROADMAP (8 cols)
    if (upcomingBookings.length > 0) {
      list.push({
        color: cardColor,
        accent: ACCENT.indigo,
        colSpan: 8,
        label: 'Upcoming roadmap',
        icon: <CalendarRange className="h-4 w-4" />,
        description: 'Your next confirmed sessions',
        children: (
          <div className="mt-1 space-y-2">
            {upcomingBookings.slice(0, 4).map((b: any) => {
              const start = sessionStartOf(b);
              return (
                <div
                  key={b.id}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2"
                  style={{ background: ROW_BG, border: `1px solid ${HAIRLINE}` }}
                >
                  <span className="truncate text-sm font-semibold" style={{ color: FG }}>
                    {b.subject_name || 'Session'}
                    {b.child_name ? ` · ${b.child_name}` : ''}
                  </span>
                  <span className="shrink-0 text-xs font-medium" style={{ color: FG_MUTED }}>
                    {start ? format(start, 'd MMM, h:mm a') : 'TBD'}
                  </span>
                </div>
              );
            })}
          </div>
        ),
      });
    }

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cardColor,
    nextSession,
    nextStart,
    canJoin,
    todaySessions,
    upcomingBookings,
    availableJobs,
    studentsCount,
    stats.todayCount,
    stats.completedCount,
    ratingLabel,
    quality.isInitial,
    quality.reviewsCount,
  ]);

  return { cards, loading, nextSession };
}
