"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Scale, Layers, GraduationCap,
  BookOpen, CheckCircle2, Calculator, PenLine,
  Microscope, Globe, ChevronDown, TrendingUp, Target, Brain
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";
import StickyCTA from "../../components/subjects/StickyCTA";
import Image from "next/image";

const optimizeCloudinaryUrl = (url: string) => {
  if (url.includes("cloudinary.com") && !url.includes("f_auto")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  }
  return url;
};

const PLACEHOLDER_IMAGE =
  "https://res.cloudinary.com/de8vvmpip/image/upload/v1776668086/A_focused_one-on-one_202604201224_sairiv.jpg";

const GRADE_BANDS = [
  {
    label: "Elementary",
    range: "Grades K-5",
    ages: "Ages 5 to 11",
    accent: "indigo",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    subjects: [
      "Reading and Phonics",
      "Foundational Math",
      "Writing",
      "Science",
      "Social Studies",
    ],
    focus:
      "The fundamentals built in elementary school determine the trajectory in middle school. Number sense, reading fluency, and consistent study habits are not easy to rebuild once gaps form.",
    challenges: [
      "Reading gaps that widen sharply by 4th grade if unaddressed",
      "Fraction and multiplication fluency before entering middle school",
      "Shifting from learning to read to reading to learn",
    ],
  },
  {
    label: "Middle School",
    range: "Grades 6-8",
    ages: "Ages 11 to 14",
    accent: "violet",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    subjects: [
      "Pre-Algebra and Algebra I",
      "ELA and Essay Writing",
      "Life Science and Earth Science",
      "US History and Geography",
      "Foreign Language",
    ],
    focus:
      "The transition to middle school is where most academic gaps begin to damage GPA. Algebra I readiness, structured essay writing, and managing multiple teachers for the first time are the key pressure points.",
    challenges: [
      "Algebra I readiness before high school",
      "Writing longer, structured essays with evidence",
      "Managing assignments across 6 or 7 different classes simultaneously",
    ],
  },
  {
    label: "High School",
    range: "Grades 9-12",
    ages: "Ages 14 to 18",
    accent: "fuchsia",
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-500/10",
    subjects: [
      "Algebra II, Pre-Calculus, AP Calculus",
      "AP English Language and Literature",
      "Biology, Chemistry, Physics, AP Sciences",
      "US History, Government, AP Social Studies",
      "SAT and ACT Preparation",
    ],
    focus:
      "Every grade in high school goes on the permanent transcript sent to colleges. Course rigor, GPA consistency, and standardized test scores interact directly. This is where tutoring has the highest return on investment.",
    challenges: [
      "Managing AP course load without GPA suffering",
      "Recovering from a weak freshman year",
      "Choosing the right course sequence to signal rigor to admissions officers",
    ],
  },
];

const CORE_SUBJECTS = [
  {
    Icon: Calculator,
    name: "Mathematics",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    desc: "From fractions in 4th grade through AP Calculus BC. We match each student to exactly where they are in the learning progression and build forward systematically.",
    tracks: [
      "Elementary Math",
      "Pre-Algebra",
      "Algebra I and II",
      "Geometry",
      "Pre-Calculus",
      "AP Calculus AB and BC",
      "AP Statistics",
    ],
  },
  {
    Icon: PenLine,
    name: "English Language Arts",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    desc: "Reading comprehension, analytical writing, grammar, and literary analysis. We work from the specific texts and writing prompts students are assigned in class.",
    tracks: [
      "Phonics and Fluency (K-3)",
      "Reading Comprehension",
      "Essay Structure",
      "Literary Analysis",
      "AP Language and Composition",
      "AP Literature",
    ],
  },
  {
    Icon: Microscope,
    name: "Science",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    desc: "Conceptual understanding first, then problem-solving. We cover the exact labs and textbooks assigned in class, not generic content.",
    tracks: [
      "Earth and Life Science (Middle School)",
      "Biology",
      "Chemistry",
      "Physics",
      "AP Biology",
      "AP Chemistry",
      "AP Physics 1 and 2",
    ],
  },
  {
    Icon: Globe,
    name: "Social Studies",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    desc: "History, civics, geography, and economics. Heavy on document analysis and essay responses, which are the primary assessment format in most schools.",
    tracks: [
      "US History",
      "World History",
      "Government and Civics",
      "Economics",
      "AP US History",
      "AP World History",
      "AP Government",
    ],
  },
];

// ─── GPA Visual ────────────────────────────────────────────────────────────────
function GPAVisual() {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl border border-white/10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl" />

      <div className="w-full flex justify-between items-end mb-8 relative z-10">
        <div>
          <h4 className="text-white font-bold text-lg">What Builds Your Grade</h4>
          <p className="text-slate-400 text-sm">US system: every assignment counts</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Goal</div>
          <div className="text-2xl font-black text-white">4.0+</div>
        </div>
      </div>

      <div className="w-full space-y-5 z-10">
        <div className="flex items-center gap-4">
          <div className="w-28 text-xs font-bold text-slate-400 text-right uppercase tracking-wider shrink-0">
            Final Exam Only
          </div>
          <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden flex">
            <div className="w-[15%] bg-slate-600 border-r border-black" title="Other" />
            <div className="w-[85%] bg-rose-500" title="Final Exam" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-28 text-xs font-bold text-white text-right uppercase tracking-wider shrink-0">
            US Cumulative
          </div>
          <div className="flex-1 h-5 bg-slate-800 rounded-full overflow-hidden flex border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <motion.div
              className="w-[20%] bg-indigo-400 border-r border-black flex items-center justify-center text-[8px] font-bold text-black"
              initial={{ width: 0 }}
              whileInView={{ width: "20%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              HW
            </motion.div>
            <motion.div
              className="w-[20%] bg-indigo-500 border-r border-black flex items-center justify-center text-[8px] font-bold text-black"
              initial={{ width: 0 }}
              whileInView={{ width: "20%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Quiz
            </motion.div>
            <motion.div
              className="w-[30%] bg-fuchsia-500 border-r border-black flex items-center justify-center text-[8px] font-bold text-white"
              initial={{ width: 0 }}
              whileInView={{ width: "30%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Tests
            </motion.div>
            <motion.div
              className="w-[30%] bg-fuchsia-600 flex items-center justify-center text-[8px] font-bold text-white"
              initial={{ width: 0 }}
              whileInView={{ width: "30%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Finals
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white/5 border border-white/10 p-4 rounded-xl relative z-10 flex gap-4 items-start">
        <Scale size={20} className="text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-300 leading-relaxed">
          In the US system, homework, participation, quizzes, projects, and final
          exams all combine to form the cumulative GPA. Slacking off early in a
          semester is very difficult to recover from because the damage is already
          averaged in.
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function AmericanCurriculumPageClient() {
  const { user } = useAuthContext();
  const ctaHref = user ? "/bookings/new" : "/signup?type=assessment";
  const [openBand, setOpenBand] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white dark:bg-black selection:bg-indigo-500/20 selection:text-indigo-500">
      <StickyCTA />

      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-linear-to-bl from-indigo-500/10 via-fuchsia-500/5 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-linear-to-tr from-violet-500/5 to-transparent rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/de8vvmpip/image/upload/v1776706912/grid-pattern_qaz43.png')] opacity-[0.03] dark:opacity-[0.05]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-20">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] sm:text-xs font-black tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-8 uppercase backdrop-blur-md"
            >
              <GraduationCap size={14} />
              K-12 Academic Support
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl xl:text-[5.5rem] font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase leading-[0.9]"
            >
              Build the Grades <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-fuchsia-500">
                That Get You In.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-text-secondary mb-10 leading-relaxed font-medium max-w-2xl mx-auto"
            >
              From 3rd grade reading to AP Chemistry, our tutors work across every grade and subject to build the academic record that matters. Every assignment. Every semester. Every year.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                href={ctaHref}
                className="w-full sm:w-auto px-10 py-5 bg-deep-navy dark:bg-white text-white dark:text-black font-black rounded-3xl hover:scale-105 hover:shadow-2xl transition-all text-center flex items-center justify-center gap-3 group text-lg"
              >
                Book Academic Tutoring
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#subjects"
                className="w-full sm:w-auto px-10 py-5 bg-transparent text-deep-navy dark:text-white font-bold rounded-3xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-center text-lg border border-border"
              >
                See What We Cover
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm font-bold text-text-secondary uppercase tracking-widest"
            >
              <div className="flex items-center gap-2"><BookOpen size={16} className="text-indigo-500" /> Grades K-12</div>
              <div className="flex items-center gap-2"><Target size={16} className="text-fuchsia-500" /> All Core Subjects</div>
              <div className="flex items-center gap-2"><TrendingUp size={16} className="text-emerald-500" /> 1-on-1 Sessions</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. GPA Reality (Dark) ──────────────────────────────────────────── */}
      <section className="py-24 bg-deep-navy text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-4">
                01. The Mathematics of Admissions
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Every semester <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-blue-300">
                  is permanent.
                </span>
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                The high school transcript sent to colleges covers all four years: Grades 9 through 12. A weak freshman year lowers the cumulative GPA in a way that a strong senior year cannot fully undo. The math is unforgiving.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-1">
                    <Layers size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Weighted vs. Unweighted GPA</h4>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      An unweighted GPA caps at 4.0 and treats all classes equally. A weighted GPA uses a 5.0 scale for AP and Honors courses, rewarding academic rigor. Most colleges recalculate GPAs using their own formula, then separately assess how many of those classes were AP or Honors. Both the number and the rigor matter.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center shrink-0 mt-1">
                    <Brain size={20} className="text-fuchsia-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Continuous Assessment</h4>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      Unlike systems where a single end-of-year exam determines the grade, the US system accumulates performance across homework, quizzes, tests, projects, and finals throughout the entire semester. One bad stretch affects the whole average.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <GPAVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. Grade-Level Coverage ────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-black border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-4">
              02. From Kindergarten to Senior Year
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-4">
              We Meet Students Where They Are.
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Every grade band has its own pressure points, subject progressions, and common failure patterns. Our tutors know them.
            </p>
          </div>

          <div className="space-y-4">
            {GRADE_BANDS.map((band, i) => (
              <motion.div
                key={band.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-[#0f1117] rounded-3xl border border-border overflow-hidden"
              >
                <button
                  onClick={() => setOpenBand(openBand === i ? null : i)}
                  className="w-full flex items-center justify-between p-8 text-left"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl ${band.bg} flex items-center justify-center shrink-0`}>
                      <GraduationCap size={28} className={band.color} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-deep-navy dark:text-white">{band.label}</h3>
                      <p className="text-text-secondary text-sm font-medium">{band.range} &nbsp;·&nbsp; {band.ages}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-wrap gap-2">
                      {band.subjects.slice(0, 3).map((s) => (
                        <span key={s} className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-text-secondary border border-border">
                          {s}
                        </span>
                      ))}
                      {band.subjects.length > 3 && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-text-secondary border border-border">
                          +{band.subjects.length - 3} more
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-text-secondary transition-transform shrink-0 ${openBand === i ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {openBand === i && (
                  <div className="px-8 pb-8 grid md:grid-cols-2 gap-8 border-t border-border pt-8">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary mb-4">Subjects Covered</h4>
                      <ul className="space-y-2">
                        {band.subjects.map((s) => (
                          <li key={s} className="flex items-center gap-3 text-sm font-medium text-deep-navy dark:text-slate-300">
                            <CheckCircle2 size={16} className={band.color} />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary mb-3">What We Focus On</h4>
                        <p className="text-sm text-text-secondary leading-relaxed">{band.focus}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary mb-3">Common Pressure Points</h4>
                        <ul className="space-y-2">
                          {band.challenges.map((c) => (
                            <li key={c} className="flex items-start gap-3 text-sm text-deep-navy dark:text-slate-300">
                              <span className={`w-1.5 h-1.5 rounded-full ${band.color.replace("text-", "bg-")} shrink-0 mt-2`} />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Core Subjects ────────────────────────────────────────────────── */}
      <section id="subjects" className="py-24 bg-white dark:bg-black border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-600 dark:text-fuchsia-400 mb-4">
              03. Every Core Subject
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-4">
              Deep Coverage Across All Four Pillars.
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              We do not do surface-level review. Our tutors work from the specific textbooks, assignments, and tests students face in their own schools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {CORE_SUBJECTS.map((subject, i) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-slate-50 dark:bg-[#0f1117] rounded-3xl p-8 border border-border hover:shadow-xl hover:border-indigo-500/30 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${subject.bg} flex items-center justify-center mb-6`}>
                  <subject.Icon size={28} className={subject.color} />
                </div>
                <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-3">{subject.name}</h3>
                <p className="text-text-secondary leading-relaxed mb-6 text-sm">{subject.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {subject.tracks.map((track) => (
                    <span
                      key={track}
                      className="text-xs font-bold px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-border text-deep-navy dark:text-slate-300"
                    >
                      {track}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. How the System Works ─────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-[#08080f] border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-sapphire mb-4">
              04. Curriculum and Admissions
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-4">
              Understanding the Standards.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-[#0f1117] rounded-3xl p-10 border border-border hover:shadow-2xl hover:border-indigo-500/30 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8">
                <BookOpen size={32} className="text-indigo-500" />
              </div>
              <h3 className="text-3xl font-black text-deep-navy dark:text-white mb-4">
                Common Core State Standards
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                41 states plus DC have adopted Common Core standards for Math and English Language Arts. The standards emphasize conceptual understanding and evidence-based reasoning rather than rote memorization.
              </p>
              <ul className="space-y-3 text-sm font-medium text-deep-navy dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Math:</strong> Moves away from just solving for x toward explaining reasoning and modeling real-world problems.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>ELA:</strong> Focuses on evidence-based writing and analyzing complex non-fiction texts across all subjects, not just English class.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Note:</strong> Texas, Virginia, Alaska, and Nebraska use their own standards. We work with all state-specific standards.
                  </span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-[#0f1117] rounded-3xl p-10 border border-border hover:shadow-2xl hover:border-fuchsia-500/30 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center mb-8">
                <GraduationCap size={32} className="text-fuchsia-500" />
              </div>
              <h3 className="text-3xl font-black text-deep-navy dark:text-white mb-4">
                Holistic College Admissions
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                US college admissions evaluate the full picture: not just grades but course rigor, test scores, extracurriculars, and essays. Standardized tests are back at most elite schools.
              </p>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-border">
                  <h4 className="font-bold text-deep-navy dark:text-white mb-1">The 4 Admissions Pillars</h4>
                  <p className="text-xs text-text-secondary">
                    (1) GPA and course rigor, (2) SAT or ACT scores, (3) Extracurricular impact, (4) Personal essays. Weakness in one can be offset by strength in another, but GPA is the hardest to compensate for.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-border">
                  <h4 className="font-bold text-deep-navy dark:text-white mb-1">SAT and ACT Required Again</h4>
                  <p className="text-xs text-text-secondary">
                    Harvard, MIT, Yale, Brown, Dartmouth, Georgetown, Caltech, and the public university systems of Florida and Georgia have all reinstated SAT or ACT score requirements. The test-optional era is reversing at the top.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 6. Final CTA ──────────────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden bg-slate-900">
        <Image
          src={optimizeCloudinaryUrl(PLACEHOLDER_IMAGE)}
          alt="Student studying"
          fill
          className="object-cover opacity-20 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 p-12 md:p-16 rounded-[3rem] shadow-2xl"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
              Protect Your <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-400">
                Cumulative GPA.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              Do not wait until finals week. Our tutors provide ongoing weekly support to make sure every homework assignment, quiz, and project is working toward your best possible GPA from the first week of school.
            </p>

            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-black rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] text-lg group"
            >
              Get Academic Support
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
