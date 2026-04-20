"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Calculator,
  FlaskConical,
  CheckCircle2,
  GraduationCap,
  Languages,
  AlertTriangle,
  Award,
  Users,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../../components/subjects/ParentTestimonials";
import StickyCTA from "../../components/subjects/StickyCTA";
import SubjectFAQ from "../../components/subjects/SubjectFAQ";
import Image from "next/image";

const optimizeCloudinaryUrl = (url: string) => {
  if (url.includes("cloudinary.com") && !url.includes("f_auto")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  }
  return url;
};

const subjects = [
  {
    icon: Calculator,
    name: "AC Mathematics",
    tag: "Prep to Year 10",
    tagColor: "bg-red-500/10 text-red-500",
    description:
      "Building strong Number, Algebra, Measurement, Geometry, Statistics, and Probability foundations aligned with ACARA. We target the proficiency strands: Understanding, Fluency, Problem Solving, and Reasoning: across all year levels.",
    topics: ["Number & Algebra", "Measurement & Geometry", "Statistics & Probability", "Problem Solving", "Reasoning Skills"],
  },
  {
    icon: BookOpen,
    name: "AC English",
    tag: "Language & Literacy",
    tagColor: "bg-blue-500/10 text-blue-500",
    description:
      "Developing literacy across Reading, Writing, Speaking, and Listening. Our tutors focus on the three AC English strands: Language, Literature, and Literacy: with targeted support for comprehension, grammar, and creative writing.",
    topics: ["Literacy & Literature", "Language Conventions", "Reading Comprehension", "Creative Writing", "Grammar & Vocabulary"],
  },
  {
    icon: FlaskConical,
    name: "AC Science",
    tag: "Inquiry Based",
    tagColor: "bg-emerald-500/10 text-emerald-500",
    description:
      "Encouraging scientific inquiry across Biological, Chemical, Earth/Space, and Physical sciences. We teach students to think like scientists: asking questions, designing investigations, and interpreting data from Year 3 onwards.",
    topics: ["Biological Sciences", "Chemical Sciences", "Earth & Space", "Physical Sciences", "Scientific Inquiry Skills"],
  },
  {
    icon: Languages,
    name: "Humanities, HASS & LOTE",
    tag: "F to Year 10",
    tagColor: "bg-purple-500/10 text-purple-500",
    description:
      "Broad support for Humanities and Social Sciences (HASS), History, Geography, Civics, and Languages Other Than English following the national framework. We develop critical thinking and global awareness.",
    topics: ["History & Geography", "Civics & Citizenship", "Economics & Business", "LOTE Support", "Social Studies"],
  },
];

const yearLevels = [
  { range: "Foundation to Year 2", label: "Early Childhood", focus: "Phonics, numeracy foundations, basic science observation, and reading readiness. Critical years for long-term literacy.", color: "bg-blue-500/5 border-blue-500/20", badge: "bg-blue-500/10 text-blue-600" },
  { range: "Year 3 to Year 4", label: "Lower Primary", focus: "Multiplication, fractions, paragraph writing, scientific inquiry introduction. NAPLAN Year 3 preparation.", color: "bg-emerald-500/5 border-emerald-500/20", badge: "bg-emerald-500/10 text-emerald-600" },
  { range: "Year 5 to Year 6", label: "Upper Primary", focus: "Ratios, algebra readiness, persuasive writing, historical inquiry. NAPLAN Year 5 preparation and school transition readiness.", color: "bg-yellow-500/5 border-yellow-500/20", badge: "bg-yellow-500/10 text-yellow-600" },
  { range: "Year 7 to Year 8", label: "Junior Secondary", focus: "Algebra, data analysis, essay writing, chemistry and biology introduction. Critical transition from primary to secondary thinking.", color: "bg-orange-500/5 border-orange-500/20", badge: "bg-orange-500/10 text-orange-600" },
  { range: "Year 9 to Year 10", label: "Senior Foundation", focus: "ATAR pathway preparation, algebraic functions, advanced writing, physics and chemistry foundations. Gateway to VCE/HSC/QCE/WACE.", color: "bg-red-500/5 border-red-500/20", badge: "bg-red-500/10 text-red-600" },
];

const stateAdaptations = [
  { state: "Victoria", adaptation: "Victorian Curriculum (VC): closely follows ACARA with Victorian-specific additions.", link: "/australia/vce-online-tutoring" },
  { state: "New South Wales", adaptation: "NSW Syllabus: adapts ACARA with NSW-specific content in each key learning area.", link: "/australia/hsc-online-tutoring" },
  { state: "Queensland", adaptation: "Australian Curriculum as adopted by QCAA with QLD-specific assessment approaches.", link: "/australia/qce-online-tutoring" },
  { state: "Western Australia", adaptation: "SCSA adapts AC for WA schools with state-specific reporting frameworks.", link: "/australia/wace-online-tutoring" },
  { state: "South Australia", adaptation: "SACE Board adopts ACARA with SA-specific SACE pathway integration.", link: "/australia/curriculum-tutoring" },
  { state: "All Other States", adaptation: "NT, TAS, ACT all implement the national curriculum with minor local adaptations.", link: "/australia/curriculum-tutoring" },
];

const naplanInfo = [
  { year: "Year 3", areas: "Reading, Writing, Language Conventions, Numeracy", timing: "Term 1 (March)", tip: "Begin preparation 3 months prior. Focus on comprehension strategies and numeracy speed." },
  { year: "Year 5", areas: "Reading, Writing, Language Conventions, Numeracy", timing: "Term 1 (March)", tip: "Students often underestimate Year 5. Persuasive writing and multi-step maths are key targets." },
  { year: "Year 7", areas: "Reading, Writing, Language Conventions, Numeracy", timing: "Term 1 (March)", tip: "Critical transition year. Grammar conventions and algebra foundations are common weak points." },
  { year: "Year 9", areas: "Reading, Writing, Language Conventions, Numeracy", timing: "Term 1 (March)", tip: "Most strategically important. Year 9 NAPLAN results inform senior school pathways and scholarship eligibility." },
];

const beforeAfter = [
  { before: "Year 5 student reading below expected level, struggling with comprehension tasks", after: "Reading at expected level, confident with comprehension strategies and extended writing" },
  { before: "Year 7 transition causing anxiety, algebra concepts unclear", after: "Settled into secondary school maths with strong algebraic foundations" },
  { before: "Year 9 student not meeting NAPLAN benchmark in numeracy", after: "Exceeded NAPLAN numeracy benchmark, now tracking for senior ATAR pathway" },
  { before: "Parent unsure which state curriculum applies and what tutor to look for", after: "Clear tutoring plan aligned to school's state adaptation with term-by-term progress tracking" },
];

const faqs = [
  { q: "What is ACARA and the Australian Curriculum?", a: "ACARA (Australian Curriculum, Assessment and Reporting Authority) develops the national curriculum framework that defines what all Australian students should learn from Foundation to Year 10. It covers 8 learning areas: English, Mathematics, Science, Humanities and Social Sciences, The Arts, Technologies, Health and PE, and Languages." },
  { q: "Is the Australian Curriculum the same in every state?", a: "The national curriculum sets the framework, but each state implements it with local adaptations. Victoria uses the Victorian Curriculum, NSW has its own Syllabus, and WA uses SCSA. Our tutors are trained in both the national framework and its state-specific implementations, so they match your child's exact school curriculum." },
  { q: "What is NAPLAN and how should I prepare my child?", a: "NAPLAN (National Assessment Program: Literacy and Numeracy) tests students in Years 3, 5, 7, and 9 in Reading, Writing, Language Conventions, and Numeracy. Results place students in bands 1-10 (Year 9) or 1-8 (Year 3). Our tutors provide structured NAPLAN preparation starting 3 months before the March testing window." },
  { q: "What year level does the Australian Curriculum cover?", a: "The Australian Curriculum covers Foundation (Prep/Kindy/Reception) through to Year 10. After Year 10, students enter state-specific senior secondary pathways: VCE (Victoria), HSC (NSW), QCE (Queensland), WACE (WA), and SACE (SA)." },
  { q: "When is the best age to start tutoring for the Australian Curriculum?", a: "Many parents start in Year 3-4 to build strong literacy and numeracy foundations before NAPLAN. Others start in Years 7-8 during the primary-to-secondary transition. The most impactful window for senior pathway preparation is Years 9-10, when students are making senior subject selections." },
  { q: "Do you offer tutoring for Year 7 transition support?", a: "Yes. The Year 7 transition is one of the most critical academic transitions in Australian schooling. Content difficulty increases significantly, especially in Maths and Science. Our Year 7 transition program runs over 8 weeks and covers algebra, scientific method, essay writing, and study skills." },
  { q: "Can you support selective school or scholarship exam preparation?", a: "Yes. Students preparing for selective school entry tests (Year 7 entry or Year 9 entry) or private school scholarships benefit significantly from our foundational curriculum tutoring. We focus on the mathematics and verbal reasoning skills that these tests assess within the national curriculum framework." },
  { q: "Do you cover digital technologies and the Arts in the Australian Curriculum?", a: "Our primary focus is on English, Mathematics, and Science, as these are the highest-impact subjects for NAPLAN and senior pathway success. We can provide support for Humanities, History, and Geography as well. For Technologies and Arts, please discuss your specific needs with our team during the free assessment." },
];

const testimonials = [
  { text: "The transition from primary to high school was much smoother with a StudyHours tutor helping my daughter master Year 7 curriculum concepts early. She went from struggling in maths to being confident within two terms.", author: "Emma G.", role: "Parent, South Australia", rating: 5 },
  { text: "My Year 9 son was not meeting the NAPLAN numeracy benchmark. His tutor identified specific gaps in algebra and data interpretation, and by the time of testing he exceeded the benchmark comfortably.", author: "Tom K.", role: "Parent, Brisbane", rating: 5 },
  { text: "We moved from overseas and were unsure which Australian Curriculum level our daughter should be at. The StudyHours assessment immediately identified gaps in specific Year 5 content, and her catch-up program was perfect.", author: "Yuki N.", role: "Parent, Melbourne", rating: 5 },
];

const internalLinks = [
  { label: "VCE Tutoring", href: "/australia/vce-online-tutoring", desc: "Victoria's best VCE specialists" },
  { label: "HSC Tutoring", href: "/australia/hsc-online-tutoring", desc: "NSW Band 6 experts" },
  { label: "ATAR Strategy", href: "/australia/atar-online-tutoring", desc: "National ATAR coaching" },
  { label: "QCE Tutoring", href: "/australia/qce-online-tutoring", desc: "Queensland QCAA specialists" },
];

export default function CurriculumPageClient() {
  const { user } = useAuthContext();
  const ctaHref = user ? "/bookings/new" : "/signup?type=assessment";

  return (
    <main className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      <StickyCTA />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-ice-blue/40 to-transparent dark:from-sapphire/5 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pt-32 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/60 backdrop-blur-md border border-border text-[10px] font-black tracking-[0.2em] text-sapphire mb-8 uppercase">
                <ShieldCheck size={14} />
                ACARA Aligned: Foundation to Year 10
              </div>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter leading-[0.95] uppercase">
                Australian Curriculum <span className="text-sapphire">Tutors</span> Online
              </h1>
              <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary italic mb-8">
                National Standards · ACARA Aligned · 1-on-1 Coaching
              </div>
              <p className="text-lg text-text-secondary mb-10 leading-relaxed font-medium max-w-xl">
                Build a world-class academic foundation with tutoring aligned to the Australian Curriculum (ACARA). Our expert mentors support students from Foundation through Year 10 across all states and territories.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href={ctaHref} className="w-full sm:w-auto px-10 py-5 bg-sapphire text-white font-black rounded-3xl hover:bg-primary transition-all shadow-2xl shadow-sapphire/20 text-center flex items-center justify-center gap-3 group text-lg tracking-tighter">
                  Book Free Curriculum Session
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="text-sm font-black text-text-secondary uppercase tracking-widest">
                  1:1 · All States · F to Year 10
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="flex flex-col gap-4">
              <div className="relative w-full aspect-3/2 rounded-4xl overflow-hidden shadow-2xl border border-border group">
                <Image
                  src={optimizeCloudinaryUrl("https://res.cloudinary.com/de8vvmpip/image/upload/v1776668342/A_clean__minimal_202604201228_a3cs1h.jpg")}
                  alt="Online tutor helping primary school student with NAPLAN preparation"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[6s]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-deep-navy/20 to-transparent pointer-events-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
              {[
                { num: "F-10", label: "Year Levels Covered", color: "text-sapphire" },
                { num: "8", label: "Learning Areas", color: "text-blue-500" },
                { num: "6", label: "States + Territories", color: "text-sapphire" },
                { num: "NAPLAN", label: "Exam Preparation", color: "text-emerald-500" },
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-border text-center shadow-sm">
                  <div className={`text-2xl font-black tracking-tighter ${stat.color} mb-1`}>{stat.num}</div>
                  <div className="text-[9px] font-black text-text-secondary uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Subject Cards */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">Curriculum Mastery</span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase">
              Australian Curriculum <span className="text-sapphire">Learning Areas</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subjects.map((subject, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-[3rem] p-10 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-sapphire to-primary" />
                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-white/10 flex items-center justify-center text-sapphire group-hover:scale-110 transition-all shadow-sm">
                    <subject.icon size={32} />
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${subject.tagColor} shadow-sm border border-sapphire/10`}>
                    {subject.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase leading-tight group-hover:text-sapphire transition-colors">
                  {subject.name}
                </h3>
                <p className="text-sm text-text-secondary font-medium leading-relaxed mb-8 opacity-80 italic">
                  {subject.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {subject.topics.map((t) => (
                    <span key={t} className="px-3 py-1.5 rounded-xl bg-background dark:bg-white/5 border border-border text-[10px] font-black text-deep-navy dark:text-white/70 uppercase tracking-tight">{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Year Level Breakdown */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">Year Level Coverage</span>
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase">
              Foundation to Year 10 <span className="text-sapphire">Breakdown</span>
            </h2>
          </div>
          <div className="space-y-4">
            {yearLevels.map((level, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative rounded-4xl p-8 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all overflow-hidden flex flex-col md:flex-row md:items-center gap-8"
              >
                <div className="absolute inset-0 bg-linear-to-r from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-24 h-24 rounded-3xl bg-slate-50 dark:bg-white/10 flex items-center justify-center shrink-0 relative z-10 group-hover:scale-110 transition-transform shadow-sm">
                  <GraduationCap size={40} className="text-sapphire" />
                </div>
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-xl font-black text-deep-navy dark:text-white tracking-tighter uppercase italic">{level.label}</h3>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${level.badge}`}>{level.range}</span>
                  </div>
                  <p className="text-sm text-text-secondary font-medium leading-relaxed italic opacity-80">{level.focus}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NAPLAN Deep-Dive */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">National Testing</span>
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase">
              NAPLAN Preparation <span className="text-sapphire">by Year Level</span>
            </h2>
            <p className="text-base text-text-secondary max-w-2xl mx-auto font-medium">
              NAPLAN results affect school progression, selective school eligibility, and senior pathway options. We prepare students from 3 months out.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {naplanInfo.map((n, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-4xl p-10 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/50 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-sapphire/10 text-sapphire text-[10px] font-black uppercase tracking-widest border border-sapphire/20">{n.year}</span>
                    <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] italic opacity-60">{n.timing}</span>
                  </div>
                  <Zap size={20} className="text-sapphire" />
                </div>
                <div className="text-sm font-black text-deep-navy dark:text-white uppercase mb-4 tracking-tighter italic leading-tight group-hover:text-sapphire transition-colors relative z-10">{n.areas}</div>
                <p className="text-[13px] text-text-secondary font-medium leading-relaxed italic opacity-80 relative z-10">{n.tip}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* State Adaptations */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">State Coverage</span>
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase">
              How Each State <span className="text-sapphire">Implements AC</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stateAdaptations.map((s, i) => (
              <Link
                key={i}
                href={s.link}
                className="group relative flex flex-col p-8 rounded-4xl bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/50 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h3 className="text-sm font-black text-deep-navy dark:text-white uppercase tracking-tighter italic group-hover:text-sapphire transition-colors">{s.state}</h3>
                  <ArrowRight size={14} className="text-sapphire opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
                <p className="text-[11px] text-text-secondary font-medium leading-relaxed italic opacity-70 group-hover:opacity-100 transition-all mb-4 relative z-10">{s.adaptation}</p>
                <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between relative z-10">
                  <span className="text-[9px] font-black text-sapphire uppercase tracking-widest group-hover:translate-x-1 transition-transform">View Curriculum</span>
                  <BookOpen size={14} className="text-text-secondary opacity-20" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-deep-navy dark:text-white tracking-tighter uppercase mb-3">
              Before vs After <span className="text-sapphire">Curriculum Tutoring</span>
            </h2>
          </div>
          <div className="rounded-[3.5rem] overflow-hidden border border-border/60 shadow-2xl bg-white relative group">
            <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent pointer-events-none" />
            <div className="grid grid-cols-12 bg-deep-navy text-white text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
              <div className="col-span-12 px-8 py-6 flex items-center justify-between border-b border-white/10">
                <span className="italic">Curriculum Mastery Trajectory</span>
                <span className="text-emerald-400">NAPLAN High Achievement</span>
              </div>
            </div>
            <div className="divide-y divide-border relative z-10">
              {beforeAfter.map((row, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 group divide-x divide-border">
                  <div className="p-10 bg-red-50/20 dark:bg-red-900/5 group-hover:bg-red-50/40 dark:hover:bg-red-900/10 transition-colors">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <TrendingUp size={12} className="rotate-180" /> Baseline Prediction
                    </span>
                    <p className="text-[13px] text-text-secondary font-medium leading-relaxed italic">{row.before}</p>
                  </div>
                  <div className="p-10 bg-emerald-50/20 dark:bg-emerald-900/5 group-hover:bg-emerald-50/40 dark:hover:bg-emerald-900/10 transition-colors">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <CheckCircle2 size={12} /> StudyHours Outcome
                    </span>
                    <p className="text-[13px] text-deep-navy dark:text-white font-black leading-relaxed italic">{row.after}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ParentTestimonials testimonials={testimonials} />
      <SubjectFAQ items={faqs} title="Frequently Asked Questions: Australian Curriculum Tutoring" />

      <section className="py-20 px-6 bg-surface dark:bg-slate-900/30 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">
            Expert Australian Curriculum Tutors Online: Prep to Year 10
          </h2>
          <div className="prose dark:prose-invert max-w-5xl text-sm text-text-secondary leading-relaxed font-medium">
            <p>
              StudyHours provides expert online tutoring for the Australian Curriculum (ACARA) from Foundation through Year 10, covering all states and territories. Our 1-on-1 sessions are aligned with the national curriculum framework across all 8 learning areas, with particular expertise in English, Mathematics, and Science. We support students at government schools, Catholic schools, and independent schools across Victoria, New South Wales, Queensland, Western Australia, South Australia, and beyond.
            </p>
            <p className="mt-4">
              Our Australian Curriculum tutoring program is designed to build the strong academic foundations necessary for success in senior secondary study (VCE, HSC, QCE, WACE, and SACE). We provide NAPLAN preparation for Years 3, 5, 7, and 9, Year 7 transition support, selective school exam preparation, and catch-up programs for students who have fallen behind year-level expectations. Our tutors understand both the national curriculum framework and the state-specific adaptations used in each jurisdiction.
            </p>
            <p className="mt-4">
              Whether your child needs primary school reading support, Year 9 algebra coaching, or help transitioning from an overseas curriculum to the Australian system, StudyHours has a specialist tutor to match. Book a free Australian Curriculum assessment today and get a personalised learning plan for your child.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm font-black text-text-secondary uppercase tracking-widest mb-6">Senior Secondary Pathways</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {internalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col p-8 rounded-4xl bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/50 transition-all group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <span className="text-[10px] font-black text-sapphire uppercase tracking-[0.2em] italic leading-none">{link.label}</span>
                  <ArrowRight size={14} className="text-sapphire opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
                <div className="text-sm font-black text-deep-navy dark:text-white uppercase mb-2 tracking-tighter italic leading-tight group-hover:text-sapphire transition-colors relative z-10">{link.label} Pathway</div>
                <p className="text-[11px] text-text-secondary font-medium leading-relaxed italic opacity-70 relative z-10">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-deep-navy dark:bg-black text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-sapphire/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter italic">
            Build the Foundation <span className="text-sapphire">For ATAR Success</span>
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto font-medium">
            Strong Year 1-10 foundations predict senior secondary success. Start your child on the right path today with ACARA-aligned 1-on-1 tutoring.
          </p>
          <Link href={ctaHref} className="inline-block px-12 py-5 bg-sapphire text-white font-black rounded-3xl hover:bg-white hover:text-black transition-all shadow-2xl shadow-sapphire/40 text-lg tracking-wide">
            Book Free Curriculum Session
          </Link>
        </div>
      </section>
    </main>
  );
}
