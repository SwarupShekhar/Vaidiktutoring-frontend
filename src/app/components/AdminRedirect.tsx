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
    // Skip if still loading
    if (loading) return;

    // If user is admin and not already on admin pages, redirect
    if (user?.role === 'admin' && !pathname?.startsWith('/admin')) {
      // Admin trying to access non-admin page, redirect to dashboard
      console.log(`[AdminRedirect] Admin user detected on ${pathname}, redirecting to /admin/dashboard`);
      router.push('/admin/dashboard');
    }
  }, [user, loading, pathname, router]);

  return null; // This component doesn't render anything, just handles redirects
}
