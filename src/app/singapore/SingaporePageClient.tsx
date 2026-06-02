"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  MapPin,
  GraduationCap,
  BookOpen,
  Target,
  Award,
  CheckCircle2,
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../components/subjects/ParentTestimonials";
import StickyCTA from "../components/subjects/StickyCTA";
import SubjectFAQ from "../components/subjects/SubjectFAQ";

interface Props {
  faqs: any[];
}

export default function SingaporePageClient({ faqs }: Props) {
  const { user } = useAuthContext();
  const ctaHref = user ? "/bookings/new" : "/signup?type=assessment";

  return (
    <main className="min-h-screen bg-background transition-colors duration-500 relative">
      <StickyCTA />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-ice-blue/40 to-transparent dark:from-sapphire/5 pointer-events-none" />

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
                MOE Syllabus & IP Specialists
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter leading-[0.95] uppercase">
                Premium Online Tutoring{" "}
                <span className="text-sapphire text-balance">
                  for Singapore Students
                </span>
              </h1>

              <p className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sapphire to-primary italic mb-10 leading-tight">
                PSLE &bull; O-Level &bull; A-Level &bull; IP &mdash; Exam Focused
              </p>

              <p className="text-xl text-text-secondary mb-12 leading-relaxed font-medium max-w-xl">
                Rigorous, exam-focused 1-on-1 tutoring that cuts through the noise. Get access to Singapore’s top tutors from the comfort of your home, saving time on travel and maximizing effective revision.
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
              </div>

              <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-border/50">
                <div>
                  <div className="text-3xl font-black text-sapphire mb-1 tracking-tighter">
                    AL1
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                    Target Score
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-sapphire mb-1 tracking-tighter">
                    100%
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                    MOE Aligned
                  </div>
                </div>
                <div>
                  <div className="text-xl font-black text-sapphire mb-1 tracking-tighter leading-snug">
                    PSLE, O/A<br/>Level, IP
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                    Key Milestones
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-6"
            >
              {[
                { icon: Award, label: "PSLE Experts", sub: "Primary 4-6" },
                { icon: BookOpen, label: "O-Level", sub: "Secondary 3-4" },
                { icon: GraduationCap, label: "A-Level", sub: "JC 1-2" },
                { icon: Target, label: "IP Tutors", sub: "Integrated Prog." },
              ].map((card, i) => (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-white dark:bg-slate-900/50 border border-border shadow-sm hover:shadow-xl transition-all group flex flex-col gap-4"
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

      {/* CURRICULUM SELECTION */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">
              Singapore Curriculum
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase leading-none">
              Specialised MOE <span className="text-sapphire">Support</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto font-medium">
              We cover the full spectrum of the Singapore education journey, from foundational Primary years up to Junior College excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "PSLE Tutoring", desc: "AL1 targeting", link: "/singapore/psle-tutors-online", lvl: "PRI" },
              { title: "O-Level Tutoring", desc: "L1R5 strategy", link: "/singapore/o-level-tutors-singapore", lvl: "SEC" },
              { title: "IP Tutoring", desc: "Integrated Program", link: "/singapore/ip-programme-tutors-singapore", lvl: "SEC/JC" },
              { title: "A-Level Tutoring", desc: "Rank Point maxing", link: "/singapore/a-level-tutors-singapore", lvl: "JC" },
            ].map((prog) => (
              <Link key={prog.title} href={prog.link} className="block group">
                <div className="p-8 rounded-4xl bg-white dark:bg-slate-900 border border-border group-hover:border-sapphire/50 group-hover:shadow-xl transition-all h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-4xl italic">{prog.lvl}</div>
                  <h3 className="text-2xl font-black text-deep-navy dark:text-white uppercase tracking-tighter mb-2 group-hover:text-sapphire transition-colors relative z-10">{prog.title}</h3>
                  <p className="text-sm font-medium text-text-secondary mb-8 relative z-10">{prog.desc}</p>
                  <div className="flex items-center gap-2 text-xs font-black text-sapphire uppercase tracking-widest relative z-10">
                    Explore <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US SECTION */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter uppercase leading-none">
                Exam Technique <br/><span className="text-sapphire">Over Memorisation</span>
              </h2>
              <p className="text-xl text-text-secondary mb-8 leading-relaxed font-medium">
                The MOE syllabus heavily penalises students who only memorise. For PSLE Science open-ended questions or A-Level Economics essays, exact keywords and structured thinking are required. We teach exam technique explicitly.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Maths Heuristics and Multi-step Problem Solving",
                  "Science Keyword and Application Training",
                  "Composition & Essay Structure Breakdown",
                  "Direct Feedback on Past Year Papers"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-sapphire shrink-0 mt-0.5" />
                    <span className="font-medium text-deep-navy dark:text-white">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 px-8 py-4 bg-sapphire text-white font-black rounded-3xl hover:bg-primary transition-all text-sm uppercase tracking-widest"
              >
                Start Improving
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-10 rounded-4xl bg-sapphire text-white shadow-2xl"
            >
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 leading-tight">
                Why Online Beats Tuition Centres
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-tight text-lg mb-1">Zero Commute Time</h4>
                    <p className="text-sm font-medium opacity-80">Reclaim hours spent travelling to crowded tuition centres. Learn from home in a distraction-free environment.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <Award size={24} />
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-tight text-lg mb-1">100% Personalised</h4>
                    <p className="text-sm font-medium opacity-80">Classroom tuition moves at the pace of the average student. 1-on-1 tutoring moves at exactly your pace.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <ParentTestimonials testimonials={[]} />

      {/* FAQ */}
      <section className="py-24 px-6 bg-surface dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-6 block">FAQs</span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white tracking-tighter uppercase">
              Common Questions About <span className="text-sapphire italic">Singapore Tutoring</span>
            </h2>
          </div>
          <SubjectFAQ items={faqs} description="Everything Singapore families need to know." />
        </div>
      </section>

    </main>
  );
}
