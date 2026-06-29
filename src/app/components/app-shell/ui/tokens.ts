// Shared premium design tokens for the desktop app-shell.
//
// Single source of truth for the "calmer premium" look used across every
// app-shell inner page (Vault, Practice, Notes, Recordings, Profile,
// Assignments) AND the homescreen (AppDashboard). Inner pages render these
// ONLY inside the desktop shell (gated by `useIsAppShell`); the web experience
// is untouched.

/** Per-category accent as "r, g, b" — drives icon tint, hairline borders, washes. */
export const ACCENT = {
  indigo: '129, 140, 248',
  amber: '245, 158, 11',
  cyan: '34, 211, 238',
  violet: '167, 139, 250',
  emerald: '16, 185, 129',
  teal: '45, 212, 191',
  magenta: '217, 130, 255',
  rose: '244, 63, 94',
  purple: '168, 85, 247',
  green: '34, 197, 94',
  sky: '56, 189, 248',
} as const;

export type AccentKey = keyof typeof ACCENT;

/** Card surface — sits on top of the darker shell canvas. */
export const CARD_COLOR = '#15131f';
/** The app-shell scroll canvas (matches AppShell). */
export const SHELL_BG = '#0a0a0f';

/** Resolve an accent key (or a raw "r, g, b" string) to a CSS rgb() value. */
export function accentRgb(accent: AccentKey | string, alpha?: number): string {
  const rgb = (ACCENT as Record<string, string>)[accent] ?? accent;
  return alpha == null ? `rgb(${rgb})` : `rgba(${rgb}, ${alpha})`;
}

// ---- framer-motion variants ----
// Stagger the children of an AppPage on mount: a calm fade + rise. No bento
// particles/spotlight/tilt — those stay exclusive to the homescreen.

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 140, damping: 18 },
  },
};
