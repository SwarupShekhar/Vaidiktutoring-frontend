'use client';

import React from 'react';

export const DashboardLoadingSkeleton = () => {
  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="w-32 h-4 bg-muted rounded-full" />
          <div className="w-64 h-8 bg-muted rounded-xl" />
          <div className="w-48 h-4 bg-muted rounded-full" />
        </div>
        <div className="flex gap-3">
          <div className="w-32 h-10 bg-muted rounded-2xl" />
          <div className="w-40 h-10 bg-muted rounded-2xl" />
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="w-full h-48 bg-muted rounded-3xl" />

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="h-32 bg-muted rounded-3xl" />
        <div className="h-32 bg-muted rounded-3xl" />
        <div className="h-32 bg-muted rounded-3xl" />
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="h-64 bg-muted rounded-3xl" />
          <div className="h-64 bg-muted rounded-3xl" />
        </div>
        <div className="space-y-6">
          <div className="h-96 bg-muted rounded-3xl" />
        </div>
      </div>
    </div>
  );
};
