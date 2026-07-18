'use client';

import React, { useMemo, useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { EnrolledDashboard } from '@/app/components/dashboard/student/EnrolledDashboard';
import { AppDashboard } from '@/app/components/app-shell/AppDashboard';
import { TrialDashboard } from '@/app/components/dashboard/student/TrialDashboard';
import { PlanBadgeWeb } from '@/app/components/dashboard/student/PlanBadgeWeb';
import { SubjectsCardWeb } from '@/app/components/dashboard/student/SubjectsCardWeb';
import { useIsAppShell } from '@/app/Hooks/useIsAppShell';
import ProtectedClient from '@/app/components/ProtectedClient';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { useAuthContext } from '@/app/context/AuthContext';
import { useStudentDashboardSummary } from '@/app/Hooks/useStudentDashboardSummary';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

// Loading Skeleton
import { DashboardLoadingSkeleton } from '@/app/components/dashboard/student/DashboardLoadingSkeleton';
import { SetupBanner } from '@/app/components/dashboard/student/SetupBanner';

// Modals - also dynamic to save initial bundle size
const EditStudentProfileModal = dynamic(
  () => import('@/app/components/dashboard/EditStudentProfileModal').then(mod => mod.EditStudentProfileModal),
  { ssr: false }
);

const RatingModal = dynamic(
  () => import('@/app/components/RatingModal'),
  { ssr: false }
);

const LearningModeWizard = dynamic(
  () => import('@/app/components/dashboard/LearningModeWizard').then(mod => mod.LearningModeWizard),
  { ssr: false }
);

const BADGES = [
  { id: 'first_step', label: 'First Step', description: 'Completed your first session' },
  { id: 'consistent', label: 'Consistent', description: 'Attended 4 sessions in a month' },
  { id: 'quick_learner', label: 'Quick Learner', description: '2 week streak' },
  { id: 'dedicated', label: 'Dedicated', description: '10 sessions completed' },
  { id: 'star_student', label: 'Star Student', description: '4 week streak' },
];

function StudentDashboardContent() {
  const { user } = useAuthContext();
  const router = useRouter();
  const isAppShell = useIsAppShell();
  
  // Data Fetching via the optimized parallelized backend summary query
  const {
    studentProfile,
    creditStatus,
    progressSummary,
    enrollmentStatus: enrollment,
    pendingRatings,
    bookings,
    upcomingSessions,
    pastSessions,
    isLoading: isGlobalLoading,
    refetch,
  } = useStudentDashboardSummary();

  // Local State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('onboarding_dismissed');
  });
  const [showLearningWizard, setShowLearningWizard] = useState(false);
  const [ratingsDismissed, setRatingsDismissed] = useState(false);
  const showRatingModal = pendingRatings.length > 0 && !ratingsDismissed;
  
  const prevBadgesRef = useRef<string[]>([]);

  // Redirect admin
  useEffect(() => {
    if (user?.role === 'admin') router.push('/admin/dashboard');
  }, [user?.role, router]);

  // Badge Celebration
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
              description: `🏅 ${badge.description}`,
              duration: 5000,
            });
          }
        });
      }
      prevBadgesRef.current = progressSummary.badges;
    }
  }, [progressSummary?.badges]);

  const isEnrolled = enrollment?.status === 'learning';

  // Onboarding Logic
  const onboardingSteps = useMemo(() => {
    if (!studentProfile || !progressSummary) return [];
    const step1 = !!(
      (studentProfile.grade && studentProfile.school) ||
      (studentProfile.interests && studentProfile.interests.length > 0) ||
      studentProfile.recent_focus ||
      (studentProfile.struggle_areas && studentProfile.struggle_areas.length > 0)
    );
    const step2 = upcomingSessions.length > 0 || pastSessions.length > 0;
    const step3 = progressSummary.totalSessions > 0;
    return [
      { id: 1, label: 'Complete your student profile', complete: step1 },
      { id: 2, label: 'Book your Diagnostic Assessment', complete: step2, link: '/bookings/new' },
      { id: 3, label: 'Unlock your targeted gap fix', complete: step3 }
    ];
  }, [studentProfile, progressSummary, upcomingSessions, pastSessions]);

  const showOnboarding = useMemo(() => {
    return !onboardingDismissed && 
           creditStatus?.mode === 'trial_active' && 
           progressSummary?.totalSessions === 0;
  }, [onboardingDismissed, creditStatus, progressSummary]);

  const completedStepsCount = onboardingSteps.filter(s => s.complete).length;

  if (isGlobalLoading || !studentProfile) {
    if (isAppShell) {
      return (
        <AppDashboard
          studentProfile={null}
          enrollment={null}
          upcomingSessions={[]}
          pastSessions={[]}
          bookings={[]}
          loading={true}
          user={user}
          progressSummary={null}
          isEnrolled={false}
          creditStatus={null}
        />
      );
    }
    return <DashboardLoadingSkeleton />;
  }

  return (
    <ErrorBoundary>
      <div className={isAppShell ? "h-full" : "space-y-8 pb-12"}>
        {!isAppShell && <SetupBanner />}
        {!isAppShell && (
          <div className="flex justify-end">
            <PlanBadgeWeb credit={creditStatus} />
          </div>
        )}
        {!isAppShell && user && user.phone_verified !== true && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📱</span>
                    <div>
                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                            Verify your phone number
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                            Please verify your phone number to receive session reminders and updates.
                        </p>
                    </div>
                </div>
                <a
                    href="/verify-phone"
                    className="shrink-0 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors"
                >
                    Verify now →
                </a>
            </div>
        )}
        {isAppShell ? (
          // Desktop app: every user (trial or enrolled) gets the native bento dashboard.
          <AppDashboard
            studentProfile={studentProfile}
            enrollment={enrollment}
            upcomingSessions={upcomingSessions}
            pastSessions={pastSessions}
            bookings={bookings}
            loading={isGlobalLoading}
            user={user}
            progressSummary={progressSummary}
            isEnrolled={isEnrolled}
            pendingRatings={pendingRatings}
            creditStatus={creditStatus}
          />
        ) : isEnrolled ? (
            <EnrolledDashboard
              studentProfile={studentProfile}
              enrollment={enrollment}
              upcomingSessions={upcomingSessions}
              pastSessions={pastSessions}
              bookings={bookings}
              loading={isGlobalLoading}
              user={user}
              progressSummary={progressSummary}
              isEnrolled={true}
            />
        ) : (
          <TrialDashboard
            user={user}
            studentProfile={studentProfile}
            creditStatus={creditStatus}
            progressSummary={progressSummary}
            upcomingSessions={upcomingSessions}
            pastSessions={pastSessions}
            loading={isGlobalLoading}
            showOnboarding={showOnboarding}
            onboardingSteps={onboardingSteps}
            completedStepsCount={completedStepsCount}
            onDismissOnboarding={() => {
              localStorage.setItem('onboarding_dismissed', 'true');
              setOnboardingDismissed(true);
            }}
            onEditProfile={() => setIsEditProfileOpen(true)}
            onBookSession={() => router.push('/bookings/new')}
            onUpgrade={() => router.push('/pricing')}
            refetchCredits={refetch}
            setShowLearningWizard={setShowLearningWizard}
            isEnrolled={false}
          />
        )}

        {/* Your subjects + topics covered (web dashboards only) */}
        {!isAppShell && <SubjectsCardWeb progressSummary={progressSummary} />}
      </div>

      {/* Modals */}
      {studentProfile && (
        <EditStudentProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          student={studentProfile}
          onUpdate={refetch}
        />
      )}
      
      {showRatingModal && pendingRatings.length > 0 && (
        <RatingModal
          pending={pendingRatings}
          onDone={() => setRatingsDismissed(true)}
        />
      )}
      
      {showLearningWizard && studentProfile && (
        <LearningModeWizard
          studentId={studentProfile.id}
          programId={studentProfile.program_id || ''}
          packageId={studentProfile.package_id || ''}
          curriculumId={studentProfile.curriculum_preference}
          onComplete={() => setShowLearningWizard(false)}
        />
      )}
    </ErrorBoundary>
  );
}

export default function StudentDashboardPage() {
  return (
    <ProtectedClient roles={['student']}>
      <StudentDashboardContent />
    </ProtectedClient>
  );
}
