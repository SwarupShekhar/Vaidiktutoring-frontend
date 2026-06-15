'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/app/lib/api';

/**
 * Soft-gate banner: shows on the student dashboard until onboarding is complete.
 * Self-contained — fetches its own status and renders nothing when done.
 */
export function SetupBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get('/auth/profile')
      .then((res) => {
        const status = res?.data?.onboarding_status;
        if (active && status && status !== 'complete') setShow(true);
      })
      .catch(() => { /* fail silent — don't block the dashboard */ });
    return () => {
      active = false;
    };
  }, []);

  if (!show) return null;

  return (
    <div className="mb-6 rounded-2xl border border-primary/30 bg-primary/5 dark:bg-primary/10 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div className="flex-1">
        <p className="font-bold text-gray-900 dark:text-white">Finish setting up your plan</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Tell us your exam board and target grade (30 seconds) so we can match the right tutor and unlock a focused plan.
        </p>
      </div>
      <Link
        href="/onboarding/student-profile"
        className="shrink-0 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity text-center"
      >
        Finish setup →
      </Link>
    </div>
  );
}
