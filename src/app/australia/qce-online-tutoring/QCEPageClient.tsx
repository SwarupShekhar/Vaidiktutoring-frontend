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
  TrendingUp,
  Languages,
  AlertTriangle,
  FileText,
  Award,
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
    name: "QCE Mathematics",
    tag: "QCAA Aligned",
    tagColor: "bg-red-500/10 text-red-500",
    description:
      "Specialist, Mathematical Methods, and General Mathematics coaching tailored to QCAA syllabuses. We focus on IA preparation, data tests, and external exam strategy for Year 11 and Year 12 QLD students.",
    topics: ["Mathematical Methods", "Specialist Mathematics", "General Mathematics", "IA Data Tests", "External Exam Prep"],
  },
  {
    icon: BookOpen,
    name: "QCE English",
    tag: "Literacy Focus",
    tagColor: "bg-blue-500/10 text-blue-500",
    description:
      "Develop high-level literacy for Queensland senior schooling. Our tutors help you master IA1, IA2, and IA3 analytical and persuasive tasks. We also cover the External Assessment (EA) essay requirements.",
    topics: ["English & Literature QCE", "Analytical Essays (IA1)", "Persuasive Speaking (IA2)", "Multimodal Tasks", "External Assessment"],
  },
  {
    icon: FlaskConical,
    name: "QCE Sciences",
    tag: "Inquiry Based",
    tagColor: "bg-emerald-500/10 text-emerald-500",
    description:
      "Advanced tutoring for Physics, Chemistry, and Biology Units 3/4. We cover data-analysis IAs, student experiment reports, and the QCAA external exam format with detailed structured question practice.",
    topics: ["Physics & Chemistry Units 3/4", "Biology Data Analysis", "Student Experiments (IA3)", "Research Investigation", "QCAA External Exam"],
  },
  {
    icon: Languages,
    name: "QCE Humanities",
    tag: "Electives",
    tagColor: "bg-purple-500/10 text-purple-500",
    description:
      "Expert support for Psychology, Business, Economics, and Modern History under the QCE framework. Focus on source analysis, structured academic reports, and formal essays aligned to QCAA descriptors.",
    topics: ["Psychology QCE", "Business Studies", "Modern History", "Economics QLD", "Legal Studies"],
  },
];

const iaBreakdown = [
  {
    ia: "IA1: Extended Response",
    weight: "25% of subject grade",
    timing: "End of Unit 1-2",
    format: "Research-based essay or investigation (1200-2000 words). QCAA marks for understanding, analysis, and communication.",
    tips: "Our tutors run structured drafting sessions 3 weeks before submission, targeting specific QCAA criteria.",
    color: "border-blue-500/30 bg-blue-500/5",
    badge: "bg-blue-500/10 text-blue-600",
  },
  {
    ia: "IA2: Data Test / Short Response",
    weight: "25% of subject grade",
    timing: "During Units 3-4",
    format: "Stimulus-based short response completed under supervised conditions. Common in Sciences and Maths.",
    tips: "We drill every past QCAA stimulus-style question. Our tutors know how to score full marks on data interpretation.",
    color: "border-red-500/30 bg-red-500/5",
    badge: "bg-red-500/10 text-red-600",
  },
  {
    ia: "IA3: Supervised Assessment",
    weight: "25% of subject grade",
    timing: "End of Units 3-4",
    format: "Supervised in-class task or student experiment report. For Sciences, this is a mandatory practical investigation.",
    tips: "Lab reports have strict QCAA formatting. We teach students the exact criteria-specific language examiners reward.",
    color: "border-emerald-500/30 bg-emerald-500/5",
    badge: "bg-emerald-500/10 text-emerald-600",
  },
  {
    ia: "External Assessment (EA)",
    weight: "25% of subject grade",
    timing: "October-November",
    format: "QCAA-set written exam. For Maths subjects this is 2 papers. For Humanities/Sciences it is 1 paper.",
    tips: "Our intensive EA preparation program runs in the 6 weeks before exam season with timed past-paper drills.",
    color: "border-purple-500/30 bg-purple-500/5",
    badge: "bg-purple-500/10 text-purple-600",
  },
];

const qcaaGrading = [
  { grade: "A", score: "85-100%", meaning: "Excellent: outstanding knowledge and understanding of QCAA criteria", color: "text-emerald-500" },
  { grade: "B", score: "70-84%", meaning: "Good: thorough knowledge with mostly accurate application", color: "text-blue-500" },
  { grade: "C", score: "55-69%", meaning: "Sound: satisfactory knowledge but gaps in higher-order analysis", color: "text-yellow-500" },
  { grade: "D", score: "40-54%", meaning: "Limited: significant gaps across key criteria", color: "text-orange-500" },
  { grade: "E", score: "Below 40%", meaning: "Very Limited: foundational support required immediately", color: "text-red-500" },
];

const brisbaneSchools = [
  "Brisbane State High School", "Stuartholme School", "St Aidan's Anglican Girls School",
  "Padua College", "Villanova College", "Ipswich Grammar School", "Mt Alvernia College",
  "All Hallows School", "Brisbane Grammar School", "QASMT", "Anglican Church Grammar",
  "Nudgee College", "Clayfield College", "Somerville House",
];

const beforeAfter = [
  { before: "IA1 essay stuck at C due to weak thesis and missing QCAA analytical language", after: "Consistent A-range IA1 responses with structured argument and precise academic vocabulary" },
  { before: "QCE Maths Methods data test preparation felt overwhelming", after: "Clear strategy for QCAA data interpretation questions with full marks on practice tests" },
  { before: "Chemistry student experiment report missing key QCAA criteria for IA3", after: "Properly structured lab report with correct QCAA headings, evidence of analysis, and evaluation" },
  { before: "ATAR estimate in low 70s with unclear path to improvement", after: "ATAR projection moved to 85+ after 8 weeks of targeted 1-on-1 IA and EA preparation" },
];

const faqs = [
  { q: "What is the QCAA and how does it differ from other state bodies?", a: "The Queensland Curriculum and Assessment Authority (QCAA) governs the Queensland Certificate of Education (QCE). Unlike the NSW HSC, QCE subjects use a 4-IA + 1-EA structure where internal assessments count for 75% and the external exam counts for 25%. This makes IA preparation especially critical." },
  { q: "How do internal assessments (IAs) work in QCE?", a: "Most QCE subjects have 3 internal assessments (IA1, IA2, IA3) plus 1 external assessment (EA), each worth 25% of the final grade. IAs are set and marked by your school against QCAA criteria. Our tutors help you maximise every IA before it's submitted." },
  { q: "What ATAR do I need for top universities from Queensland?", a: "For the University of Queensland (UQ), Griffith, and QUT's most competitive courses, you typically need 90-99 ATAR. Medicine at UQ requires 99.05+. Our tutors help you identify which subject combinations and IA performances will get you to your target ATAR." },
  { q: "Do you offer QCE Maths Methods tutoring online?", a: "Yes. QCE Mathematical Methods is one of our most popular subjects. Our tutors are top QCE graduates who scored A's in Methods and can help with both IA data tests and the external exam. We cover all 4 units of the QCAA syllabus including calculus, probability, and statistics." },
  { q: "How does the QCAA grading system work?", a: "QCAA grades each IA and the EA on a 5-level scale: A (Excellent), B (Good), C (Sound), D (Limited), E (Very Limited). Your final subject result is a combination of these grades weighted equally at 25% each. An ATAR is then calculated from your best scaled subject results." },
  { q: "Is QCE English compulsory for ATAR?", a: "Yes. To receive an ATAR in Queensland, you must complete English (or English as an Additional Language). Our QCE English tutors specialise in analytical writing, multimodal tasks, and oral assessments that form part of the IA requirements." },
  { q: "When should I start QCE tutoring?", a: "Ideally at the beginning of Year 11 to build strong foundations in the Unit 1-2 work that informs IA1. However, most students join us at the start of Year 12. Even students joining midway through Year 12 can significantly improve IA3 and EA performance with targeted coaching." },
  { q: "Do you support regional Queensland students?", a: "Yes. All our QCE tutoring is delivered online, which means students in Toowoomba, Cairns, Townsville, the Sunshine Coast, Gold Coast, and regional Queensland have full access to the same quality of tutoring as Brisbane-based students." },
];

const testimonials = [
  { text: "The transition to the new QCE system completely changed how assessments work. My tutor understood every detail of the QCAA criteria and helped me restructure my IA1 essay from a C to an A. It changed my trajectory for the year.", author: "Liam S.", role: "Year 12, Brisbane State High School", rating: 5 },
  { text: "QCE Chemistry IA3 was terrifying. The lab report format is completely different from what I'd done before. My tutor walked me through the QCAA criteria one by one and my report got an A. Massive relief.", author: "Jessica K.", role: "Year 12, QASMT", rating: 5 },
  { text: "My son was struggling with QCE Maths Methods data tests. The StudyHours tutor drilled him on every past QCAA stimulus question style. He went from a C in IA2 to a B+ and is on track for an A in his external.", author: "Karen M.", role: "Parent, Gold Coast", rating: 5 },
];

const internalLinks = [
  { label: "VCE Tutoring", href: "/australia/vce-online-tutoring", desc: "Victoria's best VCE online tutors" },
  { label: "HSC Tutoring", href: "/australia/hsc-online-tutoring", desc: "NSW Band 6 specialists" },
  { label: "ATAR Strategy", href: "/australia/atar-online-tutoring", desc: "National ATAR coaching" },
  { label: "WACE Tutoring", href: "/australia/wace-online-tutoring", desc: "Western Australia ATAR courses" },
];

export default function QCEPageClient() {
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
                QCAA Aligned: QCE Specialists Queensland
              </div>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter leading-[0.95] uppercase">
                QCE Tutors <span className="text-sapphire">Online</span>: QLD Experts
              </h1>
              <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary italic mb-8">
                QCAA Aligned · IA Preparation · Senior Schooling
              </div>
              <p className="text-lg text-text-secondary mb-10 leading-relaxed font-medium max-w-xl">
                The QCE&apos;s IA-heavy structure means your academic year never has a quiet period. Our specialist QCE online tutors are high-achieving Queensland graduates who understand the QCAA criteria deeply. Get 1-on-1 coaching for every IA and external exam.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href={ctaHref} className="w-full sm:w-auto px-10 py-5 bg-sapphire text-white font-black rounded-3xl hover:bg-primary transition-all shadow-2xl shadow-sapphire/20 text-center flex items-center justify-center gap-3 group text-lg tracking-tighter">
                  Book Free QCE Session
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="text-sm font-black text-text-secondary uppercase tracking-widest">
                  1:1 · Online · All QCE Subjects
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="flex flex-col gap-4">
              <div className="relative w-full aspect-3/2 rounded-4xl overflow-hidden shadow-2xl border border-border group">
                <Image
                  src={optimizeCloudinaryUrl("https://res.cloudinary.com/de8vvmpip/image/upload/v1776667558/A_focused_senior_202604201214_c26yyg.jpg")}
                  alt="QCE online tutor helping student with IA preparation in Queensland"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[6s]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-deep-navy/20 to-transparent pointer-events-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
              {[
                { num: "75%", label: "IA Weight per Subject", color: "text-sapphire" },
                { num: "4 IAs", label: "Per Subject", color: "text-blue-500" },
                { num: "1:1", label: "Expert Coaching", color: "text-sapphire" },
                { num: "A Grade", label: "Our Target", color: "text-emerald-500" },
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">QCAA Syllabus Coverage</span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase">
              QCE Subjects We <span className="text-sapphire">Specialise In</span>
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

      {/* IA Deep-Dive */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">Assessment Structure</span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase">
              QCE Internal Assessment <span className="text-sapphire">Deep Dive</span>
            </h2>
            <p className="text-base text-text-secondary max-w-2xl mx-auto font-medium">
              Internal assessments make up 75% of your final QCE grade. Understanding each IA type is the key to a top ATAR.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {iaBreakdown.map((ia, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-[3rem] p-10 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm border border-sapphire/10 ${ia.badge}`}>{ia.weight}</span>
                <h3 className="text-xl font-black text-deep-navy dark:text-white uppercase mb-4 tracking-tighter leading-tight italic">{ia.ia}</h3>
                <div className="text-[10px] font-black text-sapphire mb-4 uppercase tracking-[0.2em]">{ia.timing}</div>
                <p className="text-[11px] text-text-secondary font-medium uppercase tracking-widest mb-6 opacity-60 leading-relaxed">{ia.format}</p>
                <p className="text-sm text-text-secondary font-medium leading-relaxed italic border-t border-border/50 pt-6 opacity-80 group-hover:opacity-100 transition-opacity">{ia.tips}</p>
                <div className="absolute bottom-4 right-4 text-sapphire/10 group-hover:text-sapphire/30 transition-colors">
                  <Award size={40} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Grading + Schools */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 border-y border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">QCAA Performance Standards</span>
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase">
              How QCE <span className="text-sapphire">Grades Work</span>
            </h2>
            <div className="space-y-4">
              {qcaaGrading.map((g, i) => (
                <div
                  key={i}
                  className="flex items-center gap-6 p-6 rounded-4xl bg-white dark:bg-slate-900/80 border border-border group hover:border-sapphire/40 transition-all overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-sapphire/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={`text-4xl font-black ${g.color} w-12 text-center relative z-10 italic shadow-sm`}>{g.grade}</div>
                  <div className="relative z-10">
                    <div className="text-[10px] font-black text-sapphire mb-1 uppercase tracking-[0.2em]">{g.score} Range</div>
                    <div className="text-sm text-text-secondary font-medium leading-relaxed italic opacity-80">{g.meaning}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">Queensland Wide</span>
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase">
              Schools We <span className="text-sapphire">Support</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {brisbaneSchools.map((school, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-4 rounded-3xl bg-white/50 dark:bg-white/5 border border-border group/school hover:border-sapphire/40 transition-all overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-sapphire/5 to-transparent opacity-0 group-hover/school:opacity-100 transition-opacity" />
                  <div className="w-1.5 h-1.5 rounded-full bg-sapphire group-hover/school:scale-150 transition-transform relative z-10" />
                  <span className="text-[10px] font-black text-deep-navy dark:text-white uppercase tracking-tight italic leading-tight relative z-10">
                    {school}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-deep-navy dark:text-white tracking-tighter uppercase mb-3">
              Before vs After <span className="text-sapphire">StudyHours</span>
            </h2>
          </div>
          <div className="rounded-[3.5rem] overflow-hidden border border-border/60 shadow-2xl bg-white dark:bg-slate-900/50 relative group">
            <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent pointer-events-none" />
            <div className="grid grid-cols-12 bg-deep-navy text-white text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
              <div className="col-span-12 px-8 py-6 flex items-center justify-between border-b border-white/10">
                <span className="italic">QCE Grade Improvement Pathway</span>
                <span className="text-emerald-400">99+ ATAR Potential</span>
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
      <SubjectFAQ items={faqs} title="Frequently Asked Questions: QCE Tutoring" />

      <section className="py-20 px-6 bg-surface dark:bg-slate-900/30 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">
            Expert QCE Online Tutoring for Brisbane and Queensland
          </h2>
          <div className="prose dark:prose-invert max-w-5xl text-sm text-text-secondary leading-relaxed font-medium">
            <p>
              StudyHours provides expert QCE tutors online for students across Brisbane, the Gold Coast, the Sunshine Coast, Townsville, Cairns, Toowoomba, and regional Queensland. Our specialist QCE tutors are high-achieving QCAA graduates who understand the internal assessment system deeply. Whether you need QCE Mathematical Methods tutoring, QCE Chemistry IA3 preparation, QCE English analytical writing coaching, or QCE Physics external exam drilling, our 1-on-1 sessions are built around the specific QCAA criteria for your subject.
            </p>
            <p className="mt-4">
              Our QCE tutoring program focuses heavily on IA preparation (IA1, IA2, IA3) since these assessments collectively contribute 75% of your final grade before the external exam. We work with students from Brisbane State High, QASMT, Anglican Church Grammar, All Hallows, Padua College, Brisbane Grammar, and many other Queensland schools. All sessions are delivered online, making elite QCE coaching accessible to students across the state regardless of location.
            </p>
            <p className="mt-4">
              For students targeting a 90+ or 99+ ATAR through the QCE, maximising every IA is non-negotiable. StudyHours provides structured preparation for each assessment type, QCAA-criteria-aligned feedback on draft work, and intensive external assessment programs in Term 4. Book a free QCE assessment today and get a personalised plan for your subject priorities.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm font-black text-text-secondary uppercase tracking-widest mb-6">Explore More Australian Tutoring</h2>
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
                <div className="text-sm font-black text-deep-navy dark:text-white uppercase mb-2 tracking-tighter italic leading-tight group-hover:text-sapphire transition-colors relative z-10">{link.label} Strategy</div>
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
            Ready for Your <span className="text-sapphire">Top QCE Result?</span>
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto font-medium">
            Join Queensland students who have achieved A grades and 90+ ATARs with our specialist QCE tutors. Book a free session today.
          </p>
          <Link href={ctaHref} className="inline-block px-12 py-5 bg-sapphire text-white font-black rounded-3xl hover:bg-white hover:text-black transition-all shadow-2xl shadow-sapphire/40 text-lg tracking-wide">
            Book Free QCE Session
          </Link>
        </div>
      </section>
    </main>
  );
}
