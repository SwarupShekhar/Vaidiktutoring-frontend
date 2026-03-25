"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  Check,
  X,
  Star,
  Zap,
  BookOpen,
  BarChart3,
  Headphones,
  Crown,
  Loader2,
} from "lucide-react";
import { api } from "@/app/lib/api";
import type { CreditStatus, PlanInfo } from "@/app/types/credits";
import { PLANS } from "@/app/types/credits";

interface UpgradeNudgeProps {
  status: CreditStatus;
  pastSessions: any[];
  onSubscribed: () => void;
}

export function UpgradeNudge({
  status,
  pastSessions,
  onSubscribed,
}: UpgradeNudgeProps) {
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [successPlan, setSuccessPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (planKey: string) => {
    setSubscribing(planKey);
    setError(null);

    try {
      await api.post("/credits/subscribe", { plan: planKey });
      setSuccessPlan(planKey);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to subscribe. Please try again.",
      );
      setSubscribing(null);
    }
  };

  React.useEffect(() => {
    if (successPlan) {
      const timerId = setTimeout(() => {
        onSubscribed();
        setSubscribing(null);
      }, 1500);
      return () => clearTimeout(timerId);
    }
  }, [successPlan, onSubscribed]);

  const getFeatureIcon = (label: string) => {
    if (label.includes("sprint")) return <Clock size={14} />;
    if (label.includes("Tutor OS")) return <BookOpen size={14} />;
    if (label.includes("AI Transcript")) return <Zap size={14} />;
    if (label.includes("Confidence")) return <BarChart3 size={14} />;
    if (label.includes("Lock-in")) return <Star size={14} />;
    if (label.includes("Priority")) return <Headphones size={14} />;
    if (label.includes("Analytics")) return <Crown size={14} />;
    return <Check size={14} />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  // Get trial sessions for the history list
  const trialSessions = pastSessions.slice(0, 3);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Top Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl border border-orange-200 dark:border-orange-500/20 bg-linear-to-r from-orange-50/50 via-amber-50/50 to-orange-50/50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-orange-900/20 p-6 shadow-sm"
      >
        <div className="absolute top-[-30px] right-[-30px] w-40 h-40 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="text-orange-600" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-orange-900 dark:text-orange-400 tracking-tight">
              {status.mode === "trial_exhausted"
                ? "Your trial credits are used up"
                : "Your trial has expired"}
            </h2>
            <p className="text-sm text-orange-700/80 dark:text-orange-300/60 mt-1">
              You completed {status.sessionsUsed} session
              {status.sessionsUsed !== 1 ? "s" : ""} — subscribe to keep going
            </p>
          </div>
        </div>
      </motion.div>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/20 rounded-xl p-4 flex items-center gap-3 text-red-800 dark:text-red-300"
          >
            <X size={16} />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {successPlan && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/20 rounded-xl p-4 flex items-center gap-3 text-green-800 dark:text-green-300"
          >
            <Check size={18} className="text-green-600" />
            <p className="text-sm font-bold">
              Successfully subscribed to the{" "}
              {successPlan.charAt(0).toUpperCase() + successPlan.slice(1)} plan!
              Redirecting...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Cards Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.key}
            plan={plan}
            subscribing={subscribing}
            onSubscribe={handleSubscribe}
            getFeatureIcon={getFeatureIcon}
          />
        ))}
      </motion.div>

      {/* Trial Session History */}
      {trialSessions.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-glass rounded-2xl p-6 border border-border shadow-sm font-sans"
        >
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">
            Your Trial Sessions
          </h3>
          <div className="space-y-3">
            {trialSessions.map((session: any) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    📚
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {session.subject?.name ||
                        session.subjects?.name ||
                        "Session"}
                    </p>
                    <p className="text-[10px] text-text-secondary">
                      {session.start_time || session.requested_start
                        ? new Date(
                            session.start_time || session.requested_start,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "Date TBD"}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    session.is_free_session || session.credit_cost === 0
                      ? "bg-green-100 text-green-700"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {session.is_free_session || session.credit_cost === 0
                    ? "Free"
                    : typeof session.credit_cost === "number"
                      ? `${session.credit_cost} credits`
                      : "Credits used"}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Pricing Card Sub-Component ──────────────────────────────────────

interface PricingCardProps {
  plan: PlanInfo;
  subscribing: string | null;
  onSubscribe: (key: string) => void;
  getFeatureIcon: (label: string) => React.ReactNode;
}

function PricingCard({
  plan,
  subscribing,
  onSubscribe,
  getFeatureIcon,
}: PricingCardProps) {
  const isLoading = subscribing === plan.key;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative rounded-2xl p-6 flex flex-col bg-surface shadow-sm transition-all ${
        plan.recommended
          ? "border-2 border-primary shadow-primary/20 shadow-lg"
          : "border border-border"
      }`}
    >
      {/* Recommended badge */}
      {plan.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-md">
            ★ Recommended
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className={`mb-5 ${plan.recommended ? "mt-2" : ""}`}>
        <h3 className="text-lg font-extrabold text-foreground">{plan.name}</h3>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl font-black text-foreground">
            ${plan.price}
          </span>
          <span className="text-sm text-text-secondary font-medium">/mo</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
            {plan.sessionsPerMonth} sessions/mo
          </span>
          <span className="text-xs text-text-secondary">
            {plan.sessionsPerWeek}/week
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="flex-1 space-y-2.5 mb-6">
        {plan.features.map((feature) => (
          <div key={feature.label} className="flex items-center gap-2.5">
            <div
              className={`shrink-0 ${feature.included ? "text-indigo-500" : "text-gray-300"}`}
            >
              {feature.included ? (
                getFeatureIcon(feature.label)
              ) : (
                <X size={14} />
              )}
            </div>
            <span
              className={`text-xs ${feature.included ? "text-foreground" : "text-text-secondary line-through"}`}
            >
              {feature.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onSubscribe(plan.key)}
        disabled={isLoading || subscribing !== null}
        className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
          plan.recommended
            ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200/50"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        } ${isLoading || subscribing !== null ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"}`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Subscribing...
          </span>
        ) : (
          `Choose ${plan.name}`
        )}
      </button>
    </motion.div>
  );
}
