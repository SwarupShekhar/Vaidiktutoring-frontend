'use client';

import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ProtectedClient from '@/app/components/ProtectedClient';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { useAuthContext } from '@/app/context/AuthContext';
import useStudentDashboard from '@/app/Hooks/useStudentDashboard';
import { useCreditStatus } from '@/app/Hooks/useCreditStatus';
import { useStudentProgress } from '@/app/Hooks/useStudentProgress';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/api';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

// Loading Skeleton
import { DashboardLoadingSkeleton } from '@/app/components/dashboard/student/DashboardLoadingSkeleton';

// Dynamic Imports for Dashboards
const EnrolledDashboard = dynamic(
  () => import('@/app/components/dashboard/student/EnrolledDashboard').then(mod => mod.EnrolledDashboard),
  { loading: () => <DashboardLoadingSkeleton />, ssr: false }
);

const TrialDashboard = dynamic(
  () => import('@/app/components/dashboard/student/TrialDashboard').then(mod => mod.TrialDashboard),
  { loading: () => <DashboardLoadingSkeleton />, ssr: false }
);

const BlogSection = dynamic(
  () => import('@/app/components/dashboard/student/BlogSection').then(mod => mod.BlogSection),
  { ssr: false }
);

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

export default function StudentDashboardPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  
  // Data Fetching
  const { upcomingSessions, pastSessions, bookings, loading: dashboardLoading } = useStudentDashboard();
  const { status: creditStatus, refetch: refetchCredits } = useCreditStatus();
  const { progressSummary, refetch: refetchProgress } = useStudentProgress();

  // Local State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const [showLearningWizard, setShowLearningWizard] = useState(false);
  const [pendingRatings, setPendingRatings] = useState<any[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  const prevBadgesRef = useRef<string[]>([]);

  // Initial Data
  useEffect(() => {
    api.get('/ratings/pending')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        if (data.length > 0) {
          setPendingRatings(data);
          setShowRatingModal(true);
        }
      })
      .catch(() => {});

    const d = localStorage.getItem('onboarding_dismissed');
    if (d) setOnboardingDismissed(true);
  }, []);

  // Redirect admin
  useEffect(() => {
    if (user?.role === 'admin') router.push('/admin/dashboard');
  }, [user?.role, router]);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get('/students/me');
      setStudentProfile(res.data);
    } catch {}
  }, []);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user, fetchProfile]);

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

  // Enrollment Status
  const { data: enrollment, isLoading: enrollmentLoading } = useQuery({
    queryKey: ['enrollment-status', studentProfile?.id],
    queryFn: async () => {
      const res = await api.get(`/students/${studentProfile.id}/enrollment-status`);
      return res.data;
    },
    enabled: !!studentProfile?.id,
    staleTime: 60_000,
  });

  const isEnrolled = enrollment?.status === 'learning';

  // Onboarding Logic
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

  const showOnboarding = useMemo(() => {
    return !onboardingDismissed && 
           creditStatus?.mode === 'trial_active' && 
           progressSummary?.totalSessions === 0;
  }, [onboardingDismissed, creditStatus, progressSummary]);

  const completedStepsCount = onboardingSteps.filter(s => s.complete).length;

  // Master Loading State
  const isGlobalLoading = dashboardLoading || enrollmentLoading || !studentProfile;

  if (isGlobalLoading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <ProtectedClient roles={['student']}>
      <ErrorBoundary>
        <div className="space-y-8 pb-12">
          {isEnrolled ? (
            <EnrolledDashboard 
              studentProfile={studentProfile}
              enrollment={enrollment}
              upcomingSessions={upcomingSessions}
              pastSessions={pastSessions}
              bookings={bookings}
              loading={dashboardLoading}
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
              loading={dashboardLoading}
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
              refetchCredits={refetchCredits}
              setShowLearningWizard={setShowLearningWizard}
              isEnrolled={false}
            />
          )}

          {/* Blogs are at the bottom of both dashboards */}
          <BlogSection />
        </div>

        {/* Modals */}
        {studentProfile && (
          <EditStudentProfileModal
            isOpen={isEditProfileOpen}
            onClose={() => setIsEditProfileOpen(false)}
            student={studentProfile}
            onUpdate={fetchProfile}
          />
        )}
        
        {showRatingModal && pendingRatings.length > 0 && (
          <RatingModal
            pending={pendingRatings}
            onDone={() => setShowRatingModal(false)}
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
    </ProtectedClient>
  );
}
