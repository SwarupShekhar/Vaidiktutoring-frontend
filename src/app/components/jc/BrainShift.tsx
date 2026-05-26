"use client";

import React from "react";
import { motion } from "framer-motion";

const rows = [
  { oLevel: "Memorise and reproduce", jc: "Analyse and apply to unseen situations" },
  { oLevel: "One right answer", jc: "Structured argument with nuance" },
  { oLevel: "Content coverage", jc: "Conceptual depth" },
  { oLevel: "Marks for effort", jc: "Marks for precision" },
  { oLevel: "Predictable questions", jc: "Deliberately unfamiliar scenarios" },
  { oLevel: "Study harder = do better", jc: "Study smarter = do better" },
];

export default function BrainShift() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)]">
      <div className="grid grid-cols-2">
        {/* Headers */}
        <div className="bg-[oklch(0.96_0.015_230)] dark:bg-[oklch(0.18_0.01_240)] px-5 py-4 border-b border-r border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)]">
          <span className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)]">
            O-Level thinking
          </span>
        </div>
        <div className="bg-[oklch(0.25_0.08_250)] px-5 py-4 border-b border-[oklch(0.35_0.1_250)]">
          <span className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.82_0.05_220)]">
            A-Level thinking
          </span>
        </div>

        {/* Rows */}
        {rows.map((row, i) => (
          <React.Fragment key={i}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className={`px-5 py-4 border-r border-b border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] text-sm text-[oklch(0.45_0.01_230)] dark:text-[oklch(0.70_0.01_230)] ${
                i % 2 === 0 ? "bg-white dark:bg-[oklch(0.14_0.01_240)]" : "bg-[oklch(0.985_0.005_230)] dark:bg-[oklch(0.17_0.01_240)]"
              }`}
            >
              {row.oLevel}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 + 0.05, duration: 0.4 }}
              className={`px-5 py-4 border-b border-[oklch(0.30_0.07_250)] text-sm font-medium text-[oklch(0.88_0.05_220)] ${
                i % 2 === 0
                  ? "bg-[oklch(0.28_0.08_250)]"
                  : "bg-[oklch(0.26_0.08_250)]"
              }`}
            >
              {row.jc}
            </motion.div>
          </React.Fragment>
        ))}
      </div>

      <div className="bg-[oklch(0.97_0.01_230)] dark:bg-[oklch(0.12_0.01_240)] px-5 py-3 border-t border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)]">
        <p className="text-xs text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)]">
          This shift explains why O-Level A1 students can score U in JC1. The exam is testing something fundamentally different.
        </p>
      </div>
    </div>
  );
}
