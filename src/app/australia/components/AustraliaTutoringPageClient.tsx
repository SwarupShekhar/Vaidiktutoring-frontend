"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Calculator,
  FlaskConical,
  CheckCircle2,
  Users,
  Star,
  GraduationCap,
  Award,
  Zap,
  Languages,
  Target,
  TrendingUp,
  Brain,
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../../components/subjects/ParentTestimonials";
import StickyCTA from "../../components/subjects/StickyCTA";
import SubjectFAQ, { FAQItemType } from "../../components/subjects/SubjectFAQ";

export interface AustraliaSubject {
  iconName: "calculator" | "book" | "flask" | "languages" | "target" | "trending" | "brain" | "award" | "graduation";
  name: string;
  tag: string;
  tagColor: string;
  description: string;
  topics: string[];
}

export interface AustraliaTutoringPageClientProps {
  title: string;
  highlightText: string;
  subtitle: string;
  tagline: string;
  heroImage: string;
  subjects: AustraliaSubject[];
  testimonials: any[];
  faqs: FAQItemType[];
  curriculumName: string;
  regionName: string;
  longDescription: string;
  seoParagraph: string;
  accentColor?: string; // e.g. "sapphire", "rose-600", "indigo-600"
  secondaryColor?: string;
  children?: React.ReactNode;
}

const iconMap = {
  calculator: Calculator,
  book: BookOpen,
  flask: FlaskConical,
  languages: Languages,
  target: Target,
  trending: TrendingUp,
  brain: Brain,
  award: Award,
  graduation: GraduationCap,
};

const optimizeCloudinaryUrl = (url: string) => {
  if (url.includes("cloudinary.com") && !url.includes("f_auto")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  }
  return url;
};

export default function AustraliaTutoringPageClient({
  title,
  highlightText,
  subtitle,
  tagline,
  heroImage,
  subjects,
  testimonials,
  faqs,
  curriculumName,
  regionName,
  longDescription,
  seoParagraph,
  accentColor = "sapphire",
  secondaryColor = "primary",
  children,
}: AustraliaTutoringPageClientProps) {
  const { user } = useAuthContext();
  const optimizedHeroImage = optimizeCloudinaryUrl(heroImage);

  // Define theme mapping to ensure Tailwind classes are detected during build
  const themes: Record<string, { text: string; bg: string; border: string; from: string; to: string; shadow: string }> = {
    sapphire: {
      text: "text-sapphire",
      bg: "bg-sapphire",
      border: "border-sapphire",
      from: "from-sapphire",
      to: "to-primary",
      shadow: "shadow-sapphire/20",
    },
    hsc_navy: {
      text: "text-blue-900",
      bg: "bg-blue-900",
      border: "border-blue-900",
      from: "from-blue-900",
      to: "to-blue-700",
      shadow: "shadow-blue-900/20",
    },
    vce_indigo: {
      text: "text-indigo-700",
      bg: "bg-indigo-700",
      border: "border-indigo-700",
      from: "from-indigo-700",
      to: "to-blue-600",
      shadow: "shadow-indigo-700/20",
    },
    qce_maroon: {
      text: "text-rose-900",
      bg: "bg-rose-900",
      border: "border-rose-900",
      from: "from-rose-900",
      to: "to-red-700",
      shadow: "shadow-rose-900/20",
    },
    wace_gold: {
      text: "text-amber-600",
      bg: "bg-amber-600",
      border: "border-amber-600",
      from: "from-amber-600",
      to: "to-orange-500",
      shadow: "shadow-amber-600/20",
    },
  };

  const theme = themes[accentColor] || themes.sapphire;

  const accentText = theme.text;
  const accentBg = theme.bg;
  const accentBorder = theme.border;
  const accentShadow = theme.shadow;
  const accentGradient = `${theme.from} ${theme.to}`;

  return (
    <main className="min-h-screen bg-background transition-colors duration-500 relative selection:bg-primary/20 selection:text-primary">
      <StickyCTA />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden selection:bg-sapphire/20">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-ice-blue/40 to-transparent dark:from-sapphire/5 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-surface/60 dark:bg-surface/5 backdrop-blur-md border border-border text-[9px] sm:text-[10px] font-black tracking-[0.2em] ${accentText} mb-6 sm:mb-8 shadow-sm uppercase`}>
                <ShieldCheck size={14} className={accentText} />
                Australian Curriculum Aligned : {curriculumName} Specialists
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter leading-[0.95] uppercase">
                {title} <span className={accentText}>{highlightText}</span> {tagline}
              </h1>
              <div className={`text-lg sm:text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r ${accentGradient} italic mb-6 sm:mb-8 leading-tight`}>
                {subtitle}
              </div>
              <p className="text-lg sm:text-xl md:text-2xl text-text-secondary mb-8 sm:mb-12 leading-relaxed font-medium max-w-xl opacity-90">
                {longDescription}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-start">
                <Link
                  href={user ? "/bookings/new" : "/signup?type=assessment"}
                  className={`w-full sm:w-auto px-10 py-5 sm:px-12 sm:py-6 ${accentBg} text-white font-black rounded-3xl hover:bg-primary transition-all shadow-2xl ${accentShadow} text-center flex items-center justify-center gap-3 group text-base sm:text-lg tracking-tighter`}
                >
                  Book a Free Session
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-background bg-slate-200 dark:bg-slate-800" />
                    ))}
                  </div>
                  <div className="text-[10px] sm:text-sm font-black text-deep-navy dark:text-white uppercase tracking-widest leading-tight">
                    ATAR 99+ <br />
                    Tutor Expert Network
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="relative mt-8 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="relative z-10 aspect-square rounded-4xl sm:rounded-[3.5rem] overflow-hidden shadow-2xl group border border-border/50"
              >
                <div className="absolute inset-0 bg-linear-to-t from-deep-navy/40 to-transparent z-10" />
                <Image
                  src={optimizedHeroImage}
                  alt={`${curriculumName} tutoring session for students in ${regionName}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  priority
                />
              </motion.div>

              {/* Stats Overlay */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -bottom-6 sm:-bottom-10 left-4 sm:-left-6 md:-left-12 z-20 p-5 sm:p-8 bg-white dark:bg-slate-900 rounded-4xl sm:rounded-4xl border border-border shadow-2xl w-[calc(100%-32px)] sm:w-full max-w-[280px] sm:max-w-[320px]"
              >
                <div className="grid grid-cols-2 gap-4 sm:gap-5 text-center">
                  <div className="space-y-0.5">
                    <div className={`text-xl sm:text-2xl font-black ${accentText} tracking-tighter leading-none`}>99+</div>
                    <div className="text-[7px] sm:text-[8px] font-black text-text-secondary uppercase tracking-[0.15em]">ATAR Tutors</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className={`text-xl sm:text-2xl font-black ${accentText} tracking-tighter leading-none`}>1:1</div>
                    <div className="text-[7px] sm:text-[8px] font-black text-text-secondary uppercase tracking-[0.15em]">Expert Mentoring</div>
                  </div>
                </div>
                <div className="h-px w-full bg-border my-3 sm:my-4" />
                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                  <span className={`px-2.5 py-1 rounded-full ${accentBg}/5 text-[8px] sm:text-[9px] font-black ${accentText} uppercase tracking-widest`}>
                    {curriculumName} Exam Prep
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/5 text-[8px] sm:text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                    Scaling Strategy
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-20 md:py-32 px-6 bg-surface dark:bg-slate-900/50 border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${accentText} mb-4 sm:mb-6 block`}>
              Curriculum Mastery
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase leading-none">
              High-Value {curriculumName} <span className={accentText}>Subjects</span>
            </h2>
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
              We focus on the subjects that matter most for your ATAR. Our tutors are specialists in the {curriculumName} syllabus for {regionName} students.
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
                className="p-6 sm:p-8 rounded-4xl sm:rounded-4xl bg-white dark:bg-slate-900/80 border border-border hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-5 mb-6">
                  <div className={`w-12 h-12 rounded-4xl ${accentBg}/5 ${accentText} flex items-center justify-center shrink-0 group-hover:${accentBg} group-hover:text-white transition-colors`}>
                    {(() => {
                      const Icon = iconMap[subject.iconName];
                      return <Icon size={24} />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-deep-navy dark:text-white tracking-tight uppercase leading-tight">
                      {subject.name}
                    </h3>
                    <span className={`inline-block mt-1.5 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${subject.tagColor}`}>
                      {subject.tag}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary font-medium leading-relaxed mb-6 opacity-80">
                  {subject.description}
                </p>
                <div>
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-3">
                    Focus Areas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {subject.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-2.5 py-1 rounded-lg bg-background dark:bg-white/5 border border-border text-[9px] font-black text-deep-navy/70 dark:text-white/70"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section : Redesigned for Premium Aesthetic */}
      <section className="py-24 md:py-40 px-6 bg-background relative overflow-hidden">
        <div className={`absolute top-0 left-1/4 w-96 h-96 ${accentBg}/5 blur-[120px] rounded-full pointer-events-none`} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 sm:mb-24">
             <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${accentText} mb-6 block`}>
                The StudyHours Advantage
             </span>
             <h2 className="text-4xl md:text-6xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter uppercase leading-[0.9]">
                Why Top {regionName} <br />Students <span className={accentText}>Choose Us</span>
             </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
               whileHover={{ y: -10 }}
               className="p-10 rounded-[3rem] bg-surface dark:bg-white/5 border border-border/50 shadow-sm flex flex-col justify-between"
            >
               <div className={`w-14 h-14 rounded-2xl ${accentBg}/5 ${accentText} flex items-center justify-center mb-10`}>
                  <GraduationCap size={28} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-deep-navy dark:text-white uppercase mb-4 tracking-tight">
                    99+ ATAR <br />High-Achievers
                  </h3>
                  <p className="text-sm sm:text-base text-text-secondary font-medium leading-relaxed opacity-80">
                    Our tutors haven't just studied the curriculum; they've mastered it. Learn from those who have already achieved the scores you're aiming for.
                  </p>
               </div>
            </motion.div>

            <motion.div 
               whileHover={{ y: -10 }}
               className="p-10 rounded-[3rem] bg-surface dark:bg-white/5 border border-border/50 shadow-sm flex flex-col justify-between"
            >
               <div className={`w-14 h-14 rounded-2xl ${accentBg}/5 ${accentText} flex items-center justify-center mb-10`}>
                  <Zap size={28} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-deep-navy dark:text-white uppercase mb-4 tracking-tight">
                    Syllabus-Specific <br />Focus
                  </h3>
                  <p className="text-sm sm:text-base text-text-secondary font-medium leading-relaxed opacity-80">
                    No generic lessons. Every session is tailored to the exact {curriculumName} study design and assessment criteria for your state.
                  </p>
               </div>
            </motion.div>

            <motion.div 
               whileHover={{ y: -10 }}
               className="p-10 rounded-[3rem] bg-surface dark:bg-white/5 border border-border/50 shadow-sm flex flex-col justify-between"
            >
               <div className={`w-14 h-14 rounded-2xl ${accentBg}/5 ${accentText} flex items-center justify-center mb-10`}>
                  <Award size={28} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-deep-navy dark:text-white uppercase mb-4 tracking-tight">
                    Exam & SAC <br />Strategy
                  </h3>
                  <p className="text-sm sm:text-base text-text-secondary font-medium leading-relaxed opacity-80">
                    It's not just about content. We teach you the exam techniques, the 'scaling' secrets, and the time management skills needed for a high ATAR.
                  </p>
               </div>
            </motion.div>
          </div>

          <div className="mt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className={`p-10 lg:p-20 rounded-[4rem] bg-linear-to-br from-deep-navy to-slate-900 text-white relative overflow-hidden group border border-white/5 shadow-2xl shadow-indigo-500/10`}
            >
               <div className={`absolute top-0 right-0 w-full h-full bg-linear-to-br from-transparent via-${accentColor === 'vce_indigo' ? 'indigo' : 'blue'}-600/10 to-transparent pointer-events-none transition-transform duration-1000 group-hover:scale-110`} />
               <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
                  <div className="max-w-xl space-y-6">
                     <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none italic">
                        Unlock Your <br /><span className={accentText}>Ultimate Rank</span>
                     </h3>
                     <p className="text-lg text-white/60 font-medium">
                        Your potential shouldn't be limited by classroom constraints. Join the academic elite today.
                     </p>
                  </div>
                  <div className="flex flex-col items-center lg:items-end">
                     <div className={`text-7xl sm:text-9xl font-black ${accentText} tracking-tighter mb-2 leading-none flex items-center`}>
                        99.95
                        <Star className="ml-4 opacity-50 animate-pulse text-white" size={40} />
                     </div>
                     <div className="text-[10px] sm:text-xs font-black text-white/50 uppercase tracking-[0.5em] ml-1">Maximum Potential</div>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Custom Regional Content Slot */}
      <div className="max-w-7xl mx-auto px-6">
        {children}
      </div>

      {/* Testimonials */}
      <ParentTestimonials testimonials={testimonials} />

      {/* FAQs */}
      <SubjectFAQ items={faqs} title={`Frequently Asked Questions : ${curriculumName} Tutoring`} />

      {/* SEO Content Section */}
      <section className="py-20 px-6 bg-surface dark:bg-slate-900/30 border-t border-border mt-32">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">
            Comprehensive Online {curriculumName} Tutoring in {regionName}
          </h2>
          <div className="text-sm text-text-secondary dark:text-slate-400 leading-relaxed font-medium opacity-80 max-w-5xl prose dark:prose-invert">
             {seoParagraph}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-deep-navy dark:bg-black text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-sapphire/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 sm:mb-8 uppercase tracking-tighter italic">
            Ready to Achieve Your <span className={accentText}>Best ATAR?</span>
          </h2>
          <p className="text-lg sm:text-xl text-white/70 mb-10 sm:mb-12 max-w-2xl mx-auto font-medium">
            Join the students who have already transformed their academic results with StudyHours. Your journey to a top university begins with one assessment.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center">
            <Link
              href={user ? "/bookings/new" : "/signup?type=assessment"}
              className={`w-full sm:w-auto px-10 py-4 sm:px-12 sm:py-5 ${accentBg} text-white font-black rounded-3xl hover:bg-white hover:text-black transition-all shadow-2xl ${accentShadow} text-base sm:text-lg tracking-wide`}
            >
              Book Free Session
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
