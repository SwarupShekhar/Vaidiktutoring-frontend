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
  Award,
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
    name: "WACE Mathematics",
    tag: "ATAR Course",
    tagColor: "bg-red-500/10 text-red-500",
    description:
      "Master ATAR Mathematics Specialist, Methods, and Applications and Interpretation. Our tutors are top SCSA graduates who know the exam inside out, including the calculator-active and calculator-assumed paper formats.",
    topics: ["Maths Specialist ATAR", "Maths Methods ATAR", "Maths Applications", "Calculator Active Paper", "SCSA Exam Technique"],
  },
  {
    icon: BookOpen,
    name: "WACE English",
    tag: "Compulsory ATAR",
    tagColor: "bg-blue-500/10 text-blue-500",
    description:
      "Excel in English ATAR and Literature ATAR. We help you with close text study, analytical essays, the WACE Externally Set Task (EST), and the reading comprehension and writing exam components.",
    topics: ["English ATAR", "Literature ATAR", "Externally Set Task (EST)", "Analytical Essays", "Comparative Writing"],
  },
  {
    icon: FlaskConical,
    name: "WACE Sciences",
    tag: "STEM Excellence",
    tagColor: "bg-emerald-500/10 text-emerald-500",
    description:
      "High-performance ATAR coaching for Physics, Chemistry, Biology, and Human Biology. We focus on Units 3/4 content, SCSA exam structure, and the practical investigation requirements.",
    topics: ["Physics Units 3/4 ATAR", "Chemistry ATAR", "Biology ATAR", "Human Biology", "Scientific Investigation"],
  },
  {
    icon: Languages,
    name: "WACE Electives",
    tag: "Humanities & Social",
    tagColor: "bg-purple-500/10 text-purple-500",
    description:
      "Specialist coaching for WACE Psychology, Economics, Business Management, and Modern History ATAR courses. We focus on structured SCSA responses and source analysis skills.",
    topics: ["Psychology ATAR", "Economics ATAR", "Business Management", "Modern History WA", "Geography"],
  },
];

const courseTypes = [
  {
    type: "ATAR Courses",
    abbr: "ATAR",
    desc: "University-pathway courses assessed by SCSA. Marks from ATAR courses are used to calculate your ATAR. These are the courses we specialise in.",
    subjects: ["Maths Methods", "Specialist Maths", "Physics", "Chemistry", "English", "Biology"],
    color: "border-sapphire/30 bg-sapphire/5",
    badge: "bg-sapphire/10 text-sapphire",
  },
  {
    type: "General Courses",
    abbr: "GEN",
    desc: "For students not pursuing university entry or seeking alternative pathways. Assessment is school-based and doesn't contribute to ATAR calculations.",
    subjects: ["Mathematics Essentials", "English Essentials", "Workplace Learning"],
    color: "border-border bg-white dark:bg-slate-900/80",
    badge: "bg-slate-100 dark:bg-white/10 text-text-secondary",
  },
  {
    type: "Foundation Courses",
    abbr: "FDN",
    desc: "Designed for students working below typical Year 11-12 level. Provides core literacy, numeracy, and employability skills.",
    subjects: ["Foundation English", "Foundation Maths", "Vocational Skills"],
    color: "border-border bg-white dark:bg-slate-900/80",
    badge: "bg-slate-100 dark:bg-white/10 text-text-secondary",
  },
];

const examStructure = [
  { exam: "Section 1: Calculator-Free", duration: "50 min", format: "Short answer, no calculator allowed. Tests core algebra, proofs, and mental calculation.", subjects: "Maths Specialist, Maths Methods", color: "bg-red-500/5 border-red-500/20" },
  { exam: "Section 2: Calculator-Assumed", duration: "100 min", format: "Extended response with approved CAS calculator. Covers full syllabus with graphing and statistics.", subjects: "Maths Specialist, Maths Methods", color: "bg-blue-500/5 border-blue-500/20" },
  { exam: "Externally Set Task (EST)", duration: "50 min", format: "Supervised in-class task set by SCSA. Counts as one of the WACE school assessments.", subjects: "All ATAR subjects", color: "bg-emerald-500/5 border-emerald-500/20" },
  { exam: "WACE Written Exam", duration: "2.5-3 hrs", format: "Final October-November SCSA exam. Typically accounts for 50% of your final ATAR course mark.", subjects: "Sciences, Humanities, English", color: "bg-purple-500/5 border-purple-500/20" },
];

const perthSchools = [
  "Perth Modern School", "Shenton College", "Willetton Senior High", "Rossmoyne Senior High",
  "Churchie (Anglican)", "Hale School", "Christ Church Grammar", "Wesley College Perth",
  "MLC Perth", "St Mary's Anglican", "Scotch College Perth", "Trinity College Perth",
  "John XXIII College", "Aquinas College Perth", "Sacred Heart College",
];

const scalingSubjects = [
  { subject: "Mathematics Specialist", avgScaled: "~51.5", notes: "Highest scaling in WACE" },
  { subject: "Mathematics Methods", avgScaled: "~48.5", notes: "Essential for STEM/Commerce" },
  { subject: "Physics", avgScaled: "~45.0", notes: "Strong STEM pathway" },
  { subject: "Chemistry", avgScaled: "~43.5", notes: "High ceiling for sciences" },
  { subject: "English", avgScaled: "~42.0", notes: "Compulsory, scales well" },
];

const beforeAfter = [
  { before: "WACE Maths Methods calculator-free section causing exam anxiety", after: "Confident with Section 1 proof strategies and algebraic manipulation under timed conditions" },
  { before: "English ATAR comparative essays stuck around C+ with weak analytical structure", after: "Band A-standard essays with precise textual evidence and SCSA criteria alignment" },
  { before: "Physics Units 3/4 concepts unclear, particularly wave mechanics and electromagnetism", after: "Systematic understanding of all Units 3/4 content with full exam-question application" },
  { before: "ATAR estimate hovering around 78-83 with no clear strategy", after: "ATAR revised to 90+ target after scaling optimisation and 8-week intensive program" },
];

const faqs = [
  { q: "What is the SCSA and how does it govern WACE?", a: "The School Curriculum and Standards Authority (SCSA) is responsible for all schooling and curriculum in Western Australia. SCSA sets the WACE (Western Australian Certificate of Education) and all ATAR course syllabuses. Our tutors are trained exclusively to the current SCSA study design." },
  { q: "How is the WACE ATAR calculated?", a: "Your WACE ATAR is calculated from your best 4 scaled ATAR course marks (or equivalent), with the English requirement being mandatory. Marks from ATAR courses are scaled by SCSA to account for subject difficulty, meaning high-scaling subjects like Specialist Maths can significantly boost your aggregate." },
  { q: "What is the difference between ATAR and General courses in WACE?", a: "ATAR courses are university-pathway subjects assessed externally by SCSA and contribute to your ATAR. General courses are school-based and don't count toward ATAR calculations. For students targeting university entry, you must select ATAR courses. Our tutors specialise in ATAR courses." },
  { q: "How do WACE school assessments work?", a: "School assessments (SA) typically contribute 50% of your final ATAR course mark. This includes the Externally Set Task (EST), which is a supervised in-class task set by SCSA. The other 50% comes from the end-of-year WACE external exam. Our tutors prepare you for both components." },
  { q: "Is Maths Specialist the best scaling subject in WACE?", a: "Yes. Mathematics Specialist consistently achieves the highest scaling in WACE, with scaled marks regularly in the 50+ range. Combined with Maths Methods, these two subjects can contribute enormously to your ATAR. Our WA tutors have scored 99+ in Specialist Maths and can coach at the highest level." },
  { q: "Do you offer WACE tutoring for students in regional WA?", a: "Yes. All our WACE tutoring is delivered online, making it accessible to students in Bunbury, Albany, Kalgoorlie, Geraldton, Broome, and all regional Western Australian towns. You get the same quality of 1-on-1 coaching regardless of your location in WA." },
  { q: "When should I start WACE tutoring?", a: "Ideally at the start of Year 11 when ATAR course content begins. However, most students join us at the beginning of Year 12. Even students who start mid-Year 12 can make significant improvements in school assessments and the final WACE exam with intensive targeted coaching." },
  { q: "What Perth schools do you support students from?", a: "We support students from Perth Modern, Shenton College, Rossmoyne Senior High, Willetton Senior High, Hale School, Christ Church Grammar, Scotch College Perth, Wesley College, MLC Perth, and many other WACE schools. Our tutors often attended these schools and understand the cohort dynamics." },
];

const testimonials = [
  { text: "My WACE Specialist Maths tutor scored 99.85 ATAR from Perth Modern. She knew every past SCSA exam question and worked through calculator-free Section 1 drills with me every week. I ended up with an A in Specialist. Phenomenal result.", author: "Sophie T.", role: "Year 12, Rossmoyne Senior High", rating: 5 },
  { text: "I was completely lost in WACE Chemistry Units 3/4. The StudyHours tutor mapped out every syllabus dot point and showed me how to write extended responses in SCSA format. My school assessment mark jumped from 61% to 82% over one term.", author: "Nathan B.", role: "Year 12, Christ Church Grammar Perth", rating: 5 },
  { text: "Living in regional WA, I thought I couldn't get quality ATAR tutoring. The online sessions were seamless. My English ATAR EST score improved massively and I'm now tracking for a 92+ ATAR.", author: "Emily R.", role: "Year 12, Geraldton", rating: 5 },
];

const internalLinks = [
  { label: "VCE Tutoring", href: "/australia/vce-online-tutoring", desc: "Victoria's best VCE online tutors" },
  { label: "HSC Tutoring", href: "/australia/hsc-online-tutoring", desc: "NSW Band 6 specialists" },
  { label: "QCE Tutoring", href: "/australia/qce-online-tutoring", desc: "Queensland senior school experts" },
  { label: "ATAR Strategy", href: "/australia/atar-online-tutoring", desc: "National ATAR coaching" },
];

export default function WACEPageClient() {
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
            <motion.div initial={{ opacity: 1, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/60 backdrop-blur-md border border-border text-[10px] font-black tracking-[0.2em] text-sapphire mb-8 uppercase">
                <ShieldCheck size={14} />
                SCSA Aligned: WACE Specialists Western Australia
              </div>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter leading-[0.95] uppercase">
                WACE Tutors <span className="text-sapphire">Online</span>: WA Specialists
              </h1>
              <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary italic mb-8">
                SCSA Aligned · 1-on-1 · ATAR Courses
              </div>
              <p className="text-lg text-text-secondary mb-10 leading-relaxed font-medium max-w-xl">
                Achieve your university goals in Western Australia with WACE-aligned online tutoring. Our specialist WACE tutors are elite WA graduates who understand SCSA exam structure, school assessments, and ATAR scaling strategy inside out.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href={ctaHref} className="w-full sm:w-auto px-10 py-5 bg-sapphire text-white font-black rounded-3xl hover:bg-primary transition-all shadow-2xl shadow-sapphire/20 text-center flex items-center justify-center gap-3 group text-lg tracking-tighter">
                  Book Free WACE Session
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="text-sm font-black text-text-secondary uppercase tracking-widest">
                  1:1 · Online · All WACE ATAR Subjects
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 1, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="flex flex-col gap-4">
              <div className="relative w-full aspect-3/2 rounded-4xl overflow-hidden shadow-2xl border border-border group">
                <Image
                  src={optimizeCloudinaryUrl("https://res.cloudinary.com/de8vvmpip/image/upload/v1776668242/A_focused_senior_202604201227_klj0jz.jpg")}
                  alt="WACE online tutor helping student with ATAR subjects in Western Australia"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[6s]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-deep-navy/20 to-transparent pointer-events-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
              {[
                { num: "99+", label: "ATAR Achieved", color: "text-sapphire" },
                { num: "50%", label: "School Assessment", color: "text-blue-500" },
                { num: "1:1", label: "Expert Coaching", color: "text-sapphire" },
                { num: "WA", label: "SCSA Specialists", color: "text-emerald-500" },
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">SCSA Syllabus Coverage</span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase">
              WACE ATAR Subjects We <span className="text-sapphire">Specialise In</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subjects.map((subject, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, y: 20 }}
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

      {/* Course Types */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">WACE Structure</span>
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase">
              ATAR vs General vs Foundation <span className="text-sapphire">Courses</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courseTypes.map((course, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-[3rem] p-10 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${course.badge}`}>{course.abbr}</span>
                  <h3 className="text-sm font-black text-deep-navy dark:text-white uppercase tracking-tighter italic">{course.type}</h3>
                </div>
                <p className="text-sm text-text-secondary font-medium leading-relaxed mb-8 italic opacity-80 group-hover:opacity-100 transition-opacity relative z-10">{course.desc}</p>
                <div className="flex flex-wrap gap-2 relative z-10">
                  {course.subjects.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-background dark:bg-white/5 border border-border text-[10px] font-black text-deep-navy dark:text-white/70 uppercase tracking-tight">{s}</span>
                  ))}
                </div>
                <div className="absolute bottom-4 right-4 text-sapphire/5 group-hover:text-sapphire/20 transition-colors">
                  <Target size={40} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Structure + Scaling */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 border-y border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">SCSA Exam Format</span>
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase">
              WACE Exam <span className="text-sapphire">Structure</span>
            </h2>
            <div className="space-y-4">
              {examStructure.map((exam, i) => (
                <div
                  key={i}
                  className="group relative rounded-4xl p-6 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <h3 className="text-[10px] font-black text-sapphire uppercase tracking-[0.2em] italic">{exam.exam}</h3>
                    <div className="px-2 py-1 rounded-md bg-sapphire/5 text-[10px] font-black text-sapphire tracking-widest">{exam.duration}</div>
                  </div>
                  <p className="text-[13px] text-text-secondary font-medium leading-relaxed italic opacity-80 mb-4 relative z-10">{exam.format}</p>
                  <div className="text-[9px] font-black text-deep-navy dark:text-white uppercase tracking-[0.15em] border-t border-border/50 pt-3 opacity-60 relative z-10">{exam.subjects}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">ATAR Optimisation</span>
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase">
              Top Scaling Subjects <span className="text-sapphire">in WACE</span>
            </h2>
            <div className="space-y-3 mb-10">
              {scalingSubjects.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-5 rounded-3xl bg-white/50 dark:bg-white/5 border border-border group/scale hover:border-sapphire/40 transition-all overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-sapphire/5 to-transparent opacity-0 group-hover/scale:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="text-sm font-black text-deep-navy dark:text-white uppercase tracking-tighter italic">{s.subject}</div>
                    <div className="text-[9px] text-text-secondary font-black uppercase tracking-widest opacity-60">{s.notes}</div>
                  </div>
                  <div className="text-xl font-black text-sapphire tracking-tighter relative z-10">{s.avgScaled}</div>
                </div>
              ))}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">Targeting WA Excellence</span>
              <div className="grid grid-cols-2 gap-3">
                {perthSchools.slice(0, 8).map((school, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-border hover:border-sapphire/40 transition-all group/school">
                    <div className="w-1.5 h-1.5 rounded-full bg-sapphire group-hover/school:scale-150 transition-transform" />
                    <span className="text-[9px] font-black text-text-secondary uppercase tracking-tight">{school}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-deep-navy dark:text-white tracking-tighter uppercase mb-3">
              Before vs After <span className="text-sapphire">WACE Tutoring</span>
            </h2>
          </div>
          <div className="rounded-[3.5rem] overflow-hidden border border-border/60 shadow-2xl bg-white dark:bg-slate-900/50 relative group">
            <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent pointer-events-none" />
            <div className="grid grid-cols-12 bg-deep-navy text-white text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
              <div className="col-span-12 px-8 py-6 flex items-center justify-between border-b border-white/10">
                <span className="italic">WACE Performance Trajectory</span>
                <span className="text-emerald-400">99+ ATAR Pathway</span>
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
      <SubjectFAQ items={faqs} title="Frequently Asked Questions: WACE Tutoring" />

      <section className="py-20 px-6 bg-surface dark:bg-slate-900/30 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">
            Expert WACE Online Tutoring for Perth and Western Australia
          </h2>
          <div className="prose dark:prose-invert max-w-5xl text-sm text-text-secondary leading-relaxed font-medium">
            <p>
              StudyHours provides expert WACE tutors online for students across Perth, Fremantle, Joondalup, Mandurah, Bunbury, Albany, Geraldton, Kalgoorlie, and all of Western Australia. Our specialist WACE tutors are elite WA graduates who have scored 99+ ATARs through the SCSA system and understand the WACE ATAR course structure, school assessment requirements, and external exam format in detail. Whether you need WACE Maths Methods tutoring, WACE Specialist Mathematics coaching, WACE Physics exam preparation, or WACE English ATAR support, our 1-on-1 sessions are tailored specifically to the current SCSA study design.
            </p>
            <p className="mt-4">
              Our WACE tutoring program covers all ATAR courses with particular expertise in high-scaling subjects including Mathematics Specialist (the highest-scaling WACE subject), Mathematics Methods, Physics, Chemistry, and English. We work with students from Perth Modern School, Shenton College, Rossmoyne Senior High, Willetton Senior High, Christ Church Grammar, Scotch College Perth, Hale School, Wesley College, and other leading Perth schools. All sessions are online, making premium WACE tutoring accessible across regional Western Australia.
            </p>
            <p className="mt-4">
              For students targeting a 90+ or 99+ ATAR through WACE, subject selection and scaling strategy are critical decisions. StudyHours helps students choose the right combination of ATAR courses, build strong school assessment marks, and prepare intensively for the WACE external exams. Book a free WACE assessment today and get a personalised ATAR strategy.
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
            Ready to Achieve Your <span className="text-sapphire">Target WACE ATAR?</span>
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto font-medium">
            Join WA students who have achieved 90+ ATARs through targeted WACE coaching. Book a free session with a SCSA specialist today.
          </p>
          <Link href={ctaHref} className="inline-block px-12 py-5 bg-sapphire text-white font-black rounded-3xl hover:bg-white hover:text-black transition-all shadow-2xl shadow-sapphire/40 text-lg tracking-wide">
            Book Free WACE Session
          </Link>
        </div>
      </section>
    </main>
  );
}
