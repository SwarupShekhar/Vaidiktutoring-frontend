'use client';

import React from 'react';

const Shimmer = ({ className }: { className?: string }) => (
  <div
    className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />
  </div>
);

export const DashboardLoadingSkeleton = () => {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
      <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <Shimmer className="w-28 h-3" />
            <Shimmer className="w-72 h-8" />
            <Shimmer className="w-52 h-3" />
          </div>
          <div className="flex gap-3">
            <Shimmer className="w-32 h-10 !rounded-2xl" />
            <Shimmer className="w-40 h-10 !rounded-2xl" />
          </div>
        </div>

        {/* Hero Card */}
        <Shimmer className="w-full h-48 !rounded-3xl" />

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Shimmer key={i} className="h-28 !rounded-2xl" />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <Shimmer className="h-56 !rounded-2xl" />
            <Shimmer className="h-56 !rounded-2xl" />
          </div>
          {/* Right sidebar — 1/3 */}
          <div className="space-y-4">
            <Shimmer className="h-48 !rounded-2xl" />
            <Shimmer className="h-48 !rounded-2xl" />
          </div>
        </div>
      </div>
    </>
  );
};

