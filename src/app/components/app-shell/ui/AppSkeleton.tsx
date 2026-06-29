'use client';

import React from 'react';
import { CARD_COLOR } from './tokens';

/** A single shimmering skeleton block in the dark palette. */
export function AppSkeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-white/[0.06] ${className}`} />;
}

/** A skeleton card matching AppCard's surface — use to fill loading grids/lists. */
export function AppSkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{ background: CARD_COLOR, border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <AppSkeleton className="mb-4 h-10 w-10 rounded-xl" />
      <AppSkeleton className="mb-2 h-5 w-3/4" />
      <AppSkeleton className="h-4 w-1/2" />
    </div>
  );
}
