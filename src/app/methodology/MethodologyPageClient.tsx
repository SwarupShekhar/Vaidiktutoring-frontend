"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  Search,
  Compass,
  LineChart,
  Target,
  ShieldCheck,
  Globe,
  Layers,
  ArrowRight,
  Users,
  Brain,
  TrendingUp,
  Atom,
  Calculator,
  FlaskConical,
  PenTool,
  Palette,
  Infinity as InfinityIcon,
} from "lucide-react";
import Image from "next/image";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../components/subjects/ParentTestimonials";
import StickyCTA from "../components/subjects/StickyCTA";

export default function MethodologyPage() {
  const { user } = useAuthContext();

  return (
    <main className="min-h-screen bg-background transition-colors duration-500 relative">
      {/* Sticky Action Bar */}
      <StickyCTA />

      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-linear-to-b from-ice-blue to-transparent rounded-full blur-[120px]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ice-blue/50 border border-powder-blue text-xs font-bold tracking-widest text-sapphire mb-8 shadow-sm uppercase">
              <ShieldCheck size={16} className="animate-pulse" />
              Verified Learning Model
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-deep-navy dark:text-white mb-6 tracking-tight leading-[1.05] uppercase italic transition-all duration-500">
              Expert-Guided Learning, <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-sapphire to-blue-400 pr-2">
                Powered by AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed mb-10 font-medium font-outfit max-w-xl">
              Our learning model combines highly trained subject specialists with
              AI-powered assessment tools to deliver personalized, measurable
              learning outcomes.
            </p>
            <Link
              href={user ? "/experts" : "/signup"}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-sapphire transition-all shadow-lg"
            >
              Get Started <ArrowRight size={20} />
            </Link>
          </motion.div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative aspect-4/3 rounded-4xl overflow-hidden shadow-2xl border border-border z-10"
            >
              <Image
                src="https://res.cloudinary.com/de8vvmpip/image/upload/v1774268693/Candid_photography_of_202603231754-Photoroom_uweihq.png"
                alt="Online tutor using AI-assisted feedback tools to guide a student"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-deep-navy/20 to-transparent" />
            </motion.div>

            {/* Academic Doodles */}
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 z-20 text-sapphire/30 dark:text-sapphire/40 hidden md:block"
            >
              <Atom size={48} strokeWidth={1.5} />
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 -left-12 z-20 text-primary/30 hidden md:block"
            >
              <Calculator size={40} strokeWidth={1.5} />
            </motion.div>

            <motion.div
              animate={{ x: [0, 15, 0], rotate: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-8 -left-2 z-20 text-sapphire/30 hidden md:block"
            >
              <FlaskConical size={44} strokeWidth={1.5} />
            </motion.div>

            <motion.div
              animate={{ y: [-10, 10, -10], rotate: [5, -5, 5] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 right-1/4 z-20 text-primary/20 hidden md:block"
            >
              <PenTool size={36} strokeWidth={1.5} />
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 20, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 -right-8 z-20 text-sapphire/30 hidden md:block"
            >
              <Brain size={52} strokeWidth={1.5} />
            </motion.div>

            <motion.div
              animate={{ x: [-10, 10, -10], y: [0, 10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 -right-12 z-20 text-primary/30 hidden md:block"
            >
              <Globe size={40} strokeWidth={1.5} />
            </motion.div>

            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-10 right-10 z-20 text-sapphire/20 hidden md:block"
            >
              <InfinityIcon size={36} strokeWidth={1.5} />
            </motion.div>

            <motion.div
              animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="absolute top-1/4 -right-6 z-20 text-sapphire/20 hidden md:block shadow-2xl"
            >
              <Palette size={32} strokeWidth={1.5} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Teaching Philosophy (Core Value) */}
      <section className="py-24 px-6 bg-surface border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-deep-navy dark:text-white mb-4">
                How We Teach
              </h2>
              <div className="w-20 h-1.5 bg-sapphire mx-auto rounded-full"></div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Expert-Led */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group p-8 rounded-[2.5rem] bg-background border border-border shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="mb-8 relative">
                <div className="w-20 h-20 rounded-4xl bg-surface dark:bg-surface/5 border border-border flex items-center justify-center text-sapphire shadow-sm group-hover:scale-110 group-hover:bg-sapphire group-hover:text-white transition-all duration-700">
                  <Users size={36} strokeWidth={1} />
                </div>
                <div className="absolute -inset-2 bg-sapphire/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
              </div>
              <h3 className="text-2xl font-bold text-deep-navy dark:text-white mb-4">
                Expert-Led Instruction
              </h3>
              <p className="text-(--color-text-primary) leading-relaxed font-medium">
                Sessions are led by trained subject specialists who follow
                structured, curriculum-aligned lesson plans designed for your
                child's specific system.
              </p>
            </motion.div>

            {/* Pillar 2: AI Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-[2.5rem] bg-background border-2 border-sapphire shadow-2xl relative hover:-translate-y-2 transition-all duration-500 scale-105 z-20"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-sapphire px-4 py-1.5 rounded-full shadow-lg">
                  Unique Method
                </span>
              </div>
              <div className="mb-8 relative">
                <div className="w-20 h-20 rounded-4xl bg-surface dark:bg-surface/5 border border-border flex items-center justify-center text-sapphire shadow-sm group-hover:scale-110 group-hover:bg-sapphire group-hover:text-white transition-all duration-700">
                  <Brain size={36} strokeWidth={1} />
                </div>
                <div className="absolute -inset-2 bg-sapphire/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
              </div>
              <h3 className="text-2xl font-bold text-deep-navy dark:text-white mb-4">
                AI-Assisted Feedback
              </h3>
              <p className="text-(--color-text-primary) leading-relaxed font-medium">
                Every session is analyzed to provide objective insights on
                fluency, confidence, and clarity, ensuring no learning gap goes
                unnoticed.
              </p>
            </motion.div>

            {/* Pillar 3: Outcome-Based */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group p-8 rounded-[2.5rem] bg-background border border-border shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="mb-8 relative">
                <div className="w-20 h-20 rounded-4xl bg-surface dark:bg-surface/5 border border-border flex items-center justify-center text-sapphire shadow-sm group-hover:scale-110 group-hover:bg-sapphire group-hover:text-white transition-all duration-700">
                  <TrendingUp size={36} strokeWidth={1} />
                </div>
                <div className="absolute -inset-2 bg-sapphire/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
              </div>
              <h3 className="text-2xl font-bold text-deep-navy dark:text-white mb-4">
                Outcome-Based Learning
              </h3>
              <p className="text-(--color-text-primary) leading-relaxed font-medium">
                Progress is measured through consistent practice and assessment,
                building a clear record of academic growth over time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: Expert Differentiation (What Sets Us Apart) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-deep-navy dark:text-white mb-4">
            What Sets Our Experts Apart
          </h2>
          <p className="text-text-secondary text-lg">
            We don't just find tutors; we build education specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <ExpertCard
            icon={Globe}
            title="Curriculum Alignment"
            description="Trained to teach across US (Common Core), UK (National), and International (IB) frameworks."
            delay={0}
          />

          {/* Card 2 */}
          <ExpertCard
            icon={Layers}
            title="Structured Pedagogy"
            description="Follow proven instructional models rather than ad-hoc tutoring, ensuring consistent session quality."
            delay={0.1}
          />

          {/* Card 3 */}
          <ExpertCard
            icon={Target}
            title="Data-Informed"
            description="Using AI insights to refine lesson delivery and provide hyper-targeted student support."
            delay={0.2}
          />

          {/* Card 4 */}
          <ExpertCard
            icon={Compass}
            title="Student-Centered"
            description="Adapt communication style to suit each learner’s unique pace and psychological needs."
            delay={0.3}
          />
        </div>
      </section>

      {/* Section 4: Delivery Model (Process) - THEME AWARE & REFINED */}
      <section className="py-24 px-6 bg-background dark:bg-[#000926] transition-colors duration-500 overflow-hidden relative border-y border-border dark:border-white/5">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-20 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-sapphire/20 dark:bg-blue-600 rounded-full blur-[140px]" />
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-sapphire/10 dark:bg-blue-400 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-extrabold mb-6 text-deep-navy dark:text-white"
            >
              How Experts Work With Your Child
            </motion.h2>
            <p className="text-text-secondary dark:text-blue-200 text-lg max-w-2xl mx-auto font-medium">
              A data-driven methodology that ensures every minute of learning
              counts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[32px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-border dark:border-white/10 z-0" />

            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative text-center md:text-left z-10"
            >
              <div className="flex items-center gap-6 mb-8 justify-center md:justify-start">
                <div className="w-16 h-16 rounded-2xl bg-surface dark:bg-white/10 backdrop-blur-xl flex items-center justify-center text-sapphire dark:text-blue-400 border border-border dark:border-white/20 shadow-xl dark:shadow-2xl">
                  <Search size={32} />
                </div>
                <div className="text-5xl font-black text-sapphire/10 dark:text-white/10">
                  01
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-deep-navy dark:text-white">
                Step 1 - Diagnose
              </h3>
              <p className="text-(--color-text-primary) dark:text-blue-100/80 leading-relaxed text-lg font-medium opacity-90">
                Initial diagnostic assessment to understand strengths, identify
                curriculum gaps, and establish a clear academic baseline.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative text-center md:text-left z-10"
            >
              <div className="flex items-center gap-6 mb-8 justify-center md:justify-start">
                <div className="w-16 h-16 rounded-2xl bg-surface dark:bg-white/10 backdrop-blur-xl flex items-center justify-center text-sapphire dark:text-blue-400 border border-border dark:border-white/20 shadow-xl dark:shadow-2xl ring-4 ring-sapphire/10 dark:ring-blue-500/20">
                  <Zap size={32} />
                </div>
                <div className="text-5xl font-black text-sapphire/10 dark:text-white/10">
                  02
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-deep-navy dark:text-white font-outfit">
                Step 2 - Guide
              </h3>
              <p className="text-(--color-text-primary) dark:text-blue-100/80 leading-relaxed text-lg font-medium opacity-90">
                Live expert instruction aligned with the student’s curriculum,
                focused on active recall, conceptual depth, and confidence.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative text-center md:text-left z-10"
            >
              <div className="flex items-center gap-6 mb-8 justify-center md:justify-start">
                <div className="w-16 h-16 rounded-2xl bg-surface dark:bg-white/10 backdrop-blur-xl flex items-center justify-center text-sapphire dark:text-blue-400 border border-border dark:border-white/20 shadow-xl dark:shadow-2xl">
                  <LineChart size={32} />
                </div>
                <div className="text-5xl font-black text-sapphire/10 dark:text-white/10">
                  03
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-deep-navy dark:text-white">
                Step 3 - Measure
              </h3>
              <p className="text-(--color-text-primary) dark:text-blue-100/80 leading-relaxed text-lg font-medium opacity-90">
                AI-powered analytics track every response to report improvement
                and inform precise next steps for the tutor.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 5: Credibility & Testimonials - IMPROVED CONTRAST */}
      <section className="py-24 bg-surface/50">
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-3xl border border-border bg-background shadow-sm"
            >
              <p className="text-sm font-bold text-sapphire uppercase tracking-widest mb-4">
                Global Trust
              </p>
              <p className="text-xl font-bold text-(--color-text-primary) leading-tight">
                Trusted by parents across multiple countries
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl border border-border bg-background shadow-sm"
            >
              <p className="text-sm font-bold text-sapphire uppercase tracking-widest mb-4">
                Standardized
              </p>
              <p className="text-xl font-bold text-(--color-text-primary) leading-tight">
                Aligned with global curricula frameworks
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-3xl border border-border bg-background shadow-sm"
            >
              <p className="text-sm font-bold text-sapphire uppercase tracking-widest mb-4">
                Verified
              </p>
              <p className="text-xl font-bold text-(--color-text-primary) leading-tight">
                Backed by AI-driven assessment tools
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-3xl border border-border bg-background shadow-sm"
            >
              <p className="text-sm font-bold text-sapphire uppercase tracking-widest mb-4">
                Scientific
              </p>
              <p className="text-xl font-bold text-(--color-text-primary) leading-tight">
                Designed by educators and technologists
              </p>
            </motion.div>
          </div>
        </div>

        <ParentTestimonials />
      </section>

      {/* Section 6: CTA (Conversion) */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-center border-t border-border">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-deep-navy dark:text-white mb-12">
            Ready to witness a better <br className="hidden md:block" /> way of
            learning?
          </h2>

          <div className="flex flex-col items-center gap-6">
            <Link
              href={user ? "/students/dashboard" : "/signup"}
              className="inline-flex items-center justify-center px-12 py-5 rounded-full bg-primary text-white font-bold text-xl hover:bg-sapphire hover:scale-105 transition-all shadow-xl shadow-blue-500/30 gap-3"
            >
              Book a Free Learning Assessment
              <ArrowRight size={24} />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

// Sub-components with animation logic
function ExpertCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group p-8 rounded-3xl bg-surface border border-border hover:border-sapphire/50 transition-all duration-300"
    >
      <div className="w-12 h-12 bg-ice-blue rounded-xl flex items-center justify-center text-sapphire mb-6 group-hover:bg-sapphire group-hover:text-white transition-colors">
        <Icon size={24} />
      </div>
      <h4 className="text-lg font-bold text-deep-navy dark:text-white mb-2">
        {title}
      </h4>
      <p className="text-sm text-text-secondary dark:text-blue-100/60 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
