"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Target, Award, Brain, 
  Clock, CheckCircle2, TrendingUp, Zap,
  BarChart4, BookOpen, Calculator, FlaskConical
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";
import StickyCTA from "../../components/subjects/StickyCTA";
import Image from "next/image";

const optimizeCloudinaryUrl = (url: string) => {
  if (url.includes("cloudinary.com") && !url.includes("f_auto")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  }
  return url;
};

const PLACEHOLDER_IMAGE = "https://res.cloudinary.com/de8vvmpip/image/upload/v1776668086/A_focused_one-on-one_202604201224_sairiv.jpg";

// ─── Animations ────────────────────────────────────────────────────────
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

// ─── Visual Components ────────────────────────────────────────────────────────
function SpeedometerVisual() {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl border border-white/10 flex flex-col items-center">
      <div className="absolute top-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
      
      <div className="w-full flex justify-between items-end mb-8 relative z-10">
        <div>
          <h4 className="text-white font-bold text-lg">The ACT Sprint</h4>
          <p className="text-slate-400 text-sm">Pacing vs. Accuracy</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-rose-400 uppercase tracking-widest">Questions / Min</div>
          <div className="text-2xl font-black text-white">1.2 - 1.6</div>
        </div>
      </div>

      <div className="relative w-48 h-24 overflow-hidden z-10 flex justify-center mb-6">
        {/* Speedometer Arc */}
        <svg viewBox="0 0 100 50" className="w-full h-full drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]">
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" strokeLinecap="round" />
          <motion.path 
            d="M 10 50 A 40 40 0 0 1 90 50" 
            fill="none" 
            stroke="url(#gradient)" 
            strokeWidth="8" 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 0.85 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
          
          {/* Animated Needle */}
          <motion.g
            initial={{ rotate: -90 }}
            whileInView={{ rotate: 50 }} // Roughly 85% of 180 degrees
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ transformOrigin: "50% 50%" }}
          >
            <line x1="50" y1="50" x2="50" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="50" r="4" fill="white" />
          </motion.g>
        </svg>
      </div>

      <div className="bg-white/5 border border-white/10 p-4 rounded-xl relative z-10 flex gap-4 items-start w-full">
        <Clock size={20} className="text-rose-400 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-300 leading-relaxed">
          The ACT is an aggressive test of endurance. For example, the English section demands 75 questions in 45 minutes. That's just <strong>36 seconds per question</strong>. If you hesitate, you lose. We drill rapid-recognition patterns so you instinctively know the answer type without over-reading.
        </p>
      </div>
    </div>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────────
export default function ACTPrepPageClient() {
  const { user } = useAuthContext();
  const ctaHref = user ? "/bookings/new" : "/signup?type=assessment";

  return (
    <main className="min-h-screen bg-white dark:bg-black selection:bg-rose-500/20 selection:text-rose-500">
      <StickyCTA />
      
      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-linear-to-bl from-rose-500/10 via-orange-500/5 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-linear-to-tr from-amber-500/5 to-transparent rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/de8vvmpip/image/upload/v1776706912/grid-pattern_qaz43.png')] opacity-[0.03] dark:opacity-[0.05]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-20">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] sm:text-xs font-black tracking-[0.2em] text-rose-600 dark:text-rose-400 mb-8 uppercase backdrop-blur-md"
            >
              <Zap size={14} />
              The Speed & Endurance Test
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl xl:text-[5.5rem] font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase leading-[0.9]"
            >
              Master the <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 to-amber-500">ACT Sprint</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-text-secondary mb-10 leading-relaxed font-medium max-w-2xl mx-auto"
            >
              The ACT isn't about deep intellectual pondering; it's about rapid data processing. Learn to skim aggressively, eliminate traps instantly, and break the 30+ barrier with elite pacing strategies.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link href={ctaHref} className="w-full sm:w-auto px-10 py-5 bg-deep-navy dark:bg-white text-white dark:text-black font-black rounded-3xl hover:scale-105 hover:shadow-2xl transition-all text-center flex items-center justify-center gap-3 group text-lg">
                Book a Diagnostic
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. The Truth About ACT Science (Dark Section) ────────────────────────────────────────────── */}
      <section className="py-24 bg-deep-navy text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div variants={fadeInUp} className="text-xs font-black uppercase tracking-[0.2em] text-rose-400 mb-4">
                01 — The Science Section Myth
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                It's not actually <br/><span className="text-transparent bg-clip-text bg-linear-to-r from-rose-400 to-amber-300">about Science.</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-300 text-lg leading-relaxed mb-8">
                Many students panic on the ACT Science section because they haven't taken advanced Chemistry or Physics. The reality? <strong>The ACT Science section is a reading comprehension and data-interpretation test disguised as science.</strong>
              </motion.p>
              
              <motion.div variants={fadeInUp} className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0 mt-1">
                    <BarChart4 size={20} className="text-rose-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">The Locating Strategy</h4>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      Do not read the lengthy scientific introductions. Go straight to the questions, identify the independent/dependent variables, and locate them in the charts or graphs. You can answer 85% of the questions without understanding the actual scientific mechanism.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <SpeedometerVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. Strategic Shifts & Content ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-black border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-sapphire mb-4">
              02 — Tactical Execution
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6">
              Navigate the 2025 Changes.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* The 2025 Change Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-[#0f1117] rounded-3xl p-10 border border-border hover:shadow-2xl hover:border-rose-500/30 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-8">
                <Target size={32} className="text-amber-500" />
              </div>
              <h3 className="text-3xl font-black text-deep-navy dark:text-white mb-4">The "Core" ACT Updates</h3>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                Starting Spring 2025 (online) and Spring 2026 (paper), the ACT is introducing a new "Core" format that dramatically changes the landscape of the test.
              </p>
              <ul className="space-y-3 mb-8 text-sm font-medium text-deep-navy dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-amber-500 shrink-0 mt-0.5" /> 
                  <span><strong>Shorter Test:</strong> Reduced from 3 hours to 2 hours, alleviating severe testing fatigue.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-amber-500 shrink-0 mt-0.5" /> 
                  <span><strong>Optional Science:</strong> The Science section is becoming optional. You must decide if your target colleges require it or if skipping it benefits your composite score.</span>
                </li>
              </ul>
            </motion.div>

            {/* Geometry Heavy Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-[#0f1117] rounded-3xl p-10 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8">
                <Calculator size={32} className="text-blue-500" />
              </div>
              <h3 className="text-3xl font-black text-deep-navy dark:text-white mb-4">Math: Broader, Not Deeper</h3>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                Unlike the SAT which focuses heavily on algebra, the ACT Math section tests a much broader scope of high school math. 
              </p>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-border">
                  <h4 className="font-bold text-deep-navy dark:text-white mb-1">Geometry & Trigonometry</h4>
                  <p className="text-xs text-text-secondary">You must know your formulas. The ACT does not provide a formula sheet at the beginning of the section.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-border">
                  <h4 className="font-bold text-deep-navy dark:text-white mb-1">The 20-20-20 Rule</h4>
                  <p className="text-xs text-text-secondary">Questions scale in difficulty. Do the first 20 in 15 mins, next 20 in 20 mins, and save 25 mins for the final 20 hardest questions.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4. ACT Subject Mastery (SEO Grid) ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-[#08080f] relative border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-6">
              Section-by-Section Mastery
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              The ACT requires a unique approach for each section. We train you to master the specific concepts and pacing required for all four subjects.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "ACT English",
                icon: <BookOpen size={20} className="text-rose-500" />,
                topics: ["Usage & Mechanics", "Rhetorical Skills", "Punctuation Rules", "Sentence Structure"]
              },
              {
                title: "ACT Math",
                icon: <Calculator size={20} className="text-sapphire" />,
                topics: ["Pre-Algebra & Elementary Algebra", "Intermediate Algebra & Coordinate Geometry", "Plane Geometry & Trigonometry", "Probability & Statistics"]
              },
              {
                title: "ACT Reading",
                icon: <Target size={20} className="text-emerald-500" />,
                topics: ["Reading Comprehension", "Speed Skimming Tactics", "Locating Detail Questions", "Main Idea vs. Inference"]
              },
              {
                title: "ACT Science",
                icon: <FlaskConical size={20} className="text-amber-500" />,
                topics: ["Data Representation", "Research Summaries", "Conflicting Viewpoints", "Variable Identification"]
              }
            ].map((subject, i) => (
              <div key={i} className="bg-white dark:bg-[#0f1117] border border-border rounded-3xl p-8 hover:shadow-xl hover:border-rose-500/30 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                    {subject.icon}
                  </div>
                  <h3 className="font-bold text-xl text-deep-navy dark:text-white">{subject.title}</h3>
                </div>
                <ul className="space-y-3">
                  {subject.topics.map((topic, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                      <CheckCircle2 size={16} className="text-rose-500 shrink-0 mt-0.5" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. The StudyHours Framework ────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-black border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">
              05 — The Methodology
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6">
              How We Engineer Your Score.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "Phase 1",
                title: "Baseline & Pacing Analysis",
                desc: "We run a full-length timed diagnostic. We don't just look at what you got wrong; we track exactly where your speed dropped off and caused a cascade of errors."
              },
              {
                step: "Phase 2",
                title: "Triage & Pattern Recognition",
                desc: "We drill you on recognizing question types instantly. You will learn to identify a 'Data Representation' science question in seconds and know exactly where to look for the answer."
              },
              {
                step: "Phase 3",
                title: "Endurance Simulations",
                desc: "The ACT is a marathon. We run high-stakes, full-length simulations to build your stamina so you don't burn out by the final Science section."
              }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-border"
              >
                <div className="text-5xl font-black text-rose-500/10 absolute top-6 right-6">
                  0{i + 1}
                </div>
                <div className="text-sm font-bold text-rose-500 mb-3">{s.step}</div>
                <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-4">{s.title}</h3>
                <p className="text-text-secondary leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FAQ Section ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-[#08080f] relative border-b border-border">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is it really possible to improve my ACT score significantly?",
                a: "Absolutely. While jumping from a 20 to a 36 is incredibly rare, a 4-5 point composite increase is highly achievable with structured practice. We focus on 'easy wins' first—like fixing punctuation rules in English—which instantly inflates your score."
              },
              {
                q: "Should I take the SAT or the ACT?",
                a: "It comes down to pacing vs. complexity. The SAT gives you more time per question but the questions (especially reading) are more complex. The ACT questions are more straightforward, but the time limit is punishing. Our initial diagnostic will tell you which test naturally fits your brain."
              },
              {
                q: "Do I need to take the ACT Writing (Essay) section?",
                a: "For the vast majority of students, no. Almost all top-tier universities no longer require or even review the ACT essay. Unless a specific program you are applying to requires it, skip it and focus your energy on the core four sections."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-white dark:bg-black border border-border rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg text-deep-navy dark:text-white">
                  {faq.q}
                  <span className="text-rose-500 group-open:rotate-90 transition-transform">→</span>
                </summary>
                <div className="px-6 pb-6 text-text-secondary leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Final CTA ────────────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden bg-slate-900">
        <Image src={optimizeCloudinaryUrl(PLACEHOLDER_IMAGE)} alt="Student studying" fill className="object-cover opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 p-12 md:p-16 rounded-[3rem] shadow-2xl"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
              Ready to Break <br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-400 to-amber-400">the 30+ Barrier?</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              Our diagnostic assessment will immediately reveal whether you are better suited for the SAT or the ACT. Stop wasting time preparing for the wrong test.
            </p>
            
            <Link 
              href={ctaHref} 
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-black rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] text-lg group"
            >
              Take an ACT Diagnostic
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
