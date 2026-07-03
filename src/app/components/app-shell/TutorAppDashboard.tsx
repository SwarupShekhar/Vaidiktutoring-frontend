'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
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
import MagicBento, { BentoCardProps } from '../MagicBento';
import { useTutorDashboard } from '@/app/Hooks/useTutorDashboard';
import { useAuthContext } from '@/app/context/AuthContext';
import { api } from '@/app/lib/api';
import ShareNotesModal from '@/app/tutor/ShareNotesModal';
import NotificationBell from './NotificationBell';
import { ACCENT, CARD_COLOR, containerVariants, itemVariants } from './ui';

// ---- small data-viz primitives (mirror AppDashboard) ----

/** Pill button used inside cards (Join / Share / View). */
const CardButton: React.FC<{
  accent: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}> = ({ accent, disabled, onClick, children }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
      disabled
        ? 'cursor-not-allowed bg-white/5 text-white/35 ring-1 ring-white/10'
        : 'text-white active:scale-95'
    }`}
    style={disabled ? undefined : { background: `rgb(${accent})` }}
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

interface TutorAppDashboardProps {
  user: any;
}

export const TutorAppDashboard: React.FC<TutorAppDashboardProps> = ({ user }) => {
  const router = useRouter();
  const { todaySessions, upcomingBookings, availableJobs, stats, loading } = useTutorDashboard();
  const [shareNotesSessionId, setShareNotesSessionId] = useState<string | null>(null);

  // Count of students this tutor has actually taught (re-uses the same
  // /tutor/my-students endpoint that the My Students page reads).
  const { data: studentsCount } = useQuery({
    queryKey: ['tutor-my-students-count', user?.id],
    queryFn: async () => {
      const res = await api.get('/tutor/my-students');
      return Array.isArray(res.data) ? res.data.length : 0;
    },
    enabled: !!user?.id,
    staleTime: 60_000,
  });

  // The class to teach next: a live class today wins, else the soonest upcoming booking.
  const nextSession = todaySessions?.[0] ?? upcomingBookings?.[0] ?? null;
  const nextStart = sessionStartOf(nextSession);
  // Tutors join in-platform via /session/:id. Gate on the start time (5 min lead)
  // — an always-enabled Join let a tutor open a class days early → daily-token 403.
  const JOIN_LEAD_MS = 5 * 60_000;
  const canJoin = !!nextStart && Date.now() >= nextStart.getTime() - JOIN_LEAD_MS;

  const handleJoin = () => {
    if (nextSession?.id) router.push(`/session/${nextSession.id}`);
  };

  const quality = stats.quality;
  const ratingLabel = quality.isInitial ? 'New' : Number(quality.rating).toFixed(1);

  // ---- Build the bento cards ----
  const cards = useMemo<BentoCardProps[]>(() => {
    const list: BentoCardProps[] = [];

    // 1. NEXT CLASS TO TEACH (hero, 8 cols)
    if (nextSession) {
      list.push({
        color: CARD_COLOR,
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
                setShareNotesSessionId(nextSession.id);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-white/85 ring-1 ring-white/15 transition-all hover:bg-white/5 active:scale-95"
            >
              <FileText size={14} /> Share notes
            </button>
          </div>
        ),
      });
    } else {
      list.push({
        color: CARD_COLOR,
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

    // 2. TODAY'S SCHEDULE (4 cols)
    list.push({
      color: CARD_COLOR,
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
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white/85"
                style={{
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
          <p className="text-xs text-white/55">Nothing on today — enjoy the breather.</p>
        ),
    });

    // 3. OPEN JOBS / CLAIMS (4 cols)
    if (availableJobs.length > 0) {
      list.push({
        color: CARD_COLOR,
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
        color: CARD_COLOR,
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
      color: CARD_COLOR,
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

    // 5. INSTRUCTOR RATING (4 cols)
    list.push({
      color: CARD_COLOR,
      accent: ACCENT.violet,
      colSpan: 4,
      label: 'Rating',
      icon: <Star className="h-4 w-4" />,
      value: ratingLabel,
      description: quality.isInitial
        ? 'awaiting first feedback'
        : `from ${quality.reviewsCount} review${quality.reviewsCount === 1 ? '' : 's'}`,
    });

    // 7. COMPLETED SESSIONS (4 cols)
    list.push({
      color: CARD_COLOR,
      accent: ACCENT.amber,
      colSpan: 4,
      label: 'Completed',
      icon: <CheckCircle2 className="h-4 w-4" />,
      value: `${stats.completedCount}`,
      description: 'sessions taught lifetime',
    });

    // 8. CURRICULUM VAULT (4 cols)
    list.push({
      color: CARD_COLOR,
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

    // 9. UPCOMING SESSIONS (8 cols)
    if (upcomingBookings.length > 0) {
      list.push({
        color: CARD_COLOR,
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
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span className="truncate text-sm font-semibold text-white/85">
                    {b.subject_name || 'Session'}
                    {b.child_name ? ` · ${b.child_name}` : ''}
                  </span>
                  <span className="shrink-0 text-xs font-medium text-white/50">
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
    nextSession,
    nextStart,
    canJoin,
    todaySessions,
    upcomingBookings,
    availableJobs,
    studentsCount,
    stats.todayCount,
    stats.completedCount,
    stats.totalHours,
    ratingLabel,
    quality.isInitial,
    quality.reviewsCount,
  ]);

  const firstName = user?.firstName || user?.first_name || 'Instructor';
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);
  const today = useMemo(() => format(new Date(), 'EEEE, d MMMM'), []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-6xl space-y-5 px-4 py-3 md:px-6"
    >
      {/* Personal header (tutor-flavoured; mirrors AppTopBar's style without editing it) */}
      <motion.div variants={itemVariants}>
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold tracking-tight text-white">
              {greeting}, {firstName}
            </h1>
            <p className="mt-0.5 text-sm text-white/45">Here&apos;s your teaching snapshot.</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-white/40">{today}</p>
            <NotificationBell />
          </div>
        </header>
      </motion.div>

      {/* Real data-driven Magic Bento grid */}
      <motion.div variants={itemVariants}>
        {loading && cards.length === 0 ? null : (
          <MagicBento
            cards={cards}
            textAutoHide={false}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={12}
            glowColor="132, 0, 255"
          />
        )}
      </motion.div>

      {/* Share notes with the next class's student */}
      {shareNotesSessionId && (
        <ShareNotesModal
          sessionId={shareNotesSessionId}
          studentName={nextSession?.child_name}
          onClose={() => setShareNotesSessionId(null)}
        />
      )}
    </motion.div>
  );
};
