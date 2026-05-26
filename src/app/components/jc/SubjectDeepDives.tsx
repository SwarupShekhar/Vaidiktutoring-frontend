"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Subject {
  id: string;
  name: string;
  tag: string;
  uasNote: string;
  hardestTopics: string[];
  whereLoseMarks: string[];
  examTip: string;
  ctaText: string;
  ctaHref: string;
  color: string;
  bg: string;
}

const SUBJECTS: Subject[] = [
  {
    id: "math",
    name: "H2 Mathematics",
    tag: "20 UAS points",
    uasNote: "Your single highest-impact subject. One grade difference is 3–7 UAS points.",
    hardestTopics: [
      "Vectors in 3D: proof questions catch most students on method marks",
      "Maclaurin Series: wrong term order is automatic loss of marks",
      "Integration by parts: students set up correctly but lose final marks to algebra errors",
      "Complex Numbers: argument and modulus under time pressure",
    ],
    whereLoseMarks: [
      "Not stating domain/range of a function",
      "Incomplete vector proofs: showing working is not enough, the logical chain must be explicit",
      "Wrong integration bounds in definite integrals",
      "Forgetting +C in indefinite integration (consistently)",
    ],
    examTip: "In H2 Math, marks follow a Method + Accuracy structure. Even a wrong final answer can score full method marks if your working is shown and logical. Never leave a question blank.",
    ctaText: "H2 Math tuition",
    ctaHref: "/subjects/h2-math",
    color: "oklch(0.45 0.18 250)",
    bg: "oklch(0.97 0.02 250)",
  },
  {
    id: "chem",
    name: "H2 Chemistry",
    tag: "20 UAS points",
    uasNote: "Most conceptually demanding A-Level science. But the organic synthesis map is learnable.",
    hardestTopics: [
      "Organic Synthesis: multi-step pathways with reagent precision",
      "Electrochemistry: cell notation and electrode equation sign errors",
      "Chemical Equilibria: Le Chatelier under pressure and concentration change",
      "Acid-Base Titrations: buffer calculations and indicator selection",
    ],
    whereLoseMarks: [
      "Incomplete ionic equations: leaving out spectator ions or missing state symbols",
      "Wrong conditions in organic reactions (catalyst, temperature, solvent all matter)",
      "Forgetting to balance half-equations in electrochemistry",
      "Imprecise language in describe/explain questions: examiners mark the exact word",
    ],
    examTip: "For practical exams, always state your observation before your conclusion. 'Solution turns orange' then 'this indicates presence of…', not the other way around.",
    ctaText: "H2 Chemistry tuition",
    ctaHref: "/subjects/h2-chemistry",
    color: "oklch(0.5 0.2 25)",
    bg: "oklch(0.97 0.04 25)",
  },
  {
    id: "econ",
    name: "H2 Economics",
    tag: "20 UAS points",
    uasNote: "Most students start from zero. That is both the risk and the opportunity.",
    hardestTopics: [
      "Case Study Part B: synthesising multiple extracts under time pressure",
      "Market Failure essays: getting externalities, public goods, and information asymmetry distinct",
      "Macroeconomics: AD-AS model with full diagram annotation",
      "International Trade: comparative advantage calculations with opportunity cost",
    ],
    whereLoseMarks: [
      "Drawing diagrams without explaining them in words: both are required",
      "One-sided analysis: A-Level Econs demands counter-argument",
      "Missing real-world application: every point needs an example",
      "Weak thesis: the examiner needs to know your conclusion in the first paragraph",
    ],
    examTip: "The PEEL structure works for Econs essays: Point, Explain with diagram, Evidence from real world, Link back to question. Students who skip 'Link back' consistently score one grade below their knowledge level.",
    ctaText: "H2 Economics tuition",
    ctaHref: "/subjects/h2-economics",
    color: "oklch(0.55 0.15 145)",
    bg: "oklch(0.96 0.04 145)",
  },
  {
    id: "gp",
    name: "General Paper",
    tag: "10 UAS points, 14% of your total score",
    uasNote: "The most underestimated subject in JC. GP can single-handedly drop your university application by a grade band.",
    hardestTopics: [
      "Essay writing: building a cohesive argument, not just listing examples",
      "Comprehension: Application Question requires genuine critical analysis",
      "Summary: selecting relevant points without paraphrasing incorrectly",
      "Vocabulary: examiners note imprecise word choice immediately",
    ],
    whereLoseMarks: [
      "Over-narrating examples instead of analysing them: telling the story, not making the point",
      "Ignoring counter-arguments: a one-sided essay caps at grade C",
      "Weak thesis statements: vague opening paragraphs with no clear stand",
      "In comprehension: lifting phrases verbatim instead of synthesising in your own words",
    ],
    examTip: "Your GP essay should be able to answer this question: what is the one thing I am arguing? If you cannot state it in one sentence, your essay lacks a thesis. Write the thesis first, then build the essay around it.",
    ctaText: "GP tuition",
    ctaHref: "/subjects/general-paper",
    color: "oklch(0.5 0.15 300)",
    bg: "oklch(0.97 0.02 300)",
  },
  {
    id: "phys",
    name: "H2 Physics",
    tag: "20 UAS points",
    uasNote: "Requires both conceptual clarity and calculation precision. Students who nail one but not the other plateau at grade B.",
    hardestTopics: [
      "Electricity and Magnetism: field direction, Lenz's Law, and induced EMF under exam pressure",
      "Waves: superposition, diffraction grating calculations, and intensity-distance relationships",
      "Quantum Physics: photoelectric effect and electron diffraction conceptual questions",
      "Mechanics: projectile motion with variable acceleration",
    ],
    whereLoseMarks: [
      "Conceptual questions answered with formulas only: words are required",
      "Significant figure errors: losing 1 mark per question across a paper adds up",
      "Not drawing clear free-body diagrams for mechanics questions",
      "Misidentifying direction of magnetic force (Fleming's left vs right hand rule)",
    ],
    examTip: "For every Physics calculation, write the principle first. 'By conservation of momentum…' or 'Applying Newton's 2nd law…', this earns method marks even if the arithmetic is wrong.",
    ctaText: "H2 Physics tuition",
    ctaHref: "/subjects/h2-physics",
    color: "oklch(0.5 0.18 200)",
    bg: "oklch(0.97 0.03 200)",
  },
];

function SubjectCard({ subject }: { subject: Subject }) {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="border border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] rounded-2xl overflow-hidden bg-white dark:bg-[oklch(0.14_0.01_240)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between px-6 py-5 text-left hover:bg-[oklch(0.985_0.005_230)] dark:hover:bg-[oklch(0.18_0.01_240)] transition-colors group"
        aria-expanded={open}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-1.5 h-14 rounded-full flex-shrink-0 mt-0.5"
            style={{ background: subject.color }}
          />
          <div>
            <p className="font-heading font-bold text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] text-lg leading-tight">
              {subject.name}
            </p>
            <p
              className="text-xs font-semibold mt-1"
              style={{ color: subject.color }}
            >
              {subject.tag}
            </p>
            <p className="text-sm text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)] mt-1.5 pr-8">
              {subject.uasNote}
            </p>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 mt-1.5 text-[oklch(0.6_0.01_230)] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div
              className="px-6 pb-6 pt-2 border-t border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] space-y-5"
            >
              {/* Hardest topics */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] mb-3">
                  Hardest topics
                </p>
                <ul className="space-y-2">
                  {subject.hardestTopics.map((t, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-[oklch(0.35_0.01_240)] dark:text-[oklch(0.80_0.01_230)]">
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                        style={{ background: subject.color }}
                      >
                        {i + 1}
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Where marks are lost */}
              <div
                className="rounded-xl p-4 space-y-2"
                style={{ background: isDark ? "oklch(0.19 0.02 240)" : subject.bg }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: subject.color }}>
                  Where marks are actually lost
                </p>
                {subject.whereLoseMarks.map((m, i) => (
                  <p key={i} className="text-sm text-[oklch(0.35_0.01_240)] dark:text-[oklch(0.80_0.01_230)] flex gap-2">
                    <span className="text-[oklch(0.65_0.01_230)] flex-shrink-0">-</span>
                    {m}
                  </p>
                ))}
              </div>

              {/* Exam tip */}
              <div className="bg-[oklch(0.25_0.08_250)] rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.75_0.04_220)] mb-2">
                  Exam technique
                </p>
                <p className="text-sm text-[oklch(0.88_0.03_220)] leading-relaxed">
                  {subject.examTip}
                </p>
              </div>

              <Link
                href={subject.ctaHref}
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                style={{ color: subject.color }}
              >
                See full {subject.ctaText} page
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SubjectDeepDives() {
  return (
    <div className="space-y-3">
      {SUBJECTS.map((s) => (
        <SubjectCard key={s.id} subject={s} />
      ))}
    </div>
  );
}
