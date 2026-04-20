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
  Star,
  GraduationCap,
  Award,
  Zap,
  Languages,
  Clock,
  FileText,
  TrendingUp,
  AlertTriangle,
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
    name: "VCE Mathematics",
    tag: "Top Scaling Subject",
    tagColor: "bg-red-500/10 text-red-500",
    description:
      "Master Maths Methods Units 3/4 and Specialist Mathematics with tutors who scored 45-50 raw. We cover CAS calculator techniques, VCAA exam-style questions, and SAC preparation from Units 1 through 4.",
    topics: ["Methods Units 3/4", "Specialist Mathematics", "General Mathematics", "CAS (TI-Nspire/Casio)", "VCAA Exam Drills"],
  },
  {
    icon: BookOpen,
    name: "VCE English",
    tag: "Mandatory Subject",
    tagColor: "bg-blue-500/10 text-blue-500",
    description:
      "From mainstream English to English Language and Literature. We help you master text response, comparative analysis, argument analysis, and oral presentations. All sessions are aligned to VCAA's current text list.",
    topics: ["Text Response Essays", "Comparative Analysis", "Argument & Persuasion", "Oral Presentation", "EAL/D Support"],
  },
  {
    icon: FlaskConical,
    name: "VCE Sciences",
    tag: "Practical & Theory",
    tagColor: "bg-emerald-500/10 text-emerald-500",
    description:
      "Expert coaching for Biology, Chemistry, Physics, and Psychology. We break down the VCAA study design unit by unit, focusing on data analysis, practical investigations, and extended response techniques.",
    topics: ["Biology Units 1-4", "Chemistry Data Analysis", "Physics Equations", "Psychology Units 3/4", "Scientific Investigation"],
  },
  {
    icon: Languages,
    name: "VCE Humanities & LOTE",
    tag: "Broad Electives",
    tagColor: "bg-purple-500/10 text-purple-500",
    description:
      "Specialist support for Business Management, Legal Studies, Economics, History: Revolutions, and LOTE subjects including French, Chinese, and Japanese. Focus on precise terminology and VCE essay structures.",
    topics: ["Business Management", "Legal Studies", "History: Revolutions", "Economics VCE", "LOTE Languages"],
  },
];

const sacBreakdown = [
  {
    type: "SAC 1: Analytical Task",
    subjects: "English, Humanities",
    weight: "25-33% of study score",
    tips: "Strict timing, annotated texts allowed. We run timed practice tasks under exam conditions.",
    color: "border-blue-500/30 bg-blue-500/5",
    badge: "bg-blue-500/10 text-blue-600",
  },
  {
    type: "SAC 2: Application Task",
    subjects: "Maths Methods, Sciences",
    weight: "22-40% of study score",
    tips: "Often multi-part with technology-active and technology-free components. We drill every past SAC question.",
    color: "border-red-500/30 bg-red-500/5",
    badge: "bg-red-500/10 text-red-600",
  },
  {
    type: "SAC 3: Modelling / Oral",
    subjects: "All subjects",
    weight: "Up to 30% of study score",
    tips: "Highly structured. We help with plan outlines, oral scripts, and mathematical modelling frameworks.",
    color: "border-emerald-500/30 bg-emerald-500/5",
    badge: "bg-emerald-500/10 text-emerald-600",
  },
];

const scalingSubjects = [
  { subject: "Specialist Mathematics", avgScaled: "~48.5", rawNeeded: "40+", tip: "Best scaling in VCE" },
  { subject: "Maths Methods", avgScaled: "~47.0", rawNeeded: "42+", tip: "Essential for STEM" },
  { subject: "Physics", avgScaled: "~44.5", rawNeeded: "38+", tip: "High ceiling for sciences" },
  { subject: "Chemistry", avgScaled: "~43.0", rawNeeded: "37+", tip: "Strong STEM pathway" },
  { subject: "Latin / Japanese", avgScaled: "~42.0", rawNeeded: "35+", tip: "LOTE scaling bonus" },
];

const melbourneSchools = [
  "Melbourne Grammar School", "Scotch College", "Wesley College", "Presbyterian Ladies College",
  "Mac.Robertson Girls High", "Melbourne High School", "Brighton Grammar", "St Kevin's College",
  "Mentone Grammar", "Caulfield Grammar", "Haileybury College", "Camberwell Grammar",
];

const vceTimeline = [
  { year: "Year 10", label: "Subject Selection", desc: "Choose your VCE or VET pathway. We help identify high-scaling subjects that align with your university goals.", urgency: false },
  { year: "Year 11 (Units 1/2)", label: "Build the Foundation", desc: "Units 1 and 2 don't count toward your ATAR but set your internal ranking. Strong early performance matters.", urgency: false },
  { year: "Year 12 T1", label: "SAC Season Begins", desc: "Units 3/4 SACs start immediately. Weekly 1-on-1 sessions keep you ahead of every assessment task.", urgency: true },
  { year: "Year 12 T2-3", label: "Mid-Year Exam + SACs", desc: "The school-based mid-year exam (GAT context) and remaining SACs. This is your make-or-break period.", urgency: true },
  { year: "October-Nov", label: "VCAA Exams", desc: "All Units 3/4 external exams. Our intensive exam-prep program runs 6-week sprint sessions leading up to exam day.", urgency: true },
];

const beforeAfter = [
  { before: "Struggling with VCAA-style proof questions in Methods", after: "Confident using CAS and algebraic proof strategies in timed conditions" },
  { before: "Text response essays sitting at C range with unclear structure", after: "Structured A-range essays with strong metalanguage and VCAA rubric alignment" },
  { before: "Unsure how to approach Chemistry extended response questions", after: "Scoring full marks on extended response using structured scientific language" },
  { before: "Study score estimate plateaued around 30-35", after: "Projected study score 40+ after 8 weeks of targeted 1-on-1 sessions" },
];

const faqs = [
  { q: "What is the difference between VCE and ATAR?", a: "VCE (Victorian Certificate of Education) is the certificate you receive after completing Years 11 and 12 in Victoria. The ATAR is calculated from your best 4 scaled study scores plus 10% of your 5th and 6th scores. Your VCE results directly determine your ATAR." },
  { q: "How do SACs affect my final study score?", a: "School Assessed Coursework (SACs) typically contribute around 33-50% of your final study score depending on the subject. For Maths, SACs contribute about 34% and the external exam contributes 66%. Our tutors help you maximise SAC performance to build a strong base before exams." },
  { q: "What study score do I need to get a 99 ATAR in VCE?", a: "To achieve a 99+ ATAR, you typically need to average around 45+ raw study scores across your scaled subjects. Selecting high-scaling subjects like Specialist Maths, Physics, and Chemistry is key, as these can boost your aggregate significantly." },
  { q: "Do your tutors know the current VCAA text list?", a: "Yes. Our VCE English tutors update their resources every year to match the current VCAA text list. We have specialist tutors for every commonly studied text including The Crucible, Burial Rites, The White Tiger, and others." },
  { q: "What is the GAT and how does it affect my ATAR?", a: "The General Achievement Test (GAT) is taken by all VCE students. It doesn't directly determine your ATAR, but it's used by VCAA to statistically check school-assessed work. A significantly low GAT relative to your SAC results may trigger a review." },
  { q: "How does VCE scaling work?", a: "VCAA scales study scores to account for the difficulty of each subject. For example, a raw score of 40 in Specialist Maths might scale up to 46, while the same score in a less competitive subject might stay near 40. Our tutors specialise in high-scaling subjects to maximise your ATAR." },
  { q: "When should I start VCE tutoring?", a: "Ideally in Year 11 to build strong unit 1/2 foundations and internal ranking habits. However, most students join us at the start of Year 12 when SACs begin. Our intensive programs can also help students who join mid-year." },
  { q: "Do you offer tutoring for VCE Further Mathematics?", a: "Yes. We have tutors who specialise in VCE Further Maths (Financial Maths, Matrices, Networks, etc.) at the Units 3/4 level. Further Maths is compulsory for students who don't take Methods or Specialist, so we ensure thorough coverage." },
];

const testimonials = [
  { text: "My tutor had scored a 50 study score in Methods. The way he explained VCAA trick questions completely changed how my son approached the exam. He went from a 38 practice score to a 46 in the real thing.", author: "Sarah L.", role: "Parent, Melbourne Grammar Student", rating: 5 },
  { text: "The English sessions were transformative. I finally understood how to link metalanguage to the VCAA criteria. My Text Response SAC jumped from a C+ to an A in two months.", author: "James M.", role: "Year 12, Wesley College", rating: 5 },
  { text: "I was behind in Biology Units 3/4 and panicking. My tutor mapped out exactly what VCAA could ask and helped me write structured extended responses. I ended up with a 42 study score.", author: "Priya R.", role: "Year 12, Caulfield Grammar", rating: 5 },
];

const internalLinks = [
  { label: "ATAR Tutoring", href: "/australia/atar-online-tutoring", desc: "Strategic coaching to maximise your ATAR" },
  { label: "HSC Tutoring", href: "/australia/hsc-online-tutoring", desc: "NSW senior tutoring experts" },
  { label: "QCE Tutoring", href: "/australia/qce-online-tutoring", desc: "Queensland senior school support" },
  { label: "WACE Tutoring", href: "/australia/wace-online-tutoring", desc: "Western Australia ATAR courses" },
];

export default function VCEPageClient() {
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
                VCAA Aligned: VCE Specialists Victoria
              </div>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter leading-[0.95] uppercase">
                VCE Tutors <span className="text-sapphire">Online</span>: Victoria&apos;s Best
              </h1>
              <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary italic mb-8 leading-tight">
                VCAA Aligned · SAC Preparation · 99+ ATAR Mentors
              </div>
              <p className="text-lg sm:text-xl text-text-secondary mb-10 leading-relaxed font-medium max-w-xl">
                Achieving a high VCE study score requires more than knowing the content. Our expert VCE online tutors are high-achieving graduates who understand VCAA exam patterns, SAC rubrics, and scaling strategy inside out.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href={ctaHref} className="w-full sm:w-auto px-10 py-5 bg-sapphire text-white font-black rounded-3xl hover:bg-primary transition-all shadow-2xl shadow-sapphire/20 text-center flex items-center justify-center gap-3 group text-lg tracking-tighter">
                  Book Free VCE Assessment
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="text-sm font-black text-text-secondary uppercase tracking-widest">
                  1:1 · Online · All VCE Subjects
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="flex flex-col gap-4">
              <div className="relative w-full aspect-3/2 rounded-4xl overflow-hidden shadow-2xl border border-border group">
                <Image
                  src={optimizeCloudinaryUrl("https://res.cloudinary.com/de8vvmpip/image/upload/v1776662946/A_high-achieving_student_202604201058_hdo2li.jpg")}
                  alt="VCE online tutor helping student with Maths Methods Unit 3/4"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[6s]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-deep-navy/20 to-transparent pointer-events-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
              {[
                { num: "99+", label: "Max ATAR Achieved", color: "text-sapphire" },
                { num: "50", label: "Study Score Tutors", color: "text-emerald-500" },
                { num: "1:1", label: "Expert Mentoring", color: "text-sapphire" },
                { num: "100%", label: "VCAA Syllabus Cover", color: "text-primary" },
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-border text-center shadow-sm">
                  <div className={`text-3xl font-black tracking-tighter ${stat.color} mb-1`}>{stat.num}</div>
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
              VCE Subjects We <span className="text-sapphire">Cover</span>
            </h2>
            <p className="text-base text-text-secondary max-w-2xl mx-auto font-medium">
              Every session is aligned to the exact VCAA study design. Our tutors hold 40-50 study scores in the subjects they teach.
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

      {/* SAC Deep-Dive */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">School Assessed Coursework</span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase">
              SAC Preparation <span className="text-sapphire">Strategy</span>
            </h2>
            <p className="text-base text-text-secondary max-w-2xl mx-auto font-medium">
              SACs contribute 33-50% of your final study score. Our tutors help you master every task type before it counts.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sacBreakdown.map((sac, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-[3rem] p-10 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm border border-sapphire/10 ${sac.badge}`}>{sac.subjects}</span>
                <h3 className="text-xl font-black text-deep-navy dark:text-white uppercase mb-4 tracking-tighter leading-tight italic">{sac.type}</h3>
                <div className="text-[10px] font-black text-sapphire mb-6 uppercase tracking-[0.2em]">{sac.weight}</div>
                <p className="text-sm text-text-secondary font-medium leading-relaxed italic opacity-80">{sac.tips}</p>
                <div className="absolute bottom-4 right-4 text-sapphire/10 group-hover:text-sapphire/30 transition-colors">
                  <Zap size={40} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scaling Table */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">ATAR Optimisation</span>
              <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase">
                Top Scaling Subjects <span className="text-sapphire">in VCE</span>
              </h2>
              <p className="text-base text-text-secondary font-medium mb-8 leading-relaxed">
                VCAA scales study scores to account for subject difficulty. Choosing high-scaling subjects and performing well in them is the fastest path to a 99+ ATAR.
              </p>
              <div className="space-y-4">
                {scalingSubjects.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-6 p-6 rounded-4xl bg-white dark:bg-slate-900/80 border border-border group hover:border-sapphire/40 transition-all overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-sapphire/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="text-sm font-black text-deep-navy dark:text-white uppercase tracking-tighter italic">{s.subject}</div>
                      <div className="text-[10px] text-text-secondary font-medium uppercase tracking-widest opacity-60">{s.tip}</div>
                    </div>
                    <div className="text-right relative z-10">
                      <div className="text-xl font-black text-sapphire tracking-tighter">{s.avgScaled}</div>
                      <div className="text-[9px] text-text-secondary font-black uppercase tracking-widest leading-none">Raw Needed: {s.rawNeeded}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">Student Journey</span>
              <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase">
                VCE Year <span className="text-sapphire">Timeline</span>
              </h2>
              <div className="space-y-4">
                {vceTimeline.map((step, i) => (
                  <div key={i} className={`p-6 rounded-4xl border transition-all group overflow-hidden relative ${step.urgency ? "border-red-500/30 bg-red-500/5" : "border-border bg-white"}`}>
                    <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center justify-between mb-2 relative z-10">
                      <span className="text-[10px] font-black text-sapphire uppercase tracking-[0.2em] italic">{step.year}</span>
                      {step.urgency && <span className="flex items-center gap-1.5 text-[9px] font-black text-red-500 uppercase tracking-widest"><AlertTriangle size={12} /> Priority</span>}
                    </div>
                    <div className="text-base font-black text-deep-navy dark:text-white uppercase mb-2 tracking-tighter italic relative z-10">{step.label}</div>
                    <p className="text-sm text-text-secondary font-medium leading-relaxed italic opacity-80 relative z-10">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Melbourne Schools */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">Victoria Wide</span>
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase">
              Schools We Support <span className="text-sapphire">Across Melbourne</span>
            </h2>
            <p className="text-sm text-text-secondary max-w-xl mx-auto font-medium">Our tutors work with VCE students from government and independent schools across Victoria.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {melbourneSchools.map((school, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-border hover:border-sapphire/40 transition-all group/school">
                <div className="w-1.5 h-1.5 rounded-full bg-sapphire group-hover/school:scale-150 transition-transform" />
                <span className="text-[9px] font-black text-text-secondary uppercase tracking-tight">{school}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-deep-navy dark:text-white tracking-tighter uppercase mb-3">
              What Changes After <span className="text-sapphire">Tutoring</span>
            </h2>
          </div>
          <div className="rounded-[3.5rem] overflow-hidden border border-border/60 shadow-2xl bg-white relative group">
            <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent pointer-events-none" />
            <div className="grid grid-cols-12 bg-deep-navy text-white text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
              <div className="col-span-12 px-8 py-6 flex items-center justify-between border-b border-white/10">
                <span className="italic">VCE Performance Trajectory</span>
                <span className="text-emerald-400">99+ ATAR Pathway</span>
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

      {/* Why Choose */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">The StudyHours Advantage</span>
            <h2 className="text-4xl font-black text-deep-navy dark:text-white tracking-tighter uppercase mb-4">
              Why VCE Students <span className="text-sapphire">Choose Us</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: GraduationCap, title: "45-50 Study Score Tutors", desc: "Every tutor scored 45+ raw in the subject they teach. They don't just know the content; they know the VCAA markers' secrets." },
              { icon: FileText, title: "SAC-First Methodology", desc: "Internal assessments are 50% of your ATAR. We drill exam-style tasks under timed conditions weeks before they count." },
              { icon: TrendingUp, title: "ATAR Scaling Strategy", desc: "We advise on subject selection, CAS calculator hacks, and metalanguage precision to maximise your scaled aggregate score." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-10 rounded-[3rem] bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all text-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-3xl bg-sapphire/5 text-sapphire flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-sm">
                  <item.icon size={32} />
                </div>
                <h3 className="relative z-10 text-xl font-black text-deep-navy dark:text-white uppercase mb-4 tracking-tighter italic leading-tight">{item.title}</h3>
                <p className="relative z-10 text-sm text-text-secondary font-medium leading-relaxed italic opacity-80">{item.desc}</p>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-sapphire/10 group-hover:bg-sapphire/30 transition-colors rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ParentTestimonials testimonials={testimonials} />
      <SubjectFAQ items={faqs} title="Frequently Asked Questions: VCE Tutoring" />

      {/* SEO Paragraph */}
      <section className="py-20 px-6 bg-surface dark:bg-slate-900/30 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">
            Expert VCE Online Tutoring for Melbourne and Victoria
          </h2>
          <div className="prose dark:prose-invert max-w-5xl text-sm text-text-secondary leading-relaxed font-medium">
            <p>
              StudyHours provides expert VCE tutors online for students across Melbourne, Geelong, Ballarat, Bendigo, and regional Victoria. Our team of VCAA-specialist tutors consists of high-achieving VCE graduates who have scored 99+ ATARs and 45-50 study scores in the subjects they teach. Whether you need VCE Maths Methods tutoring, VCE Specialist Mathematics coaching, VCE English Language support, or VCE Physics exam preparation, our 1-on-1 sessions are designed around the current VCAA study design.
            </p>
            <p className="mt-4">
              Our VCE tutoring program covers all Year 11 and Year 12 subjects with a strong emphasis on SAC preparation, scaling strategy, and external exam readiness. We work with students from Melbourne Grammar, Scotch College, Mac.Robertson Girls High, Melbourne High School, Wesley College, Caulfield Grammar, Brighton Grammar, Haileybury, and many other Victorian schools. Our tutors understand the difference between school-based assessments and VCAA exams, and they prepare students for both.
            </p>
            <p className="mt-4">
              For students targeting a 90+ or 99+ ATAR through the VCE, subject selection and scaling are critical. We help students understand which subjects scale well (Specialist Mathematics, Physics, Chemistry, Latin) and how to perform within those subjects to maximise their aggregate ATAR. Book a free assessment today and let our team map out your personalised VCE success strategy.
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
            Ready for Your <span className="text-sapphire">Top Study Score?</span>
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto font-medium">
            Join Victorian students who have achieved 40+ study scores and 99+ ATARs with our VCE specialist tutors. One free assessment. Zero commitment.
          </p>
          <Link href={ctaHref} className="inline-block px-12 py-5 bg-sapphire text-white font-black rounded-3xl hover:bg-white hover:text-black transition-all shadow-2xl shadow-sapphire/40 text-lg tracking-wide">
            Book Free VCE Assessment
          </Link>
        </div>
      </section>
    </main>
  );
}
