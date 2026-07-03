'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import { useUser } from '@clerk/nextjs';
import Loader from '@/app/components/Loader';
import { api } from '@/app/lib/api';
import { useIsAppShell } from '@/app/Hooks/useIsAppShell';

export default function OnboardingPage() {
  const { user, loading: authLoading, refreshUser } = useAuthContext();
  const isAppShell = useIsAppShell();
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [forceShowContent, setForceShowContent] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Once the user actively picks a role we drive navigation explicitly (to the
  // add-child / profile onboarding step). Without this, refreshing the role to
  // 'parent' makes the auto-redirect effect below fire and bounce them straight to
  // the dashboard — skipping onboarding entirely.
  const roleSelectionInProgress = useRef(false);

  // Set a timeout to force show content after 5 seconds (fallback)
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setForceShowContent(true);
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Redirect if role is already known and valid (Admin protection)
  // Only run redirect logic after auth is done loading
  useEffect(() => {
    // Skip if still loading and haven't force shown content
    if (authLoading || !isClerkLoaded) {
      if (!forceShowContent) return;
    }

    // If the user just picked a role, handleRoleSelect drives navigation to the
    // next onboarding step — don't let this auto-redirect race it to the dashboard.
    if (roleSelectionInProgress.current) return;

    // Debug: Check what role is being detected


    // Only a BRAND-NEW signup should see the role selector. It is uniquely marked
    // by onboarding_status 'not_started' (JIT default) with no chosen role yet.
    // Everyone else — a returning parent/student, or one who already picked a role
    // (publicMetadata.role set, which also flips status to 'in_progress') — goes to
    // their dashboard. Keying on onboarding_status (not publicMetadata alone) avoids
    // re-prompting older accounts that never had publicMetadata.role populated.
    // Admin/tutor are staff-provisioned and never self-onboard. Hard-nav (not
    // router.push) so the role-gated destination re-inits AuthContext with the
    // authoritative role → no stale-role 403 race.
    const onboardingStatus = (user as any)?.onboarding_status;
    const needsRoleChoice =
      !clerkUser?.publicMetadata?.role && onboardingStatus === 'not_started';

    if (user?.role === 'admin') {
      window.location.assign('/admin/dashboard');
    } else if (user?.role === 'tutor') {
      window.location.assign('/tutor/dashboard');
    } else if (user?.role === 'parent' && !needsRoleChoice && user?.id) {
      window.location.assign('/parent/dashboard');
    } else if (user?.role === 'student' && !needsRoleChoice && user?.id) {
      window.location.assign('/students/dashboard');
    }
    // else: fresh signup (needsRoleChoice) → fall through, render the selector.
  }, [user, clerkUser, router, authLoading, isClerkLoaded, forceShowContent]);

  const handleRoleSelect = async (selectedRole: 'parent' | 'student') => {
    setIsUpdating(true);
    roleSelectionInProgress.current = true; // stop the auto-redirect effect from hijacking
    try {
      import('posthog-js').then((posthog) => {
        posthog.default.capture('Role Selected', { role: selectedRole });
      });
      // Update Clerk Metadata for immediate client-side feedback.
      if (clerkUser) {
        await clerkUser.update({
          unsafeMetadata: { role: selectedRole }
        });
      }

      // Persist the role authoritatively in the backend (DB + Clerk publicMetadata),
      // then refresh the auth context. `user.role` comes from the backend profile
      // (backendUser), which is cached as the 'student' JIT default at signup; if we
      // navigate before re-fetching it, the role-gated onboarding page sees 'student'
      // and bounces to /unauthorized (the 403). updateRole awaits the DB write, so a
      // fresh getMe() here deterministically returns the new role.
      //
      // If the backend REJECTS the switch (e.g. this account already has a student
      // profile or already manages children — see auth.service.ts updateRole guard),
      // we must NOT navigate to the next onboarding step: that previously happened
      // silently (error only console.logged) and stranded the user on /onboarding/
      // add-student with their role never actually changed underneath them. This is
      // also what let a live paid student's account render as an empty 'parent'
      // shell after the role picker fired but the write partially/fully failed.
      try {
        await api.patch('/auth/role', { role: selectedRole });
        await refreshUser();
      } catch (err: any) {
        console.error('Failed to persist role to backend', err);
        roleSelectionInProgress.current = false;
        setIsUpdating(false);
        setRoleError(
          err?.response?.data?.message ||
            'Could not update your account. Please contact support before trying again.',
        );
        return;
      }

      // HARD navigation (not router.push). The next page is role-gated, and a
      // client-side push can render it before the refreshed 'parent' role has
      // propagated through React state → ProtectedClient sees the stale 'student'
      // and bounces to /unauthorized. A full page load re-initialises AuthContext
      // from scratch (getMe returns the now-authoritative role), so the gate passes
      // deterministically. It also sidesteps this page's auto-redirect effect.
      const nextStep =
        selectedRole === 'parent' ? '/onboarding/add-student' : '/onboarding/student-profile';
      window.location.assign(nextStep);
    } catch (e) {
      console.error("Failed to update role", e);
      setIsUpdating(false);
    }
  };

  const onboardingStatus = (user as any)?.onboarding_status;
  const needsRoleChoice =
    !clerkUser?.publicMetadata?.role && onboardingStatus === 'not_started';

  // Show loader while auth is loading - but not forever (max 5 seconds)
  // Also show loader if we're about to redirect an already-onboarded user
  if (((authLoading || !isClerkLoaded) && !forceShowContent) || (!authLoading && isClerkLoaded && user?.id && !needsRoleChoice)) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isAppShell ? 'bg-[#0a0a0f]' : 'bg-slate-50 dark:bg-slate-950'}`}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative flex items-center justify-center overflow-hidden p-6 ${isAppShell ? 'bg-[#0a0a0f]' : 'bg-slate-50 dark:bg-slate-950'}`}>

      {/* Animated Blobs Background — web only, app shell stays clean dark */}
      {!isAppShell && (
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-900/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-900/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[100px] animate-blob animation-delay-2000"></div>
      </div>
      )}

      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className={`backdrop-blur-2xl border rounded-4xl shadow-2xl p-10 md:p-14 mb-8 ${isAppShell ? 'bg-[#15131f] border-white/10' : 'bg-white/60 dark:bg-black/40 border-white/50 dark:border-white/10'}`}>

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-white text-4xl mb-8 shadow-lg shadow-blue-500/30">
            👋
          </div>

          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isAppShell ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            Welcome{clerkUser?.firstName ? `, ${clerkUser.firstName}` : ''}!
          </h1>

          <p className={`text-xl mb-10 leading-relaxed max-w-lg mx-auto ${isAppShell ? 'text-white/70' : 'text-gray-600 dark:text-gray-300'}`}>
            To give you the best experience, please tell us who will be using this account.
          </p>

          {roleError && (
            <div className={`mb-8 rounded-2xl px-5 py-4 text-sm text-left max-w-lg mx-auto ${isAppShell ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300' : 'bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'}`}>
              {roleError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleRoleSelect('parent')}
              disabled={isUpdating}
              className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-transparent transition-all group ${isAppShell ? 'bg-white/[0.04] hover:border-indigo-400/60 hover:bg-white/[0.07]' : 'bg-white/50 dark:bg-white/5 hover:border-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/20'}`}
            >
              <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">👨‍👩‍👧‍👦</span>
              <span className={`text-lg font-bold ${isAppShell ? 'text-white' : 'text-gray-900 dark:text-white'}`}>I am a Parent</span>
              <span className={`text-sm mt-2 ${isAppShell ? 'text-white/50' : 'text-gray-500 dark:text-gray-400'}`}>Manage tuition for my kids</span>
            </button>

            <button
              onClick={() => handleRoleSelect('student')}
              disabled={isUpdating}
              className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-transparent transition-all group ${isAppShell ? 'bg-white/[0.04] hover:border-indigo-400/60 hover:bg-white/[0.07]' : 'bg-white/50 dark:bg-white/5 hover:border-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/20'}`}
            >
              <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎓</span>
              <span className={`text-lg font-bold ${isAppShell ? 'text-white' : 'text-gray-900 dark:text-white'}`}>I am a Student</span>
              <span className={`text-sm mt-2 ${isAppShell ? 'text-white/50' : 'text-gray-500 dark:text-gray-400'}`}>Access my lessons & schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
