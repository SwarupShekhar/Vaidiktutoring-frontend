"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PHASES = [
  {
    period: "Jan – Apr",
    label: "Foundation Building",
    intensity: 2,
    tip: "Master concepts before touching past papers. This is where most students make their biggest mistake.",
    color: "oklch(0.55 0.14 145)",
    bg: "oklch(0.96 0.04 145)",
    border: "oklch(0.85 0.1 145)",
  },
  {
    period: "May – Jun",
    label: "Block Tests",
    intensity: 3,
    tip: "First real feedback on whether your study method works. Don't dismiss bad results; diagnose them.",
    color: "oklch(0.55 0.15 70)",
    bg: "oklch(0.97 0.04 70)",
    border: "oklch(0.87 0.1 70)",
  },
  {
    period: "Jul – Aug",
    label: "Intensive Revision",
    intensity: 4,
    tip: "Timed past paper practice under exam conditions. If you can't do it in time, you can't do it.",
    color: "oklch(0.55 0.18 30)",
    bg: "oklch(0.97 0.04 30)",
    border: "oklch(0.87 0.1 30)",
  },
  {
    period: "Sep",
    label: "Prelims",
    intensity: 5,
    tip: "Treat Prelims like the real thing. Schools deliberately mark harder: a B here is an A at A-Levels.",
    color: "oklch(0.5 0.2 25)",
    bg: "oklch(0.97 0.05 25)",
    border: "oklch(0.85 0.12 25)",
  },
  {
    period: "Oct – Nov",
    label: "A-Levels",
    intensity: 5,
    tip: "Rest the night before. Pace yourself in the hall. Method marks exist for a reason: show workings.",
    color: "oklch(0.45 0.18 250)",
    bg: "oklch(0.96 0.04 250)",
    border: "oklch(0.82 0.1 250)",
  },
  {
    period: "Feb 2027",
    label: "Results Day",
    intensity: 0,
    tip: "Whatever the result, there are more paths than you think. This is not the last decision.",
    color: "oklch(0.55 0.01 230)",
    bg: "oklch(0.97 0.01 230)",
    border: "oklch(0.88 0.02 230)",
  },
];

export default function ExamTimeline() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="space-y-3">
      {/* Key callout */}
      <div className="bg-[oklch(0.25_0.08_250)] text-[oklch(0.88_0.05_220)] rounded-xl px-5 py-3 text-sm">
        <span className="font-semibold">Note:</span> MOE removed mid-year A-Level exams. The year now runs straight from Prelims to the written papers in October. Most parents don't know this yet.
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PHASES.map((phase, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="rounded-xl border p-4"
            style={{
              background: isDark ? "oklch(0.18 0.02 240)" : phase.bg,
              borderColor: isDark ? "oklch(0.28 0.03 240)" : phase.border,
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: phase.color }}
              >
                {phase.period}
              </span>
              {phase.intensity > 0 && (
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div
                      key={j}
                      className="w-1.5 h-4 rounded-full"
                      style={{
                        background:
                          j < phase.intensity
                            ? phase.color
                            : isDark ? "oklch(0.28 0.02 240)" : "oklch(0.90 0.01 230)",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <p
              className="font-heading font-bold text-base mb-2"
              style={{ color: isDark ? "oklch(0.90 0.01 230)" : "oklch(0.2 0.01 240)" }}
            >
              {phase.label}
            </p>
            <p className="text-xs text-[oklch(0.45_0.01_230)] leading-relaxed">
              {phase.tip}
            </p>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-[oklch(0.6_0.01_230)] px-1">
        Intensity bars show relative exam pressure, not study hours. Use this timeline to plan tuition support before crunch points, not during them.
      </p>
    </div>
  );
}
