"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Target, Award, Brain, 
  Calculator, Clock, Monitor, CheckCircle2, TrendingUp,
  ChevronRight, BarChart3, Zap, Lock
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

const PLACEHOLDER_IMAGE = "https://res.cloudinary.com/de8vvmpip/image/upload/v1776668086/A_focused_one-on-one_202604201224_sairiv.jpg";

// ─── Animations & Micro-Interactions ──────────────────────────────────────────
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

// ─── Visual Components ────────────────────────────────────────────────────────
function AdaptiveAlgorithmVisual() {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl border border-white/10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-sapphire/20 rounded-full blur-3xl" />
      
      <div className="flex justify-between items-end mb-6 relative z-10">
        <div>
          <h4 className="text-white font-bold text-lg">Your Score Trajectory</h4>
          <p className="text-slate-400 text-sm">How Module 1 dictates your ceiling</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-red-400 uppercase tracking-widest">Score Cap</div>
          <div className="text-2xl font-black text-white">650</div>
        </div>
      </div>

      {/* Graph Area */}
      <div className="relative h-48 w-full border-b border-l border-white/20 mt-8">
        {/* Module Dividers */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 border-dashed" />
        <div className="absolute left-1/4 -bottom-6 text-xs text-slate-500 font-bold tracking-widest">MODULE 1</div>
        <div className="absolute left-3/4 -bottom-6 text-xs text-slate-500 font-bold tracking-widest">MODULE 2</div>

        {/* Top Tier Ceiling (The Goal) */}
        <div className="absolute top-[10%] left-0 right-0 border-t border-emerald-500/30 border-dashed" />
        <div className="absolute top-[10%] -left-12 text-xs text-emerald-400 font-bold">800</div>

        {/* Penalty Ceiling (The Reality) */}
        <div className="absolute top-[40%] left-1/2 right-0 border-t-2 border-red-500/50" />
        
        {/* Animated Line - The Penalty Path */}
        <motion.svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
          <motion.path
            d="M 0 150 Q 50 140, 100 130 T 200 90 L 400 90" // Arbitrary curve capping out
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" as const }}
          />
          {/* Animated dot at the end */}
          <motion.circle
            cx="400" cy="90" r="5" fill="#ef4444"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5, duration: 0.3 }}
          />
        </motion.svg>
        
        {/* Lock Icon at ceiling */}
        <motion.div 
          className="absolute right-4 top-[32%] bg-red-500/20 p-1.5 rounded-full backdrop-blur-md border border-red-500/50"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.6 }}
        >
          <Lock size={14} className="text-red-400" />
        </motion.div>
      </div>

      <div className="mt-12 bg-white/5 border border-white/10 p-4 rounded-xl relative z-10 flex gap-4 items-start">
        <Target size={20} className="text-red-400 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-300 leading-relaxed">
          If you fall into the algorithm's trap and make early careless mistakes in Module 1, you are locked into the <strong>Easier Module 2</strong>. Even if you answer 100% correctly from there, a 1400+ is mathematically impossible.
        </p>
      </div>
    </div>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────────
const SAT_TOPICS = {
  math: [
    { name: "Linear Equations & Inequalities", desc: "Solving for variables, graphing lines, slope-intercept form, and working with inequality notation on the number line." },
    { name: "Systems of Equations", desc: "Solving two equations simultaneously using substitution, elimination, and Desmos graphing to find intersection points instantly." },
    { name: "Quadratics & Polynomials", desc: "Factoring, vertex form, completing the square, and finding roots graphically using Desmos." },
    { name: "Functions & Function Notation", desc: "f(x) notation, domain and range, transformations, and evaluating composite functions." },
    { name: "Ratios, Rates & Proportions", desc: "Unit conversions, proportional reasoning, and multi-step real-world scaling problems." },
    { name: "Percentages", desc: "Percent increase and decrease, percent of a value, and multi-step percent chain problems." },
    { name: "Data Analysis & Statistics", desc: "Mean, median, interpreting scatterplots, reading tables, and evaluating statistical claims." },
    { name: "Exponents & Exponential Growth", desc: "Exponent rules, exponential growth and decay models, and simplifying radical expressions." },
    { name: "Geometry & Measurement", desc: "Area, perimeter, volume, angle relationships, similar triangles, and coordinate geometry." },
    { name: "Trigonometry & Radians", desc: "SOH-CAH-TOA, converting between degrees and radians, and applying trig ratios to right triangles." },
  ],
  rw: [
    { name: "Information & Ideas", desc: "Finding textual evidence, drawing logical inferences, and interpreting quantitative data embedded in passages." },
    { name: "Craft & Structure", desc: "Analyzing author purpose, passage organization, Words in Context, and comparing two related texts." },
    { name: "Sentence Structure", desc: "Sentence boundaries, subordinate clauses, misplaced modifiers, and parallel structure." },
    { name: "Punctuation", desc: "Semicolons, colons, commas, and apostrophes used correctly in context. High-frequency and highly learnable." },
    { name: "Agreement & Form", desc: "Subject-verb agreement, pronoun-antecedent agreement, and maintaining consistent verb tense." },
    { name: "Expression of Ideas", desc: "Logical transitions between sentences, rhetorical synthesis, and determining which detail best supports a claim." },
  ]
};

export default function SATPrepPageClient() {
  const { user } = useAuthContext();
  const ctaHref = user ? "/bookings/new" : "/signup?type=assessment";
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const [activeTab, setActiveTab] = useState<'math' | 'rw'>('math');

  return (
    <main className="min-h-screen bg-white dark:bg-black selection:bg-sapphire/20 selection:text-sapphire">
      <StickyCTA />
      
      {/* ── 1. Epic Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[70vw] h-[70vw] bg-linear-to-bl from-sapphire/10 via-primary/5 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-linear-to-tr from-emerald-500/5 to-transparent rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/de8vvmpip/image/upload/v1776706912/grid-pattern_qaz43.png')] opacity-[0.03] dark:opacity-[0.05]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-20">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sapphire/10 border border-sapphire/20 text-[10px] sm:text-xs font-black tracking-[0.2em] text-sapphire mb-8 uppercase backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sapphire opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sapphire"></span>
              </span>
              Digital SAT Masterclass
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl xl:text-[5.5rem] font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase leading-[0.9]"
            >
              Hacking the <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary">Adaptive SAT</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-text-secondary mb-10 leading-relaxed font-medium max-w-2xl mx-auto"
            >
              Stop taking endless practice tests. Master the algorithm, exploit the Desmos calculator, and deploy 'Perfect Defense' pacing to break the 1400 barrier.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link href={ctaHref} className="w-full sm:w-auto px-10 py-5 bg-deep-navy dark:bg-white text-white dark:text-black font-black rounded-3xl hover:scale-105 hover:shadow-2xl transition-all text-center flex items-center justify-center gap-3 group text-lg">
                Book a Diagnostic
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#playbook" className="w-full sm:w-auto px-10 py-5 bg-transparent text-deep-navy dark:text-white font-bold rounded-3xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-center flex items-center justify-center gap-3 text-lg border border-border">
                Read the Playbook
              </a>
            </motion.div>

            {/* Trust Bar */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.8 }}
              className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm font-bold text-text-secondary uppercase tracking-widest"
            >
              <div className="flex items-center gap-2"><TrendingUp size={16} className="text-emerald-500" /> Avg +180 Pts</div>
              <div className="flex items-center gap-2"><Target size={16} className="text-primary" /> 1-on-1 Coaching</div>
              <div className="flex items-center gap-2"><Monitor size={16} className="text-indigo-500" /> Bluebook Native</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. The Algorithm Reality (Dark Section) ────────────────────────────────────────────── */}
      <section id="playbook" className="py-24 bg-deep-navy text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div variants={fadeInUp} className="text-xs font-black uppercase tracking-[0.2em] text-sapphire mb-4">
                01. The Module 2 Ceiling
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                The algorithm is <br/><span className="text-transparent bg-clip-text bg-linear-to-r from-red-400 to-orange-400">capping your score.</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-300 text-lg leading-relaxed mb-8">
                The Digital SAT is comprised of two modules. <strong>The difficulty of your second module is dictated entirely by your performance in the first.</strong> 
                Most students rush through Module 1 to bank time, making careless errors that trigger the algorithm's penalty.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0 mt-1">
                    <ShieldCheck size={20} className="text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">The "Perfect Defense" Strategy</h4>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      Do not rush. Double-check every single question in the first 15 minutes of Module 1. An early careless error on a simple algebra question mathematically prevents you from achieving a 1400+, no matter how well you do later.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <AdaptiveAlgorithmVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. High ROI & Bluebook (Cards) ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-black border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-sapphire mb-4">
              02. Tactical Execution
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6">
              Study Smart. Train Real.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Bluebook Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-[#0f1117] rounded-3xl p-10 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8">
                <Monitor size={32} className="text-indigo-500" />
              </div>
              <h3 className="text-3xl font-black text-deep-navy dark:text-white mb-4">Train Where You Fight</h3>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                Practicing on PDF printouts for a digital test is a massive disadvantage. You must build muscle memory inside the College Board's <strong>Bluebook app</strong>.
              </p>
              <ul className="space-y-3 mb-8 text-sm font-medium text-deep-navy dark:text-slate-300">
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-indigo-500" /> Master the built-in annotation highlighter</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-indigo-500" /> Exploit the Flagging system for pacing</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-indigo-500" /> Get used to on-screen eye fatigue</li>
              </ul>
            </motion.div>

            {/* High ROI Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-[#0f1117] rounded-3xl p-10 border border-border hover:shadow-2xl hover:border-emerald-500/30 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8">
                <BarChart3 size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-3xl font-black text-deep-navy dark:text-white mb-4">High-ROI Topics</h3>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                Stop studying everything. Focus intensely on the topics that yield the highest return on investment based on algorithmic frequency.
              </p>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-border">
                  <h4 className="font-bold text-deep-navy dark:text-white mb-1">Words in Context (Reading and Writing)</h4>
                  <p className="text-xs text-text-secondary">The single most common question type on the RW section. Roughly 10 to 11 questions per test, about one in five questions. Not vocabulary memorization. The answer is in the surrounding sentence.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-border">
                  <h4 className="font-bold text-deep-navy dark:text-white mb-1">Algebra and Functions (Math)</h4>
                  <p className="text-xs text-text-secondary">Linear equations, systems, and quadratic functions appear across both math modules. These are the foundation. Get them automatic before anything else.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4. Full Curriculum Coverage ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-black border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-sapphire mb-4">
              03. Full Curriculum
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-4">
              Every Topic Covered.
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              We cover the complete Digital SAT curriculum across both sections. No topic left unprepared.
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-slate-100 dark:bg-white/5 rounded-2xl p-1.5 gap-1">
              <button
                onClick={() => setActiveTab('math')}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'math'
                    ? 'bg-deep-navy dark:bg-white text-white dark:text-black shadow-md'
                    : 'text-text-secondary hover:text-deep-navy dark:hover:text-white'
                }`}
              >
                Math
              </button>
              <button
                onClick={() => setActiveTab('rw')}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'rw'
                    ? 'bg-deep-navy dark:bg-white text-white dark:text-black shadow-md'
                    : 'text-text-secondary hover:text-deep-navy dark:hover:text-white'
                }`}
              >
                Reading & Writing
              </button>
            </div>
          </div>

          {/* Topics Grid */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {SAT_TOPICS[activeTab].map((topic) => (
              <div
                key={topic.name}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border hover:border-sapphire/40 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-sapphire shrink-0" />
                  <h3 className="font-bold text-sm text-deep-navy dark:text-white leading-snug">{topic.name}</h3>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{topic.desc}</p>
              </div>
            ))}
          </motion.div>

          <p className="text-center text-xs text-text-secondary mt-8 font-medium">
            All topics are addressed based on your diagnostic results. Weaker areas get more time.
          </p>
        </div>
      </section>

      {/* ── 5. The Desmos Cheat Code ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            <motion.div 
              className="lg:col-span-5"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">
                04. The Ultimate Cheat Code
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 leading-tight">
                Exploiting the <br/>Desmos Calculator.
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                The Digital SAT embeds a Desmos graphing calculator directly into the interface. It is the most powerful tool on the test, yet most students use it as a crutch for basic arithmetic, wasting precious seconds.
              </p>

              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6">
                <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
                  <Award size={18} /> The 10-Question Challenge
                </h4>
                <p className="text-sm text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                  Pick 10 algebra problems from a practice test. Solve all 10 using <strong>only</strong> Desmos. No pencil. No paper. Time yourself. You will immediately realize how much faster visual solving is compared to manual algebra.
                </p>
              </div>
            </motion.div>

            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: <Zap size={24} className="text-yellow-500" />,
                    title: "Systems of Equations",
                    desc: "Do not solve algebraically. Graph both equations. Tap the intersection point. Answer in 5 seconds."
                  },
                  {
                    icon: <Target size={24} className="text-red-500" />,
                    title: "Quadratic Max/Min",
                    desc: "Type the equation. Tap the vertex. Done. Skip the completing-the-square algebra."
                  },
                  {
                    icon: <BarChart3 size={24} className="text-emerald-500" />,
                    title: "The Regression Trick",
                    desc: "The SAT loves scatterplot data. Desmos calculates lines of best fit instantly. Bypass manual estimation."
                  },
                  {
                    icon: <Calculator size={24} className="text-sapphire" />,
                    title: "Finding Roots",
                    desc: "Graph the function and literally tap where the line crosses the x-axis. Completely eliminates factoring."
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0f1117] border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-border flex items-center justify-center mb-4 shadow-sm">
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-lg text-deep-navy dark:text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. Problems Students Actually Face ────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-[#08080f] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">
              05. Where Points Actually Go
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6">
              We Know Exactly<br/>Where You Are Losing Points.
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              These are the five patterns behind most score plateaus. Not knowledge gaps. Fixable habits.
            </p>
          </div>

          <div className="space-y-5">
            {[
              {
                number: "01",
                problem: "Rushing Through Module 1",
                happening: "To unlock the hard Module 2, you need roughly 15 or more correct out of 22 questions in Math, and 18 or more out of 27 in Reading and Writing. One or two careless errors can push you below that threshold. Once you are routed to the easy Module 2, your score per section is capped at around 650 no matter how well you perform after.",
                fix: "We drill Module 1 questions under timed pressure until accuracy at speed is automatic. The goal is not to finish early. The goal is to finish clean.",
                accent: "text-red-400",
                border: "border-red-500/20",
                bg: "bg-red-500/5"
              },
              {
                number: "02",
                problem: "Practicing on Paper for a Digital Test",
                happening: "The Bluebook app has its own annotation tool, question flagging system, built-in Desmos calculator, and review screen. Students who only practice on PDFs encounter all of this for the first time on test day, while the clock is running.",
                fix: "Every practice session we run uses Bluebook. Highlighting, flagging, and the review screen become second nature before test day, not a distraction during it.",
                accent: "text-sapphire",
                border: "border-sapphire/20",
                bg: "bg-sapphire/5"
              },
              {
                number: "03",
                problem: "Using Desmos on Problems It Cannot Help",
                happening: "Reaching for the calculator on simple arithmetic slows you down. Launching Desmos, typing the expression, and parsing the result takes time that adds up across a 44-question math section. Many students use it as a default instead of a tool.",
                fix: "We teach exactly when Desmos is faster: systems of equations (graph both, tap the intersection point), quadratic vertex problems (tap the vertex, skip the algebra), and problems with unknown constants (use the slider to match the condition). Everything else is faster without it.",
                accent: "text-amber-400",
                border: "border-amber-500/20",
                bg: "bg-amber-500/5"
              },
              {
                number: "04",
                problem: "Taking Practice Tests Without Reviewing Them",
                happening: "Score a 1300. Move on. Score a 1300 again. Without a structured review, the same errors repeat across every test. You are not practicing improvement. You are practicing your mistakes.",
                fix: "Every practice test includes a full error log sorted by question type. Patterns become visible within two or three tests and we target those specifically instead of re-studying everything.",
                accent: "text-orange-400",
                border: "border-orange-500/20",
                bg: "bg-orange-500/5"
              },
              {
                number: "05",
                problem: "Skipping Words in Context Prep",
                happening: "Words in Context is the single most common question type on the Reading and Writing section. Roughly 10 to 11 questions per test, about one in five questions in the entire section. Most students skip it in prep because it does not feel like studying.",
                fix: "We build a specific framework for reading context clues that makes these questions reliable and fast. The answer is almost always in the surrounding sentence, not your existing vocabulary.",
                accent: "text-emerald-400",
                border: "border-emerald-500/20",
                bg: "bg-emerald-500/5"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-border shadow-sm"
              >
                <div className="bg-white dark:bg-[#0f1117] p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-border">
                  <div className={`text-xs font-black uppercase tracking-[0.2em] ${item.accent} mb-3`}>
                    Problem {item.number}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-deep-navy dark:text-white mb-4 leading-snug">
                    {item.problem}
                  </h3>
                  <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                    {item.happening}
                  </p>
                </div>
                <div className="bg-deep-navy border-t border-white/10 lg:border-t-0 lg:border-l lg:border-white/10 p-8 lg:p-10">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-3">
                    How We Fix It
                  </div>
                  <p className="text-slate-200 leading-relaxed text-base md:text-lg font-medium">
                    {item.fix}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. The StudyHours Framework ────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-black border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">
              06. The Methodology
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6">
              How We Engineer Your Score.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "Phase 1",
                title: "Diagnostic & Baseline",
                desc: "We don't start tutoring until we know exactly where you are losing points. You take a full-length digital diagnostic to map your cognitive endurance and identify pacing traps."
              },
              {
                step: "Phase 2",
                title: "Tactical Drilling",
                desc: "We isolate your weakest topics (e.g., standard English conventions, quadratic max/min) and drill them using Perfect Defense strategies until accuracy is automatic."
              },
              {
                step: "Phase 3",
                title: "Simulated Immersion",
                desc: "We run high-stakes simulations inside the Bluebook app to build muscle memory, train you to use Desmos instinctively, and solidify pacing under real test conditions."
              }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-border"
              >
                <div className="text-5xl font-black text-sapphire/20 absolute top-6 right-6">
                  0{i + 1}
                </div>
                <div className="text-sm font-bold text-sapphire mb-3">{s.step}</div>
                <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-4">{s.title}</h3>
                <p className="text-text-secondary leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ Section ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-[#08080f] relative border-b border-border">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How many hours of tutoring do I actually need?",
                a: "It depends on your baseline score and target score. Typically, students seeking a 100-point increase need about 15-20 hours of focused 1-on-1 prep combined with weekly practice tests. For a 200+ point jump, we recommend starting 3-4 months in advance."
              },
              {
                q: "Do I have to buy practice materials?",
                a: "No. We utilize the official College Board Bluebook app and provide all supplementary materials, question banks, and proprietary curriculum designed to attack the test's algorithm."
              },
              {
                q: "Is it too late to start if my test is in 4 weeks?",
                a: "No. If you have a short timeline, we skip general content review and immediately implement 'Triage Prep': focusing solely on High-ROI topics (like punctuation and linear equations) and Desmos calculator exploits to rapidly inflate your score."
              },
              {
                q: "Can I just use Khan Academy for free?",
                a: "Khan Academy is fantastic for general content practice. However, it does not teach you how to game the adaptive algorithm, how to pace yourself perfectly, or exactly when to bypass algebra using the Desmos graphing calculator. We teach strategy, not just math."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-white dark:bg-black border border-border rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg text-deep-navy dark:text-white">
                  {faq.q}
                  <ChevronRight size={20} className="text-sapphire group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-text-secondary leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Final CTA (Glassmorphism) ────────────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden bg-slate-900">
        <Image src={optimizeCloudinaryUrl(PLACEHOLDER_IMAGE)} alt="Student studying" fill className="object-cover opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 p-12 md:p-16 rounded-[3rem] shadow-2xl"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
              Stop Guessing.<br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">Start Tracking.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              Are you losing points because of knowledge gaps, pacing anxiety, or falling into the algorithm's early-mistake traps? Our diagnostic assessment pinpoints exactly where your cognitive endurance fails.
            </p>
            
            <Link 
              href={ctaHref} 
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-black rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] text-lg group"
            >
              Book Your Diagnostic Session
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
