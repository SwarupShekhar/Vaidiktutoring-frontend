"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  FlaskConical,
  GraduationCap,
  TrendingUp,
  Clock,
  Users,
  Target,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
  Zap,
  Brain,
} from "lucide-react";

// Lazy-load all heavy below-the-fold sub-components to keep initial JS small
const UASCalculator = dynamic(() => import("../components/jc/UASCalculator"), { ssr: true });
const BrainShift = dynamic(() => import("../components/jc/BrainShift"), { ssr: true });
const ShockCurve = dynamic(() => import("../components/jc/ShockCurve"), { ssr: true });
const DecisionTree = dynamic(() => import("../components/jc/DecisionTree"), { ssr: true });
const ExamTimeline = dynamic(() => import("../components/jc/ExamTimeline"), { ssr: true });
const DifficultyMatrix = dynamic(() => import("../components/jc/DifficultyMatrix"), { ssr: true });
const SubjectDeepDives = dynamic(() => import("../components/jc/SubjectDeepDives"), { ssr: true });
const StudentStories = dynamic(() => import("../components/jc/StudentStories"), { ssr: true });
const ResourcesHub = dynamic(() => import("../components/jc/ResourcesHub"), { ssr: true });
const SubjectFAQ = dynamic(() => import("../components/subjects/SubjectFAQ"), { ssr: true });
const StickyCTA = dynamic(() => import("../components/subjects/StickyCTA"), { ssr: false });

// ─── Anchor nav ──────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { id: "what-is-jc", label: "What is JC?" },
  { id: "a-level-system", label: "A-Level system" },
  { id: "uas-calculator", label: "UAS calculator" },
  { id: "subject-guides", label: "Subject guides" },
  { id: "exam-timeline", label: "Timeline 2026" },
  { id: "subject-combo", label: "Subject combo" },
  { id: "resources", label: "Free resources" },
  { id: "stories", label: "Student stories" },
  { id: "faq", label: "FAQ" },
];

function AnchorNav() {
  return (
    <nav
      className="sticky top-0 z-40 bg-white/95 dark:bg-[oklch(0.13_0.01_240)] backdrop-blur-sm border-b border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] py-3 overflow-x-auto"
      aria-label="Page sections"
    >
      <ul className="flex gap-1 px-4 md:px-8 min-w-max mx-auto max-w-6xl">
        {NAV_LINKS.map((l) => (
          <li key={l.id}>
            <a
              href={`#${l.id}`}
              className="block px-3 py-1.5 rounded-lg text-xs font-semibold text-[oklch(0.45_0.01_230)] dark:text-[oklch(0.70_0.01_230)] hover:text-[oklch(0.25_0.08_250)] hover:bg-[oklch(0.96_0.02_250)] transition-colors whitespace-nowrap"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-16 px-4 md:px-8 py-14 md:py-20 max-w-6xl mx-auto ${className}`}
    >
      {children}
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.45_0.18_250)] mb-3">
      {children}
    </p>
  );
}

function SectionHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-heading font-bold text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] text-3xl md:text-4xl leading-tight ${className}`}
    >
      {children}
    </h2>
  );
}

// ─── UAS visual breakdown ─────────────────────────────────────────────────────
function UASBreakdownVisual() {
  const rows = [
    { label: "3 H2 subjects", pts: "up to 20 pts each", total: 60, color: "oklch(0.45 0.18 250)", pct: 86 },
    { label: "H1 General Paper", pts: "up to 10 pts", total: 10, color: "oklch(0.5 0.15 300)", pct: 14 },
  ];

  return (
    <div className="bg-[oklch(0.25_0.08_250)] rounded-2xl p-6 text-white">
      <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.75_0.04_220)] mb-5">
        How the 70 points are built
      </p>
      <div className="space-y-4 mb-6">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-[oklch(0.88_0.03_220)]">{r.label}</span>
              <span className="font-heading font-bold">{r.total} pts</span>
            </div>
            <div className="h-2 bg-[oklch(0.35_0.06_250)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full jc-bar-fill"
                style={{ background: r.color, width: `${r.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[oklch(0.35_0.06_250)] pt-4 flex justify-between items-center">
        <span className="text-[oklch(0.75_0.04_220)] text-sm">Base total</span>
        <span className="font-heading font-bold text-2xl">70 pts</span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-[oklch(0.75_0.04_220)]">
        <p>+ 4th H2 subject or MTL: only counted if it raises your score</p>
        <p>+ Project Work: Pass/Fail only, not in the score</p>
      </div>

      <div className="mt-5 bg-[oklch(0.35_0.1_250)] rounded-xl p-4">
        <p className="text-xs font-semibold text-[oklch(0.82_0.05_220)] mb-1">
          Example: What dropping one GP grade costs
        </p>
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-[oklch(0.65_0.04_220)]">GP grade A</p>
            <p className="font-heading font-bold text-white">+10 pts</p>
          </div>
          <div>
            <p className="text-[oklch(0.65_0.04_220)]">GP grade C</p>
            <p className="font-heading font-bold text-[oklch(0.7_0.15_30)]">+6 pts</p>
          </div>
          <div>
            <p className="text-[oklch(0.65_0.04_220)]">Difference</p>
            <p className="font-heading font-bold text-[oklch(0.6_0.18_25)]">-4 pts</p>
          </div>
        </div>
        <p className="text-xs text-[oklch(0.65_0.04_220)] mt-2">
          4 UAS points is the difference between NUS Computing and not qualifying. GP is not a soft subject.
        </p>
      </div>
    </div>
  );
}

// ─── JC vs Poly vs IB table ──────────────────────────────────────────────────
function PathwayComparison() {
  const cols = [
    { name: "Junior College", tag: "2 years", highlight: true },
    { name: "Polytechnic", tag: "3 years", highlight: false },
    { name: "IB Diploma", tag: "2 years", highlight: false },
  ];
  const rows = [
    { label: "Qualification", jc: "Singapore A-Levels", poly: "Diploma", ib: "IB Diploma" },
    { label: "Main pathway to", jc: "Local universities (NUS/NTU/SMU)", poly: "Local unis + work", ib: "Global universities" },
    { label: "Exam system", jc: "SEAB A-Level papers", poly: "Continuous assessment + projects", ib: "IB exams + IA + EE + TOK" },
    { label: "Difficulty jump", jc: "Very steep: biggest shock", poly: "Moderate", ib: "Steep, different style" },
    { label: "Flexibility mid-course", jc: "Low: stuck with subject combo", poly: "High", ib: "Some flexibility" },
    { label: "Best if you want", jc: "Medicine, Law, top local uni", poly: "Practical skills, specific industry", ib: "Overseas uni, broader education" },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)]">
      <table className="w-full min-w-[480px] sm:min-w-[550px] lg:min-w-0 text-xs md:text-sm">
        <thead>
          <tr>
            <th className="text-left px-3 sm:px-4 py-3 text-xs font-semibold uppercase tracking-widest text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] bg-[oklch(0.96_0.01_230)] dark:bg-[oklch(0.15_0.01_240)] border-b border-r border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] w-24 sm:w-28">
              Path
            </th>
            {cols.map((c) => (
              <th
                key={c.name}
                className={`px-3 sm:px-4 py-3 text-left border-b border-r border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] last:border-r-0 ${
                  c.highlight
                    ? "bg-[oklch(0.25_0.08_250)]"
                    : "bg-[oklch(0.96_0.01_230)] dark:bg-[oklch(0.15_0.01_240)]"
                }`}
              >
                <p
                  className={`font-heading font-bold text-sm sm:text-base ${
                    c.highlight ? "text-white" : "text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)]"
                  }`}
                >
                  {c.name}
                </p>
                <p
                  className={`text-[10px] sm:text-xs ${
                    c.highlight
                      ? "text-[oklch(0.75_0.04_220)]"
                      : "text-[oklch(0.6_0.01_230)]"
                  }`}
                >
                  {c.tag}
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? "bg-white dark:bg-[oklch(0.14_0.01_240)]" : "bg-[oklch(0.985_0.005_230)] dark:bg-[oklch(0.11_0.01_240)]"}
            >
              <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-semibold text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] uppercase tracking-widest border-r border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)]">
                {row.label}
              </td>
              <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 text-[oklch(0.3_0.01_240)] dark:text-[oklch(0.85_0.01_230)] border-r border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] font-medium font-heading">
                {row.jc}
              </td>
              <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)] border-r border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)]">
                {row.poly}
              </td>
              <td className="px-3 sm:px-4 py-2.5 sm:py-3.5 text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)]">{row.ib}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── H1/H2/H3 table ──────────────────────────────────────────────────────────
function SubjectLevelTable() {
  const cols = [
    { name: "H1", sub: "Half the depth of H2" },
    { name: "H2", sub: "Full A-Level depth", highlight: true },
    { name: "H3", sub: "University extension level" },
  ];
  const rows = [
    { label: "UAS points", h1: "Up to 10", h2: "Up to 20", h3: "Distinction/Merit (bonus)" },
    { label: "Teaching hours", h1: "~4 hrs/week", h2: "~6–8 hrs/week", h3: "~2 hrs on top of H2" },
    { label: "Exam papers", h1: "1 paper", h2: "2–3 papers", h3: "1 paper (different format)" },
    { label: "Typical subjects", h1: "GP, MTL, Econs, Math", h2: "Math, Chem, Phys, Bio, Econ, Lit", h3: "Math, Chem (only at some JCs)" },
    { label: "Who takes it", h1: "Everyone (GP + MTL compulsory)", h2: "3 subjects (core of your UAS)", h3: "Top students who want challenge" },
    { label: "Worth it?", h1: "GP is essential. MTL manageable.", h2: "Your three H2s define your UAS.", h3: "Only if your H2 is already solid." },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)]">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr>
            <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-widest text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] bg-[oklch(0.96_0.01_230)] dark:bg-[oklch(0.15_0.01_240)] border-b border-r border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] w-36" />
            {cols.map((c) => (
              <th
                key={c.name}
                className={`px-5 py-4 text-left border-b border-r border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] last:border-r-0 ${
                  c.highlight ? "bg-[oklch(0.25_0.08_250)]" : "bg-[oklch(0.96_0.01_230)] dark:bg-[oklch(0.15_0.01_240)]"
                }`}
              >
                <p
                  className={`font-heading font-bold text-2xl ${
                    c.highlight ? "text-white" : "text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)]"
                  }`}
                >
                  {c.name}
                </p>
                <p
                  className={`text-xs ${
                    c.highlight ? "text-[oklch(0.75_0.04_220)]" : "text-[oklch(0.6_0.01_230)]"
                  }`}
                >
                  {c.sub}
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-[oklch(0.14_0.01_240)]" : "bg-[oklch(0.985_0.005_230)] dark:bg-[oklch(0.11_0.01_240)]"}>
              <td className="px-5 py-3.5 text-xs font-semibold text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] uppercase tracking-widest border-r border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)]">
                {row.label}
              </td>
              <td className="px-5 py-3.5 text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)] border-r border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)]">
                {row.h1}
              </td>
              <td className="px-5 py-3.5 text-[oklch(0.3_0.01_240)] dark:text-[oklch(0.85_0.01_230)] font-medium border-r border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)]">
                {row.h2}
              </td>
              <td className="px-5 py-3.5 text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)]">{row.h3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Ask the right questions checklist ───────────────────────────────────────
function TutorChecklist() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const questions = [
    "Do you know the updated 70-point UAS system?",
    "Can you show me your students' grade improvements?",
    "Do you have notes aligned to the current SEAB syllabus?",
    "How do you handle students who failed Promos?",
    "What is your approach to GP comprehension vs essays?",
    "Do you do timed mock papers under exam conditions?",
    "How do you track progress between sessions?",
  ];

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <div className="bg-white dark:bg-[oklch(0.14_0.01_240)] border border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] rounded-2xl p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] mb-1">
        Before hiring any JC tutor
      </p>
      <h4 className="font-heading font-bold text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] text-xl mb-5">
        7 questions to ask
      </h4>
      <div className="space-y-2.5">
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="w-full flex items-start gap-3 text-left group"
            aria-pressed={checked.has(i)}
          >
            <div
              className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                checked.has(i)
                  ? "bg-[oklch(0.45_0.18_145)] border-[oklch(0.45_0.18_145)]"
                  : "border-[oklch(0.80_0.02_230)] group-hover:border-[oklch(0.65_0.05_250)]"
              }`}
            >
              {checked.has(i) && (
                <CheckCircle2 size={12} className="text-white" strokeWidth={3} />
              )}
            </div>
            <span
              className={`text-sm leading-relaxed transition-colors ${
                checked.has(i)
                  ? "line-through text-[oklch(0.65_0.01_230)]"
                  : "text-[oklch(0.3_0.01_240)] dark:text-[oklch(0.85_0.01_230)]"
              }`}
            >
              {q}
            </span>
          </button>
        ))}
      </div>
      <p className="text-xs text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] mt-5 pt-4 border-t border-[oklch(0.92_0.01_230)] dark:border-[oklch(0.20_0.01_240)]">
        A good tutor answers yes to all seven. We answer yes to all seven.
      </p>
    </div>
  );
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const JC_FAQS = [
  {
    q: "What is the new A-Level UAS scoring system?",
    a: "The University Admissions Score (UAS) is now out of 70 points: your best 3 H2 subjects (20 points each = 60 total) plus H1 General Paper (10 points). Your 4th subject or MTL is only counted if it improves your score. Project Work is Pass/Fail. The old 90-point Rank Point system no longer applies.",
  },
  {
    q: "How many rank points do I need for NUS Medicine or Law?",
    a: "NUS Medicine typically requires 68–70 UAS. NUS Law requires approximately 65–68. These are baseline scores, where portfolio, interview, and BMAT results also factor in. These cutoffs shift year to year based on cohort performance.",
  },
  {
    q: "Is online JC tuition as effective as physical?",
    a: "Yes, when the tutor uses proper digital tools, including annotatable whiteboards, real-time workings, and screen sharing for graph sketching. For H2 Math and Chemistry in particular, the online whiteboard is often more effective than a physical worksheet because the tutor can annotate your own working in real time.",
  },
  {
    q: "When should I start JC tuition: JC1 or JC2?",
    a: "JC1 is strongly recommended. The O-Level to A-Level conceptual shift is significant. Students who wait until JC2 have already internalised incorrect habits and approaches. Starting early allows the right analytical frameworks to be built from the ground up, before exams structure becomes fixed.",
  },
  {
    q: "What is the difference between H1 and H2 subjects?",
    a: "H2 subjects are full-depth A-Level subjects worth up to 20 UAS points each. H1 covers a reduced syllabus at lower depth, worth up to 10 points. Most students take 3 H2 subjects, H1 General Paper, H1 Mother Tongue, and H1 Project Work.",
  },
  {
    q: "What if I failed my Promos?",
    a: "It is more common than most students realise. Failing Promos triggers a review, where some students are retained in JC1 to resit, while others are counselled toward alternative paths. If retained: use the extra year deliberately. Students who diagnose exactly what failed and address it systematically regularly come back to score As at A-Levels. It is recoverable.",
  },
  {
    q: "Do you offer crash courses before Prelims?",
    a: "Yes. We offer structured crash courses targeting the highest-impact topics per subject, run as timed practice under exam conditions. We recommend starting no later than July for Prelims in September. The later you start, the less we can do.",
  },
  {
    q: "Why do strong O-Level students suddenly struggle in JC?",
    a: "O-Levels reward memory and reproduction. A-Levels reward analysis and application to unfamiliar situations. Students who used sheer memory to succeed at O-Levels hit a wall in JC1 because that strategy does not transfer. The shift requires building new thinking habits, not just working harder.",
  },
];

// ─── Floating Doodles Component (pure CSS — no JS animation overhead) ────────
interface DoodleProps {
  icon: React.ReactNode;
  top: string;
  left: string;
  color: string;
  duration?: number;
  delay?: number;
}

function FloatingDoodle({
  icon,
  top,
  left,
  color,
  duration = 5,
  delay = 0,
}: DoodleProps) {
  return (
    <span
      className="absolute pointer-events-none select-none z-0 flex items-center justify-center jc-float-doodle"
      style={{
        top,
        left,
        color,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    >
      {icon}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function JCSingaporePageClient() {
  const [isDark, setIsDark] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="bg-[oklch(0.25_0.08_250)] text-white overflow-hidden relative">
        {/* Background glow for the cutout */}
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-16 pb-16">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div
              className="lg:col-span-6 jc-hero-text-enter"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.75_0.04_220)] mb-4">
                Singapore JC &amp; A-Level Guide 2026
              </p>
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] max-w-4xl">
                Everything About JC in Singapore.{" "}
                <span className="text-[oklch(0.82_0.06_220)]">
                  Explained Clearly.
                </span>
              </h1>
              <p className="mt-5 text-[oklch(0.82_0.04_220)] text-lg max-w-2xl leading-relaxed">
                The UAS calculator, H2 subject deep dives, exam timeline, and
                subject combination guide Singapore JC students actually use.
              </p>

              {/* Trust stat */}
              <div className="mt-6 inline-flex items-center gap-2 bg-[oklch(0.35_0.1_250)] rounded-xl px-4 py-2.5 text-sm">
                <Users size={15} className="text-[oklch(0.75_0.04_220)]" />
                <span className="text-[oklch(0.88_0.03_220)]">
                  Used by students across RI, HCI, VJC, ACJC and more
                </span>
              </div>

              {/* Jump links */}
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#uas-calculator"
                  className="inline-flex items-center gap-2 bg-white text-[oklch(0.25_0.08_250)] text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[oklch(0.93_0.01_230)] transition-colors shadow-lg"
                >
                  <Calculator size={15} />
                  Calculate my UAS
                </a>
                <a
                  href="#subject-combo"
                  className="inline-flex items-center gap-2 bg-[oklch(0.35_0.1_250)] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[oklch(0.4_0.12_250)] transition-colors"
                >
                  Subject combo guide
                  <ArrowRight size={15} />
                </a>
                <a
                  href="#free-trial"
                  className="inline-flex items-center gap-2 text-[oklch(0.75_0.04_220)] text-sm font-semibold px-3 py-2.5 hover:text-white transition-colors"
                >
                  Free diagnostic test →
                </a>
              </div>
            </div>

            <div 
              className="lg:col-span-6 flex justify-center items-end relative jc-hero-image-enter"
            >
              <div className="relative w-full max-w-[650px] h-[690px] lg:h-[770px] flex items-end">
                {/* Decorative circular element behind cutout */}
                <div className="absolute inset-0 m-auto w-[520px] h-[520px] rounded-full bg-linear-to-tr from-primary/30 to-sapphire/10 border border-white/10 dark:border-white/5 animate-pulse" style={{ animationDuration: "4s" }} />
                
                {/* Academic Floating Doodles */}
                <FloatingDoodle
                  icon={<GraduationCap size={24} />}
                  top="8%"
                  left="8%"
                  color="oklch(0.75 0.1 220)"
                  duration={6}
                  delay={0.5}
                />
                <FloatingDoodle
                  icon={<span className="font-heading font-bold text-xl">✦</span>}
                  top="25%"
                  left="88%"
                  color="oklch(0.85 0.15 90)"
                  duration={5}
                  delay={1.2}
                />
                <FloatingDoodle
                  icon={<span className="font-serif italic font-bold text-2xl">∫</span>}
                  top="68%"
                  left="5%"
                  color="oklch(0.65 0.15 250)"
                  duration={7}
                  delay={0.2}
                />
                <FloatingDoodle
                  icon={<span className="font-sans font-bold text-lg">Σ</span>}
                  top="78%"
                  left="80%"
                  color="oklch(0.7 0.12 300)"
                  duration={6.5}
                  delay={1.8}
                />
                <FloatingDoodle
                  icon={<Brain size={20} />}
                  top="45%"
                  left="92%"
                  color="oklch(0.8 0.1 330)"
                  duration={5.5}
                  delay={0.8}
                />
                <FloatingDoodle
                  icon={<span className="font-heading font-bold text-base">✦</span>}
                  top="72%"
                  left="12%"
                  color="oklch(0.88 0.05 220)"
                  duration={4.8}
                  delay={2.1}
                />
                <FloatingDoodle
                  icon={<span className="font-serif italic text-lg font-bold">π</span>}
                  top="12%"
                  left="82%"
                  color="oklch(0.75 0.15 150)"
                  duration={6.2}
                  delay={1.5}
                />
                <FloatingDoodle
                  icon={<Target size={18} />}
                  top="52%"
                  left="2%"
                  color="oklch(0.75 0.15 20)"
                  duration={5.8}
                  delay={0.4}
                />

                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/v1779800130/High-achieving_Singapore_JC_student_in_202605261824-Photoroom_vy0ywh.png"
                  alt="High-achieving Singapore JC Student"
                  width={650}
                  height={770}
                  priority
                  fetchPriority="high"
                  className="w-full h-auto max-h-[100%] object-contain z-10 drop-shadow-[0_20px_50px_rgba(59,130,246,0.3)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Anchor nav ─────────────────────────────────────────────────────── */}
      <AnchorNav />

      {/* ── What is JC ─────────────────────────────────────────────────────── */}
      <Section id="what-is-jc">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <SectionLabel>Section 1: Foundations</SectionLabel>
            <SectionHeading>What is JC?</SectionHeading>
            <div className="mt-5 space-y-4 text-[oklch(0.4_0.01_230)] dark:text-[oklch(0.75_0.01_230)] leading-relaxed text-[15px]">
              <p>
                Junior College (JC) is a 2-year pre-university programme in
                Singapore. Students typically enter after O-Levels at around 17.
                It ends with the A-Level examinations set by SEAB, which
                determine university admission through the UAS score.
              </p>
              <p>
                JC is not the only post-secondary path. Polytechnics and the IB
                Diploma are real alternatives with different strengths. The
                comparison table on the right is honest about the tradeoffs.
              </p>
              <p>
                The O-Level to JC jump is genuinely difficult. It is not
                difficulty of content, it is difficulty of thinking style.
                Students who scored A1s at O-Level using memory-based study find
                themselves scoring Us in JC1 because A-Levels test something
                fundamentally different.
              </p>
              <p>
                That is not a failure of the student. It is a mismatch of
                strategy. The fix is learnable.
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 w-full overflow-x-auto lg:overflow-x-visible">
            <PathwayComparison />
          </div>
        </div>

        {/* Brain shift explainer */}
        <div className="mt-14">
          <div className="mb-6">
            <SectionLabel>The shift nobody explains clearly enough</SectionLabel>
            <h3 className="font-heading font-bold text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] text-2xl">
              O-Level thinking vs A-Level thinking
            </h3>
            <p className="text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)] mt-2 text-sm max-w-xl">
              This table explains why top O-Level students suddenly score Us in
              JC1. Screenshot it. Share it with your parents.
            </p>
          </div>
          <BrainShift />
        </div>
      </Section>

      <div className="border-t border-[oklch(0.92_0.01_230)] dark:border-[oklch(0.20_0.01_240)]" />

      {/* ── A-Level system ─────────────────────────────────────────────────── */}
      <Section id="a-level-system">
        <SectionLabel>Section 2: The System</SectionLabel>
        <SectionHeading>The A-Level Subject System, Explained</SectionHeading>
        <p className="text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)] mt-3 mb-8 max-w-2xl text-[15px] leading-relaxed">
          H1, H2, H3: most students pick subjects without fully understanding
          how they interact with the UAS score. This table fixes that.
        </p>
        <SubjectLevelTable />

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <UASBreakdownVisual />
          <div className="space-y-4">
            <div>
              <h3 className="font-heading font-bold text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] text-xl mb-3">
                The compulsory subjects
              </h3>
              {[
                {
                  name: "General Paper (H1)",
                  desc: "Essays + comprehension. Tests analysis, argument, and awareness of global issues. 14% of your UAS. Underestimated by almost every student.",
                },
                {
                  name: "Project Work (H1)",
                  desc: "Group research project. Graded Pass/Fail only: does not count toward UAS. Still compulsory.",
                },
                {
                  name: "Mother Tongue Language (H1)",
                  desc: "Counts toward UAS only if it raises your score. Most students' MTL grade does contribute positively.",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="border-b border-[oklch(0.92_0.01_230)] dark:border-[oklch(0.20_0.01_240)] py-3.5 last:border-0"
                >
                  <p className="font-semibold text-sm text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)]">
                    {s.name}
                  </p>
                  <p className="text-sm text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)] mt-1 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Compulsory subjects image */}
            <div className="w-full h-56 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-white/10 p-4 relative overflow-visible mt-4 group">
              <div className="absolute inset-0 bg-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
              
              {/* Subject Textbooks Doodles */}
              <FloatingDoodle
                icon={<BookOpen size={20} />}
                top="-8%"
                left="12%"
                color="oklch(0.6 0.15 250)"
                duration={5.2}
                delay={0.3}
              />
              <FloatingDoodle
                icon={<span className="font-heading font-bold text-lg">✦</span>}
                top="18%"
                left="92%"
                color="oklch(0.7 0.15 90)"
                duration={4.8}
                delay={1.1}
              />
              <FloatingDoodle
                icon={<FlaskConical size={20} />}
                top="72%"
                left="-5%"
                color="oklch(0.55 0.15 300)"
                duration={6.4}
                delay={0.6}
              />
              <FloatingDoodle
                icon={<span className="font-serif italic text-xl font-bold">θ</span>}
                top="58%"
                left="95%"
                color="oklch(0.65 0.12 180)"
                duration={5.6}
                delay={1.5}
              />
              <FloatingDoodle
                icon={<span className="font-sans text-xl">∞</span>}
                top="-12%"
                left="78%"
                color="oklch(0.5 0.12 250)"
                duration={6.2}
                delay={0.8}
              />
              <FloatingDoodle
                icon={<span className="font-sans text-lg font-bold">±</span>}
                top="88%"
                left="32%"
                color="oklch(0.6 0.1 220)"
                duration={4.5}
                delay={2.0}
              />
              <FloatingDoodle
                icon={<Clock size={18} />}
                top="38%"
                left="-8%"
                color="oklch(0.65 0.12 20)"
                duration={5.8}
                delay={1.4}
              />

              <img 
                src="https://res.cloudinary.com/de8vvmpip/image/upload/v1779800329/A_high-end__minimalist_studio_photograph_202605261828-Photoroom_drnffs.png" 
                alt="A-Level study textbooks stack" 
                className="w-full h-full object-contain max-h-[190px] filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 group-hover:scale-105 z-10"
              />
            </div>
          </div>
        </div>
      </Section>

      <div className="border-t border-[oklch(0.92_0.01_230)] dark:border-[oklch(0.20_0.01_240)]" />

      {/* ── UAS Calculator ─────────────────────────────────────────────────── */}
      <Section id="uas-calculator">
        <SectionLabel>Section 3: The Calculator</SectionLabel>
        <SectionHeading className="mb-3">
          70-Point UAS Calculator
        </SectionHeading>
        <p className="text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)] mb-8 max-w-2xl text-[15px] leading-relaxed">
          Most students still think in the old 90-point Rank Point system. This
          calculator uses the current SEAB UAS scoring. Enter your grades and
          see exactly where you stand.
        </p>
        <UASCalculator />
      </Section>

      <div className="border-t border-[oklch(0.92_0.01_230)] dark:border-[oklch(0.20_0.01_240)]" />

      {/* ── Subject deep dives ──────────────────────────────────────────────── */}
      <Section id="subject-guides">
        <SectionLabel>Section 4: Subject Guides</SectionLabel>
        <SectionHeading className="mb-3">H2 Subject Deep Dives</SectionHeading>
        <p className="text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)] mb-6 max-w-2xl text-[15px] leading-relaxed">
          One honest guide per subject. Where marks are actually lost. What
          examiners actually want. Exam technique that moves grades.
        </p>

        {/* Difficulty matrix */}
        <div className="mb-8">
          <DifficultyMatrix />
        </div>

        <SubjectDeepDives />

        {/* Lose marks cards quick summary */}
        <div className="mt-10">
          <h3 className="font-heading font-bold text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] text-xl mb-5">
            At a glance: where students drop marks
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                subject: "H2 Math",
                losses: ["No domain/range stated", "Incomplete vector proof", "Wrong integration bounds"],
                color: "oklch(0.45 0.18 250)",
              },
              {
                subject: "H2 Chemistry",
                losses: ["Missing state symbols", "Wrong conditions in organic reactions", "Incomplete ionic equations"],
                color: "oklch(0.5 0.2 25)",
              },
              {
                subject: "General Paper",
                losses: ["Narrating not analysing", "No counter-argument", "Weak thesis statement"],
                color: "oklch(0.5 0.15 300)",
              },
              {
                subject: "H2 Economics",
                losses: ["Diagram without explanation", "One-sided analysis", "Missing real-world example"],
                color: "oklch(0.45 0.15 145)",
              },
            ].map((s) => (
              <div
                key={s.subject}
                className="bg-white dark:bg-[oklch(0.14_0.01_240)] border border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] rounded-xl p-4"
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: s.color }}
                >
                  {s.subject}
                </p>
                <ul className="space-y-1.5">
                  {s.losses.map((l, i) => (
                    <li
                      key={i}
                      className="text-xs text-[oklch(0.4_0.01_230)] dark:text-[oklch(0.75_0.01_230)] flex gap-1.5"
                    >
                      <span className="text-[oklch(0.65_0.01_230)]">-</span>
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div className="border-t border-[oklch(0.92_0.01_230)] dark:border-[oklch(0.20_0.01_240)]" />

      {/* ── Exam timeline ───────────────────────────────────────────────────── */}
      <Section id="exam-timeline">
        <SectionLabel>Section 5: The Calendar</SectionLabel>
        <SectionHeading className="mb-3">JC2 Exam Timeline 2026</SectionHeading>
        <p className="text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)] mb-6 max-w-2xl text-[15px] leading-relaxed">
          Plan tuition support before crunch points, not during them. Every
          phase annotated with what matters, what is commonly misunderstood, and
          what to do.
        </p>
        <ExamTimeline />

        {/* Shock curve */}
        <div className="mt-10">
          <ShockCurve />
        </div>
      </Section>

      <div className="border-t border-[oklch(0.92_0.01_230)] dark:border-[oklch(0.20_0.01_240)]" />

      {/* ── Subject combination ─────────────────────────────────────────────── */}
      <Section id="subject-combo">
        <SectionLabel>Section 6: Subject Combinations</SectionLabel>
        <SectionHeading className="mb-3">
          Which Subjects Should You Take?
        </SectionHeading>
        <p className="text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)] mb-8 max-w-2xl text-[15px] leading-relaxed">
          Every March and April, when O-Level results release, students and
          parents panic about subject combinations. This decision tree gives you
          a personalised recommendation in three questions.
        </p>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <DecisionTree />
          <div className="space-y-4">
            <div className="bg-white dark:bg-[oklch(0.14_0.01_240)] border border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] rounded-2xl p-6">
              <h4 className="font-heading font-bold text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] text-lg mb-4">
                Common combination regrets
              </h4>
              <div className="space-y-4">
                {[
                  {
                    mistake: "Taking H2 Bio + H2 Chem + H2 Phys",
                    fix: "Triple science is a brutal content load unless you are gunning for Medicine. Most engineering courses only need Math + Phys. The freed time is worth more than the third science.",
                  },
                  {
                    mistake: "Ignoring GP until JC2",
                    fix: "GP is 14% of your UAS. Students who leave it until JC2 are leaving a guaranteed mark loss on the table. Start GP essays in JC1.",
                  },
                  {
                    mistake: "Taking H2 Econ because it sounds easier",
                    fix: "H2 Economics requires a completely different analytical writing style from Science. Students who took it because it 'sounded manageable' often struggle more than their science counterparts.",
                  },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="text-sm border-b border-[oklch(0.92_0.01_230)] dark:border-[oklch(0.20_0.01_240)] pb-4 last:border-0 last:pb-0"
                  >
                    <p className="font-semibold text-[oklch(0.5_0.15_25)] mb-1">
                      Mistake: {r.mistake}
                    </p>
                    <p className="text-[oklch(0.45_0.01_230)] dark:text-[oklch(0.70_0.01_230)] leading-relaxed">
                      {r.fix}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject combinations flowchart image */}
            <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 group">
              <img 
                src="https://res.cloudinary.com/de8vvmpip/image/upload/v1779800682/A_high-resolution__minimalist_close-up_shot_202605261834_bsefp3.jpg" 
                alt="JC subject combination close-up shot" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </Section>

      <div className="border-t border-[oklch(0.92_0.01_230)] dark:border-[oklch(0.20_0.01_240)]" />

      {/* ── Survival playbook ───────────────────────────────────────────────── */}
      <Section id="playbook">
        <SectionLabel>Section 7: The Playbook</SectionLabel>
        <SectionHeading className="mb-3">
          The JC Survival Playbook
        </SectionHeading>
        <p className="text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)] mb-8 max-w-2xl text-[15px] leading-relaxed">
          Articles worth bookmarking. Written for students who already know the
          stakes.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              title: "Why Top O-Level Students Get U Grades in JC1",
              desc: "The most relatable thing we have written. The answer is not effort; it is strategy.",
              tag: "Most read",
              tagColor: "oklch(0.5 0.2 25)",
              tagBg: "oklch(0.97 0.04 25)",
            },
            {
              title: "How to Study for H2 Math (Not Just Practice Papers)",
              desc: "Practice papers without conceptual understanding is the most common mistake JC2 students make.",
              tag: "H2 Math",
              tagColor: "oklch(0.45 0.18 250)",
              tagBg: "oklch(0.96 0.03 250)",
            },
            {
              title: "GP in 2026: What Examiners Actually Want",
              desc: "An A-Level GP marker explains exactly how answers are evaluated. This is not generic advice.",
              tag: "General Paper",
              tagColor: "oklch(0.5 0.15 300)",
              tagBg: "oklch(0.97 0.02 300)",
            },
            {
              title: "Promos Survival Guide: 4 Weeks Out",
              desc: "What to do in the month before Promotional Exams. Priority order, topic triage, time allocation.",
              tag: "JC1 Promos",
              tagColor: "oklch(0.45 0.18 145)",
              tagBg: "oklch(0.96 0.04 145)",
            },
            {
              title: "The 70-Point UAS: Which Courses Need What Score",
              desc: "Cutoffs for NUS, NTU, and SMU popular courses with the new UAS system. Updated for 2026.",
              tag: "UAS / Results",
              tagColor: "oklch(0.5 0.15 70)",
              tagBg: "oklch(0.97 0.04 70)",
            },
            {
              title: "JC Tuition: Is It Actually Necessary? Honest Answer.",
              desc: "We will tell you when it is not necessary. We will also tell you when waiting is the mistake.",
              tag: "Honest take",
              tagColor: "oklch(0.55 0.01 230)",
              tagBg: "oklch(0.96 0.01 230)",
            },
          ].map((a, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[oklch(0.14_0.01_240)] border border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] rounded-xl p-5 hover:shadow-sm transition-shadow group cursor-pointer jc-card-enter"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <span
                className="inline-block text-xs font-semibold rounded-full px-2.5 py-1 mb-3"
                style={{ color: isDark ? "oklch(0.82 0.08 230)" : a.tagColor, background: isDark ? "oklch(0.22 0.04 240)" : a.tagBg }}
              >
                {a.tag}
              </span>
              <h4 className="font-heading font-bold text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] text-base leading-snug mb-2 group-hover:text-[oklch(0.35_0.12_250)] transition-colors">
                {a.title}
              </h4>
              <p className="text-sm text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)] leading-relaxed">
                {a.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <div className="border-t border-[oklch(0.92_0.01_230)] dark:border-[oklch(0.20_0.01_240)]" />

      {/* ── Resources ──────────────────────────────────────────────────────── */}
      <Section id="resources">
        <SectionLabel>Section 8: Free Resources</SectionLabel>
        <SectionHeading className="mb-3">Resources Hub</SectionHeading>
        <p className="text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)] mb-8 max-w-2xl text-[15px] leading-relaxed">
          Free to use. Some require an email: the tradeoff is transparent and
          the resource is worth it.
        </p>
        <ResourcesHub />
      </Section>

      <div className="border-t border-[oklch(0.92_0.01_230)] dark:border-[oklch(0.20_0.01_240)]" />

      {/* ── Student stories ─────────────────────────────────────────────────── */}
      <Section id="stories">
        <SectionLabel>Section 9: Real Results</SectionLabel>
        <SectionHeading className="mb-3">Student Stories</SectionHeading>
        <p className="text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)] mb-8 max-w-2xl text-[15px] leading-relaxed">
          Grade improvements with the specific thing that changed. No fake
          testimonials. One real story outweighs ten generic five-stars.
        </p>
        <StudentStories />
      </Section>

      <div className="border-t border-[oklch(0.92_0.01_230)] dark:border-[oklch(0.20_0.01_240)]" />

      {/* ── Ask the right questions ─────────────────────────────────────────── */}
      <Section id="tutor-checklist">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <TutorChecklist />
          <div>
            <SectionLabel>Before you hire anyone</SectionLabel>
            <h3 className="font-heading font-bold text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] text-2xl mb-4">
              Why these 7 questions matter
            </h3>
            <div className="space-y-4 text-sm text-[oklch(0.4_0.01_230)] dark:text-[oklch(0.75_0.01_230)] leading-relaxed">
              <p>
                The JC tuition market is crowded. Most tutors teach the syllabus.
                Fewer tutors understand exactly how the marking scheme operates,
                how examiners award partial credit, and why specific student
                errors recur year after year.
              </p>
              <p>
                The checklist on the left is a filtering tool. A tutor who
                cannot answer yes to all seven is not wrong: they may simply not
                have the depth of exam-specific knowledge the A-Level paper
                requires.
              </p>
              <p>
                We answer yes to all seven. You can verify any of it.
              </p>
            </div>

            {/* Confident student cutout image */}
            <div className="w-full h-56 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-white/10 p-4 relative overflow-visible mt-6 group">
              <div className="absolute inset-0 bg-radial from-sapphire/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
              
              {/* Confident Student Doodles */}
              <FloatingDoodle
                icon={<span className="font-heading font-bold text-lg">✦</span>}
                top="-6%"
                left="82%"
                color="oklch(0.65 0.15 250)"
                duration={5.0}
                delay={0.2}
              />
              <FloatingDoodle
                icon={<Brain size={20} />}
                top="18%"
                left="-8%"
                color="oklch(0.6 0.15 300)"
                duration={5.8}
                delay={0.9}
              />
              <FloatingDoodle
                icon={<Target size={20} />}
                top="-12%"
                left="18%"
                color="oklch(0.6 0.15 20)"
                duration={6.2}
                delay={0.4}
              />
              <FloatingDoodle
                icon={<span className="font-heading font-bold text-base">✦</span>}
                top="78%"
                left="-6%"
                color="oklch(0.7 0.12 90)"
                duration={4.6}
                delay={1.3}
              />
              <FloatingDoodle
                icon={<GraduationCap size={22} />}
                top="42%"
                left="95%"
                color="oklch(0.55 0.15 220)"
                duration={5.4}
                delay={0.7}
              />
              <FloatingDoodle
                icon={<span className="font-serif italic text-2xl font-bold">∫</span>}
                top="82%"
                left="88%"
                color="oklch(0.5 0.15 250)"
                duration={6.5}
                delay={1.6}
              />
              <FloatingDoodle
                icon={<CheckCircle2 size={18} />}
                top="2%"
                left="98%"
                color="oklch(0.6 0.15 150)"
                duration={5.2}
                delay={1.1}
              />

              <img 
                src="https://res.cloudinary.com/de8vvmpip/image/upload/v1779801129/Confident_Singapore_junior_college_student_202605261841-Photoroom_g5xsdf.png" 
                alt="Confident Singapore Junior College Student" 
                className="w-full h-full object-contain max-h-[210px] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)] transition-transform duration-300 group-hover:scale-105 z-10"
              />
            </div>
          </div>
        </div>
      </Section>

      <div className="border-t border-[oklch(0.92_0.01_230)] dark:border-[oklch(0.20_0.01_240)]" />

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <Section id="faq">
        <SectionLabel>Section 10: FAQ</SectionLabel>
        <SectionHeading className="mb-3">Common Questions</SectionHeading>
        <p className="text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)] mb-8 max-w-2xl text-[15px] leading-relaxed">
          Answered directly. No hedging.
        </p>
        <SubjectFAQ
          items={JC_FAQS}
          title=""
          description=""
        />
      </Section>

      <div className="border-t border-[oklch(0.92_0.01_230)] dark:border-[oklch(0.20_0.01_240)]" />

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <section
        id="free-trial"
        className="scroll-mt-16 bg-[oklch(0.25_0.08_250)] text-white py-20 px-4 md:px-8"
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.75_0.04_220)] mb-4 text-center">
            If the page has been useful, the next step is easy
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-center max-w-2xl mx-auto leading-tight mb-12">
            Three ways to get started. No commitment required.
          </h2>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: <Zap size={22} />,
                title: "Free diagnostic test",
                desc: "10 minutes. Identifies your specific weak topics by subject. No tutor call. Just clarity.",
                cta: "Take the diagnostic",
                href: "/contact?subject=diagnostic",
                primary: true,
              },
              {
                icon: <BookOpen size={22} />,
                title: "Free trial lesson",
                desc: "One full session, no commitment. See if the approach actually works before you pay anything.",
                cta: "Book a free session",
                href: "/contact?subject=trial",
                primary: false,
              },
              {
                icon: <MessageCircle size={22} />,
                title: "Ask us anything",
                desc: "Subject combination questions, UAS score interpretation, Promos strategy. WhatsApp us directly.",
                cta: "Contact us",
                href: "/contact?subject=general",
                primary: false,
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 flex flex-col jc-card-enter ${
                  item.primary
                    ? "bg-white dark:bg-[oklch(0.14_0.01_240)] text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)]"
                    : "bg-[oklch(0.32_0.09_250)] text-white"
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                    item.primary
                      ? "bg-[oklch(0.96_0.04_250)] dark:bg-[oklch(0.14_0.04_250)] text-[oklch(0.45_0.18_250)]"
                      : "bg-[oklch(0.38_0.1_250)] text-[oklch(0.82_0.05_220)]"
                  }`}
                >
                  {item.icon}
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">
                  {item.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed flex-1 mb-5 ${
                    item.primary
                      ? "text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)]"
                      : "text-[oklch(0.78_0.04_220)]"
                  }`}
                >
                  {item.desc}
                </p>
                <Link
                  href={item.href}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
                    item.primary
                      ? "bg-[oklch(0.25_0.08_250)] text-white hover:bg-[oklch(0.3_0.1_250)]"
                      : "bg-[oklch(0.38_0.1_250)] text-white hover:bg-[oklch(0.42_0.12_250)]"
                  }`}
                >
                  {item.cta}
                  <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StickyCTA />
    </>
  );
}
