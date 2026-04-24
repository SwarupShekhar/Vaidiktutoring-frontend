"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../../components/subjects/ParentTestimonials";
import StickyCTA from "../../components/subjects/StickyCTA";
import SubjectFAQ from "../../components/subjects/SubjectFAQ";
import { Monitor, School, ArrowRight, GraduationCap, CheckCircle2 } from "lucide-react";

type FAQItemType = { q: string; a: string };

interface Props {
  testimonials: { text: string; author: string; role: string; rating: number }[];
  faqs: FAQItemType[];
}

const fadeUp = {
  hidden: { opacity: 1, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const pathways = [
  {
    stage: "Primary School",
    years: "P1–P6",
    exam: "PSLE",
    scoring: "Achievement Levels (AL1–AL8)",
    subjects: "English, Mathematics, Science (P3+), Mother Tongue",
    nextStep: "Secondary placement by AL aggregate",
    color: "from-emerald-500 to-teal-600",
    badge: "Ages 7–12",
  },
  {
    stage: "Secondary School",
    years: "Sec 1–4 (Express) / Sec 1–5 (NA)",
    exam: "O-Level / N-Level",
    scoring: "L1R5 / L1R4 aggregate",
    subjects: "English, Mother Tongue, E-Math, A-Math, Sciences, Humanities",
    nextStep: "JC / Poly / ITE placement",
    color: "from-blue-500 to-indigo-600",
    badge: "Ages 13–17",
  },
  {
    stage: "Integrated Programme (IP)",
    years: "IP Year 1–6",
    exam: "A-Level (Year 6 only)",
    scoring: "School internal assessments Y1–4, then A-Level H1/H2/H3",
    subjects: "School-designed for Y1–4, national A-Level syllabus Y5–6",
    nextStep: "NUS / NTU / SMU via university rank points",
    color: "from-violet-500 to-purple-600",
    badge: "Through-train",
  },
  {
    stage: "Junior College",
    years: "JC1–JC2",
    exam: "A-Level",
    scoring: "University Rank Point (RP) system, max 90",
    subjects: "H1/H2/H3 content subjects, GP, Project Work, Mother Tongue",
    nextStep: "NUS / NTU / SMU / SUTD / SIT",
    color: "from-orange-500 to-red-600",
    badge: "Ages 17–19",
  },
];

const examBoards = [
  {
    name: "PSLE",
    full: "Primary School Leaving Examination",
    admin: "SEAB",
    level: "P6",
    format: "Written papers. AL1–AL8 scoring. No pass/fail   percentile-based placement.",
    key: "Model drawing for Math. Science open-ended questions. English composition and compre.",
  },
  {
    name: "O-Level",
    full: "GCE Ordinary Level",
    admin: "SEAB / Cambridge",
    level: "Sec 4/5",
    format: "A1–E8 grading. L1R5 aggregate determines JC/Poly cut-off points.",
    key: "E-Math and A-Math separate papers. Pure vs Combined Science. SBQ for History/Geography.",
  },
  {
    name: "N-Level",
    full: "GCE Normal Level",
    admin: "SEAB",
    level: "Sec 4 NA / NT",
    format: "A1–E8 (NA stream). Pathway to Polytechnic Foundation Programme (PFP).",
    key: "L1R4 aggregate for Normal Academic. Key route: qualify for O-Level via excellent N-Level.",
  },
  {
    name: "A-Level",
    full: "GCE Advanced Level",
    admin: "SEAB / Cambridge",
    level: "JC2 / IP Year 6",
    format: "H1/H2/H3 subjects. RP system for university admission.",
    key: "GP compulsory H1. Project Work compulsory. 3 H2 + 1 H1 contrasting typical combination.",
  },
];

const syllabusUpdates = [
  {
    year: "2021",
    change: "PSLE Achievement Level (AL) system replaced T-score",
    impact: "Broader AL bands reduce pressure; top schools still competitive via cut-off points",
  },
  {
    year: "2024",
    change: "Full Subject-Based Banding (SBB) for Sec 1",
    impact: "Students take subjects at different levels (G1/G2/G3) replacing Express/Normal streams",
  },
  {
    year: "2025",
    change: "Secondary Education Review and Enhancement (SERE) curriculum updates",
    impact: "New syllabus documents for Sec 3–4 Sciences and Humanities",
  },
  {
    year: "Ongoing",
    change: "A-Level H2 syllabuses reviewed by SEAB every 5–7 years",
    impact: "Check SEAB website for current syllabus codes (e.g. 9758 H2 Math)",
  },
];

const whySpecialist = [
  {
    point: "PSLE AL scoring ≠ raw marks",
    detail: "Each subject is graded AL1–AL8 using scaled scores, not raw percentages. Parents often misread practice paper performance without understanding AL cut-offs.",
  },
  {
    point: "O-Level L1R5 strategy",
    detail: "University route depends on which subjects make up L1R5. A tutor who doesn't understand L1R5 composition may prioritise the wrong subjects.",
  },
  {
    point: "IP schools set own curricula",
    detail: "RI, RGS, HCI, and other IP schools design their own Y1–4 assessments. These don't follow SEAB O-Level formats   general tutors won't understand the assessment style.",
  },
  {
    point: "A-Level RP system is complex",
    detail: "University rank points depend on H-level, grade, and subject combination. Choosing the right H1/H2 combination affects RP ceiling. Specialist tutors guide subject strategy.",
  },
  {
    point: "MOE syllabus revisions require current knowledge",
    detail: "A-Level syllabus codes change. PSLE AL system replaced T-score in 2021. SBB replaced streaming in 2024. Tutors must track MOE/SEAB announcements.",
  },
  {
    point: "School-specific assessment patterns",
    detail: "Victoria School, Raffles Institution, and HCI have distinct internal test formats even within the same national syllabus. School-specific experience matters.",
  },
];

const internalLinks = [
  { name: "PSLE Tutors Online", href: "/singapore/psle-tutors-online", desc: "AL1 target prep for P4–P6" },
  { name: "O-Level Tutors Singapore", href: "/singapore/o-level-tutors-singapore", desc: "Sec 3–5 L1R5 strategy" },
  { name: "A-Level Tutors Singapore", href: "/singapore/a-level-tutors-singapore", desc: "H1/H2/H3 and RP optimisation" },
  { name: "IP Programme Tutors", href: "/singapore/ip-programme-tutors-singapore", desc: "All 13 IP schools covered" },
  { name: "Primary School Tutors Singapore", href: "/singapore/primary-school-tutors-singapore", desc: "P1–P6 subject foundations" },
];

export default function MOESingaporePageClient({ testimonials, faqs }: Props) {
  const { user } = useAuthContext();
  const ctaHref = user ? "/bookings/new" : "/signup?type=assessment";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <StickyCTA />

      {/* Hero */}
      <section className="relative bg-linear-to-br from-deep-navy via-[#0d1f3c] to-[#091428] text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold mb-6 tracking-wide">
            <span className="text-green-400">🇸🇬</span> MOE Singapore   Full Curriculum Coverage
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.1 } } }} className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
            MOE Singapore Curriculum<br />
            <span className="text-ice-blue">Tutors Online</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.2 } } }} className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Expert online tutoring across the full MOE Singapore pathway   Primary PSLE, Secondary O-Level, Integrated Programme, and Junior College A-Level. SEAB-aligned specialists for every level and every stream.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.3 } } }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ctaHref} className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-white font-black text-sm tracking-wide hover:bg-sapphire hover:scale-105 transition-all shadow-xl shadow-blue-500/30">
              Book Free Trial Lesson
            </Link>
            <a href="#pathways" className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-all">
              Explore MOE Pathways ↓
            </a>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.4 } } }} className="mt-10 flex flex-wrap justify-center gap-4 text-xs">
            {["PSLE AL1 Preparation", "O-Level L1R5 Strategy", "A-Level H2 Subjects", "IP School Specialists", "SEAB-Aligned Content", "SBB 2024 Ready"].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 font-medium">{tag}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* MOE Pathway Overview */}
      <section id="pathways" className="py-16 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-deep-navy dark:text-white mb-4">The Full MOE Singapore Education Pathway</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">From Primary 1 to Junior College Year 2   every stage, every stream, every national examination covered by StudyHours specialists.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {pathways.map((p, i) => (
              <motion.div
                key={p.stage}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  ...fadeUp,
                  visible: {
                    ...fadeUp.visible,
                    transition: { duration: 0.5, delay: i * 0.1 },
                  },
                }}
                className="group relative rounded-[3rem] p-10 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-emerald-500/30 transition-all overflow-hidden flex flex-col"
              >
                {/* Subtle Background Glow on Hover */}
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-border shadow-sm flex items-center justify-center text-sm font-black text-emerald-600 group-hover:scale-110 transition-transform duration-500 uppercase">
                      {p.years}
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-deep-navy dark:text-white mb-2 tracking-tighter uppercase leading-none italic group-hover:text-emerald-600 transition-colors">
                    {p.stage}
                  </h3>
                  
                  <p className="text-[11px] font-black text-emerald-600/70 uppercase tracking-widest mb-8">
                     Critical Milestone: {p.exam}
                  </p>

                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4 opacity-50">Metric Matrix</p>
                        <p className="text-[13px] font-bold text-deep-navy dark:text-white italic leading-tight uppercase">{p.scoring}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Progression</p>
                        <p className="text-[13px] font-bold text-deep-navy dark:text-white italic leading-tight uppercase">{p.nextStep}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4 opacity-50">Core Syllabi</p>
                      <p className="text-[14px] font-medium text-text-secondary dark:text-slate-400 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                        {p.subjects}
                      </p>
                    </div>
                  </div>

                  <div className="mt-12 flex items-center justify-between text-emerald-600 group-hover:translate-x-1 transition-transform duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest">Board-Aligned Specialists</span>
                    <ArrowRight size={16} />
                  </div>
                </div>

                {/* Interactive Corner Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-emerald-500/10 to-transparent -translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* National Examinations */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-deep-navy dark:text-white mb-4">Singapore National Examinations   What Our Tutors Know</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">SEAB administers four national examinations. Each has distinct formats, scoring systems, and preparation strategies. Our tutors specialise by examination level.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {examBoards.map((e, i) => (
              <motion.div
                key={e.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.1 } } }}
                className="group relative rounded-[3rem] p-10 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all overflow-hidden flex flex-col"
              >
                {/* Subtle Background Glow on Hover */}
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-10">
                    <div className="w-20 h-16 rounded-2xl bg-white dark:bg-white/5 border border-border shadow-sm flex items-center justify-center font-black text-sapphire group-hover:scale-110 transition-transform duration-500 uppercase">
                      {e.name}
                    </div>
                    <span className="text-[10px] font-black text-sapphire uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">
                      {e.admin} Board
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-2 tracking-tighter uppercase leading-tight group-hover:text-sapphire transition-colors italic">
                    {e.full}
                  </h3>
                  <p className="text-[11px] font-black text-sapphire/70 uppercase tracking-widest mb-8">
                    Level Target: {e.level}
                  </p>

                  <div className="space-y-8">
                    <p className="text-[14px] text-text-secondary font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                      {e.format}
                    </p>
                    
                    <div>
                      <p className="text-[10px] font-black text-sapphire uppercase tracking-[0.2em] mb-4">Strategic Prep Architecture</p>
                      <p className="text-[14px] font-bold text-deep-navy dark:text-white leading-relaxed italic border-l-2 border-sapphire/20 pl-4">
                        {e.key}
                      </p>
                    </div>
                  </div>

                  <div className="mt-12 flex items-center justify-between text-sapphire group-hover:translate-x-1 transition-transform duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest">Active Curriculum Sync</span>
                    <ArrowRight size={16} />
                  </div>
                </div>

                {/* Interactive Corner Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-sapphire/10 to-transparent -translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MOE Syllabus Changes */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-deep-navy dark:text-white mb-4">MOE Syllabus Changes   Our Tutors Stay Current</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">MOE Singapore revises curriculum and examination formats regularly. Tutors must track these changes to give accurate, up-to-date preparation.</p>
          </motion.div>
          <div className="space-y-6">
            {syllabusUpdates.map((u, i) => (
              <motion.div
                key={u.year}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.08 } } }}
                className="group flex gap-8 p-8 rounded-[3rem] border border-border bg-white dark:bg-slate-900/50 hover:shadow-2xl hover:border-sapphire/30 transition-all items-center"
              >
                <div className="w-24 shrink-0 text-center py-4 bg-sapphire/5 rounded-2xl border border-sapphire/10 group-hover:bg-sapphire group-hover:text-white transition-all">
                  <span className="text-lg font-black tracking-tighter italic">{u.year}</span>
                </div>
                <div className="flex-1">
                  <p className="font-black text-deep-navy dark:text-white text-base mb-2 tracking-tight uppercase italic">{u.change}</p>
                  <p className="text-[14px] text-text-secondary font-medium leading-relaxed opacity-80">{u.impact}</p>
                </div>
                <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                   <CheckCircle2 size={24} className="text-emerald-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Specialist Tutors */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-deep-navy dark:text-white mb-4">Why MOE Curriculum Specialist Tutors Outperform General Tutors</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">The MOE Singapore system has examination-specific scoring mechanisms and school-specific assessment patterns that require dedicated specialist knowledge.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whySpecialist.map((w, i) => (
              <motion.div key={w.point} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.08 } } }} className="p-5 rounded-2xl border border-border bg-white dark:bg-white/5">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-primary font-black text-sm">{i + 1}</span>
                </div>
                <h3 className="font-black text-deep-navy dark:text-white text-sm mb-2">{w.point}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{w.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">Before and After StudyHours</h2>
            <p className="text-text-secondary">Outcomes across MOE Singapore levels after consistent specialist tutoring</p>
          </motion.div>
          <div className="rounded-[3.5rem] overflow-hidden border border-border/60 shadow-2xl bg-white dark:bg-slate-900/50 relative group">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="grid grid-cols-3 bg-deep-navy text-white text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
              <div className="px-8 py-6">Level / Context</div>
              <div className="px-8 py-6 border-l border-white/10 italic text-red-400">Baseline Level</div>
              <div className="px-8 py-6 border-l border-white/10 italic text-emerald-400">Post-Tutoring Delta</div>
            </div>
            {[
              ["PSLE (P6)", "AL4–AL5 aggregate, uncertain secondary placement", "AL1–AL2 aggregate, choice secondary school secured"],
              ["O-Level (Sec 4)", "L1R5 of 20+, Poly-bound only, A-Math failing", "L1R5 of 10–12, JC offer, A-Math distinction"],
              ["IP (Year 3)", "Below median in school assessments, parent concerned", "Above median, school-specific assessment format mastered"],
              ["A-Level (JC2)", "RP 62–65, missed first-choice NUS course", "RP 75–80, NUS / NTU first-choice course offer"],
            ].map(([lvl, before, after], i) => (
              <div key={lvl} className={`grid grid-cols-3 border-t border-border group relative z-10 ${i % 2 === 0 ? 'bg-white/50 dark:bg-white/5' : 'bg-transparent'}`}>
                <div className="px-8 py-8 text-sm font-black text-deep-navy dark:text-white uppercase tracking-tighter italic flex items-center">
                   {lvl}
                </div>
                <div className="px-8 py-8 text-[13px] font-medium text-red-600/80 dark:text-red-400/80 bg-red-500/2 border-l border-border italic leading-relaxed">
                  {before}
                </div>
                <div className="px-8 py-8 text-[13px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-500/4 border-l border-border italic leading-relaxed">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="text-[10px] uppercase tracking-widest text-emerald-500/60">Achieved</span>
                  </div>
                  {after}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Coverage by Level */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-deep-navy dark:text-white mb-4">MOE Subject Coverage at Every Level</h2>
          </motion.div>
          <div className="space-y-10">
            {[{
              level: "Primary (P1–P6)",
              subjects: ["English Language", "Mathematics (model drawing / heuristics)", "Science (P3–P6, OEQ format)", "Chinese Language / Malay Language / Tamil Language", "Higher Mother Tongue", "GEP preparation (P3 screening)"],
              color: "border-emerald-500/30",
              bgColor: "bg-emerald-500/5",
              badgeColor: "bg-emerald-500/10 text-emerald-600",
              accent: "from-emerald-500 to-teal-600",
            }, {
              level: "Secondary (Sec 1–5)",
              subjects: ["English Language", "Elementary Mathematics (E-Math)", "Additional Mathematics (A-Math)", "Combined Science", "Pure Biology / Chemistry / Physics", "Combined Humanities", "Pure History / Geography / Lit", "Mother Tongue Languages"],
              color: "border-blue-500/30",
              bgColor: "bg-blue-500/5",
              badgeColor: "bg-blue-500/10 text-blue-600",
              accent: "from-blue-500 to-indigo-600",
            }, {
              level: "Junior College / IP Y5–6",
              subjects: ["H2 Mathematics (9758)", "H2 Further Math (9649)", "H2 Physics / Chemistry / Bio", "H2 Economics", "H2 History / Geography / Lit", "H1 General Paper (GP)", "H1 Project Work (PW)", "H1/H2 Mother Tongue", "H3 extension subjects"],
              color: "border-purple-500/30",
              bgColor: "bg-purple-500/5",
              badgeColor: "bg-purple-500/10 text-purple-600",
              accent: "from-purple-500 to-violet-600",
            }].map((group, i) => (
              <motion.div
                key={group.level}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.1 } } }}
                className={`group relative rounded-[3rem] bg-white dark:bg-slate-900/50 border ${group.color} overflow-hidden hover:shadow-2xl transition-all`}
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${group.accent}`} />
                <div className="p-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-deep-navy dark:text-white tracking-tighter uppercase italic leading-none">{group.level}</h3>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${group.badgeColor} border border-current/10`}>Full Coverage</span>
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {group.subjects.map((s) => (
                      <div key={s} className="flex items-center gap-3 p-4 rounded-3xl bg-slate-50 dark:bg-white/5 border border-border/50 group-hover:border-sapphire/20 transition-colors">
                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                        <span className="text-[11px] font-bold text-text-secondary dark:text-slate-300 leading-tight uppercase tracking-tight">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">What Singapore Families Say</h2>
            <p className="text-text-secondary">Parents across MOE levels   primary, secondary, and JC</p>
          </motion.div>
          <ParentTestimonials testimonials={testimonials} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">MOE Singapore Curriculum   Common Questions</h2>
          </motion.div>
          <SubjectFAQ items={faqs} />
        </div>
      </section>

      {/* Explore Singapore Pages */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-2xl font-black text-deep-navy dark:text-white mb-3">Explore by MOE Level</h2>
            <p className="text-text-secondary">Specialist pages for each stage of the MOE Singapore pathway</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {internalLinks.map((l, i) => (
              <motion.div key={l.href} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.08 } } }}>
                <Link href={l.href} className="block p-5 rounded-2xl border border-border bg-white dark:bg-white/5 hover:border-primary hover:shadow-lg transition-all group">
                  <p className="font-black text-deep-navy dark:text-white group-hover:text-primary transition-colors mb-1">{l.name}</p>
                  <p className="text-xs text-text-secondary">{l.desc}</p>
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
            <h2 className="text-3xl md:text-4xl font-black mb-4">Start with the Right MOE Singapore Tutor</h2>
            <p className="text-white/70 mb-8 text-lg">From P1 to JC2   we match students to tutors who know the exact MOE level, stream, and school they need.</p>
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
            StudyHours provides specialist online tutors for the full MOE Singapore curriculum pathway. Our tutors cover Primary school (P1–P6) including PSLE Achievement Level preparation, Secondary school (Sec 1–5) including O-Level L1R5 strategy and N-Level, the Integrated Programme (IP Year 1–6) at all 13 Singapore IP schools, and Junior College (JC1–JC2) A-Level H1, H2, and H3 subjects. All tutoring is aligned to current SEAB examination syllabuses including the 2021 PSLE AL scoring system, the 2024 Subject-Based Banding (SBB) rollout, and the latest A-Level H2 subject codes. Whether your child is navigating the Primary 5 PSLE preparation year, preparing for Sec 4 O-Level with an L1R5 target, managing IP Year 3 internal assessments at Raffles Institution or Hwa Chong Institution, or maximising university rank points in JC2   StudyHours connects Singapore families with MOE curriculum specialists who know the exact assessment format their student faces.
          </p>
        </div>
      </section>
    </main>
  );
}
