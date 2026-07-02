// src/app/unauthorized/page.tsx
'use client';
import Link from 'next/link';
import { useIsAppShell } from '@/app/Hooks/useIsAppShell';
import { useAuthContext } from '@/app/context/AuthContext';

export default function UnauthorizedPage() {
  const isAppShell = useIsAppShell();
  const { user } = useAuthContext();

  // Send "Go Home" to the signed-in user's own dashboard (not the marketing
  // homepage, which flashes then bounces). Falls back to '/' when logged out.
  const roleHome =
    user?.role === 'parent'
      ? '/parent/dashboard'
      : user?.role === 'tutor'
        ? '/tutor/dashboard'
        : user?.role === 'admin'
          ? '/admin/dashboard'
          : '/students/dashboard';
  const home = user ? roleHome : '/';

  if (isAppShell) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center px-6">
          <h1 className="text-4xl font-black text-white mb-3">403</h1>
          <h2 className="text-xl font-bold text-white/80 mb-2">Unauthorized</h2>
          <p className="text-white/45 mb-6">You don&apos;t have permission to access this page.</p>
          <Link
            href={home}
            className="inline-flex items-center rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Go to my dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Unauthorized</h2>
        <p className="text-slate-600 mb-6">You don&apos;t have permission to access this page.</p>
        <Link href={home} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Go Home
        </Link>
      </div>
    </div>
  );
}
