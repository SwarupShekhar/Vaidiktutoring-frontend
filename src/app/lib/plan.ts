import type { CreditStatus } from '@/app/types/credits';
import { PLANS } from '@/app/types/credits';

export interface PlanBadgeInfo {
  /** Short label, e.g. "Mastery Plan", "Free Trial", "Trial ended". */
  label: string;
  /** Days until the plan/trial ends (null when not applicable / unknown). */
  daysLeft: number | null;
  /** True when the plan/trial has lapsed. */
  expired: boolean;
  /** Visual tone bucket for callers to map to their own palette. */
  tone: 'paid' | 'trial' | 'warning' | 'none';
}

/**
 * Derive a single homescreen "plan badge" from the live credit status.
 * Shared by the desktop app shell and the web dashboard so the wording/logic
 * stays identical across surfaces; each surface styles by `tone`.
 */
export function getPlanBadge(credit: CreditStatus | null | undefined): PlanBadgeInfo | null {
  if (!credit) return null;
  const { mode, plan, daysLeft } = credit;

  if (mode === 'paid' || mode === 'learning') {
    const name = PLANS.find((p) => p.key === plan)?.name ?? 'Active';
    return { label: `${name} Plan`, daysLeft: daysLeft ?? null, expired: false, tone: 'paid' };
  }
  if (mode === 'trial_active') {
    return { label: 'Free Trial', daysLeft: daysLeft ?? null, expired: false, tone: 'trial' };
  }
  if (mode === 'trial_exhausted') {
    return { label: 'Trial — upgrade', daysLeft: daysLeft ?? null, expired: false, tone: 'warning' };
  }
  if (mode === 'trial_expired') {
    return { label: 'Trial ended', daysLeft: 0, expired: true, tone: 'warning' };
  }
  return { label: 'No active plan', daysLeft: null, expired: true, tone: 'none' };
}

/** "· 12 days left" / "· ends today" / "" — a compact suffix for the badge. */
export function planDaysSuffix(info: PlanBadgeInfo): string {
  if (info.expired) return '';
  if (info.daysLeft == null) return '';
  if (info.daysLeft === 0) return 'ends today';
  return `${info.daysLeft} day${info.daysLeft === 1 ? '' : 's'} left`;
}
