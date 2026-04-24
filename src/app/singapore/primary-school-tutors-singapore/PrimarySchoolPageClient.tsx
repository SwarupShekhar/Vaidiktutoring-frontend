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
  Star,
  Award,
  Brain,
  Lightbulb,
  GraduationCap,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../../components/subjects/ParentTestimonials";
import StickyCTA from "../../components/subjects/StickyCTA";
import SubjectFAQ, { FAQItemType } from "../../components/subjects/SubjectFAQ";

export default function PrimarySchoolPageClient({
  testimonials = [],
  faqs = [],
}: {
  testimonials?: any[];
  faqs?: FAQItemType[];
}) {
  const { user } = useAuthContext();

  const yearByYear = [
    {
      year: "P1 & P2",
      title: "Foundation Years   No Formal Exams",
      subjects: ["English Language", "Mathematics", "Mother Tongue Language"],
      highlight: "MOE removed all weighted assessments for P1–P2 in 2019. Sessions focus on number sense, phonics, reading fluency, and early Mother Tongue literacy   building the bedrock before P3 formal assessments begin.",
      badge: "Foundation",
      badgeColor: "bg-blue-500/10 text-blue-600",
      icon: BookOpen,
    },
    {
      year: "P3",
      title: "Science Begins   Critical Transition",
      subjects: ["English Language", "Mathematics", "Science", "Mother Tongue Language", "GEP Preparation"],
      highlight: "P3 is the most significant transition in Singapore primary school. Science is introduced for the first time, formal weighted assessments begin, and GEP screening tests are held. Students who enter P3 underprepared often struggle across all four subjects simultaneously.",
      badge: "GEP Year",
      badgeColor: "bg-purple-500/10 text-purple-600",
      icon: FlaskConical,
    },
    {
      year: "P4",
      title: "The Most Critical Year",
      subjects: ["English Language", "Mathematics", "Science", "Mother Tongue Language"],
      highlight: "P4 is widely considered the most demanding primary year. Mathematics introduces fractions with unlike denominators, complex ratio problems, and multi-step word problems. Science deepens into systems and cycles. English composition structure becomes formally assessed. Gaps formed in P4 compound directly into P5 and PSLE.",
      badge: "High Stakes",
      badgeColor: "bg-red-500/10 text-red-600",
      icon: Target,
    },
    {
      year: "P5",
      title: "PSLE Preparation Begins",
      subjects: ["English Language", "Mathematics (Std/Foundation)", "Science", "Mother Tongue (Std/Foundation)", "Higher Mother Tongue"],
      highlight: "P5 introduces the full PSLE topic range. Standard and Foundation streams diverge for Mathematics and Mother Tongue. Algebra appears in P5 Math. This is the optimal year to begin structured PSLE-focused tutoring   giving a full year of preparation before the actual exam.",
      badge: "PSLE Prep Start",
      badgeColor: "bg-amber-500/10 text-amber-600",
      icon: TrendingUp,
    },
    {
      year: "P6",
      title: "PSLE Year   Exam Execution",
      subjects: ["English Language", "Mathematics (Std/Foundation)", "Science", "Mother Tongue (Std/Foundation)", "Higher Mother Tongue"],
      highlight: "P6 is the PSLE year. Term 1–2 complete the syllabus and begin past year paper practice. Term 3 is intensive revision. The PSLE is held in September–October. Every AL point earned this year directly determines Secondary 1 school placement. Students need subject specialists   not general tutors.",
      badge: "PSLE Year",
      badgeColor: "bg-emerald-500/10 text-emerald-600",
      icon: Award,
    },
  ];

  const subjectDetails = [
    {
      icon: Calculator,
      name: "Primary Mathematics",
      levels: "P1–P6 · Standard & Foundation",
      description:
        "Singapore Math is renowned worldwide for its model-drawing approach and problem-solving depth. Our tutors teach the Bar Model Method, heuristics, and multi-step word problems that define PSLE Math   not just number operations. P5–P6 topics include algebra, fractions, ratio, percentage, speed, geometry, and mensuration.",
      keyTopics: [
        "Bar Model / Model Drawing Method",
        "Whole Numbers & Operations (P1–P4)",
        "Fractions (P2–P6)",
        "Ratio & Proportion (P5–P6)",
        "Percentage (P4–P6)",
        "Speed, Distance & Time (P5–P6)",
        "Algebra (P5–P6)",
        "Geometry & Mensuration",
        "Data Representation & Statistics",
        "Problem Sum Heuristics",
      ],
    },
    {
      icon: BookOpen,
      name: "English Language",
      levels: "P1–P6",
      description:
        "Primary English covers five components: Writing, Language Use & Comprehension, Oral Communication, and Listening Comprehension (from P3). Our tutors address all four PSLE components with a particular focus on composition structure, comprehension inference, and oral conversation technique   the areas where marks are most commonly lost.",
      keyTopics: [
        "Composition Writing   narrative & personal recount",
        "Situational Writing (letters, emails, reports)",
        "Comprehension   literal & inferential",
        "Vocabulary Cloze",
        "Grammar & Editing (spelling & grammar errors)",
        "Oral   Reading Aloud",
        "Oral   Stimulus-Based Conversation",
        "Listening Comprehension (P3–P6)",
        "Punctuation & Sentence Structure",
        "Summary Writing (P5–P6)",
      ],
    },
    {
      icon: FlaskConical,
      name: "Primary Science",
      levels: "P3–P6",
      description:
        "Primary Science is introduced at P3 and assessed in PSLE. The PSLE Science paper has two sections: Multiple-Choice Questions (MCQ) and Open-Ended Questions (OEQ). OEQ answers require specific scientific language and structured reasoning   many students lose marks despite understanding the concept. Our tutors teach the exact vocabulary and answer format that PSLE Science markers award full marks for.",
      keyTopics: [
        "Diversity of Living & Non-Living Things (P3)",
        "Cycles   Water, Life, Matter (P4–P5)",
        "Systems   Plant, Human Body, Electrical (P3–P5)",
        "Interactions   Food Chains & Ecosystems (P4–P5)",
        "Energy   Light, Heat, Sound (P4–P5)",
        "OEQ Answer Structure & Scientific Language",
        "MCQ Elimination Technique",
        "Past Year Paper (PSLE Science Format)",
        "Processes of Science (P3–P6)",
      ],
    },
    {
      icon: Languages,
      name: "Mother Tongue Language",
      levels: "P1–P6 · Chinese / Malay / Tamil",
      description:
        "Mother Tongue Language (Chinese, Malay, or Tamil) is compulsory throughout primary school and assessed at PSLE. Standard and Foundation levels diverge at P5. Higher Mother Tongue (HMT) is available for strong students at P5–P6 and can boost PSLE aggregate through bonus points. Our tutors cover all three languages at both Standard and Foundation levels.",
      keyTopics: [
        "Chinese Language (CL)   Standard & Foundation",
        "Malay Language (ML)   Standard & Foundation",
        "Tamil Language (TL)   Standard & Foundation",
        "Higher Chinese / Malay / Tamil (P5–P6)",
        "Composition Writing in Mother Tongue",
        "Oral   Reading & Conversation",
        "Comprehension & Cloze Passage",
        "Listening Comprehension",
        "Vocabulary & Grammar",
      ],
    },
  ];

  const primarySchools = [
    "Nanyang Primary School",
    "Rosyth School",
    "Anglo-Chinese School (Primary)",
    "Catholic High School (Primary)",
    "Tao Nan School",
    "Raffles Girls' Primary School",
    "Henry Park Primary School",
    "Ai Tong School",
    "Pei Hwa Presbyterian Primary",
    "St. Joseph's Institution Junior",
    "Methodist Girls' School (Primary)",
    "Maha Bodhi School",
    "Keming Primary School",
    "Rulang Primary School",
    "Beacon Primary School",
    "Red Swastika School",
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
              initial={{ opacity: 1, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface/60 dark:bg-surface/5 backdrop-blur-md border border-border text-[10px] font-black tracking-[0.2em] text-sapphire mb-10 shadow-sm">
                <ShieldCheck size={14} className="text-sapphire" />
                MOE Singapore Aligned   P1 to P6 Specialists
              </div>
              <h1 className="text-4xl md:text-6xl xl:text-7xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter leading-[0.95] uppercase">
                Primary School Tutors{" "}
                <span className="text-sapphire">Singapore</span>   P1 to P6
              </h1>
              <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary italic mb-8 leading-tight">
                Math · English · Science · Mother Tongue · GEP Prep
              </div>
              <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed font-medium max-w-xl opacity-90">
                Every primary school year in Singapore builds toward PSLE. Our
                specialist online tutors support P1 to P6 students with
                MOE-aligned lessons   building strong foundations early and
                targeting AL1 by the time PSLE arrives.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-start">
                <Link
                  href={user ? "/bookings/new" : "/signup?type=assessment"}
                  className="w-full sm:w-auto px-12 py-6 bg-sapphire text-white font-black rounded-3xl hover:bg-primary transition-all shadow-2xl shadow-sapphire/20 text-center flex items-center justify-center gap-3 group text-lg tracking-tighter"
                >
                  Book a Free Session
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-4 px-6 md:px-0">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-slate-200 dark:bg-slate-800" />
                    ))}
                  </div>
                  <div className="text-sm font-black text-deep-navy dark:text-white uppercase tracking-widest leading-tight">
                    1,320+ <br />
                    Primary Students Helped
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 1, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="relative z-10 aspect-square rounded-[3.5rem] overflow-hidden shadow-2xl"
              >
                <div className="absolute inset-0 bg-linear-to-t from-deep-navy/40 to-transparent z-10" />
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/f_auto,q_auto/v1776669592/A_focused_primary_202604201249_gs5jj4.jpg"
                  alt="Primary school online tuition Singapore   P1 to P6 student with MOE-aligned specialist tutor"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-[6s]"
                  priority
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 1, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -bottom-10 -left-6 md:-left-12 z-20 p-6 md:p-8 bg-white dark:bg-slate-900 rounded-4xl border border-border shadow-2xl w-full max-w-[320px]"
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-sapphire tracking-tighter leading-none">P1–P6</div>
                    <div className="text-[8px] font-black text-text-secondary uppercase tracking-[0.15em]">All Levels</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-sapphire tracking-tighter leading-none">4</div>
                    <div className="text-[8px] font-black text-text-secondary uppercase tracking-[0.15em]">Subjects</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-sapphire tracking-tighter leading-none">GEP</div>
                    <div className="text-[8px] font-black text-text-secondary uppercase tracking-[0.15em]">Prep Available</div>
                  </div>
                </div>
                <div className="h-px w-full bg-border my-4" />
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Math", "English", "Science", "MTL", "GEP"].map((s) => (
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
          SECTION 2: YEAR-BY-YEAR BREAKDOWN
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-surface dark:bg-slate-900/50 border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
              Year-by-Year Guide
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase leading-none">
              What Matters at{" "}
              <span className="text-sapphire">Every Primary Level</span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
              Each primary school year in Singapore has a distinct focus,
              challenge, and opportunity. Understanding what your child faces at
              their specific level is the starting point for effective tutoring.
            </p>
          </div>

          <div className="space-y-8">
            {yearByYear.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative rounded-[3rem] p-10 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all overflow-hidden"
              >
                {/* Accent Gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-sapphire/40 to-transparent" />
                
                <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_1fr] gap-10 items-start">
                  {/* Year + icon */}
                  <div className="flex items-center gap-6 lg:flex-col lg:items-start lg:gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-white/10 flex items-center justify-center text-sapphire group-hover:scale-110 transition-all shadow-sm border border-sapphire/10">
                      <item.icon size={32} />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-deep-navy dark:text-white tracking-tighter italic uppercase leading-none">{item.year}</p>
                      <span className={`inline-block mt-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.badgeColor} border border-current/10`}>
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  {/* Title + description */}
                  <div>
                    <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase leading-tight group-hover:text-sapphire transition-colors italic">
                      {item.title}
                    </h3>
                    <p className="text-[15px] text-text-secondary font-medium leading-relaxed opacity-80">
                      {item.highlight}
                    </p>
                  </div>

                  {/* Subjects */}
                  <div className="lg:pl-8 lg:border-l border-border/50">
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-4">
                      Academic Focus
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-border/50 text-[10px] font-black text-deep-navy/70 dark:text-white/70 uppercase tracking-tight"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-8 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Syllabus Mastered</span>
                      <ArrowRight size={14} className="text-sapphire" />
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
          SECTION 3: SUBJECT DEEP DIVES
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-background border-b border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
              Subject Coverage
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase leading-none">
              Every Subject  {" "}
              <span className="text-sapphire">Taught to Exam Depth</span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
              Singapore primary school requires genuine depth   not just
              completion of homework. Our tutors teach each subject the way MOE
              examiners assess it, from P1 number bonds to P6 PSLE problem sums.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subjectDetails.map((subject, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-[3rem] p-10 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all overflow-hidden"
              >
                {/* Accent Gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-sapphire to-primary" />
                
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-white/10 flex items-center justify-center text-sapphire group-hover:scale-110 transition-all shadow-sm">
                      <subject.icon size={32} />
                    </div>
                    <p className="text-[9px] font-black text-sapphire uppercase tracking-[0.2em]">{subject.levels}</p>
                  </div>

                  <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase leading-tight group-hover:text-sapphire transition-colors italic">
                    {subject.name}
                  </h3>

                  <p className="text-sm text-text-secondary font-medium leading-relaxed mb-8 opacity-80">
                    {subject.description}
                  </p>

                  <div className="mt-auto space-y-6">
                    <div className="p-6 rounded-4xl bg-sapphire/5 dark:bg-sapphire/10 border border-sapphire/10 group-hover:bg-sapphire/10 transition-all">
                      <p className="text-[9px] font-black text-sapphire uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Zap size={12} /> Syllabus Mastery
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {subject.keyTopics.map((topic) => (
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
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Curriculum Sync</span>
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
          SECTION 4: GEP PREPARATION SPOTLIGHT
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-surface dark:bg-background border-b border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
                Gifted Education Programme
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter leading-tight uppercase">
                GEP Test Preparation{" "}
                <span className="text-sapphire">for P3 Students</span>
              </h2>
              <p className="text-xl text-text-secondary mb-6 font-medium leading-relaxed">
                The GEP Screening Test is held in Primary 3, typically in
                September. Students who score in the top 10% are shortlisted for
                the GEP Selection Test (held in October), which selects the top 1%
                of the Primary 3 cohort for the Gifted Education Programme.
              </p>
              <p className="text-lg text-text-secondary mb-8 font-medium leading-relaxed opacity-80">
                GEP tests are fundamentally different from regular school
                assessments. They test higher-order thinking, non-routine problem
                solving, and the ability to identify patterns and relationships in
                unfamiliar contexts   not syllabus knowledge alone. Our P3 tutors
                introduce GEP-style problem formats 8–12 weeks before the
                Screening Test.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "GEP English",
                    desc: "Higher-order comprehension, complex vocabulary in context, analogical reasoning, and unfamiliar text analysis beyond P3 syllabus.",
                  },
                  {
                    title: "GEP Mathematics",
                    desc: "Non-routine problem types, logical puzzles, pattern recognition, spatial reasoning, and multi-step problems requiring creative approaches.",
                  },
                  {
                    title: "GEP General Ability",
                    desc: "Verbal and non-verbal reasoning, abstract pattern recognition, and logical deduction   skills not directly taught in the standard MOE curriculum.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-3xl bg-background dark:bg-white/5 border border-border hover:border-sapphire/30 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-sapphire/10 text-sapphire flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-deep-navy dark:text-white mb-1 tracking-tight">{item.title}</p>
                      <p className="text-xs text-text-secondary font-medium leading-relaxed opacity-80">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-4xl overflow-hidden shadow-lg relative group max-w-md mx-auto">
                <div className="absolute inset-0 bg-deep-navy/20 group-hover:bg-transparent transition-colors z-10" />
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/v1774001308/Aiming_for_top_202603201538-Photoroom_yp0d2t.png"
                  alt="P3 student preparing for GEP Gifted Education Programme test with specialist tutor"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain object-bottom group-hover:scale-105 transition-transform duration-[4s]"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 p-5 bg-sapphire text-white rounded-4xl shadow-2xl max-w-[220px] z-20">
                <h4 className="text-base font-black mb-1 tracking-tighter uppercase leading-none">Top 1%.</h4>
                <p className="text-[9px] font-medium opacity-80 uppercase tracking-widest leading-relaxed">
                  GEP preparation starting 8–12 weeks before the P3 Screening Test.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 5: BRIDGE TO PSLE
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-background border-b border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Before/After */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
                The Transformation
              </span>
              <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter leading-tight uppercase">
                Before vs After{" "}
                <span className="text-sapphire">Primary Tutoring</span>
              </h2>
              <div className="space-y-4">
            <div className="rounded-[3.5rem] overflow-hidden border border-border/60 shadow-2xl bg-white dark:bg-slate-900/50 relative group">
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
              <div className="grid grid-cols-12 bg-deep-navy text-white text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
                <div className="col-span-12 px-8 py-6 flex items-center justify-between border-b border-white/10">
                  <span className="italic">Performance Trajectory Matrix</span>
                  <span className="text-emerald-400">AL1 Readiness Target</span>
                </div>
              </div>
              <div className="divide-y divide-border relative z-10">
                {[
                  {
                    without: "P4 Math word problems consistently wrong   model drawing not taught at school in enough depth",
                    with: "Bar model method practised until instinctive   complex ratio and fraction problems solved systematically",
                  },
                  {
                    without: "P3 Science open-ended answers marked wrong despite knowing the concept   wrong vocabulary used",
                    with: "Scientific keywords and OEQ answer structure taught explicitly   full marks on OEQ from P3 SA2 onward",
                  },
                  {
                    without: "English compositions scoring 18/30   story ideas good but sentence structure and paragraphing weak",
                    with: "PEEL paragraph structure, varied sentence types, and engaging openings taught   composition band improves by P4",
                  },
                  {
                    without: "Mother Tongue neglected   child disengaged from Chinese/Malay lessons, falling behind peers",
                    with: "MTL made accessible through tutor's structured approach   oral conversation confidence built before SA exams",
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
          <div className="space-y-8">
            <div className="p-10 rounded-[3rem] bg-surface dark:bg-white/5 border border-border overflow-hidden relative group">
              <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <h3 className="text-xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter uppercase italic">
                  Singapore Primary Schools Supported
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {primarySchools.map((school, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900/50 border border-border group/school hover:border-sapphire/30 transition-all">
                      <div className="w-1 h-1 rounded-full bg-sapphire group-hover/school:scale-150 transition-transform" />
                      <span className="text-[10px] font-black text-deep-navy dark:text-white uppercase tracking-tight italic leading-tight">{school}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-text-secondary mt-8 font-black uppercase tracking-[0.2em] opacity-40 italic">
                  All Singapore MOE schools supported.{" "}
                  <Link href="/contact" className="text-sapphire underline decoration-sapphire/30 underline-offset-4">Verify Placement</Link>
                </p>
              </div>
            </div>

            <div className="p-10 rounded-[3rem] bg-sapphire text-white border border-sapphire overflow-hidden relative group">
              <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <GraduationCap size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight uppercase leading-[0.95] italic">
                      The Bridge <br />to PSLE Mastery
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-3">Targeting AL1 Success</p>
                  </div>
                </div>
                <p className="text-sm font-medium opacity-80 leading-relaxed mb-10 italic">
                  Our primary school tutoring connects directly to dedicated PSLE preparation from P5 onward. Students who build strong foundations in P3–P4 with StudyHours arrive at P5 ready for structured PSLE targeting   not remediation.
                </p>
                <Link
                  href="/singapore/psle-tutors-online"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-sapphire font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-white/90 transition-all shadow-lg active:scale-95 group/btn self-start"
                >
                  View PSLE Specialisation
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
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
              How We Support{" "}
              <span className="text-emerald-500 underline decoration-2 underline-offset-8 decoration-emerald-500/30">
                Every Primary Level
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Level-Specific Diagnostic",
                desc: "We assess your child against their specific primary school level   P1 phonics, P4 Math problem sums, P3 Science OEQ, or P6 PSLE format. The assessment is always level and subject specific.",
                step: "01",
              },
              {
                title: "Age-Appropriate Tutor Match",
                desc: "Younger students (P1–P3) are matched with tutors experienced in engaging primary-age learners. P5–P6 students are matched with PSLE specialists who know AL-score targeting strategies.",
                step: "02",
              },
              {
                title: "Weekly Structured Sessions",
                desc: "Sessions run 45–60 minutes with visual tools, digital whiteboards, and subject-specific practice materials aligned to the MOE syllabus.",
                step: "03",
              },
              {
                title: "Ongoing Progress Reports",
                desc: "Parents receive written progress updates every four weeks covering topic mastery, assessment performance, and recommended focus areas.",
                step: "04",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, x: -20 }}
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

      {/* TESTIMONIALS */}
      <ParentTestimonials testimonials={testimonials} />

      {/* FAQ */}
      <SubjectFAQ items={faqs} title="Frequently Asked Questions   Primary School Tutors Singapore" />

      {/* ============================================
          FINAL CTA
      ============================================ */}
      <section className="py-24 md:py-32 px-6 bg-[#05010a] relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[20%] right-0 w-[600px] h-[600px] bg-sapphire/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-[20%] left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px]" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 1, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-8 md:mb-10 tracking-tight leading-none uppercase">
              Build It Early. <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary">
                Win It at PSLE.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 mb-12 md:mb-16 font-medium leading-relaxed max-w-2xl mx-auto px-4 md:px-0">
              The best PSLE results are built across years   not weeks. Book a
              free assessment for your P1 to P6 child today. We will identify
              exactly where they stand and build a structured plan toward their
              strongest possible outcome.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
              <Link
                href={user ? "/bookings/new" : "/signup?type=assessment"}
                className="w-full sm:w-auto px-12 py-5 bg-white text-black font-black rounded-3xl hover:bg-primary hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] text-lg tracking-wide active:scale-95"
              >
                Book Free Session
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
                Singapore · MOE Primary · P1–P6
              </span>
              <Link
                href="/singapore/psle-tutors-online"
                className="text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-sapphire transition-colors"
              >
                PSLE Tutors Online →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTERNAL LINKS */}
      <section className="py-16 px-6 bg-surface dark:bg-background border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-black text-deep-navy dark:text-white mb-8 tracking-tight uppercase">
            Related Tutoring Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "PSLE Tutors Online", href: "/singapore/psle-tutors-online" },
              { label: "O-Level Tutors", href: "/singapore/o-level-tutors-singapore" },
              { label: "MOE Curriculum", href: "/singapore/moe-singapore-curriculum-tutors" },
              { label: "K-12 Online", href: "/k-12-online-tutoring" },
              { label: "IP Programme", href: "/singapore/ip-programme-tutors-singapore" },
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

      {/* SEO PARAGRAPH */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-deep-navy dark:text-white mb-6 tracking-normal">
            Online Primary School Tutors in Singapore for P1 to P6
          </h2>
          <p className="text-sm text-text-secondary dark:text-slate-400 leading-relaxed font-normal opacity-80 max-w-4xl">
            StudyHours provides <strong>primary school tutors in Singapore</strong>{" "}
            for all levels from Primary 1 to Primary 6, fully aligned to the MOE
            Singapore syllabus. Our <strong>primary Math tutors</strong> cover the
            Singapore Math curriculum from P1 number operations through to P6 PSLE
            problem sums   including the Bar Model method, heuristics, fractions,
            ratio, percentage, speed, algebra, geometry, and mensuration at Standard
            and Foundation levels. Our{" "}
            <strong>primary English tutors Singapore</strong> support all five
            components of the MOE English Language syllabus: composition writing,
            language use and comprehension, oral communication, and listening
            comprehension   from P1 phonics and reading fluency through to P6 PSLE
            paper format. Our <strong>primary Science tutors</strong> begin with P3
            Science introduction and build through P4, P5, and P6 topics   with
            particular emphasis on the open-ended question (OEQ) technique that
            determines PSLE Science AL scores.{" "}
            <strong>Primary Mother Tongue tutors</strong> are available for Chinese
            Language, Malay Language, and Tamil Language at Standard and Foundation
            levels, including Higher Mother Tongue for P5–P6 students. We also offer
            specialist <strong>GEP test preparation</strong> for P3 students, covering
            GEP English, GEP Mathematics, and General Ability reasoning components
            that go beyond the standard MOE P3 syllabus. All{" "}
            <strong>online primary school tuition Singapore</strong> sessions are
            1-on-1, recorded, and available in Singapore Standard Time   serving
            students from Nanyang Primary, Rosyth, Anglo-Chinese School (Primary),
            Catholic High Primary, Tao Nan, Raffles Girls&apos; Primary, Henry Park
            Primary, Ai Tong, Methodist Girls&apos; (Primary), and all MOE primary
            schools across Singapore.
          </p>
        </div>
      </section>
    </main>
  );
}
