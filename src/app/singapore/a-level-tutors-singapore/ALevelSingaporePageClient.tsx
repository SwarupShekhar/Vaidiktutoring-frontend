"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../../components/subjects/ParentTestimonials";
import StickyCTA from "../../components/subjects/StickyCTA";
import SubjectFAQ from "../../components/subjects/SubjectFAQ";
import { Monitor, School, ArrowRight, Target, ShieldCheck, GraduationCap, Globe, CheckCircle2 } from "lucide-react";

type FAQItemType = { q: string; a: string };

interface Props {
  testimonials: { text: string; author: string; role: string; rating: number }[];
  faqs: FAQItemType[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const hLevels = [
  {
    level: "H1",
    name: "Higher 1",
    units: 1,
    papers: "1 paper",
    depth: "Introductory A-Level depth",
    typical: "General Paper, Mother Tongue, contrasting subject",
    rp: "Grade × 0.5 (max 10 RP per H1 subject)",
    color: "from-slate-500 to-slate-600",
  },
  {
    level: "H2",
    name: "Higher 2",
    units: 2,
    papers: "2 papers typically",
    depth: "Full A-Level depth   UK A-Level equivalent",
    typical: "Mathematics, Physics, Chemistry, Biology, Economics, Humanities",
    rp: "Grade × 1.0 (max 20 RP per H2 subject)",
    color: "from-blue-500 to-indigo-600",
  },
  {
    level: "H3",
    name: "Higher 3",
    units: "extension",
    papers: "1 special paper / university module",
    depth: "University undergraduate level",
    typical: "Taken alongside H2 in the same subject   top students only",
    rp: "Bonus merit points, not in RP calculation directly",
    color: "from-violet-500 to-purple-600",
  },
];

const rpGrades = [
  { grade: "A", h2: 20, h1: 10 },
  { grade: "B", h2: 17.5, h1: 8.75 },
  { grade: "C", h2: 15, h1: 7.5 },
  { grade: "D", h2: 12.5, h1: 6.25 },
  { grade: "E", h2: 10, h1: 5 },
  { grade: "S", h2: 5, h1: 2.5 },
  { grade: "U", h2: 0, h1: 0 },
];

const subjects = [
  {
    group: "Mathematics & Sciences",
    color: "blue",
    items: [
      { name: "H2 Mathematics (9758)", note: "Pure Math + Statistics. Calculus, vectors, complex numbers, probability, hypothesis testing." },
      { name: "H2 Further Mathematics (9649)", note: "Extension of H2 Math. For strongest mathematicians   taken in addition to H2 Math." },
      { name: "H2 Physics (9749)", note: "Mechanics, electricity, modern physics. Includes practical component." },
      { name: "H2 Chemistry (9729)", note: "Physical, inorganic, organic chemistry. Strong emphasis on mechanism and application." },
      { name: "H2 Biology (9744)", note: "Molecular biology, genetics, ecology. OEQ-heavy marking format." },
      { name: "H1 Mathematics (8865)", note: "Statistics-only H1 option. Common for students taking 3 H2 Sciences." },
    ],
  },
  {
    group: "Humanities & Social Sciences",
    color: "green",
    items: [
      { name: "H1/H2 Economics (8843/9757)", note: "Micro and macro. Case study and essay structure are highly examinable. RP-critical subject." },
      { name: "H2 History (9174)", note: "Source-based questions (SBQ) and essays. Singapore, Southeast Asia, and world history." },
      { name: "H2 Geography (9173)", note: "Physical and human geography. Skills-based fieldwork component." },
      { name: "H2 Literature in English (9509)", note: "Unseen poetry, prose, drama. Close reading technique essential." },
    ],
  },
  {
    group: "Languages & Compulsory Subjects",
    color: "orange",
    items: [
      { name: "H1 General Paper (8807)", note: "Compulsory for all JC students. Paper 1: Essays on contemporary issues. Paper 2: Comprehension + summary." },
      { name: "Project Work (PW)", note: "Compulsory group project. Written Report (WR) + Oral Presentation (OP) + Individual Reflection (IR). Graded A–U." },
      { name: "H1 Chinese Language (8655)", note: "Compulsory Mother Tongue option for Chinese-medium students. Included in RP." },
      { name: "H1 Malay Language (8633)", note: "Malay Mother Tongue H1. Paper 1 and 2 composition and comprehension." },
      { name: "H1 Tamil Language (8653)", note: "Tamil Mother Tongue H1. Included in RP calculation." },
    ],
  },
];

const jcList = [
  "Raffles Institution JC (RIJC)", "Hwa Chong Institution (HCI)", "Victoria Junior College (VJC)",
  "National Junior College (NJC)", "Anglo-Chinese Junior College (ACJC)", "St Andrew's Junior College (SAJC)",
  "Tampines Junior College (TJC)", "Meridian Junior College (MJC)", "Catholic Junior College (CJC)",
  "Innova Junior College (IJC)", "Nanyang Junior College (NYJC)", "Serangoon Garden Secondary / SRJC",
  "Millennia Institute (MI   centralised institute)", "Anglo-Chinese School Independent (ACS(I)   IP Y5–6)",
];

const examTimeline = [
  { period: "JC1 Term 1–2", focus: "Foundation   master H2 core content. Don't fall behind. Identify weak topics early.", urgency: "medium" },
  { period: "JC1 Midyear (May–June)", focus: "Internal school exam. Significant   schools use this to flag students at risk of Promos failure.", urgency: "high" },
  { period: "JC1 Term 3", focus: "Post-midyear correction. Final content topics. Project Work submission preparation.", urgency: "medium" },
  { period: "JC1 Promos (October)", focus: "Promotional Examination. Fail = repeat JC1. Must pass ALL subjects to proceed to JC2.", urgency: "critical" },
  { period: "JC2 Term 1–2", focus: "Final content revision. Practice paper exposure. GP essay refinement.", urgency: "high" },
  { period: "JC2 Prelims (August)", focus: "School Preliminary Exam. Predicts A-Level readiness. Some schools use Prelim grade for university early admission.", urgency: "high" },
  { period: "JC2 A-Level (Oct–Nov)", focus: "National examination. 4 weeks of papers. RP calculation determines university admission.", urgency: "critical" },
];

export default function ALevelSingaporePageClient({ testimonials, faqs }: Props) {
  const { user } = useAuthContext();
  const ctaHref = user ? "/bookings/new" : "/signup?type=assessment";

  const maxRP = 20 + 20 + 20 + 10 + 10 + 10; // 3 H2 + GP + MTL + contrasting H1 = 90

  return (
    <main className="min-h-screen bg-background text-foreground">
      <StickyCTA />

      {/* Hero */}
      <section className="relative bg-linear-to-br from-deep-navy via-[#0d1f3c] to-[#091428] text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-400 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold mb-6 tracking-wide">
            <span>🎓</span> Singapore A-Level   JC1 & JC2 Specialist Tutors
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.1 } } }} className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
            A-Level Tutors Singapore<br />
            <span className="text-ice-blue">H1, H2 &amp; H3 Online</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.2 } } }} className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Expert online A-Level tutors for all Singapore JC students. H2 Mathematics, Sciences, Economics, GP, and Humanities. JC1 Promos survival and JC2 A-Level distinction   SEAB-aligned specialists.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.3 } } }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ctaHref} className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-white font-black text-sm tracking-wide hover:bg-sapphire hover:scale-105 transition-all shadow-xl shadow-blue-500/30">
              Book Free Trial Lesson
            </Link>
            <a href="#subjects" className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-all">
              See Subject Coverage ↓
            </a>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.4 } } }} className="mt-10 flex flex-wrap justify-center gap-3 text-xs">
            {["H2 Math 9758", "H2 Chemistry", "H2 Physics", "H2 Biology", "H2 Economics", "General Paper", "JC1 Promos Prep", "A-Level Distinction"].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 font-medium">{tag}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* H1 / H2 / H3 Breakdown */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-deep-navy dark:text-white mb-4">Understanding H1, H2, and H3   Singapore A-Level Structure</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Singapore A-Level uses a tiered subject system. Every student's university Rank Point (RP) depends on which H-level subjects they take and what grades they achieve.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {hLevels.map((h, i) => (
              <motion.div
                key={h.level}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  ...fadeUp,
                  visible: {
                    ...fadeUp.visible,
                    transition: { duration: 0.5, delay: i * 0.12 },
                  },
                }}
                className="group relative rounded-[3rem] p-10 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-indigo-500/30 transition-all overflow-hidden"
              >
                {/* Accent Gradient */}
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-linear-to-r ${h.color}`} />
                
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-white/10 flex items-center justify-center text-sapphire group-hover:scale-110 transition-all shadow-sm">
                      <span className="text-3xl font-black">{h.level}</span>
                    </div>
                    <div className="text-right">
                      <h3 className="text-xl font-black text-deep-navy dark:text-white tracking-tighter uppercase leading-none italic group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {h.name}
                      </h3>
                      <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mt-2">
                        {h.units} Content Unit{typeof h.units === "number" && h.units > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 mb-10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-border/50">
                        <p className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2">Structure</p>
                        <p className="text-sm font-black text-deep-navy dark:text-white leading-tight uppercase italic">{h.papers}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-border/50">
                        <p className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2">Syllabus Depth</p>
                        <p className="text-[11px] font-bold text-text-secondary dark:text-slate-300 leading-tight italic">{h.depth}</p>
                      </div>
                    </div>

                    <div className="px-2">
                      <div className="flex items-center gap-3 mb-3">
                        <Monitor size={14} className="text-indigo-500/60" />
                        <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Typical Subjects</p>
                      </div>
                      <p className="text-[13px] font-medium text-text-secondary dark:text-slate-400 leading-relaxed italic line-clamp-3">{h.typical}</p>
                    </div>
                  </div>

                  <div className="mt-auto p-6 rounded-4xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-1 h-6 bg-indigo-600 rounded-full" />
                      <h4 className="text-[9px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
                        University Outcome
                      </h4>
                    </div>
                    <p className="text-sm font-bold text-deep-navy/80 dark:text-indigo-100 leading-tight">
                      {h.rp}
                    </p>
                  </div>
                </div>

                {/* Shadow Glow */}
                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none blur-3xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RP Score Table */}
      <section className="py-24 px-4 bg-background relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">Rank Point (RP) System</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-text-secondary max-w-2xl mx-auto font-medium lowercase">calculated from your best 3 h2 subjects + 1 h1 contrasting subject + gp + mtl. maximum rp = {maxRP}.</p>
          </motion.div>
          
          <div className="rounded-[3.5rem] overflow-hidden border border-border/60 shadow-2xl bg-surface relative group">
            <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="grid grid-cols-3 bg-deep-navy text-white text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
              <div className="px-8 py-6">Grade Achievement</div>
              <div className="px-8 py-6 border-l border-white/10 italic text-indigo-400">H2 Subject RP</div>
              <div className="px-8 py-6 border-l border-white/10 italic text-emerald-400">H1 Subject RP</div>
            </div>
            {rpGrades.map((row, i) => (
              <div key={row.grade} className={`grid grid-cols-3 border-t border-border group relative z-10 ${i % 2 === 0 ? 'bg-white/50 dark:bg-white/5' : 'bg-transparent'}`}>
                <div className={`px-8 py-6 text-xl font-black italic flex items-center ${row.grade === "A" ? "text-emerald-600" : row.grade === "U" ? "text-red-600" : "text-deep-navy dark:text-white"}`}>
                   {row.grade}
                </div>
                <div className="px-8 py-6 text-[15px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/2 border-l border-border flex items-center">
                  {row.h2} <span className="ml-2 text-[10px] uppercase opacity-40">Points</span>
                </div>
                <div className="px-8 py-6 text-[15px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-500/4 border-l border-border flex items-center">
                  {row.h1} <span className="ml-2 text-[10px] uppercase opacity-40">Points</span>
                </div>
              </div>
            ))}
          </div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeUp}
            className="mt-12 p-10 rounded-[3rem] bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 relative overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
              <h4 className="text-[11px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
                Targeting Medicine? (NUS RP ~88.75)
              </h4>
            </div>
            <p className="text-sm font-medium text-indigo-900/80 dark:text-indigo-200/80 leading-relaxed max-w-3xl italic">
              3× H2 grade A = 60 RP + H1 contrasting A = 10 RP + GP A = 10 RP + MTL A = 10 RP = <strong>90 RP</strong>. Even dropping one H2 to B reduces RP to 87.5. Our tutors help students protect the highest-RP subjects through strategic revision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="py-24 px-4 bg-surface relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight italic">Subject Mastery</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </motion.div>
          <div className="space-y-16">
            {subjects.map((group, gi) => (
              <motion.div key={group.group} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: gi * 0.1 } } }}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  <h3 className="text-xl font-black text-deep-navy dark:text-white uppercase tracking-tighter italic">{group.group}</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {group.items.map((s) => (
                    <div key={s.name} className="group relative p-8 rounded-4xl bg-white dark:bg-slate-900/50 border border-border hover:shadow-xl hover:border-primary/30 transition-all flex flex-col">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-xs">
                          <Target size={18} />
                        </div>
                        <h4 className="font-black text-deep-navy dark:text-white text-lg tracking-tight uppercase leading-tight italic">{s.name}</h4>
                      </div>
                      <p className="text-sm font-medium text-text-secondary dark:text-slate-400 leading-relaxed italic opacity-80">{s.note}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GP Spotlight */}
      <section className="py-24 px-4 bg-background relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeUp} 
            className="rounded-[3.5rem] border border-border shadow-2xl bg-white dark:bg-slate-900/50 overflow-hidden relative group"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-amber-400 to-orange-600" />
            <div className="px-10 py-12 bg-amber-500/3 border-b border-border">
              <h2 className="text-4xl font-black text-deep-navy dark:text-white tracking-tighter uppercase italic mb-4">The GP Wildcard <span className="text-amber-600">(10 RP)</span></h2>
              <p className="text-text-secondary text-lg max-w-3xl font-medium leading-relaxed italic">GP is H1 and contributes critical points. Students with strong H2 subjects regularly lose 3–5 RP through weak GP grades achievement.</p>
            </div>
            <div className="p-10 grid md:grid-cols-2 gap-10">
              <div className="p-8 rounded-4xl bg-slate-50 dark:bg-white/5 border border-border/50 hover:border-amber-500/30 transition-all group/box">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 font-black group-hover/box:scale-110 transition-transform">1</div>
                  <h3 className="font-black text-deep-navy dark:text-white uppercase tracking-tighter italic text-xl">Paper 1 · Essay</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "12 essay questions across 6 key domains",
                    "Choose 1 question, 30 marks, 1 hour 30 mins",
                    "Marked on argument quality & counterargument handling",
                    "Focus: Topic construction and thesis rebuttals"
                  ].map((p) => (
                    <li key={p} className="flex gap-3 text-sm font-medium text-text-secondary italic">
                      <span className="text-amber-500">→</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 rounded-4xl bg-slate-50 dark:bg-white/5 border border-border/50 hover:border-amber-500/30 transition-all group/box">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 font-black group-hover/box:scale-110 transition-transform">2</div>
                  <h3 className="font-black text-deep-navy dark:text-white uppercase tracking-tighter italic text-xl">Paper 2 · Comprehension</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Unseen passages, vocabulary in context, summaries",
                    "Application Question (AQ): Link to real-world context",
                    "Summary question: 8–10 marks, strict word limit",
                    "Focus: AQ framework technique and summary paraphrase"
                  ].map((p) => (
                    <li key={p} className="flex gap-3 text-sm font-medium text-text-secondary italic">
                      <span className="text-amber-500">→</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Exam Timeline */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">JC1 to A-Level Timeline   When to Start Tutoring</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Singapore JC runs on a 2-year cycle with high-stakes checkpoints. Missing the JC1 Promos is catastrophic   it means repeating JC1.</p>
          </motion.div>
          <div className="grid grid-cols-1 gap-4">
            {examTimeline.map((t, i) => (
              <motion.div 
                key={t.period} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.07 } } }} 
                className="group flex gap-8 p-8 rounded-4xl border border-border bg-white dark:bg-white/5 items-center hover:shadow-xl hover:border-primary/30 transition-all"
              >
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest shrink-0 w-24 text-center ${t.urgency === "critical" ? "bg-red-500 text-white" : t.urgency === "high" ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-400"}`}>
                  {t.urgency.toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-black text-deep-navy dark:text-white text-xl tracking-tighter uppercase italic leading-none mb-2">{t.period}</p>
                  <p className="text-text-secondary font-medium text-sm italic leading-relaxed opacity-80">{t.focus}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Singapore JC List */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">All Singapore JCs We Support</h2>
            <p className="text-text-secondary">StudyHours A-Level tutors work with students from every Junior College in Singapore</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {jcList.map((jc, i) => (
              <motion.div 
                key={jc} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.04 } } }} 
                className="flex items-center gap-2 p-4 rounded-2xl border border-border bg-white dark:bg-white/5 shadow-sm hover:border-primary hover:text-primary transition-all group"
              >
                <div className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors shrink-0" />
                <span className="text-deep-navy dark:text-white font-black uppercase tracking-tighter italic text-[11px] group-hover:translate-x-1 transition-transform">{jc}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-24 px-4 bg-surface relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tighter italic">Delta Matrix</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </motion.div>
          <div className="rounded-[3.5rem] overflow-hidden border border-border/60 shadow-2xl bg-white relative group">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="grid grid-cols-3 bg-deep-navy text-white text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
              <div className="px-8 py-6">Subject / Scenario</div>
              <div className="px-8 py-6 border-l border-white/10 italic text-red-400">Baseline Level</div>
              <div className="px-8 py-6 border-l border-white/10 italic text-emerald-400">Post-Tutoring Delta</div>
            </div>
            {[
              ["H2 Mathematics", "U at JC1 midyear   calculus methods confused, statistics untouched", "A at A-Level   systematic paper 1 + paper 2 technique mastered"],
              ["H2 Chemistry", "S/U at Promos   organic mechanisms guessed, electrochemistry weak", "B/A at A-Level   mechanism logic system built, structured answer format"],
              ["General Paper", "D in GP   argument structure weak, AQ misread constantly", "B in GP   topic sentence discipline, AQ framework technique applied"],
              ["RP Score", "RP 65   missed NTU Business first choice", "RP 77.5   NUS Business Administration offer accepted"],
            ].map(([subj, before, after], i) => (
              <div key={subj} className={`grid grid-cols-3 border-t border-border group relative z-10 ${i % 2 === 0 ? 'bg-white/50 dark:bg-white/5' : 'bg-transparent'}`}>
                <div className="px-8 py-8 text-sm font-black text-deep-navy dark:text-white uppercase tracking-tighter italic flex items-center">
                   {subj}
                </div>
                <div className="px-8 py-8 text-[13px] font-medium text-red-600/80 dark:text-red-400/80 bg-red-500/2 border-l border-border italic leading-relaxed">
                  {before}
                </div>
                <div className="px-8 py-8 text-[13px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-500/4 border-l border-border italic leading-relaxed">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="text-[10px] uppercase tracking-widest text-emerald-500/60">Success</span>
                  </div>
                  {after}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">What JC Students and Parents Say</h2>
          </motion.div>
          <ParentTestimonials testimonials={testimonials} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">A-Level Singapore   Frequently Asked Questions</h2>
          </motion.div>
          <SubjectFAQ items={faqs} />
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-8">
            <h2 className="text-2xl font-black text-deep-navy dark:text-white">Explore Other MOE Singapore Levels</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "O-Level Tutors Singapore", href: "/singapore/o-level-tutors-singapore", desc: "Sec 3–5 L1R5 strategy" },
              { name: "IP Programme Tutors", href: "/singapore/ip-programme-tutors-singapore", desc: "All 13 IP schools" },
              { name: "Primary School Tutors", href: "/singapore/primary-school-tutors-singapore", desc: "P1–P6 PSLE prep" },
              { name: "MOE Curriculum Overview", href: "/singapore/moe-singapore-curriculum-tutors", desc: "Full MOE pathway guide" },
            ].map((l, i) => (
              <motion.div key={l.href} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.08 } } }}>
                <Link href={l.href} className="group relative block p-8 rounded-4xl border border-border bg-white dark:bg-white/5 hover:border-primary hover:shadow-xl transition-all h-full">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                    <Globe size={18} />
                  </div>
                  <p className="font-black text-deep-navy dark:text-white group-hover:text-primary transition-colors text-lg tracking-tighter uppercase italic leading-tight mb-2">{l.name}</p>
                  <p className="text-[11px] text-text-secondary uppercase tracking-widest font-bold opacity-60">{l.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark CTA */}
      <section className="py-20 px-4 bg-linear-to-br from-deep-navy to-[#0d1f3c] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Don't Let Promos or A-Level Decide Your Options</h2>
            <p className="text-white/70 mb-8 text-lg">Start with a free trial lesson   H2 Math, H2 Chemistry, GP, Economics, or any A-Level subject. SEAB-aligned tutors who know your JC's internal assessment patterns.</p>
            <Link href={ctaHref} className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-primary text-white font-black text-sm tracking-wide hover:bg-sapphire hover:scale-105 transition-all shadow-xl shadow-blue-500/30">
              Book Free Trial Lesson
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SEO paragraph */}
      <section className="py-12 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-text-secondary leading-relaxed">
            StudyHours provides expert online A-Level tutors for all Singapore Junior College students. We cover H1, H2, and H3 subjects including H2 Mathematics (9758), H2 Further Mathematics (9649), H2 Physics (9749), H2 Chemistry (9729), H2 Biology (9744), H2 Economics (9757), H1 General Paper (8807), and Project Work. Our A-Level tutors support students from Raffles Institution JC (RIJC), Hwa Chong Institution (HCI), Victoria Junior College (VJC), National Junior College (NJC), Anglo-Chinese Junior College (ACJC), and all other Singapore JCs. Singapore A-Level tutoring from StudyHours focuses on three outcomes: passing JC1 Promotional Examinations, maximising university Rank Points for NUS, NTU, and SMU admission, and achieving A/B grades in H2 core subjects. We understand the Singapore A-Level RP calculation system, GP essay technique for Paper 1 and Application Question technique for Paper 2, JC1 Promos risk management, and the subject combination strategy that protects students' RP ceiling from the moment they enter JC1.
          </p>
        </div>
      </section>
    </main>
  );
}
