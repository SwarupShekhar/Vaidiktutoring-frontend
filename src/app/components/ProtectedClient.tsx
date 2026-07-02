'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/app/Hooks/useAuth';
import { DashboardLoadingSkeleton } from '@/app/components/dashboard/student/DashboardLoadingSkeleton';

type Props = {
  children: ReactNode;
  roles?: string[]; // allowed roles, e.g. ['parent','student']
};

/**
 * Protected client wrapper for pages that require auth.
 * - Auth still loading  -> loading skeleton.
 * - Not logged in       -> redirect to /login.
 * - Wrong role          -> refresh the profile ONCE, then redirect to /unauthorized
 *                          only if it's still wrong.
 *
 * The one-shot refresh matters: right after navigation or an account switch the
 * cached role can be briefly stale (backendUser hasn't re-synced yet), which used
 * to fire spurious 403s. Re-fetching getMe once resolves the real role before we
 * decide. It still fails closed — a genuinely wrong role redirects after the refresh.
 */
export default function ProtectedClient({ children, roles = [] }: Props) {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const rolesKey = roles.join(',');

  const refreshedRef = useRef(false);
  const [refreshing, setRefreshing] = useState(false);

  const mismatch =
    !!user && roles.length > 0 && (!user.role || !roles.includes(user.role));

  useEffect(() => {
    if (loading || refreshing) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (mismatch) {
      if (!refreshedRef.current) {
        // Grace: pull the authoritative profile once before deciding.
        refreshedRef.current = true;
        setRefreshing(true);
        Promise.resolve(refreshUser?.()).finally(() => setRefreshing(false));
        return;
      }
      router.push('/unauthorized');
    }
    // rolesKey keeps the dep stable when `roles` is passed as an inline array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, refreshing, user, mismatch, rolesKey, router]);

  if (loading || refreshing) {
    return <DashboardLoadingSkeleton />;
  }

  if (!user) return null;

  // Mismatch but the grace refresh hasn't run/finished -> keep showing loading,
  // never the protected children and never a premature redirect.
  if (mismatch && !refreshedRef.current) {
    return <DashboardLoadingSkeleton />;
  }

  if (mismatch) return null; // refresh done, still wrong -> redirect fires in effect

  return <>{children}</>;
}
