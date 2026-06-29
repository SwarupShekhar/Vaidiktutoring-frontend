'use client';

import React from 'react';
import { accentRgb, type AccentKey } from './tokens';

/**
 * Premium page header for app-shell inner pages: an accent icon tile, a
 * `font-black tracking-tight` title and an optional subtitle, with an optional
 * right-aligned slot for a search box or actions.
 */
export function AppPageHeader({
  icon: Icon,
  accent = 'indigo',
  eyebrow,
  title,
  subtitle,
  right,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent?: AccentKey | string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3.5 min-w-0">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
          style={{
            background: accentRgb(accent, 0.12),
            borderColor: accentRgb(accent, 0.3),
            color: accentRgb(accent),
          }}
        >
          <Icon size={22} className="shrink-0" />
        </span>
        <div className="min-w-0">
          {eyebrow && (
            <p
              className="mb-1 text-[10px] font-black uppercase tracking-[0.3em]"
              style={{ color: accentRgb(accent) }}
            >
              {eyebrow}
            </p>
          )}
          <h1 className="truncate text-3xl font-black tracking-tight text-white">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-white/50">{subtitle}</p>}
        </div>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </header>
  );
}
