'use client';

import React, { useMemo } from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useAuthContext } from '@/app/context/AuthContext';
import useStudentDashboard from '@/app/Hooks/useStudentDashboard';
import { useRouter } from 'next/navigation';
import { StatCard } from '@/app/components/dashboard/StatCard';
import { SessionCommandCard } from '@/app/components/dashboard/SessionCommandCard';
import {
  CheckCircle2,
  Hourglass,
  Calendar,
  Plus,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { differenceInMinutes } from 'date-fns';
import { api } from '@/app/lib/api';
import { EditStudentProfileModal } from '@/app/components/dashboard/EditStudentProfileModal';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export default function StudentDashboardPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { upcomingSessions, pastSessions, bookings, loading } = useStudentDashboard();

  // Profile State
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);
  const [studentProfile, setStudentProfile] = React.useState<any>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      } as any
    }
  };

  const fetchProfile = React.useCallback(async () => {
    try {
      const res = await api.get('/students/me');
      setStudentProfile(res.data);
    } catch (err) {
      console.error('Failed to fetch student profile:', err);
    }
  }, []);

  React.useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  // DERIVE STATS
  const stats = useMemo(() => {
    const now = new Date();
    const completed = bookings.filter((b: any) => {
      const endTime = new Date(b.end_time || b.requested_end);
      return b.status === 'completed' || (['confirmed', 'scheduled'].includes(b.status) && endTime < now);
    });

    const totalMinutes = completed.reduce((acc: number, curr: any) => {
      const start = new Date(curr.start_time || curr.requested_start);
      const end = new Date(curr.end_time || curr.requested_end);
      return acc + Math.max(0, differenceInMinutes(end, start));
    }, 0);

    return {
      completedCount: completed.length,
      totalHours: (totalMinutes / 60).toFixed(1),
      upcomingCount: upcomingSessions.length
    };
  }, [bookings, upcomingSessions]);

  const nextSession = upcomingSessions.length > 0 ? upcomingSessions[0] : null;
  const otherUpcoming = upcomingSessions.length > 1 ? upcomingSessions.slice(1) : [];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Date TBD';
    try {
      return new Date(isoString).toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit',
      });
    } catch (e) { return 'Invalid Date'; }
  };

  return (
    <ProtectedClient roles={['student']}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8 relative"
      >
        {/* Decorative Background Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        {/* TOP COMMAND BAR */}
        <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <motion.div
                whileHover={{ rotate: 10 }}
                className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold"
              >
                {user?.first_name?.[0] || user?.firstName?.[0] || 'S'}
              </motion.div>
              <p className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                Student Portal
              </p>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
              {getGreeting()}, {user?.firstName && user.firstName !== 'New' ? user.firstName : (user?.first_name !== 'New' ? user?.first_name : 'Scholar')}
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-[var(--color-text-secondary)] opacity-80">
                Your learning dashboard is up to date.
              </p>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all flex items-center gap-1"
              >
                ✏️ Edit Profile
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/bookings/new')}
              className="hidden sm:flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-[1.03] active:scale-95 transition-all text-sm"
            >
              <Plus size={18} />
              Book New Session
            </button>
          </div>
        </motion.header>

        {/* STATS OVERVIEW */}
        <motion.section variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={CheckCircle2}
            label="Completed Classes"
            value={stats.completedCount}
            color="#10b981"
            description="Keep it up!"
          />
          <StatCard
            icon={Hourglass}
            label="Learning Hours"
            value={stats.totalHours}
            description="Total time spent"
            color="#f59e0b"
          />
          <StatCard
            icon={Calendar}
            label="Next Session"
            value={nextSession ? formatDate(nextSession.start_time).split(',')[0] : 'None'}
            description={nextSession ? formatDate(nextSession.start_time).split(',')[1] : 'Book one today'}
            color="#3b82f6"
          />
        </motion.section>

        {/* HERO AREA: NEXT CLASS */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <GraduationCap className="text-blue-500" size={20} />
                Priority Task
              </h3>
              <SessionCommandCard session={nextSession} loading={loading} />
            </div>

            <AnimatePresence>
              {user?.email_verified === false && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4 text-amber-800 shadow-sm"
                >
                  <AlertCircle className="shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-bold text-sm">Action Needed: Verify your email</p>
                    <p className="text-xs opacity-90">You won't be able to book new sessions until your email is verified.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* UPCOMING MINI LIST */}
            <motion.div variants={itemVariants} className="bg-glass rounded-3xl p-6 border border-white/20 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                  <Calendar size={20} className="text-blue-500" />
                  Upcoming Schedule
                </h2>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                  {otherUpcoming.length} Other Classes
                </span>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="py-10 text-center text-blue-300">Loading schedule...</div>
                ) : otherUpcoming.length > 0 ? (
                  otherUpcoming.map((session: any) => (
                    <div key={session.id} className="p-4 rounded-xl bg-white/40 border border-white/20 flex justify-between items-center group hover:bg-white/60 transition-all cursor-default">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg shadow-sm">
                          📚
                        </div>
                        <div>
                          <h3 className="font-bold text-[var(--color-text-primary)] group-hover:text-blue-600 transition-colors">
                            {session.subject?.name || 'Class Session'}
                          </h3>
                          <p className="text-xs text-[var(--color-text-secondary)]">
                            {formatDate(session.start_time)}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="text-gray-300 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" size={16} />
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center bg-white/20 rounded-2xl border border-dashed border-white/40">
                    <p className="text-sm text-[var(--color-text-secondary)] italic">
                      No other classes scheduled.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* SIDEBAR: CLASS HISTORY */}
          <aside className="space-y-6">
            <div className="bg-glass rounded-3xl p-6 border border-white/20 shadow-sm overflow-hidden relative">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2 relative z-10">
                <CheckCircle2 size={18} className="text-green-500" />
                Recently Finished
              </h2>

              <div className="space-y-4 relative z-10 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                {pastSessions.length > 0 ? (
                  pastSessions.map((session: any) => (
                    <div key={session.id} className="relative pl-6 border-l-2 border-green-100 pb-4 last:pb-0">
                      <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-green-400" />
                      <div>
                        <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
                          {session.subject?.name || 'Session'}
                        </h4>
                        <p className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold opacity-60">
                          {formatDate(session.start_time).split(',')[0]}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 opacity-50">
                    <p className="text-xs font-bold">Your journey is just beginning!</p>
                  </div>
                )}
              </div>

              {/* Background decoration */}
              <div className="absolute bottom-[-20px] right-[-20px] text-8xl opacity-5 pointer-events-none select-none">
                🎓
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
              <h3 className="font-exrabold text-lg mb-2 relative z-10">Practice makes perfect!</h3>
              <p className="text-xs text-white/80 mb-4 relative z-10">Review your past classes to improve your skills faster.</p>
              <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-all relative z-10">
                Daily Challenge (Coming Soon)
              </button>
              <div className="absolute top-[-10px] right-[-10px] w-20 h-20 bg-white/10 rounded-full blur-xl" />
            </div>
          </aside>
        </motion.div>

        {/* MOBILE CTA */}
        <motion.div variants={itemVariants} className="flex sm:hidden">
          <button
            onClick={() => router.push('/bookings/new')}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[var(--color-primary)] text-white font-bold rounded-2xl shadow-xl hover:bg-blue-600 transition-all"
          >
            <Plus size={20} />
            Book Session
          </button>
        </motion.div>

      </motion.div>

      {/* Edit Profile Modal */}
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

// Simple Helper for the Missing Icon
const ArrowRight = ({ className, size }: { className?: string, size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
