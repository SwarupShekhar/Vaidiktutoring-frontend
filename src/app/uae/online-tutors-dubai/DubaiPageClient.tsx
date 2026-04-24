"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Target,
  Star,
  Globe,
  Award,
  MapPin,
  Monitor,
  BookOpen,
  Users,
  GraduationCap,
  Clock,
  Navigation,
  CheckCircle2,
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../../components/subjects/ParentTestimonials";
import StickyCTA from "../../components/subjects/StickyCTA";
import SubjectFAQ, { FAQItemType } from "../../components/subjects/SubjectFAQ";

export default function DubaiPageClient({
  testimonials = [],
  faqs = [],
}: {
  testimonials?: any[];
  faqs?: FAQItemType[];
}) {
  const { user } = useAuthContext();

  const dubaiCurricula = [
    {
      name: "British Curriculum",
      subtitle: "IGCSE · GCSE · A-Level",
      description:
        "The most common private school curriculum in Dubai. Our tutors cover all Cambridge CIE, Edexcel, and AQA specifications with deep knowledge of each board's mark scheme.",
      schools: [
        "GEMS Wellington International",
        "Repton Dubai",
        "Kings School Al Barsha",
        "JESS Arabian Ranches",
        "Brighton College Dubai",
        "North London Collegiate School",
      ],
      examBoards: ["Cambridge CIE", "Edexcel", "AQA"],
      icon: BookOpen,
    },
    {
      name: "IB Diploma",
      subtitle: "PYP · MYP · DP",
      description:
        "International Baccalaureate tutoring across all three programmes. IB requires deep conceptual understanding   our tutors know the Internal Assessment requirements and Extended Essay standards.",
      schools: [
        "GEMS World Academy",
        "Hartland International School",
        "Jumeirah College",
        "Dubai International Academy",
        "Sunmarke School",
      ],
      examBoards: ["IB Organisation", "DP Year 1–2", "MYP Years 1–5"],
      icon: GraduationCap,
    },
    {
      name: "MOE UAE Curriculum",
      subtitle: "National Curriculum · Arabic & English",
      description:
        "UAE Ministry of Education curriculum for both Arabic-medium and English-medium KHDA-regulated schools. Includes support for Emsat exam preparation and bilingual subjects.",
      schools: [
        "Al Ittihad Private School",
        "GEMS Modern Academy (mixed)",
        "Bloom Education Schools",
        "Taaleem Schools",
      ],
      examBoards: ["UAE MOE", "KHDA Regulated", "Emsat Exam"],
      icon: Globe,
    },
    {
      name: "American Curriculum",
      subtitle: "Grades K–12 · AP · SAT",
      description:
        "Full support for the American curriculum including Advanced Placement (AP) subjects and SAT/ACT preparation. Our tutors understand US-style grading and college application requirements.",
      schools: [
        "Dubai American Academy",
        "GEMS American Academy",
        "Greenfield International School",
        "American School of Dubai",
      ],
      examBoards: ["College Board AP", "SAT / ACT", "Common Core"],
      icon: Star,
    },
    {
      name: "Indian Curriculum",
      subtitle: "CBSE · ICSE · ISC",
      description:
        "CBSE and ICSE tutoring for Dubai's large Indian expat community. Our tutors are fully aligned to NCERT textbooks and CISCE board standards, covering all Grades 6–12.",
      schools: [
        "Delhi Private School Dubai",
        "Our Own English High School",
        "Indian High School Dubai",
        "The Indian Academy",
        "DPS Modern Indian School",
      ],
      examBoards: ["CBSE Board", "CISCE / ICSE", "ISC Year 11–12"],
      icon: Target,
    },
  ];

  const whyOnlinePoints = [
    {
      icon: Navigation,
      title: "Skip the Sheikh Zayed Road traffic",
      desc: "Dubai rush hour can turn a 15-minute journey into 90 minutes. Online sessions start exactly on time, every time   whether your child is in JLT, Mirdif, or Dubai Hills Estate.",
    },
    {
      icon: Monitor,
      title: "Recorded sessions for revision",
      desc: "Every StudyHours session is recordable. Dubai students replay key explanations before IGCSE mock exams, IB Internal Assessment submissions, and A-Level revision weeks.",
    },
    {
      icon: Globe,
      title: "Access global subject specialists",
      desc: "The best Cambridge IGCSE Additional Maths specialist may not live near Al Barsha. Online tutoring gives Dubai families access to the world's best tutors, matched to your exact board.",
    },
    {
      icon: Clock,
      title: "Flexible Gulf Standard Time slots",
      desc: "We offer morning, afternoon, and evening sessions in GST (UTC+4). Schools in Dubai typically end at 2–3pm   our tutors are available from 3pm through 10pm UAE time.",
    },
    {
      icon: Users,
      title: "Consistent 1-on-1 relationship",
      desc: "Unlike tutoring centres in Dubai where students rotate between teachers, each StudyHours student keeps the same specialist tutor throughout the academic year   building genuine understanding.",
    },
    {
      icon: ShieldCheck,
      title: "Vetted and curriculum-matched",
      desc: "Every StudyHours tutor is background-checked and assessed for curriculum competency. You get a specialist who knows your child's exact school board and assessment format   not a generalist.",
    },
  ];

  const dubaiSchools = [
    { school: "GEMS Wellington International School", type: "British · IGCSE · A-Level · Cambridge" },
    { school: "Repton Dubai", type: "British · IGCSE · A-Level · Edexcel" },
    { school: "Kings School Al Barsha & Dubai Marina", type: "British · GCSE · A-Level · AQA/Edexcel" },
    { school: "JESS Arabian Ranches", type: "British · IGCSE · A-Level" },
    { school: "Brighton College Dubai", type: "British · IGCSE · A-Level · Cambridge" },
    { school: "GEMS World Academy", type: "IB Diploma · MYP · PYP" },
    { school: "Hartland International School", type: "IB Diploma · MYP" },
    { school: "Jumeirah College", type: "British · IB Diploma" },
    { school: "Dubai American Academy", type: "American · AP · SAT" },
    { school: "Delhi Private School Dubai", type: "CBSE · Indian Curriculum" },
    { school: "Our Own English High School", type: "CBSE / ICSE · Indian Curriculum" },
    { school: "Al Ittihad Private School", type: "MOE UAE · National Curriculum" },
  ];

  const dubaiAreas = [
    "Dubai Marina",
    "Jumeirah Beach Residence",
    "Jumeirah Lake Towers",
    "Business Bay",
    "Downtown Dubai",
    "Jumeirah 1, 2 & 3",
    "Dubai Hills Estate",
    "Arabian Ranches",
    "Mirdif",
    "Deira",
    "Al Barsha",
    "Al Quoz",
    "Motor City & Sports City",
    "Silicon Oasis",
    "Palm Jumeirah",
    "Bur Dubai",
    "Creek Harbour",
    "Al Khawaneej",
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
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 1, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface/60 dark:bg-surface/5 backdrop-blur-md border border-border text-[10px] font-black tracking-[0.2em] text-sapphire mb-10 shadow-sm">
                <ShieldCheck size={14} className="text-sapphire" />
                KHDA-Aware Tutors   Dubai's Online Tutoring Specialists
              </div>
              <h1 className="text-4xl md:text-6xl xl:text-7xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter leading-[0.95] uppercase">
                Online Tutors{" "}
                <span className="text-sapphire">Dubai</span>  {" "}
                Every Curriculum, Every Subject
              </h1>
              <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary italic mb-8 leading-tight">
                IGCSE · A-Level · IB · MOE UAE · American · CBSE
              </div>
              <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed font-medium max-w-xl opacity-90">
                Dubai schools follow over five different curricula. Our specialist
                tutors are matched to your child&apos;s exact exam board, school, and
                assessment style   not just their subject.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-start">
                <Link
                  href={user ? "/bookings/new" : "/signup?type=assessment"}
                  className="w-full sm:w-auto px-12 py-6 bg-sapphire text-white font-black rounded-3xl hover:bg-primary transition-all shadow-2xl shadow-sapphire/20 text-center flex items-center justify-center gap-3 group text-lg tracking-tighter"
                >
                  Book a Free Session
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <div className="flex items-center gap-4 px-6 md:px-0">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-background bg-slate-200 dark:bg-slate-800"
                      />
                    ))}
                  </div>
                  <div className="text-sm font-black text-deep-navy dark:text-white uppercase tracking-widest leading-tight">
                    Join 4,200+ <br />
                    UAE Students
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column   Image */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 1, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="relative z-10 aspect-square rounded-[3.5rem] overflow-hidden shadow-2xl group"
              >
                <div className="absolute inset-0 bg-linear-to-t from-deep-navy/40 to-transparent z-10" />
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/f_auto,q_auto/v1776664040/A_student_attending_202604201117_gjneuk.jpg"
                  alt="Online tutoring session for Dubai students   IGCSE, IB, A-Level and MOE UAE curriculum specialist"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                  className="object-cover group-hover:scale-105 transition-transform duration-[6s]"
                  priority
                />
              </motion.div>

              {/* Stats Overlay */}
              <motion.div
                initial={{ opacity: 1, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -bottom-10 -left-6 md:-left-12 z-20 p-6 md:p-8 bg-white dark:bg-slate-900 rounded-4xl border border-border shadow-2xl w-full max-w-[340px]"
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-sapphire tracking-tighter leading-none">
                      94%
                    </div>
                    <div className="text-[8px] font-black text-text-secondary uppercase tracking-[0.15em]">
                      Improvement
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-sapphire tracking-tighter leading-none">
                      110+
                    </div>
                    <div className="text-[8px] font-black text-text-secondary uppercase tracking-[0.15em]">
                      Tutors
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-sapphire tracking-tighter leading-none">
                      5+
                    </div>
                    <div className="text-[8px] font-black text-text-secondary uppercase tracking-[0.15em]">
                      Curricula
                    </div>
                  </div>
                </div>
                <div className="h-px w-full bg-border my-4" />
                <div className="flex flex-wrap gap-2 justify-center">
                  {["IGCSE", "IB Diploma", "A-Level", "MOE UAE", "CBSE"].map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 rounded-full bg-sapphire/5 text-[9px] font-black text-sapphire uppercase tracking-widest"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 2: DUBAI CURRICULUM LANDSCAPE
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-surface dark:bg-slate-900/50 border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
              Dubai School Curricula
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase leading-none">
              Which Curriculum Does{" "}
              <span className="text-sapphire">Your School Follow?</span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
              Dubai operates one of the world&apos;s most diverse private school
              landscapes. Over 200 KHDA-regulated schools follow five major
              international curricula. Our tutors are subject specialists  
              matched to your child&apos;s exact board and school, not just the subject.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dubaiCurricula.map((curr, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-10 rounded-[3rem] bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all overflow-hidden flex flex-col"
              >
                {/* Subtle Background Glow on Hover */}
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-border shadow-sm flex items-center justify-center text-sapphire group-hover:scale-110 transition-transform duration-500">
                      <curr.icon size={28} />
                    </div>
                    <span className="text-[10px] font-black text-sapphire uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">
                      DUBAI-MATCHED
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-deep-navy dark:text-white mb-1 tracking-tighter uppercase leading-tight group-hover:text-sapphire transition-colors italic">
                    {curr.name}
                  </h3>
                  <p className="text-[10px] font-black text-sapphire uppercase tracking-[0.2em] mb-6 block">
                    {curr.subtitle}
                  </p>
                  
                  <p className="text-[14px] text-text-secondary font-medium leading-relaxed mb-10 italic opacity-80 group-hover:opacity-100 transition-opacity">
                    {curr.description}
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                       Supporting Top Schools
                    </p>
                    <div className="flex flex-wrap gap-2 leading-relaxed">
                      {curr.schools.slice(0, 3).map((school, idx) => (
                        <span key={idx} className="text-[11px] font-bold text-deep-navy/70 dark:text-white/70 italic bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-lg">
                          {school}
                        </span>
                      ))}
                      <span className="text-[11px] font-bold text-sapphire italic px-2 py-1 bg-sapphire/5 rounded-lg">and more...</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-border/30 flex items-center justify-between text-sapphire group-hover:translate-x-1 transition-transform duration-500">
                    <div className="flex gap-4">
                      {curr.examBoards.slice(0, 2).map(board => (
                        <span key={board} className="text-[9px] font-black uppercase tracking-widest">{board}</span>
                      ))}
                    </div>
                    <ArrowRight size={16} />
                  </div>
                </div>

                {/* Interactive Corner Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-sapphire/10 to-transparent -translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </motion.div>
            ))}

            {/* 6th card: Other curricula */}
            <motion.div
              initial={{ opacity: 1, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="group relative p-10 rounded-[3rem] bg-linear-to-br from-sapphire to-primary text-white border border-sapphire shadow-2xl hover:scale-[1.02] transition-all flex flex-col justify-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-8 backdrop-blur-md border border-white/30">
                <Award size={32} />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase italic leading-none">
                Other <br />Curricula
              </h3>
              <p className="text-base font-medium opacity-90 leading-relaxed mb-10 italic">
                Lycée Français, German, Pakistani SSC/HSSC, and all KHDA-regulated frameworks.
              </p>
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-white text-sapphire font-black rounded-3xl text-sm uppercase tracking-widest hover:bg-ice-blue transition-colors shadow-lg"
              >
                Specialist Match
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 3: WHY ONLINE TUTORING IN DUBAI
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-background relative overflow-hidden border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
              The Dubai Advantage
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase leading-none">
              Why Dubai Families{" "}
              <span className="text-sapphire">Choose Online Tutoring</span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
              Dubai&apos;s unique geography, traffic, and diverse school landscape make
              online tutoring the more practical and academically effective choice
              for most families in the city.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyOnlinePoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-10 rounded-[3rem] bg-surface dark:bg-surface/5 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl bg-sapphire/5 text-sapphire flex items-center justify-center mb-8 font-black group-hover:bg-sapphire group-hover:text-white transition-colors duration-500 shadow-sm border border-sapphire/10">
                  <point.icon size={24} />
                </div>
                <h3 className="text-xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase leading-tight italic group-hover:text-sapphire transition-colors">
                  {point.title}
                </h3>
                <p className="text-[14px] text-text-secondary font-medium leading-relaxed opacity-80 italic">
                  {point.desc}
                </p>
                <div className="mt-auto pt-6 border-t border-border/30 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 text-sapphire">
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none">Dubai Optimized</span>
                  <ArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: BEFORE / AFTER CONTRAST
      ============================================ */}
      <section className="py-12 md:py-24 px-6 bg-surface dark:bg-background relative overflow-hidden border-b border-border">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">
                The Transformation
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-deep-navy dark:text-white tracking-tighter uppercase mb-6 leading-tight">
                Before vs After{" "}
                <span className="text-sapphire">StudyHours Dubai</span>
              </h2>
              <p className="text-lg text-text-secondary font-medium leading-relaxed">
                Most Dubai families have tried tutoring centres or home tutors
                before finding StudyHours. Here&apos;s what changes when you switch to
                a curriculum-matched specialist.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-4xl overflow-hidden shadow-lg relative group">
                <div className="absolute inset-0 bg-deep-navy/20 group-hover:bg-transparent transition-colors z-10" />
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/f_auto,q_auto/v1776665877/A_split-screen_comparison_202604201147_b8af5s.jpg"
                  alt="StudyHours Dubai Transformation   Comparison of traditional tutoring vs our curriculum-matched online specialists"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-[4s]"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 p-5 bg-sapphire text-white rounded-4xl shadow-2xl max-w-[200px] z-20">
                <h4 className="text-base font-black mb-1 tracking-tighter uppercase leading-none">
                  Proven Results.
                </h4>
                <p className="text-[9px] font-medium opacity-80 uppercase tracking-widest leading-relaxed">
                  94% of Dubai students improve within one term.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[3rem] overflow-hidden border border-border bg-white dark:bg-slate-900/50 shadow-2xl">
            <div className="grid grid-cols-12 bg-linear-to-r from-deep-navy to-sapphire text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <div className="col-span-12 px-8 py-6 flex items-center justify-between">
                <span>Performance Trajectory</span>
                <span className="text-emerald-400">KHDA Standard Excellence</span>
              </div>
            </div>
            <div className="divide-y divide-border">
              {[
                {
                  without: "Generalist home tutor who doesn't know your school's internal assessment format or mark scheme",
                  with: "Curriculum-matched specialist who has studied your exact exam board, school marking style, and past paper patterns",
                },
                {
                  without: "Home tutor stuck in Sheikh Zayed Road or Al Khail Road traffic   session starts 20–30 minutes late",
                  with: "Online session starts on time, every time   zero travel delays, zero cancellations due to Dubai traffic",
                },
                {
                  without: "Different teacher each visit at a Dubai tuition centre   no continuity, no relationship",
                  with: "Same 1-on-1 specialist tutor every week   builds a genuine understanding of your child's specific learning gaps",
                },
                {
                  without: "No record of what was explained   student forgets the tutor's examples by exam time",
                  with: "Fully recorded sessions available for replay   Dubai students rewatch explanations during final revision weeks",
                },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 group border-t border-border first:border-0">
                  <div className="md:col-span-4 p-8 bg-slate-50/50 dark:bg-white/5 border-b md:border-b-0 md:border-r border-border">
                    <span className="text-[10px] font-black text-sapphire uppercase tracking-widest block mb-2">Dubai Challenge</span>
                    <p className="text-xs font-bold text-deep-navy dark:text-white uppercase leading-tight tracking-tight">Academic Friction</p>
                  </div>
                  <div className="md:col-span-4 p-8 bg-red-50/20 dark:bg-red-900/5 border-b md:border-b-0 md:border-r border-border group-hover:bg-red-50/40 transition-colors">
                    <span className="text-[8px] font-black text-red-500 uppercase tracking-widest block mb-4">Traditional Tutoring</span>
                    <p className="text-[13px] text-text-secondary font-medium leading-relaxed italic">{row.without}</p>
                  </div>
                  <div className="md:col-span-4 p-8 bg-emerald-50/20 dark:bg-emerald-900/5 group-hover:bg-emerald-50/40 transition-colors">
                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest block mb-4">StudyHours Outcome</span>
                    <p className="text-[13px] text-deep-navy dark:text-white font-black leading-relaxed italic">{row.with}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 5: DUBAI SCHOOLS WE SUPPORT
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-background border-b border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
                School-Specific Knowledge
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter leading-tight uppercase">
                We Know{" "}
                <span className="text-sapphire">Dubai&apos;s Top Schools</span>
              </h2>
              <p className="text-xl text-text-secondary mb-8 font-medium leading-relaxed">
                Different Dubai schools assess the same curriculum differently. A
                GEMS Wellington student sitting Cambridge IGCSE faces different
                internal mock formats than a student at Repton or Kings School. A
                GEMS World Academy IB student has different IA conventions than
                Hartland International. Our tutors know these school-specific
                nuances   and they use them.
              </p>
              <p className="text-base text-text-secondary mb-10 font-medium leading-relaxed opacity-80">
                This level of school-level knowledge is what separates a
                StudyHours tutor from a generic private tutor in Dubai. We don&apos;t
                just teach the subject   we teach it the way your school needs it
                assessed.
              </p>

              <div className="space-y-3">
                {dubaiSchools.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 1, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-surface dark:bg-white/5 border border-border hover:border-sapphire/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-sapphire shrink-0 group-hover:scale-150 transition-transform" />
                      <span className="text-sm font-black text-deep-navy dark:text-white tracking-tight">
                        {item.school}
                      </span>
                    </div>
                    <span className="text-[9px] font-black text-sapphire uppercase tracking-widest hidden sm:block shrink-0 ml-4">
                      {item.type}
                    </span>
                  </motion.div>
                ))}
              </div>

              <p className="text-sm text-text-secondary mt-6 font-medium opacity-70 italic">
                Don&apos;t see your school? We support 200+ KHDA-regulated Dubai
                schools.{" "}
                <Link href="/contact" className="text-sapphire underline">
                  Contact us
                </Link>{" "}
                to confirm your school is covered.
              </p>
            </div>

            {/* Right: What students get */}
            <div className="lg:sticky lg:top-28">
              <div className="p-10 rounded-[3rem] bg-surface dark:bg-surface/5 border border-border">
                <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter uppercase">
                  What Every Dubai Student Gets
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      title: "Free diagnostic assessment",
                      desc: "We assess against your specific curriculum and school level   not a generic placement test.",
                    },
                    {
                      title: "Curriculum-matched tutor",
                      desc: "Matched to a specialist who knows your school's exact exam board and internal format.",
                    },
                    {
                      title: "Personalised session plan",
                      desc: "Built around your school's term dates, internal exam schedule, and final exam timetable.",
                    },
                    {
                      title: "Progress reports",
                      desc: "Regular performance reviews showing grade trajectory   shared with parents every 4 weeks.",
                    },
                    {
                      title: "Recorded sessions",
                      desc: "Every session recorded and available for replay   critical for Dubai students in revision weeks.",
                    },
                    {
                      title: "UAE time zone availability",
                      desc: "Tutors available mornings, afternoons, and evenings in Gulf Standard Time (GST, UTC+4).",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-sapphire/10 text-sapphire flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-deep-navy dark:text-white mb-1 tracking-tight">
                          {item.title}
                        </p>
                        <p className="text-xs text-text-secondary font-medium leading-relaxed opacity-80">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-border">
                  <Link
                    href={user ? "/bookings/new" : "/signup?type=assessment"}
                    className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-sapphire text-white font-black rounded-3xl hover:bg-primary transition-all shadow-lg text-base tracking-tighter"
                  >
                    Book Free Session
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 6: DUBAI AREAS COVERED
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-surface dark:bg-slate-900/50 border-b border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
            Coverage
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase">
            Serving Students Across{" "}
            <span className="text-sapphire">All of Dubai</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            Online tutoring means no location limits. Whether you&apos;re in a high-rise
            in Dubai Marina, a villa in Arabian Ranches, or an apartment in Silicon
            Oasis   sessions are available in your home, at your schedule, in Gulf
            Standard Time (GST).
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-14">
            {dubaiAreas.map((area) => (
              <div
                key={area}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-white/5 border border-border shadow-sm text-sm font-black text-deep-navy dark:text-white hover:border-sapphire/50 hover:text-sapphire transition-colors"
              >
                <MapPin size={12} className="text-sapphire shrink-0" />
                {area}
              </div>
            ))}
          </div>

          <Link
            href={user ? "/bookings/new" : "/signup?type=assessment"}
            className="inline-flex items-center gap-3 px-10 py-5 bg-sapphire text-white font-black rounded-3xl hover:bg-primary transition-all shadow-xl text-lg tracking-tighter"
          >
            Book a Free Session Today
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ============================================
          SECTION 7: 4-STEP METHOD
      ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-background border-b border-border overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
              The Method
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter uppercase">
              How StudyHours Works{" "}
              <span className="text-emerald-500 underline decoration-2 underline-offset-8 decoration-emerald-500/30">
                for Dubai Students
              </span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
              A structured four-step process that takes any Dubai student  
              regardless of curriculum   from their current level to their target
              grade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Free Diagnostic Assessment",
                desc: "We assess your child's current level against their specific Dubai curriculum   Cambridge IGCSE, IB, MOE UAE, or other. Real exam-board aligned questions.",
                step: "01",
                accent: "border-sapphire/30",
                icon: Target,
              },
              {
                title: "Curriculum-Matched Tutor",
                desc: "You are matched to a specialist who knows your school's exact exam board, internal mock format, and mark scheme expectations.",
                step: "02",
                accent: "border-emerald-500/30",
                icon: Users,
              },
              {
                title: "Structured 1-on-1 Sessions",
                desc: "60-minute live online sessions covering concept work and past papers. Every session is recorded for revision replay.",
                step: "03",
                accent: "border-purple-500/30",
                icon: Monitor,
              },
              {
                title: "Progress Reviews & Reporting",
                desc: "Regular grade tracking and written tutor feedback reports. We identify gaps before they become problems.",
                step: "04",
                accent: "border-primary/30",
                icon: Award,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group relative p-10 rounded-[3rem] bg-white dark:bg-slate-900/50 border ${item.accent} hover:shadow-2xl transition-all flex flex-col`}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 text-sapphire flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform shadow-sm border border-border/50">
                    <item.icon size={24} />
                  </div>
                  <span className="text-4xl font-black text-sapphire/5 tracking-tighter uppercase group-hover:text-sapphire/10 transition-colors italic">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase leading-tight italic group-hover:text-sapphire transition-colors">
                  {item.title}
                </h3>
                <p className="text-[14px] text-text-secondary font-medium leading-relaxed opacity-80 italic">
                  {item.desc}
                </p>
                <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 text-sapphire">
                  <ArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 8: TESTIMONIALS
      ============================================ */}
      <ParentTestimonials testimonials={testimonials} />

      {/* ============================================
          SECTION 9: FAQ
      ============================================ */}
      <SubjectFAQ
        items={faqs}
        title="Frequently Asked Questions   Online Tutors Dubai"
      />

      {/* ============================================
          SECTION 10: FINAL CTA
      ============================================ */}
      <section className="py-24 md:py-32 px-6 bg-[#05010a] relative overflow-hidden transition-colors">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/de8vvmpip/image/upload/f_auto,q_auto/v1776666577/A_soft__slightly_202604201159_dgge00.jpg"
            alt="StudyHours Dubai   Premium online tutoring"
            fill
            sizes="100vw"
            className="object-cover opacity-30 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#05010a] via-transparent to-[#05010a]" />
        </div>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
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
              Dubai Students <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary transition-all">
                Deserve the Best.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 mb-12 md:mb-16 font-medium leading-relaxed max-w-2xl mx-auto px-4 md:px-0">
              Whether your child follows IGCSE at GEMS Wellington, the IB Diploma
              at Hartland International, or the MOE UAE curriculum   they deserve a
              tutor who truly knows their path. Book a free diagnostic assessment
              today and we&apos;ll match them with the right specialist within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
              <Link
                href={user ? "/bookings/new" : "/signup?type=assessment"}
                className="w-full sm:w-auto px-12 py-5 bg-white text-black font-black rounded-3xl hover:bg-primary hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] text-lg tracking-wide active:scale-95"
              >
                Book Free Session
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
                Dubai · Abu Dhabi · Sharjah · UAE
              </span>
              <Link
                href="/uae/online-tutors-abu-dhabi"
                className="text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-sapphire transition-colors"
              >
                Abu Dhabi Tutors →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 11: RELATED PAGES (Internal Links)
      ============================================ */}
      <section className="py-16 px-6 bg-surface dark:bg-background border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-black text-deep-navy dark:text-white mb-8 tracking-tight uppercase">
            Related Tutoring Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "IGCSE Online Tutoring", href: "/igcse-online-tutoring" },
              { label: "IB Diploma Tutors", href: "/ib-online-tutoring" },
              { label: "A-Level Tutors Online", href: "/a-level-online-tutoring" },
              { label: "MOE UAE Curriculum Tutors", href: "/uae/moe-uae-curriculum-tutors" },
              { label: "Online Tutors Abu Dhabi", href: "/uae/online-tutors-abu-dhabi" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-white/5 border border-border hover:border-sapphire/50 hover:shadow-md transition-all group"
              >
                <span className="text-xs font-black text-deep-navy dark:text-white uppercase tracking-tight group-hover:text-sapphire transition-colors leading-tight">
                  {link.label}
                </span>
                <ArrowRight
                  size={12}
                  className="text-sapphire opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 12: SEO CONTENT PARAGRAPH
      ============================================ */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-deep-navy dark:text-white mb-6 tracking-normal">
            Find the Best Online Tutors in Dubai for Every Curriculum
          </h2>
          <p className="text-sm text-text-secondary dark:text-slate-400 leading-relaxed font-normal opacity-80 max-w-4xl">
            StudyHours connects Dubai families with{" "}
            <strong>online tutors in Dubai</strong> who are curriculum specialists
            across every major programme taught in KHDA-regulated schools. Our{" "}
            <strong>Dubai online tutoring</strong> service covers the British
            curriculum, including{" "}
            <strong>IGCSE tutoring in Dubai</strong> across Cambridge CIE and
            Edexcel exam boards, and{" "}
            <strong>A-Level online tutoring</strong> across AQA, Edexcel, and
            Cambridge International AS &amp; A Level specifications. Schools
            served include GEMS Wellington International School, Repton Dubai,
            Kings School Al Barsha, JESS Arabian Ranches, Brighton College Dubai,
            and North London Collegiate School Dubai. For International
            Baccalaureate families, our{" "}
            <strong>IB tutors in Dubai</strong> cover the full IB Diploma
            Programme (DP), Middle Years Programme (MYP), and Primary Years
            Programme (PYP) at GEMS World Academy, Hartland International School,
            Jumeirah College, and Dubai International Academy. Students following
            the <strong>MOE UAE curriculum in Dubai</strong>   regulated by KHDA
              receive specialist support aligned to the Ministry of Education
            national syllabus for both Arabic-medium and English-medium
            instruction, including Emsat exam preparation.{" "}
            <strong>American curriculum tutors</strong> support students at Dubai
            American Academy, GEMS American Academy, and Greenfield International
            School for Advanced Placement (AP) subjects and SAT preparation.
            Indian curriculum students at Delhi Private School Dubai, Our Own
            English High School, and Indian High School Dubai receive{" "}
            <strong>CBSE and ICSE online tuition</strong> from specialist tutors
            aligned to NCERT textbooks and CISCE board standards. All{" "}
            <strong>private tutors in Dubai</strong> through StudyHours are
            background-checked, exam-board assessed, and available in Gulf
            Standard Time   serving families across Dubai Marina, JLT, Business
            Bay, Downtown Dubai, Jumeirah, Dubai Hills Estate, Arabian Ranches,
            Mirdif, Al Barsha, Deira, Silicon Oasis, Palm Jumeirah, and all other
            Dubai residential areas.
          </p>
        </div>
      </section>
    </main>
  );
}
