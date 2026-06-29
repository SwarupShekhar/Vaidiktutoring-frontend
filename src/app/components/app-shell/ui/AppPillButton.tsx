'use client';

import React from 'react';
import { accentRgb, type AccentKey } from './tokens';

type Variant = 'solid' | 'soft' | 'ghost';

/**
 * Premium pill button for app-shell pages.
 * - solid: filled accent background, white text (primary CTA)
 * - soft:  translucent accent tint + accent text (secondary)
 * - ghost: transparent, subtle white border (tertiary)
 */
export function AppPillButton({
  children,
  accent = 'indigo',
  variant = 'solid',
  disabled,
  onClick,
  type = 'button',
  className = '',
}: {
  children: React.ReactNode;
  accent?: AccentKey | string;
  variant?: Variant;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  type?: 'button' | 'submit';
  className?: string;
}) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all outline-none focus-visible:ring-2 active:scale-95 disabled:cursor-not-allowed disabled:active:scale-100';

  let style: React.CSSProperties = {
    // @ts-expect-error custom prop consumed by focus-visible ring
    '--tw-ring-color': accentRgb(accent, 0.5),
  };
  let variantClass = '';

  if (disabled) {
    variantClass = 'bg-white/5 text-white/35 ring-1 ring-white/10';
    style = {};
  } else if (variant === 'solid') {
    variantClass = 'text-white';
    style.background = accentRgb(accent);
  } else if (variant === 'soft') {
    variantClass = '';
    style.background = accentRgb(accent, 0.14);
    style.color = accentRgb(accent);
    style.border = `1px solid ${accentRgb(accent, 0.3)}`;
  } else {
    variantClass = 'border border-white/10 text-white/80 hover:bg-white/5';
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variantClass} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}
