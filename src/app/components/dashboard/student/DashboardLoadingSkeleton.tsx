'use client';

import React from 'react';
import { AppDashboardSkeleton } from '../../app-shell/AppDashboardSkeleton';

export const DashboardLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8 space-y-8">
        <div className="rounded-xl overflow-hidden ring-1 ring-border/5 bg-slate-50/50 dark:bg-[#0a0a0f]/50">
          <AppDashboardSkeleton themeAware={true} />
        </div>
      </div>
    </div>
  );
};
