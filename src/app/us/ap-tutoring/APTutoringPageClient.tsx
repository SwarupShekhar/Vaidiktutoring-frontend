"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Target, Award, Brain, 
  Calculator, CheckCircle2, TrendingUp, Monitor,
  BookOpen, Edit3, FlaskConical, LayoutGrid
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
function ThresholdVisual() {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl border border-white/10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-sapphire/20 rounded-full blur-3xl" />
      
      <div className="flex justify-between items-end mb-6 relative z-10">
        <div>
          <h4 className="text-white font-bold text-lg">The "5" Threshold Reality</h4>
          <p className="text-slate-400 text-sm">Example: AP Calculus BC (Typical Curve)</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Target Score</div>
          <div className="text-2xl font-black text-white">5</div>
        </div>
      </div>

      <div className="relative pt-6 pb-2 z-10">
        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
          <span>0%</span>
          <span>50%</span>
          <span className="text-emerald-400">~68-72% (The "5" Cutoff)</span>
          <span>100%</span>
        </div>
        
        {/* Progress Bar Background */}
        <div className="h-4 bg-white/5 rounded-full overflow-hidden flex">
          {/* Animated Fill */}
          <motion.div 
            className="h-full bg-linear-to-r from-blue-500 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "70%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <div className="h-full bg-transparent w-[30%]" />
        </div>
      </div>

      <div className="mt-8 bg-white/5 border border-white/10 p-4 rounded-xl relative z-10 flex gap-4 items-start">
        <Target size={20} className="text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-300 leading-relaxed">
          <strong>Perfection is a trap.</strong> You do not need 100% to get a 5. On many rigorous AP exams, earning just ~70% of the total raw points secures a 5. We train students to aggressively secure the easiest 70% rather than panicking over the hardest 10%.
        </p>
      </div>
    </div>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────────
export default function APTutoringPageClient() {
  const { user } = useAuthContext();
  const ctaHref = user ? "/bookings/new" : "/signup?type=assessment";

  return (
    <main className="min-h-screen bg-white dark:bg-black selection:bg-emerald-500/20 selection:text-emerald-500">
      <StickyCTA />
      
      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-[70vw] h-[70vw] bg-linear-to-br from-emerald-500/10 via-sapphire/5 to-transparent rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/3" />
          <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-linear-to-tl from-primary/5 to-transparent rounded-full blur-[80px] translate-y-1/3 translate-x-1/4" />
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/de8vvmpip/image/upload/v1776706912/grid-pattern_qaz43.png')] opacity-[0.03] dark:opacity-[0.05]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-20">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] sm:text-xs font-black tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-8 uppercase backdrop-blur-md"
            >
              <Award size={14} />
              Advanced Placement Strategy
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl xl:text-[5.5rem] font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase leading-[0.9]"
            >
              Engineer Your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-sapphire">AP Success</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-text-secondary mb-10 leading-relaxed font-medium max-w-2xl mx-auto"
            >
              College Board rubrics are exact, unforgiving, and highly predictable. Stop memorizing textbooks. Learn to write directly to the FRQ rubric and navigate the 2025 digital transition with elite specialists.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link href={ctaHref} className="w-full sm:w-auto px-10 py-5 bg-deep-navy dark:bg-white text-white dark:text-black font-black rounded-3xl hover:scale-105 hover:shadow-2xl transition-all text-center flex items-center justify-center gap-3 group text-lg">
                Book AP Tutoring
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. The 5 Strategy (Dark Section) ────────────────────────────────────────────── */}
      <section className="py-24 bg-deep-navy text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div variants={fadeInUp} className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-4">
                01 — The Mathematics of a 5
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                You don't need <br/><span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-200">perfection.</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-300 text-lg leading-relaxed mb-8">
                A massive misconception is that scoring a 5 requires near-perfect knowledge. In reality, College Board curves mean that scoring ~70% of total points often secures the top score. 
              </motion.p>
              
              <motion.div variants={fadeInUp} className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-1">
                    <ShieldCheck size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Triage Strategy</h4>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      We teach students to ruthlessly prioritize. Secure the "easy" points on the Multiple Choice (MCQ) section and follow strict templates for Free Response Questions (FRQ) to guarantee partial credit on the hardest problems.
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
              <ThresholdVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. FRQ Rubrics & Digital Transition ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-black border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-sapphire mb-4">
              02 — Tactical Execution
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6">
              Crack the Rubric. Master the Interface.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* FRQ Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-[#0f1117] rounded-3xl p-10 border border-border hover:shadow-2xl hover:border-sapphire/30 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8">
                <Edit3 size={32} className="text-blue-500" />
              </div>
              <h3 className="text-3xl font-black text-deep-navy dark:text-white mb-4">Writing to the Rubric</h3>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                AP graders are instructed to scan for specific keywords and structures. A brilliant essay that misses the required structural points will score lower than a mediocre essay that checks the rubric boxes.
              </p>
              <ul className="space-y-3 mb-8 text-sm font-medium text-deep-navy dark:text-slate-300">
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-blue-500" /> Learn the AP Command Terms (Identify vs. Explain)</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-blue-500" /> DBQ/LEQ formulaic paragraph structures</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-blue-500" /> Avoiding "data dumps" that earn zero points</li>
              </ul>
            </motion.div>

            {/* Digital Transition Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-[#0f1117] rounded-3xl p-10 border border-border hover:shadow-2xl hover:border-emerald-500/30 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8">
                <Monitor size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-3xl font-black text-deep-navy dark:text-white mb-4">The 2025 Digital Shift</h3>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                Starting May 2025, 28 AP exams are moving to a fully digital format on the Bluebook app (including AP English, APUSH, and AP World).
              </p>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-border">
                  <h4 className="font-bold text-deep-navy dark:text-white mb-1">Typing vs. Writing</h4>
                  <p className="text-xs text-text-secondary">Students often write longer essays digitally but struggle with structuring them. We train specifically in the Bluebook interface.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-border">
                  <h4 className="font-bold text-deep-navy dark:text-white mb-1">Digital Annotation</h4>
                  <p className="text-xs text-text-secondary">Mastering the built-in highlighting and flagging tools is now mandatory for success in reading-heavy subjects.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4. Subject Expertise ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            <motion.div 
              className="lg:col-span-5"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">
                03 — Elite Specialists
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 leading-tight">
                Subject-Specific<br/>Tactics.
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                A strategy that works for AP Calculus will fail spectacularly in AP World History. We assign tutors who are elite specialists in their specific disciplines, intimately familiar with how the College Board tests that exact subject.
              </p>
            </motion.div>

            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: <Calculator size={24} className="text-sapphire" />,
                    title: "STEM (Calc, Physics, Chem)",
                    desc: "Focus on showing required step-by-step logic. The final answer is often only worth 1 point out of 4."
                  },
                  {
                    icon: <BookOpen size={24} className="text-amber-500" />,
                    title: "Humanities (History, Gov)",
                    desc: "Mastering the DBQ (Document-Based Question) and LEQ rubrics. Contextualization and complex understanding are key."
                  },
                  {
                    icon: <LayoutGrid size={24} className="text-emerald-500" />,
                    title: "English (Lit & Lang)",
                    desc: "Moving beyond basic summaries. Thesis generation and advanced rhetorical analysis templates."
                  },
                  {
                    icon: <FlaskConical size={24} className="text-purple-500" />,
                    title: "Biology & Env Science",
                    desc: "Data interpretation and experimental design. Knowing how to read complex charts rapidly."
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0f1117] border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-border flex items-center justify-center mb-4 shadow-sm">
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-lg text-deep-navy dark:text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. AP Subject Mastery (SEO Grid) ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-[#08080f] relative border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-6">
              Comprehensive Subject Mastery
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              We don't just teach test-taking strategies. Our specialists dive deep into the core concepts required by the College Board curriculum.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AP Calculus (AB/BC)",
                icon: <Calculator size={20} className="text-sapphire" />,
                topics: ["Limits & Continuity", "Derivatives - Rules", "Applications of Derivatives", "Integrals & FTC", "Applications of Integrals", "Series (BC Only)"]
              },
              {
                title: "AP Chemistry",
                icon: <FlaskConical size={20} className="text-emerald-500" />,
                topics: ["Atomic Structure & Periodicity", "Stoichiometry", "Equilibrium", "Acids & Bases", "Thermodynamics", "Kinetics"]
              },
              {
                title: "AP Biology",
                icon: <Target size={20} className="text-green-500" />,
                topics: ["Chemistry of Life", "Cell Structure & Function", "Cellular Energetics", "Heredity & Genetics", "Evolution & Natural Selection"]
              },
              {
                title: "AP Statistics",
                icon: <TrendingUp size={20} className="text-amber-500" />,
                topics: ["Exploring Data", "Sampling & Experiments", "Probability & Distributions", "Statistical Inference"]
              },
              {
                title: "AP US History",
                icon: <BookOpen size={20} className="text-rose-500" />,
                topics: ["Periods 1-3 (1491-1800)", "Periods 4-6 (1800-1898)", "Periods 7-9 (1890-Present)", "DBQ & LEQ Writing Strategies"]
              }
            ].map((subject, i) => (
              <div key={i} className="bg-white dark:bg-[#0f1117] border border-border rounded-3xl p-8 hover:shadow-xl hover:border-sapphire/30 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                    {subject.icon}
                  </div>
                  <h3 className="font-bold text-xl text-deep-navy dark:text-white">{subject.title}</h3>
                </div>
                <ul className="space-y-3">
                  {subject.topics.map((topic, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. The StudyHours Framework ────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-black border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">
              04 — The Methodology
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6">
              How We Engineer Your Score.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "Phase 1",
                title: "Diagnostic Gap Analysis",
                desc: "We begin by analyzing a recent test to locate exact conceptual blind spots (e.g., struggling with Thermodynamics vs. Kinetics)."
              },
              {
                step: "Phase 2",
                title: "Rubric-Aligned Drilling",
                desc: "We don't just teach the material. We teach you how to format your answers to trigger the points on the College Board scoring rubric."
              },
              {
                step: "Phase 3",
                title: "Timed Simulations",
                desc: "The biggest hurdle to a 4 or 5 is time management. We run strict, timed FRQ and MCQ sessions to build pacing endurance."
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
                <div className="text-5xl font-black text-emerald-500/10 absolute top-6 right-6">
                  0{i + 1}
                </div>
                <div className="text-sm font-bold text-emerald-500 mb-3">{s.step}</div>
                <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-4">{s.title}</h3>
                <p className="text-text-secondary leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ Section ──────────────────────────────────────────────────────── */}
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
                q: "Is a 5 required to get college credit?",
                a: "Not necessarily. Many public and private universities grant credit or advanced standing for scores of 3 or 4. However, highly selective elite universities often require a 4 or 5 to exempt you from introductory courses."
              },
              {
                q: "When should we start AP tutoring?",
                a: "If a student is struggling in the class, start immediately to protect their GPA. If they have an 'A' in the class but want to prepare for the May exam, we recommend starting a structured 8-12 week prep program in February."
              },
              {
                q: "How is AP tutoring different from regular subject tutoring?",
                a: "Regular tutoring focuses on passing the teacher's next quiz. AP tutoring focuses on the College Board's standardized May exam. We teach students how to write specifically to the AP rubrics, which regular teachers often don't have time to cover in depth."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-white dark:bg-black border border-border rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg text-deep-navy dark:text-white">
                  {faq.q}
                  <span className="text-emerald-500 group-open:rotate-90 transition-transform">→</span>
                </summary>
                <div className="px-6 pb-6 text-text-secondary leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Final CTA ────────────────────────────────────────────────── */}
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
              Secure Your <br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-sapphire">College Credit.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              Don't leave your AP scores to chance. Get matched with a specialist who will deconstruct the rubric and train you for the digital format.
            </p>
            
            <Link 
              href={ctaHref} 
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-black rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] text-lg group"
            >
              Start AP Prep
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
