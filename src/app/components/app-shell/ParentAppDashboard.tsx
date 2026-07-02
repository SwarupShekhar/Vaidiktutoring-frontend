'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarClock,
  CalendarPlus,
  Video,
  Flame,
  Ticket,
  Sparkles,
  TrendingUp,
  ClipboardCheck,
  CheckCircle2,
  UserPlus,
  Baby,
  ClipboardList,
  X,
  Zap,
} from 'lucide-react';
import { AppTopBar } from './AppTopBar';
import MagicBento from '../MagicBento';
import AttendanceReport from '@/app/components/dashboard/AttendanceReport';
import RatingModal from '@/app/components/RatingModal';
import { useAuthContext } from '@/app/context/AuthContext';
import { useParentDashboard } from '@/app/Hooks/useParentDashboard';
import type {
  ParentDashboardSession,
  ParentDashboardStudent,
  PendingRating,
} from '@/app/Hooks/useParentDashboard';
import { useAttendanceReport } from '@/app/Hooks/useAttendanceReport';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 140, damping: 18 } },
};

const CARD_COLOR = '#15131f';

// Per-category accent as "r, g, b" — mirrors the student bento palette.
const ACCENT = {
  indigo: '129, 140, 248',
  amber: '245, 158, 11',
  cyan: '34, 211, 238',
  violet: '167, 139, 250',
  emerald: '16, 185, 129',
  teal: '45, 212, 191',
  magenta: '217, 130, 255',
} as const;

const LEVEL_STYLE: Record<string, [string, string]> = {
  improving: [ACCENT.emerald, '↑'],
  needs_work: [ACCENT.amber, '⚠'],
  steady: ['148, 163, 184', '→'],
};

function formatSessionLabel(start: Date | null): string {
  if (!start) return '';
  const day = start.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  const time = start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${day} · ${time}`;
}

// ---- Small data-viz primitives (mirror the student bento) ----

const Pips: React.FC<{ filled: number; total: number; accent: string }> = ({ filled, total, accent }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: total }).map((_, i) => (
      <span
        key={i}
        className="h-2 w-2 rounded-full transition-colors"
        style={{ background: i < filled ? `rgb(${accent})` : 'rgba(255,255,255,0.14)' }}
      />
    ))}
  </div>
);

const MiniBar: React.FC<{ label: string; pct: number; accent: string }> = ({ label, pct, accent }) => (
  <div className="space-y-1">
    <div className="flex items-baseline justify-between text-[11px] font-medium text-white/55">
      <span>{label}</span>
      <span className="text-white/75">{pct}%</span>
    </div>
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: `rgb(${accent})` }}
      />
    </div>
  </div>
);

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
      disabled ? 'cursor-not-allowed bg-white/5 text-white/35 ring-1 ring-white/10' : 'text-white active:scale-95'
    }`}
    style={disabled ? undefined : { background: `rgb(${accent})` }}
  >
    {children}
  </button>
);

/** A pill that switches the active child in a multi-child household. */
const ChildPill: React.FC<{
  student: ParentDashboardStudent;
  active: boolean;
  onClick: () => void;
}> = ({ student, active, onClick }) => {
  const name = `${student.first_name ?? ''} ${student.last_name ?? ''}`.trim() || 'Child';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${
        active
          ? 'bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/40'
          : 'bg-white/5 text-white/55 ring-1 ring-white/10 hover:bg-white/10 hover:text-white/80'
      }`}
    >
      <span className="text-base leading-none">{student.gender === 'female' ? '👧' : '👦'}</span>
      {name}
    </button>
  );
};

const ParentAppDashboard: React.FC = () => {
  const { user } = useAuthContext();
  const {
    students,
    upcomingSessions,
    childSummaries,
    childCredits,
    pendingRatings,
    loadingStudentList,
  } = useParentDashboard();

  const TRIAL_SESSION_LIMIT = 3;

  // Active child — defaults to the first one once the list loads.
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  useEffect(() => {
    if (!selectedChildId && students.length > 0) {
      setSelectedChildId(students[0].id);
    }
  }, [students, selectedChildId]);

  const selectedChild = useMemo(
    () => students.find((s) => s.id === selectedChildId) ?? null,
    [students, selectedChildId],
  );
  const childName = selectedChild
    ? `${selectedChild.first_name ?? ''} ${selectedChild.last_name ?? ''}`.trim() || 'your child'
    : 'your child';

  const summary = selectedChildId ? childSummaries[selectedChildId] ?? null : null;

  // Trial/paid-aware session gauge for the selected child.
  const credit = selectedChildId ? childCredits[selectedChildId] ?? null : null;
  const sessionGauge = useMemo(() => {
    if (!credit) return null;
    const isTrial =
      credit.mode === 'trial_active' ||
      credit.mode === 'trial_exhausted' ||
      credit.mode === 'trial_expired';
    if (isTrial) {
      const used = Math.min(credit.sessionsUsed ?? 0, TRIAL_SESSION_LIMIT);
      const remaining = Math.max(0, TRIAL_SESSION_LIMIT - used);
      const exhausted = credit.mode !== 'trial_active' || remaining <= 0;
      return {
        kind: 'trial' as const,
        remaining,
        total: TRIAL_SESSION_LIMIT,
        used,
        exhausted,
        label: exhausted ? 'Free trial used up' : 'free classes left',
      };
    }
    // paid / learning → plan sessions
    const remaining = Math.max(0, credit.creditsRemaining ?? 0);
    return {
      kind: 'paid' as const,
      remaining,
      total: null as number | null,
      used: 0,
      exhausted: remaining <= 0,
      label: remaining === 1 ? 'plan session left' : 'plan sessions left',
    };
  }, [credit]);

  // Attendance — reuses the existing parent attendance hook + report component.
  const { report: attendance } = useAttendanceReport(selectedChildId);
  const attendanceRate = attendance?.summary.attendanceRate ?? Math.round(summary?.attendanceRate ?? 0);
  // A child with zero sessions has NO attendance to speak of — showing "100%"
  // there is misleading. Gate every attendance display on real sessions existing.
  const hasAttendance = (attendance?.summary.totalSessions ?? 0) > 0;

  // The selected child's next upcoming session.
  const childNext = useMemo<ParentDashboardSession | null>(
    () => upcomingSessions.find((s) => s.students?.id === selectedChildId) ?? null,
    [upcomingSessions, selectedChildId],
  );
  const childNextStart = childNext ? new Date(childNext.requested_start) : null;
  const childNextTutor = childNext?.tutors?.users?.first_name
    ? `Tutor ${childNext.tutors.users.first_name}`
    : null;

  // Ratings awaiting the parent's feedback.
  const [ratingsOpen, setRatingsOpen] = useState(false);
  const [ratingsDone, setRatingsDone] = useState(false);
  const pendingCount = pendingRatings.length;

  // Full attendance report slide-over.
  const [reportOpen, setReportOpen] = useState(false);
  useEffect(() => {
    if (!reportOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setReportOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reportOpen]);

  // Package usage for the selected child.
  const pkgRemaining = summary?.packageSessionsRemaining ?? null;
  const pkgTotal = summary?.packageSessionsTotal ?? null;
  const pkgUsed = pkgRemaining != null && pkgTotal != null ? pkgTotal - pkgRemaining : null;
  const renewalNeeded =
    pkgRemaining != null && pkgTotal != null && pkgTotal > 0 && pkgRemaining <= Math.ceil(pkgTotal * 0.2);

  // What's new — newest recording/feedback for the child.
  const whatsNew = useMemo(() => {
    const rec = summary?.recentRecordings?.[0] ?? null;
    const fb = summary?.recentFeedback?.[0] ?? null;
    const recDate = rec?.date ? new Date(rec.date).getTime() : -Infinity;
    const fbDate = fb?.date ? new Date(fb.date).getTime() : -Infinity;
    if (!rec && !fb) return null;
    if (recDate >= fbDate && rec) {
      return {
        title: `Recording: ${rec.subject ?? 'Session'}`,
        description: rec.date ? new Date(rec.date).toLocaleDateString() : 'Recently',
      };
    }
    return {
      title: `Note: ${fb?.subject ?? 'Session'}`,
      description: fb?.note ? fb.note.slice(0, 80) : fb?.date ? new Date(fb.date).toLocaleDateString() : 'Recently',
    };
  }, [summary?.recentRecordings, summary?.recentFeedback]);

  const streakWeeks = summary?.streakWeeks ?? 0;
  const totalHours = summary?.totalHoursLearned ?? 0;
  const totalSessions = summary?.totalSessions ?? 0;
  const subjectProgress = Array.isArray(summary?.subjectProgress) ? summary.subjectProgress : [];
  const topicsCovered = Array.isArray(summary?.topicsThisMonth) ? summary.topicsThisMonth : [];

  const cards = useMemo(() => {
    const list: any[] = [];

    // 1. NEXT CLASS (hero, 8 cols) — the selected child's next session.
    if (childNext) {
      list.push({
        color: CARD_COLOR,
        accent: ACCENT.indigo,
        colSpan: 8,
        href: `/session/${childNext.id}`,
        label: `Next class · ${childName}`,
        icon: <CalendarClock className="h-4 w-4" />,
        title: childNext.subject?.name ?? childNext.subjects?.name ?? 'Upcoming class',
        description: [formatSessionLabel(childNextStart), childNextTutor].filter(Boolean).join(' · '),
        children: (
          <CardButton accent={ACCENT.indigo}>
            <Video size={14} /> View class
          </CardButton>
        ),
      });
    } else {
      list.push({
        color: CARD_COLOR,
        accent: ACCENT.indigo,
        colSpan: 8,
        href: '/bookings/new',
        label: `Next class · ${childName}`,
        icon: <CalendarPlus className="h-4 w-4" />,
        title: 'No class scheduled yet',
        description: `Book a 1-on-1 session for ${childName} and it shows up right here.`,
        children: (
          <CardButton accent={ACCENT.indigo}>
            <CalendarPlus size={14} /> Book a session
          </CardButton>
        ),
      });
    }

    // 2. ATTENDANCE (4 cols) — reuses useAttendanceReport; taps to full report.
    const attAccent = !hasAttendance
      ? '148, 163, 184'
      : attendanceRate >= 90 ? ACCENT.emerald : attendanceRate >= 70 ? ACCENT.amber : ACCENT.magenta;
    list.push({
      color: CARD_COLOR,
      accent: attAccent,
      colSpan: 4,
      onClick: () => setReportOpen(true),
      label: 'Attendance',
      icon: <ClipboardCheck className="h-4 w-4" />,
      value: hasAttendance ? `${attendanceRate}%` : '—',
      children: (
        <div className="mt-1 space-y-2">
          {hasAttendance ? (
            <>
              <MiniBar label="Rate" pct={attendanceRate} accent={attAccent} />
              <p className="text-xs text-white/55">
                {attendance!.summary.attended} attended · {attendance!.summary.absent} absent · {attendance!.summary.late} late
              </p>
              <p className="text-[11px] font-semibold text-white/35">→ tap for the full report</p>
            </>
          ) : (
            <p className="text-xs text-white/45">No sessions yet — attendance appears once {childName} has attended a class.</p>
          )}
        </div>
      ),
    });

    // 3. SESSIONS (4 cols) — trial-aware gauge. Trial → "N of 3 free classes";
    // paid/learning → plan sessions remaining. Exhausted → prompt to upgrade.
    if (sessionGauge?.kind === 'trial') {
      const exhausted = sessionGauge.exhausted;
      list.push({
        color: CARD_COLOR,
        accent: exhausted ? ACCENT.amber : ACCENT.cyan,
        colSpan: 4,
        href: exhausted ? '/pricing' : '/bookings/new',
        label: 'Sessions',
        icon: <Ticket className="h-4 w-4" />,
        value: exhausted ? '0 of 3' : `${sessionGauge.remaining} of ${sessionGauge.total}`,
        description: exhausted ? 'Trial ended — upgrade to keep learning' : sessionGauge.label,
        children: exhausted ? (
          <CardButton accent={ACCENT.amber}>Upgrade plan</CardButton>
        ) : (
          <div className="mt-1">
            <Pips filled={sessionGauge.used} total={sessionGauge.total} accent={ACCENT.cyan} />
          </div>
        ),
      });
    } else if (sessionGauge?.kind === 'paid') {
      const exhausted = sessionGauge.exhausted;
      list.push({
        color: CARD_COLOR,
        accent: exhausted ? ACCENT.amber : ACCENT.cyan,
        colSpan: 4,
        href: exhausted ? '/pricing' : '/bookings/new',
        label: 'Sessions',
        icon: <Ticket className="h-4 w-4" />,
        value: `${sessionGauge.remaining}`,
        title: exhausted ? 'Out of sessions' : undefined,
        description: exhausted ? 'Renew your plan to keep classes going' : sessionGauge.label,
        children: exhausted ? <CardButton accent={ACCENT.amber}>Renew plan</CardButton> : undefined,
      });
    } else {
      // No credit data yet — safe neutral fallback.
      list.push({
        color: CARD_COLOR,
        accent: '148, 163, 184',
        colSpan: 4,
        href: '/bookings/new',
        label: 'Sessions',
        icon: <Ticket className="h-4 w-4" />,
        value: '—',
        description: 'Book a session to get started',
      });
    }

    // 4. MOMENTUM (4 cols) — weekly streak + lifetime stats for the child.
    list.push({
      color: CARD_COLOR,
      accent: ACCENT.amber,
      colSpan: 4,
      onClick: () => setReportOpen(true),
      label: 'Momentum',
      icon: <Flame className="h-4 w-4" />,
      value: `${streakWeeks} wk`,
      children: (
        <div className="space-y-2">
          <Pips filled={Math.min(streakWeeks, 8)} total={8} accent={ACCENT.amber} />
          <p className="text-xs text-white/55">
            {totalHours}h attended · {totalSessions} sessions
          </p>
          <p className="text-[11px] font-semibold text-white/35">→ tap to see attendance history</p>
        </div>
      ),
    });

    // 5. WHAT'S NEW (4 cols) — newest note/recording for the child.
    list.push({
      color: CARD_COLOR,
      accent: ACCENT.violet,
      colSpan: 4,
      onClick: () => setReportOpen(true),
      label: "What's new",
      icon: <Sparkles className="h-4 w-4" />,
      title: whatsNew?.title ?? 'Nothing new yet',
      description: whatsNew?.description ?? 'Recordings and tutor notes land here.',
    });

    // 6. ACTION — ratings awaiting feedback (4 cols).
    if (pendingCount > 0 && !ratingsDone) {
      list.push({
        color: CARD_COLOR,
        accent: ACCENT.amber,
        colSpan: 4,
        onClick: () => setRatingsOpen(true),
        label: 'To do',
        icon: <ClipboardList className="h-4 w-4" />,
        value: `${pendingCount}`,
        description: pendingCount === 1 ? 'session to rate' : 'sessions to rate',
        children: (
          <CardButton accent={ACCENT.amber} onClick={(e) => { e.stopPropagation(); setRatingsOpen(true); }}>
            <Zap size={14} /> Rate now
          </CardButton>
        ),
      });
    } else {
      list.push({
        color: CARD_COLOR,
        accent: ACCENT.emerald,
        colSpan: 4,
        label: 'To do',
        icon: <CheckCircle2 className="h-4 w-4" />,
        title: 'All caught up',
        description: 'No ratings pending. Nice.',
        children: <CheckCircle2 className="h-7 w-7" style={{ color: `rgb(${ACCENT.emerald})` }} />,
      });
    }

    // 7. SUBJECTS (4 cols) — progress + topics covered for the child.
    if (subjectProgress.length > 0 || topicsCovered.length > 0) {
      list.push({
        color: CARD_COLOR,
        accent: ACCENT.indigo,
        colSpan: 4,
        label: 'Subjects',
        icon: <TrendingUp className="h-4 w-4" />,
        description: `${childName}'s progress this month`,
        children: (
          <div className="mt-1 space-y-3">
            {subjectProgress.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {subjectProgress.map((s, i) => {
                  const [accent, glyph] = LEVEL_STYLE[s.level] ?? LEVEL_STYLE.steady;
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white/85"
                      style={{ background: `rgba(${accent},0.14)`, border: `1px solid rgba(${accent},0.3)` }}
                    >
                      <span style={{ color: `rgb(${accent})` }}>{glyph}</span>
                      {s.subject}
                    </span>
                  );
                })}
              </div>
            )}
            {topicsCovered.length > 0 && (
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Topics covered
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {topicsCovered.map((t, i) => (
                    <span
                      key={i}
                      className="rounded-full px-2.5 py-1 text-xs font-medium text-white/75"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ),
      });
    }

    // 8. ADD CHILD (4 cols) — onboarding shortcut.
    list.push({
      color: CARD_COLOR,
      accent: ACCENT.teal,
      colSpan: 4,
      href: '/onboarding/student',
      label: 'Family',
      icon: <UserPlus className="h-4 w-4" />,
      title: 'Add a child',
      description: 'Enrol another child to track them here too.',
      children: (
        <CardButton accent={ACCENT.teal}>
          <UserPlus size={14} /> Add child
        </CardButton>
      ),
    });

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    childNext,
    childName,
    childNextStart,
    childNextTutor,
    attendanceRate,
    hasAttendance,
    attendance,
    sessionGauge,
    streakWeeks,
    totalHours,
    totalSessions,
    whatsNew,
    pendingCount,
    ratingsDone,
    subjectProgress,
    topicsCovered,
  ]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-6xl space-y-8 px-4 py-4 md:px-6"
    >
      {/* Personal header (greeting + date) */}
      <motion.div variants={itemVariants}>
        <AppTopBar
          user={user}
          credit={credit}
          subtitle={
            students.length > 1
              ? `Here's how ${childName} is doing.`
              : "Here's your family's learning snapshot."
          }
        />
      </motion.div>

      {/* Child selector — only when there's more than one child */}
      {students.length > 1 && (
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/40">
            <Baby size={14} /> Viewing
          </span>
          {students.map((s) => (
            <ChildPill
              key={s.id}
              student={s}
              active={s.id === selectedChildId}
              onClick={() => setSelectedChildId(s.id)}
            />
          ))}
        </motion.div>
      )}

      {/* Enter the selected child's full learning space (materials, notes, recordings, classes). */}
      {selectedChildId && (
        <motion.div variants={itemVariants}>
          <Link
            href={`/parent/child/${selectedChildId}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-indigo-200 ring-1 ring-white/10 transition-colors hover:bg-white/[0.08]"
          >
            Open {childName}'s learning space →
          </Link>
        </motion.div>
      )}

      {/* Empty state — no children added yet */}
      {!loadingStudentList && students.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="rounded-3xl border border-white/10 bg-[#15131f] p-10 text-center"
        >
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl">
            👶
          </div>
          <h2 className="text-lg font-bold text-white">No children yet</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-white/45">
            Add your first child to start tracking their classes, attendance and progress here.
          </p>
          <a
            href="/onboarding/student"
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-white active:scale-95"
            style={{ background: `rgb(${ACCENT.indigo})` }}
          >
            <UserPlus size={14} /> Add your first child
          </a>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="mt-8">
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
        </motion.div>
      )}

      {/* Full attendance report slide-over (reuses AttendanceReport) */}
      <AnimatePresence>
        {reportOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-end">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setReportOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="relative flex h-full w-full max-w-lg flex-col bg-[#0f0d16] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] p-6">
                <div>
                  <h2 className="text-xl font-black text-white">Attendance &amp; Progress</h2>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-indigo-300">
                    {childName}
                  </p>
                </div>
                <button
                  onClick={() => setReportOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/50 ring-1 ring-white/10 transition-all hover:text-white hover:bg-white/10"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <AttendanceReport studentId={selectedChildId} variant="dark" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pending ratings modal (reuses RatingModal) */}
      {ratingsOpen && pendingRatings.length > 0 && (
        <RatingModal
          pending={pendingRatings as PendingRating[]}
          onDone={() => {
            setRatingsOpen(false);
            setRatingsDone(true);
          }}
        />
      )}
    </motion.div>
  );
};

export default ParentAppDashboard;
