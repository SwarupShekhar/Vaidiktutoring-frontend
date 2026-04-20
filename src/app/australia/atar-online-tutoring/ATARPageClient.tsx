"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Target,
  Award,
  Brain,
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

const services = [
  {
    icon: Target,
    name: "Goal Setting & Strategy",
    tag: "Strategic Planning",
    tagColor: "bg-red-500/10 text-red-500",
    description:
      "Understand your target ATAR and build a subject-by-subject roadmap. We analyse scaling, prerequisites, and workload balance to ensure your effort is optimised for maximum ATAR impact across VCE, HSC, QCE, WACE, and SACE.",
    topics: ["ATAR Goal Setting", "Scaling Analysis", "Subject Selection", "Prerequisite Mapping", "Time Allocation"],
  },
  {
    icon: TrendingUp,
    name: "Subject Optimisation",
    tag: "Academic Excellence",
    tagColor: "bg-blue-500/10 text-blue-500",
    description:
      "Deep-dive sessions into your highest-scaling subjects. Whether it's Specialist Maths, Physics, Extension English, or Economics, we focus on moving you from the 90th percentile to the 99th.",
    topics: ["STEM Excellence", "English Extension", "Humanities Depth", "Internal Rank Management", "Exam Technique"],
  },
  {
    icon: Brain,
    name: "Exam Mastery",
    tag: "Cognitive Training",
    tagColor: "bg-emerald-500/10 text-emerald-500",
    description:
      "The high-performance study habits used by top 1% students. We teach active recall, spaced repetition, exam-room techniques, stress management, and timed practice strategies for peak performance.",
    topics: ["Active Recall Methods", "Exam Room Technique", "Stress Management", "Spaced Repetition", "Note-Taking Strategy"],
  },
  {
    icon: Award,
    name: "Tertiary Pathways",
    tag: "Beyond School",
    tagColor: "bg-purple-500/10 text-purple-500",
    description:
      "Guidance on university entry requirements, UCAT preparation for medicine, and interview coaching for competitive courses. We help students across Sydney, Melbourne, Brisbane, Perth, and Adelaide.",
    topics: ["UCAT Prep", "Medicine Pathways", "Law Entrance", "Scholarship Applications", "University Interviews"],
  },
];

const stateBreakdown = [
  { state: "VIC", system: "VCE", body: "VCAA", maxATAR: "99.95", topSubjects: "Specialist Maths, Physics, Latin", link: "/australia/vce-online-tutoring" },
  { state: "NSW", system: "HSC", body: "NESA", maxATAR: "99.95", topSubjects: "Ext 2 Maths, Physics, Economics", link: "/australia/hsc-online-tutoring" },
  { state: "QLD", system: "QCE", body: "QCAA", maxATAR: "99.95", topSubjects: "Specialist Maths, Physics, English", link: "/australia/qce-online-tutoring" },
  { state: "WA", system: "WACE", body: "SCSA", maxATAR: "99.95", topSubjects: "Specialist Maths, Methods, Physics", link: "/australia/wace-online-tutoring" },
  { state: "SA", system: "SACE", body: "SACE Board", maxATAR: "99.95", topSubjects: "Specialist Maths, Chemistry, Physics", link: "/australia/curriculum-tutoring" },
  { state: "ACT/TAS/NT", system: "Various", body: "State Bodies", maxATAR: "99.95", topSubjects: "STEM subjects scale highest universally", link: "/australia/curriculum-tutoring" },
];

const atarMilestones = [
  { atar: "99.95", label: "Perfect ATAR", entry: "Medicine at Monash, UNSW, UQ", color: "text-emerald-500" },
  { atar: "99.00", label: "Top 1%", entry: "Law at Melbourne, USyd, ANU", color: "text-blue-500" },
  { atar: "95.00", label: "Top 5%", entry: "Engineering, Commerce at Go8 unis", color: "text-sapphire" },
  { atar: "90.00", label: "Top 10%", entry: "Most competitive undergraduate courses", color: "text-purple-500" },
  { atar: "80.00", label: "Top 20%", entry: "Broad university entry", color: "text-orange-500" },
];

const scalingPrinciples = [
  { principle: "Choose difficult subjects", desc: "High-scaling subjects like Specialist Maths, Extension Maths, and Physics scale up considerably. A raw 40 in Specialist can become a 46+ scaled score." },
  { principle: "Perform within those subjects", desc: "It's not enough to take scaling subjects. You must perform well. Our tutors ensure you're achieving in the top percentile of the subjects you select." },
  { principle: "Don't sacrifice one for another", desc: "Students who take 6 hard subjects but perform poorly in 2 lose their scaling advantage. We help balance your workload to protect your aggregate." },
  { principle: "Build a buffer with internals", desc: "Internal assessments (SACs, SBAs, IAs) create a score buffer before external exams. We make sure your internals are maximised first." },
];

const beforeAfter = [
  { before: "Taking 6 subjects with no scaling strategy, ATAR estimate 82", after: "Subject selection optimised for scaling, ATAR projection revised to 93+" },
  { before: "Cramming the night before exams with low retention", after: "Spaced repetition and active recall system producing durable long-term memory" },
  { before: "Panicking in exam room, losing 15 min to anxiety", after: "Structured exam-room protocol: time-boxing, skip-and-return, controlled breathing" },
  { before: "No UCAT preparation, applying to medicine without a plan", after: "3-month UCAT program with timed section drills and percentile tracking" },
];

const faqs = [
  { q: "What is an ATAR and how is it calculated across different states?", a: "The Australian Tertiary Admission Rank (ATAR) is a percentile rank from 0 to 99.95 showing where you sit relative to all Year 12 students nationally. Each state calculates it differently: VCE uses scaled study scores, HSC uses scaled examination marks, QCE uses scaled subject results, and WACE uses scaled ATAR course marks. Despite different systems, all ATARs are nationally comparable." },
  { q: "What ATAR do I need for medicine in Australia?", a: "Medicine is the most competitive entry in Australia. Melbourne, UNSW, Monash, and UQ all require ATARs of 99.00-99.95 plus UCAT scores. Some pathways accept lower ATARs with strong UCAT performance. Our tutors coach students specifically for the dual ATAR + UCAT pathway." },
  { q: "How does subject scaling affect my ATAR?", a: "Scaling adjusts raw marks from harder subjects upward so they're fairly compared. Specialist Maths, Extension Maths, Physics, and Chemistry all scale significantly in most states. For example, a raw study score of 38 in Specialist Maths can scale to 44+, while the same raw mark in a softer subject might barely move. Our strategy coaching focuses heavily on this." },
  { q: "Is a 99 ATAR achievable without attending a selective school?", a: "Yes. Many of our top students have achieved 99+ ATARs from comprehensive public schools and smaller independent schools. The key factors are subject selection, internal assessment performance, and exam technique: all of which our tutoring directly addresses. School name matters far less than strategy and execution." },
  { q: "What is UCAT and how does it relate to ATAR?", a: "The University Clinical Aptitude Test (UCAT) is a separate admission test for medicine, dentistry, and health sciences in Australia and New Zealand. It tests verbal reasoning, decision making, quantitative reasoning, abstract reasoning, and situational judgement. Most Australian medical schools require both a high ATAR and a competitive UCAT score." },
  { q: "How many subjects should I take for the best ATAR?", a: "Most states count your best 4-5 subjects for ATAR calculations (sometimes with a sixth contributing partially). Taking 6 subjects is common, but only beneficial if you can perform well in all 6. If adding a 6th subject means underperforming in your top 5, it's counterproductive. We help you find the right balance." },
  { q: "When should I start ATAR coaching?", a: "The earlier the better. Subject selection at the end of Year 10 or beginning of Year 11 is one of the highest-leverage decisions for your ATAR. However, even students starting intensive coaching in Year 12 Term 2 can significantly improve their projected ATAR with our targeted exam strategy programs." },
  { q: "Do you offer ATAR tutoring for all Australian states?", a: "Yes. We coach students through VCE (Victoria), HSC (New South Wales), QCE (Queensland), WACE (Western Australia), SACE (South Australia), TCE (Tasmania), and ACT senior secondary. Our tutors specialise in the specific curriculum and exam body for your state." },
];

const testimonials = [
  { text: "Getting an ATAR of 99.85 wouldn't have been possible without my StudyHours mentor. They didn't just teach me Chemistry: they taught me how to handle exam pressure, manage my time, and think like a high performer.", author: "Chloe D.", role: "Year 12 Graduate, Victoria", rating: 5 },
  { text: "Expert guidance on scaling and subject selection changed everything. My daughter's ATAR went from an estimated 85 to a final 96.4 within two terms of strategic coaching.", author: "David H.", role: "Parent, Queensland", rating: 5 },
  { text: "I applied to medicine with a 99.10 ATAR and got into UNSW. The UCAT + ATAR double prep program was exactly what I needed. My tutors covered both simultaneously and I never felt overwhelmed.", author: "Ananya P.", role: "First-Year Medicine Student, UNSW", rating: 5 },
];

const internalLinks = [
  { label: "VCE Tutoring", href: "/australia/vce-online-tutoring", desc: "Victoria's best VCE specialists" },
  { label: "HSC Tutoring", href: "/australia/hsc-online-tutoring", desc: "NSW Band 6 experts" },
  { label: "QCE Tutoring", href: "/australia/qce-online-tutoring", desc: "Queensland QCAA specialists" },
  { label: "WACE Tutoring", href: "/australia/wace-online-tutoring", desc: "Western Australia SCSA experts" },
];

export default function ATARPageClient() {
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
                National ATAR Coaching: All States
              </div>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter leading-[0.95] uppercase">
                ATAR Tutors <span className="text-sapphire">Online</span>: Achieve 99+
              </h1>
              <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary italic mb-8">
                Strategic Excellence · Elite Mentorship · National Reach
              </div>
              <p className="text-lg text-text-secondary mb-10 leading-relaxed font-medium max-w-xl">
                Achieving a top ATAR is as much about strategy as it is about study. Connect with Australia&apos;s top 1% graduates for elite 1-on-1 ATAR coaching across VCE, HSC, QCE, WACE, and SACE.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href={ctaHref} className="w-full sm:w-auto px-10 py-5 bg-sapphire text-white font-black rounded-3xl hover:bg-primary transition-all shadow-2xl shadow-sapphire/20 text-center flex items-center justify-center gap-3 group text-lg tracking-tighter">
                  Book Free ATAR Session
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="text-sm font-black text-text-secondary uppercase tracking-widest">
                  1:1 · National · All State Systems
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="flex flex-col gap-4">
              <div className="relative w-full aspect-3/2 rounded-4xl overflow-hidden shadow-2xl border border-border group">
                <Image
                  src={optimizeCloudinaryUrl("https://res.cloudinary.com/de8vvmpip/image/upload/v1776668086/A_focused_one-on-one_202604201224_sairiv.jpg")}
                  alt="Elite ATAR mentor coaching Australian student for 99+ result"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[6s]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-deep-navy/20 to-transparent pointer-events-none" />
              </div>
              <div className="p-8 rounded-[3rem] bg-deep-navy text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/30 to-transparent pointer-events-none" />
                <div className="relative z-10 text-center mb-8">
                  <div className="text-8xl font-black text-white tracking-tighter leading-none">99.95</div>
                  <div className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] mt-2">Maximum ATAR Possible</div>
                </div>
                <div className="relative z-10 space-y-3">
                  {atarMilestones.map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                      <div>
                        <div className="text-xs font-black text-white/60 uppercase tracking-widest">{m.label}</div>
                        <div className="text-[10px] text-white/40 font-medium">{m.entry}</div>
                      </div>
                      <div className={`text-lg font-black ${m.color}`}>{m.atar}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">Elite Mentorship</span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase">
              How We Help You <span className="text-sapphire">Hit 99+</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => (
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
                    <service.icon size={32} />
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${service.tagColor} shadow-sm border border-sapphire/10`}>
                    {service.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase leading-tight group-hover:text-sapphire transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-text-secondary font-medium leading-relaxed mb-8 opacity-80 italic">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.topics.map((t) => (
                    <span key={t} className="px-3 py-1.5 rounded-xl bg-background dark:bg-white/5 border border-border text-[10px] font-black text-deep-navy dark:text-white/70 uppercase tracking-tight">{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* State Breakdown */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">All Australian States</span>
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase">
              ATAR Systems by <span className="text-sapphire">State</span>
            </h2>
            <p className="text-base text-text-secondary max-w-2xl mx-auto font-medium">
              Every state calculates ATAR differently. Our tutors are trained in the specific curriculum body for your state.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stateBreakdown.map((s, i) => (
              <Link
                key={i}
                href={s.link}
                className="group relative flex flex-col p-8 rounded-4xl bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/50 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-sapphire/10 text-sapphire text-[10px] font-black uppercase tracking-widest border border-sapphire/20">{s.state}</span>
                    <span className="text-sm font-black text-deep-navy dark:text-white uppercase tracking-tighter italic">{s.system}</span>
                  </div>
                  <ArrowRight size={14} className="text-sapphire opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
                <div className="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] mb-3 opacity-60">Administered by {s.body}</div>
                <p className="text-[11px] text-text-secondary font-medium leading-relaxed italic mb-6">Top scaling: {s.topSubjects}</p>
                <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between relative z-10">
                  <span className="text-[9px] font-black text-sapphire uppercase tracking-widest group-hover:translate-x-1 transition-transform">Explore {s.system} Pathway</span>
                  <span className="text-[10px] font-black text-text-secondary opacity-40 italic">Max: {s.maxATAR}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Scaling Principles */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">Scaling Strategy</span>
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase">
              The 4 Rules of <span className="text-sapphire">ATAR Scaling</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {scalingPrinciples.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex gap-8 p-10 rounded-[3rem] bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 rounded-[1.25rem] bg-sapphire/5 text-sapphire flex items-center justify-center text-xl font-black shrink-0 relative z-10 group-hover:scale-110 transition-transform shadow-sm">
                  {i + 1}
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-black text-deep-navy dark:text-white uppercase mb-3 tracking-tighter italic leading-tight">{p.principle}</h3>
                  <p className="text-sm text-text-secondary font-medium leading-relaxed italic opacity-80">{p.desc}</p>
                </div>
                <div className="absolute -bottom-2 -right-2 opacity-5 scale-150 rotate-12 group-hover:scale-[1.7] group-hover:opacity-10 transition-all">
                  <Award size={48} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-deep-navy dark:text-white tracking-tighter uppercase mb-3">
              Before vs After <span className="text-sapphire">ATAR Coaching</span>
            </h2>
          </div>
          <div className="rounded-[3.5rem] overflow-hidden border border-border/60 shadow-2xl bg-white dark:bg-slate-900/50 relative group">
            <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent pointer-events-none" />
            <div className="grid grid-cols-12 bg-deep-navy text-white text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
              <div className="col-span-12 px-8 py-6 flex items-center justify-between border-b border-white/10">
                <span className="italic">ATAR Achievement Trajectory</span>
                <span className="text-emerald-400">99.95 Potential Path</span>
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
      <SubjectFAQ items={faqs} title="Frequently Asked Questions: ATAR Tutoring" />

      <section className="py-20 px-6 bg-surface dark:bg-slate-900/30 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">
            National ATAR Tutoring and Mentorship Across Australia
          </h2>
          <div className="prose dark:prose-invert max-w-5xl text-sm text-text-secondary leading-relaxed font-medium">
            <p>
              StudyHours offers national ATAR tutoring and mentorship for Year 11 and Year 12 students across Australia. Our specialist ATAR tutors are among the top 1% of academic achievers nationally, providing strategic coaching for students in VCE (Victoria), HSC (New South Wales), QCE (Queensland), WACE (Western Australia), and SACE (South Australia). We focus on scaling optimisation, subject selection strategy, exam mastery, and high-performance study techniques to help students achieve an ATAR of 99.00 or higher.
            </p>
            <p className="mt-4">
              Unlike subject-specific tutoring, our ATAR coaching program takes a holistic view of your academic year. We analyse which subjects you should prioritise for scaling, how to balance SACs and internal assessments, and how to perform under pressure in external exams. Our tutors have personally navigated the competitive university entry process and understand what it takes to secure entry into Medicine, Law, Engineering, and Commerce at Australia&apos;s top universities including the University of Melbourne, UNSW, the University of Sydney, Monash University, UQ, and ANU.
            </p>
            <p className="mt-4">
              For students pursuing medicine, our tutors provide combined ATAR and UCAT preparation programs. For students targeting law or commerce, we focus on maximising humanities and social science scaling while building strong mathematical foundations. Book a free ATAR assessment today and get a personalised national ATAR strategy.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm font-black text-text-secondary uppercase tracking-widest mb-6">State-Specific Tutoring</h2>
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
            Ready to Achieve <span className="text-sapphire">99+?</span>
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto font-medium">
            Join students who have achieved 99+ ATARs with our elite mentorship program. Your journey to Australia&apos;s top universities starts here.
          </p>
          <Link href={ctaHref} className="inline-block px-12 py-5 bg-sapphire text-white font-black rounded-3xl hover:bg-white hover:text-black transition-all shadow-2xl shadow-sapphire/40 text-lg tracking-wide">
            Book Free ATAR Session
          </Link>
        </div>
      </section>
    </main>
  );
}
