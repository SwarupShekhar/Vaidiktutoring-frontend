"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Calculator,
  FlaskConical,
  History,
  GraduationCap,
  CheckCircle2,
  Clock,
  Users,
  Lightbulb,
  Target,
  TrendingUp,
  Star,
  Globe,
  Languages,
  PenTool,
  Brain,
  Palette,
  Award,
  Zap,
  Atom,
  Infinity as InfinityIcon,
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../components/subjects/ParentTestimonials";
import StickyCTA from "../components/subjects/StickyCTA";
import SubjectFAQ, { FAQItemType } from "../components/subjects/SubjectFAQ";
import { ConstellationBackground } from "../components/ib/ConstellationBackground";
import Counter from "../components/ui/Counter";

export default function IBTutorsPage({ testimonials }: { testimonials?: any[] }) {
  const { user } = useAuthContext();

  const ibFaqs: FAQItemType[] = [
    {
      q: "What makes IB tutoring different at StudyHours?",
      a: "We focus on the specific rigors of the IB programme, including IA support, TOK guidance, and Extended Essay mentoring, alongside standard subject tutoring.",
    },
    {
      q: "Do you support all IB Diploma subjects?",
      a: "Yes, we have certified tutors for all six subject groups plus core requirements like Theory of Knowledge and IA writing support.",
    },
    {
      q: "How do you help with Internal Assessments (IA)?",
      a: "Our tutors provide guidance on topic selection, research structure, and critical analysis while ensuring academic integrity and adherence to IB criteria.",
    },
    {
      q: "Can I choose between SL and HL tutoring?",
      a: "Absolutely. Our tutors are specialised in both Standard Level (SL) and Higher Level (HL) requirements for all subjects.",
    },
  ];

  return (
    <main className="min-h-screen bg-background transition-colors duration-500 relative selection:bg-sapphire/20 selection:text-sapphire">
      <StickyCTA />

      {/* ============================================
          SECTION 1: HERO (The Navigator)
      ============================================ */}
      <section className="min-h-[90vh] flex items-center pt-64 pb-24 px-6 relative overflow-hidden bg-linear-to-b from-ice-blue to-background dark:from-slate-900/50 dark:to-background">
        {/* Constellation Background */}
        <ConstellationBackground />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 1, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Added Hero Image - Absolute positioned to sit in whitespace */}
              <motion.div
                initial={{ opacity: 1, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="hidden md:block absolute -top-56 left-0 w-[180px] h-[220px] rounded-[3.5rem] overflow-hidden shadow-xl"
              >
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/v1774008401/Candid_portrait_photography_202603201735_q92yxy.jpg"
                  alt="Expert IB online tutoring student in learning session | StudyHours"
                  fill
                  sizes="180px"
                  className="object-cover"
                  priority
                />
              </motion.div>

              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface/60 dark:bg-surface/5 backdrop-blur-md border border-border text-[10px] font-black tracking-[0.2em] text-sapphire mb-6 md:mb-10 shadow-sm relative z-10">
                <Award size={14} className="text-sapphire" />
                PREMIUM IB DIPLOMA TUTORING
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-deep-navy dark:text-white mb-6 md:mb-8 tracking-tighter leading-[0.95] relative z-10 uppercase">
                IB Diploma <span className="text-sapphire">Program Success</span> with Global Experts
              </h1>
              <div className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary italic mb-6 md:mb-10 leading-tight relative z-10">
                IBDP Excellence <br />
                HL/SL, IA & TOK Specialists
              </div>
              <p className="text-lg md:text-2xl text-text-secondary mb-8 md:mb-12 leading-relaxed font-medium max-w-xl opacity-90 relative z-10">
                Excel in the International Baccalaureate with expert IBDP support. 
                From TOK and Extended Essays to subject-specific internal assessments, 
                we provide the specialized guidance needed to achieve a 40+ score.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-start">
                <Link
                  href={user ? "/bookings/new" : "/signup?type=assessment"}
                  className="w-full sm:w-auto px-12 py-5 bg-primary text-white font-black rounded-2xl hover:bg-sapphire transition-all shadow-2xl shadow-primary/30 text-center flex items-center justify-center gap-2 group overflow-hidden relative"
                >
                  <span className="relative z-10">Book a Session</span>
                  <ArrowRight
                    size={20}
                    className="relative z-10 group-hover:translate-x-1 transition-transform"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Link>
                <Link
                  href={user ? "/experts" : "/login?redirect=/experts"}
                  className="w-full sm:w-auto px-12 py-5 bg-surface/50 dark:bg-surface/5 backdrop-blur-md border border-border text-deep-navy dark:text-white font-black rounded-2xl hover:bg-surface dark:hover:bg-surface/10 transition-all text-center"
                >
                  Find a Tutor
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="relative flex justify-center items-center mt-12 lg:mt-0">
            <motion.div
              initial={{ opacity: 1, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 p-1 bg-linear-to-br from-surface/40 via-surface/20 to-transparent dark:from-surface/10 dark:via-surface/5 dark:to-transparent rounded-4xl md:rounded-[3rem] backdrop-blur-3xl border border-border/30 dark:border-border/10 shadow-2xl"
            >
              <div className="p-6 md:p-10 w-full max-w-md bg-surface/90 dark:bg-surface/90 rounded-[2.3rem] md:rounded-[2.8rem] backdrop-blur-3xl">
                <div className="grid grid-cols-3 gap-6 mb-10 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-black text-sapphire tracking-tighter">
                      2,400+
                    </div>
                    <div className="text-[9px] font-black text-text-secondary uppercase tracking-widest leading-none">
                      HOURS TAUGHT
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-black text-sapphire tracking-tighter">
                      45
                    </div>
                    <div className="text-[9px] font-black text-text-secondary uppercase tracking-widest leading-none">
                      AVG SCORE
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-black text-sapphire tracking-tighter">
                      4.9★
                    </div>
                    <div className="text-[9px] font-black text-text-secondary uppercase tracking-widest leading-none">
                      RATING
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent mb-10" />

                <div className="space-y-8">
                  <p className="text-xs font-black text-deep-navy dark:text-white uppercase tracking-widest opacity-60">
                    Help Me Find a Tutor For:
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      "Maths AA",
                      "Physics HL",
                      "Economics",
                      "TOK",
                      "Chemistry SL",
                      "English A",
                    ].map((subject) => (
                      <Link
                        key={subject}
                        href={user ? `/bookings/new?subject=${encodeURIComponent(subject)}` : `/signup?type=assessment&subject=${encodeURIComponent(subject)}`}
                        className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-black text-text-secondary dark:text-text-secondary hover:border-sapphire hover:text-white hover:bg-sapphire transition-all duration-300 shadow-sm"
                      >
                        {subject}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={user ? "/bookings/new" : "/signup?type=assessment"}
                    className="w-full py-5 bg-linear-to-br from-primary to-sapphire text-white font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 text-center flex items-center justify-center gap-3 text-sm tracking-wide"
                  >
                    Schedule Introduction
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 2: WHY IB STUDENTS COME TO US
      ============================================ */}
      <section className="py-24 md:py-40 px-6 relative overflow-hidden bg-surface dark:bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter">
              IB Tutoring Experts You Can Trust
            </h2>
            <p className="text-xl text-text-secondary dark:text-slate-400 max-w-2xl mx-auto font-medium">
              Our IB tutoring connects students with the perfect IB tutor to bridge the gap between curriculum demands and student confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: "HL Concepts That Won't Simplify Themselves",
                desc: "For the student drowning in content - we strip back the noise and focus on mastery.",
                icon: Zap,
              },
              {
                title: "IA Deadlines Creeping Up",
                desc: "For the student paralysed by their internal assessment - structured support for every draft.",
                icon: Clock,
              },
              {
                title: "Predicted Grades Under Pressure",
                desc: "For the student whose university offer depends on their score - strategic exam prep.",
                icon: TrendingUp,
              },
            ].map((callout, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 1, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="flex flex-col p-10 rounded-4xl bg-background dark:bg-surface/5 border border-border/50 hover:border-sapphire/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-sapphire/10 text-sapphire flex items-center justify-center mb-8 group-hover:bg-sapphire group-hover:text-white transition-colors duration-500">
                  <callout.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-4 tracking-tight leading-tight">
                  {callout.title}
                </h3>
                <p className="text-lg text-text-secondary opacity-80 leading-relaxed font-medium">
                  {callout.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 3: IB PROGRAMMES (PYP/MYP/DP/CP)
      ============================================ */}
      <section className="py-24 md:py-40 px-6 bg-surface dark:bg-background border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter">
              Structured <span className="text-sapphire">Program</span> Mastery
            </h2>
            <div className="w-24 h-2 bg-sapphire mx-auto rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Primary Years",
                sub: "PYP",
                desc: "Inquiry-based learning for young explorers.",
                icon: Star,
                age: "Ages 3-12",
                accent: "from-blue-400 to-blue-600",
                link: user ? "/bookings/new" : "/signup?type=assessment",
                image:
                  "https://res.cloudinary.com/de8vvmpip/image/upload/v1773997910/PYP___Young_202603201440-Photoroom_gbq65j.png",
                size: "w-72 h-72",
              },
              {
                title: "Middle Years",
                sub: "MYP",
                desc: "Critical thinking and real-world connections.",
                icon: Globe,
                age: "Ages 11-16",
                accent: "from-indigo-400 to-indigo-600",
                link: user ? "/bookings/new" : "/signup?type=assessment",
                image:
                  "https://res.cloudinary.com/de8vvmpip/image/upload/v1773998172/MYP___Early_202603201445-Photoroom_gncugc.png",
                size: "w-64 h-64",
              },
              {
                title: "Diploma",
                sub: "DP",
                desc: "Rigorous pre-university academic excellence.",
                icon: GraduationCap,
                age: "Ages 16-19",
                accent: "from-sapphire to-blue-800",
                link: user ? "/bookings/new" : "/signup?type=assessment",
                featured: true,
                image:
                  "https://res.cloudinary.com/de8vvmpip/image/upload/v1773998262/DP___Older_202603201447-Photoroom_k8kaqj.png",
                size: "w-64 h-64",
              },
              {
                title: "Career-related",
                sub: "CP",
                desc: "Practical, career-focused skill development.",
                icon: Target,
                age: "Ages 16-19",
                accent: "from-cyan-400 to-cyan-600",
                link: user ? "/bookings/new" : "/signup?type=assessment",
                image:
                  "https://res.cloudinary.com/de8vvmpip/image/upload/v1773998340/CP___Career-Focused_202603201448-Photoroom_yp2m68.png",
                size: "w-64 h-64",
              },
            ].map((prog, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -15 }}
                className={`relative p-0.5 rounded-4xl bg-linear-to-br transition-all group overflow-hidden ${
                  prog.featured
                    ? "from-sapphire to-primary shadow-[0_0_50px_rgba(79,70,229,0.2)] md:scale-105 z-10"
                    : "from-border to-transparent dark:from-border/15 dark:to-transparent shadow-2xl"
                }`}
              >
                <div className="p-10 bg-surface/90 dark:bg-surface/95 backdrop-blur-3xl rounded-3xl h-full flex flex-col items-center text-center relative overflow-hidden">
                  <div className="relative z-20 flex flex-col items-center h-full">
                    <div
                      className={`w-16 h-16 rounded-3xl bg-linear-to-br ${prog.accent} text-white flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500`}
                    >
                      <prog.icon size={32} />
                    </div>
                    <div className="mb-4">
                      <span className="text-[10px] font-black tracking-widest text-sapphire bg-sapphire/10 px-3 py-1.5 rounded-full uppercase">
                        {prog.age}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-2">
                      {prog.title}
                    </h3>
                    <h4 className="text-xl font-bold text-sapphire mb-6 opacity-60">
                      ({prog.sub})
                    </h4>
                    <p className="text-sm text-text-secondary dark:text-text-secondary font-medium leading-relaxed mb-8 flex-1">
                      {prog.desc}
                    </p>
                    <Link
                      href={prog.link}
                      className="group/btn flex items-center gap-3 text-xs font-black text-sapphire uppercase tracking-widest hover:text-primary transition-colors"
                    >
                      Find a {prog.sub} Tutor{" "}
                      <ArrowRight
                        size={14}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>

                  {/* Student Cutout Image */}
                  <div
                    className={`absolute -bottom-10 -right-12 ${prog.size || "w-64 h-64"} pointer-events-none transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-2 opacity-30 dark:opacity-45 group-hover:opacity-100 z-10`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={prog.image}
                        alt={`${prog.title} student`}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-contain object-bottom"
                        style={{
                          maskImage:
                            "linear-gradient(to top, transparent 0%, black 40%)",
                          WebkitMaskImage:
                            "linear-gradient(to top, transparent 0%, black 40%)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: BENEFITS (The "Soft Floating" Grid)
      ============================================ */}
      <section className="py-40 px-6 relative overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-10">
            <div className="max-w-2xl text-left">
              <h2 className="text-5xl md:text-6xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter">
                IB Program Benefits: Building Skills for Life
              </h2>
              <p className="text-xl text-text-secondary leading-relaxed font-medium opacity-80">
                IB benefits go beyond the classroom. We cultivate independent
                research, problem-solving, and global awareness.
              </p>
            </div>
            <div className="flex gap-4 mb-2">
              <div className="w-12 h-1.5 bg-sapphire rounded-full" />
              <div className="w-4 h-1.5 bg-border rounded-full" />
              <div className="w-2 h-1.5 bg-border rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {[
              {
                title: "Practical Learning",
                desc: "Apply complex theoretical topics to real-world outcomes.",
                icon: Lightbulb,
              },
              {
                title: "Problem Solving",
                desc: "Critically analyze facts before accepting them as truth.",
                icon: Brain,
              },
              {
                title: "Ownership",
                desc: "Manage academic plans and meet every high-stakes due date.",
                icon: Clock,
              },
              {
                title: "Global Network",
                desc: "Leverage qualifications endorsed by top global universities.",
                icon: Globe,
              },
              {
                title: "Research Excellence",
                desc: "Master the art of structured research and academic writing.",
                icon: PenTool,
              },
              {
                title: "Future Prepared",
                desc: "Confidence and open-mindedness for university challenges.",
                icon: CheckCircle2,
              },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 1, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="group relative"
              >
                <div className="mb-8 relative">
                  <div className="w-20 h-20 rounded-4xl bg-surface dark:bg-surface/5 border border-border flex items-center justify-center text-sapphire shadow-sm group-hover:scale-110 group-hover:bg-sapphire group-hover:text-white transition-all duration-700">
                    <benefit.icon size={36} strokeWidth={1} />
                  </div>
                  <div className="absolute -inset-2 bg-sapphire/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                </div>
                <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-4 tracking-tight">
                  {benefit.title}
                </h3>
                <p className="text-text-secondary dark:text-text-secondary leading-relaxed font-medium text-lg">
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: SUBJECT GROUPS
      ============================================ */}
      <section className="py-24 md:py-40 px-6 bg-surface dark:bg-slate-900/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
              The Diploma Core
            </span>
            <h2 className="text-4xl md:text-7xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter">
              Expert Support Across <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary">
                Every IB Subject Group
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <SubjectGroup
              cardId="1"
              title="Group 1: Language & Literature"
              icon={Languages}
              subjects={[
                "Language A: Literature",
                "Language A: Language & Literature",
                "Literature & Performance",
                "Self-Taught Literature Support",
              ]}
            />
            <SubjectGroup
              cardId="2"
              title="Group 2: Language Acquisition"
              icon={Languages}
              isExpandable
              initialShow={6}
              subjects={[
                "English B",
                "French B",
                "Spanish B",
                "German B",
                "Mandarin B",
                "Arabic B",
                "Japanese B",
                "Italian B",
                "Russian B",
                "Hindi B",
                "French ab initio",
                "Spanish ab initio",
                "German ab initio",
                "Mandarin ab initio",
                "Arabic ab initio",
                "Latin",
                "Ancient Greek",
              ]}
            />
            <SubjectGroup
              cardId="3"
              title="Group 3: Individuals & Societies"
              icon={Globe}
              isExpandable
              initialShow={6}
              subjects={[
                "Business Management",
                "Economics",
                "Geography",
                "Global Politics",
                "History",
                "ITGS",
                "Philosophy",
                "Psychology",
                "Social & Cultural Anthropology",
                "World Religions",
                "Environmental Systems & Societies (ESS)",
              ]}
            />
            <SubjectGroup
              cardId="4"
              title="Group 4: Sciences"
              icon={FlaskConical}
              subjects={[
                "Biology",
                "Chemistry",
                "Physics",
                "Computer Science",
                "Design Technology",
                "Sports Exercise & Health Science (SEHS)",
                "Environmental Systems & Societies (ESS)",
              ]}
            />
            <SubjectGroup
              cardId="5"
              title="Group 5: Mathematics"
              icon={Calculator}
              subjects={[
                "Mathematics: Analysis & Approaches (AA)",
                "Mathematics: Applications & Interpretation (AI)",
              ]}
              note="Available at both Standard Level (SL) and Higher Level (HL)"
            />
            <SubjectGroup
              cardId="6"
              title="Group 6: The Arts"
              icon={Palette}
              subjects={["Dance", "Film", "Music", "Theatre", "Visual Arts"]}
            />
          </div>

          <div className="text-center border-b border-border pb-16">
            <p className="text-lg font-black text-deep-navy/60 italic uppercase tracking-tight">
              Don't see your subject? We likely cover it —{" "}
              <Link
                href="/contact"
                className="text-sapphire underline underline-offset-4 hover:text-primary transition-colors"
              >
                GET IN TOUCH.
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4.1: ADDITIONAL SUPPORT BAND
      ============================================ */}
      <section className="py-20 px-6 bg-ice-blue/30 dark:bg-slate-900 border-b border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Internal Assessments (IA)",
                subtitle:
                  "Specialist support for all IB IA components — drafting, structure, and submission",
                icon: PenTool,
              },
              {
                title: "Exam Preparation",
                subtitle:
                  "Targeted past paper practice and revision strategy for May and November series",
                icon: Clock,
              },
              {
                title: "University Admissions Guidance",
                subtitle:
                  "Personal statement support and subject selection advice for top university applications",
                icon: GraduationCap,
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-sapphire/10 text-sapphire flex items-center justify-center mb-6">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-black text-deep-navy dark:text-white mb-2 uppercase italic tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm font-medium text-text-secondary dark:text-slate-400 mb-6 leading-relaxed opacity-80">
                  {item.subtitle}
                </p>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-sapphire hover:text-primary transition-colors"
                >
                  Get Started <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 5: HOW IT WORKS FOR IB STUDENTS
      ============================================ */}
      <section className="py-24 md:py-40 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter">
              How It Works for{" "}
              <span className="text-sapphire">IB Students</span>
            </h2>
            <p className="text-xl text-text-secondary dark:text-slate-400 max-w-2xl mx-auto font-medium">
              A structured path to your predicted grade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Tell us your programme and subjects",
                desc: "DP, Grade 12, Maths AA HL - we need the details to match the expert.",
                icon: BookOpen,
              },
              {
                step: "02",
                title: "Get matched with an IB-specialist tutor",
                desc: "Not just any tutor - someone who has mastered the IB mark scheme.",
                icon: Users,
              },
              {
                step: "03",
                title: "Start with a structured session plan",
                desc: "Built around your specific syllabus and upcoming exam dates.",
                icon: Target,
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                className="relative p-10 rounded-4xl bg-surface dark:bg-surface/5 border border-border group"
              >
                <div className="absolute -top-6 -right-6 text-6xl font-black text-sapphire/5 group-hover:text-sapphire/10 transition-colors">
                  {step.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-sapphire/10 text-sapphire flex items-center justify-center mb-8">
                  <step.icon size={24} />
                </div>
                <h3 className="text-xl font-black text-deep-navy dark:text-white mb-4 tracking-tight leading-tight">
                  {step.title}
                </h3>
                <p className="text-base text-text-secondary opacity-80 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 6: IA + EXAM PREP CALLOUT
      ============================================ */}
      {/* ============================================
          SECTION 6: IA + EXAM PREP (The 50/50 Conversion)
      ============================================ */}
      <section className="py-24 md:py-48 px-6 bg-surface dark:bg-background relative overflow-hidden border-y border-border">
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sapphire/5 dark:bg-sapphire/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left: Text Content */}
            <div className="max-w-2xl text-left order-2 lg:order-1">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
                Seasonal Intensive
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter leading-tight">
                IB Exams in May? <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary transition-all">
                  Let's build your prep plan now.
                </span>
              </h2>
              <p className="text-xl text-text-secondary dark:text-slate-400 mb-12 font-medium leading-relaxed max-w-xl">
                Deadlines approach faster than you think. Secure specialist
                support for IA drafts and final exam revision with tutors who
                have mastered the IB mark scheme.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link
                  href={user ? "/bookings/new" : "/signup?type=assessment"}
                  className="w-full sm:w-auto px-12 py-6 bg-sapphire text-white font-black rounded-3xl hover:bg-primary transition-all shadow-2xl shadow-sapphire/20 text-center tracking-tighter text-lg"
                >
                  Start Exam Prep
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-12 py-6 border-2 border-border text-deep-navy dark:text-white font-black rounded-3xl hover:bg-surface transition-all text-center tracking-tighter text-lg"
                >
                  Speak with an Advisor
                </Link>
              </div>
            </div>

            {/* Right: Featured Image */}
            <div className="relative order-1 lg:order-2">
              <div className="relative aspect-square md:aspect-video lg:aspect-square group">
                {/* Decorative Backdrop */}
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/10 to-primary/5 rounded-[4rem] transform rotate-3 scale-95 transition-transform duration-700 group-hover:rotate-0" />
                <div className="absolute inset-0 bg-linear-to-tr from-ice-blue/30 to-white/10 dark:from-slate-800/50 dark:to-transparent rounded-[4rem] -rotate-3 transition-transform duration-700 group-hover:rotate-0" />

                <div className="relative h-full w-full flex items-end justify-center overflow-hidden rounded-[4rem]">
                  <Image
                    src="https://res.cloudinary.com/de8vvmpip/image/upload/v1773998923/Candid_photography_of_202603201458-Photoroom_ao4da2.png"
                    alt="IB Student Exam Success"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain object-bottom scale-110 group-hover:scale-115 transition-transform duration-[2s] ease-out z-10"
                  />

                  {/* Academic Doodles */}
                  <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-[15%] left-[10%] text-sapphire/20 dark:text-sapphire/30 blur-[0.5px]"
                  >
                    <Atom size={64} strokeWidth={1} />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 25, 0], rotate: [0, -15, 0] }}
                    transition={{
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-[40%] right-[10%] text-primary/20 dark:text-primary/30 blur-[0.5px]"
                  >
                    <Calculator size={48} strokeWidth={1} />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -30, 0], rotate: [5, -5, 5] }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-[25%] left-[15%] text-sapphire/20 dark:text-sapphire/30 blur-[0.5px]"
                  >
                    <FlaskConical size={52} strokeWidth={1} />
                  </motion.div>

                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 20, 0] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-[40%] right-[15%] text-primary/20 dark:text-primary/30 blur-[0.5px]"
                  >
                    <PenTool size={40} strokeWidth={1} />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 15, 0], opacity: [0.1, 0.3, 0.1] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-[25%] right-[25%] text-sapphire/10 dark:text-sapphire/20"
                  >
                    <div className="text-4xl font-black italic tracking-tighter">
                      &pi;
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ x: [0, 15, 0], y: [0, 10, 0] }}
                    transition={{
                      duration: 9,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-[35%] left-[5%] text-primary/15 dark:text-primary/25 blur-[1px]"
                  >
                    <Globe size={56} strokeWidth={1} />
                  </motion.div>

                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
                    transition={{
                      duration: 11,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-[10%] right-[30%] text-sapphire/20 dark:text-sapphire/30 blur-[0.5px]"
                  >
                    <Brain size={44} strokeWidth={1} />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -25, 0], x: [0, 10, 0] }}
                    transition={{
                      duration: 13,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-[10%] right-[35%] text-primary/10 dark:text-primary/20"
                  >
                    <Palette size={48} strokeWidth={1} />
                  </motion.div>

                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute bottom-[15%] left-[40%] text-sapphire/20"
                  >
                    <InfinityIcon size={32} strokeWidth={1} />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 30, 0] }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-[45%] left-[35%] text-primary/10"
                  >
                    <div className="text-5xl font-black italic tracking-tighter">
                      &Sigma;
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ParentTestimonials testimonials={testimonials} />

      <SubjectFAQ items={ibFaqs} title="Frequently Asked Questions" />

      {/* ============================================
          SECTION 7: ADDITIONAL SUPPORT
      ============================================ */}
      <section className="py-24 md:py-40 px-6 bg-surface">
        <div className="max-w-7xl mx-auto p-1 bg-linear-to-br from-sapphire to-primary rounded-[4rem]">
          <div className="p-16 rounded-[3.8rem] bg-background dark:bg-slate-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-linear-to-bl from-sapphire/5 dark:from-sapphire/10 to-transparent" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-8 text-deep-navy dark:text-white tracking-tight">
                  Additional <br />
                  High-Value <span className="text-sapphire">Support</span>
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed font-medium mb-12">
                  Guidance for the high-stakes assessments and admissions that
                  define your future.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                  {[
                    { name: "IA Support", urgency: "High Urgency" },
                    { name: "Exam Preparation", urgency: "Spring/Fall" },
                    { name: "University Admissions", urgency: "Advisory" },
                    { name: "CAS Guidance", urgency: "Ongoing" },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-2 group/item">
                      <div className="flex items-center gap-4 text-deep-navy dark:text-white hover:text-sapphire transition-colors cursor-default">
                        <div className="w-6 h-6 rounded-full bg-sapphire/10 dark:bg-sapphire/20 flex items-center justify-center text-sapphire group-hover/item:bg-sapphire group-hover/item:text-white transition-colors">
                          <CheckCircle2 size={14} />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest leading-none">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[10px] ml-10 font-black text-sapphire/60 uppercase tracking-widest">
                        {item.urgency}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  href={user ? "/bookings/new" : "/signup?type=assessment"}
                  className="inline-flex items-center gap-2 text-sm font-black text-sapphire hover:text-primary transition-colors uppercase tracking-widest"
                >
                  Book specialists for these services <ArrowRight size={16} />
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-[3rem] bg-surface dark:bg-white/5 border border-border relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
                  <div className="absolute inset-x-0 bottom-0 top-[40%] bg-linear-to-t from-sapphire/10 dark:from-sapphire/20 to-transparent" />
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-8xl font-black text-sapphire mb-2 transition-all">
                      45
                    </span>
                    <span className="text-xs font-black text-text-secondary tracking-[0.4em] uppercase text-center px-6 leading-relaxed">
                      Your Goal Score
                      <br />
                      Within Reach
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 9: FINAL CONVERSION (The Grand CTA)
      ============================================ */}
      <section className="py-24 md:py-32 px-6 bg-[#05010a] relative overflow-hidden">
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
              Your IB Score Is <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary transition-all">
                Still Yours to Define.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 mb-12 md:mb-16 font-medium leading-relaxed max-w-2xl mx-auto px-4 md:px-0">
              Join the students achieving 40+ points with specialised,
              one-on-one IB mentorship.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
              <Link
                href={user ? "/bookings/new" : "/signup?type=assessment"}
                className="w-full sm:w-auto px-12 py-5 bg-white text-black font-black rounded-3xl hover:bg-primary hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] text-lg tracking-wide active:scale-95"
              >
                Book a Session
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-12 py-5 border-2 border-white/20 text-white font-black rounded-3xl hover:bg-white/5 transition-all text-lg tracking-wide"
              >
                Speak with an Advisor
              </Link>
            </div>
            <div className="mt-16 pt-12 border-t border-white/5 flex items-center justify-between opacity-40">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                IB Diploma {new Date().getFullYear() + (new Date().getMonth() > 6 ? 1 : 0)}
              </span>
              <Link
                href="/igcse-online-tutoring"
                className="text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-sapphire transition-colors"
              >
                Switch to IGCSE →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-deep-navy dark:text-white mb-6 tracking-normal">
            Which IB Subjects Do We Cover?
          </h2>
          <p className="text-sm text-text-secondary dark:text-slate-400 leading-relaxed font-normal opacity-80 max-w-4xl">
            Our tutors provide specialist support across all six IB Diploma
            subject groups. In Group 1 we cover Language A Literature, Language
            A Language and Literature, Literature and Performance, and
            Self-Taught Literature. Group 2 language acquisition support
            includes English B, French B, Spanish B, German B, Mandarin B,
            Arabic B, Japanese B, Italian B, Russian B, Hindi B, and ab initio
            courses in French, Spanish, German, Mandarin, and Arabic, as well as
            Latin and Ancient Greek. Group 3 Individuals and Societies subjects
            include Business Management, Economics, Geography, Global Politics,
            History, ITGS, Philosophy, Psychology, Social and Cultural
            Anthropology, World Religions, and Environmental Systems and
            Societies. Group 4 Sciences covered include Biology, Chemistry,
            Physics, Computer Science, Design Technology, Sports Exercise and
            Health Science, and Environmental Systems and Societies. Group 5
            Mathematics support covers both Mathematics Analysis and Approaches
            and Mathematics Applications and Interpretation at Standard and
            Higher Level. Group 6 Arts subjects include Dance, Film, Music,
            Theatre, and Visual Arts. We also provide dedicated support for
            Internal Assessments, exam preparation, and university admissions
            guidance.
          </p>
        </div>
      </section>
    </main>
  );
}

interface SubjectGroupProps {
  cardId: string;
  title: string;
  icon: any;
  subjects: string[];
  isExpandable?: boolean;
  initialShow?: number;
  note?: string;
}

function SubjectGroup({
  cardId,
  title,
  icon: Icon,
  subjects,
  isExpandable,
  initialShow,
  note,
}: SubjectGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedSubjects =
    isExpandable && initialShow !== undefined && !isExpanded ? subjects.slice(0, initialShow) : subjects;

  return (
    <div className="p-10 rounded-[3rem] bg-white dark:bg-slate-900/50 border border-border dark:border-white/10 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
      {/* Group Watermark */}
      <div className="absolute top-4 left-4 text-[120px] font-black text-sapphire/5 select-none pointer-events-none leading-none z-0">
        {cardId}
      </div>

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-sapphire/5 text-sapphire flex items-center justify-center mb-8 group-hover:bg-sapphire group-hover:text-white transition-colors">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-black text-deep-navy dark:text-white mb-6 tracking-tight uppercase italic">
          {title}
        </h3>
        <div className="flex flex-wrap gap-2 mb-8">
          <AnimatePresence mode="popLayout">
            {displayedSubjects.map((sub: string) => (
              <motion.span
                key={sub}
                initial={{ opacity: 1, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="px-3 py-1.5 rounded-xl bg-surface dark:bg-slate-800/50 border border-border dark:border-white/10 text-[10px] font-black text-deep-navy/70 dark:text-white/70 uppercase tracking-tight"
              >
                {sub}
              </motion.span>
            ))}
          </AnimatePresence>
          {isExpandable && initialShow !== undefined && subjects.length > initialShow && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="px-3 py-1.5 rounded-xl border border-sapphire/30 text-[10px] font-black text-sapphire uppercase tracking-tight hover:bg-sapphire/5 transition-colors"
            >
              + {subjects.length - initialShow} more
            </button>
          )}
        </div>
        {note && (
          <p className="text-[10px] font-bold text-sapphire/60 uppercase tracking-widest mb-4 italic">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
