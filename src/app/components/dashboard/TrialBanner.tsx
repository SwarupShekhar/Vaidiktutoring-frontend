"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Clock } from "lucide-react";
import type { CreditStatus } from "@/app/types/credits";

interface TrialBannerProps {
  status: CreditStatus;
}

export function TrialBanner({ status }: TrialBannerProps) {
  const progressPercent = (status.creditsRemaining / 10) * 100;
  const daysLeft = status.daysLeft ?? 7;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative overflow-hidden rounded-3xl border border-indigo-200/50 dark:border-white/5 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl p-6 shadow-sm transition-all duration-500 hover:shadow-xl"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none -z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="80" cy="20" r="30" fill="indigo" style={{ filter: "blur(40px)" }} />
          <circle cx="20" cy="80" r="20" fill="purple" style={{ filter: "blur(40px)" }} />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        {/* Profile/Indicator Section */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-3 transition-transform">
            <Sparkles className="text-white" size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Trial Journey
              <span className="ml-2 text-indigo-500 dark:text-indigo-400">
                · {status.creditsRemaining} credits left
              </span>
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200/40 dark:border-white/5">
                <Clock className="text-slate-400" size={12} />
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                  Expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200/40 dark:border-white/5">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                   {status.sessionsUsed} session{status.sessionsUsed !== 1 ? "s" : ""} used
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress & Stats Section */}
        <div className="flex-1 max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Trial Progress
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {status.creditsRemaining} / 10
            </span>
          </div>
          <div className="relative h-3 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #6366f1, #a855f7)",
                boxShadow: "0 0 10px rgba(99, 102, 241, 0.5)"
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Decorative Badge */}
      <div className="absolute -top-1 right-12">
          <div className="px-3 py-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-b-xl border border-t-0 border-slate-200/50 dark:border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-tighter">
             Trial Mode Active
          </div>
      </div>
    </motion.div>
  );
}
