'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import { useUser } from '@clerk/nextjs';
import Loader from '@/app/components/Loader';

export default function OnboardingPage() {
  const { user } = useAuthContext();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Redirect if role is already known and valid (Admin protection)
  useEffect(() => {
    if (user?.role === 'admin') {
      // Admins shouldn't be here, send them to admin dashboard (or home for now if admin dash doesn't exist)
      // Assuming /admin/dashboard exists, or fallback to /
      router.push('/admin/dashboard');
    } else if (user?.role === 'parent') {
      // If already a parent in our DB, go to dashboard
      router.push('/parent/dashboard');
    } else if (user?.role === 'student' && user?.id) {
      // If student and NOT a fresh signup (id exists), go to dashboard.
      // But fresh signups are default student, so we might still want to show choice?
      // Let's rely on if they have metadata.
      if (clerkUser?.publicMetadata?.role) {
        router.push('/students/dashboard');
      }
    }
  }, [user, clerkUser, router]);

  // Simple Logic: If they are here, we let them confirm their role if they want to be a parent?
  // Or we just present the choice.

  const handleRoleSelect = async (selectedRole: 'parent' | 'student') => {
    setIsUpdating(true);
    try {
      // Update Clerk Metadata (if we want to use that for immediate feedback)
      if (clerkUser) {
        await clerkUser.update({
          unsafeMetadata: { role: selectedRole }
        });
      }

      // Note: Backend syncs on every request, but we might need to tell backend to update role explicitly
      // or rely on next page load to sync.
      // Ideally call a backend endpoint to update role. 
      // For now, relies on Clerk metadata or we can redirect to a specific proper dashboard.

      if (selectedRole === 'parent') {
        // Redirect to add-student or parent dashboard
        // forcing reload to ensure context updates if it relies on clerk metadata
        window.location.href = '/onboarding/add-student';
      } else {
        window.location.href = '/students/dashboard';
      }
    } catch (e) {
      console.error("Failed to update role", e);
      setIsUpdating(false);
    }
  };

  // If we are loading, show loader
  if (!user && !clerkUser) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader />
    </div>
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 p-6">

      {/* Animated Blobs Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-900/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-900/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* ... existing content ... */}


        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[2.5rem] shadow-2xl p-10 md:p-14 mb-8">

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-primary)] text-white text-4xl mb-8 shadow-lg shadow-blue-500/30">
            👋
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome{clerkUser?.firstName ? `, ${clerkUser.firstName}` : ''}!
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-lg mx-auto">
            To give you the best experience, please tell us who will be using this account.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleRoleSelect('parent')}
              disabled={isUpdating}
              className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/50 dark:bg-white/5 border-2 border-transparent hover:border-[var(--color-primary)] hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group"
            >
              <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">👨‍👩‍👧‍👦</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">I am a Parent</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">Manage tuition for my kids</span>
            </button>

            <button
              onClick={() => handleRoleSelect('student')}
              disabled={isUpdating}
              className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/50 dark:bg-white/5 border-2 border-transparent hover:border-[var(--color-primary)] hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group"
            >
              <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎓</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">I am a Student</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">Access my lessons & schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
