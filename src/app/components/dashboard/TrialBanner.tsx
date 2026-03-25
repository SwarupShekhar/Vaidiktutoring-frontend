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

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-linear-to-r from-indigo-50 via-purple-50 to-indigo-50 p-5 shadow-sm"
    >
      {/* Background decoration */}
      <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-15px] left-[-15px] w-24 h-24 bg-purple-200/20 rounded-full blur-xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        {/* Left side — text */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
            <Sparkles className="text-indigo-600" size={20} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-indigo-900 tracking-tight">
              Free Trial — {status.creditsRemaining} credits remaining
            </h3>
            <p className="text-xs text-indigo-600/80 mt-0.5 flex items-center gap-1.5">
              <Clock size={12} />
              Expires in {status.daysLeft} day{status.daysLeft !== 1 ? "s" : ""}{" "}
              · {status.sessionsUsed} session
              {status.sessionsUsed !== 1 ? "s" : ""} used
            </p>
          </div>
        </div>

        {/* Right side — credit counter + progress bar */}
        <div className="flex items-center gap-3 sm:min-w-[180px]">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                Credits
              </span>
              <span className="text-xs font-extrabold text-indigo-900">
                {status.creditsRemaining}/10
              </span>
            </div>
            <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #818cf8, #6366f1, #4f46e5)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
