'use client';

import React, { useMemo, useEffect, useState, useRef } from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useAuthContext } from '@/app/context/AuthContext';
import useStudentDashboard from '@/app/Hooks/useStudentDashboard';
import { useCreditStatus } from '@/app/Hooks/useCreditStatus';
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
  BookOpen,
  Star,
  ChevronRight,
} from 'lucide-react';
import { differenceInMinutes, format, isToday, isTomorrow, addDays, startOfWeek } from 'date-fns';
import { api } from '@/app/lib/api';
import { EditStudentProfileModal } from '@/app/components/dashboard/EditStudentProfileModal';
import { motion, AnimatePresence, Variants } from 'framer-motion';

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

/* ─── Enrolled Dashboard ─── */
function EnrolledDashboard({ studentProfile, enrollment, upcomingSessions, pastSessions, bookings, loading, user }: any) {
  const scheduleRef = useRef<HTMLDivElement>(null);
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
  const completedCount = pastSessions.length;
  const hoursThisMonth = useMemo(() => {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const mins = pastSessions.filter((s: any) => {
      const start = new Date(s.start_time ?? s.requested_start ?? 0);
      return start >= monthStart;
    }).reduce((acc: number, s: any) => {
      const start = s.start_time ? new Date(s.start_time) : null;
      const end = s.end_time ? new Date(s.end_time) : null;
      return start && end ? acc + Math.max(0, differenceInMinutes(end, start)) : acc;
    }, 0);
    return (mins / 60).toFixed(1);
  }, [pastSessions]);

  // Streak (weeks with at least 1 session)
  const streak = useMemo(() => {
    let count = 0;
    let weekAgo = now;
    for (let w = 0; w < 12; w++) {
      const wStart = addDays(weekAgo, -7);
      const hasSession = pastSessions.some((s: any) => {
        const d = new Date(s.start_time ?? s.requested_start ?? 0);
        return d >= wStart && d < weekAgo;
      });
      if (!hasSession) break;
      count++;
      weekAgo = wStart;
    }
    return count;
  }, [pastSessions]);

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
        className="bg-gradient-to-br from-violet-600 to-blue-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-violet-500/20 relative overflow-hidden">
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

      {/* Stat cards */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={CheckCircle2} label="Sessions Completed" value={`${completedCount}/${enrollment?.sessionsRemaining + completedCount || completedCount}`} color="#10b981" description="in your package" />
        <StatCard icon={Hourglass} label="Hours This Month" value={hoursThisMonth} color="#f59e0b" description="Keep the momentum!" />
        <StatCard icon={Star} label="Weekly Streak" value={`${streak} week${streak !== 1 ? 's' : ''}`} color="#8b5cf6" description="Consistency is key" />
      </motion.section>

      {/* Weekly schedule */}
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

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState<any>(null);

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
    const now = new Date();
    const completed = bookings.filter((b: any) => {
      const end = b.end_time ? new Date(b.end_time) : b.requested_end ? new Date(b.requested_end) : null;
      if (!end) return false;
      return b.status === 'completed' || (end < now && b.status !== 'cancelled' && b.status !== 'declined');
    });
    const totalMinutes = completed.reduce((acc: number, b: any) => {
      const s = b.start_time ? new Date(b.start_time) : b.requested_start ? new Date(b.requested_start) : null;
      const e = b.end_time ? new Date(b.end_time) : b.requested_end ? new Date(b.requested_end) : null;
      return s && e ? acc + Math.max(0, differenceInMinutes(e, s)) : acc;
    }, 0);
    return { completedCount: completed.length, totalHours: (totalMinutes / 60).toFixed(1), upcomingCount: upcomingSessions.length };
  }, [bookings, upcomingSessions]);

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
              <StatCard icon={Calendar} label="Next Session"
                value={creditStatus?.mode !== 'trial_active' && creditStatus?.mode !== 'paid' ? '—' : nextSession ? fmtDate(nextSession.start_time).split(',')[0] : 'None'}
                description={creditStatus?.mode !== 'trial_active' && creditStatus?.mode !== 'paid' ? 'Subscribe to book' : nextSession ? fmtDate(nextSession.start_time).split(',')[1] : 'Book one today'}
                color="#3b82f6" />
            </motion.section>

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

                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
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
