"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  GraduationCap,
  BookOpen,
  Target,
  LineChart,
  Users,
  CheckCircle2,
  Award,
  FileText,
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../components/subjects/ParentTestimonials";
import StickyCTA from "../components/subjects/StickyCTA";
import SubjectFAQ, { FAQItemType } from "../components/subjects/SubjectFAQ";

interface OnlineTutoringUKClientProps {
  faqs: FAQItemType[];
  testimonials?: any[];
}

export default function OnlineTutoringUKClient({
  faqs,
  testimonials,
}: OnlineTutoringUKClientProps) {
  const { user } = useAuthContext();

  const ctaHref = user ? "/bookings/new" : "/signup?type=assessment";

  return (
    <main className="min-h-screen bg-background transition-colors duration-500 relative selection:bg-sapphire/20 selection:text-sapphire">
      <StickyCTA />

      {/* ============================================
          HERO SECTION
      ============================================ */}
      <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden selection:bg-sapphire/20">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-ice-blue/40 to-transparent dark:from-sapphire/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left column */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface/60 border border-border text-[10px] font-black tracking-[0.2em] text-sapphire mb-10 shadow-sm uppercase">
                <ShieldCheck size={14} className="text-sapphire" />
                Expert Online Tutors Across the UK
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter leading-[0.95] uppercase">
                Expert Online Tutoring{" "}
                <span className="text-sapphire text-balance">
                  for UK Students
                </span>
              </h1>

              <p className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary italic mb-10 leading-tight">
                GCSE &bull; A-Level &bull; IB &bull; IGCSE &mdash; Specialist
                Tutors for Every UK Curriculum
              </p>

              <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed font-medium max-w-xl">
                Personalised 1-on-1 online tutoring for students across the UK.
                AQA, Edexcel, OCR and Cambridge International specialists
                available seven days a week — no travel, no commute.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-start">
                <Link
                  href={ctaHref}
                  className="w-full sm:w-auto px-12 py-6 bg-sapphire text-white font-black rounded-3xl hover:bg-primary transition-all shadow-2xl shadow-sapphire/20 text-center flex items-center justify-center gap-3 group text-lg tracking-tighter"
                >
                  Book a Free Assessment
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <div className="flex items-center gap-4 px-6 md:px-0">
                  <div className="text-sm font-black text-deep-navy dark:text-white uppercase tracking-widest leading-tight">
                    Trusted by <br />
                    UK Families
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-border/50">
                <div>
                  <div className="text-3xl font-black text-sapphire mb-1 tracking-tighter">
                    4.9<span className="text-yellow-400">★</span>
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                    Rating
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-sapphire mb-1 tracking-tighter">
                    2,000+
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                    UK Sessions
                  </div>
                </div>
                <div>
                  <div className="text-xl font-black text-sapphire mb-1 tracking-tighter leading-snug">
                    AQA
                    <br />
                    Edexcel
                    <br />
                    OCR
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                    Exam Boards
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right column — decorative trust block */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-6"
            >
              {[
                {
                  icon: GraduationCap,
                  label: "GCSE Specialists",
                  sub: "AQA · Edexcel · OCR",
                },
                {
                  icon: BookOpen,
                  label: "A-Level Experts",
                  sub: "University Preparation",
                },
                {
                  icon: Award,
                  label: "IB Diploma",
                  sub: "HL & SL Support",
                },
                {
                  icon: FileText,
                  label: "IGCSE Tutors",
                  sub: "Cambridge International",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-white dark:bg-slate-900/50 border border-border dark:border-white/10 shadow-sm hover:shadow-xl transition-all group flex flex-col gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-sapphire/5 text-sapphire flex items-center justify-center group-hover:bg-sapphire group-hover:text-white transition-colors">
                    <card.icon size={24} />
                  </div>
                  <div>
                    <div className="font-black text-deep-navy dark:text-white uppercase tracking-tighter text-lg leading-tight">
                      {card.label}
                    </div>
                    <div className="text-[11px] font-black text-sapphire uppercase tracking-widest mt-1 opacity-70">
                      {card.sub}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 1 — WHY UK STUDENTS CHOOSE ONLINE TUTORING
      ============================================ */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
              Why Online Tutoring
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white tracking-tighter uppercase leading-none mb-6">
              Why UK Students Choose{" "}
              <span className="text-sapphire">Online Tutoring</span>
            </h2>
            <p className="text-xl font-medium text-text-secondary opacity-70 max-w-3xl mx-auto">
              Online private tutoring in the UK has grown rapidly — not because
              it is a compromise, but because it delivers superior outcomes.
              1-on-1 video-call lessons remove geographic limitations, letting
              students access the country's top specialists regardless of where
              they live.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Flexible Scheduling",
                desc: "Book sessions that work around school, clubs, and family life. Evening, weekend, and holiday tutoring available across all UK time zones.",
              },
              {
                icon: GraduationCap,
                title: "Exam Board Specialists",
                desc: "Every StudyHours tutor is aligned to a specific exam board — AQA, Edexcel, or OCR — so your child is learning the right content, the right way.",
              },
              {
                icon: MapPin,
                title: "No Travel Required",
                desc: "From London to Edinburgh, Birmingham to Cardiff — our tutors reach every corner of the UK. All you need is a laptop and an internet connection.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-4xl bg-white dark:bg-slate-900/50 border border-border dark:border-white/10 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-sapphire/5 text-sapphire flex items-center justify-center mb-8 group-hover:bg-sapphire group-hover:text-white transition-colors">
                  <card.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-4 tracking-tight leading-tight uppercase italic">
                  {card.title}
                </h3>
                <p className="text-text-secondary dark:text-slate-400 font-medium leading-relaxed opacity-80">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 2 — GCSE ONLINE TUTORING UK
      ============================================ */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
                Key Stage 4
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter uppercase leading-none">
                GCSE Online Tutoring UK
              </h2>
              <p className="text-xl text-text-secondary dark:text-slate-400 mb-8 leading-relaxed font-medium">
                Our GCSE tutors are trained to the exact specifications of AQA,
                Edexcel, and OCR. Whether your child needs Maths Foundation,
                Higher Tier Science, English Literature analysis, or any other
                subject, we match them with a specialist who knows their exam
                board inside out. Sessions are structured around their specific
                syllabus, with mark-scheme-aligned practice built into every
                lesson.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  "AQA Aligned",
                  "Edexcel Aligned",
                  "OCR Aligned",
                  "Year 9–11",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="px-4 py-2 rounded-full border border-sapphire/20 bg-sapphire/5 text-xs font-black text-sapphire uppercase tracking-widest"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <Link
                href="/gcse-online-tutoring"
                className="inline-flex items-center gap-2 text-lg font-black text-sapphire hover:text-primary transition-all group tracking-tighter uppercase italic"
              >
                Explore GCSE Tutoring
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                "GCSE Maths",
                "GCSE English",
                "GCSE Biology",
                "GCSE Chemistry",
                "GCSE Physics",
                "GCSE History",
                "GCSE Geography",
                "GCSE French",
              ].map((subj) => (
                <div
                  key={subj}
                  className="p-5 rounded-2xl border border-border dark:border-white/10 bg-white dark:bg-slate-900/40 text-center"
                >
                  <span className="text-xs font-black text-deep-navy dark:text-white uppercase tracking-tight">
                    {subj}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 3 — A-LEVEL ONLINE TUTORING UK
      ============================================ */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 order-2 lg:order-1"
            >
              {[
                "A-Level Maths",
                "A-Level Chemistry",
                "A-Level Biology",
                "A-Level Physics",
                "A-Level Economics",
                "A-Level Psychology",
                "A-Level History",
                "A-Level English",
              ].map((subj) => (
                <div
                  key={subj}
                  className="p-5 rounded-2xl border border-border dark:border-white/10 bg-white dark:bg-slate-900/40 text-center"
                >
                  <span className="text-xs font-black text-deep-navy dark:text-white uppercase tracking-tight">
                    {subj}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
                Sixth Form
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter uppercase leading-none">
                A-Level Online Tutoring UK
              </h2>
              <p className="text-xl text-text-secondary dark:text-slate-400 mb-8 leading-relaxed font-medium">
                A-Levels are the gateway to UK universities, and the margin
                between an offer and a rejection can be a single grade. Our
                A-Level tutors are Edexcel, AQA, and OCR specialists who
                understand exactly what examiners are looking for — and how to
                train students to deliver it under timed conditions. We also
                support UCAS personal statement preparation and interview
                technique for competitive programmes.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                {["Year 12", "Year 13", "University Prep", "UCAS Support"].map(
                  (chip) => (
                    <span
                      key={chip}
                      className="px-4 py-2 rounded-full border border-sapphire/20 bg-sapphire/5 text-xs font-black text-sapphire uppercase tracking-widest"
                    >
                      {chip}
                    </span>
                  )
                )}
              </div>
              <Link
                href="/a-level-online-tutoring"
                className="inline-flex items-center gap-2 text-lg font-black text-sapphire hover:text-primary transition-all group tracking-tighter uppercase italic"
              >
                Explore A-Level Tutoring
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4 — IB ONLINE TUTORING UK
      ============================================ */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
                International Baccalaureate
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter uppercase leading-none">
                IB Online Tutoring UK
              </h2>
              <p className="text-xl text-text-secondary dark:text-slate-400 mb-8 leading-relaxed font-medium">
                The International Baccalaureate Diploma is offered at many of
                the UK's leading independent and international schools. Its
                demands — from Higher Level subject papers to the Extended Essay,
                Theory of Knowledge, and Internal Assessments — require
                specialist support that goes far beyond standard A-Level
                tutoring. StudyHours IB tutors are experienced with the IB
                Diploma Programme and understand the nuances of each group's
                assessment objectives.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  "HL & SL Support",
                  "Extended Essay",
                  "TOK",
                  "Internal Assessments",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="px-4 py-2 rounded-full border border-sapphire/20 bg-sapphire/5 text-xs font-black text-sapphire uppercase tracking-widest"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <Link
                href="/ib-online-tutoring"
                className="inline-flex items-center gap-2 text-lg font-black text-sapphire hover:text-primary transition-all group tracking-tighter uppercase italic"
              >
                Explore IB Tutoring
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-10 rounded-4xl bg-sapphire text-white shadow-2xl shadow-sapphire/20"
            >
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 leading-tight">
                IB Diploma Components We Cover
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Group 1–6 Subject Tutoring", detail: "HL & SL" },
                  {
                    label: "Extended Essay (EE) Guidance",
                    detail: "All subjects",
                  },
                  { label: "Theory of Knowledge (TOK)", detail: "Essay & Exhibition" },
                  {
                    label: "Internal Assessments (IA)",
                    detail: "Planning to submission",
                  },
                  { label: "CAS Documentation", detail: "Portfolio support" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="shrink-0" />
                      <span className="font-black uppercase tracking-tight text-sm">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70 shrink-0 ml-2">
                      {item.detail}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 5 — IGCSE ONLINE TUTORING UK
      ============================================ */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-10 rounded-4xl bg-white dark:bg-slate-900/40 border border-border dark:border-white/10 shadow-sm order-2 lg:order-1"
            >
              <h3 className="text-2xl font-black text-deep-navy dark:text-white uppercase tracking-tighter mb-8 leading-tight">
                IGCSE Subjects We Tutor
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Mathematics",
                  "English Language",
                  "Biology",
                  "Chemistry",
                  "Physics",
                  "Economics",
                  "History",
                  "Geography",
                  "Computer Science",
                  "Business Studies",
                ].map((subj) => (
                  <div
                    key={subj}
                    className="flex items-center gap-2 p-3 rounded-xl bg-surface dark:bg-slate-800/50 border border-border dark:border-white/10"
                  >
                    <CheckCircle2 size={14} className="text-sapphire shrink-0" />
                    <span className="text-[11px] font-black text-deep-navy dark:text-white uppercase tracking-tight">
                      {subj}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
                Cambridge International
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter uppercase leading-none">
                IGCSE Online Tutoring UK
              </h2>
              <p className="text-xl text-text-secondary dark:text-slate-400 mb-8 leading-relaxed font-medium">
                The IGCSE is widely taught at UK international and independent
                schools as an alternative to standard GCSEs. Cambridge
                International IGCSEs are globally respected and demand a
                rigorous approach to both content and exam technique.
                StudyHours tutors specialise in Cambridge International
                syllabuses, preparing students for the same high-level
                assessment standards expected at premium UK schools.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  "Cambridge International",
                  "International Schools",
                  "Independent Schools",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="px-4 py-2 rounded-full border border-sapphire/20 bg-sapphire/5 text-xs font-black text-sapphire uppercase tracking-widest"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <Link
                href="/igcse-online-tutoring"
                className="inline-flex items-center gap-2 text-lg font-black text-sapphire hover:text-primary transition-all group tracking-tighter uppercase italic"
              >
                Explore IGCSE Tutoring
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 6 — HOW IT WORKS
      ============================================ */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sapphire mb-3 block">
            Our Process
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white tracking-tighter uppercase leading-none mb-6">
            How Online Tutoring Works at StudyHours
          </h2>
          <p className="text-xl font-medium text-text-secondary opacity-70 max-w-2xl mx-auto">
            A structured four-step journey from first contact to measurable
            grade improvement.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-4">
          {[
            {
              step: "01",
              title: "Diagnostic Assessment",
              icon: Target,
              desc: "We begin with a thorough diagnostic session to understand your child's current level, knowledge gaps, and specific exam board requirements.",
            },
            {
              step: "02",
              title: "Tutor Matching",
              icon: Users,
              desc: "We match your child with a subject specialist whose expertise and teaching style aligns perfectly with their curriculum and learning profile.",
              featured: true,
            },
            {
              step: "03",
              title: "Personalised Sessions",
              icon: BookOpen,
              desc: "Live 1-on-1 video-call lessons built around your child's syllabus, exam board mark schemes, and individual learning pace.",
            },
            {
              step: "04",
              title: "Progress Reports",
              icon: LineChart,
              desc: "After every session, parents receive a structured progress update including topics covered, improvement areas, and recommended focus for next time.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-3xl border transition-all ${
                item.featured
                  ? "bg-sapphire border-sapphire shadow-2xl shadow-sapphire/20 scale-[1.02]"
                  : "bg-white dark:bg-slate-900 border-border dark:border-white/10"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div
                  className={`text-4xl font-black tracking-tighter scale-y-125 ${
                    item.featured ? "text-white" : "text-sapphire"
                  }`}
                >
                  {item.step}
                </div>
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    item.featured
                      ? "bg-white/20 text-white"
                      : "bg-sapphire/5 text-sapphire"
                  }`}
                >
                  <item.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-xl font-black uppercase mb-1 ${
                      item.featured
                        ? "text-white"
                        : "text-deep-navy dark:text-white"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`font-medium ${
                      item.featured
                        ? "text-white/80"
                        : "text-text-secondary dark:text-slate-400"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================================
          SECTION 7 — EXAM BOARD TRUST BAND
      ============================================ */}
      <section className="py-16 px-6 bg-surface dark:bg-slate-900/50 border-y border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-md">
            <h3 className="text-2xl font-black text-deep-navy dark:text-white uppercase tracking-tighter leading-none mb-2">
              We tutor across all{" "}
              <span className="text-sapphire">Major UK Exam Boards.</span>
            </h3>
            <p className="text-sm font-medium text-text-secondary">
              Official curriculum alignment for every lesson.
            </p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-deep-navy dark:text-white">
                  DBS Enhanced
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-sapphire" />
                <span className="text-[10px] font-black uppercase tracking-widest text-deep-navy dark:text-white">
                  UK-Based Experts
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 hover:opacity-100 transition-opacity">
            {["AQA", "Edexcel", "OCR", "Cambridge", "WJEC"].map((board) => (
              <div
                key={board}
                className="text-3xl lg:text-4xl font-black text-slate-400 select-none tracking-tighter"
              >
                {board}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 8 — TESTIMONIALS
      ============================================ */}
      <ParentTestimonials testimonials={testimonials} />

      {/* ============================================
          SECTION 9 — FAQ
      ============================================ */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16 px-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
              FAQs
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white tracking-tighter uppercase leading-tight">
              Common Questions About{" "}
              <span className="text-sapphire italic">Online Tutoring UK</span>
            </h2>
          </div>
          <SubjectFAQ
            items={faqs}
            description="Everything UK families need to know about online private tutoring."
          />
        </div>
      </section>

      {/* ============================================
          SECTION 10 — CLOSING CTA
      ============================================ */}
      <section className="py-24 px-6 bg-deep-navy dark:bg-slate-950 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.9]">
              Start Your Child's{" "}
              <span className="text-sapphire dark:text-blue-400">
                Online Tutoring
              </span>{" "}
              Journey Today
            </h2>
            <p className="text-xl text-blue-200/80 mb-12 font-medium max-w-2xl mx-auto">
              Join over 2,000 UK families who have improved their child's grades
              with StudyHours. Book a free assessment and we will find the right
              tutor within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
              <Link
                href={ctaHref}
                className="w-full sm:w-auto px-12 py-6 bg-sapphire text-white font-black rounded-4xl hover:bg-primary transition-all shadow-2xl text-lg uppercase tracking-tighter"
              >
                Book Free Assessment
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-12 py-6 border-2 border-white/20 text-white font-black rounded-4xl hover:bg-white/10 transition-all text-lg uppercase tracking-tighter"
              >
                Talk to an Advisor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEO text block */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-deep-navy dark:text-white mb-6 tracking-normal">
            Online Tutoring UK: All Subjects, Every Exam Board
          </h2>
          <p className="text-sm text-text-secondary dark:text-slate-400 leading-relaxed font-normal opacity-80 max-w-4xl">
            StudyHours provides expert online tutoring to students across the
            United Kingdom. Our private online tutors cover GCSE, A-Level,
            IGCSE, and IB Diploma subjects for students in London, Manchester,
            Birmingham, Leeds, Bristol, Edinburgh, Cardiff, and every other UK
            city. We specialise in AQA, Edexcel, OCR, and Cambridge
            International exam boards, giving every student tailored support
            aligned to their exact curriculum. Whether you are searching for an
            online tutor UK, a private tutor online UK, or tutor online UK
            services, StudyHours connects you with verified specialists in
            Mathematics, English, Biology, Chemistry, Physics, History,
            Geography, Economics, Psychology, and all major languages. Every
            session is delivered live via video call — flexible, personalised,
            and proven to improve grades.
          </p>
        </div>
      </section>
    </main>
  );
}
