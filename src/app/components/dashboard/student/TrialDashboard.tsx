'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useIsAppShell } from '@/app/Hooks/useIsAppShell';

import dynamic from 'next/dynamic';

// Modular Components
import { DashboardHeader } from './DashboardHeader';
import { SessionHero } from './SessionHero';
import { StatCardsSection } from './StatCardsSection';
import { AchievementSection } from './AchievementSection';
import { StickerRewards } from './StickerRewards';
import { MaterialsVaultSection } from './MaterialsVaultSection';
import { OnboardingCard } from './OnboardingCard';
import { UpcomingSchedule } from './UpcomingSchedule';
import { PastSessionsSidebar } from './PastSessionsSidebar';
import { TrialBanner } from '@/app/components/dashboard/TrialBanner';
import { UpgradeNudge } from '@/app/components/dashboard/UpgradeNudge';

const LearningLab = dynamic(
  () => import('./LearningLab').then(mod => mod.LearningLab),
  { ssr: false }
);

interface TrialDashboardProps {
  user: any;
  studentProfile: any;
  creditStatus: any;
  progressSummary: any;
  upcomingSessions: any[];
  pastSessions: any[];
  loading: boolean;
  showOnboarding: boolean;
  onboardingSteps: any[];
  completedStepsCount: number;
  onDismissOnboarding: () => void;
  onEditProfile: () => void;
  onBookSession: () => void;
  onUpgrade: () => void;
  refetchCredits: () => void;
  setShowLearningWizard: (val: boolean) => void;
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

export const TrialDashboard: React.FC<TrialDashboardProps> = ({
  user,
  studentProfile,
  creditStatus,
  progressSummary,
  upcomingSessions,
  pastSessions,
  loading,
  showOnboarding,
  onboardingSteps,
  completedStepsCount,
  onDismissOnboarding,
  onEditProfile,
  onBookSession,
  onUpgrade,
  refetchCredits,
  setShowLearningWizard,
  isEnrolled
}) => {
  const router = useRouter();
  const isAppShell = useIsAppShell();

  const stats = useMemo(() => {
    const completedCount = progressSummary?.totalSessions || 0;
    const totalHours = progressSummary?.totalHoursLearned?.toFixed(1) || '0.0';
    return { completedCount, totalHours };
  }, [progressSummary]);

  const fmtDate = (iso?: string) => {
    if (!iso) return 'Date TBD';
    try {
      return new Date(iso).toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit',
      });
    } catch { return 'Invalid Date'; }
  };

  const nextSession = upcomingSessions[0] ?? null;
  const otherUpcoming = upcomingSessions.slice(1);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const sessionGrid = (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <SessionHero 
          nextSession={nextSession}
          loading={loading}
          isEnrolled={false}
        />

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

        <UpcomingSchedule 
          sessions={otherUpcoming}
          loading={loading}
          fmtDate={fmtDate}
        />
      </div>

      <PastSessionsSidebar 
        pastSessions={pastSessions}
        fmtDate={fmtDate}
      />
    </div>
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible"
      className={isAppShell ? 'w-full p-4 md:p-8 space-y-8 relative' : 'min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8 relative'}>

      {/* Onboarding Card */}
      {showOnboarding && (
        <OnboardingCard 
          steps={onboardingSteps}
          completedCount={completedStepsCount}
          onDismiss={onDismissOnboarding}
          onCompleteStep={(id, link) => {
            if (id === 1) onEditProfile();
            else if (link) router.push(link);
          }}
        />
      )}

      <DashboardHeader 
        user={user}
        isEnrolled={isEnrolled}
        onEditProfile={onEditProfile}
        canBook={creditStatus?.canBook}
        onBookSession={onBookSession}
        onUpgrade={onUpgrade}
        getGreeting={getGreeting}
      />

      {/* If in app shell, we move these to a sticky bottom bar later, or we can just render them in a fixed container here */}
      {!isAppShell && (
        <>
          {/* Trial exhausted / expired upgrade banner */}
          {(creditStatus?.mode === 'trial_exhausted' || creditStatus?.mode === 'trial_expired') && (
            <motion.div variants={itemVariants}
              className="rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="font-bold text-amber-800 dark:text-amber-300">You've used your free sessions — enroll in a package to continue learning</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Your trial has ended. Choose a plan to book more classes.</p>
              </div>
              <button onClick={onUpgrade}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-all whitespace-nowrap">
                View Packages
              </button>
            </motion.div>
          )}

          {/* Learning mode — out of credits banner */}
          {creditStatus?.mode === 'learning' && (creditStatus?.creditsRemaining ?? 0) === 0 && (
            <motion.div variants={itemVariants}
              className="rounded-2xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="font-bold text-violet-800 dark:text-violet-300">You're out of sessions for this month</p>
                <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">Your current package credits are used up. Renew or upgrade to keep learning.</p>
              </div>
              <button onClick={onUpgrade}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm transition-all whitespace-nowrap">
                Renew / Upgrade
              </button>
            </motion.div>
          )}

          {/* TRIAL BANNER */}
          {creditStatus?.mode === 'trial_active' && <TrialBanner status={creditStatus} />}
        </>
      )}

      {/* ALWAYS SHOW UPCOMING SESSIONS IF ANY */}
      {upcomingSessions.length > 0 && sessionGrid}

      {(creditStatus?.mode === 'trial_exhausted' || creditStatus?.mode === 'trial_expired') ? (
        <UpgradeNudge
          status={creditStatus}
          pastSessions={pastSessions}
          onSubscribed={() => { refetchCredits(); setShowLearningWizard(true); }}
        />
      ) : (
        <>
          <StatCardsSection 
            completedCount={stats.completedCount}
            totalHours={stats.totalHours}
            streak={progressSummary?.streakWeeks || 0}
          />

          <motion.div variants={itemVariants}>
            <LearningLab isEnrolled={false} />
          </motion.div>

          <AchievementSection progress={progressSummary} />

          <StickerRewards stickers={studentProfile?.stickers || []} />

          <MaterialsVaultSection 
            recentRecordings={progressSummary?.recentRecordings || []}
            fmtDate={fmtDate}
          />

          {upcomingSessions.length === 0 && sessionGrid}

          {/* MOBILE CTA */}
          <motion.div variants={itemVariants} className="flex sm:hidden">
            {creditStatus?.canBook === true ? (
              <button onClick={onBookSession}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl hover:bg-blue-600 transition-all">
                Book Session
              </button>
            ) : (
              <button onClick={onUpgrade}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-violet-600 text-white font-bold rounded-2xl shadow-xl hover:bg-violet-700 transition-all">
                Upgrade to continue
              </button>
            )}
          </motion.div>
        </>
      )}

      {/* STICKY BOTTOM BAR FOR NATIVE APP TRIAL STATUS */}
      {isAppShell && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-slate-900/80 backdrop-blur-md border-t border-slate-800">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            {creditStatus?.mode === 'trial_exhausted' || creditStatus?.mode === 'trial_expired' ? (
              <>
                <div>
                  <p className="font-bold text-amber-400 text-sm">Free trial ended</p>
                  <p className="text-xs text-slate-400 mt-0.5">Enroll to continue booking classes.</p>
                </div>
                <button onClick={onUpgrade} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg text-sm transition-all whitespace-nowrap">
                  View Packages
                </button>
              </>
            ) : creditStatus?.mode === 'learning' && (creditStatus?.creditsRemaining ?? 0) === 0 ? (
              <>
                <div>
                  <p className="font-bold text-violet-400 text-sm">Out of sessions</p>
                  <p className="text-xs text-slate-400 mt-0.5">Renew or upgrade to keep learning.</p>
                </div>
                <button onClick={onUpgrade} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg text-sm transition-all whitespace-nowrap">
                  Renew
                </button>
              </>
            ) : creditStatus?.mode === 'trial_active' ? (
              <>
                <div>
                  <p className="font-bold text-blue-400 text-sm">Trial Active</p>
                  <p className="text-xs text-slate-400 mt-0.5">{creditStatus?.creditsRemaining ?? 0} sessions left</p>
                </div>
                <button onClick={onUpgrade} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 rounded-lg text-sm transition-all whitespace-nowrap">
                  Upgrade Plan
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </motion.div>
  );
};
