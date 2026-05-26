"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Info, ChevronDown } from "lucide-react";

type Grade = "A" | "B" | "C" | "D" | "E" | "S" | "U" | "";

const H2_POINTS: Record<string, number> = {
  A: 20, B: 17, C: 13, D: 10, E: 7, S: 4, U: 0,
};
const H1_POINTS: Record<string, number> = {
  A: 10, B: 8, C: 6, D: 5, E: 3, S: 2, U: 0,
};

const GRADE_OPTIONS: Grade[] = ["A", "B", "C", "D", "E", "S", "U"];

const COURSE_CUTOFFS: { course: string; score: number; uni: string }[] = [
  { course: "Medicine", score: 68, uni: "NUS" },
  { course: "Law", score: 66, uni: "NUS" },
  { course: "Computer Science", score: 60, uni: "NUS" },
  { course: "Business", score: 58, uni: "NUS" },
  { course: "Engineering (any)", score: 55, uni: "NTU" },
  { course: "Accountancy", score: 55, uni: "SMU" },
  { course: "Social Sciences", score: 50, uni: "NUS" },
];

function GradeSelect({
  value,
  onChange,
  label,
  type,
}: {
  value: Grade;
  onChange: (v: Grade) => void;
  label: string;
  type: "H2" | "H1";
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-[oklch(0.92_0.01_230)] dark:border-[oklch(0.20_0.01_240)]">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] mr-2">
          {type}
        </span>
        <span className="font-body text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] font-medium text-sm">
          {label}
        </span>
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as Grade)}
          className="appearance-none bg-[oklch(0.97_0.01_230)] dark:bg-[oklch(0.12_0.01_240)] border border-[oklch(0.88_0.02_230)] dark:border-[oklch(0.22_0.02_240)] rounded-lg px-3 py-1.5 pr-8 text-sm font-bold font-heading text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.18_250)] cursor-pointer"
          aria-label={`Grade for ${label}`}
        >
          <option value="">--</option>
          {GRADE_OPTIONS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)]"
        />
      </div>
    </div>
  );
}

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  const color =
    pct >= 90
      ? "oklch(0.55 0.18 145)"
      : pct >= 75
      ? "oklch(0.55 0.18 250)"
      : pct >= 55
      ? "oklch(0.65 0.15 70)"
      : "oklch(0.55 0.18 25)";

  return (
    <div className="w-full bg-[oklch(0.93_0.01_230)] dark:bg-[oklch(0.17_0.01_240)] rounded-full h-2.5 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

export default function UASCalculator() {
  const [h2a, setH2a] = useState<Grade>("");
  const [h2b, setH2b] = useState<Grade>("");
  const [h2c, setH2c] = useState<Grade>("");
  const [h2d, setH2d] = useState<Grade>("");
  const [h1gp, setH1gp] = useState<Grade>("");
  const [h1mtl, setH1mtl] = useState<Grade>("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const result = useMemo(() => {
    const h2Grades = [h2a, h2b, h2c, h2d].filter(Boolean) as string[];
    const h2Scores = h2Grades.map((g) => H2_POINTS[g] ?? 0);
    const top3H2 = [...h2Scores].sort((a, b) => b - a).slice(0, 3);
    const h2Total = top3H2.reduce((s, v) => s + v, 0);

    const gpScore = h1gp ? H1_POINTS[h1gp] ?? 0 : 0;
    const base = h2Total + gpScore;

    const h2dScore = h2d ? H2_POINTS[h2d] ?? 0 : null;
    const mtlScore = h1mtl ? H1_POINTS[h1mtl] ?? 0 : null;

    let bonus = 0;
    let bonusSource = "";
    if (h2dScore !== null && h2dScore > 0) {
      const h2dH1equiv = Math.round(h2dScore * 0.5);
      if (h2dH1equiv > (mtlScore ?? 0)) {
        bonus = h2dH1equiv;
        bonusSource = "4th H2 subject";
      }
    }
    if (mtlScore !== null && mtlScore > bonus) {
      bonus = mtlScore;
      bonusSource = "Mother Tongue";
    }

    const total = base + bonus;
    const hasInput = h2Grades.length > 0 || h1gp;

    return {
      total,
      base,
      bonus,
      bonusSource,
      gpScore,
      h2Total,
      top3H2,
      hasInput,
    };
  }, [h2a, h2b, h2c, h2d, h1gp, h1mtl]);

  const reachableCourses = COURSE_CUTOFFS.filter(
    (c) => result.total >= c.score - 2
  );
  const stretchCourses = COURSE_CUTOFFS.filter(
    (c) => result.total < c.score - 2 && result.total >= c.score - 8
  );

  return (
    <div className="bg-white dark:bg-[oklch(0.14_0.01_240)] border border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-[oklch(0.25_0.08_250)] px-6 py-5 flex items-center gap-3">
        <Calculator size={20} className="text-[oklch(0.85_0.05_220)]" />
        <div>
          <h3 className="font-heading font-bold text-white text-lg leading-tight">
            70-Point UAS Calculator
          </h3>
          <p className="text-[oklch(0.75_0.04_220)] text-xs mt-0.5">
            Based on the current SEAB scoring system
          </p>
        </div>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] mb-3">
            Your Grades
          </p>
          <GradeSelect value={h2a} onChange={setH2a} label="H2 Subject 1" type="H2" />
          <GradeSelect value={h2b} onChange={setH2b} label="H2 Subject 2" type="H2" />
          <GradeSelect value={h2c} onChange={setH2c} label="H2 Subject 3" type="H2" />
          <GradeSelect value={h2d} onChange={setH2d} label="H2 Subject 4 (optional)" type="H2" />
          <GradeSelect value={h1gp} onChange={setH1gp} label="General Paper" type="H1" />
          <GradeSelect value={h1mtl} onChange={setH1mtl} label="Mother Tongue (optional)" type="H1" />
        </div>

        {/* Result */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] mb-4">
              Your Score
            </p>

            {result.hasInput ? (
              <motion.div
                key={result.total}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-end gap-2 mb-3">
                  <span className="font-heading font-bold text-6xl text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] tabular-nums">
                    {result.total}
                  </span>
                  <span className="font-heading font-bold text-2xl text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] mb-2">
                    / 70
                  </span>
                </div>
                <ScoreBar score={result.total} max={70} />

                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="mt-3 flex items-center gap-1.5 text-xs text-[oklch(0.45_0.15_250)] hover:text-[oklch(0.35_0.18_250)] font-semibold transition-colors"
                >
                  <Info size={13} />
                  {showBreakdown ? "Hide" : "Show"} breakdown
                </button>

                <AnimatePresence>
                  {showBreakdown && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-1.5 bg-[oklch(0.97_0.01_230)] dark:bg-[oklch(0.12_0.01_240)] rounded-xl p-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)]">
                            Best 3 H2 subjects
                          </span>
                          <span className="font-bold font-heading text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)]">
                            {result.h2Total} / 60
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)]">
                            General Paper (H1)
                          </span>
                          <span className="font-bold font-heading text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)]">
                            {result.gpScore} / 10
                          </span>
                        </div>
                        {result.bonus > 0 && (
                          <div className="flex justify-between text-[oklch(0.45_0.18_145)]">
                            <span>Bonus ({result.bonusSource})</span>
                            <span className="font-bold font-heading">
                              +{result.bonus}
                            </span>
                          </div>
                        )}
                        <div className="border-t border-[oklch(0.88_0.02_230)] dark:border-[oklch(0.22_0.02_240)] pt-2 flex justify-between font-bold">
                          <span className="text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)]">
                            Total UAS
                          </span>
                          <span className="text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] font-heading">
                            {result.total} / 70
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Course context */}
                {(reachableCourses.length > 0 || stretchCourses.length > 0) && (
                  <div className="mt-5 space-y-3">
                    {reachableCourses.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-[oklch(0.45_0.18_145)] uppercase tracking-widest mb-1.5">
                          Within reach
                        </p>
                        {reachableCourses.map((c) => (
                          <div
                            key={c.course}
                            className="flex justify-between text-sm py-1"
                          >
                            <span className="text-[oklch(0.3_0.01_240)] dark:text-[oklch(0.85_0.01_230)]">
                              {c.uni} {c.course}
                            </span>
                            <span className="font-heading font-semibold text-[oklch(0.45_0.18_145)]">
                              {c.score}+
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {stretchCourses.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-[oklch(0.55_0.15_70)] uppercase tracking-widest mb-1.5">
                          Stretch (need +{stretchCourses[0].score - result.total} points)
                        </p>
                        {stretchCourses.map((c) => (
                          <div
                            key={c.course}
                            className="flex justify-between text-sm py-1"
                          >
                            <span className="text-[oklch(0.3_0.01_240)] dark:text-[oklch(0.85_0.01_230)]">
                              {c.uni} {c.course}
                            </span>
                            <span className="font-heading font-semibold text-[oklch(0.55_0.15_70)]">
                              {c.score}+
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-40 text-center text-[oklch(0.65_0.01_230)] text-sm">
                <p>Enter your grades on the left to see your UAS score.</p>
              </div>
            )}
          </div>

          {/* Email capture */}
          {result.hasInput && !submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 bg-[oklch(0.97_0.015_250)] dark:bg-[oklch(0.14_0.04_250)] rounded-xl p-4 border border-[oklch(0.88_0.04_250)] dark:border-[oklch(0.25_0.06_250)]"
            >
              <p className="text-sm font-semibold text-[oklch(0.25_0.08_250)] mb-1">
                Get a personalised study plan
              </p>
              <p className="text-xs text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)] mb-3">
                Based on your UAS score and target course, we will map exactly
                which topics to address first.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setSubmitted(true);
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 rounded-lg border border-[oklch(0.88_0.02_230)] dark:border-[oklch(0.22_0.02_240)] bg-white dark:bg-[oklch(0.14_0.01_240)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.18_250)] text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)]"
                />
                <button
                  type="submit"
                  className="bg-[oklch(0.45_0.18_250)] hover:bg-[oklch(0.4_0.2_250)] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  Send plan
                </button>
              </form>
            </motion.div>
          )}
          {submitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-[oklch(0.96_0.04_145)] dark:bg-[oklch(0.14_0.04_145)] rounded-xl p-4 border border-[oklch(0.85_0.08_145)] text-sm text-[oklch(0.35_0.12_145)] font-semibold"
            >
              Study plan on its way to {email}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
