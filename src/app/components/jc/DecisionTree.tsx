"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";

type Step = { q: string; options: { label: string; value: string }[] };

const STEPS: Step[] = [
  {
    q: "Are you more comfortable with numbers or words?",
    options: [
      { label: "Numbers / Logic", value: "sci" },
      { label: "Words / Ideas", value: "arts" },
      { label: "Both equally", value: "mixed" },
    ],
  },
  {
    q: "Which university goal fits you best?",
    options: [
      { label: "Medicine / Dentistry", value: "med" },
      { label: "Engineering / Computing", value: "eng" },
      { label: "Law / Business / Social Sci", value: "law" },
      { label: "Not sure yet", value: "open" },
    ],
  },
  {
    q: "How much do you enjoy reading and writing arguments?",
    options: [
      { label: "I like it, don't mind GP", value: "gpok" },
      { label: "I find it hard but manageable", value: "gphard" },
    ],
  },
];

type Answers = string[];

function getRecommendation(answers: Answers): {
  combo: string;
  why: string;
  note?: string;
} {
  const [stream, goal, gp] = answers;

  if (goal === "med") {
    return {
      combo: "H2 Math + H2 Chem + H2 Bio + H1 Econs",
      why: "Standard combination for Medicine / Dentistry. Chem + Bio are both required by NUS Medicine. Math provides the analytical base.",
      note: "Contrasting subject: H1 Econs balances the science load and develops essay skills relevant to MMI interviews.",
    };
  }
  if (goal === "eng") {
    return {
      combo: "H2 Math + H2 Phys + H2 Chem or Computing + H1 Econs",
      why: "Math and Physics are the core for all engineering courses. Chem is preferred for Chemical Engineering; Computing for Computer Science.",
      note: "NUS Computing accepts Math + Phys or Math + Chem. Check specific requirements for your target course.",
    };
  }
  if (goal === "law") {
    if (stream === "sci") {
      return {
        combo: "H2 Math + H2 Econs + H2 Lit or Hist + H1 Chem",
        why: "Law and Business are open-entry: no specific H2 required. A science + humanities mix makes you a more distinct applicant.",
        note: "H2 Econs develops the analytical writing style law schools favour.",
      };
    }
    return {
      combo: "H2 Econs + H2 Lit + H2 Hist or Geog + H1 Math",
      why: "Strong humanities combination for Law, Social Sciences, and Business. H2 Econs is especially valued for Business and PPE.",
      note: "H1 Math satisfies the contrasting subject rule and keeps STEM options open.",
    };
  }

  if (stream === "sci") {
    return {
      combo: "H2 Math + H2 Chem + H2 Phys + H1 Econs",
      why: "Classic pure science combination. Maximises UAS scoring potential in subjects with clear marking schemes. Keeps all Science + Engineering + Computing pathways open.",
    };
  }
  if (stream === "arts") {
    return {
      combo: "H2 Econs + H2 Lit or Geog + H2 Hist + H1 Math",
      why: "Strong full-humanities combination. Maximises essay-based scoring potential and keeps Law, Business, and Social Science pathways open.",
    };
  }
  return {
    combo: "H2 Math + H2 Econs + H2 Chem or Lit + H1 Econs or Phys",
    why: "Mixed stream combinations offer the broadest university pathway. H2 Math + H2 Econs is a particularly powerful pairing: quantitative and analytical.",
    note: "Discuss with your Subject Head at JC orientation: mixed stream choices can be tricky with the contrasting subject rule.",
  };
}

export default function DecisionTree() {
  const [answers, setAnswers] = useState<Answers>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const step = answers.length;
  const done = step >= STEPS.length;

  function choose(value: string) {
    setSelected(value);
    setTimeout(() => {
      setAnswers((prev) => [...prev, value]);
      setSelected(null);
    }, 260);
  }

  function reset() {
    setAnswers([]);
    setSelected(null);
  }

  const rec = done ? getRecommendation(answers) : null;

  return (
    <div className="bg-white dark:bg-[oklch(0.14_0.01_240)] border border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] flex items-center justify-between">
        <div>
          <h4 className="font-heading font-bold text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] text-lg">
            Subject Combination Decision Tree
          </h4>
          <p className="text-xs text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] mt-0.5">
            3 questions. Personalised recommendation.
          </p>
        </div>
        {answers.length > 0 && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] hover:text-[oklch(0.3_0.01_240)] dark:text-[oklch(0.85_0.01_230)] transition-colors"
          >
            <RotateCcw size={13} /> Restart
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="flex h-1">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`flex-1 transition-colors duration-500 ${
              i < step
                ? "bg-[oklch(0.45_0.18_250)]"
                : "bg-[oklch(0.93_0.01_230)] dark:bg-[oklch(0.17_0.01_240)]"
            }`}
          />
        ))}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.28 }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] mb-2">
                Question {step + 1} of {STEPS.length}
              </p>
              <p className="font-heading font-bold text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] text-xl mb-5">
                {STEPS[step].q}
              </p>
              <div className="space-y-2.5">
                {STEPS[step].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => choose(opt.value)}
                    className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-between group ${
                      selected === opt.value
                        ? "border-[oklch(0.45_0.18_250)] bg-[oklch(0.96_0.03_250)] dark:bg-[oklch(0.14_0.04_250)] text-[oklch(0.3_0.15_250)]"
                        : "border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] text-[oklch(0.3_0.01_240)] dark:text-[oklch(0.85_0.01_230)] hover:border-[oklch(0.65_0.08_250)] hover:bg-[oklch(0.98_0.01_250)]"
                    }`}
                  >
                    {opt.label}
                    <ArrowRight
                      size={15}
                      className="opacity-0 group-hover:opacity-60 transition-opacity text-[oklch(0.45_0.18_250)]"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.45_0.18_145)] mb-2">
                Recommended combination
              </p>
              <p className="font-heading font-bold text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] text-xl mb-4">
                {rec!.combo}
              </p>
              <p className="text-sm text-[oklch(0.4_0.01_230)] dark:text-[oklch(0.75_0.01_230)] leading-relaxed mb-3">
                {rec!.why}
              </p>
              {rec!.note && (
                <p className="text-xs text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] bg-[oklch(0.97_0.01_230)] dark:bg-[oklch(0.12_0.01_240)] rounded-lg p-3 leading-relaxed">
                  {rec!.note}
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="#free-trial"
                  className="inline-flex items-center gap-2 bg-[oklch(0.25_0.08_250)] hover:bg-[oklch(0.3_0.1_250)] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  Get subject advice from a tutor
                  <ArrowRight size={15} />
                </a>
                <button
                  onClick={reset}
                  className="text-sm text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] hover:text-[oklch(0.3_0.01_240)] dark:text-[oklch(0.85_0.01_230)] transition-colors"
                >
                  Try different answers
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
