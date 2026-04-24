"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../../components/subjects/ParentTestimonials";
import StickyCTA from "../../components/subjects/StickyCTA";
import SubjectFAQ from "../../components/subjects/SubjectFAQ";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Target } from "lucide-react";

const optimizeCloudinaryUrl = (url: string) => {
  if (url.includes("cloudinary.com") && !url.includes("f_auto")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  }
  return url;
};

type FAQItemType = { q: string; a: string };

interface Props {
  testimonials: { text: string; author: string; role: string; rating: number }[];
  faqs: FAQItemType[];
}

const fadeUp = {
  hidden: { opacity: 1, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const cycles = [
  {
    cycle: "Cycle 1",
    grades: "Grades 1-4",
    ages: "Ages 6-10",
    subjects: ["Arabic Language (literacy foundations   Qiraah, Kitabah)", "Islamic Education (Quran recitation, basic Aqeedah)", "Mathematics (number sense, operations, measurement)", "Science (integrated, inquiry-based)", "Social Studies and Moral Education", "English as an Additional Language"],
    assessment: "Portfolio and formative assessment. Continuous school-based grading. No national exam.",
    focus: "Arabic literacy, numeracy foundations, and Islamic values. The UAE reading and writing standards in Arabic are demanding from Grade 1.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    cycle: "Cycle 2",
    grades: "Grades 5-8",
    ages: "Ages 10-14",
    subjects: ["Arabic Language (grammar, rhetoric, composition)", "Islamic Education (Fiqh, Hadith, Seerah)", "Mathematics (algebra, fractions, early geometry)", "Science (expanding Biology, Chemistry, Physics concepts)", "Social Studies (UAE history, geography, civics)", "Moral Education (standalone subject, 4 pillars)", "English Language (expanding skills)", "Computer Technology"],
    assessment: "School midterm and end-of-term exams. Grade 8 results inform Cycle 3 subject choices.",
    focus: "Arabic grammar becomes highly examinable from Grade 5. Moral Education assessed on essays and reflection tasks.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    cycle: "Cycle 3",
    grades: "Grades 9-12",
    ages: "Ages 14-18",
    subjects: ["Arabic Language (literature, critical analysis, advanced composition)", "Islamic Education (advanced Fiqh, contemporary issues)", "Mathematics (Cycle 3 Science or Arts track)", "Physics, Chemistry, Biology (Science track)", "Social Studies and History", "Moral Education", "English Language", "EmSAT preparation subjects"],
    assessment: "School exams + EmSAT university entrance exam in Grade 12. Continuous assessment contributes to UAE university admission.",
    focus: "EmSAT scores determine admission to UAEU, Zayed University, and HCT. Minimum scores per faculty vary significantly.",
    color: "from-violet-500 to-purple-600",
  },
];

const emsatSubjects = [
  {
    subject: "EmSAT English",
    code: "Achieve English",
    range: "500-2000",
    typical: "Most UAE universities require 1100+ for undergraduate. Medicine and Law require 1400+.",
    tutorFocus: "Academic reading comprehension, grammar accuracy, essay writing structure for UAE university standards.",
  },
  {
    subject: "EmSAT Mathematics",
    code: "Achieve Math",
    range: "500-2000",
    typical: "UAEU Engineering requires 1100+. Business may accept 900+.",
    tutorFocus: "Algebra, calculus foundations, trigonometry, statistics. EmSAT-specific question format and pacing.",
  },
  {
    subject: "EmSAT Physics",
    code: "Achieve Physics",
    range: "500-2000",
    typical: "Engineering and Physics programmes: 900-1100+ minimum.",
    tutorFocus: "MOE UAE Physics Cycle 3 content. Mechanics, waves, electricity. Multiple-choice format strategy.",
  },
  {
    subject: "EmSAT Chemistry",
    code: "Achieve Chemistry",
    range: "500-2000",
    typical: "Medicine, Pharmacy: 900+ required. General Science: 700+.",
    tutorFocus: "Physical, inorganic, organic chemistry at UAE Grade 12 level. EmSAT question style practice.",
  },
  {
    subject: "EmSAT Biology",
    code: "Achieve Biology",
    range: "500-2000",
    typical: "Medicine and Nursing pathways: 900-1100+ minimum.",
    tutorFocus: "Cell biology, genetics, ecology, human physiology. UAE MOE Biology Cycle 3 syllabus coverage.",
  },
  {
    subject: "EmSAT Arabic",
    code: "Achieve Arabic",
    range: "500-2000",
    typical: "Arabic Language, Islamic Studies, Education programmes: 1200+.",
    tutorFocus: "Arabic reading comprehension, grammar accuracy, writing for UAE academic standards.",
  },
];

const moralEdPillars = [
  { pillar: "Character and Morality", content: "Personal values, ethical decision-making, honesty, respect, empathy. Assessed through reflection essays and scenario analysis." },
  { pillar: "The Individual and the Community", content: "Rights and responsibilities, community service, social cohesion, family values. UAE social context central." },
  { pillar: "Civic Studies", content: "UAE governance structures, citizenship, rule of law, national symbols and identity. UAE Constitution knowledge." },
  { pillar: "Cultural Studies", content: "UAE heritage, Emirati traditions, Arab culture, global cultural exchange. Savoir-faire for UAE National Day and cultural events." },
];

export default function MOEUAEPageClient({ testimonials, faqs }: Props) {
  const { user } = useAuthContext();
  const ctaHref = user ? "/bookings/new" : "/signup?type=assessment";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <StickyCTA />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center text-white pt-32 pb-24 px-4 overflow-hidden bg-deep-navy">
        {/* Background Image With Multi-layered Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src={optimizeCloudinaryUrl("https://res.cloudinary.com/de8vvmpip/image/upload/v1776668899/A_softly_blurred_202604201238_x8vf0q.jpg")}
            alt="UAE Ministry of Education curriculum abstract background"
            fill
            className="object-cover opacity-60 scale-110"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-deep-navy/80 via-deep-navy/60 to-deep-navy" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-red-400/30 via-transparent to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[10px] font-black mb-6 tracking-[0.2em] uppercase text-white/90 backdrop-blur-md">
            <span>🇦🇪</span> UAE Ministry of Education · Cycle 1, 2 and 3
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.1 } } }} 
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[0.95] uppercase drop-shadow-2xl text-white">
            MOE UAE <span className="text-ice-blue underline decoration-primary/30 underline-offset-8">Curriculum Tutors</span>
          </motion.h1>
          <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.2 } } }} 
            className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-ice-blue to-primary italic mb-8 drop-shadow-sm">
            Emirates National Schools Online
          </motion.div>
          <motion.p initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.2 } } }} className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
            Expert online tutors for the UAE Ministry of Education national curriculum. Arabic Language, Islamic Education, Mathematics, Sciences and Moral Education across Cycle 1, 2 and 3. EmSAT university entrance preparation for UAEU, Zayed University and HCT.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.3 } } }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ctaHref} className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-white font-black text-sm tracking-wide hover:bg-sapphire hover:scale-105 transition-all shadow-xl shadow-blue-500/30">
              Book Free Trial Lesson
            </Link>
            <a href="#cycles" className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-all">
              Explore Cycles
            </a>
          </motion.div>
        </div>
      </section>

      {/* Cycle Breakdown */}
      <section id="cycles" className="py-24 px-4 bg-surface relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-emerald-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">MOE UAE Curriculum by Cycle</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-text-secondary max-w-2xl mx-auto font-medium">Three cycles from Grade 1 to Grade 12. Cycle 3 culminates in EmSAT for university admission. Our tutors cover all cycles and all subjects.</p>
          </motion.div>
          
          <div className="flex flex-col gap-12">
            {cycles.map((c, i) => (
              <motion.div
                key={c.cycle}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  ...fadeUp,
                  visible: {
                    ...fadeUp.visible,
                    transition: { duration: 0.6, delay: i * 0.15 },
                  },
                }}
                className="group relative rounded-[3rem] lg:rounded-[4rem] p-1 bg-linear-to-br from-border/50 to-transparent hover:from-sapphire/20 transition-all duration-700 shadow-2xl"
              >
                <div className="relative rounded-[2.9rem] lg:rounded-[3.9rem] p-8 lg:p-14 bg-white dark:bg-[#0d1117] overflow-hidden">
                  {/* Subtle Background Elements */}
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-linear-to-bl ${c.color} opacity-0 group-hover:opacity-5 blur-[100px] transition-opacity duration-1000`} />
                  
                  <div className="relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    {/* Left: Cycle Identity & Stats */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                      <div>
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-sapphire/10 text-sapphire text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-sapphire/20">
                          {c.grades}
                        </div>
                        <h3 className="text-4xl lg:text-6xl font-black text-deep-navy dark:text-white tracking-tighter uppercase leading-[0.9] italic mb-4">
                          {c.cycle}
                        </h3>
                        <p className="text-xl font-bold text-sapphire/80 italic">{c.ages}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-8 rounded-4xl bg-slate-50 dark:bg-white/5 border border-border group-hover:border-sapphire/30 transition-all">
                          <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                             Specialised Focus
                          </p>
                          <p className="text-[15px] font-medium text-deep-navy dark:text-slate-300 leading-relaxed italic">
                            {c.focus}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Subjects & Assessment */}
                    <div className="lg:col-span-8 flex flex-col gap-10">
                      <div>
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] mb-8 opacity-50">Mastery Subjects</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {c.subjects.map((s, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-5 rounded-3xl bg-white dark:bg-white/5 border border-border hover:border-sapphire/30 hover:shadow-xl transition-all group/item">
                              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform duration-500">
                                <CheckCircle2 size={16} />
                              </div>
                              <span className="text-sm text-deep-navy dark:text-white font-bold tracking-tight">{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="relative mt-4 p-10 rounded-4xl bg-linear-to-br from-surface to-surface/50 dark:from-white/10 dark:to-transparent border border-border/50 overflow-hidden group/assessment">
                        <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-sapphire/10 to-transparent translate-x-full group-hover/assessment:translate-x-0 transition-transform duration-700" />
                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                          <div className="w-12 h-12 rounded-2xl bg-sapphire text-white flex items-center justify-center shrink-0 shadow-lg shadow-sapphire/20">
                            <Target size={24} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-sapphire uppercase tracking-widest mb-3">Assessment Protocol</p>
                            <p className="text-base font-medium text-text-secondary dark:text-slate-300 leading-relaxed italic">
                              {c.assessment}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EmSAT */}
      <section className="py-24 px-4 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/20 to-transparent" />
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">EmSAT Preparation Matrix</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-text-secondary max-w-2xl mx-auto font-medium lowercase"> scores required for all UAE federal university admissions. 500-2000 scoring scale specialist preparation.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {emsatSubjects.map((e, i) => (
              <motion.div 
                key={e.subject} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.09 } } }} 
                className="group relative rounded-[3rem] p-1 bg-linear-to-br from-border/50 to-transparent hover:from-sapphire/20 transition-all duration-700 shadow-2xl"
              >
                <div className="relative rounded-[2.9rem] p-10 bg-white dark:bg-[#0d1117] h-full overflow-hidden flex flex-col">
                  {/* Subtle Background Glow on Hover */}
                  <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-10">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border shadow-sm flex items-center justify-center font-black text-sapphire group-hover:bg-sapphire group-hover:text-white transition-all duration-500 text-xl italic">
                        {e.subject.split(' ')[1][0]}
                      </div>
                      <span className="text-[10px] font-black text-sapphire uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">
                        {e.code}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-2 tracking-tighter uppercase leading-tight group-hover:text-sapphire transition-colors italic">
                      {e.subject}
                    </h3>
                    <p className="text-[11px] font-black text-sapphire/70 uppercase tracking-widest mb-8">
                      Scale: {e.range} Score Range
                    </p>

                    <div className="space-y-8">
                      <p className="text-[14px] text-text-secondary dark:text-slate-300 font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                        {e.typical}
                      </p>
                      
                      <div>
                        <p className="text-[10px] font-black text-sapphire uppercase tracking-[0.2em] mb-4">Strategic Triage Focus</p>
                        <p className="text-[14px] font-bold text-deep-navy dark:text-white leading-relaxed italic border-l-2 border-sapphire/20 pl-4">
                          {e.tutorFocus}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-12 flex items-center justify-between text-sapphire group-hover:translate-x-2 transition-transform duration-500">
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">Qualified UAE MOE Specialist</span>
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Moral Education */}
      <section className="py-24 px-4 bg-surface relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight italic">Moral Education</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-text-secondary max-w-2xl mx-auto font-medium">Compulsory graded subject across all school stages. Our tutors master the assessment of essays, reflections, and oral presentations.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {moralEdPillars.map((p, i) => (
              <motion.div 
                key={p.pillar} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.1 } } }} 
                className="group relative rounded-[3rem] p-1 bg-linear-to-br from-border/50 to-transparent hover:from-emerald-500/20 transition-all duration-700 shadow-2xl"
              >
                <div className="relative rounded-[2.9rem] p-10 bg-white dark:bg-[#0d1117] h-full overflow-hidden flex flex-col">
                  {/* Subtle Background Glow on Hover */}
                  <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border shadow-sm flex items-center justify-center font-black group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 text-xl italic">
                        {i + 1}
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">
                        Pillar {i + 1}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-2 tracking-tighter uppercase leading-tight group-hover:text-emerald-600 transition-colors italic">
                      {p.pillar}
                    </h3>
                    <p className="text-[11px] font-black text-emerald-600/70 uppercase tracking-widest mb-8">
                       UAE National Ethos
                    </p>

                    <p className="text-base text-text-secondary dark:text-slate-300 font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                      {p.content}
                    </p>

                    <div className="mt-auto pt-10 flex items-center justify-between text-emerald-600 group-hover:translate-x-2 transition-transform duration-500">
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">Ethical Reasoning Support</span>
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-24 px-4 bg-background relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tighter">Cinematic Growth Matrix</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </motion.div>
          <div className="rounded-[3.5rem] overflow-hidden border border-border/60 shadow-2xl bg-white dark:bg-slate-900/50 relative">
            <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent pointer-events-none" />
            <div className="grid grid-cols-3 bg-deep-navy text-white text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
              <div className="px-8 py-6">Subject / Level</div>
              <div className="px-8 py-6 border-l border-white/10 italic text-red-400">Baseline Level</div>
              <div className="px-8 py-6 border-l border-white/10 italic text-emerald-400">Post-Tutoring Delta</div>
            </div>
            {[
              ["Arabic Language   Cycle 2 (G7)", "Grammar accuracy 62%. Composition structure weak. Qawaid rules not retained.", "Arabic grade 88%. Grammar systematic. Composition structure criterion-based."],
              ["EmSAT Mathematics   G12", "School continuous assessment 78%. EmSAT practice score 700-750.", "EmSAT Math 1050. UAEU Business minimum met. Engineering pathway in range."],
              ["Islamic Education   Cycle 3", "Fiqh and Hadith not understood contextually. Rote recall only.", "Contextual understanding of Fiqh principles. Essay-format answers improved."],
              ["Arab expat   Moral Education", "UAE-specific Civic Studies content unfamiliar. Essay format underdeveloped.", "Civic Studies above average. Moral Education reflection essay technique applied."],
            ].map(([lvl, before, after], i) => (
              <div key={lvl} className={`grid grid-cols-3 border-t border-border group relative z-10 ${i % 2 === 0 ? 'bg-white/50 dark:bg-white/5' : 'bg-transparent'}`}>
                <div className="px-8 py-8 text-sm font-black text-deep-navy dark:text-white uppercase tracking-tighter italic flex items-center">
                   {lvl}
                </div>
                <div className="px-8 py-8 text-[13px] font-medium text-red-600/80 dark:text-red-400/80 bg-red-500/2 border-l border-border italic leading-relaxed">
                  {before}
                </div>
                <div className="px-8 py-8 text-[13px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-500/4 border-l border-border italic leading-relaxed">
                  {after}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">What UAE Families Say</h2>
          </motion.div>
          <ParentTestimonials testimonials={testimonials} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">MOE UAE Curriculum FAQs</h2>
          </motion.div>
          <SubjectFAQ items={faqs} />
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-8">
            <h2 className="text-2xl font-black text-deep-navy dark:text-white">More UAE Tutoring Pages</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Online Tutors Dubai", href: "/uae/online-tutors-dubai", desc: "All Dubai curricula, KHDA rated" },
              { name: "Online Tutors Abu Dhabi", href: "/uae/online-tutors-abu-dhabi", desc: "ADEK regulated, EmSAT prep" },
              { name: "Online Tutors Riyadh", href: "/saudi/online-tutors-riyadh", desc: "BIS, AISR, Saudi MOE" },
              { name: "Saudi Ministry Curriculum", href: "/saudi/saudi-ministry-curriculum-tutors", desc: "Tawjihi and Qudurat prep" },
            ].map((l, i) => (
              <motion.div key={l.href} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.08 } } }}>
                <Link href={l.href} className="block p-4 rounded-xl border border-border bg-white dark:bg-white/5 hover:border-primary hover:shadow-md transition-all group">
                  <p className="font-black text-deep-navy dark:text-white group-hover:text-primary transition-colors text-sm mb-1">{l.name}</p>
                  <p className="text-xs text-text-secondary">{l.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark CTA */}
      <section className="py-20 px-4 bg-linear-to-br from-deep-navy to-[#0d1f3c] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Connect with a UAE MOE Curriculum Specialist</h2>
            <p className="text-white/70 mb-8 text-lg">Arabic Language, Islamic Education, Mathematics, Sciences, Moral Education and EmSAT. UAE government school specialists ready to match your child's exact Cycle and grade.</p>
            <Link href={ctaHref} className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-primary text-white font-black text-sm tracking-wide hover:bg-sapphire hover:scale-105 transition-all shadow-xl shadow-blue-500/30">
              Book Free Trial Lesson
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SEO paragraph */}
      <section className="py-12 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-text-secondary leading-relaxed">
            StudyHours provides specialist online tutors for the UAE Ministry of Education national curriculum across all three cycles. Cycle 1 (Grades 1-4) tutoring covers Arabic Language literacy, Islamic Education foundations, and Mathematics fundamentals. Cycle 2 (Grades 5-8) tutoring addresses Arabic Language grammar and composition, Islamic Education Fiqh and Hadith, expanding Mathematics, Sciences, Social Studies, and Moral Education across all four pillars. Cycle 3 (Grades 9-12) tutoring prepares students for both school continuous assessment and EmSAT university entrance examinations. Our EmSAT specialists cover EmSAT English (Achieve English), EmSAT Mathematics, EmSAT Physics, EmSAT Chemistry, EmSAT Biology, and EmSAT Arabic, with specific preparation aligned to the 500-2000 scoring scale and minimum thresholds for UAE University (UAEU), Zayed University, and Higher Colleges of Technology (HCT) faculty requirements. We support UAE national students (Emirati families) and Arab expat families whose children attend UAE government schools or MOE-curriculum national private schools across Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain.
          </p>
        </div>
      </section>
    </main>
  );
}
