'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Atom,
  Flame,
  CalendarClock,
  Ticket,
  Sparkles,
  ListChecks,
  TrendingUp,
  PencilLine,
  Video,
  Loader2,
  X,
  CheckCircle2,
  ArrowRight,
  CalendarPlus,
  Zap,
} from 'lucide-react';
import { AppPrompts } from './AppPrompts';
import MagicBento from '../MagicBento';
import { INTERACTIVE_TOOLS } from '@/app/lib/interactive-tools';
import { useHomeworkCount } from '@/app/Hooks/useHomeworkCount';
import { useNextHomework } from '@/app/Hooks/useNextHomework';
import { useCreditStatus } from '@/app/Hooks/useCreditStatus';
import { GraduationCap, Award, MessageCircle } from 'lucide-react';
import { ExamTargetModal } from './ExamTargetModal';
import { getExamById } from '@/app/lib/exams';

// Badge catalog (mirrors the web dashboard) — maps a badge id to its label.
const BADGE_LABELS: Record<string, string> = {
  first_step: 'First Step',
  consistent: 'Consistent',
  quick_learner: 'Quick Learner',
  dedicated: 'Dedicated',
  star_student: 'Star Student',
};

// Drop-in alternative to EnrolledDashboard — identical prop interface (plus pendingRatings).
interface AppDashboardProps {
  studentProfile: any;
  enrollment: any;
  upcomingSessions: any[];
  pastSessions: any[];
  bookings: any[];
  loading: boolean;
  user: any;
  progressSummary: any;
  isEnrolled: boolean;
  pendingRatings?: any[];
  creditStatus?: any;
  embedMode?: boolean;
  themeAware?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 140, damping: 18 } },
};

const CARD_COLOR = '#15131f';

// Per-category accent as "r, g, b" (drives icon, label, hairline border, corner wash).
const ACCENT = {
  indigo: '129, 140, 248',
  amber: '245, 158, 11',
  cyan: '34, 211, 238',
  violet: '167, 139, 250',
  emerald: '16, 185, 129',
  teal: '45, 212, 191',
  magenta: '217, 130, 255',
} as const;

// subjectProgress level → [accent rgb, glyph].
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

// ---- Small data-viz primitives (rendered inside card `children`) ----

/** A row of pips; `filled` of `total` lit in the accent colour. */
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

/** A labelled thin progress bar. */
const MiniBar: React.FC<{ label: string; pct: number; accent: string }> = ({ label, pct, accent }) => (
  <div className="space-y-1">
    <div className="flex items-baseline justify-between text-[11px] font-medium text-slate-500 dark:text-white/55">
      <span>{label}</span>
      <span className="text-slate-600 dark:text-white/75">{pct}%</span>
    </div>
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: `rgb(${accent})` }}
      />
    </div>
  </div>
);

/** Pill button used inside cards (Join / Book / Launch). */
const CardButton: React.FC<{ accent: string; disabled?: boolean; glow?: boolean; onClick?: (e: React.MouseEvent) => void; children: React.ReactNode }> = ({
  accent,
  disabled,
  glow,
  onClick,
  children,
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
      disabled ? 'cursor-not-allowed hover:translate-y-0 opacity-80' : 'hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
    }`}
    style={disabled ? { 
      background: `rgba(${accent}, 0.15)`,
      color: `var(--bento-fg, inherit)`
    } : { 
      background: `rgb(${accent})`,
      boxShadow: glow ? `0 0 15px rgba(${accent}, 0.5)` : undefined,
      color: '#fff'
    }}
  >
    {children}
  </button>
);

export const AppDashboard: React.FC<AppDashboardProps> = ({
  enrollment,
  upcomingSessions,
  user,
  progressSummary,
  pendingRatings = [],
  creditStatus,
  studentProfile,
  embedMode,
  themeAware,
}) => {
  // Authoritative live credit/trial status (/credits/trial-status), with prop/profile fallback.
  const { status: liveCredit } = useCreditStatus();
  const credit = liveCredit ?? creditStatus ?? studentProfile?.creditStatus ?? null;
  const isTrial =
    !!credit && (credit.mode === 'trial_active' || credit.mode === 'trial_exhausted' || credit.mode === 'trial_expired');
  // "Learning"/paid but out of credits → show a renew prompt instead of a bleak "0".
  const outOfCredits = !!credit && (credit.mode === 'learning' || credit.mode === 'paid') && (credit.creditsRemaining ?? 0) <= 0;
  const nextSession = upcomingSessions?.[0] ?? null;

  // ---- Join eligibility ----
  const sessionStart = nextSession
    ? new Date(nextSession.start_time ?? nextSession.requested_start)
    : null;
  // Join opens 5 min before start (joining a class days early hits a backend 403
  // on the daily-token). Stays open after start so a late student can still join.
  const JOIN_LEAD_MS = 15 * 60_000;
  const canJoin =
    !!nextSession?.meet_link &&
    !!sessionStart &&
    Date.now() >= sessionStart.getTime() - JOIN_LEAD_MS;
  // A freshly booked session is 'requested'/'pending' with no room link yet — show
  // "awaiting confirmation" instead of a dead Join button.
  const isPending =
    !!nextSession && !nextSession.meet_link &&
    (nextSession.status === 'requested' || nextSession.status === 'pending');

  const router = useRouter();
  // Two kinds of session links:
  //   • In-platform Daily.co sessions  → `${FRONTEND_URL}/session/:id` (embeds the
  //     video). Keep these INSIDE the app shell via client-side navigation.
  //   • External providers (e.g. Zoom group sessions) → a raw zoom.us URL. These
  //     must open in the real browser, NOT in-app (the in-app route would 404).
  const handleJoin = () => {
    const link = nextSession?.meet_link;
    if (!link) return;
    try {
      // Resolve relative or absolute links against our own origin.
      const url = new URL(link, window.location.origin);
      const isInPlatform =
        url.origin === window.location.origin && url.pathname.startsWith('/session/');
      if (isInPlatform) {
        router.push(url.pathname + url.search);
        return;
      }
    } catch {
      // Relative in-platform path that failed URL parsing.
      if (link.startsWith('/session/')) {
        router.push(link);
        return;
      }
    }
    // External (Zoom, etc.): open outside the app shell. On web this is a new tab;
    // in the Electron shell, setWindowOpenHandler routes disallowed origins to the
    // system browser (shell.openExternal).
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  // ---- Chemistry Lab launch (replicates LearningLab's iframe-modal pattern) ----
  const chemTool = INTERACTIVE_TOOLS.find((t) => t.iconName === 'Atom') ?? INTERACTIVE_TOOLS[0];
  const [labOpen, setLabOpen] = useState(false);
  const [labLoading, setLabLoading] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (!labOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLabOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [labOpen]);

  const launchLab = () => {
    // Open the lab inside the app, in the fullscreen modal (iframe → lab.studyhours.com).
    setLabLoading(true);
    setLabOpen(true);
  };

  // ---- Action items (homework + sessions to rate) ----
  const { count: homeworkCount } = useHomeworkCount();
  const { next: nextHomework } = useNextHomework();
  const toRateCount = pendingRatings?.length ?? 0;
  const actionTotal = homeworkCount + toRateCount;

  // ---- Exam countdown (driven by the student's chosen target exam + date) ----
  const [examModalOpen, setExamModalOpen] = useState(false);
  const targetExam = getExamById(studentProfile?.target_exam);
  const examInfo = useMemo(() => {
    const raw = studentProfile?.exam_date;
    if (!raw) return null;
    const examDate = new Date(raw);
    if (isNaN(examDate.getTime())) return null;
    const dayMs = 24 * 60 * 60 * 1000;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const days = Math.ceil((examDate.getTime() - startOfToday.getTime()) / dayMs);
    if (days < 0) return null; // exam already passed → prompt to update
    return {
      days,
      label: examDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
      target: studentProfile?.target_grade ?? null,
    };
  }, [studentProfile?.exam_date, studentProfile?.target_grade]);

  // ---- Achievements (badge ids → labels) ----
  const badges: string[] = Array.isArray(progressSummary?.badges) ? progressSummary.badges : [];

  // ---- Assigned tutor (trial/assigned) ----
  const tutor = studentProfile?.trial_tutor?.users ?? null;
  const tutorName = tutor
    ? `${tutor.first_name ?? ''} ${tutor.last_name ?? ''}`.trim() || 'Your tutor'
    : null;

  // ---- Package usage ----
  const sessionsRemaining =
    progressSummary?.packageSessionsRemaining ?? enrollment?.sessionsRemaining ?? null;
  const sessionsTotal = progressSummary?.packageSessionsTotal ?? null;

  // ---- What's New (newest of recordings/feedback) ----
  const whatsNew = useMemo(() => {
    const rec = progressSummary?.recentRecordings?.[0] ?? null;
    const fb = progressSummary?.recentFeedback?.[0] ?? null;
    const recDate = rec?.date ? new Date(rec.date).getTime() : -Infinity;
    const fbDate = fb?.date ? new Date(fb.date).getTime() : -Infinity;
    if (!rec && !fb) return null;
    if (recDate >= fbDate && rec) {
      return {
        title: `Recording: ${rec.subject ?? 'Session'}`,
        description: rec.date ? new Date(rec.date).toLocaleDateString() : 'Recently',
        href: '/students/recordings',
      };
    }
    return {
      title: `Note: ${fb?.subject ?? 'Session'}`,
      description: fb?.date ? new Date(fb.date).toLocaleDateString() : 'Recently',
      href: '/students/notes',
    };
  }, [progressSummary?.recentRecordings, progressSummary?.recentFeedback]);

  // ---- Subject progress (raw list, rendered as pills) ----
  const subjectProgress: { subject: string; level: string }[] = Array.isArray(progressSummary?.subjectProgress)
    ? progressSummary.subjectProgress
    : [];

  // ---- Topics covered recently (from this month's sessions) ----
  const topicsCovered: string[] = Array.isArray(progressSummary?.topicsThisMonth)
    ? progressSummary.topicsThisMonth
    : [];

  // ---- Derived stat values ----
  const streakWeeks = progressSummary?.streakWeeks ?? 0;
  const totalHours = progressSummary?.totalHoursLearned ?? 0;
  const totalSessions = progressSummary?.totalSessions ?? 0;
  const attendanceRate = Math.round(progressSummary?.attendanceRate ?? 0);
  const used = sessionsRemaining != null && sessionsTotal != null ? sessionsTotal - sessionsRemaining : null;
  const practiceXp = studentProfile?.practice_xp ?? 0;
  const practiceStreak = studentProfile?.practice_streak ?? 0;

  // ---- Build the bento cards ----
  const cards = useMemo(() => {
    const list: any[] = [];

    // 1. NEXT CLASS (hero, 8 cols)
    if (nextSession) {
      list.push({
        color: 'rgba(91, 108, 247, 0.1)',
        accent: '91, 108, 247',
        highlighted: true,
        colSpan: 8,
        label: 'Next class',
        icon: <CalendarClock className="h-4 w-4" />,
        title: nextSession.subject?.name ?? 'Upcoming class',
        description: [
          formatSessionLabel(sessionStart),
          nextSession.tutor?.name ? `with ${nextSession.tutor.name}` : (isPending ? 'tutor being assigned' : null),
        ]
          .filter(Boolean)
          .join(' · '),
        children: isPending ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 px-3 py-2 text-xs font-bold text-amber-600 dark:text-amber-300 ring-1 ring-amber-500/30">
            <CalendarClock size={14} /> Awaiting confirmation
          </span>
        ) : (
          <CardButton accent="91, 108, 247" glow={canJoin} disabled={!canJoin} onClick={(e) => { e.stopPropagation(); handleJoin(); }}>
            <Video size={14} /> {canJoin ? 'Join class' : 'Join opens 15 min before'}
          </CardButton>
        ),
      });
    } else {
      list.push({
        color: 'rgba(91, 108, 247, 0.05)',
        accent: '91, 108, 247',
        colSpan: 8,
        href: '/bookings/new',
        label: 'Next class',
        icon: <CalendarPlus className="h-4 w-4" />,
        title: 'No class scheduled yet',
        description: 'Book a 1-on-1 session with your tutor and it shows up right here.',
        children: (
          <CardButton accent="91, 108, 247" glow>
            <CalendarPlus size={14} /> Book a session
          </CardButton>
        ),
      });
    }

    // 2. MOMENTUM (4 cols) — weekly attendance streak + honest lifetime stats.
    // All values are real (attended >=30min / tutor-marked); taps to full history.
    list.push({
      color: themeAware ? undefined : CARD_COLOR,
      accent: ACCENT.amber,
      colSpan: 4,
      href: '/students/sessions',
      label: 'Momentum',
      icon: <Flame className="h-4 w-4" />,
      value: `${streakWeeks} wk`,
      children: (
        <div className="space-y-2">
          <Pips filled={Math.min(streakWeeks, 8)} total={8} accent={ACCENT.amber} />
          <p className="text-xs text-slate-500 dark:text-white/55">{totalHours}h attended · {totalSessions} sessions</p>
          <p className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: `rgb(${ACCENT.indigo})` }}>
            <Zap size={12} /> {practiceXp.toLocaleString()} XP{practiceStreak > 0 ? ` · 🔥 ${practiceStreak}d practice` : ''}
          </p>
          <p className="text-[11px] font-semibold text-slate-400 dark:text-white/35">→ tap to see full history</p>
        </div>
      ),
    });

    // 3. CREDITS / PACKAGE (4 cols) — trial credits for free users, package usage for enrolled
    if (isTrial) {
      const trialActive = credit.mode === 'trial_active';
      // Trial = 3 free sessions. creditsRemaining is MINUTES (time-bank), so show sessions left, not minutes.
      const remaining = Math.max(0, 3 - (credit.sessionsUsed ?? 0));
      list.push({
        color: themeAware ? undefined : CARD_COLOR,
        accent: trialActive ? ACCENT.emerald : ACCENT.amber,
        colSpan: 4,
        href: trialActive ? '/bookings/new' : '/pricing',
        label: 'Free trial',
        icon: <Ticket className="h-4 w-4" />,
        value: trialActive ? `${remaining}` : '0',
        description: trialActive
          ? remaining > 0
            ? `free session${remaining === 1 ? '' : 's'} left${credit.daysLeft != null ? ` · ${credit.daysLeft}d` : ''}`
            : 'no free sessions left'
          : 'Trial ended — upgrade to continue',
        children: trialActive ? (
          remaining > 0 ? (
            <CardButton accent={ACCENT.emerald}>
              <CalendarPlus size={14} /> Book free session
            </CardButton>
          ) : (
            <CardButton accent={ACCENT.amber}>View plans</CardButton>
          )
        ) : (
          <CardButton accent={ACCENT.amber}>View plans</CardButton>
        ),
      });
    } else if (outOfCredits) {
      list.push({
        color: themeAware ? undefined : CARD_COLOR,
        accent: ACCENT.amber,
        colSpan: 4,
        href: '/pricing',
        label: 'Package',
        icon: <Ticket className="h-4 w-4" />,
        title: 'Out of sessions',
        description: 'Renew your plan to book more classes.',
        children: <CardButton accent={ACCENT.amber}>Renew plan</CardButton>,
      });
    } else {
      // Time-bank is MINUTES. Show hours off the authoritative live balance, not the
      // legacy sessions_remaining count (which deductCredits subtracts minutes from).
      const planMin: Record<string, number> = { foundation: 360, mastery: 720, elite: 1080 };
      const totalMin = credit.plan ? planMin[credit.plan] ?? null : null;
      const remMin = Math.max(0, credit.creditsRemaining ?? 0);
      const usedMin = totalMin != null ? Math.max(0, totalMin - remMin) : null;
      const h = Math.floor(remMin / 60), m = remMin % 60;
      list.push({
        color: themeAware ? undefined : CARD_COLOR,
        accent: ACCENT.cyan,
        colSpan: 4,
        href: '/bookings',
        label: 'Plan time',
        icon: <Ticket className="h-4 w-4" />,
        value: h > 0 ? `${h}h${m ? ` ${m}m` : ''}` : `${m}m`,
        title: undefined,
        description: 'plan time left',
        children: (
          <div className="mt-1 space-y-2.5">
            {usedMin != null && totalMin ? (
              <MiniBar label="Used" pct={Math.round((usedMin / totalMin) * 100)} accent={ACCENT.cyan} />
            ) : null}
            <MiniBar label="Attendance" pct={attendanceRate} accent={ACCENT.emerald} />
          </div>
        ),
      });
    }

    // 4. WHAT'S NEW (4 cols)
    list.push({
      color: themeAware ? undefined : CARD_COLOR,
      accent: ACCENT.violet,
      colSpan: 4,
      label: "What's new",
      icon: <Sparkles className="h-4 w-4" />,
      title: whatsNew?.title ?? 'Nothing new yet',
      description: whatsNew?.description ?? 'Recordings and notes land here',
      href: whatsNew?.href,
    });

    // 5. ACTION ITEMS (4 cols)
    if (actionTotal > 0) {
      list.push({
        color: themeAware ? undefined : CARD_COLOR,
        accent: ACCENT.amber,
        colSpan: 4,
        href: '/students/assignments',
        label: 'To do',
        icon: <ListChecks className="h-4 w-4" />,
        value: `${actionTotal}`,
        // Prefer the most-urgent homework title (actionable) over a bare breakdown.
        description: nextHomework?.title
          ? `Next: ${nextHomework.title}${
              nextHomework.due_date
                ? ` · due ${new Date(nextHomework.due_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`
                : ''
            }`
          : [homeworkCount > 0 && `${homeworkCount} homework`, toRateCount > 0 && `${toRateCount} to rate`]
              .filter(Boolean)
              .join(' · '),
      });
    } else {
      list.push({
        color: themeAware ? undefined : CARD_COLOR,
        accent: ACCENT.emerald,
        colSpan: 4,
        label: 'To do',
        icon: <CheckCircle2 className="h-4 w-4" />,
        title: 'All caught up',
        description: 'No homework or ratings pending. Nice.',
        children: <CheckCircle2 className="h-7 w-7" style={{ color: `rgb(${ACCENT.emerald})` }} />,
      });
    }

    // 5b. EXAM COUNTDOWN (4 cols) — three states based on the chosen target exam
    if (targetExam && examInfo) {
      // Set & counting down.
      const urgent = examInfo.days <= 14;
      list.push({
        color: themeAware ? undefined : CARD_COLOR,
        accent: urgent ? ACCENT.amber : ACCENT.cyan,
        colSpan: 4,
        onClick: () => setExamModalOpen(true),
        label: 'Exam countdown',
        icon: <GraduationCap className="h-4 w-4" />,
        value: examInfo.days === 0 ? 'Today' : `${examInfo.days}d`,
        title: targetExam.exam,
        description: [
          examInfo.days === 0 ? 'exam is today' : `${examInfo.label}`,
          examInfo.target && `target ${examInfo.target}`,
        ]
          .filter(Boolean)
          .join(' · '),
      });
    } else if (targetExam) {
      // Exam chosen but date missing/past → prompt to confirm the date.
      list.push({
        color: themeAware ? undefined : CARD_COLOR,
        accent: ACCENT.amber,
        colSpan: 4,
        onClick: () => setExamModalOpen(true),
        label: 'Exam countdown',
        icon: <GraduationCap className="h-4 w-4" />,
        title: targetExam.exam,
        description: 'Set your exam date to start the countdown',
        children: (
          <CardButton accent={ACCENT.amber} onClick={(e) => { e.stopPropagation(); setExamModalOpen(true); }}>
            <GraduationCap size={14} /> Set date
          </CardButton>
        ),
      });
    } else {
      // No target exam yet → prompt to choose one.
      list.push({
        color: themeAware ? undefined : CARD_COLOR,
        accent: ACCENT.cyan,
        colSpan: 4,
        onClick: () => setExamModalOpen(true),
        label: 'Exam countdown',
        icon: <GraduationCap className="h-4 w-4" />,
        title: 'Set your target exam',
        description: 'Pick your exam to see a live countdown.',
        children: (
          <CardButton accent={ACCENT.cyan} onClick={(e) => { e.stopPropagation(); setExamModalOpen(true); }}>
            <GraduationCap size={14} /> Choose exam
          </CardButton>
        ),
      });
    }

    // 5c. ACHIEVEMENTS (4 cols) — earned badges (hidden if none)
    if (badges.length > 0) {
      list.push({
        color: themeAware ? undefined : CARD_COLOR,
        accent: ACCENT.violet,
        colSpan: 4,
        label: 'Achievements',
        icon: <Award className="h-4 w-4" />,
        value: `${badges.length}`,
        description: badges.length === 1 ? 'badge earned' : 'badges earned',
        children: (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {badges.slice(0, 6).map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-[rgb(var(--card-accent))] dark:text-white/85"
                style={{ background: `rgba(${ACCENT.violet},0.14)`, border: `1px solid rgba(${ACCENT.violet},0.3)` }}
              >
                <Award size={11} style={{ color: `rgb(${ACCENT.violet})` }} />
                {BADGE_LABELS[b] ?? b}
              </span>
            ))}
          </div>
        ),
      });
    }

    // 6. YOUR SUBJECTS (8 cols) — enrolled subjects (with trend) + topics covered
    if (subjectProgress.length > 0 || topicsCovered.length > 0) {
      list.push({
        color: themeAware ? undefined : CARD_COLOR,
        accent: ACCENT.indigo,
        // No card-level href: each subject pill deep-links to its own materials
        // (avoids a nested-link with the buttons below).
        colSpan: 4,
        label: 'Your subjects',
        icon: <TrendingUp className="h-4 w-4" />,
        description: 'Tap a subject for its materials',
        children: (
          <div className="mt-1 space-y-3">
            {subjectProgress.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {subjectProgress.map((s, i) => {
                  const [accent, glyph] = LEVEL_STYLE[s.level] ?? LEVEL_STYLE.steady;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/students/vault?subject=${encodeURIComponent(s.subject)}`);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-[rgb(var(--card-accent))] dark:text-white/85 transition-transform hover:scale-105 active:scale-95"
                      style={{ background: `rgba(${accent},0.14)`, border: `1px solid rgba(${accent},0.3)` }}
                    >
                      <span style={{ color: `rgb(${accent})` }}>{glyph}</span>
                      {s.subject}
                    </button>
                  );
                })}
              </div>
            )}
            {topicsCovered.length > 0 && (
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40">
                  Topics covered
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {topicsCovered.map((t, i) => (
                    <span
                      key={i}
                      className="rounded-full px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-white/75 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                      style={undefined}
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

    // 7. PRACTICE (4 cols) — pairs with the Chemistry Lab (8) to fill one row.
    list.push({
      color: themeAware ? undefined : CARD_COLOR,
      accent: ACCENT.teal,
      colSpan: 4,
      href: '/students/practice',
      label: 'Self-study',
      icon: <PencilLine className="h-4 w-4" />,
      title: 'Practice Center',
      description: 'Drills & quizzes at your own pace',
      children: (
        <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: `rgb(${ACCENT.teal})` }}>
          Start practising <ArrowRight size={13} />
        </span>
      ),
    });

    // 8. CHEMISTRY LAB (8 cols) — sits beside Practice Center.
    list.push({
      color: themeAware ? undefined : CARD_COLOR,
      accent: ACCENT.magenta,
      colSpan: 8,
      label: 'Interactive lab',
      icon: <Atom className="h-4 w-4" />,
      title: chemTool?.title ?? 'Chemistry Lab',
      description: 'Balance equations, run simulations and explore the periodic table in 3D.',
      onClick: launchLab,
      children: (
        <CardButton accent={ACCENT.magenta} onClick={(e) => { e.stopPropagation(); launchLab(); }}>
          <Atom size={14} /> Launch lab
        </CardButton>
      ),
    });

    // 9. YOUR TUTOR (4 cols) — assigned/trial tutor presence (hidden if none)
    if (tutorName) {
      const initial = tutorName.charAt(0).toUpperCase();
      list.push({
        color: themeAware ? undefined : CARD_COLOR,
        accent: ACCENT.emerald,
        colSpan: 4,
        href: '/students/profile',
        label: 'Your tutor',
        icon: <MessageCircle className="h-4 w-4" />,
        title: tutorName,
        description: 'Your assigned expert tutor',
        children: (
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: `rgba(${ACCENT.emerald},0.18)`, border: `1px solid rgba(${ACCENT.emerald},0.3)`, color: `rgb(${ACCENT.emerald})` }}
          >
            {initial}
          </span>
        ),
      });
    }

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    nextSession,
    sessionStart,
    canJoin,
    isPending,
    streakWeeks,
    totalHours,
    totalSessions,
    attendanceRate,
    practiceXp,
    practiceStreak,
    sessionsRemaining,
    sessionsTotal,
    used,
    whatsNew,
    actionTotal,
    homeworkCount,
    toRateCount,
    subjectProgress,
    chemTool,
    isTrial,
    outOfCredits,
    credit,
    examInfo,
    targetExam,
    badges,
    nextHomework,
    tutorName,
    topicsCovered,
  ]);

  const content = (
    <>
      {/* Dismissible setup/verify chips */}
      <motion.div variants={itemVariants}>
        <AppPrompts user={user} />
      </motion.div>

      {/* Real data-driven Magic Bento grid */}
      <motion.div variants={itemVariants}>
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
    </>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={
        (embedMode ? "w-full space-y-5 " : "mx-auto w-full max-w-6xl space-y-5 px-4 py-3 md:px-6 ") +
        (themeAware ? "theme-aware-bento" : "")
      }
    >
      {content}
      {/* Fullscreen Chemistry Lab modal (mirrors LearningLab) */}
      <AnimatePresence>
        {labOpen && chemTool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-slate-950 p-4 sm:p-6"
          >
            <div className="mb-4 flex shrink-0 items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/80">
                  <Atom className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <h2 className="text-lg font-black leading-tight text-white">{chemTool.title}</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Studyhours.com Interactive Learning Lab
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLabOpen(false)}
                className="rounded-xl bg-slate-800 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative w-full flex-1 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
              {labLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-slate-900 text-slate-400">
                  <Loader2 size={32} className="animate-spin text-indigo-500" />
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Initializing WebGL Engine...
                  </p>
                </div>
              )}
              <iframe
                src={chemTool.url}
                title={chemTool.title}
                loading="lazy"
                onLoad={() => setLabLoading(false)}
                allow="fullscreen; autoplay; xr-spatial-tracking; accelerometer; gyroscope"
                className="h-full w-full rounded-3xl border-0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade prompt when not enrolled */}
      <AnimatePresence>
        {showUpgrade && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md space-y-6 overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-900 p-8 shadow-2xl"
            >
              <div className="absolute left-0 right-0 top-0 h-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />
              <button
                onClick={() => setShowUpgrade(false)}
                className="absolute right-6 top-6 text-slate-400 transition-colors hover:text-white"
              >
                <X size={20} />
              </button>
              <div className="space-y-3 pt-4 text-center">
                <div className="mb-2 inline-flex rounded-3xl bg-indigo-900/30 p-4 text-indigo-400">
                  <Atom size={32} className="animate-pulse" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white">Unlock 3D Learning Labs</h3>
                <p className="mx-auto max-w-sm text-xs leading-relaxed text-slate-400">
                  Interactive WebGL tools are exclusively available to premium enrolled students.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowUpgrade(false)}
                  className="flex-1 rounded-xl border border-slate-800 px-4 py-3 text-xs font-bold text-slate-300 transition-all hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowUpgrade(false);
                    window.location.href = '/pricing';
                  }}
                  className="flex-1 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 px-4 py-3 text-xs font-black text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-600 hover:to-purple-700 active:scale-95"
                >
                  Upgrade Now →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Target-exam selector */}
      <ExamTargetModal
        isOpen={examModalOpen}
        onClose={() => setExamModalOpen(false)}
        student={studentProfile}
      />
    </motion.div>
  );
};
