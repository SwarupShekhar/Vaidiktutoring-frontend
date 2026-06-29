'use client';

import React from 'react';
import { Crown, Clock } from 'lucide-react';
import type { CreditStatus } from '@/app/types/credits';
import { getPlanBadge, planDaysSuffix } from '@/app/lib/plan';

// Shared plan tone → web (theme-aware) palette.
const TONE: Record<string, string> = {
  paid: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30',
  trial: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
  warning: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
  none: 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10',
};

/** Subscription/trial plan badge for the web student dashboard. */
export function PlanBadgeWeb({ credit }: { credit?: CreditStatus | null }) {
  const info = getPlanBadge(credit);
  if (!info) return null;
  const suffix = planDaysSuffix(info);
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${TONE[info.tone] ?? TONE.none}`}
    >
      <Crown size={15} />
      {info.label}
      {suffix && (
        <span className="inline-flex items-center gap-1 font-semibold opacity-80">
          <span aria-hidden>·</span>
          <Clock size={12} />
          {suffix}
        </span>
      )}
    </span>
  );
}
