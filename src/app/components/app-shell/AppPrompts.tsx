'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Settings2, X } from 'lucide-react';
import { api } from '@/app/lib/api';

interface AppPromptsProps {
  user: any;
}

/**
 * App-shell replacement for the full-width SetupBanner + phone-verify banner.
 *
 * Renders setup/verify prompts as small, dismissible chips at the top of the
 * content area instead of stacked marketing banners. Show/hide conditions and
 * destinations are kept equivalent to the web versions:
 *   - Phone verification: shows when user.phone_verified !== true → /verify-phone
 *   - Plan setup: shows when /auth/profile onboarding_status !== 'complete'
 *     → /onboarding/student-profile  (mirrors SetupBanner.tsx)
 *
 * Navigation uses next/link (no full reload). Dismissals are local to the session.
 */
export const AppPrompts: React.FC<AppPromptsProps> = ({ user }) => {
  const [showSetup, setShowSetup] = useState(false);
  const [setupDismissed, setSetupDismissed] = useState(false);
  const [phoneDismissed, setPhoneDismissed] = useState(false);

  // Mirror SetupBanner: fetch own onboarding status, fail silent.
  useEffect(() => {
    let active = true;
    api
      .get('/auth/profile')
      .then((res) => {
        const status = res?.data?.onboarding_status;
        if (active && status && status !== 'complete') setShowSetup(true);
      })
      .catch(() => {
        /* fail silent — don't block the dashboard */
      });
    return () => {
      active = false;
    };
  }, []);

  const showPhone = user && user.phone_verified !== true && !phoneDismissed;
  const showSetupChip = showSetup && !setupDismissed;

  if (!showPhone && !showSetupChip) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AnimatePresence initial={false}>
        {showSetupChip && (
          <motion.div
            key="setup"
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 py-1 pl-3 pr-1 text-xs"
          >
            <Settings2 size={13} className="shrink-0 text-indigo-500" />
            <Link
              href="/onboarding/student-profile"
              className="font-semibold text-slate-100 hover:underline"
            >
              Finish setting up your plan →
            </Link>
            <button
              type="button"
              aria-label="Dismiss setup prompt"
              onClick={() => setSetupDismissed(true)}
              className="rounded-full p-1 text-slate-400 transition-colors hover:bg-black/5 hover:text-slate-100 dark:hover:bg-white/10"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}

        {showPhone && (
          <motion.div
            key="phone"
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-2 rounded-full border border-amber-300/50 bg-amber-500/10 py-1 pl-3 pr-1 text-xs dark:border-amber-700/40"
          >
            <Phone size={13} className="shrink-0 text-amber-600 dark:text-amber-400" />
            <Link
              href="/verify-phone"
              className="font-semibold text-amber-800 hover:underline dark:text-amber-300"
            >
              Verify your phone number →
            </Link>
            <button
              type="button"
              aria-label="Dismiss phone verification prompt"
              onClick={() => setPhoneDismissed(true)}
              className="rounded-full p-1 text-amber-500/70 transition-colors hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
