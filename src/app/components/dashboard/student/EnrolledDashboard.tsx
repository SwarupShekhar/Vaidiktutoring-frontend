'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addDays, startOfWeek, isToday, isTomorrow, format } from 'date-fns';

import dynamic from 'next/dynamic';
import api from '@/app/lib/api';

// Modular Components
import { StudentProfile } from '@/app/Hooks/useStudentDashboardSummary';
import { ProgressSummary } from '@/app/Hooks/useStudentProgress';
import { DashboardHeader } from './DashboardHeader';
import { SessionHero } from './SessionHero';
import { StatCardsSection } from './StatCardsSection';
import { AchievementSection } from './AchievementSection';
import { StickerRewards } from './StickerRewards';
import { TutorCommunicationSection } from './TutorCommunicationSection';
import { MaterialsVaultSection } from './MaterialsVaultSection';
import { WeeklySchedule } from './WeeklySchedule';
import TutorCommunication from '@/app/students/dashboard/TutorCommunication';

const LearningLab = dynamic(
  () => import('./LearningLab').then(mod => mod.LearningLab),
  { ssr: false }
);

interface EnrolledDashboardProps {
  studentProfile: any;
  enrollment: any;
  upcomingSessions: any[];
  pastSessions: any[];
  bookings: any[];
  loading: boolean;
  user: any;
  progressSummary: any;
  isEnrolled: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

export const EnrolledDashboard: React.FC<EnrolledDashboardProps> = ({
  studentProfile,
  enrollment,
  upcomingSessions,
  pastSessions,
  bookings,
  loading,
  user,
  progressSummary,
  isEnrolled
}) => {
  const [isJoining, setIsJoining] = useState(false);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const now = new Date();

  const nextSession = upcomingSessions[0] ?? null;

  // 7-day week view logic
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(startOfWeek(now), i);
      const sessions = upcomingSessions.filter((s: any) => {
        const d = new Date(s.start_time ?? s.requested_start);
        return d.toDateString() === day.toDateString();
      });
      return { day, sessions };
    });
  }, [upcomingSessions, now]);

  // Stats
  const completedCount = progressSummary?.totalSessions || pastSessions.length;
  const hoursThisMonth = progressSummary?.totalHoursLearned?.toFixed(1) || '0.0';
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

  // Next session label
  const sessionStart = nextSession ? new Date(nextSession.start_time ?? nextSession.requested_start) : null;
  const sessionLabel = useMemo(() => {
    if (!sessionStart) return null;
    return isToday(sessionStart) ? `Today · ${format(sessionStart, 'h:mm a')}`
      : isTomorrow(sessionStart) ? `Tomorrow, ${format(sessionStart, 'EEEE d MMMM')} · ${format(sessionStart, 'h:mm a')}`
      : `${format(sessionStart, 'EEEE d MMMM')} · ${format(sessionStart, 'h:mm a')}`;
  }, [sessionStart]);

  const canJoin = nextSession
    ? (new Date(nextSession.start_time ?? nextSession.requested_start).toDateString() === now.toDateString() || new Date(nextSession.start_time ?? nextSession.requested_start) < now)
    : false;

  const fmtDate = (iso?: string) => {
    if (!iso) return 'Date TBD';
    try {
      return new Date(iso).toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit',
      });
    } catch { return 'Invalid Date'; }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible"
      className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">

      <DashboardHeader 
        user={user}
        isEnrolled={isEnrolled}
        onScrollToSchedule={() => scheduleRef.current?.scrollIntoView({ behavior: 'smooth' })}
        getGreeting={() => {
          const h = new Date().getHours();
          if (h < 12) return 'Good Morning';
          if (h < 17) return 'Good Afternoon';
          return 'Good Evening';
        }}
      />

      <SessionHero 
        nextSession={nextSession}
        loading={loading}
        isEnrolled={true}
        sessionLabel={sessionLabel}
        startWithin5Min={canJoin}
        isJoining={isJoining}
        onJoinSession={() => {
          if (!nextSession) return;
          // Resolve the video provider from the nested session row (booking payload),
          // falling back to the booking object itself.
          const sess = nextSession.sessions?.[0] ?? nextSession;
          const provider = sess?.video_provider ?? nextSession.video_provider;
          const legacyZoomLink = !!nextSession.meet_link && nextSession.meet_link.includes('zoom.us');
          const isZoom = provider === 'ZOOM' || legacyZoomLink;
          const zoomUrl =
            sess?.zoom_join_url ?? nextSession.zoom_join_url ?? (legacyZoomLink ? nextSession.meet_link : null);

          if (isZoom) {
            (async () => {
              try {
                setIsJoining(true);
                const { data } = await api.get(`/sessions/${sess?.id || nextSession.id}/zoom/join`);
                if (data.joinUrl) {
                  window.open(data.joinUrl, '_blank', 'noopener,noreferrer');
                }
              } catch (err) {
                console.error("Failed to join Zoom session", err);
                if (zoomUrl) window.open(zoomUrl, '_blank', 'noopener,noreferrer');
              } finally {
                setIsJoining(false);
              }
            })();
          } else if (nextSession.id) {
            // Daily.co (or default/unset) — join the in-app room.
            router.push(`/session/${nextSession.id}`);
          }
        }}
      />

      {/* Package Renewal Banner */}
      <AnimatePresence>
        {showRenewal && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-600 dark:text-amber-400">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-100 text-sm sm:text-base">
                  You have {progressSummary?.packageSessionsRemaining} sessions remaining in your current package
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/pricing')} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap">
                Renew
              </button>
              <button onClick={handleDismissRenewal} className="p-1 text-amber-400 hover:text-amber-600">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <StatCardsSection 
        completedCount={completedCount}
        totalHours={hoursThisMonth}
        streak={streak}
        sessionsRemaining={enrollment?.sessionsRemaining}
      />

      <motion.div variants={itemVariants}>
        <LearningLab isEnrolled={isEnrolled} />
      </motion.div>

      {/* Topics covered this month */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <AchievementSection progress={progressSummary} />
          
          <StickerRewards stickers={studentProfile?.stickers ?? []} />

          <MaterialsVaultSection 
            recentRecordings={progressSummary?.recentRecordings || []}
            fmtDate={fmtDate}
          />

          <div ref={scheduleRef}>
            <WeeklySchedule 
              weekDays={weekDays}
              upcomingSessions={upcomingSessions}
              isEnrolled={isEnrolled}
              fmtDate={fmtDate}
            />
          </div>
        </div>

        <div className="space-y-8">
          {/* Two-way chat: students initiate here → routed to their assigned tutor. */}
          <TutorCommunication
            tutorName={nextSession?.tutor?.name ?? null}
            currentUserId={user?.id}
          />
          <TutorCommunicationSection
            feedback={progressSummary?.recentFeedback || []}
            fmtDate={fmtDate}
          />
        </div>
      </div>
    </motion.div>
  );
};
