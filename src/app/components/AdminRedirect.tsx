'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import { usePathname } from 'next/navigation';

/**
 * AdminRedirect: A client component that redirects admins to /admin/dashboard
 * if they try to access non-admin pages after login.
 * 
 * This should be included in the root layout to catch admin redirects early.
 */
export default function AdminRedirect() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Debug logging
    console.log('[AdminRedirect] State:', {
      userRole: user?.role,
      userId: user?.id,
      loading,
      pathname,
      isAdmin: user?.role === 'admin'
    });

    // Skip if still loading
    if (loading) {
      console.log('[AdminRedirect] Still loading, skipping redirect');
      return;
    }

    // If user is admin and not already on admin pages, redirect
    if (user?.role === 'admin') {
      if (!pathname?.startsWith('/admin')) {
        console.log(`[AdminRedirect] Admin user detected on ${pathname}, redirecting to /admin/dashboard`);
        // Use window.location for more aggressive redirect
        window.location.href = '/admin/dashboard';
      } else {
        console.log('[AdminRedirect] Admin already on admin page, no redirect needed');
      }
    } else if (user?.role) {
      console.log(`[AdminRedirect] User is ${user.role}, no redirect needed`);
    }
  }, [user?.role, user?.id, loading, pathname, router]);

  return null; // This component doesn't render anything, just handles redirects
}
