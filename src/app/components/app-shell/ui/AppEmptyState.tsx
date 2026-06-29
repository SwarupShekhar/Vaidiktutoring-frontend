'use client';

import React from 'react';
import { CARD_COLOR, accentRgb, type AccentKey } from './tokens';

/**
 * Premium empty / error state for app-shell pages: a dashed accent-tinted panel
 * with an icon, headline and supporting copy, plus an optional action slot.
 */
export function AppEmptyState({
  icon: Icon,
  accent = 'indigo',
  title,
  description,
  action,
  tone = 'empty',
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent?: AccentKey | string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  /** 'error' uses a rose accent + solid border for failure states. */
  tone?: 'empty' | 'error';
}) {
  const resolved = tone === 'error' ? 'rose' : accent;
  return (
    <div
      className="flex flex-col items-center justify-center rounded-3xl px-6 py-20 text-center"
      style={{
        background: tone === 'error' ? accentRgb('rose', 0.06) : CARD_COLOR,
        border:
          tone === 'error'
            ? `1px solid ${accentRgb('rose', 0.3)}`
            : `1px dashed ${accentRgb(resolved, 0.25)}`,
      }}
    >
      <span
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: accentRgb(resolved, 0.12), color: accentRgb(resolved) }}
      >
        <Icon size={30} />
      </span>
      <p className="text-lg font-bold text-white">{title}</p>
      {description && (
        <p className="mt-2 max-w-md text-sm text-white/50">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
