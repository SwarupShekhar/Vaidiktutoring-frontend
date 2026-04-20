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
  Award,
  TrendingUp,
  Languages,
  AlertTriangle,
  FileText,
  Clock,
  Target,
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
    name: "HSC Mathematics",
    tag: "Highest Scaling",
    tagColor: "bg-red-500/10 text-red-500",
    description:
      "Advanced, Extension 1, and Extension 2 tutoring for Band 6 results. Our tutors have scored 99+ in HSC Advanced Maths and Extension subjects. We cover all syllabus topics with NESA-style exam drills and worked solutions.",
    topics: ["Maths Advanced", "Extension 1 Maths", "Extension 2 Maths", "Standard Maths", "NESA Exam Techniques"],
  },
  {
    icon: BookOpen,
    name: "HSC English",
    tag: "Compulsory Subject",
    tagColor: "bg-blue-500/10 text-blue-500",
    description:
      "Advanced, Standard, and Extension 1/2 coaching. From Area of Study discovery to Module responses, we help you write Band 6-quality essays aligned with NESA's marking criteria. Expert support for EAL/D students too.",
    topics: ["English Advanced", "English Extension 1/2", "Module Analysis", "Creative Writing", "EAL/D Support"],
  },
  {
    icon: FlaskConical,
    name: "HSC Sciences",
    tag: "STEM Excellence",
    tagColor: "bg-emerald-500/10 text-emerald-500",
    description:
      "Physics, Chemistry, Biology, and Earth Science coaching. We focus on depth study requirements, 20-mark extended responses, and the NESA exam format. Our tutors are science graduates from Sydney&apos;s top universities.",
    topics: ["Physics Depth Study", "Chemistry Module 8", "Biology Working Scientifically", "Formulae Application", "Data Analysis"],
  },
  {
    icon: Languages,
    name: "HSC Humanities",
    tag: "Broad Electives",
    tagColor: "bg-purple-500/10 text-purple-500",
    description:
      "Modern History, Ancient History, Economics, Business Studies, Legal Studies, and Geography. NESA-focused essay writing, source analysis, and exam strategy for Band 6 performance in humanities subjects.",
    topics: ["Modern & Ancient History", "Economics HSC", "Legal Studies", "Business Studies", "Geography"],
  },
];

const bandGuide = [
  { band: "Band 6", range: "90-100", meaning: "Outstanding: top university courses (Medicine, Law, Engineering at USyd/UNSW)", color: "bg-emerald-500" },
  { band: "Band 5", range: "80-89", meaning: "High: most university courses with competitive ATARs", color: "bg-blue-500" },
  { band: "Band 4", range: "70-79", meaning: "Good: broad university entry with strategic ATAR building", color: "bg-yellow-500" },
  { band: "Band 3", range: "60-69", meaning: "Satisfactory: targeted tutoring needed for improvement", color: "bg-orange-500" },
  { band: "Band 2", range: "50-59", meaning: "Limited: foundational gaps need addressing immediately", color: "bg-red-400" },
];

const assessmentSplit = [
  { component: "School-Based Assessment (SBA)", weight: "50%", detail: "Assessments set by your school throughout Years 11-12. Marks are moderated against your trial exam performance.", color: "border-blue-500/30 bg-blue-500/5" },
  { component: "External HSC Exam (NESA)", weight: "50%", detail: "Written exams set and marked by NESA in October-November each year. All Band 6 attempts start here.", color: "border-sapphire/30 bg-sapphire/5" },
];

const scalingSubjects = [
  { subject: "Maths Extension 2", avgScaled: "~48.5", rawNeeded: "85+", band: "Band 6" },
  { subject: "Maths Extension 1", avgScaled: "~46.5", rawNeeded: "88+", band: "Band 6" },
  { subject: "Physics", avgScaled: "~44.5", rawNeeded: "90+", band: "Band 6" },
  { subject: "Chemistry", avgScaled: "~43.0", rawNeeded: "90+", band: "Band 6" },
  { subject: "Economics", avgScaled: "~42.5", rawNeeded: "88+", band: "Band 6" },
];

const sydneySchools = [
  "James Ruse Agricultural High", "North Sydney Boys High", "Girraween High", "Baulkham Hills High",
  "Sydney Grammar School", "Knox Grammar", "Abbotsleigh", "Pymble Ladies College",
  "Shore School", "SCEGGS Darlinghurst", "Barker College", "Trinity Grammar Sydney",
  "Sydney Boys High", "Fort Street High", "Normanhurst Boys High",
];

const hscTimeline = [
  { period: "Year 11 Prelim", label: "Preliminary Course", desc: "Not counted for ATAR, but sets internal ranks and builds the foundation for Year 12 assessments.", urgency: false },
  { period: "Year 12 Term 1", label: "SBA Tasks Begin", desc: "School assessments begin counting immediately. Internal rank vs your cohort is established early.", urgency: true },
  { period: "Year 12 Term 2", label: "Half-Yearly + Mid-Course", desc: "Critical rank adjustment period. Our tutors ensure you're performing at your peak for every task.", urgency: true },
  { period: "Year 12 Term 3", label: "Trial HSC Exams", desc: "Trial exams set your estimated mark for NESA moderation. Aim for at least Band 5 in your trial.", urgency: true },
  { period: "October-November", label: "HSC External Exams", desc: "NESA exams across all subjects. We run a 6-week intensive program leading into exam season.", urgency: true },
];

const beforeAfter = [
  { before: "Stuck on Extension 1 Maths harder inequality proofs", after: "Systematic approach to 4-mark proofs with consistent full marks in practice exams" },
  { before: "English essays stuck at Band 4 with no clear structure", after: "Band 6 quality responses with strong thesis, integrated quotations, and module-specific language" },
  { before: "Chemistry depth study causing major confusion", after: "Clear framework for depth study write-up and working scientifically skills" },
  { before: "Trial HSC score tracking for ATAR around 75-80", after: "ATAR projection revised to 90+ after targeted 10-week intensive program" },
];

const faqs = [
  { q: "What is an HSC ATAR and how is it calculated?", a: "The HSC ATAR (Australian Tertiary Admission Rank) is calculated from your 10 best NESA units (2 units = 1 subject). Your raw exam marks are scaled and aligned to a national rank from 0 to 99.95. NSW students compete with all other Year 12 students nationally." },
  { q: "How do school assessments affect my HSC mark?", a: "School-Based Assessments (SBA) count for 50% of your final HSC mark. However, the SBA mark reported is moderated by NESA against your school's performance in the external exam. This means your external exam performance still matters even for the SBA component." },
  { q: "What is a Band 6 and how do I achieve it?", a: "A Band 6 is awarded when you score 90-100 in a subject. For high-scaling subjects like Maths Extension, this means 85+ raw marks. Our tutors are Band 6 graduates who know exactly what NESA looks for. Typically, 3-6 months of consistent 1-on-1 coaching is needed to move from Band 4-5 to Band 6." },
  { q: "Is HSC Maths Extension 2 worth taking for ATAR purposes?", a: "Yes, Extension 2 is one of the best-scaling subjects in the HSC. Even a moderate mark in Ext 2 can significantly boost your ATAR compared to taking a 4th non-scaling elective. Our Extension 2 tutors have scored 99+ in the subject and specialise in proof, complex numbers, and calculus." },
  { q: "How does StudyHours help with HSC trial exams?", a: "We run a dedicated Trial HSC preparation program in Term 3. This includes full past-paper practice under timed conditions, marking using NESA criteria, and detailed feedback on common error patterns. Trial performance directly influences your SBA moderation." },
  { q: "Do you tutor students from selective schools in Sydney?", a: "Yes. We have significant experience tutoring students from James Ruse, North Sydney Boys, Girraween, Baulkham Hills, Sydney Boys High, and other selective schools. Our tutors often attended these schools themselves and understand the highly competitive cohort dynamics." },
  { q: "When should I start HSC tutoring?", a: "Ideally at the start of Year 11 to build strong preliminary foundations. However, many students join us at the start of Year 12 as assessments begin. Even students joining in Term 2 or 3 of Year 12 can make significant gains with our intensive programs." },
  { q: "What subjects have the highest ATAR scaling in NSW?", a: "Maths Extension 2 and Extension 1 are typically the highest scaling. Physics, Chemistry, Economics, and Modern History also scale very well. Our tutors will advise you on subject selection strategy during your free assessment." },
];

const testimonials = [
  { text: "My tutor had scored 99 in Extension 2 Maths from James Ruse. He knew every trick question NESA uses. My son went from Band 4 in his trials to Band 6 in the actual HSC. Incredible result.", author: "David W.", role: "Parent, James Ruse Agricultural High", rating: 5 },
  { text: "I was getting B's in English Advanced and had no idea how to structure a Module B response. After 8 sessions, I had a clear framework and my Band 6 essay structure was locked in. Got 95 in my HSC English.", author: "Aisha N.", role: "Year 12, North Sydney Girls High", rating: 5 },
  { text: "Chemistry in Year 12 nearly broke me. The StudyHours tutor broke down every Module 8 concept and showed me exactly how to write a 20-mark extended response. I ended up with a Band 6.", author: "Marcus T.", role: "Year 12, Knox Grammar", rating: 5 },
];

const internalLinks = [
  { label: "VCE Tutoring", href: "/australia/vce-online-tutoring", desc: "Victoria's best VCE online tutors" },
  { label: "ATAR Strategy", href: "/australia/atar-online-tutoring", desc: "National ATAR coaching and scaling advice" },
  { label: "QCE Tutoring", href: "/australia/qce-online-tutoring", desc: "Queensland senior school experts" },
  { label: "WACE Tutoring", href: "/australia/wace-online-tutoring", desc: "Perth and WA ATAR tutoring" },
];

export default function HSCPageClient() {
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
                NESA Aligned: HSC Specialists New South Wales
              </div>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter leading-[0.95] uppercase">
                HSC Tutors <span className="text-sapphire">Online</span>: Band 6 Experts
              </h1>
              <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary italic mb-8">
                NESA Aligned · SBA Preparation · Band 6 Focus
              </div>
              <p className="text-lg text-text-secondary mb-10 leading-relaxed font-medium max-w-xl">
                The HSC is one of Australia&apos;s most competitive exams. Our online HSC tutors are Band 6 graduates from Sydney&apos;s top schools who know the NESA marking criteria inside out. Get 1-on-1 coaching built around your exact school and cohort.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href={ctaHref} className="w-full sm:w-auto px-10 py-5 bg-sapphire text-white font-black rounded-3xl hover:bg-primary transition-all shadow-2xl shadow-sapphire/20 text-center flex items-center justify-center gap-3 group text-lg tracking-tighter">
                  Book Free HSC Session
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="text-sm font-black text-text-secondary uppercase tracking-widest">
                  1:1 · Online · All HSC Subjects
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="flex flex-col gap-4">
              <div className="relative w-full aspect-3/2 rounded-4xl overflow-hidden shadow-2xl border border-border group">
                <Image
                  src={optimizeCloudinaryUrl("https://res.cloudinary.com/de8vvmpip/image/upload/v1776667956/Young_child_reading_202604201222_hhyd8x.jpg")}
                  alt="HSC online tutor helping Sydney student with Band 6 preparation"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[6s]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-deep-navy/20 to-transparent pointer-events-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
              {[
                { num: "Band 6", label: "Tutor Standard", color: "text-sapphire" },
                { num: "50%", label: "SBA Weight", color: "text-blue-500" },
                { num: "1:1", label: "Personal Mentoring", color: "text-sapphire" },
                { num: "99.95", label: "Max ATAR Possible", color: "text-emerald-500" },
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">NESA Syllabus Coverage</span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase">
              HSC Subjects We <span className="text-sapphire">Specialise In</span>
            </h2>
            <p className="text-base text-text-secondary max-w-2xl mx-auto font-medium">
              Our tutors are NESA-qualified with direct experience in the specific modules and depth studies that define HSC performance.
            </p>
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

      {/* Band Guide */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">Performance Standards</span>
              <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase">
                Understanding the <span className="text-sapphire">HSC Band System</span>
              </h2>
              <p className="text-base text-text-secondary font-medium mb-8">
                Every HSC subject is graded in Bands 1-6. Band 6 is the gold standard for ATAR calculations and university entry. Our target for every student is Band 5 minimum, Band 6 where possible.
              </p>
              <div className="space-y-4">
                {bandGuide.map((band, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-6 p-6 rounded-4xl bg-white dark:bg-slate-900/80 border border-border group hover:border-sapphire/40 transition-all overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-sapphire/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className={`w-3 h-12 rounded-full ${band.color} shrink-0 relative z-10 shadow-sm`} />
                    <div className="relative z-10 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-black text-deep-navy dark:text-white uppercase tracking-tighter italic">{band.band}</span>
                        <span className="text-[10px] font-black text-sapphire uppercase tracking-widest leading-none">{band.range} Range</span>
                      </div>
                      <p className="text-[11px] text-text-secondary font-medium leading-relaxed italic opacity-80">{band.meaning}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">Assessment Structure</span>
              <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase">
                SBA vs External <span className="text-sapphire">Exams</span>
              </h2>
              <div className="space-y-4 mb-10">
                {assessmentSplit.map((comp, i) => (
                  <div
                    key={i}
                    className="group relative rounded-4xl p-8 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <h3 className="text-[10px] font-black text-sapphire uppercase tracking-[0.2em] italic">{comp.component}</h3>
                      <div className="text-3xl font-black text-deep-navy dark:text-white tracking-tighter">{comp.weight}</div>
                    </div>
                    <p className="text-[13px] text-text-secondary font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity relative z-10">{comp.detail}</p>
                    <div className="absolute bottom-3 right-4 opacity-5 group-hover:opacity-20 transition-opacity">
                      <TrendingUp size={32} />
                    </div>
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">Top Scaling Subjects</span>
              <div className="space-y-3">
                {scalingSubjects.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-5 rounded-3xl bg-white/50 dark:bg-white/5 border border-border group/scale hover:border-sapphire/40 transition-all overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-sapphire/5 to-transparent opacity-0 group-hover/scale:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="text-sm font-black text-deep-navy dark:text-white uppercase tracking-tighter italic">{s.subject}</div>
                      <div className="text-[9px] text-text-secondary font-black uppercase tracking-widest opacity-60">Target: {s.band}</div>
                    </div>
                    <div className="text-right relative z-10">
                      <div className="text-xl font-black text-sapphire tracking-tighter">{s.avgScaled}</div>
                      <div className="text-[9px] text-text-secondary font-black uppercase tracking-widest leading-none">Raw: {s.rawNeeded}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">HSC Journey</span>
            <h2 className="text-4xl font-black text-deep-navy dark:text-white tracking-tighter uppercase mb-4">
              Your HSC <span className="text-sapphire">Timeline</span>
            </h2>
          </div>
          <div className="space-y-4">
            {hscTimeline.map((step, i) => (
              <div key={i} className={`p-6 rounded-4xl border transition-all group overflow-hidden relative ${step.urgency ? "border-red-500/30 bg-red-500/5" : "border-border bg-white"}`}>
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <span className="text-[10px] font-black text-sapphire uppercase tracking-[0.2em] italic">{step.period}</span>
                  {step.urgency && <span className="flex items-center gap-1.5 text-[9px] font-black text-red-500 uppercase tracking-widest"><AlertTriangle size={12} /> Priority</span>}
                </div>
                <div className="text-base font-black text-deep-navy dark:text-white uppercase mb-2 tracking-tighter italic relative z-10">{step.label}</div>
                <p className="text-sm text-text-secondary font-medium leading-relaxed italic opacity-80 relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sydney Schools */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">NSW Wide</span>
          <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase">
            Schools We Support <span className="text-sapphire">Across NSW</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {sydneySchools.map((school, i) => (
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
      </section>

      {/* Before / After */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-deep-navy dark:text-white tracking-tighter uppercase mb-3">
              Results That <span className="text-sapphire">Speak for Themselves</span>
            </h2>
          </div>
          <div className="rounded-[3.5rem] overflow-hidden border border-border/60 shadow-2xl bg-white relative group">
            <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent pointer-events-none" />
            <div className="grid grid-cols-12 bg-deep-navy text-white text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
              <div className="col-span-12 px-8 py-6 flex items-center justify-between border-b border-white/10">
                <span className="italic">HSC Performance Trajectory</span>
                <span className="text-emerald-400">Band 6 Achievement Path</span>
              </div>
            </div>
            <div className="divide-y divide-border relative z-10">
              {beforeAfter.map((row, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 group divide-x divide-border">
                  <div className="p-10 bg-red-50/20 dark:bg-red-900/5 group-hover:bg-red-50/40 dark:hover:bg-red-900/10 transition-colors">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <TrendingUp size={12} className="rotate-180" /> Baseline Expectation
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
      <SubjectFAQ items={faqs} title="Frequently Asked Questions: HSC Tutoring" />

      {/* SEO Paragraph */}
      <section className="py-20 px-6 bg-surface dark:bg-slate-900/30 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">
            Expert HSC Online Tutoring for Sydney and New South Wales
          </h2>
          <div className="prose dark:prose-invert max-w-5xl text-sm text-text-secondary leading-relaxed font-medium">
            <p>
              StudyHours provides expert HSC tutors online for students across Sydney, Newcastle, Wollongong, the Central Coast, and all of New South Wales. Our specialist HSC tutors are Band 6 graduates with direct experience in NESA marking criteria, depth study requirements, and school-based assessment strategies. Whether you need HSC Maths Advanced tutoring, HSC Extension 1 coaching, HSC English Advanced Module B support, or HSC Chemistry depth study help, our 1-on-1 sessions are tailored to your school and your cohort.
            </p>
            <p className="mt-4">
              Our HSC tutoring program covers all Year 11 Preliminary and Year 12 HSC subjects with particular expertise in high-scaling subjects including Maths Extension 2, Physics, Chemistry, and Economics. We work with students from selective schools including James Ruse, North Sydney Boys, Girraween, Baulkham Hills, and Sydney Boys High, as well as independent schools including Knox Grammar, Shore, Trinity Grammar, and Sydney Grammar. Our tutors understand the competitive nature of NSW selective school cohorts and calibrate accordingly.
            </p>
            <p className="mt-4">
              For students targeting a Band 6 or a 99+ ATAR through the HSC, school-based assessment performance and external exam preparation must both be maximised. StudyHours provides SBA task preparation, trial HSC exam coaching, and NESA-aligned essay writing guidance. Book a free assessment with one of our HSC specialists and get a personalised plan for achieving your target ATAR.
            </p>
          </div>
        </div>
      </section>

      {/* Internal Links */}
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

      {/* Dark CTA */}
      <section className="py-24 px-6 bg-deep-navy dark:bg-black text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-sapphire/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter italic">
            Ready to Hit <span className="text-sapphire">Band 6?</span>
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto font-medium">
            Join NSW students who have achieved Band 6 results and 99+ ATARs with our specialist HSC tutors. One free session. No commitment.
          </p>
          <Link href={ctaHref} className="inline-block px-12 py-5 bg-sapphire text-white font-black rounded-3xl hover:bg-white hover:text-black transition-all shadow-2xl shadow-sapphire/40 text-lg tracking-wide">
            Book Free HSC Session
          </Link>
        </div>
      </section>
    </main>
  );
}
