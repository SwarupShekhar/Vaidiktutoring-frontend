export type CreditMode =
  | 'trial_active'
  | 'trial_exhausted'
  | 'trial_expired'
  | 'paid'
  | 'learning'
  | 'no_access';

export type SubscriptionPlan = 'foundation' | 'mastery' | 'elite' | null;

export interface CreditStatus {
  mode: CreditMode;
  creditsRemaining: number;
  trialExpiresAt: string | null;
  daysLeft: number | null;
  sessionsUsed: number;
  canBook: boolean;
  plan: SubscriptionPlan;
  /** ISO date the current plan/trial ends — drives the homescreen plan badge. */
  planEndsAt?: string | null;
}

export interface PlanInfo {
  name: string;
  key: 'foundation' | 'mastery' | 'elite';
  price: number;
  sessionsPerMonth: number;
  sessionsPerWeek: number;
  features: { label: string; included: boolean }[];
  recommended?: boolean;
}

export const PLANS: PlanInfo[] = [
  {
    name: 'Foundation',
    key: 'foundation',
    price: 199,
    sessionsPerMonth: 8,
    sessionsPerWeek: 2,
    features: [
      { label: '6 Hours (360 mins) / month', included: true },
      { label: 'Flexible 45 or 60 min sessions', included: true },
      { label: 'Tutor OS Access', included: true },
      { label: 'AI Transcript + Summary', included: true },
      { label: 'Confidence Tracking', included: true },
      { label: 'Priority Support', included: false },
      { label: 'Advanced Analytics', included: false },
    ],
  },
  {
    name: 'Mastery',
    key: 'mastery',
    price: 349,
    sessionsPerMonth: 16,
    sessionsPerWeek: 4,
    recommended: false,
    features: [
      { label: '12 Hours (720 mins) / month', included: true },
      { label: 'Flexible 45 or 60 min sessions', included: true },
      { label: 'Tutor OS Access', included: true },
      { label: 'AI Transcript + Summary', included: true },
      { label: 'Confidence Tracking', included: true },
      { label: 'Priority Support', included: true },
      { label: 'Advanced Analytics', included: false },
    ],
  },
  {
    name: 'Elite',
    key: 'elite',
    price: 499,
    sessionsPerMonth: 24,
    sessionsPerWeek: 6,
    recommended: true,
    features: [
      { label: '18 Hours (1080 mins) / month', included: true },
      { label: 'Flexible 45 or 60 min sessions', included: true },
      { label: 'Tutor OS Access', included: true },
      { label: 'AI Transcript + Summary', included: true },
      { label: 'Confidence Tracking', included: true },
      { label: 'Priority Support', included: true },
      { label: 'Advanced Analytics', included: true },
    ],
  },
];
