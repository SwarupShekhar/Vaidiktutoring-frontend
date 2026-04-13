"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Calculator,
  FlaskConical,
  History,
  GraduationCap,
  CheckCircle2,
  Clock,
  Users,
  Lightbulb,
  Target,
  TrendingUp,
  Star,
  Globe,
  Languages,
  PenTool,
  Brain,
  Palette,
  Award,
  Zap,
  LineChart,
  Atom,
  Sigma,
  Infinity as InfinityIcon,
  Pi,
  Monitor,
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";
import { HelpCircle } from "lucide-react";
import ParentTestimonials from "../components/subjects/ParentTestimonials";
import StickyCTA from "../components/subjects/StickyCTA";
import SubjectFAQ, { FAQItemType } from "../components/subjects/SubjectFAQ";
import Counter from "../components/ui/Counter";

export default function IGCSEOnlineTutoringPage() {
  const { user } = useAuthContext();

  const igcseFaqs: FAQItemType[] = [
    {
      q: "How to choose an IGCSE tuition provider for multiple subjects?",
      a: "Select a provider with certified subject experts who align lessons to Cambridge patterns and offer flexible online scheduling.",
    },
    {
      q: "What is the hardest IGCSE exam?",
      a: "Difficulty varies, but subjects like Additional Maths and Physics are often cited. Consistent practice makes even these manageable.",
    },
    {
      q: "What is the maximum age to take IGCSE?",
      a: "There is no official limit. While designed for ages 14 to 16, the qualification is open to learners of all ages.",
    },
    {
      q: "Are online IGCSE classes effective for exam preparation?",
      a: "Yes. They provide access to global experts and flexible schedules, using interactive tools that make exam prep highly effective.",
    },
  ];


  return (
    <main className="min-h-screen bg-background transition-colors duration-500 relative selection:bg-primary/20 selection:text-primary">
      <StickyCTA />

      {/* ============================================
          SECTION 1: HERO (The Confidence Builder)
      ============================================ */}
      <section className="relative min-h-[95vh] flex items-center bg-background overflow-hidden selection:bg-sapphire/20">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-ice-blue/40 to-transparent dark:from-sapphire/5 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Column — Transformation Message */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface/60 dark:bg-surface/5 backdrop-blur-md border border-border text-[10px] font-black tracking-[0.2em] text-sapphire mb-10 shadow-sm">
                <ShieldCheck size={14} className="text-sapphire" />
                IGCSE Tutoring Experts — Cambridge & Edexcel Specialist
              </div>
              <h1 className="text-4xl md:text-6xl xl:text-7xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter leading-[0.95] uppercase">
                IGCSE Online Tuition & Tutoring Service
              </h1>
              <div className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary italic mb-10 leading-tight">
                Global Leaders in IGCSE Online Tuition
              </div>
              <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed font-medium max-w-xl opacity-90">
                Your child's{" "}
                <span className="font-black text-deep-navy dark:text-white">
                  IGCSE results are not fixed yet.
                </span>{" "}
                We provide the{" "}
                <span className="font-black text-deep-navy dark:text-white">
                  structured path
                </span>{" "}
                from where they are to where they need to be.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-start">
                <Link
                  href={user ? "/bookings/new" : "/signup?type=assessment"}
                  className="w-full sm:w-auto px-12 py-6 bg-sapphire text-white font-black rounded-3xl hover:bg-primary transition-all shadow-2xl shadow-sapphire/20 text-center flex items-center justify-center gap-3 group text-lg tracking-tighter"
                >
                  Book a Free Assessment
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <div className="flex items-center gap-4 px-6 md:px-0">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-background bg-slate-200 dark:bg-slate-800"
                      />
                    ))}
                  </div>
                  <div className="text-sm font-black text-deep-navy dark:text-white uppercase tracking-widest leading-tight">
                    Join 500+ <br />
                    IGCSE Students
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column — Relationship Focused Image */}
            <div className="relative">
              {/* Academic Doodles Overlay */}
              <div className="absolute -inset-10 z-0 pointer-events-none opacity-20 hidden md:block group-hover:opacity-40 transition-opacity duration-1000">
                <motion.div
                  animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-10 left-10 text-sapphire"
                >
                  <Atom size={48} strokeWidth={1} />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-20 right-0 text-primary"
                >
                  <Pi size={40} strokeWidth={1} />
                </motion.div>
                <motion.div
                  animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                  className="absolute top-1/2 -left-12 text-sapphire"
                >
                  <Calculator size={32} strokeWidth={1} />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1.5 }}
                  className="absolute -top-10 right-20 text-indigo-400"
                >
                  <Sigma size={36} strokeWidth={1} />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-1/4 right-0 text-cyan-400 blur-[1px]"
                >
                  <InfinityIcon size={24} />
                </motion.div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 7, repeat: Infinity }}
                  className="absolute top-20 right-1/4 text-emerald-400"
                >
                  <History size={32} strokeWidth={1} />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, delay: 0.8 }}
                  className="absolute bottom-1/4 -right-8 text-amber-400"
                >
                  <Globe size={40} strokeWidth={1} />
                </motion.div>
                <motion.div
                  animate={{ scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1.2 }}
                  className="absolute bottom-0 left-1/4 text-rose-400"
                >
                  <Languages size={44} strokeWidth={1} />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0], rotate: [0, 360] }}
                  transition={{
                    y: { duration: 3, repeat: Infinity },
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  }}
                  className="absolute -top-12 left-1/2 text-slate-400"
                >
                  <GraduationCap size={48} strokeWidth={0.5} />
                </motion.div>
                <motion.div
                  animate={{ x: [0, -10, 0], y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.3 }}
                  className="absolute top-10 right-10 text-purple-400"
                >
                  <Palette size={28} strokeWidth={1} />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1.7 }}
                  className="absolute bottom-10 left-0 text-blue-400"
                >
                  <Brain size={34} strokeWidth={1} />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="relative z-10 aspect-square rounded-[3.5rem] overflow-hidden shadow-2xl group"
              >
                <div className="absolute inset-0 bg-linear-to-t from-deep-navy/40 to-transparent z-10" />
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/v1773999715/Young_Student_and_202603201511-Photoroom_vze242.png"
                  alt="Expert IGCSE online tuition session with a professional igcse tutor"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              </motion.div>

              {/* Stats Card Overlay (Scaled Down) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -bottom-10 -left-6 md:-left-12 z-20 p-6 md:p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-border shadow-2xl w-full max-w-[320px]"
              >
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-sapphire tracking-tighter leading-none">
                      <Counter value={94} suffix="%" />
                    </div>
                    <div className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em]">
                      IMPROVEMENT
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-sapphire tracking-tighter leading-none">
                      <Counter value={110} suffix="+" />
                    </div>
                    <div className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em]">
                      TUTORS
                    </div>
                  </div>
                </div>
                <div className="h-px w-full bg-border my-6" />
                <div className="flex flex-wrap gap-2 justify-center">
                  {["IGCSE Maths", "IGCSE Physics", "IGCSE English", "IGCSE Business"].map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-full bg-sapphire/5 text-[9px] font-black text-sapphire uppercase tracking-widest"
                    >
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
          SECTION 2: WHERE ARE YOU RIGHT NOW? (Diagnostic)
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-surface dark:bg-background border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
            Self-Assessment
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-deep-navy dark:text-white mb-20 tracking-tighter leading-tight">
            Where are you in your{" "}
            <span className="text-sapphire text-italic italic font-black">
              IGCSE journey
            </span>{" "}
            right now?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {[
              {
                title: "Struggling with specific topics",
                desc: "Needs concept clarity to bridge knowledge gaps before they widen.",
                cta: "Solve Topic Gaps",
                image:
                  "https://res.cloudinary.com/de8vvmpip/image/upload/v1774000772/Struggling_with_specific_202603201527-Photoroom_idzi2i.png",
                doodles: [
                  {
                    icon: HelpCircle,
                    color: "text-red-400",
                    x: "10%",
                    y: "20%",
                    s: 32,
                  },
                  {
                    icon: Pi,
                    color: "text-sapphire",
                    x: "80%",
                    y: "15%",
                    s: 40,
                  },
                  {
                    icon: Calculator,
                    color: "text-blue-400",
                    x: "15%",
                    y: "70%",
                    s: 34,
                  },
                ],
              },
              {
                title: "Exams in a few months",
                desc: "Needs a high-intensity focused revision that prioritizes the core syllabus.",
                cta: "Accelerate Revision",
                image:
                  "https://res.cloudinary.com/de8vvmpip/image/upload/v1774000874/Exams_in_a_202603201530-Photoroom_wgiefa.png",
                doodles: [
                  {
                    icon: FlaskConical,
                    color: "text-emerald-400",
                    x: "10%",
                    y: "70%",
                    s: 36,
                  },
                  {
                    icon: Atom,
                    color: "text-blue-500",
                    x: "85%",
                    y: "20%",
                    s: 44,
                  },
                  {
                    icon: Sigma,
                    color: "text-amber-400",
                    x: "15%",
                    y: "15%",
                    s: 32,
                  },
                ],
              },
              {
                title: "Aiming for top grades",
                desc: "Our igcse online courses are designed for A* mastery through advanced exam technique for 8/9 grades.",
                cta: "Master Exam Tech",
                image:
                  "https://res.cloudinary.com/de8vvmpip/image/upload/v1774001308/Aiming_for_top_202603201538-Photoroom_yp0d2t.png",
                doodles: [
                  {
                    icon: Star,
                    color: "text-amber-400",
                    x: "10%",
                    y: "15%",
                    s: 40,
                  },
                  {
                    icon: Award,
                    color: "text-sapphire",
                    x: "85%",
                    y: "70%",
                    s: 38,
                  },
                  {
                    icon: TrendingUp,
                    color: "text-primary",
                    x: "80%",
                    y: "10%",
                    s: 34,
                  },
                ],
              },
            ].map((col, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center group"
              >
                <div className="w-full aspect-4/3 rounded-[2.5rem] bg-background dark:bg-white/5 border border-border mb-8 overflow-hidden relative group-hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 to-primary/5 group-hover:from-sapphire/10 transition-colors" />

                  {/* Background Image Cutout - Spanning Full Width */}
                  <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-0">
                    <Image
                      src={col.image}
                      alt={col.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-bottom scale-100 group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  {/* Subtle Gradient Masks for Edge-to-Edge Seamlessness */}
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-background/60 via-background/20 to-transparent dark:from-background/30" />
                    <div className="absolute inset-y-0 left-0 w-1/12 bg-linear-to-r from-background/40 to-transparent dark:from-background/10" />
                    <div className="absolute inset-y-0 right-0 w-1/12 bg-linear-to-l from-background/40 to-transparent dark:from-background/10" />
                  </div>

                  {/* Custom Doodles for each card */}
                  <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                    {col.doodles.map((d, di) => (
                      <motion.div
                        key={di}
                        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                        transition={{
                          duration: 3 + di,
                          repeat: Infinity,
                          delay: di * 0.5,
                        }}
                        style={{ position: "absolute", top: d.y, left: d.x }}
                        className={d.color}
                      >
                        <d.icon size={d.s} strokeWidth={1} />
                      </motion.div>
                    ))}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none -z-10">
                    <Target size={120} strokeWidth={0.5} />
                  </div>
                </div>
                <h3 className="text-xl font-black text-deep-navy dark:text-white mb-3 tracking-tight leading-none">
                  {col.title}
                </h3>
                <p className="text-sm text-text-secondary font-medium leading-relaxed mb-6 max-w-[280px] opacity-80">
                  {col.desc}
                </p>
                <Link
                  href={user ? "/bookings/new" : "/signup?type=assessment"}
                  className="px-6 py-3 bg-white dark:bg-surface/5 border border-border text-[10px] font-black text-sapphire dark:text-white uppercase tracking-widest rounded-xl hover:bg-sapphire hover:text-white transition-all shadow-sm active:scale-95"
                >
                  {col.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 3: BENEFITS (Before/After Contrast)
      ============================================ */}
      <section className="py-12 md:py-16 px-6 bg-background relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image Context */}
            <div className="relative">
              <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-lg relative group max-w-md mx-auto lg:ml-0">
                <div className="absolute inset-0 bg-deep-navy/30 group-hover:bg-transparent transition-colors z-10" />
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/v1773999817/close-up_of_a_202603201513_o4tnoh.jpg"
                  alt="Marked Exam Paper"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-[4s]"
                />
              </div>
              {/* Floating Value Card (Further Scaled Down) */}
              <div className="absolute -bottom-4 -right-2 p-5 bg-sapphire text-white rounded-4xl shadow-2xl max-w-[200px] z-20">
                <h4 className="text-lg font-black mb-0.5 -tracking-tighter uppercase leading-none">
                  Proven Result.
                </h4>
                <p className="text-[9px] font-medium opacity-80 uppercase tracking-widest leading-relaxed">
                  One tutor - one student - one focused plan.
                </p>
              </div>
            </div>

            {/* Right: The Contrast */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-3 block">
                The Value Proposition
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter leading-tight uppercase">
                Visible Results with <br />
                <span className="text-sapphire">Expert IGCSE Tutoring</span>
              </h2>

              <div className="space-y-6">
                {[
                  {
                    without: "Confused by mark schemes",
                    with: "Exam technique built session by session",
                  },
                  {
                    without: "Falling behind on syllabus",
                    with: "Structured catch-up plan from day one",
                  },
                  {
                    without: "Guessing what to revise",
                    with: "Past paper analysis targeting your weak areas",
                  },
                  {
                    without: "Generic online classes",
                    with: "One-on-one expert mentorship",
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start group"
                  >
                    <div className="p-4 rounded-4xl bg-surface dark:bg-surface/5 border border-border/50 group-hover:border-red-500/30 transition-colors">
                      <span className="text-[7px] font-black text-red-500 uppercase tracking-widest block mb-2 italic">
                        Baseline
                      </span>
                      <p className="text-sm text-text-secondary font-medium opacity-60 leading-tight">
                        {row.without}
                      </p>
                    </div>
                    <div className="p-4 rounded-4xl bg-sapphire/5 border border-sapphire/20 group-hover:bg-sapphire/10 transition-colors">
                      <span className="text-[7px] font-black text-sapphire uppercase tracking-widest block mb-2 italic">
                        Optimized
                      </span>
                      <p className="text-sm text-deep-navy dark:text-white font-black leading-tight">
                        {row.with}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: SUBJECT FINDER (Visual Grouping)
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-surface dark:bg-slate-900/50 border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
            Selection
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white tracking-tighter uppercase leading-none">
            Comprehensive IGCSE Online Tuition{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary">
              for All Subjects
            </span>
          </h2>
        </div>

        <div
          id="subjects"
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Card 1 — Core Subjects */}
          <SubjectGroup
            title="Core Subjects"
            subjects={[
              "IGCSE Mathematics",
              "IGCSE Additional Maths",
              "IGCSE English Language",
              "IGCSE English Literature",
            ]}
            boards={["Cambridge IGCSE", "0580", "0606"]}
            icon={Target}
          />
          {/* Card 2 — Science Subjects (Expandable) */}
          <SubjectGroup
            title="Science Subjects"
            subjects={[
              "IGCSE Biology",
              "IGCSE Chemistry",
              "IGCSE Physics",
              "IGCSE Combined Science",
              "Co-ordinated Science (Single & Double Award)",
              "IGCSE Environmental Management",
            ]}
            icon={FlaskConical}
            isExpandable={true}
            initialShow={3}
          />
          {/* Card 3 — Business & Commerce */}
          <SubjectGroup
            title="Business & Commerce"
            subjects={[
              "IGCSE Accounting",
              "IGCSE Business Studies",
              "IGCSE Economics",
            ]}
            icon={TrendingUp}
          />
          {/* Card 4 — Humanities & Social Sciences */}
          <SubjectGroup
            title="Humanities & Social Sciences"
            subjects={[
              "IGCSE History",
              "IGCSE Geography",
              "IGCSE Sociology",
              "IGCSE Global Perspectives",
            ]}
            icon={History}
          />
          {/* Card 5 — Technology & IT */}
          <SubjectGroup
            title="Technology & IT"
            subjects={["IGCSE ICT", "IGCSE Computer Science"]}
            icon={Monitor}
          />
          {/* Card 6 — Languages */}
          <SubjectGroup
            title="Languages"
            subjects={["IGCSE French", "IGCSE Arabic"]}
            icon={Languages}
          />
          {/* Card 7 — Other Subjects */}
          <SubjectGroup
            title="Other Subjects"
            subjects={["IGCSE Physical Education", "Travel & Tourism"]}
            icon={Star}
          />
        </div>

        <div className="max-w-7xl mx-auto mt-16 text-center border-t border-border pt-12">
          <p className="text-lg font-black text-deep-navy/60 italic uppercase tracking-tight">
            Don't see your subject? We likely cover it -{" "}
            <Link
              href="/contact"
              className="text-sapphire underline underline-offset-4 hover:text-primary transition-colors uppercase"
            >
              GET IN TOUCH.
            </Link>
          </p>
        </div>
      </section>

      {/* ============================================
          NEW SECTION: HOW WE PREPARE YOU (4-Step Flow)
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-background overflow-hidden relative border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
              The Method
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter uppercase">
              Our Proven IGCSE <br />
              <span className="text-emerald-500 underline decoration-2 underline-offset-8 decoration-emerald-500/30">
                Tutoring Programs & Framework
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                title: "Diagnostic Assessment",
                desc: "Identify gaps against the Cambridge syllabus.",
                step: "01",
              },
              {
                title: "Personalised Study Plan",
                desc: "Built around your specific exam timetable.",
                step: "02",
              },
              {
                title: "Targeted Sessions",
                desc: "Concepts, past papers, mark scheme mastery.",
                step: "03",
              },
              {
                title: "Mock Exams + Feedback",
                desc: "Timed practice with detailed performance review.",
                step: "04",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-10 rounded-[3rem] bg-surface dark:bg-surface/5 border border-border group"
              >
                <div className="text-5xl font-black text-sapphire/10 mb-8 transition-colors group-hover:text-sapphire/20 uppercase tracking-tighter">
                  Step {item.step}
                </div>
                <h3 className="text-xl font-black text-deep-navy dark:text-white mb-4 tracking-tight leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary font-medium leading-relaxed opacity-80">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          EXAM URGENCY BAND (May/June Series)
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-surface dark:bg-background relative overflow-hidden border-b border-border">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="max-w-2xl text-left order-2 lg:order-1">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6 block">
                Critical Countdown
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter leading-tight">
                May/June Series <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-sapphire transition-all">
                  Coming Up?
                </span>
              </h2>
              <p className="text-xl text-text-secondary dark:text-slate-400 mb-12 font-medium leading-relaxed max-w-xl">
                Let's start your revision plan this week. We have tutors
                ready to focus specifically on the June Cambridge and Edexcel
                papers.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link
                  href={user ? "/bookings/new" : "/signup?type=assessment"}
                  className="w-full sm:w-auto px-12 py-6 bg-primary text-white font-black rounded-3xl hover:bg-sapphire transition-all shadow-2xl shadow-primary/20 text-center tracking-tighter text-lg"
                >
                  Book Free Trial
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-12 py-6 border-2 border-border text-deep-navy dark:text-white font-black rounded-3xl hover:bg-surface transition-all text-center tracking-tighter text-lg"
                >
                  Speak with an Advisor
                </Link>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="relative aspect-square md:aspect-video lg:aspect-square group">
                <div className="absolute inset-x-0 bottom-0 top-[30%] bg-linear-to-t from-primary/10 to-transparent z-10 overflow-hidden rounded-[4rem]" />
                <div className="relative h-full w-full flex items-end justify-center overflow-hidden rounded-[4rem]">
                  <Image
                    src="https://res.cloudinary.com/de8vvmpip/image/upload/v1773999992/young_student_and_202603201516-Photoroom_vrtol9.png"
                    alt="IGCSE Student Success"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain object-bottom scale-110 group-hover:scale-115 transition-transform duration-[2s] ease-out z-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ParentTestimonials />

      <SubjectFAQ items={igcseFaqs} title="Frequently Asked Questions" />

      {/* ============================================
          SECTION 6: FINAL CONVERSION (The Confidence CTA)
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
              Every Grade <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary transition-all">
                Point Counts.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 mb-12 md:mb-16 font-medium leading-relaxed max-w-2xl mx-auto px-4 md:px-0">
              Let's make sure you earn yours. Join the students securing
              top results with Cambridge-specialist mentorship.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
              <Link
                href={user ? "/bookings/new" : "/signup?type=assessment"}
                className="w-full sm:w-auto px-12 py-5 bg-white text-black font-black rounded-3xl hover:bg-primary hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] text-lg tracking-wide active:scale-95"
              >
                Book a Free Assessment
              </Link>
              <Link
                href="/igcse-online-tutoring#subjects"
                className="w-full sm:w-auto px-12 py-5 border-2 border-white/20 text-white font-black rounded-3xl hover:bg-white/5 transition-all text-lg tracking-wide"
              >
                View All IGCSE Subjects
              </Link>
            </div>
            <div className="mt-16 pt-12 border-t border-white/5 flex items-center justify-between opacity-40">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                IGCSE Cambridge · Grades 9-10
              </span>
              <Link
                href="/ib-online-tutoring"
                className="text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-sapphire transition-colors"
              >
                Switch to IB Diploma →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      {/* SEO Paragraph Section — At the Bottom */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-deep-navy dark:text-white mb-6 tracking-normal">
            Find Expert IGCSE Tutoring for Every Subject
          </h2>
          <p className="text-sm text-text-secondary dark:text-slate-400 leading-relaxed font-normal opacity-80 max-w-4xl">
            StudyHours connects students with <strong>IGCSE Tutoring Experts</strong> across all major Cambridge IGCSE subjects. Our <strong>IGCSE Tutoring Programs</strong> cover IGCSE Mathematics and IGCSE Additional Maths, alongside IGCSE English Language and IGCSE English Literature. Our science tutors specialise in IGCSE Biology, IGCSE Chemistry, IGCSE Physics, IGCSE Combined Science, and Co-ordinated Science. We also offer expert <strong>igcse online tuition</strong> for IGCSE Accounting, IGCSE Business Studies, and IGCSE Economics. Humanities support includes IGCSE History, IGCSE Geography, IGCSE Sociology, and IGCSE Global Perspectives. Technology subjects covered include IGCSE ICT and IGCSE Computer Science. Language support is available for IGCSE French and IGCSE Arabic. Every <strong>igcse online course</strong> is designed to ensure students transition smoothly from where they are to where they need to be for top results.
          </p>
        </div>
      </section>
    </main>
  );
}

function SubjectGroup({
  title,
  subjects,
  boards,
  icon: Icon,
  isExpandable,
  initialShow,
}: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedSubjects =
    isExpandable && !isExpanded ? subjects.slice(0, initialShow) : subjects;

  return (
    <div className="p-8 rounded-4xl bg-white dark:bg-slate-900/50 border border-border dark:border-white/10 shadow-sm hover:shadow-xl transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-sapphire/5 text-sapphire flex items-center justify-center mb-6 group-hover:bg-sapphire group-hover:text-white transition-colors">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-black text-deep-navy dark:text-white mb-6 tracking-tight uppercase italic">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2 mb-8">
        <AnimatePresence mode="popLayout">
          {displayedSubjects.map((sub: string) => (
            <motion.span
              key={sub}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="px-3 py-1.5 rounded-xl bg-surface dark:bg-slate-800/50 border border-border dark:border-white/10 text-[10px] font-black text-deep-navy/70 dark:text-white/70 uppercase tracking-tight"
            >
              {sub}
            </motion.span>
          ))}
        </AnimatePresence>
        {isExpandable && subjects.length > initialShow && !isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="px-3 py-1.5 rounded-xl border border-sapphire/30 text-[10px] font-black text-sapphire uppercase tracking-tight hover:bg-sapphire/5 transition-colors"
          >
            + {subjects.length - initialShow} more
          </button>
        )}
      </div>
      {boards && (
        <div className="pt-6 border-t border-border flex flex-wrap gap-3">
          {boards.map((b: string, i: number) => (
            <React.Fragment key={b}>
              <span className="text-[9px] font-black text-sapphire uppercase tracking-[0.2em]">
                {b}
              </span>
              {i < boards.length - 1 && (
                <span className="text-sapphire/40">&middot;</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
