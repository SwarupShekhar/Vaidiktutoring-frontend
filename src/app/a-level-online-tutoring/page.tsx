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
  PenTool,
  Brain,
  Palette,
  MessageCircle,
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../components/subjects/ParentTestimonials";
import StickyCTA from "../components/subjects/StickyCTA";
import SubjectFAQ, { FAQItemType } from "../components/subjects/SubjectFAQ";
import Counter from "../components/ui/Counter";

export default function ALevelTutoringPage() {
  const { user } = useAuthContext();

  const aLevelFaqs: FAQItemType[] = [
    {
      q: "When should I start A-Level tutoring?",
      a: "Ideally from the beginning of Year 12 to build strong foundations early. However tutoring at any stage is valuable - whether catching up on AS content, preparing for mocks, or doing final exam revision in Year 13.",
    },
    {
      q: "How is A-Level tutoring different from GCSE?",
      a: "A-Level requires much deeper subject knowledge, independent thinking, and exam technique. Our tutors are subject specialists, not generalists - they know the exact demands of your syllabus and university application context.",
    },
    {
      q: "Can tutoring help with university personal statements?",
      a: "Yes. Our tutors can help you connect your subject knowledge to your personal statement, identify strong examples from your studies, and refine your academic writing — all of which strengthen your university application.",
    },
    {
      q: "Which exam boards do your A-Level tutors cover?",
      a: "We cover all major UK exam boards including AQA, Edexcel, OCR, and Cambridge International. Your tutor will be matched specifically to your board and syllabus.",
    },
  ];

  const subjectSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Core Subjects" },
      { "@type": "ListItem", "position": 2, "name": "Humanities & Social Sciences" },
      { "@type": "ListItem", "position": 3, "name": "Practical Subjects" },
      { "@type": "ListItem", "position": 4, "name": "Languages" }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": aLevelFaqs.map(faq => ({
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
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://studyhours.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Subjects",
        item: "https://studyhours.com/subjects",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "A-Level Tutoring",
        item: "https://studyhours.com/a-level-online-tutoring",
      },
    ],
  };

  const ratingSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "A-Level Online Tutoring",
    "image": "https://studyhours.com/hero_calm_education.png",
    "priceRange": "$149 - $499",
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
          SECTION 1: HERO (The Navigator)
      ============================================ */}
      <section className="relative min-h-[90vh] flex items-center bg-linear-to-b from-ice-blue to-background dark:from-slate-900/50 dark:to-background overflow-hidden selection:bg-sapphire/20">
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Column — Value Prop */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface/60 border border-border text-[10px] font-black tracking-[0.2em] text-sapphire mb-10 shadow-sm uppercase">
                <ShieldCheck size={14} className="text-sapphire" />
                Specialist A-Level Support
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter leading-[0.95] uppercase">
                A-Level Tutors Online
              </h1>
              <div className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary italic mb-10 leading-tight">
                A-Level Tutoring <br />
                Built Around Your University Goals
              </div>
              <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed font-medium max-w-xl">
                Expert one-on-one support across every A-Level subject - from first lesson to final exam.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-start">
                <Link
                  href={user ? "/bookings/new" : "/signup?type=assessment"}
                  className="w-full sm:w-auto px-12 py-6 bg-sapphire text-white font-black rounded-3xl hover:bg-primary transition-all shadow-2xl shadow-sapphire/20 text-center flex items-center justify-center gap-3 group text-lg tracking-tighter"
                >
                  Book a Class
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <Link
                  href={user ? "/experts" : "/login?redirect=/experts"}
                  className="w-full sm:w-auto px-12 py-6 border-2 border-border text-deep-navy dark:text-white font-black rounded-3xl hover:bg-surface transition-all text-center text-lg tracking-tighter"
                >
                  Find an Online Tutor
                </Link>
              </div>
            </motion.div>

            {/* Right Column — Large Mentor Visual & Floating Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="relative aspect-square lg:aspect-auto lg:h-[600px] rounded-[3rem] overflow-hidden group shadow-2xl"
            >
              <Image
                src="https://res.cloudinary.com/de8vvmpip/image/upload/v1774006053/Candid_photography_of_202603201657-Photoroom_o5gy9i.png"
                alt="Expert A-Level online tutor and student collaborating on exam preparation | StudyHours"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-deep-navy/40 via-transparent to-transparent" />
              
              {/* Floating Stats Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute top-8 right-8 p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl max-w-[280px]"
              >
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="space-y-1">
                    <div className="text-xl font-black text-sapphire tracking-tighter">
                      <Counter value={1000} suffix="+" />
                    </div>
                    <div className="text-[8px] font-black text-text-secondary uppercase tracking-widest leading-none">
                      SESSIONS
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-black text-sapphire tracking-tighter">
                      <Counter value={4.9} suffix="★" />
                    </div>
                    <div className="text-[8px] font-black text-text-secondary uppercase tracking-widest leading-none">
                      RATING
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Subject Selector Overlay (Bottom) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-6 left-6 right-6 p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl"
              >
                <p className="text-[10px] font-black text-deep-navy dark:text-white uppercase tracking-widest opacity-60 mb-4">
                  Subjects We Cover:
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Maths", "Further Maths", "Biology", "Chemistry", "Physics", "English"].map((subject) => (
                    <span
                      key={subject}
                      className="px-3 py-1.5 rounded-lg border border-border text-[9px] font-black text-text-secondary dark:text-white hover:border-sapphire hover:text-white hover:bg-sapphire transition-all cursor-default"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
                <Link
                  href={user ? "/bookings/new" : "/signup?type=assessment"}
                  className="w-full py-4 bg-linear-to-br from-primary to-sapphire text-white font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 text-center flex items-center justify-center gap-2 text-xs tracking-wide uppercase italic"
                >
                  Schedule Assessment
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 1: TRUST BLOCK (Three Callout Columns)
      ============================================ */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 relative overflow-hidden text-center">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20 text-balance">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">The Context</span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white tracking-tighter uppercase leading-none mb-6">
              Why A-Level Students <span className="text-sapphire">Come to Us</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { 
                title: "University Offers at Stake", 
                desc: "We understand the pressure of predicted grades and conditional offers - and we build our sessions around them.",
                icon: "https://res.cloudinary.com/de8vvmpip/image/upload/v1770624221/target_uhmfxn.gif"
              },
              { 
                title: "Deep Subject Expertise", 
                desc: "Our tutors specialise in specific A-Level subjects - not generalists who cover everything loosely.",
                icon: "https://res.cloudinary.com/de8vvmpip/image/upload/v1770626562/paper-document_bkf2l3.gif"
              },
              { 
                title: "From AS to A2, Start to Finish", 
                desc: "Consistent support across both years so nothing falls through the gaps before exam season.",
                icon: "https://res.cloudinary.com/de8vvmpip/image/upload/v1770626558/career-ladder_i6m9gl.gif"
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
                <div className="w-14 h-14 rounded-2xl bg-sapphire/5 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform relative overflow-hidden p-2">
                  <Image
                    src={col.icon}
                    alt={col.title}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-4 tracking-tight leading-tight uppercase italic">{col.title}</h3>
                <p className="text-text-secondary dark:text-slate-400 font-medium leading-relaxed opacity-80">{col.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 2: PROGRAMME BENEFITS
      ============================================ */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center mb-24">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">Benefits</span>
          <h2 className="text-4xl md:text-6xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter">
            Skills for <br />
            <span className="text-sapphire">Lifelong Success</span>
          </h2>
          <p className="text-xl text-text-secondary leading-relaxed font-medium opacity-80 max-w-2xl mx-auto">
            A-Level mastery goes beyond the content. We cultivate independent research, problem-solving, and university readiness.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {[
            {
              title: "Critical Thinking",
              desc: "Deep subject mastery builds analytical skills that universities look for.",
              icon: Lightbulb,
            },
            {
              title: "Exam Technique",
              desc: "Past papers, mark schemes, and timed practice built into every revision plan.",
              icon: Target,
            },
            {
              title: "University Readiness",
              desc: "Independent research habits and essay skills developed alongside subject knowledge.",
              icon: GraduationCap,
            },
            {
              title: "Subject Specialisation",
              desc: "Focused depth across 3-4 subjects rather than surface-level coverage.",
              icon: Zap,
            },
            {
              title: "Time Management",
              desc: "Balancing multiple demanding subjects with structured session planning.",
              icon: Clock,
            },
            {
              title: "Confidence Building",
              desc: "Consistent progress tracking so students always know where they stand.",
              icon: CheckCircle2,
            },
          ].map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
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
      </section>

      {/* ============================================
          SECTION 3: HOW IT WORKS
      ============================================ */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 text-center mb-20">
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sapphire mb-3 block">Process</span>
           <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white tracking-tighter uppercase leading-none mb-6">
              How We Support Your <span className="text-sapphire italic">A-Level Journey</span>
           </h2>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 space-y-4">
            {[
              { step: "01", title: "Subject & Level Assessment", desc: "We identify your current level, target grades, and university aspirations before anything else." },
              { step: "02", title: "Matched with a Subject Specialist", desc: "Paired with a tutor who knows your exact syllabus and exam board inside out." },
              { step: "03", title: "Structured Session Plan", desc: "A clear learning roadmap built around your school timetable and exam dates." },
              { step: "04", title: "Past Paper & Exam Technique", desc: "Regular exam practice with mark scheme feedback built into every stage.", featured: true },
              { step: "05", title: "Progress Reviews", desc: "Regular check-ins so you and your parents always know exactly where you stand." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
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

          {/* Supporting Visual - Image 3 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/3 aspect-3/4 relative rounded-4xl overflow-hidden shadow-2xl hidden lg:block"
          >
            <Image 
              src="https://res.cloudinary.com/de8vvmpip/image/upload/v1774006238/Close-up_photography_of_202603201700_m0g2nl.jpg"
              alt="Close-up of academic textbooks and notes"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-linear-to-t from-deep-navy/40 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: SUBJECT GROUPS
      ============================================ */}
      <section className="py-24 md:py-40 px-6 bg-background relative overflow-hidden border-y border-border">
        <div className="max-w-7xl mx-auto relative z-10 text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">Selection</span>
          <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white tracking-tighter uppercase leading-none">
            Every A-Level Subject, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sapphire to-primary">One Specialist Platform</span>
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <SubjectGroup 
            title="Core Subjects" 
            subjects={["A-Level English", "A-Level Maths", "A-Level Further Maths", "A-Level Biology", "A-Level Chemistry", "A-Level Physics", "A-Level Psychology"]}
            boards={["AQA", "Edexcel", "OCR"]}
            icon={Target}
          />
          <SubjectGroup 
            title="Humanities & Social Sciences" 
            subjects={["A-Level Geography", "A-Level History", "A-Level Economics", "A-Level Business", "A-Level Religious Studies", "A-Level Politics", "A-Level Philosophy", "A-Level Classics", "A-Level Latin", "A-Level Greek"]}
            icon={Globe}
            isExpandable={true}
            initialShow={6}
          />
          <SubjectGroup 
            title="Practical Subjects" 
            subjects={["A-Level Computer Science", "A-Level Music", "A-Level Design Technology", "A-Level Art", "A-Level Drama"]}
            icon={Palette}
          />
          <SubjectGroup 
            title="Languages" 
            subjects={["A-Level French", "A-Level Spanish", "A-Level German", "A-Level Chinese", "A-Level Italian"]}
            icon={Languages}
          />
        </div>

        <div className="max-w-7xl mx-auto mt-16 text-center border-t border-border pt-12">
          <p className="text-lg font-black text-deep-navy/60 italic uppercase tracking-tight">
            Don&apos;t see your subject? We likely cover it - <Link href="/contact" className="text-sapphire underline underline-offset-4 hover:text-primary transition-colors">GET IN TOUCH.</Link>
          </p>
        </div>
      </section>

      {/* ============================================
          SECTION 5: EXAM BOARD TRUST
      ============================================ */}
      <section className="py-16 px-6 bg-surface border-y border-border">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-md">
              <h2 className="text-2xl font-black text-deep-navy dark:text-white uppercase tracking-tighter leading-none mb-2">We Tutor Across All <br /> <span className="text-sapphire">Major A-Level Exam Boards.</span></h2>
              <p className="text-sm font-medium text-text-secondary">Your tutor will know your exact syllabus, mark scheme, and assessment structure.</p>
              
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
               {["AQA", "Edexcel", "OCR", "Cambridge International"].map(board => (
                 <div key={board} className="text-3xl lg:text-4xl font-black text-slate-400 select-none tracking-tighter">{board}</div>
               ))}
            </div>
         </div>
      </section>

      {/* ============================================
          SECTION 6: URGENCY CTA BAND
      ============================================ */}
      <section className="py-24 px-6 relative overflow-hidden bg-background">
         <div className="max-w-7xl mx-auto rounded-[3rem] bg-deep-navy dark:bg-slate-950 relative overflow-hidden shadow-3xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side: Content */}
              <div className="p-12 lg:p-24 relative z-10 flex flex-col justify-center">
                 <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8 block">Final Preparation</span>
                 <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.95] mb-10">
                   A-Level Exams in May? <br />
                   <span className="text-sapphire italic">Your Revision Plan Starts Now.</span>
                 </h2>
                 <p className="text-xl text-blue-100/80 mb-12 font-medium leading-relaxed max-w-lg">
                   Secure specialist support before slots fill up. Structured revision programmes available for all subjects.
                 </p>
                 <div className="flex gap-4">
                    <Link href="/signup?type=assessment" className="px-10 py-5 bg-white text-deep-navy dark:text-slate-900 font-black rounded-3xl hover:bg-blue-50 transition-all flex items-center gap-2 uppercase italic tracking-tight shadow-xl">
                      Book a Free Assessment <ArrowRight size={18} />
                    </Link>
                 </div>
              </div>

              {/* Right Side: Image 2 (Split 50/50, Moody Tone) */}
              <div className="relative h-[400px] lg:h-auto overflow-hidden">
                <Image 
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/v1774006172/Candid_photography_of_202603201659-Photoroom_yfjqvy.png" 
                  alt="A-Level student focused in solo revision" 
                  fill 
                  className="object-cover brightness-[0.8] dark:brightness-[0.7] contrast-[1.1]"
                  unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-r from-deep-navy via-transparent to-transparent hidden lg:block" />
              </div>
            </div>
         </div>
      </section>

      {/* ============================================
          SECTION 7: FAQ
      ============================================ */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16 px-6">
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white tracking-tighter uppercase leading-tight">
              Common Questions About <span className="text-sapphire italic">A-Level Tutoring</span>
            </h2>
          </div>
          <SubjectFAQ items={aLevelFaqs} />
        </div>
      </section>

      {/* ============================================
          SECTION 8: CLOSING CTA
      ============================================ */}
      <section className="py-24 px-6 bg-deep-navy dark:bg-slate-950 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tighter uppercase leading-[0.9]">
              Your University Offer <br />
              <span className="text-sapphire dark:text-blue-400">Is Worth Fighting For.</span>
            </h2>
            <p className="text-lg md:text-xl text-blue-100/60 mb-12 font-medium uppercase tracking-[0.2em]">
               Available for all A-Level subjects across AQA, Edexcel, OCR and Cambridge International.
            </p>
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
                Speak with an Advisor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEO Paragraph Section */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-deep-navy dark:text-white mb-6 tracking-normal">Which A-Level Subjects Do We Cover?</h2>
          <p className="text-sm text-text-secondary dark:text-slate-400 leading-relaxed font-normal opacity-80 max-w-4xl">
            Our tutors provide specialist A-Level support across all major subjects. Core subjects include A-Level Maths, A-Level Further Maths, A-Level English, A-Level Biology, A-Level Chemistry, A-Level Physics, and A-Level Psychology. Humanities and social sciences covered include A-Level Geography, A-Level History, A-Level Economics, A-Level Business, A-Level Religious Studies, A-Level Politics, A-Level Philosophy, A-Level Classics, A-Level Latin, and A-Level Greek. Practical subjects include A-Level Computer Science, A-Level Music, A-Level Design Technology, A-Level Art, and A-Level Drama. Language support is available for A-Level French, A-Level Spanish, A-Level German, A-Level Chinese, and A-Level Italian. All subjects are available across AQA, Edexcel, OCR, and Cambridge International exam boards.
          </p>
        </div>
      </section>

      <ParentTestimonials />
    </main>
  );
}

function SubjectGroup({ title, subjects, boards, icon: Icon, isExpandable, initialShow }: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedSubjects = isExpandable && !isExpanded ? subjects.slice(0, initialShow) : subjects;

  return (
     <div className="p-8 rounded-4xl bg-white dark:bg-slate-900/50 border border-border dark:border-white/10 shadow-sm hover:shadow-xl transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-sapphire/5 text-sapphire flex items-center justify-center mb-6 group-hover:bg-sapphire group-hover:text-white transition-colors">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-black text-deep-navy dark:text-white mb-6 tracking-tight uppercase italic">{title}</h3>
      
      <div className="flex flex-wrap gap-2 mb-8">
        <AnimatePresence mode="popLayout">
          {displayedSubjects.map((sub: string) => (
            <motion.span 
              key={sub}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="px-3 py-1.5 rounded-xl bg-surface dark:bg-slate-800/50 border border-border dark:border-white/10 text-[10px] font-black text-deep-navy/70 dark:text-white/70 uppercase tracking-tight"
            >
              {sub}
            </motion.span>
          ))}
        </AnimatePresence>
        {isExpandable && subjects.length > initialShow && !isExpanded && (
          <button 
            onClick={() => setIsExpanded(true)}
            className="px-3 py-1.5 rounded-xl border border-sapphire/30 text-[10px] font-black text-sapphire uppercase tracking-tight hover:bg-sapphire/5 transition-colors"
          >
            + {subjects.length - initialShow} more
          </button>
        )}
      </div>

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
