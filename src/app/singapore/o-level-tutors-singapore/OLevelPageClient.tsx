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
  Target,
  TrendingUp,
  Star,
  Award,
  MapPin,
  GraduationCap,
  Brain,
  Lightbulb,
  History,
  Monitor,
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../../components/subjects/ParentTestimonials";
import StickyCTA from "../../components/subjects/StickyCTA";
import SubjectFAQ, { FAQItemType } from "../../components/subjects/SubjectFAQ";

export default function OLevelPageClient({
  testimonials = [],
  faqs = [],
}: {
  testimonials?: any[];
  faqs?: FAQItemType[];
}) {
  const { user } = useAuthContext();

  const oLevelGrades = [
    { grade: "A1", range: "75–100", label: "Distinction", color: "bg-emerald-500", points: 1 },
    { grade: "A2", range: "70–74", label: "Distinction", color: "bg-emerald-400", points: 2 },
    { grade: "B3", range: "65–69", label: "Merit", color: "bg-blue-500", points: 3 },
    { grade: "B4", range: "60–64", label: "Merit", color: "bg-blue-400", points: 4 },
    { grade: "C5", range: "55–59", label: "Pass", color: "bg-amber-500", points: 5 },
    { grade: "C6", range: "50–54", label: "Pass", color: "bg-amber-400", points: 6 },
    { grade: "D7", range: "45–49", label: "Pass", color: "bg-orange-400", points: 7 },
    { grade: "E8", range: "40–44", label: "Pass", color: "bg-red-400", points: 8 },
  ];

  const subjectGroups = [
    {
      category: "Mathematics",
      icon: Calculator,
      subjects: [
        {
          name: "Elementary Mathematics (E-Math)",
          desc: "Compulsory for all streams. Covers algebra, geometry, statistics, trigonometry, and mensuration. A foundation subject   strong E-Math performance anchors the L1R5 aggregate.",
        },
        {
          name: "Additional Mathematics (A-Math)",
          desc: "The highest-demand O-Level subject. Covers advanced algebra, trigonometry, calculus (differentiation and integration), coordinate geometry, and binomial theorem. Essential for science-stream JC entry.",
        },
      ],
    },
    {
      category: "Sciences",
      icon: FlaskConical,
      subjects: [
        {
          name: "Pure Physics",
          desc: "Covers mechanics, thermal physics, waves, electricity, magnetism, and modern physics. Required for students targeting Physics-related JC H2 subjects.",
        },
        {
          name: "Pure Chemistry",
          desc: "Covers atomic structure, bonding, stoichiometry, acids/bases, redox, organic chemistry, and more. Organic Chemistry is the highest-difficulty Sec 4 topic.",
        },
        {
          name: "Pure Biology",
          desc: "Covers cell biology, nutrition, transport, respiration, excretion, reproduction, genetics, and ecology. Essay-style questions require precise scientific language.",
        },
        {
          name: "Combined Science (Phy/Chem or Bio/Chem)",
          desc: "Two sciences in one paper. Lighter than Pure Sciences but requires the same conceptual depth. Our tutors cover both Phy/Chem and Bio/Chem combinations.",
        },
      ],
    },
    {
      category: "Languages",
      icon: BookOpen,
      subjects: [
        {
          name: "English Language (Paper 1 & 2)",
          desc: "Compulsory and included in every student's L1R5. Paper 1 covers essay writing (situational and continuous writing). Paper 2 covers comprehension, summary, and grammar. A low English grade has the biggest negative impact on JC entry.",
        },
        {
          name: "Mother Tongue Language (Higher & Standard)",
          desc: "Chinese, Malay, or Tamil at Standard or Higher level. Higher MTL counts as an L1R5 bonus subject. Our tutors cover all three languages at both levels.",
        },
        {
          name: "Literature in English",
          desc: "Covers prose, poetry, and drama set texts. Requires close reading, textual analysis, and essay technique. A high-value humanities elective for arts-inclined students.",
        },
      ],
    },
    {
      category: "Humanities",
      icon: History,
      subjects: [
        {
          name: "Social Studies (Compulsory)",
          desc: "Compulsory for all Express and Normal stream students. Covers Singapore governance, international relations, and source-based case studies. The SBQ (Source-Based Questions) and structured essay format require specific technique.",
        },
        {
          name: "History (Elective)",
          desc: "Covers 20th-century history with focus on Southeast Asia and the world. Essay-based examination requiring analytical writing and source evaluation.",
        },
        {
          name: "Geography (Elective)",
          desc: "Covers physical and human geography, fieldwork skills, and data interpretation. Includes Geographical Investigation (GI) component.",
        },
        {
          name: "Combined Humanities",
          desc: "Social Studies (compulsory) + one Elective Humanities (History, Geography, or Literature). A single two-section paper   each section with its own technique requirements.",
        },
      ],
    },
    {
      category: "Commerce & Technology",
      icon: TrendingUp,
      subjects: [
        {
          name: "Principles of Accounts (POA)",
          desc: "Covers financial accounting, bookkeeping, income statements, balance sheets, and cash flow analysis. A high-scoring subject for students with structured thinking.",
        },
        {
          name: "Computer Applications (CPA)",
          desc: "Covers word processing, spreadsheets, databases, presentation, and web design. Practical-based assessment. High-scoring for methodical students.",
        },
      ],
    },
  ];

  const secondarySchools = [
    "Raffles Institution (Secondary)",
    "Hwa Chong Institution (Secondary)",
    "Victoria School",
    "Dunman High School",
    "CHIJ St. Theresa's Convent",
    "Cedar Girls' Secondary School",
    "St. Andrew's Secondary School",
    "Tanjong Katong Girls' School",
    "Anglo-Chinese School (Barker Road)",
    "St. Joseph's Institution",
    "Temasek Secondary School",
    "Buona Vista Secondary School",
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
                SEAB GCE O-Level Specialists   A1 Grade Targeted
              </div>
              <h1 className="text-4xl md:text-6xl xl:text-7xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter leading-[0.95] uppercase">
                O-Level Tutors{" "}
                <span className="text-sapphire">Singapore</span>   A1 in Every Subject
              </h1>
              <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary italic mb-8 leading-tight">
                E-Math · A-Math · Sciences · English · Humanities
              </div>
              <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed font-medium max-w-xl opacity-90">
                Your O-Level results determine your Junior College or Polytechnic
                pathway. Our specialist online tutors target A1 in every subject  
                with deep SEAB syllabus knowledge and past year paper precision that
                generic tuition centres cannot match.
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
                    980+ <br />
                    O-Level Success Stories
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="relative z-10 aspect-square rounded-[3.5rem] overflow-hidden shadow-2xl group"
              >
                <div className="absolute inset-0 bg-linear-to-t from-deep-navy/40 to-transparent z-10" />
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/f_auto,q_auto/v1776669440/A_high-performing_secondary_202604201247_kumej7.jpg"
                  alt="O-Level online tutoring session   Secondary 4 Singapore student with specialist tutor"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-[6s]"
                  priority
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -bottom-10 -left-6 md:-left-12 z-20 p-6 md:p-8 bg-white dark:bg-slate-900 rounded-4xl border border-border shadow-2xl w-full max-w-[320px]"
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-sapphire tracking-tighter leading-none">A1</div>
                    <div className="text-[8px] font-black text-text-secondary uppercase tracking-[0.15em]">Target</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-sapphire tracking-tighter leading-none">20+</div>
                    <div className="text-[8px] font-black text-text-secondary uppercase tracking-[0.15em]">Subjects</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-sapphire tracking-tighter leading-none">Sec 3–4</div>
                    <div className="text-[8px] font-black text-text-secondary uppercase tracking-[0.15em]">Levels</div>
                  </div>
                </div>
                <div className="h-px w-full bg-border my-4" />
                <div className="flex flex-wrap gap-2 justify-center">
                  {["E-Math", "A-Math", "Physics", "Chemistry", "English"].map((s) => (
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
          SECTION 2: O-LEVEL GRADING & L1R5 EXPLAINER
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-surface dark:bg-slate-900/50 border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
                Understanding O-Level Results
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter leading-tight uppercase">
                Grades, L1R5 &{" "}
                <span className="text-sapphire">JC Entry</span>
              </h2>
              <p className="text-lg text-text-secondary mb-6 font-medium leading-relaxed">
                Singapore O-Level subjects are graded{" "}
                <strong className="text-deep-navy dark:text-white">A1 (distinction)</strong> to{" "}
                <strong className="text-deep-navy dark:text-white">F9 (fail)</strong>. Each grade
                carries a point value   lower points mean a better result. For Junior
                College (JC) entry, the{" "}
                <strong className="text-deep-navy dark:text-white">L1R5 aggregate</strong> is
                calculated from your best First Language grade plus five relevant subjects.
              </p>
              <p className="text-lg text-text-secondary mb-6 font-medium leading-relaxed">
                Top JCs   Raffles Institution Junior College (RIJC), Hwa Chong
                Institution JC (HCI), Victoria Junior College (VJC), and National
                Junior College (NJC)   typically require{" "}
                <strong className="text-deep-navy dark:text-white">L1R5 of 6–10</strong>. This
                means A1 (1 point) or A2 (2 points) in most subjects. Every grade
                improvement of one level reduces your L1R5 by one point.
              </p>
              <p className="text-lg text-text-secondary font-medium leading-relaxed">
                For Polytechnic entry, the{" "}
                <strong className="text-deep-navy dark:text-white">L1R4 aggregate</strong> is used
                  First Language plus four relevant subjects. Different poly courses have
                different cut-offs. Our tutors help students build the grade profile that
                matches their target post-secondary pathway.
              </p>

              <div className="mt-8 p-6 rounded-3xl bg-sapphire/5 border border-sapphire/20">
                <p className="text-sm font-black text-deep-navy dark:text-white mb-3">
                  Example: Targeting RIJC (L1R5 cutoff ~6)
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-text-secondary">
                  <div>English (L1): <span className="text-sapphire font-black">A1 = 1pt</span></div>
                  <div>A-Math (R): <span className="text-sapphire font-black">A1 = 1pt</span></div>
                  <div>Physics (R): <span className="text-sapphire font-black">A1 = 1pt</span></div>
                  <div>Chemistry (R): <span className="text-sapphire font-black">A1 = 1pt</span></div>
                  <div>Humanities (R): <span className="text-sapphire font-black">A2 = 2pt</span></div>
                  <div>Mother Tongue (bonus): <span className="text-emerald-500 font-black">−2pt</span></div>
                </div>
                <p className="text-xs font-black text-sapphire mt-3">Net L1R5: 4 points   competitive for top JCs</p>
              </div>
            </div>

            {/* Grade Table */}
            <div>
              <div className="space-y-4">
              <div className="grid grid-cols-4 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-50">
                <div>Grade Achievement</div>
                <div>Percentage Range</div>
                <div>Classification</div>
                <div className="text-right">RP Points</div>
              </div>
              <div className="space-y-4 mb-6">
                {oLevelGrades.map((g) => (
                  <div
                    key={g.grade}
                    className="grid grid-cols-4 items-center gap-3 p-8 rounded-4xl bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-sapphire/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`w-12 h-12 rounded-xl ${g.color} flex items-center justify-center text-white text-lg font-black shadow-lg shadow-sapphire/20`}>{g.grade}</div>
                    </div>
                    <span className="text-sm font-black text-deep-navy dark:text-white relative z-10">{g.range}%</span>
                    <span className="text-[10px] font-black text-sapphire uppercase tracking-[0.2em] relative z-10">{g.label}</span>
                    <span className="text-sm font-black text-deep-navy dark:text-white text-right relative z-10">{g.points} pt</span>
                  </div>
                ))}
              </div>
              <div className="p-10 rounded-[3rem] bg-deep-navy dark:bg-white/5 text-white border border-border overflow-hidden relative group">
                 <div className="absolute inset-0 bg-linear-to-br from-sapphire/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <div className="relative z-10">
                    <p className="text-sm font-black mb-4 uppercase tracking-widest text-sapphire">D7, E8, F9 Threshold Advisory</p>
                    <p className="text-[13px] font-medium opacity-70 leading-relaxed italic">
                      Subjects graded D7–F9 typically cannot count favourably toward L1R5 or L1R4. Any subject below C6 requires a rethink of post-secondary strategy. StudyHours tutors work to eliminate D7–F9 grades across all subjects.
                    </p>
                 </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 3: SUBJECTS COVERED
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-background border-b border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
              Subject Coverage
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase leading-none">
              All O-Level Subjects  {" "}
              <span className="text-sapphire">Deep Specialist Knowledge</span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
              Every O-Level subject has its own examination pattern, marking
              convention, and scoring trap. Our tutors do not teach generically  
              they teach the exact format your SEAB paper uses.
            </p>
          </div>

          <div className="space-y-16">
            {subjectGroups.map((group, gi) => (
              <div key={gi}>
                <div className="flex items-center gap-4 mb-10 pl-4 border-l-4 border-sapphire">
                  <div className="w-14 h-14 rounded-2xl bg-sapphire/10 text-sapphire flex items-center justify-center shadow-sm">
                    <group.icon size={28} />
                  </div>
                  <h3 className="text-3xl font-black text-deep-navy dark:text-white tracking-tighter uppercase italic">
                    {group.category}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {group.subjects.map((subject, si) => (
                    <motion.div
                      key={si}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: si * 0.1 }}
                      className="group relative rounded-[3rem] p-10 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all overflow-hidden"
                    >
                      {/* Accent Gradient */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-sapphire/40 to-transparent" />
                      
                      <div className="flex flex-col h-full">
                        <div className="flex items-start justify-between mb-6">
                           <h4 className="text-xl font-black text-deep-navy dark:text-white tracking-tight leading-tight group-hover:text-sapphire transition-colors uppercase italic">
                            {subject.name}
                          </h4>
                          <CheckCircle2 size={18} className="text-sapphire opacity-20 group-hover:opacity-100 transition-all group-hover:scale-125" />
                        </div>

                        <p className="text-[15px] text-text-secondary font-medium leading-relaxed mb-8 opacity-80">
                          {subject.desc}
                        </p>

                        <div className="mt-auto pt-6 border-t border-border/30 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">SEAB Syllabus Aligned</span>
                          <ArrowRight size={16} className="text-sapphire" />
                        </div>
                      </div>

                      {/* Interactive Corner Glow */}
                      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-sapphire/5 rounded-full blur-2xl group-hover:bg-sapphire/10 transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: SEC 3 vs SEC 4 TIMING + STREAMS
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-surface dark:bg-background border-b border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Sec 3 vs Sec 4 */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
                Timing Strategy
              </span>
              <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter leading-tight uppercase">
                Sec 3 or Sec 4  {" "}
                <span className="text-sapphire">When to Start</span>
              </h2>
              <div className="space-y-5">
              <div className="space-y-6">
                {[
                  {
                    year: "Sec 3",
                    title: "Foundation Year   Strongly Recommended",
                    desc: "O-Level subject content begins in earnest in Sec 3. A-Math, Pure Sciences, and Humanities all introduce their most conceptually demanding topics in Sec 3. A tutor at this stage means no gaps carry into Sec 4.",
                    badge: "Ideal",
                    badgeColor: "bg-emerald-500/10 text-emerald-600",
                  },
                  {
                    year: "Sec 4 T1",
                    title: "Exam Preparation Year   Still Excellent",
                    desc: "Starting in Sec 4 Term 1 gives two full school terms before October prelims. A structured tutor can complete a full Sec 3 + Sec 4 syllabus review and begin past year paper practice before the preliminary exams.",
                    badge: "Recommended",
                    badgeColor: "bg-sapphire/10 text-sapphire",
                  },
                  {
                    year: "Sec 4 T2–T3",
                    title: "Intensive Prelim + O-Level Prep",
                    desc: "With prelims in August and O-Levels in October/November, Term 2–3 sessions shift to high-frequency past year paper practice, mark scheme analysis, and targeted weak-topic drilling.",
                    badge: "Intensive Mode",
                    badgeColor: "bg-amber-500/10 text-amber-600",
                  },
                  {
                    year: "Sec 5 (NA)",
                    title: "Normal Academic O-Level Year",
                    desc: "Normal Academic stream students who progressed to Sec 5 sit their O-Level papers in this final year. Our tutors support full Sec 5 O-Level preparation across all registered subjects.",
                    badge: "NA Stream",
                    badgeColor: "bg-purple-500/10 text-purple-600",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 p-8 rounded-[3rem] bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all group"
                  >
                    <div className="shrink-0 w-16 h-14 rounded-2xl bg-sapphire/10 text-sapphire font-black flex items-center justify-center text-xs text-center leading-tight group-hover:bg-sapphire group-hover:text-white transition-colors shadow-sm">
                      {item.year}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <p className="text-base font-black text-deep-navy dark:text-white tracking-tight uppercase italic">{item.title}</p>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.badgeColor} border border-current/10`}>{item.badge}</span>
                      </div>
                      <p className="text-[14px] text-text-secondary font-medium leading-relaxed opacity-80">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              </div>
            </div>

            {/* Before/After + Schools */}
            <div className="space-y-8">
              {/* Before/After */}
              <div className="rounded-[3.5rem] overflow-hidden border border-border/60 shadow-2xl bg-white relative group">
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent pointer-events-none" />
                <div className="grid grid-cols-12 bg-deep-navy text-white text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
                  <div className="col-span-12 px-8 py-6 flex items-center justify-between border-b border-white/10">
                    <span className="italic">Performance Trajectory Matrix</span>
                    <span className="text-emerald-400">A1 Grade Achievement Target</span>
                  </div>
                </div>
                <div className="divide-y divide-border relative z-10">
                  {[
                    {
                      without: "A-Math consistently failing   calculus and trigonometry topics not mastered in Sec 3",
                      with: "Topic-by-topic rebuild from Sec 3 foundations, then past year paper practice   A1 or A2 by O-Level",
                    },
                    {
                      without: "Pure Chemistry Organic section causing D7 predictions   reactions and mechanisms unclear",
                      with: "Organic Chemistry systematically mapped   reaction types, conditions, and observation keywords drilled to automaticity",
                    },
                    {
                      without: "English Paper 1 essays graded C5   ideas good but paragraphing and language weak",
                      with: "PEEL structure, varied syntax, and argument development taught explicitly   A1/A2 by prelims",
                    },
                    {
                      without: "Social Studies SBQ questions losing marks   inferences not framed correctly",
                      with: "SBQ inference technique (LPFE format) practised until automatic   full marks on inference questions",
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

              {/* Schools */}
              <div className="p-10 rounded-[3rem] bg-surface dark:bg-white/5 border border-border overflow-hidden relative group">
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <h3 className="text-xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter uppercase italic">
                    Singapore Secondary Schools Supported
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {secondarySchools.map((school, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-border group/school hover:border-sapphire/30 transition-all">
                        <div className="w-1.5 h-1.5 rounded-full bg-sapphire group-hover/school:scale-150 transition-transform" />
                        <span className="text-xs font-black text-deep-navy dark:text-white uppercase tracking-tight italic">{school}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-text-secondary mt-8 font-black uppercase tracking-[0.2em] opacity-40 italic">
                    All Singapore MOE secondary schools supported.{" "}
                    <Link href="/contact" className="text-sapphire underline decoration-sapphire/30 underline-offset-4">Verify Placement</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 5: 4-STEP METHOD
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-background border-b border-border overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
              The Method
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter uppercase">
              Our Proven O-Level{" "}
              <span className="text-emerald-500 underline decoration-2 underline-offset-8 decoration-emerald-500/30">
                Preparation Framework
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Subject-Level Diagnostic",
                desc: "We assess each subject independently using SEAB-format past year questions. We identify which syllabus topics are weak, grade each at the A1–F9 scale, and rank them by L1R5 impact.",
                step: "01",
              },
              {
                title: "L1R5-Optimised Study Plan",
                desc: "We prioritise subjects where grade improvements most reduce your L1R5. If English is your L1, it gets priority. If A-Math is the biggest drag, it is addressed first.",
                step: "02",
              },
              {
                title: "Weekly Specialist Sessions",
                desc: "1-on-1 live sessions covering concept gaps, worked examples, and SEAB past year question practice. A-Math calculus, Chemistry Organic, English SBQ   all taught at exam depth.",
                step: "03",
              },
              {
                title: "Prelim & O-Level Simulation",
                desc: "From Term 2 Sec 4, sessions shift to timed past paper practice under exam conditions. Mark scheme analysis after each paper. Tutors identify scoring patterns before the actual October papers.",
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
                <div className="text-5xl font-black text-sapphire/10 mb-8 group-hover:text-sapphire/20 transition-colors uppercase tracking-tighter">
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
          SECTION 6: TESTIMONIALS
      ============================================ */}
      <ParentTestimonials testimonials={testimonials} />

      {/* ============================================
          SECTION 7: FAQ
      ============================================ */}
      <SubjectFAQ
        items={faqs}
        title="Frequently Asked Questions   O-Level Tutors Singapore"
      />

      {/* ============================================
          SECTION 8: FINAL CTA
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
              Your L1R5 <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary">
                Opens Every Door.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 mb-12 md:mb-16 font-medium leading-relaxed max-w-2xl mx-auto px-4 md:px-0">
              A strong O-Level L1R5 determines your JC placement   and your JC
              determines your university pathway. Book a free diagnostic assessment
              today. We will map your current grade profile and build a precise plan
              to reach your target L1R5.
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
                Singapore · SEAB GCE O-Level · Sec 3 & 4
              </span>
              <Link
                href="/singapore/a-level-tutors-singapore"
                className="text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-sapphire transition-colors"
              >
                A-Level Tutors Singapore →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 9: RELATED PAGES (Internal Links)
      ============================================ */}
      <section className="py-16 px-6 bg-surface dark:bg-background border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-black text-deep-navy dark:text-white mb-8 tracking-tight uppercase">
            Related Tutoring Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "A-Level Tutors Singapore", href: "/singapore/a-level-tutors-singapore" },
              { label: "IP Programme Tutors", href: "/singapore/ip-programme-tutors-singapore" },
              { label: "PSLE Tutors Online", href: "/singapore/psle-tutors-online" },
              { label: "IGCSE Online Tutoring", href: "/igcse-online-tutoring" },
              { label: "MOE Singapore Tutors", href: "/singapore/moe-singapore-curriculum-tutors" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-white/5 border border-border hover:border-sapphire/50 hover:shadow-md transition-all group"
              >
                <span className="text-xs font-black text-deep-navy dark:text-white uppercase tracking-tight group-hover:text-sapphire transition-colors leading-tight">
                  {link.label}
                </span>
                <ArrowRight size={12} className="text-sapphire opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 10: SEO CONTENT PARAGRAPH
      ============================================ */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-deep-navy dark:text-white mb-6 tracking-normal">
            Expert O-Level Tutors in Singapore for All Subjects
          </h2>
          <p className="text-sm text-text-secondary dark:text-slate-400 leading-relaxed font-normal opacity-80 max-w-4xl">
            StudyHours provides <strong>O-Level tutors in Singapore</strong> for all
            GCE O-Level subjects, fully aligned to the SEAB (Singapore Examinations
            and Assessment Board) syllabus for Secondary 3 and Secondary 4 Express
            stream students, as well as Normal Academic stream students in Sec 4 and
            Sec 5. Our <strong>O-Level Math tutors</strong> cover both Elementary
            Mathematics (E-Math) and Additional Mathematics (A-Math)   the
            highest-demand O-Level subject in Singapore, covering calculus,
            trigonometry, advanced algebra, and coordinate geometry. Our{" "}
            <strong>O-Level Science tutors</strong> offer specialist support for Pure
            Physics, Pure Chemistry, Pure Biology, and Combined Science (Physics/Chemistry
            and Biology/Chemistry combinations). Our{" "}
            <strong>O-Level English tutors Singapore</strong> address both Paper 1
            (composition writing) and Paper 2 (comprehension, summary, and grammar),
            targeting the A1–A2 grades needed for a competitive L1R5 aggregate. We
            also provide specialist tutors for Combined Humanities (Social Studies
            with History, Geography, or Literature electives), Principles of Accounts,
            Mother Tongue Languages (Chinese, Malay, Tamil at Higher and Standard
            levels), and Computer Applications. Our{" "}
            <strong>online O-Level tutoring Singapore</strong> sessions are 1-on-1,
            recorded, and scheduled to fit around school CCAs and internal assessment
            calendars. We support students from Raffles Institution (Secondary), Hwa
            Chong Institution, Victoria School, Dunman High, CHIJ St. Theresa&apos;s,
            Cedar Girls&apos;, St Andrew&apos;s, Tanjong Katong Girls&apos;, Anglo-Chinese School,
            St. Joseph&apos;s Institution, and all Singapore MOE secondary schools.
          </p>
        </div>
      </section>
    </main>
  );
}
