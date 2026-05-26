"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const STORIES = [
  {
    subject: "H2 Chemistry",
    startGrade: "U",
    endGrade: "B",
    weeks: 8,
    name: "Priya T.",
    school: "Raffles Institution",
    quote: "I was memorising reaction conditions without understanding why. Once I saw the organic chemistry as a connected map, not a list to remember, it clicked.",
    change: "Stopped memorising. Started mapping.",
  },
  {
    subject: "H2 Mathematics",
    startGrade: "S",
    endGrade: "A",
    weeks: 16,
    name: "Marcus L.",
    school: "Victoria JC",
    quote: "I failed Promos in JC2. That result felt like everything was over. It wasn't. The next 16 weeks, we went through every past year paper systematically. I understood why I was losing marks, not just what the correct answer was.",
    change: "Diagnosed every error type. Fixed the patterns.",
  },
  {
    subject: "General Paper",
    startGrade: "E",
    endGrade: "B",
    weeks: 12,
    name: "Amelia K.",
    school: "Hwa Chong Institution",
    quote: "I always had ideas. The problem was I was writing essays that were interesting to me but not answering the question the examiner was actually asking. Learning to read the question properly changed everything.",
    change: "Learned to answer what was asked, not what was interesting.",
  },
  {
    subject: "H2 Economics",
    startGrade: "D",
    endGrade: "A",
    weeks: 20,
    name: "Darren W.",
    school: "Anglo-Chinese JC",
    quote: "Econs felt like guessing until I understood that there is actually a very specific structure the examiner is looking for. Once you know the framework, you apply it. It is almost a formula.",
    change: "Understood the examiner framework. Applied it consistently.",
  },
];

const GRADE_COLORS: Record<string, string> = {
  U: "oklch(0.5 0.2 25)",
  S: "oklch(0.55 0.15 30)",
  E: "oklch(0.55 0.15 40)",
  D: "oklch(0.55 0.15 70)",
  C: "oklch(0.55 0.12 120)",
  B: "oklch(0.5 0.15 145)",
  A: "oklch(0.45 0.18 145)",
};

export default function StudentStories() {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {STORIES.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.45 }}
          className="bg-white dark:bg-[oklch(0.14_0.01_240)] border border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] rounded-2xl p-6 flex flex-col"
        >
          {/* Grade transformation */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span
                className="font-heading font-bold text-2xl"
                style={{ color: GRADE_COLORS[s.startGrade] ?? "oklch(0.5 0.15 25)" }}
              >
                {s.startGrade}
              </span>
              <TrendingUp size={18} className="text-[oklch(0.75_0.01_230)]" />
              <span
                className="font-heading font-bold text-2xl"
                style={{ color: GRADE_COLORS[s.endGrade] ?? "oklch(0.45 0.18 145)" }}
              >
                {s.endGrade}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] truncate">
                {s.subject}
              </p>
              <p className="text-xs text-[oklch(0.6_0.01_230)]">
                {s.weeks} weeks
              </p>
            </div>
          </div>

          {/* Quote */}
          <blockquote className="flex-1 text-sm text-[oklch(0.4_0.01_230)] dark:text-[oklch(0.75_0.01_230)] leading-relaxed italic border-l-0 mb-4">
            "{s.quote}"
          </blockquote>

          {/* The change */}
          <div className="bg-[oklch(0.97_0.01_230)] dark:bg-[oklch(0.12_0.01_240)] rounded-xl px-4 py-3 mb-4">
            <p className="text-xs font-semibold text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] uppercase tracking-widest mb-1">
              What changed
            </p>
            <p className="text-sm font-medium text-[oklch(0.25_0.01_240)] dark:text-[oklch(0.90_0.01_230)]">
              {s.change}
            </p>
          </div>

          {/* Attribution */}
          <div>
            <p className="text-sm font-semibold text-[oklch(0.3_0.01_240)] dark:text-[oklch(0.85_0.01_230)]">
              {s.name}
            </p>
            <p className="text-xs text-[oklch(0.6_0.01_230)]">{s.school}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
