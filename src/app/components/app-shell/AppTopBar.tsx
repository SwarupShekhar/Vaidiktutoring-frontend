'use client';

import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { Crown, Clock } from 'lucide-react';
import type { CreditStatus } from '@/app/types/credits';
import { getPlanBadge, planDaysSuffix } from '@/app/lib/plan';

interface AppTopBarProps {
  user: any;
  // Kept for backwards-compatible call sites; the next-class + Join affordance now
  // lives in the dashboard's hero card, so the top bar is just a personal header.
  nextSession?: any;
  onJoin?: () => void;
  credit?: CreditStatus | null;
  /** Overrides the default "Here's your study snapshot." line (e.g. for parents). */
  subtitle?: string;
}

// Maps the shared plan tone → app-shell (dark) palette.
const TONE_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  paid: { bg: 'rgba(129,140,248,0.14)', border: 'rgba(129,140,248,0.35)', text: 'rgb(165,180,252)' },
  trial: { bg: 'rgba(16,185,129,0.14)', border: 'rgba(16,185,129,0.35)', text: 'rgb(52,211,153)' },
  warning: { bg: 'rgba(245,158,11,0.14)', border: 'rgba(245,158,11,0.35)', text: 'rgb(251,191,36)' },
  none: { bg: 'rgba(148,163,184,0.14)', border: 'rgba(148,163,184,0.3)', text: 'rgb(148,163,184)' },
};

function PlanBadge({ credit }: { credit?: CreditStatus | null }) {
  const info = getPlanBadge(credit);
  if (!info) return null;
  const s = TONE_STYLE[info.tone] ?? TONE_STYLE.none;
  const suffix = planDaysSuffix(info);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
    >
      <Crown size={13} />
      {info.label}
      {suffix && (
        <span className="inline-flex items-center gap-1 font-semibold opacity-80">
          <span aria-hidden>·</span>
          <Clock size={11} />
          {suffix}
        </span>
      )}
    </span>
  );
}

/** Prettify a raw name/handle: "swarup.shekhar" → "Swarup". */
function firstNameOf(user: any): string | null {
  const raw =
    user?.first_name ||
    user?.firstName ||
    user?.name?.split(' ')?.[0] ||
    user?.email?.split('@')?.[0] ||
    '';
  if (!raw) return null;
  const token = String(raw).split(/[._\s]/)[0];
  if (!token) return null;
  return token.charAt(0).toUpperCase() + token.slice(1);
}

/**
 * Clean, app-style page header for the desktop-shell dashboard: a personal
 * greeting, today's date, and the active subscription/trial plan badge.
 */
export const AppTopBar: React.FC<AppTopBarProps> = ({ user, credit, subtitle }) => {
  const firstName = firstNameOf(user);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const today = useMemo(() => format(new Date(), 'EEEE, d MMMM'), []);

  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-extrabold tracking-tight text-white">
          {greeting}{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="mt-0.5 text-sm text-white/45">{subtitle ?? "Here's your study snapshot."}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <PlanBadge credit={credit} />
        <p className="text-sm font-medium text-white/40">{today}</p>
      </div>
    </header>
  );
};
