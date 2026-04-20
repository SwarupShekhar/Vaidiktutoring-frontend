"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Calculator,
  FlaskConical,
  Languages,
  CheckCircle2,
  Clock,
  Users,
  Target,
  TrendingUp,
  Star,
  Brain,
  Award,
  MapPin,
  Lightbulb,
  GraduationCap,
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../../components/subjects/ParentTestimonials";
import StickyCTA from "../../components/subjects/StickyCTA";
import SubjectFAQ, { FAQItemType } from "../../components/subjects/SubjectFAQ";

export default function PSLEPageClient({
  testimonials = [],
  faqs = [],
}: {
  testimonials?: any[];
  faqs?: FAQItemType[];
}) {
  const { user } = useAuthContext();

  const psleSubjects = [
    {
      icon: Calculator,
      name: "PSLE Mathematics",
      tag: "Most Competitive Subject",
      tagColor: "bg-red-500/10 text-red-500",
      description:
        "PSLE Maths is widely considered the hardest PSLE subject. It requires mastery of heuristics   model drawing, guess-and-check, working backwards, systematic listing   and multi-step problem sums combining fractions, ratios, percentages, and speed. Our tutors teach exam-format thinking, not just concepts.",
      topics: [
        "Model Drawing (Bar Model Method)",
        "Heuristics & Problem-Solving Strategies",
        "Multi-Step Problem Sums",
        "Fractions, Ratios & Percentages",
        "Speed, Distance & Time",
        "Geometry & Mensuration",
        "Algebra (P5–P6)",
        "Data Representation & Statistics",
      ],
    },
    {
      icon: BookOpen,
      name: "PSLE English Language",
      tag: "4 Components",
      tagColor: "bg-blue-500/10 text-blue-500",
      description:
        "PSLE English is assessed across four components: Writing (Composition), Language Use & Comprehension, Oral Communication, and Listening Comprehension. Our tutors strengthen composition structure, comprehension inference skills, and oral techniques   all areas where students lose marks unecessarily.",
      topics: [
        "Composition Writing (narrative & situational)",
        "Comprehension (literal & inferential)",
        "Grammar & Vocabulary (Cloze passage)",
        "Editing for Spelling & Grammar",
        "Oral Examination   Reading Aloud",
        "Oral   Stimulus-Based Conversation",
        "Listening Comprehension",
        "Summary Writing",
      ],
    },
    {
      icon: FlaskConical,
      name: "PSLE Science",
      tag: "Open-Ended Focus",
      tagColor: "bg-emerald-500/10 text-emerald-500",
      description:
        "PSLE Science combines multiple-choice questions (MCQ) with open-ended questions (OEQ). OEQ answers must follow precise scientific reasoning   students lose marks for imprecise language even when they understand the concept. Our tutors teach the exact keywords and answer structure examiners require.",
      topics: [
        "Diversity of Living & Non-Living Things",
        "Cycles (water, life, matter)",
        "Systems (plant, human body, electrical)",
        "Interactions (food chains, ecosystems)",
        "Energy (light, heat, sound)",
        "Open-Ended Question (OEQ) Technique",
        "MCQ Strategy & Elimination",
        "Past Year Paper Analysis",
      ],
    },
    {
      icon: Languages,
      name: "Mother Tongue Language",
      tag: "Chinese · Malay · Tamil",
      tagColor: "bg-purple-500/10 text-purple-500",
      description:
        "Mother Tongue Language (MTL) is assessed at Standard or Foundation level. For Chinese (CL), Malay (ML), and Tamil (TL), PSLE components include writing, comprehension, oral, and listening. Higher Mother Tongue (HMT) students receive an additional paper. Our tutors support Standard MTL and Foundation MTL.",
      topics: [
        "Chinese Language (CL)   Standard & Foundation",
        "Malay Language (ML)   Standard & Foundation",
        "Tamil Language (TL)   Standard & Foundation",
        "Higher Chinese / Higher Malay / Higher Tamil",
        "Composition Writing in Mother Tongue",
        "Oral Communication (reading & conversation)",
        "Comprehension & Cloze",
        "Listening Comprehension",
      ],
    },
  ];

  const alScoreLevels = [
    { al: "AL1", range: "90–100", label: "Distinction", color: "bg-emerald-500" },
    { al: "AL2", range: "85–89", label: "Distinction", color: "bg-emerald-400" },
    { al: "AL3", range: "80–84", label: "Merit", color: "bg-blue-500" },
    { al: "AL4", range: "75–79", label: "Merit", color: "bg-blue-400" },
    { al: "AL5", range: "65–74", label: "Pass", color: "bg-amber-500" },
    { al: "AL6", range: "45–64", label: "Pass", color: "bg-amber-400" },
    { al: "AL7", range: "20–44", label: "Pass", color: "bg-orange-400" },
    { al: "AL8", range: "Below 20", label: "Pass", color: "bg-red-400" },
  ];

  const singaporeSchools = [
    "Nanyang Primary School",
    "Anglo-Chinese School (Primary)",
    "Catholic High School (Primary)",
    "Raffles Girls' Primary School",
    "Tao Nan School",
    "Rosyth School",
    "Ai Tong School",
    "Pei Hwa Presbyterian Primary",
    "Henry Park Primary School",
    "Maha Bodhi School",
    "St. Joseph's Institution Junior",
    "Methodist Girls' School (Primary)",
  ];

  return (
    <main className="min-h-screen bg-background transition-colors duration-500 relative selection:bg-primary/20 selection:text-primary">
      <StickyCTA />

      {/* ============================================
          SECTION 1: HERO
      ============================================ */}
      <section className="relative min-h-[95vh] flex items-center bg-background overflow-hidden selection:bg-sapphire/20">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-ice-blue/40 to-transparent dark:from-sapphire/5 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface/60 dark:bg-surface/5 backdrop-blur-md border border-border text-[10px] font-black tracking-[0.2em] text-sapphire mb-10 shadow-sm">
                <ShieldCheck size={14} className="text-sapphire" />
                MOE Singapore Aligned   PSLE AL1 Specialists
              </div>
              <h1 className="text-4xl md:text-6xl xl:text-7xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter leading-[0.95] uppercase">
                PSLE Tutors{" "}
                <span className="text-sapphire">Online</span>   AL1 Target for All 4 Subjects
              </h1>
              <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary italic mb-8 leading-tight">
                Math · English · Science · Mother Tongue
              </div>
              <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed font-medium max-w-xl opacity-90">
                PSLE is one of the most important exams in a Singaporean child&apos;s
                academic life. Our specialist online tutors are fully aligned to the
                MOE 2021 Achievement Level syllabus   targeting AL1 in every subject,
                one structured session at a time.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-start">
                <Link
                  href={user ? "/bookings/new" : "/signup?type=assessment"}
                  className="w-full sm:w-auto px-12 py-6 bg-sapphire text-white font-black rounded-3xl hover:bg-primary transition-all shadow-2xl shadow-sapphire/20 text-center flex items-center justify-center gap-3 group text-lg tracking-tighter"
                >
                  Book a Free Assessment
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-4 px-6 md:px-0">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-slate-200 dark:bg-slate-800" />
                    ))}
                  </div>
                  <div className="text-sm font-black text-deep-navy dark:text-white uppercase tracking-widest leading-tight">
                    1,140+ <br />
                    PSLE Success Stories
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="relative z-10 aspect-square rounded-[3.5rem] overflow-hidden shadow-2xl group"
              >
                <div className="absolute inset-0 bg-linear-to-t from-deep-navy/40 to-transparent z-10" />
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/f_auto,q_auto/v1776669255/A_focused_primary_202604201243_zgcyf1.jpg"
                  alt="PSLE online tutoring session   Primary 6 student preparing for PSLE with a specialist tutor"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-[6s]"
                  priority
                />
              </motion.div>

              {/* Stats Overlay */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -bottom-10 -left-6 md:-left-12 z-20 p-6 md:p-8 bg-white dark:bg-slate-900 rounded-4xl border border-border shadow-2xl w-full max-w-[320px]"
              >
                <div className="grid grid-cols-2 gap-5 text-center">
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-sapphire tracking-tighter leading-none">AL1</div>
                    <div className="text-[8px] font-black text-text-secondary uppercase tracking-[0.15em]">Target Score</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-sapphire tracking-tighter leading-none">4</div>
                    <div className="text-[8px] font-black text-text-secondary uppercase tracking-[0.15em]">PSLE Subjects</div>
                  </div>
                </div>
                <div className="h-px w-full bg-border my-4" />
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Math", "English", "Science", "Mother Tongue"].map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-sapphire/5 text-[9px] font-black text-sapphire uppercase tracking-widest">
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 2: WHAT IS PSLE   AL SCORING EXPLAINER
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-surface dark:bg-slate-900/50 border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
                Understanding PSLE
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter leading-tight uppercase">
                The New PSLE{" "}
                <span className="text-sapphire">Achievement Level System</span>
              </h2>
              <p className="text-lg text-text-secondary mb-6 font-medium leading-relaxed">
                Since 2021, PSLE no longer uses the T-score system. The new
                Achievement Level (AL) system scores each of the four PSLE subjects
                from <strong className="text-deep-navy dark:text-white">AL1 (highest)</strong> to{" "}
                <strong className="text-deep-navy dark:text-white">AL8 (lowest)</strong>. Your
                child&apos;s four AL scores are added together   the lower the aggregate,
                the better the secondary school placement.
              </p>
              <p className="text-lg text-text-secondary mb-6 font-medium leading-relaxed">
                A student who achieves AL1 in all four subjects earns an aggregate of{" "}
                <strong className="text-deep-navy dark:text-white">4</strong>   the best
                possible PSLE result. Top secondary schools like Raffles Institution,
                Hwa Chong, and Victoria School typically require aggregates of{" "}
                <strong className="text-deep-navy dark:text-white">7–12</strong>.
              </p>
              <p className="text-lg text-text-secondary font-medium leading-relaxed">
                The AL system rewards consistent performance across all subjects. A
                student who scores AL2 in Math but AL4 in Science is penalised more
                than one who scores AL3 in both. This makes{" "}
                <strong className="text-deep-navy dark:text-white">
                  balanced subject preparation
                </strong>{" "}
                  across all four PSLE papers   more important than ever.
              </p>
            </div>

            {/* AL Score Table */}
            <div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-50">
                <div>Score Band</div>
                <div className="text-center">Mark Range</div>
                <div className="text-right">Classification</div>
              </div>
              <div className="space-y-4 mb-6">
                {alScoreLevels.map((level) => (
                  <div
                    key={level.al}
                    className="grid grid-cols-3 items-center gap-4 p-8 rounded-4xl bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-sapphire/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`w-12 h-12 rounded-xl ${level.color} flex items-center justify-center text-white text-lg font-black shadow-lg shadow-sapphire/20`}>{level.al}</div>
                    </div>
                    <span className="text-sm font-black text-deep-navy dark:text-white text-center relative z-10">{level.range}</span>
                    <span className="text-[10px] font-black text-sapphire uppercase tracking-[0.2em] text-right relative z-10">{level.label}</span>
                  </div>
                ))}
              </div>
              <div className="p-10 rounded-[3rem] bg-deep-navy dark:bg-white/5 text-white border border-border overflow-hidden relative group">
                 <div className="absolute inset-0 bg-linear-to-br from-sapphire/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <div className="relative z-10">
                    <p className="text-sm font-black mb-4 uppercase tracking-widest text-sapphire">Aggregate Performance Advisory</p>
                    <p className="text-[13px] font-medium opacity-70 leading-relaxed italic">
                      Best possible PSLE aggregate: <span className="text-sapphire font-black">4</span> (AL1 × 4 subjects). Top schools typically require aggregates of 7–12. Each AL improvement per subject directly lowers your child&apos;s aggregate.
                    </p>
                 </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 3: PSLE SUBJECTS IN DEPTH
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-background border-b border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
              Subject Coverage
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase leading-none">
              All Four PSLE Subjects  {" "}
              <span className="text-sapphire">Covered in Depth</span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
              Every PSLE subject has its own challenge pattern. A generic tutor
              teaches content. A StudyHours specialist teaches how examiners think  
              and how to give answers that score full marks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {psleSubjects.map((subject, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-[3rem] p-10 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all overflow-hidden"
              >
                {/* Accent Gradient */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-sapphire to-primary" />
                
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-white/10 flex items-center justify-center text-sapphire group-hover:scale-110 transition-all shadow-sm">
                      <subject.icon size={32} />
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${subject.tagColor} shadow-sm border border-sapphire/10`}>
                      {subject.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase leading-tight group-hover:text-sapphire transition-colors flex items-center gap-3">
                    {subject.name}
                  </h3>

                  <p className="text-sm text-text-secondary font-medium leading-relaxed mb-8 opacity-80">
                    {subject.description}
                  </p>

                  <div className="mt-auto space-y-6">
                    <div className="p-6 rounded-4xl bg-sapphire/5 dark:bg-sapphire/10 border border-sapphire/10 group-hover:bg-sapphire/10 transition-all">
                      <p className="text-[9px] font-black text-sapphire uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Target size={12} /> Mastery Matrix
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {subject.topics.map((topic) => (
                          <span
                            key={topic}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-border/50 text-[10px] font-black text-deep-navy/70 dark:text-white/70 uppercase tracking-tight"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between px-2 pt-4 border-t border-border/30 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">AL1 Preparation Active</span>
                      <ArrowRight size={16} className="text-sapphire" />
                    </div>
                  </div>
                </div>

                {/* Bottom Interactive Line */}
                <div className="absolute bottom-0 left-10 right-10 h-1 bg-sapphire/10 group-hover:bg-sapphire/40 transition-all duration-700 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: P5 VS P6   WHEN TO START
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-surface dark:bg-background border-b border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
                Timing Strategy
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter leading-tight uppercase">
                P5 or P6   <br />
                <span className="text-sapphire">When Should You Start?</span>
              </h2>
              <p className="text-xl text-text-secondary mb-8 font-medium leading-relaxed">
                The single most common parent regret we hear is:{" "}
                <em>&ldquo;We should have started tutoring in P5.&rdquo;</em> Here is why
                timing matters   and what to do regardless of where your child is now.
              </p>

              <div className="space-y-5">
                {[
                  {
                    year: "P4",
                    title: "Foundation Building (Ideal Start)",
                    desc: "P4 is when PSLE topics begin appearing   fractions in Math, forces in Science. Starting here means gaps never form in the first place.",
                    badge: "Ideal",
                    badgeColor: "bg-emerald-500/10 text-emerald-600",
                  },
                  {
                    year: "P5",
                    title: "Critical Preparation Year",
                    desc: "P5 introduces the bulk of PSLE content. Algebra in Math, complex ecosystems in Science, and advanced composition structures in English all appear for the first time. Starting P5 tuition is strongly recommended.",
                    badge: "Strongly Recommended",
                    badgeColor: "bg-sapphire/10 text-sapphire",
                  },
                  {
                    year: "P6 Term 1",
                    title: "Structured Exam Prep",
                    desc: "If starting in P6 Term 1, there is still enough time for a full subject review plus past year paper practice before the October exam. Sessions become more frequent and exam-focused.",
                    badge: "Sufficient",
                    badgeColor: "bg-amber-500/10 text-amber-600",
                  },
                  {
                    year: "P6 Term 3",
                    title: "Intensive Pre-Exam Boost",
                    desc: "With 6–8 weeks to the PSLE, sessions focus on targeted past paper practice, weak topic drilling, and exam technique. High-frequency sessions (3–4 per week per subject) can still produce meaningful AL improvements.",
                    badge: "Intensive Mode",
                    badgeColor: "bg-orange-500/10 text-orange-600",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-5 p-5 rounded-3xl bg-background dark:bg-white/5 border border-border hover:border-sapphire/30 transition-colors group"
                  >
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-sapphire/10 text-sapphire font-black flex items-center justify-center text-sm group-hover:bg-sapphire group-hover:text-white transition-colors">
                      {item.year}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-black text-deep-navy dark:text-white tracking-tight">
                          {item.title}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary font-medium leading-relaxed opacity-80">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Before/After */}
            <div className="rounded-[3.5rem] overflow-hidden border border-border/60 shadow-2xl bg-white relative group">
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent pointer-events-none" />
                <div className="grid grid-cols-12 bg-deep-navy text-white text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
                  <div className="col-span-12 px-8 py-6 flex items-center justify-between border-b border-white/10">
                    <span className="italic">Performance Trajectory Matrix</span>
                    <span className="text-emerald-400">AL1 Grade Achievement</span>
                  </div>
                </div>
                <div className="divide-y divide-border relative z-10">
                  {[
                    {
                      without: "Scoring AL4–AL5 in Math   model drawing not mastered, guessing on problem sums",
                      with: "Systematic heuristics approach   every problem sum has a method, and the method is practised to automaticity",
                    },
                    {
                      without: "Science OEQ answers marked wrong despite knowing the concept   imprecise keywords",
                      with: "Tutor teaches exact scientific vocabulary and answer structure that PSLE markers expect",
                    },
                    {
                      without: "English compositions scoring 30/40   plot interesting but paragraphing and language band weak",
                      with: "Composition rubric decoded   introduction hook, rising action pacing, and varied sentence structure all taught explicitly",
                    },
                    {
                      without: "Mother Tongue neglected   low AL pulls the aggregate up significantly",
                      with: "MTL brought to AL2–AL3 through targeted oral practice and comprehension strategy   aggregate significantly improved",
                    },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-1 sm:grid-cols-2 group divide-x divide-border">
                      <div className="p-10 bg-red-50/20 dark:bg-red-900/5 group-hover:bg-red-50/40 dark:hover:bg-red-900/10 transition-colors">
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <TrendingUp size={12} className="rotate-180" /> Baseline Prediction
                        </span>
                        <p className="text-[13px] text-text-secondary font-medium leading-relaxed italic">{row.without}</p>
                      </div>
                      <div className="p-10 bg-emerald-50/20 dark:bg-emerald-900/5 group-hover:bg-emerald-50/40 dark:hover:bg-emerald-900/10 transition-colors">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <CheckCircle2 size={12} /> StudyHours Delta
                        </span>
                        <p className="text-[13px] text-deep-navy dark:text-white font-black leading-relaxed italic">{row.with}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 5: SINGAPORE SCHOOLS WE SUPPORT
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-background border-b border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-square rounded-4xl overflow-hidden shadow-lg relative group max-w-md mx-auto">
                <div className="absolute inset-0 bg-deep-navy/20 group-hover:bg-transparent transition-colors z-10" />
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/v1773999992/young_student_and_202603201516-Photoroom_vrtol9.png"
                  alt="Primary 6 student preparing for PSLE with online tutor   Singapore"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain object-bottom group-hover:scale-105 transition-transform duration-[4s]"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 p-5 bg-sapphire text-white rounded-4xl shadow-2xl max-w-[200px] z-20">
                <h4 className="text-base font-black mb-1 tracking-tighter uppercase leading-none">
                  MOE Aligned.
                </h4>
                <p className="text-[9px] font-medium opacity-80 uppercase tracking-widest leading-relaxed">
                  2021 AL syllabus. Every subject. Every format.
                </p>
              </div>
            </div>

            {/* Right: Schools */}
            <div className="order-1 lg:order-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
                School Support
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter leading-tight uppercase">
                We Know Singapore&apos;s{" "}
                <span className="text-sapphire">Primary Schools</span>
              </h2>
              <p className="text-lg text-text-secondary mb-8 font-medium leading-relaxed">
                Different primary schools in Singapore set different types of
                internal exams and SA papers. Our tutors are familiar with
                school-specific assessment formats across top primary schools  
                and use that knowledge to prepare your child for both internal
                assessments and the final PSLE.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {singaporeSchools.map((school, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-4 rounded-4xl bg-surface dark:bg-white/5 border border-border group/school hover:border-sapphire/40 transition-all overflow-hidden relative"
                  >
                     <div className="absolute inset-0 bg-linear-to-r from-sapphire/5 to-transparent opacity-0 group-hover/school:opacity-100 transition-opacity" />
                    <div className="w-1.5 h-1.5 rounded-full bg-sapphire group-hover/school:scale-150 transition-transform relative z-10" />
                    <span className="text-[10px] font-black text-deep-navy dark:text-white uppercase tracking-tight italic leading-tight relative z-10">
                      {school}
                    </span>
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-text-secondary font-medium opacity-70 italic">
                Support available for all Singapore MOE primary schools.{" "}
                <Link href="/contact" className="text-sapphire underline">
                  Contact us
                </Link>{" "}
                to confirm your school.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 6: 4-STEP METHOD
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-surface dark:bg-slate-900/50 border-b border-border overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
              The Method
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter uppercase">
              Our Proven PSLE{" "}
              <span className="text-emerald-500 underline decoration-2 underline-offset-8 decoration-emerald-500/30">
                Preparation Framework
              </span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
              A structured four-step process that takes any Primary 5 or Primary 6
              student from their current AL score to their target   one subject at a time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Subject-Specific Diagnostic",
                desc: "We assess your child across all four PSLE subjects using past year paper questions. Each subject is scored by AL level   we find exactly which topics are losing marks.",
                step: "01",
              },
              {
                title: "AL-Targeted Study Plan",
                desc: "A personalised plan is built subject-by-subject   mapping each weak topic to the specific MOE syllabus point, prioritised by AL impact.",
                step: "02",
              },
              {
                title: "Weekly 1-on-1 Sessions",
                desc: "Live online sessions covering concept gaps, heuristics practice, and past year paper formats. Science OEQ technique, Math model drawing taught explicitly.",
                step: "03",
              },
              {
                title: "Past Year Paper Analysis",
                desc: "From P6 Term 2 onward, sessions shift to full practice under timed conditions, followed by mark scheme analysis. Students know what examiners expect.",
                step: "04",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-10 rounded-[3rem] bg-white dark:bg-surface/5 border border-border hover:shadow-2xl transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 text-6xl font-black text-sapphire/5 group-hover:text-sapphire/10 transition-colors uppercase tracking-[0.2em] mb-10 italic">
                  Step {item.step}
                </div>
                <h3 className="relative z-10 text-xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase italic leading-[0.95]">
                  {item.title}
                </h3>
                <p className="relative z-10 text-sm text-text-secondary font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                  {item.desc}
                </p>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-linear-to-tl from-sapphire/10 to-transparent translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 7: TESTIMONIALS
      ============================================ */}
      <ParentTestimonials testimonials={testimonials} />

      {/* ============================================
          SECTION 8: FAQ
      ============================================ */}
      <SubjectFAQ
        items={faqs}
        title="Frequently Asked Questions   PSLE Online Tutoring"
      />

      {/* ============================================
          SECTION 9: FINAL CTA
      ============================================ */}
      <section className="py-24 md:py-32 px-6 bg-[#05010a] relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[20%] right-0 w-[600px] h-[600px] bg-sapphire/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-[20%] left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px]" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-8 md:mb-10 tracking-tight leading-none uppercase">
              Every AL Point <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary">
                Opens a Door.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 mb-12 md:mb-16 font-medium leading-relaxed max-w-2xl mx-auto px-4 md:px-0">
              PSLE results determine secondary school placement   and the
              right secondary school changes your child&apos;s academic trajectory.
              Book a free diagnostic assessment today. We&apos;ll identify exactly
              where each subject stands and what it takes to reach AL1.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
              <Link
                href={user ? "/bookings/new" : "/signup?type=assessment"}
                className="w-full sm:w-auto px-12 py-5 bg-white text-black font-black rounded-3xl hover:bg-primary hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] text-lg tracking-wide active:scale-95"
              >
                Book Free Assessment
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-12 py-5 border-2 border-white/20 text-white font-black rounded-3xl hover:bg-white/5 transition-all text-lg tracking-wide"
              >
                Speak with an Advisor
              </Link>
            </div>
            <div className="mt-16 pt-12 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 opacity-40">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                Singapore · MOE Aligned · P5 & P6
              </span>
              <Link
                href="/singapore/o-level-tutors-singapore"
                className="text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-sapphire transition-colors"
              >
                O-Level Tutors Singapore →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 10: RELATED PAGES (Internal Links)
      ============================================ */}
      <section className="py-16 px-6 bg-surface dark:bg-background border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-black text-deep-navy dark:text-white mb-8 tracking-tight uppercase">
            Related Tutoring Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "Primary Tutoring", href: "/singapore/primary-school-tutors-singapore" },
              { label: "O-Level Tutors", href: "/singapore/o-level-tutors-singapore" },
              { label: "MOE Curriculum", href: "/singapore/moe-singapore-curriculum-tutors" },
              { label: "IGCSE Online", href: "/igcse-online-tutoring" },
              { label: "K-12 Online", href: "/k-12-online-tutoring" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between p-6 rounded-4xl bg-white dark:bg-white/5 border border-border hover:border-sapphire/50 hover:shadow-2xl transition-all group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-linear-to-r from-sapphire/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-black text-deep-navy dark:text-white uppercase tracking-widest group-hover:text-sapphire transition-colors leading-tight italic relative z-10">
                  {link.label}
                </span>
                <ArrowRight size={14} className="text-sapphire opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 relative z-10" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 11: SEO CONTENT PARAGRAPH
      ============================================ */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-deep-navy dark:text-white mb-6 tracking-normal">
            Expert PSLE Online Tutoring for All Four Subjects
          </h2>
          <p className="text-sm text-text-secondary dark:text-slate-400 leading-relaxed font-normal opacity-80 max-w-4xl">
            StudyHours provides <strong>PSLE tutors online</strong> for all four
            Primary School Leaving Examination subjects, fully aligned to the MOE
            Singapore 2021 Achievement Level (AL) syllabus. Our{" "}
            <strong>PSLE Math tutors</strong> specialise in the heuristics and
            multi-step problem sums that distinguish AL1 students from AL3–AL4
            performance   covering model drawing, guess-and-check, working
            backwards, systematic listing, and the full P5–P6 MOE Math syllabus
            including algebra, fractions, ratios, percentages, speed, geometry, and
            mensuration. Our{" "}
            <strong>PSLE English tutors online</strong> address all four examination
            components: composition writing, language use and comprehension, oral
            communication, and listening comprehension   with specific focus on
            composition rubric technique and comprehension inference skills. Our{" "}
            <strong>PSLE Science tutors</strong> prepare students for both the MCQ
            and open-ended question (OEQ) papers, teaching the precise scientific
            vocabulary and structured reasoning that PSLE Science markers require.{" "}
            <strong>PSLE Mother Tongue tutors</strong> are available for Chinese
            Language (CL), Malay Language (ML), and Tamil Language (TL) at both
            Standard and Foundation levels, including Higher Mother Tongue (HMT)
            support. All <strong>PSLE tutoring online</strong> sessions are 1-on-1,
            recorded for replay, and scheduled in Singapore Standard Time (SGT,
            UTC+8). We support students from Nanyang Primary, Anglo-Chinese School
            (Primary), Catholic High, Raffles Girls&apos; Primary, Tao Nan School,
            Rosyth, Henry Park, Methodist Girls&apos; School (Primary), and all MOE
            primary schools across Singapore. Whether your child is in Primary 4,
            Primary 5, or Primary 6, we have a structured PSLE preparation plan to
            move them from their current AL score to their target.
          </p>
        </div>
      </section>
    </main>
  );
}
