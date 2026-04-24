"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../../components/subjects/ParentTestimonials";
import StickyCTA from "../../components/subjects/StickyCTA";
import SubjectFAQ from "../../components/subjects/SubjectFAQ";
import { CheckCircle2, ArrowRight, BookOpen, FlaskConical, Calculator, Atom } from "lucide-react";

type FAQItemType = { q: string; a: string };

interface Props {
  testimonials: { text: string; author: string; role: string; rating: number }[];
  faqs: FAQItemType[];
}

const fadeUp = {
  hidden: { opacity: 1, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const curricula = [
  { name: "IGCSE", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  { name: "IB Diploma", color: "bg-violet-500/10 text-violet-600 border-violet-200" },
  { name: "A-Level", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
  { name: "MOE UAE", color: "bg-red-500/10 text-red-600 border-red-200" },
  { name: "AP", color: "bg-amber-500/10 text-amber-600 border-amber-200" },
  { name: "CBSE", color: "bg-teal-500/10 text-teal-600 border-teal-200" },
];

const physicsTopics = [
  "Mechanics & Motion",
  "Electricity & Magnetism",
  "Waves & Optics",
  "Thermal Physics",
  "Nuclear & Atomic Physics",
  "Fields (Gravitational, Electric, Magnetic)",
  "Practical & Alternative to Practical",
  "EmSAT Physics Preparation",
];

const mathsTopics = [
  "Algebra & Functions",
  "Calculus (Differentiation & Integration)",
  "Trigonometry & Vectors",
  "Statistics & Probability",
  "Further Pure Mathematics",
  "Mechanics (Applied Maths)",
  "IB Internal Assessment (IA)",
  "EmSAT Mathematics Preparation",
];

const steps = [
  {
    number: "01",
    title: "Sign Up Free",
    description:
      "Create your account in under 2 minutes. Tell us your child's curriculum, year group, and target exam.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Book Free Session",
    description:
      "Reserve your complimentary first session. No payment required. See the tutor quality before committing.",
    icon: Calculator,
  },
  {
    number: "03",
    title: "Get Matched in 15 min–1 hr",
    description:
      "We match you with a physics and maths specialist who knows your exact exam board and school assessment style.",
    icon: Atom,
  },
];

export default function PhysicsMathsTutorPageClient({ testimonials, faqs }: Props) {
  const { user } = useAuthContext();
  const ctaHref = user ? "/bookings/new" : "/signup?type=assessment";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <StickyCTA />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center text-white pt-32 pb-24 px-4 overflow-hidden bg-deep-navy">
        <div className="absolute inset-0 z-0">
          {/* Placeholder background — replace with actual image */}
          <div className="absolute inset-0 bg-gradient-to-br from-deep-navy via-sapphire/40 to-deep-navy" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[10px] font-black mb-6 tracking-[0.2em] uppercase text-white/90 backdrop-blur-md"
          >
            <span>🇦🇪</span> UAE · IGCSE · IB · A-Level · MOE UAE · AP
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{
              ...fadeUp,
              visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.1 } },
            }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[0.95] uppercase drop-shadow-2xl text-white"
          >
            Physics and Maths{" "}
            <span className="text-ice-blue underline decoration-primary/30 underline-offset-8">
              Tutor in UAE
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={{
              ...fadeUp,
              visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.2 } },
            }}
            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10 font-medium leading-relaxed"
          >
            Online physics and maths tutors for every UAE curriculum — IGCSE, IB Diploma, A-Level,
            MOE UAE, and AP. Book a free trial session and get matched with a specialist in 15
            minutes.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              ...fadeUp,
              visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.3 } },
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-white font-black text-sm tracking-wide hover:bg-sapphire hover:scale-105 transition-all shadow-xl shadow-blue-500/30"
            >
              Book Free Session
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-all"
            >
              How It Works
            </a>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-10 px-4 bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { stat: "500+", label: "Physics & Maths Tutors" },
            { stat: "94%", label: "Grade Improvement Rate" },
            { stat: "15 min–1 hr", label: "Tutor Match Time" },
          ].map((item) => (
            <div key={item.stat} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-black text-deep-navy dark:text-white">{item.stat}</span>
              <span className="text-sm text-text-secondary font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum Strip */}
      <section className="py-10 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-6">
            Curricula Covered
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {curricula.map((c) => (
              <span
                key={c.name}
                className={`px-4 py-2 rounded-full border text-xs font-black uppercase tracking-wider ${c.color}`}
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-surface relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">
              How It Works
            </h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-text-secondary max-w-2xl mx-auto font-medium">
              From signup to first session in under an hour.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    ...fadeUp,
                    visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.15 } },
                  }}
                  className="group relative rounded-[3rem] p-1 bg-linear-to-br from-border/50 to-transparent hover:from-sapphire/20 transition-all duration-700 shadow-2xl"
                >
                  <div className="relative rounded-[2.9rem] p-10 bg-white dark:bg-[#0d1117] h-full flex flex-col">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <Icon size={24} />
                      </div>
                      <span className="text-4xl font-black text-border group-hover:text-primary/20 transition-colors">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-deep-navy dark:text-white mb-3 uppercase tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm text-text-secondary font-medium leading-relaxed">
                      {step.description}
                    </p>
                    <div className="mt-auto pt-8 flex items-center text-primary group-hover:translate-x-2 transition-transform duration-500">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mt-12"
          >
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center px-10 py-5 rounded-full bg-primary text-white font-black text-sm tracking-wide hover:bg-sapphire hover:scale-105 transition-all shadow-xl shadow-blue-500/30"
            >
              Book Free Session Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Subject Coverage */}
      <section className="py-24 px-4 bg-background relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-emerald-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">
              Topics Covered
            </h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-text-secondary max-w-2xl mx-auto font-medium">
              Every topic across every UAE curriculum level — from foundations to university entrance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Physics Column */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group relative rounded-[3rem] p-1 bg-linear-to-br from-border/50 to-transparent hover:from-blue-500/20 transition-all duration-700 shadow-2xl"
            >
              <div className="relative rounded-[2.9rem] p-10 bg-white dark:bg-[#0d1117] h-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                    <Atom size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-deep-navy dark:text-white uppercase tracking-tight">
                      Physics
                    </h3>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                      IGCSE · IB · A-Level · MOE UAE · AP
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {physicsTopics.map((topic) => (
                    <div
                      key={topic}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border hover:border-blue-300 transition-all"
                    >
                      <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                      <span className="text-sm font-bold text-deep-navy dark:text-white">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Maths Column */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                ...fadeUp,
                visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.15 } },
              }}
              className="group relative rounded-[3rem] p-1 bg-linear-to-br from-border/50 to-transparent hover:from-emerald-500/20 transition-all duration-700 shadow-2xl"
            >
              <div className="relative rounded-[2.9rem] p-10 bg-white dark:bg-[#0d1117] h-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                    <Calculator size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-deep-navy dark:text-white uppercase tracking-tight">
                      Mathematics
                    </h3>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      IGCSE · IB AA/AI · A-Level · MOE UAE · AP
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {mathsTopics.map((topic) => (
                    <div
                      key={topic}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border hover:border-emerald-300 transition-all"
                    >
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <span className="text-sm font-bold text-deep-navy dark:text-white">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">
              UAE Parent Results
            </h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </motion.div>
          <ParentTestimonials testimonials={testimonials} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </motion.div>
          <SubjectFAQ items={faqs} />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4 bg-deep-navy text-white text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">
            Ready to Improve Grades?
          </h2>
          <p className="text-white/80 text-lg font-medium mb-10">
            Book your free physics and maths session. Matched with a UAE curriculum specialist in 15
            minutes.
          </p>
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center px-10 py-5 rounded-full bg-primary text-white font-black text-sm tracking-wide hover:bg-sapphire hover:scale-105 transition-all shadow-xl shadow-blue-500/30"
          >
            Book Free Session
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
