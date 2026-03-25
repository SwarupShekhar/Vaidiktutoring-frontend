export type CreditMode =
  | 'trial_active'
  | 'trial_exhausted'
  | 'trial_expired'
  | 'paid'
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
      { label: '30-min sprints', included: true },
      { label: 'Tutor OS Access', included: true },
      { label: 'AI Transcript + Summary', included: true },
      { label: 'Confidence Tracking', included: true },
      { label: 'Monthly Recurring, No Lock-in', included: true },
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
    recommended: true,
    features: [
      { label: '30-min sprints', included: true },
      { label: 'Tutor OS Access', included: true },
      { label: 'AI Transcript + Summary', included: true },
      { label: 'Confidence Tracking', included: true },
      { label: 'Monthly Recurring, No Lock-in', included: true },
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
    features: [
      { label: '30-min sprints', included: true },
      { label: 'Tutor OS Access', included: true },
      { label: 'AI Transcript + Summary', included: true },
      { label: 'Confidence Tracking', included: true },
      { label: 'Monthly Recurring, No Lock-in', included: true },
      { label: 'Priority Support', included: true },
      { label: 'Advanced Analytics', included: true },
    ],
  },
];
