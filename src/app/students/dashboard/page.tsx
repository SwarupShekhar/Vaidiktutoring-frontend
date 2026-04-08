'use client';

import React, { useMemo, useEffect, useState, useRef } from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useAuthContext } from '@/app/context/AuthContext';
import useStudentDashboard from '@/app/Hooks/useStudentDashboard';
import { useCreditStatus } from '@/app/Hooks/useCreditStatus';
import { useStudentProgress, ProgressSummary } from '@/app/Hooks/useStudentProgress';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { StatCard } from '@/app/components/dashboard/StatCard';
import { SessionCommandCard } from '@/app/components/dashboard/SessionCommandCard';
import { TrialBanner } from '@/app/components/dashboard/TrialBanner';
import { UpgradeNudge } from '@/app/components/dashboard/UpgradeNudge';
import {
  CheckCircle2,
  Hourglass,
  Calendar,
  Plus,
  AlertCircle,
  GraduationCap,
  MessageCircle,
  MessageSquare,
  Quote,
  BookOpen,
  Star,
  ChevronRight,
  Flame,
  X,
  Trophy,
  PlayCircle,
  Play,
  Video,
} from 'lucide-react';
import { differenceInMinutes, format, isToday, isTomorrow, addDays, startOfWeek } from 'date-fns';
import { api } from '@/app/lib/api';
import { EditStudentProfileModal } from '@/app/components/dashboard/EditStudentProfileModal';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

const BADGES = [
  { id: 'first_step', label: 'First Step', emoji: '🎯', description: 'Completed your first session' },
  { id: 'consistent', label: 'Consistent', emoji: '📅', description: 'Attended 4 sessions in a month' },
  { id: 'quick_learner', label: 'Quick Learner', emoji: '⚡', description: '2 week streak' },
  { id: 'dedicated', label: 'Dedicated', emoji: '💪', description: '10 sessions completed' },
  { id: 'star_student', label: 'Star Student', emoji: '⭐', description: '4 week streak' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } as any },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function fmtDate(iso?: string) {
  if (!iso) return 'Date TBD';
  try {
    return new Date(iso).toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  } catch { return 'Invalid Date'; }
}

/* ─── Live countdown ─── */
function useCountdown(target?: string) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    if (!target) return;
    const tick = () => {
      const diff = new Date(target).getTime() - Date.now();
      if (diff <= 0) { setDisplay('Now'); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      setDisplay(`${h}h ${m}m`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [target]);
  return display;
}

/* ─── Achievement Badges ─── */
function AchievementBadges({ progress }: { progress: ProgressSummary | null }) {
  if (!progress) return null;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">My Achievements</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {BADGES.map((badge) => {
          const isEarned = progress.badges?.includes(badge.id);
          return (
            <div 
              key={badge.id}
              className={`group relative p-4 rounded-2xl border text-center transition-all ${
                isEarned 
                  ? 'bg-surface border-green-100 dark:border-green-900/30' 
                  : 'bg-surface/50 border-dashed border-border opacity-60'
              }`}
            >
              <div className={`text-4xl mb-2 transition-transform duration-300 group-hover:scale-110 ${!isEarned && 'filter grayscale'}`}>
                {badge.emoji}
              </div>
              <div className={`text-xs font-bold ${isEarned ? 'text-foreground' : 'text-text-secondary'}`}>
                {badge.label}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                {badge.description}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Enrolled Dashboard ─── */
function EnrolledDashboard({ studentProfile, enrollment, upcomingSessions, pastSessions, bookings, loading, user, progressSummary }: any) {
  const scheduleRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const nextSession = upcomingSessions[0] ?? null;
  const countdown = useCountdown(nextSession?.start_time ?? nextSession?.requested_start);

  const now = new Date();
  const startWithin5Min = nextSession
    ? (new Date(nextSession.start_time ?? nextSession.requested_start).getTime() - now.getTime()) <= 5 * 60_000
    : false;

  // 7-day week view
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfWeek(now), i);
    const sessions = upcomingSessions.filter((s: any) => {
      const d = new Date(s.start_time ?? s.requested_start);
      return d.toDateString() === day.toDateString();
    });
    return { day, sessions };
  });

  // Stats
  const completedCount = progressSummary?.totalSessions || pastSessions.length;
  const hoursThisMonth = progressSummary?.totalHoursLearned?.toFixed(1) || '0.0';

  // Streak
  const streak = progressSummary?.streakWeeks || 0;

  // Renewal check
  const [renewalDismissed, setRenewalDismissed] = useState<string | null>(null);
  useEffect(() => {
    const d = localStorage.getItem('renewal_dismissed');
    if (d) setRenewalDismissed(d);
  }, []);

  const showRenewal = useMemo(() => {
    if (!progressSummary) return false;
    const isLow = progressSummary.packageSessionsRemaining <= Math.ceil(progressSummary.packageSessionsTotal * 0.2);
    return isLow && renewalDismissed !== `${progressSummary.packageSessionsRemaining}`;
  }, [progressSummary, renewalDismissed]);

  const handleDismissRenewal = () => {
    if (progressSummary) {
        localStorage.setItem('renewal_dismissed', `${progressSummary.packageSessionsRemaining}`);
        setRenewalDismissed(`${progressSummary.packageSessionsRemaining}`);
    }
  };

  // Tutor info
  const assignedTutor = enrollment?.assignedTutorId
    ? { name: 'Your Tutor', initials: 'T' } // enriched by backend in future
    : null;

  // Stickers
  const stickers: string[] = studentProfile?.stickers ?? [];
  const placeholders = Math.max(0, 12 - stickers.length);

  // Next session label
  const sessionStart = nextSession ? new Date(nextSession.start_time ?? nextSession.requested_start) : null;
  const sessionLabel = sessionStart
    ? isToday(sessionStart) ? `Today · ${format(sessionStart, 'h:mm a')}`
    : isTomorrow(sessionStart) ? `Tomorrow, ${format(sessionStart, 'EEEE d MMMM')} · ${format(sessionStart, 'h:mm a')}`
    : `${format(sessionStart, 'EEEE d MMMM')} · ${format(sessionStart, 'h:mm a')}`
    : null;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible"
      className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter">Student Portal · Enrolled</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            {getGreeting()}, {user?.firstName || user?.first_name || 'Scholar'}
          </h1>
          <p className="text-text-secondary text-sm">Welcome back — your classes are pre-scheduled.</p>
        </div>
        <button
          onClick={() => scheduleRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-[1.03] active:scale-95 transition-all text-sm"
        >
          <Calendar size={16} />
          View My Schedule
        </button>
      </motion.header>

      {/* Next class hero */}
      <motion.div variants={itemVariants}
        className="bg-linear-to-br from-violet-600 to-blue-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-violet-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <span className="font-bold text-lg">{nextSession?.subject?.name ?? 'Your Next Class'}</span>
              </div>
              {nextSession?.tutor && (
                <p className="text-white/80 text-sm">with {nextSession.tutor.name}</p>
              )}
              <p className="text-white/90 font-medium">{sessionLabel ?? 'No upcoming class scheduled'}</p>
              {countdown && <p className="text-white/70 text-sm">Starts in {countdown}</p>}
            </div>
            <button
              disabled={!startWithin5Min}
              onClick={() => nextSession?.meet_link && window.open(nextSession.meet_link, '_blank')}
              className={`px-8 py-4 rounded-2xl font-bold text-base transition-all ${
                startWithin5Min
                  ? 'bg-white text-violet-700 shadow-lg shadow-white/30 animate-pulse hover:scale-105'
                  : 'bg-white/20 text-white/60 cursor-not-allowed'
              }`}
            >
              Join Class
            </button>
          </div>
        </div>
      </motion.div>

      {/* Package Renewal Banner */}
      {showRenewal && (
        <motion.div variants={itemVariants} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-600 dark:text-amber-400">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100">
                You have {progressSummary?.packageSessionsRemaining} sessions remaining in your current package
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/pricing')} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all">
              Renew Package
            </button>
            <button onClick={handleDismissRenewal} className="p-1 text-amber-400 hover:text-amber-600">
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Stat cards */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={CheckCircle2} label="Sessions Completed" value={`${completedCount}/${enrollment?.sessionsRemaining + completedCount || completedCount}`} color="#10b981" description="in your package" />
        <StatCard icon={Hourglass} label="Hours This Month" value={hoursThisMonth} color="#f59e0b" description="Keep the momentum!" />
        <div className={`bg-surface p-6 rounded-3xl border transition-all duration-500 flex flex-col justify-between shadow-sm ${streak >= 4 ? 'border-amber-400 shadow-amber-100 dark:shadow-none' : 'border-border'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${streak > 0 ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-gray-50 dark:bg-gray-700 text-gray-400'}`}>
              <Flame size={20} fill={streak > 0 ? "currentColor" : "none"} />
            </div>
            {streak >= 8 && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wider">🏆 On fire!</span>
            )}
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{streak} week{streak !== 1 ? 's' : ''}</div>
            <div className="text-sm text-text-secondary">{streak > 0 ? 'week streak' : 'Start your streak today'}</div>
          </div>
        </div>
      </motion.section>

      {/* Topics this month */}
      {progressSummary?.topicsThisMonth && progressSummary.topicsThisMonth.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-3">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Covered this month</h3>
          <div className="flex flex-wrap gap-2">
            {progressSummary.topicsThisMonth.map((topic: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-surface text-foreground rounded-full text-xs font-medium border border-border">
                {topic}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Achievements */}
      <motion.section variants={itemVariants}>
        <AchievementBadges progress={progressSummary} />
      </motion.section>

      {/* Tutor Stickers — given during live sessions */}
      {progressSummary?.stickers && progressSummary.stickers.length > 0 && (
        <motion.section variants={itemVariants} className="space-y-4">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Star size={20} className="text-yellow-500" /> Tutor Stickers
          </h3>
          <div className="flex flex-wrap gap-3">
            {(() => {
              // Aggregate sticker counts
              const counts: Record<string, number> = {};
              progressSummary.stickers.forEach((s: string) => { counts[s] = (counts[s] || 0) + 1; });
              
              const STICKER_MAP: Record<string, { emoji: string; label: string }> = {
                // Session stickers (normalized: lowercase, no spaces, no extension)
                crown: { emoji: '👑', label: 'Crown' },
                diamond: { emoji: '💎', label: 'Diamond' },
                dinosaur: { emoji: '🦕', label: 'Dino' },
                flame: { emoji: '🔥', label: 'Flame' },
                rainbow: { emoji: '🌈', label: 'Rainbow' },
                rocket: { emoji: '🚀', label: 'Rocket' },
                shiningstar: { emoji: '🌟', label: 'Shining Star' },
                star: { emoji: '⭐', label: 'Star' },
                trophy: { emoji: '🏆', label: 'Trophy' },
                unicorn: { emoji: '🦄', label: 'Unicorn' },
                // Legacy keys (in case older records exist)
                heart: { emoji: '❤️', label: 'Heart' },
                fire: { emoji: '🔥', label: 'Fire' },
                brain: { emoji: '🧠', label: 'Genius' },
                clap: { emoji: '👏', label: 'Bravo' },
                sparkle: { emoji: '✨', label: 'Sparkle' },
                thumbsup: { emoji: '👍', label: 'Thumbs Up' },
                lightbulb: { emoji: '💡', label: 'Bright Idea' },
                100: { emoji: '💯', label: 'Perfect' },
              };

              return Object.entries(counts).map(([type, count]) => {
                const info = STICKER_MAP[type] || { emoji: '🏅', label: type };
                return (
                  <div key={type} className="group relative flex flex-col items-center p-3 rounded-2xl bg-surface border border-yellow-100 dark:border-yellow-900/30 hover:shadow-md transition-all min-w-[72px]">
                    <span className="text-3xl group-hover:scale-125 transition-transform">{info.emoji}</span>
                    <span className="text-[10px] font-bold text-foreground mt-1">{info.label}</span>
                    {count > 1 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-yellow-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                        ×{count}
                      </span>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </motion.section>
      )}

      {/* Tutor Feedback */}
      {progressSummary?.recentFeedback && progressSummary.recentFeedback.length > 0 && (
        <motion.section variants={itemVariants} className="space-y-4">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <MessageCircle size={20} className="text-blue-500" /> Tutor Feedback
          </h3>
          <div className="space-y-3">
            {progressSummary.recentFeedback.map((fb: any) => (
              <div key={fb.sessionId} className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">{fb.subject}</span>
                  <span className="text-xs text-text-secondary">
                    {fb.date ? new Date(fb.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{fb.note}</p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Class Recordings */}
      {progressSummary?.recentRecordings && progressSummary.recentRecordings.length > 0 && (
        <motion.section variants={itemVariants} className="space-y-4">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Video size={20} className="text-purple-500" /> Class Recordings
          </h3>
          <div className="space-y-3">
            {progressSummary.recentRecordings.map((rec: any) => (
              <div key={rec.sessionId} className="bg-surface rounded-2xl p-4 border border-border shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">{rec.subject}</div>
                  <div className="text-xs text-text-secondary">
                    {rec.date ? new Date(rec.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Date TBD'}
                  </div>
                </div>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL || 'https://k-12-backend.onrender.com'}/sessions/${rec.sessionId}/recordings/${rec.recordingId}/stream`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                >
                  <PlayCircle size={16} /> Watch
                </a>
              </div>
            ))}
          </div>
        </motion.section>
      )}


      <motion.div variants={itemVariants} ref={scheduleRef}
        className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Calendar size={20} className="text-blue-500" /> This Week
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(({ day, sessions }) => {
            const isNow = isToday(day);
            return (
              <div key={day.toISOString()} className={`rounded-2xl p-3 border transition-all ${
                isNow ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10' : 'border-border bg-background'
              }`}>
                <p className={`text-xs font-bold uppercase mb-1 ${isNow ? 'text-blue-600 dark:text-blue-400' : 'text-text-secondary'}`}>
                  {format(day, 'EEE')}
                </p>
                <p className={`text-lg font-bold ${isNow ? 'text-blue-700 dark:text-blue-300' : 'text-foreground'}`}>
                  {format(day, 'd')}
                </p>
                {sessions.length > 0 ? (
                  <div className="mt-2 space-y-1">
                    {sessions.map((s: any) => (
                      <div key={s.id} className="text-[10px] bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 rounded-lg px-1.5 py-0.5 font-medium truncate">
                        {format(new Date(s.start_time ?? s.requested_start), 'h:mm a')}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 w-2 h-2 rounded-full bg-gray-200 dark:bg-white/10 mx-auto" />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tutor card */}
        <motion.div variants={itemVariants} className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <GraduationCap size={18} className="text-indigo-500" /> My Tutor
          </h2>
          {assignedTutor ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-lg">
                {assignedTutor.initials}
              </div>
              <div className="flex-1">
                <p className="font-bold text-foreground">{assignedTutor.name}</p>
                <p className="text-xs text-text-secondary">Your assigned tutor</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-all">
                <MessageCircle size={14} /> Message
              </button>
            </div>
          ) : (
            <p className="text-text-secondary text-sm italic">Tutor assignment pending.</p>
          )}
          {/* Last tutor note */}
          {pastSessions[0]?.tutor_note && (
            <div className="mt-4 p-3 bg-background rounded-xl border border-border">
              <p className="text-xs font-bold text-text-secondary uppercase mb-1">Last Session Note</p>
              <p className="text-sm text-foreground">{pastSessions[0].tutor_note}</p>
            </div>
          )}
        </motion.div>

        {/* Sticker rewards */}
        <motion.div variants={itemVariants} className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Star size={18} className="text-yellow-500" /> Sticker Rewards
            </h2>
            <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-200 dark:border-yellow-500/20">
              {stickers.length} earned
            </span>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {stickers.map((s: string, i: number) => (
              <div key={i} className="aspect-square rounded-xl bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 flex items-center justify-center text-xl">
                {s}
              </div>
            ))}
            {Array.from({ length: placeholders }).map((_, i) => (
              <div key={`ph-${i}`} className="aspect-square rounded-xl bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-300 dark:text-white/20 text-xl">
                ⭐
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Blog cards */}
      <BlogSection />
    </motion.div>
  );
}

function BlogSection() {
  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs-student'],
    queryFn: async () => {
      const res = await api.get('/blogs?status=PUBLISHED&limit=3');
      return res.data?.data ?? res.data ?? [];
    },
    staleTime: 5 * 60_000,
  });

  if (!blogs.length) return null;

  return (
    <motion.div variants={itemVariants}>
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <BookOpen size={20} className="text-green-500" /> From the Blog
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {blogs.slice(0, 3).map((b: any) => (
          <a key={b.id} href={`/blog/${b.slug}`}
            className="group bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all">
            {b.image_url && (
              <div className="h-36 overflow-hidden">
                <img src={b.image_url} alt={b.image_alt || b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            )}
            <div className="p-4">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">{b.category}</span>
              <h3 className="font-bold text-foreground mt-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{b.title}</h3>
              <p className="text-xs text-text-secondary mt-1 line-clamp-2">{b.excerpt}</p>
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main page ─── */
export default function StudentDashboardPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { upcomingSessions, pastSessions, bookings, loading } = useStudentDashboard();
  const { status: creditStatus, loading: creditLoading, refetch: refetchCredits } = useCreditStatus();
  const { progressSummary, loading: progressLoading, refetch: refetchProgress } = useStudentProgress();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const prevBadgesRef = useRef<string[]>([]);

  useEffect(() => {
    const d = localStorage.getItem('onboarding_dismissed');
    if (d) setOnboardingDismissed(true);
  }, []);

  // Redirect admin
  useEffect(() => {
    if (user?.role === 'admin') window.location.href = '/admin/dashboard';
  }, [user?.role]);

  const fetchProfile = React.useCallback(async () => {
    try {
      const res = await api.get('/students/me');
      setStudentProfile(res.data);
    } catch {}
  }, []);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user, fetchProfile]);

  useEffect(() => {
    if (progressSummary?.badges) {
      const prevBadges = prevBadgesRef.current;
      const newBadges = progressSummary.badges.filter(b => !prevBadges.includes(b));
      
      if (newBadges.length > 0 && prevBadges.length > 0) {
        newBadges.forEach(badgeId => {
          const badge = BADGES.find(b => b.id === badgeId);
          if (badge) {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            toast.success(`New badge unlocked: ${badge.label}`, {
              description: `${badge.emoji} ${badge.description}`,
              duration: 5000,
            });
          }
        });
      }
      prevBadgesRef.current = progressSummary.badges;
    }
  }, [progressSummary?.badges]);

  // Fetch enrollment status once student profile loaded
  const { data: enrollment } = useQuery({
    queryKey: ['enrollment-status', studentProfile?.id],
    queryFn: async () => {
      const res = await api.get(`/students/${studentProfile.id}/enrollment-status`);
      return res.data;
    },
    enabled: !!studentProfile?.id,
    staleTime: 60_000,
  });

  const isEnrolled = enrollment?.status === 'enrolled';

  const stats = useMemo(() => {
    const completedCount = progressSummary?.totalSessions || 0;
    const totalHours = progressSummary?.totalHoursLearned?.toFixed(1) || '0.0';
    return { completedCount, totalHours, upcomingCount: upcomingSessions.length };
  }, [progressSummary, upcomingSessions]);

  const showOnboarding = useMemo(() => {
    return !onboardingDismissed && 
           creditStatus?.mode === 'trial_active' && 
           progressSummary?.totalSessions === 0;
  }, [onboardingDismissed, creditStatus, progressSummary]);

  const onboardingSteps = useMemo(() => {
    if (!studentProfile || !progressSummary) return [];
    const step1 = !!(studentProfile.grade && studentProfile.school);
    const step2 = upcomingSessions.length > 0 || pastSessions.length > 0;
    const step3 = progressSummary.totalSessions > 0;
    return [
      { id: 1, label: 'Complete your profile', complete: step1 },
      { id: 2, label: 'Book your first session', complete: step2, link: '/bookings/new' },
      { id: 3, label: 'Meet your tutor', complete: step3 }
    ];
  }, [studentProfile, progressSummary, upcomingSessions, pastSessions]);

  const completedStepsCount = onboardingSteps.filter(s => s.complete).length;

  const nextSession = upcomingSessions[0] ?? null;
  const otherUpcoming = upcomingSessions.slice(1);

  // Enrolled students: show the enrolled-specific dashboard
  if (isEnrolled) {
    return (
      <ProtectedClient roles={['student']}>
        <EnrolledDashboard
          studentProfile={studentProfile}
          enrollment={enrollment}
          upcomingSessions={upcomingSessions}
          pastSessions={pastSessions}
          bookings={bookings}
          loading={loading}
          user={user}
          progressSummary={progressSummary}
        />
        {studentProfile && (
          <EditStudentProfileModal
            isOpen={isEditProfileOpen}
            onClose={() => setIsEditProfileOpen(false)}
            student={studentProfile}
            onUpdate={fetchProfile}
          />
        )}
      </ProtectedClient>
    );
  }

  // Trial / exhausted dashboard
  return (
    <ProtectedClient roles={['student']}>
      <motion.div variants={containerVariants} initial="hidden" animate="visible"
        className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8 relative">

        {/* Onboarding Card */}
        {showOnboarding && (
          <motion.div variants={itemVariants} className="mb-8 bg-surface rounded-3xl shadow-sm border border-blue-100 dark:border-blue-900/30 overflow-hidden relative">
            <button onClick={() => { localStorage.setItem('onboarding_dismissed', 'true'); setOnboardingDismissed(true); }}
              className="absolute top-4 right-4 p-1 text-text-secondary hover:text-foreground">
              <X size={20} />
            </button>
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to StudyHours 👋 Let's get you started</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(completedStepsCount / 3) * 100}%` }} />
                </div>
                <span className="text-sm font-medium text-text-secondary">{completedStepsCount} of 3 steps complete</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {onboardingSteps.map((step) => (
                  <div key={step.id} className={`p-4 rounded-2xl border ${step.complete ? 'bg-green-50/50 border-green-100 dark:bg-green-900/10' : 'bg-background border-border'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${step.complete ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-surface text-text-secondary'}`}>
                        {step.complete ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 flex items-center justify-center font-bold text-xs">{step.id}</div>}
                      </div>
                    </div>
                    <p className="font-semibold text-foreground mb-3">{step.label}</p>
                    {!step.complete && (
                      <button onClick={() => { if (step.id === 1) setIsEditProfileOpen(true); else if (step.link) router.push(step.link); }}
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                        Complete Now <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TOP COMMAND BAR */}
        <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <motion.div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-primary font-bold shadow-inner">
                {user?.first_name?.[0] || user?.firstName?.[0] || 'S'}
              </motion.div>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-background px-3 py-1 rounded-full uppercase tracking-tighter border border-border">
                Student Portal
              </p>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              {getGreeting()}, {user?.firstName && user.firstName !== 'New' ? user.firstName : (user?.first_name !== 'New' ? user?.first_name : 'Scholar')}
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-text-secondary">Your learning dashboard is up to date.</p>
              <button onClick={() => setIsEditProfileOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all flex items-center gap-1">
                ✏️ Edit Profile
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {creditStatus?.canBook === true ? (
              <button onClick={() => router.push('/bookings/new')}
                className="hidden sm:flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-[1.03] active:scale-95 transition-all text-sm">
                <Plus size={18} /> Book New Session
              </button>
            ) : (
              <button onClick={() => router.push('/pricing')}
                className="hidden sm:flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/20 hover:scale-[1.03] active:scale-95 transition-all text-sm">
                Upgrade to continue
              </button>
            )}
          </div>
        </motion.header>

        {/* Trial exhausted upgrade banner */}
        {(creditStatus?.mode === 'trial_exhausted' || creditStatus?.mode === 'trial_expired') && (
          <motion.div variants={itemVariants}
            className="rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="font-bold text-amber-800 dark:text-amber-300">You've used your free sessions — enroll in a package to continue learning</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Your trial has ended. Choose a plan to book more classes.</p>
            </div>
            <button onClick={() => router.push('/pricing')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-all whitespace-nowrap">
              View Packages
            </button>
          </motion.div>
        )}

        {/* TRIAL BANNER */}
        {creditStatus?.mode === 'trial_active' && <TrialBanner status={creditStatus} />}

        {(creditStatus?.mode === 'trial_exhausted' || creditStatus?.mode === 'trial_expired') ? (
          <UpgradeNudge status={creditStatus} pastSessions={pastSessions} onSubscribed={refetchCredits} />
        ) : (
          <>
            {/* STATS OVERVIEW */}
            <motion.section variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard icon={CheckCircle2} label="Completed Classes" value={stats.completedCount} color="#10b981" description="Keep it up!" />
              <StatCard icon={Hourglass} label="Learning Hours" value={stats.totalHours} description="Total time spent" color="#f59e0b" />
              <div className={`bg-surface p-6 rounded-3xl border transition-all duration-500 flex flex-col justify-between shadow-sm ${progressSummary?.streakWeeks && progressSummary.streakWeeks >= 4 ? 'border-amber-400 shadow-amber-100 dark:shadow-none' : 'border-border'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${progressSummary?.streakWeeks && progressSummary.streakWeeks > 0 ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-gray-50 dark:bg-gray-700 text-gray-400'}`}>
                    <Flame size={20} fill={progressSummary?.streakWeeks && progressSummary.streakWeeks > 0 ? "currentColor" : "none"} />
                  </div>
                  {progressSummary?.streakWeeks && progressSummary.streakWeeks >= 8 && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wider">🏆 On fire!</span>
                  )}
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{progressSummary?.streakWeeks || 0} week{progressSummary?.streakWeeks !== 1 ? 's' : ''}</div>
                  <div className="text-sm text-text-secondary">{progressSummary?.streakWeeks && progressSummary.streakWeeks > 0 ? 'week streak' : 'Start your streak today'}</div>
                </div>
              </div>
            </motion.section>

            {/* Achievements */}
            <motion.section variants={itemVariants}>
              <AchievementBadges progress={progressSummary} />
            </motion.section>

            {/* Tutor Stickers — given during live sessions */}
            {progressSummary?.stickers && progressSummary.stickers.length > 0 && (
              <motion.section variants={itemVariants} className="space-y-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Star size={20} className="text-yellow-500" /> Tutor Stickers
                </h3>
                <div className="flex flex-wrap gap-3">
                  {(() => {
                    const counts: Record<string, number> = {};
                    progressSummary.stickers.forEach((s: string) => { counts[s] = (counts[s] || 0) + 1; });
                    
                    const STICKER_MAP: Record<string, { emoji: string; label: string }> = {
                      crown: { emoji: '👑', label: 'Crown' },
                      diamond: { emoji: '💎', label: 'Diamond' },
                      dinosaur: { emoji: '🦕', label: 'Dino' },
                      flame: { emoji: '🔥', label: 'Flame' },
                      rainbow: { emoji: '🌈', label: 'Rainbow' },
                      rocket: { emoji: '🚀', label: 'Rocket' },
                      shiningstar: { emoji: '🌟', label: 'Shining Star' },
                      star: { emoji: '⭐', label: 'Star' },
                      trophy: { emoji: '🏆', label: 'Trophy' },
                      unicorn: { emoji: '🦄', label: 'Unicorn' },
                      heart: { emoji: '❤️', label: 'Heart' },
                      fire: { emoji: '🔥', label: 'Fire' },
                      brain: { emoji: '🧠', label: 'Genius' },
                      clap: { emoji: '👏', label: 'Bravo' },
                      sparkle: { emoji: '✨', label: 'Sparkle' },
                      thumbsup: { emoji: '👍', label: 'Thumbs Up' },
                      lightbulb: { emoji: '💡', label: 'Bright Idea' },
                      100: { emoji: '💯', label: 'Perfect' },
                    };

                    return Object.entries(counts).map(([type, count]) => {
                      const info = STICKER_MAP[type] || { emoji: '🏅', label: type };
                      return (
                        <div key={type} className="group relative flex flex-col items-center p-3 rounded-2xl bg-surface border border-yellow-100 dark:border-yellow-900/30 hover:shadow-md transition-all min-w-[72px]">
                          <span className="text-3xl group-hover:scale-125 transition-transform">{info.emoji}</span>
                          <span className="text-[10px] font-bold text-foreground mt-1">{info.label}</span>
                          {count > 1 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-yellow-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                              ×{count}
                            </span>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </motion.section>
            )}

            {/* Tutor Feedback */}
            {progressSummary?.recentFeedback && progressSummary.recentFeedback.length > 0 && (
              <motion.section variants={itemVariants} className="space-y-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <MessageSquare size={20} className="text-blue-500" /> Tutor Feedback
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {progressSummary.recentFeedback.map((f, i) => (
                    <div key={i} className="p-5 rounded-3xl bg-surface border border-border shadow-sm group hover:border-blue-200 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{f.subject}</p>
                          <p className="text-[10px] text-text-secondary">{fmtDate(f.date)}</p>
                        </div>
                        <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500"><Quote size={14} /></div>
                      </div>
                      <p className="text-sm text-foreground italic leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">"{f.note}"</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Class Recordings */}
            {progressSummary?.recentRecordings && progressSummary.recentRecordings.length > 0 && (
              <motion.section variants={itemVariants} className="space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <PlayCircle size={20} className="text-red-500" /> Class Recordings
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {progressSummary.recentRecordings.map((r, i) => (
                    <div key={i} className="group p-5 rounded-3xl bg-surface border border-border shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 flex items-center justify-center">
                          <Video size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground line-clamp-1">{r.subject}</h4>
                          <p className="text-[10px] text-text-secondary uppercase">{fmtDate(r.date)}</p>
                        </div>
                      </div>
                      <a href={`/recordings/${r.sessionId}`} target="_blank" rel="noopener noreferrer"
                        className="w-full py-2.5 bg-background hover:bg-red-500 hover:text-white border border-border hover:border-red-500 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2">
                        <Play size={14} /> Watch Lesson
                      </a>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* HERO AREA: NEXT CLASS */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <GraduationCap className="text-blue-500" size={20} /> Priority Task
                  </h3>
                  <SessionCommandCard session={nextSession} loading={loading} />
                </div>

                <AnimatePresence>
                  {user?.email_verified === false && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4 text-amber-800 shadow-sm">
                      <AlertCircle className="shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="font-bold text-sm">Action Needed: Verify your email</p>
                        <p className="text-xs opacity-90">You won't be able to book new sessions until your email is verified.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={itemVariants} className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Calendar size={20} className="text-blue-500" /> Upcoming Schedule
                    </h2>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-background px-2 py-1 rounded-md border border-border">
                      {otherUpcoming.length} Other Classes
                    </span>
                  </div>
                  <div className="space-y-3">
                    {loading ? (
                      <div className="py-10 text-center text-blue-300">Loading schedule...</div>
                    ) : otherUpcoming.length > 0 ? (
                      otherUpcoming.map((session: any) => (
                        <div key={session.id} className="p-4 rounded-xl bg-surface border border-border flex justify-between items-center group hover:bg-background transition-all cursor-default">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-lg shadow-sm">📚</div>
                            <div>
                              <h3 className="font-bold text-foreground group-hover:text-blue-600 transition-colors">{session.subject?.name || 'Class Session'}</h3>
                              <p className="text-xs text-text-secondary">{fmtDate(session.start_time)}</p>
                            </div>
                          </div>
                          <ChevronRight className="text-gray-300 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" size={16} />
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center bg-background rounded-2xl border border-dashed border-border">
                        <p className="text-sm text-text-secondary italic">No other classes scheduled.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* SIDEBAR */}
              <aside className="space-y-6">
                <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm overflow-hidden relative">
                  <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 relative z-10">
                    <CheckCircle2 size={18} className="text-green-500" /> Recently Finished
                  </h2>
                  <div className="space-y-4 relative z-10 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                    {pastSessions.length > 0 ? (
                      pastSessions.map((session: any) => (
                        <div key={session.id} className="relative pl-6 border-l-2 border-green-100 dark:border-green-900/30 pb-4 last:pb-0">
                          <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-green-400" />
                          <div>
                            <h4 className="text-sm font-bold text-foreground">{session.subject?.name || 'Session'}</h4>
                            <p className="text-[10px] text-text-secondary uppercase font-bold opacity-60">{fmtDate(session.start_time).split(',')[0]}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 opacity-50">
                        <p className="text-xs font-bold">Your journey is just beginning!</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-[-20px] right-[-20px] text-8xl opacity-5 pointer-events-none select-none">🎓</div>
                </div>

                <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
                  <h3 className="font-extrabold text-lg mb-2 relative z-10">Practice makes perfect!</h3>
                  <p className="text-xs text-white/80 mb-4 relative z-10">Review your past classes to improve your skills faster.</p>
                  <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-all relative z-10">Daily Challenge (Coming Soon)</button>
                  <div className="absolute top-[-10px] right-[-10px] w-20 h-20 bg-white/10 rounded-full blur-xl" />
                </div>
              </aside>
            </motion.div>

            {/* MOBILE CTA */}
            <motion.div variants={itemVariants} className="flex sm:hidden">
              {creditStatus?.canBook === true ? (
                <button onClick={() => router.push('/bookings/new')}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl hover:bg-blue-600 transition-all">
                  <Plus size={20} /> Book Session
                </button>
              ) : (
                <button onClick={() => router.push('/pricing')}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-violet-600 text-white font-bold rounded-2xl shadow-xl hover:bg-violet-700 transition-all">
                  Upgrade to continue
                </button>
              )}
            </motion.div>
          </>
        )}
      </motion.div>

      {studentProfile && (
        <EditStudentProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          student={studentProfile}
          onUpdate={fetchProfile}
        />
      )}
    </ProtectedClient>
  );
}
