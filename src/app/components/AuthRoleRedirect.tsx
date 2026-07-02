'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import { usePathname } from 'next/navigation';

/**
 * AuthRoleRedirect: A client component that ensures authenticated users 
 * are on their appropriate dashboards.
 */
export default function AuthRoleRedirect() {
  const { user, loading } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Skip if still loading
    if (loading || !user?.role) return;

    const role = user.role;
    const marketingPaths = ['/', '/login', '/signup', '/home', '/dashboard'];
    const isMarketingPath = marketingPaths.includes(pathname);

    // 1. Force Admins to Admin Dashboard if they are elsewhere
    if (role === 'admin' && !pathname?.startsWith('/admin')) {
      router.replace('/admin/dashboard');
      return;
    }

    // 2. Force Students/Tutors/Parents to their dashboards if they are on marketing pages
    if (isMarketingPath) {
      if (role === 'tutor') router.replace('/tutor/dashboard');
      else if (role === 'student') router.replace('/students/dashboard');
      else if (role === 'parent') router.replace('/parent/dashboard');
      else if (role === 'admin') router.replace('/admin/dashboard');
    }
  }, [user?.role, user?.id, loading, pathname, router]);

  return null;
}
