'use client';

import React from 'react';
import Link from 'next/link';
import { CARD_COLOR, accentRgb, type AccentKey } from './tokens';

type AppCardProps = {
  children: React.ReactNode;
  accent?: AccentKey | string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  /** Add hover lift + accent border highlight. Default true when interactive. */
  interactive?: boolean;
};

/**
 * Premium surface card for app-shell pages: `#15131f` fill, hairline accent
 * border, soft rounding. NO particles / spotlight / tilt — the "calmer
 * premium" treatment. Interactive cards (href/onClick) get a subtle hover lift
 * and brighter accent border.
 */
export function AppCard({
  children,
  accent = 'indigo',
  href,
  onClick,
  className = '',
  interactive,
}: AppCardProps) {
  const isInteractive = interactive ?? !!(href || onClick);

  const base =
    'group relative block rounded-2xl p-5 transition-all duration-200 outline-none';
  const hover = isInteractive
    ? 'hover:-translate-y-0.5 focus-visible:ring-2 cursor-pointer'
    : '';

  const style: React.CSSProperties = {
    background: CARD_COLOR,
    border: `1px solid ${accentRgb(accent, 0.18)}`,
    // @ts-expect-error custom prop consumed by focus-visible ring
    '--tw-ring-color': accentRgb(accent, 0.5),
  };

  const inner = <div className={`${base} ${hover} ${className}`} style={style}>{children}</div>;

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="block">
        {inner}
      </Link>
    );
  }
  if (onClick) {
    return (
      <div role="button" tabIndex={0} onClick={onClick}>
        {inner}
      </div>
    );
  }
  return inner;
}
