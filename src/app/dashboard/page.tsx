'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';

// Role → dashboard path (kept in sync with AuthContext.login + middleware).
const DASHBOARD_BY_ROLE: Record<string, string> = {
  admin: '/admin/dashboard',
  tutor: '/tutor/dashboard',
  student: '/students/dashboard',
  parent: '/parent/dashboard',
};

/**
 * `/dashboard` is a generic entrypoint, not a real page. Clerk's post-login
 * `forceRedirectUrl`, the manual "Direct Access" login, and internal links all
 * point here. Without a route the client router painted a transient 404 before
 * bouncing — a flash in the desktop app on launch.
 *
 * This is a thin client-side redirector: it reads the resolved role from
 * AuthContext (authoritative for both Clerk and manual auth) and replaces to the
 * correct dashboard. It renders nothing — never a 404, never a crash. We avoid a
 * server component with `auth()` here because that requires clerkMiddleware to be
 * active for this request, which is not guaranteed at this entrypoint.
 */
export default function DashboardRedirect() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const role = user?.role;
    router.replace(role ? (DASHBOARD_BY_ROLE[role] || '/students/dashboard') : '/login');
  }, [user, loading, router]);

  return null;
}
