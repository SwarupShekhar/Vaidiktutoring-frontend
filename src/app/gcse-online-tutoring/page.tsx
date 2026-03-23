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
  Globe,
  Languages,
  Award,
  Zap,
  LineChart,
  Atom,
  Sigma,
  Pi,
  Palette,
  Music,
  Monitor,
  CheckSquare,
  AlertTriangle,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../components/subjects/ParentTestimonials";
import StickyCTA from "../components/subjects/StickyCTA";
import SubjectFAQ, { FAQItemType } from "../components/subjects/SubjectFAQ";
import Counter from "../components/ui/Counter";

export default function GCSEOnlineTutoringPage() {
  const { user } = useAuthContext();

  const gcseFaqs: FAQItemType[] = [
    {
      q: "What is the most picked GCSE subject?",
      a: "The most popular GCSEs are English, Maths, and Science, which are compulsory for nearly all students. Popular optional subjects include History, Geography, and Art & Design. Popularity often reflects a subject's usefulness for A-Levels, university, or career goals.",
    },
    {
      q: "What is the least popular GCSE subject?",
      a: "According to JCQ data from November 2025, the least popular GCSE subjects include Welsh (Second Language), Latin, Astronomy, and various specialist technology courses. However, a small number of entries does not mean a subject is less valuable or respected.",
    },
    {
      q: "When should I start GCSE tutoring for my child?",
      a: "Start as soon as a problem is identified — whether that is a drop in confidence, falling grades, or gaps in understanding. Year 9 or early Year 10 is ideal for building strong foundations without pressure. Mid-Year 10 works well for consolidating key topics and practising exam-style questions. Year 11 is best for intensive revision, exam technique, and reducing last-minute anxiety.",
    },
    {
      q: "How do I choose a reliable GCSE tutor service?",
      a: "Prioritise subject-specific expertise and a proven track record with your child's exact exam board — AQA, Edexcel, or OCR. Look for a tutor who starts with a diagnostic assessment rather than a one-size-fits-all approach. Ensure their teaching style builds confidence and focuses on exam technique, not just content knowledge. Always book a trial session first to confirm they are the right fit for your child.",
    },
  ];
  const subjectSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Core Subjects" },
      { "@type": "ListItem", "position": 2, "name": "Sciences" },
      { "@type": "ListItem", "position": 3, "name": "Humanities & Social Sciences" },
      { "@type": "ListItem", "position": 4, "name": "Creative & Technical" },
      { "@type": "ListItem", "position": 5, "name": "Languages" }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": gcseFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://studyhours.com" },
      { "@type": "ListItem", "position": 2, "name": "Programs", "item": "https://studyhours.com/k-12-online-tutoring" },
      { "@type": "ListItem", "position": 3, "name": "GCSE Tutoring", "item": "https://studyhours.com/gcse-online-tutoring" }
    ]
  };

  const ratingSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "GCSE Online Tutoring",
    "serviceType": "Tutoring",
    "provider": { "@type": "Organization", "name": "StudyHours" },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1200",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <main className="min-h-screen bg-background transition-colors duration-500 relative selection:bg-sapphire/20 selection:text-sapphire">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(subjectSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ratingSchema) }}
      />
      <StickyCTA />

      {/* ============================================
          SECTION 1: HERO (The Steady Hand)
      ============================================ */}
      <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden selection:bg-sapphire/20">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-ice-blue/40 to-transparent dark:from-sapphire/5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Column — Reassurance & Urgency */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface/60 border border-border text-[10px] font-black tracking-[0.2em] text-sapphire mb-10 shadow-sm uppercase">
                <ShieldCheck size={14} className="text-sapphire" />
                Specialist UK GCSE Support
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter leading-[0.95] uppercase">
                Your Child&apos;s GCSE Results <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary italic">
                  Are Not Fixed Yet.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed font-medium max-w-xl">
                 Behind on GCSEs? There&apos;s still time to turn grades around - if you start now. 
                We provide the calm, structured plan your child needs.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-start">
                <Link
                  href={user ? "/bookings/new" : "/signup?type=assessment"}
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

              {/* Parent Focused Stats */}
              <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-border/50">
                <div>
                  <div className="text-3xl font-black text-sapphire mb-1 tracking-tighter">92%</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Grade Improvements Tracked</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-sapphire mb-1 tracking-tighter">100%</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Exam Board Aligned Tutors</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-sapphire mb-1 tracking-tighter">500+</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">UK GCSE Specialists</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column — Relationship Focused */}
            <div className="relative">
              <div className="aspect-4/5 rounded-[3rem] overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 bg-deep-navy/10 group-hover:bg-transparent transition-colors z-10" />
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/v1774002647/Tutor_and_young_202603201600-Photoroom_tumr1w.png"
                  alt="Tutor and Student Working Together"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[4s]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 2: THE PROBLEM WE SOLVE
      ============================================ */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 text-balance">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">The Problem We Solve</span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy tracking-tighter uppercase leading-none mb-6">
              Recognise These <span className="text-sapphire">Moments?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Mock results came back worse than expected", 
                desc: "A disappointing mock is often a wake-up call. We turn that concern into a focused rescue plan that targets exactly where marks were lost.",
                icon: AlertTriangle
              },
              { 
                title: "Exams are months away and revision hasn&apos;t started", 
                desc: "Procrastination is usually hidden anxiety. We break the syllabus down into manageable daily wins to get momentum back instantly.",
                icon: Clock
              },
              { 
                title: "Year 9 gaps are catching up in Year 11", 
                desc: "GCSE builds on foundations. We quickly identify and bridge those missing links from earlier years that are blocking current progress.",
                icon: Zap
              },
            ].map((col, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-4xl bg-white dark:bg-slate-900/50 border border-border dark:border-white/10 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-sapphire/5 text-sapphire flex items-center justify-center mb-8 group-hover:bg-sapphire group-hover:text-white transition-colors">
                  <col.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-4 tracking-tight leading-tight uppercase italic">{col.title}</h3>
                <p className="text-text-secondary dark:text-slate-400 font-medium leading-relaxed opacity-80">{col.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 3: WARNING SIGNS
      ============================================ */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-deep-navy mb-8 tracking-tighter uppercase leading-none">
                Is Your Child Showing <br />
                <span className="text-sapphire">These Signs?</span>
              </h2>
              <div className="space-y-4 mb-10">
                {[
                  "Avoiding homework or revision",
                  "Grades dropping between assessments",
                   "Saying they &apos;understand&apos; but struggling in tests",
                  "Disorganised notes or missing classwork",
                  "Increased stress or anxiety around schoolwork",
                ].map((sign, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-border dark:border-white/10 group hover:bg-sapphire/5 transition-colors">
                    <div className="mt-1">
                      <CheckSquare className="text-sapphire" size={20} />
                    </div>
                    <p className="font-black text-deep-navy/80 dark:text-white/80 uppercase tracking-tight italic">{sign}</p>
                  </div>
                ))}
              </div>
              <p className="text-lg font-medium text-text-secondary mb-8 italic">
                If you recognised any of these—this is the right time to act. Early intervention is the key to protecting their potential.
              </p>
              <Link
                href="/signup?type=assessment"
                className="inline-flex items-center gap-2 px-10 py-5 bg-sapphire text-white font-black rounded-3xl hover:bg-primary transition-all shadow-xl"
              >
                Speak to an Advisor
                <MessageCircle size={20} />
              </Link>
            </motion.div>
            <div className="relative">
              <div className="aspect-square rounded-4xl overflow-hidden shadow-2xl relative">
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/v1774002717/Warning_Signs___202603201601-Photoroom_vej9y0.png"
                  alt="Student showing signs of academic stress"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: FIND YOUR SUBJECT
      ============================================ */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">Selection</span>
          <h2 className="text-4xl md:text-5xl font-black text-deep-navy tracking-tighter uppercase leading-none">
            Every GCSE Subject, <span className="text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary">One Trusted Platform</span>
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {/* Core Subjects */}
           <SubjectGroup 
            title="Core Subjects" 
            subjects={["GCSE Maths (Foundation & Higher)", "GCSE English Language", "GCSE English Literature", "GCSE Sciences"]}
            boards={["AQA", "Edexcel", "OCR"]}
            icon={Target}
          />
          {/* Sciences (Expandable but open) */}
          <SubjectGroup 
            title="Sciences" 
            subjects={["GCSE Biology", "GCSE Chemistry", "GCSE Physics", "GCSE Combined Science"]}
            boards={["AQA", "Edexcel", "OCR"]}
            icon={FlaskConical}
            isExpandable={true}
            defaultExpanded={true}
          />
          <SubjectGroup 
            title="Humanities & Social Sciences" 
            subjects={["GCSE History", "GCSE Geography", "GCSE Sociology", "GCSE Religious Education"]}
            icon={History}
          />
          <SubjectGroup 
            title="Creative & Technical" 
            subjects={["GCSE Art & Design", "GCSE Music", "GCSE ICT", "GCSE Computer Science"]}
            icon={Palette}
          />
          <SubjectGroup 
            title="Languages" 
            subjects={["GCSE French", "GCSE Spanish", "GCSE German", "GCSE Italian", "GCSE Arabic"]}
            icon={Languages}
          />
        </div>

        <div className="max-w-7xl mx-auto mt-16 text-center border-t border-border pt-12">
          <p className="text-lg font-black text-deep-navy/60 italic uppercase tracking-tight">
             Don&apos;t see your subject? We likely cover it - <Link href="/contact" className="text-sapphire underline underline-offset-4 hover:text-primary transition-colors">get in touch.</Link>
          </p>
        </div>

      </section>



       {/* ============================================
          SECTION 5: HOW OUR CLASSES WORK
      ============================================ */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 text-center mb-20">
           <h2 className="text-4xl md:text-5xl font-black text-deep-navy tracking-tighter uppercase leading-none mb-6">
               How Our Classes <span className="text-sapphire italic">Work</span>
           </h2>
           <p className="text-xl font-medium text-text-secondary opacity-70">A calm, structured path to the results your child deserves.</p>
        </div>

        <div className="max-w-5xl mx-auto space-y-4">
          {[
             { step: "01", title: "Initial Assessment", desc: "Understand your child&apos;s starting level and specific conceptual gaps." },
            { step: "02", title: "Personalised Plan", desc: "Built entirely around their specific exam board and revision timetable." },
            { step: "03", title: "Live 1-on-1 Sessions", desc: "Pure focus on concept clarity followed by rigorous exam technique practice." },
            { step: "04", title: "Regular Progress Reports", desc: "So you always know where they stand: no more guessing or uncertainty.", featured: true },
            { step: "05", title: "Exam Preparation", desc: "The final push: past papers, official mark schemes, and timed practice." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-3xl border transition-all ${item.featured ? 'bg-sapphire border-sapphire shadow-2xl shadow-sapphire/20 scale-[1.02]' : 'bg-white dark:bg-slate-900 border-border dark:border-white/10'}`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className={`text-4xl font-black tracking-tighter scale-y-125 ${item.featured ? 'text-white' : 'text-sapphire'}`}>{item.step}</div>
                <div className="flex-1">
                  <h3 className={`text-xl font-black uppercase mb-1 ${item.featured ? 'text-white' : 'text-deep-navy dark:text-white'}`}>{item.title}</h3>
                  <p className={`font-medium ${item.featured ? 'text-white/80' : 'text-text-secondary dark:text-slate-400'}`}>{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================================
          SECTION 6: THE COMPARISON (The Steady Hand)
      ============================================ */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 text-balance">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">Comparison</span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white tracking-tighter uppercase leading-none mb-6">
               Traditional <span className="text-sapphire font-black">Tuition</span> vs <span className="italic">StudyHours</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-[2.5rem] border border-border dark:border-white/10 shadow-2xl overflow-hidden relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:divide-x divide-border dark:divide-white/10">
              {/* Traditional Column */}
              <div className="p-10 bg-slate-50 dark:bg-slate-900/50">
                <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  Generic Local Tutors
                </h3>
                <div className="space-y-10">
                  <ComparisonItem 
                    title="Conceptual Teaching Only" 
                    desc="Focus on 'understanding the topic' but failing to bridge the gap into actually scoring marks." 
                  />
                   <ComparisonItem 
                    title="Vague Weekly Lessons" 
                    desc="Tutorials based on &apos;what was done in school&apos; with no long-term roadmap or goal tracking." 
                  />
                  <ComparisonItem 
                    title="Informal Feedback" 
                    desc="Subjective verbal updates after class rather than data-driven progress reporting for parents." 
                  />
                   <ComparisonItem 
                    title="Soft Skill Support" 
                    desc="Homework help that keeps students afloat but doesn&apos;t prepare them for terminal exams." 
                  />
                </div>
              </div>

              {/* StudyHours Column */}
              <div className="p-10 bg-white dark:bg-slate-800 relative ring-4 ring-sapphire/20 z-10">
                <h3 className="text-lg font-black text-sapphire uppercase tracking-widest mb-10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sapphire animate-pulse" />
                  UK Specialised Mastery
                </h3>
                <div className="space-y-10">
                  <ComparisonItem 
                    isPositive 
                    title="Board-Specific Mark Schemes" 
                    desc="Training students to think like examiners and use the exact tier-one terminology board markers look for." 
                  />
                  <ComparisonItem 
                    isPositive 
                    title="Data-Driven Roadmaps" 
                    desc="A structured 12-week plan derived from Mock assessment data to target specific grade-boosting gaps." 
                  />
                  <ComparisonItem 
                    isPositive 
                    title="Measurable Performance" 
                    desc="Real-time reporting and automated grade projections so you always know their standing." 
                  />
                   <ComparisonItem 
                    isPositive 
                    title="Term-End Success" 
                    desc="Rigorous, timed past-paper practice designed to build stamina and eliminate exam-day anxiety." 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 7: WHEN SHOULD YOU START?
      ============================================ */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy tracking-tighter uppercase leading-none mb-6">
               When Should You <span className="text-sapphire">Start?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-[28px] left-[15%] right-[15%] h-[2px] bg-border z-0" />
            
            {[
              { year: "Year 9 / Early Year 10", title: "Foundation Building", desc: "Setting the groundwork before the volume of content becomes overwhelming." },
              { year: "Mid Year 10", title: "Consolidation", desc: "Fixing gaps in real-time as they appear in the school syllabus." },
              { year: "Year 11", title: "Intensive Revision", desc: "The sprint to the finish: focusing heavily on recall and official board standards." },
              { year: "Mocks Approaching", title: "Emergency Intervention", desc: "Focused 'rescue days' to stabilize grades and rebuild confidence quickly." },
            ].map((pt, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 border-4 border-sapphire mx-auto mb-8 flex items-center justify-center text-sapphire font-black shadow-lg">
                  {i + 1}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-sapphire bg-sapphire/10 px-3 py-1 rounded-full mb-4 inline-block">{pt.year}</span>
                <h4 className="text-xl font-black text-deep-navy dark:text-white mb-4 uppercase italic tracking-tight">{pt.title}</h4>
                <p className="text-sm font-medium text-text-secondary dark:text-slate-400 opacity-80 mb-6">{pt.desc}</p>
                <button className="text-xs font-black text-sapphire uppercase tracking-widest hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Select This Stage</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 8: EXAM BOARD TRUST
      ============================================ */}
      <section className="py-16 px-6 bg-background border-y border-border">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-md">
              <h3 className="text-2xl font-black text-deep-navy uppercase tracking-tighter leading-none mb-2">We tutor across all <br /> <span className="text-sapphire">Major UK Exam Boards.</span></h3>
              <p className="text-sm font-medium text-text-secondary">Official curriculum alignment for maximum grade protection.</p>
              
              {/* Added Trust Icons */}
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-green-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-deep-navy">DBS Enhanced</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-sapphire" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-deep-navy">UK-Based Experts</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-12 opacity-40 hover:opacity-100 transition-opacity">
               {["AQA", "Edexcel", "OCR", "WJEC", "Pearson"].map(board => (
                 <div key={board} className="text-3xl lg:text-4xl font-black text-slate-400 select-none tracking-tighter">{board}</div>
               ))}
            </div>
         </div>
      </section>

      {/* ============================================
          SECTION 9: EXPERT EXAM PREP BAND
      ============================================ */}
      <section className="py-24 px-6 relative overflow-hidden">
         <div className="max-w-7xl mx-auto rounded-4xl bg-deep-navy dark:bg-slate-950 relative overflow-hidden p-12 lg:p-24 shadow-2xl">
            <div className="absolute inset-0 bg-deep-navy/60 dark:bg-black/60 z-0" />
            <Image 
              src="https://res.cloudinary.com/de8vvmpip/image/upload/v1774002811/__Exam_Prep_Band___202603201603_wsokxw.jpg" 
              alt="Exam Prep Background" 
              fill 
              className="object-cover opacity-20 dark:opacity-40"
            />
            <div className="relative z-10 max-w-2xl">
               <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8 block">Final Preparation</span>
               <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-10">Protect Their Future with <br /> Specialist Mastery.</h2>
               <p className="text-xl text-blue-200/80 mb-12 font-medium">The jump between Year 10 and 11 is where most students falter. We provide the safety net of high-tier expertise across every subject.</p>
               <div className="flex gap-4">
                  <Link href="/signup" className="px-10 py-5 bg-white text-deep-navy dark:text-slate-900 font-black rounded-3xl hover:bg-blue-50 transition-all flex items-center gap-2">Book Your Assessment <ArrowRight size={18} /></Link>
               </div>
            </div>
         </div>
      </section>

      {/* ============================================
          SECTION 10: DIAGNOSTIC (Parent Reframing)
      ============================================ */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">Diagnostic</span>
          <h2 className="text-4xl md:text-5xl font-black text-deep-navy tracking-tighter uppercase leading-none">
            Where is Your <span className="text-sapphire">Child Right Now?</span>
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
           <DiagnosticCard 
            title="Building a Foundation"
            desc="Currently in Year 9 or early Year 10, wanting to avoid the last-minute stress of Year 11."
            target="Long-term Success"
            icon={ShieldCheck}
          />
          <DiagnosticCard 
            title="Consolidating Knowledge"
            desc="Working hard but seeing inconsistent results in class tests or feeling overwhelmed by a specific subject."
            target="Grade Stability"
            icon={Target}
          />
          <DiagnosticCard 
            title="Intensive Performance"
            desc="Already performing well but aiming for the top grades: A* or 9 - needed for elite Sixth Forms."
            target="Academic Peak"
            icon={Award}
          />
        </div>
      </section>

      {/* ============================================
          SECTION 11: FAQ
      ============================================ */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16 px-6">
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white tracking-tighter uppercase leading-tight">
              Common Questions from <span className="text-sapphire italic">GCSE Parents</span>
            </h2>
          </div>
          <SubjectFAQ items={gcseFaqs} />
        </div>
      </section>

      {/* ============================================
          SECTION 12: CLOSING CTA
      ============================================ */}
      <section className="py-24 px-6 bg-deep-navy dark:bg-slate-950 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tighter uppercase leading-[0.9]">
              Give Your Child the <br />
              <span className="text-sapphire dark:text-blue-400">Support They Need</span> <br />
               Before It&apos;s Too Late.
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
              <Link
                href="/signup?type=assessment"
                className="w-full sm:w-auto px-12 py-6 bg-sapphire text-white font-black rounded-4xl hover:bg-primary transition-all shadow-2xl text-lg uppercase tracking-tighter"
              >
                Book a Free Assessment
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

      {/* SEO Paragraph Section — Standard Padding (Moved to Bottom) */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-deep-navy dark:text-white mb-6 tracking-normal">Which GCSE Subjects Do We Cover?</h2>
          <p className="text-sm text-text-secondary dark:text-slate-400 leading-relaxed font-normal opacity-80 max-w-4xl">
            Our tutors provide expert support across all major GCSE subjects. We cover GCSE Maths at both Foundation and Higher tier across AQA, Edexcel, and OCR. We also offer specialist tutoring for GCSE Biology, GCSE Chemistry, GCSE Physics, and GCSE Combined Science. Our English tutors support both GCSE English Language and GCSE English Literature. Additional subjects include GCSE History, GCSE Geography, GCSE Sociology, GCSE Religious Education, GCSE Art and Design, GCSE Music, GCSE Computer Science, GCSE ICT, and languages including GCSE French, GCSE Spanish, GCSE German, GCSE Italian, and GCSE Arabic.
          </p>
        </div>
      </section>

      <ParentTestimonials />
    </main>
  );
}

function SubjectGroup({ title, subjects, boards, icon: Icon, isExpandable, defaultExpanded }: any) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded ?? false);

  return (
    <div className="p-8 rounded-4xl bg-white dark:bg-slate-900/50 border border-border dark:border-white/10 shadow-sm hover:shadow-xl transition-all group">
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 rounded-2xl bg-sapphire/5 text-sapphire flex items-center justify-center group-hover:bg-sapphire group-hover:text-white transition-colors">
          <Icon size={24} />
        </div>
        {isExpandable && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sapphire hover:text-primary transition-colors p-2"
          >
            <Zap size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      <h3 className="text-xl font-black text-deep-navy dark:text-white mb-6 tracking-tight uppercase italic">{title}</h3>
      
      <AnimatePresence initial={false}>
        {(isExpanded || !isExpandable) && (
          <motion.div 
            initial={isExpandable ? { height: 0, opacity: 0 } : false}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 mb-8">
              {subjects.map((sub: string) => (
                <span key={sub} className="px-3 py-1.5 rounded-xl bg-surface dark:bg-slate-800/50 border border-border dark:border-white/10 text-[10px] font-black text-deep-navy/70 dark:text-white/70 uppercase tracking-tight">{sub}</span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {boards && (
        <div className="pt-6 border-t border-border flex flex-wrap gap-3">
          {boards.map((b: string, i: number) => (
            <React.Fragment key={b}>
              <span className="text-[9px] font-black text-sapphire uppercase tracking-[0.2em]">{b}</span>
              {i < boards.length - 1 && <span className="text-sapphire/40">&middot;</span>}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

function DiagnosticCard({ title, desc, target, icon: Icon }: any) {
  return (
    <div className="p-10 rounded-4xl bg-white dark:bg-slate-900/50 border border-border dark:border-white/10 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
       <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
          <Icon size={120} />
       </div>
       <div className="relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-sapphire/10 text-sapphire text-[8px] font-black uppercase tracking-widest mb-6">Target: {target}</div>
          <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-4 tracking-tight uppercase italic leading-tight">{title}</h3>
          <p className="text-sm font-medium text-text-secondary dark:text-slate-400 leading-relaxed opacity-80">{desc}</p>
       </div>
    </div>
  );
}

function ComparisonItem({ title, desc, isPositive }: { title: string, desc: string, isPositive?: boolean }) {
  return (
    <div className="relative">
      <h4 className={`text-base font-black uppercase tracking-tight mb-2 italic ${isPositive ? 'text-deep-navy dark:text-white' : 'text-slate-400'}`}>{title}</h4>
      <p className={`text-sm font-medium leading-relaxed ${isPositive ? 'text-text-secondary dark:text-slate-400' : 'text-slate-400/80'}`}>{desc}</p>
    </div>
  );
}
