'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import { usePathname } from 'next/navigation';

/**
 * AuthRoleRedirect: A client component that ensures authenticated users
 * are on their appropriate dashboards.
 *
 * Uses a ref guard (`hasRedirected`) so the redirect fires at most once per
 * mount. Without it, every router.replace() triggers a pathname update which
 * re-fires the effect, causing an infinite commitPassiveMountOnFiber loop in
 * React 19 concurrent mode.
 */
export default function AuthRoleRedirect() {
  const { user, loading } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Skip if still loading or already redirected this mount
    if (loading || !user?.role || hasRedirected.current) return;

    const role = user.role;
    const marketingPaths = ['/', '/login', '/signup', '/home', '/dashboard'];
    const isMarketingPath = marketingPaths.includes(pathname);

    // 1. Force Admins to Admin Dashboard if they are on any non-admin page
    if (role === 'admin' && !pathname?.startsWith('/admin')) {
      hasRedirected.current = true;
      router.replace('/admin/dashboard');
      return;
    }

    // 2. Force Students/Tutors/Parents to their dashboards if on a marketing page
    if (isMarketingPath) {
      if (role === 'tutor') { hasRedirected.current = true; router.replace('/tutor/dashboard'); }
      else if (role === 'student') { hasRedirected.current = true; router.replace('/students/dashboard'); }
      else if (role === 'parent') { hasRedirected.current = true; router.replace('/parent/dashboard'); }
      else if (role === 'admin') { hasRedirected.current = true; router.replace('/admin/dashboard'); }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role, user?.id, loading]);
  // NOTE: intentionally omit `pathname` and `router` from deps — we only want
  // to check the redirect once when the user object is first resolved, not on
  // every navigation.

  return null;
}
