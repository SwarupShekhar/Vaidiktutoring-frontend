'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Target, Globe, Layers, Compass, BarChart3, Users, Zap, BrainCircuit, School, Award, Puzzle } from 'lucide-react';
import ParentTestimonials from '../components/subjects/ParentTestimonials';
import StickyCTA from '../components/subjects/StickyCTA';
import { useAuthContext } from '@/app/context/AuthContext';
import Link_Next from 'next/link';

// --- Section 1: Hero ---
const HeroAboutK12 = () => {
    const { user } = useAuthContext();
    return (
        <section className="min-h-[90vh] flex items-center pt-32 pb-24 px-6 relative overflow-hidden bg-gradient-to-b from-[var(--color-ice-blue)] to-[var(--color-background)]">
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-[var(--color-sapphire)]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-blue-300/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                <div className="lg:col-span-7 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-ice-blue)]/80 border border-[var(--color-powder-blue)] text-sm font-bold text-[var(--color-sapphire)] mb-8 shadow-sm">
                            <ShieldCheck size={16} />
                            Our Academic Mission
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[var(--color-deep-navy)] dark:text-white mb-6 tracking-tight leading-[1.1]">
                            Reimagining K–12 <br />
                            <span className="text-[var(--color-sapphire)]">Learning Support</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-10 leading-relaxed font-medium">
                            A structured, outcome-driven tutoring platform that blends expert educators with intelligent learning systems to help students learn deeply, not just perform temporarily.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Link_Next
                                href="/methodology"
                                className="w-full sm:w-auto px-8 py-4 bg-[var(--color-primary)] text-white font-bold rounded-full hover:bg-[var(--color-sapphire)] transition-all shadow-xl shadow-blue-500/20 text-center"
                            >
                                See Our Methodology
                            </Link_Next>
                            <Link_Next
                                href={user ? '/students/dashboard' : '/signup'}
                                className="w-full sm:w-auto px-8 py-4 border-2 border-[var(--color-border)] text-[var(--color-text-primary)] dark:text-white font-bold rounded-full hover:bg-[var(--color-surface)] transition-all text-center"
                            >
                                Book Free Assessment
                            </Link_Next>
                        </div>
                    </motion.div>
                </div>

                <div className="lg:col-span-5 relative hidden lg:block">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10 p-8 rounded-[3rem] bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/20 shadow-2xl">
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700"
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Users size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-2 w-24 bg-slate-100 rounded dark:bg-slate-700 mb-2" />
                                        <motion.div
                                            initial={{ width: "20%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                                            className="h-1.5 bg-blue-50 rounded dark:bg-blue-900/30"
                                        />
                                    </div>
                                </motion.div>
                                <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                    <div className="flex justify-between items-end gap-2 h-20">
                                        {[40, 70, 55, 90, 65].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ delay: 0.8 + (i * 0.1), duration: 0.8, ease: "backOut" }}
                                                className={`w-4 rounded-t ${h === 90 ? 'bg-[var(--color-sapphire)] shadow-[0_0_15px_rgba(31,75,255,0.3)]' : 'bg-blue-200 dark:bg-blue-800/40'}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Measurable Outcomes</div>
                                </div>
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="flex items-center justify-center p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-[var(--color-sapphire)] text-white shadow-lg"
                                >
                                    <BrainCircuit size={40} className="animate-pulse" />
                                </motion.div>
                            </div>
                        </div>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-10 -right-10 w-40 h-40 border-2 border-blue-500/20 rounded-full border-dashed"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-10 -left-10 w-32 h-32 border-2 border-sapphire-500/20 rounded-full border-dashed"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// --- Section 2: Why We Exist ---
const PurposeSection = () => {
    return (
        <section className="py-24 px-6 relative overflow-hidden text-[var(--color-text-primary)]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="order-2 lg:order-1"
                >
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--color-deep-navy)] dark:text-white mb-8">
                        Why We Exist
                    </h2>
                    <div className="space-y-6 text-lg font-medium leading-relaxed dark:text-slate-300">
                        <p>
                            Traditional tutoring often focuses on short-term help with homework or exams, rather than long-term understanding. This "patchwork" approach helps students pass the next test but fails to build the conceptual foundation needed for advanced mastery.
                        </p>
                        <p>
                            We exist to change that by creating a learning system that is <span className="text-[var(--color-sapphire)] font-bold">structured, measurable, and aligned</span> with how students actually learn across different subjects and school curricula.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="order-1 lg:order-2 relative"
                >
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center p-12">
                        <div className="relative w-full h-full flex items-center justify-center">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full"
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="w-full max-w-sm p-6 rounded-2xl bg-white shadow-xl dark:bg-slate-700 relative z-10"
                            >
                                <div className="h-4 w-3/4 bg-slate-100 rounded dark:bg-slate-600 mb-4" />
                                <div className="space-y-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "100%" }}
                                        transition={{ duration: 1, delay: 0.6 }}
                                        className="h-2 bg-blue-50 rounded dark:bg-blue-900/20"
                                    />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "80%" }}
                                        transition={{ duration: 1, delay: 0.8 }}
                                        className="h-2 bg-blue-50 rounded dark:bg-blue-900/20"
                                    />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "90%" }}
                                        transition={{ duration: 1, delay: 1 }}
                                        className="h-2 bg-blue-100 rounded dark:bg-blue-400/20"
                                    />
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white"
                                    >
                                        <Zap size={20} />
                                    </motion.div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 0.8, scale: 1 }}
                                transition={{ delay: 1.2 }}
                                className="absolute -bottom-4 -right-4 w-48 p-4 rounded-xl bg-slate-900 text-white shadow-2xl text-[10px] font-mono backdrop-blur-md"
                            >
                                <div className="text-blue-400 mb-1">&gt; ANALYZING_GAP</div>
                                <div className="flex gap-1 mb-2">
                                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="h-1 w-2 bg-blue-500 rounded" />
                                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-1 w-4 bg-blue-500 rounded" />
                                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-1 w-1 bg-blue-500 rounded" />
                                </div>
                                <div>CONCEPTUAL_DEPTH: 88%</div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// --- Section 3: What's Broken ---
const ProblemWithTutoring = () => {
    const problems = [
        {
            icon: Users,
            title: "Inconsistent Quality",
            description: "Traditional tutoring relies heavily on individual luck. Some tutors are great, others lack structured pedagogical training."
        },
        {
            icon: BarChart3,
            title: "No Real Measurement",
            description: "Progress is often subjective. Parents rarely get data-driven insights into exactly where their child stands."
        },
        {
            icon: Layers,
            title: "One-Size-Fits-All",
            description: "Mass-market platforms often push generic content instead of aligning with the student's specific school curriculum."
        }
    ];

    return (
        <section className="py-24 px-6 bg-[var(--color-surface)] border-y border-[var(--color-border)] dark:border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-deep-navy)] dark:text-white mb-4">
                        What’s Broken in Traditional Tutoring
                    </h2>
                    <div className="w-20 h-1.5 bg-red-400 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {problems.map((prob, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            whileHover={{ y: -8 }}
                            className="p-8 rounded-[2rem] bg-[var(--color-background)] dark:bg-slate-900/60 backdrop-blur-xl border border-[var(--color-border)] dark:border-white/10 shadow-sm hover:shadow-2xl transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                                <prob.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--color-deep-navy)] dark:text-white mb-4">{prob.title}</h3>
                            <p className="text-[var(--color-text-secondary)] dark:text-slate-400 leading-relaxed font-medium">
                                {prob.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Section 4: Differentiation ---
const DifferentiationSection = () => {
    const pillars = [
        {
            icon: Users,
            title: "Expert-Guided Learning",
            description: "Trained educators, following structured pedagogy and curriculum standards to ensure every session is productive."
        },
        {
            icon: BrainCircuit,
            title: "System + Human Hybrid",
            description: "Advanced AI analytics provide objective data, while human experts provide the judgment, mentorship, and emotional support."
        },
        {
            icon: Target,
            title: "Outcome-Focused Design",
            description: "Every session is designed around measurable checkpoints to ensure students are actually learning and retaining knowledge."
        }
    ];

    return (
        <section className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--color-deep-navy)] dark:text-white mb-6">
                        How We Are Different
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto font-medium">
                        We don't just facilitate tutoring; we engineer learning experiences that stick.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {pillars.map((pillar, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-[var(--color-background)] dark:bg-slate-900/40 p-10 rounded-[2.5rem] border border-[var(--color-border)] dark:border-white/10 shadow-sm hover:shadow-2xl transition-all relative"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-var(--color-ice-blue) dark:bg-blue-900/20 flex items-center justify-center text-[var(--color-sapphire)] mb-8">
                                <pillar.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--color-deep-navy)] dark:text-white mb-4">{pillar.title}</h3>
                            <p className="text-[var(--color-text-primary)] dark:text-slate-300 leading-relaxed font-medium">
                                {pillar.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
            <div className="absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-[var(--color-border)] dark:border-white/5 -z-10" />
        </section>
    );
};

// --- Section 5: Global Curriculum ---
const GlobalCurriculumSection = () => {
    const items = [
        { icon: Globe, text: "Works across major curricula (US, UK, IB, etc.)" },
        { icon: School, text: "Adaptable to different school systems" },
        { icon: Puzzle, text: "Supports diverse learning styles" },
        { icon: Award, text: "Built for remediation + advanced learners" }
    ];

    return (
        <section className="py-24 px-6 bg-gradient-to-r from-[var(--color-ice-blue)]/50 to-white dark:from-slate-900 dark:to-slate-800 border-y border-[var(--color-border)] dark:border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-4 p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-sm"
                        >
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-powder-blue)] dark:bg-blue-900/30 flex items-center justify-center text-[var(--color-sapphire)]">
                                <item.icon size={20} />
                            </div>
                            <span className="text-sm font-bold text-[var(--color-deep-navy)] dark:text-slate-200">{item.text}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Section 6: Brand Section ---
const BrandSection = () => {
    return (
        <section className="py-24 px-6 text-center bg-[var(--color-background)] dark:bg-[#000926]/40">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-deep-navy)] dark:text-white mb-8">
                        About the Platform
                    </h2>
                    <p className="text-xl text-[var(--color-text-secondary)] dark:text-slate-400 leading-relaxed font-medium">
                        This platform is developed by a team of educators, engineers, and learning designers who believe that technology should enhance, not replace, great teaching. We are committed to building tools that empower both students and tutors to reach their highest potential.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

// --- Section 8: Vision Section ---
const VisionSection = () => {
    return (
        <section className="py-24 px-6 text-center bg-[var(--color-ice-blue)]/30 dark:bg-[#000926] text-[var(--color-text-primary)] dark:text-white relative overflow-hidden border-y border-[var(--color-border)] dark:border-white/5">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--color-sapphire)] to-transparent animate-pulse" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-8 text-[var(--color-deep-navy)] dark:text-white">Our Vision</h2>
                    <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] dark:text-blue-100 font-medium leading-relaxed opacity-90">
                        We aim to create a future where every student, regardless of location or background, has access to high-quality, structured, and personalized learning support.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

// --- Section 9: Final CTA ---
const FinalCTA = () => {
    const { user } = useAuthContext();
    return (
        <section className="py-24 px-6 text-center border-t border-[var(--color-border)] dark:border-white/5 bg-[var(--color-background)] dark:bg-[#000926]/60">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
            >
                <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--color-deep-navy)] dark:text-white mb-12">
                    Ready to Start Your <br className="hidden md:block" /> Learning Journey?
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link_Next
                        href={user ? '/students/dashboard' : '/signup'}
                        className="w-full sm:w-auto px-12 py-5 bg-[var(--color-primary)] text-white font-bold text-xl rounded-full hover:bg-[var(--color-sapphire)] transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3"
                    >
                        Book a Free Learning Assessment
                        <ArrowRight size={24} />
                    </Link_Next>
                    <Link_Next
                        href="/methodology"
                        className="text-lg font-bold text-[var(--color-sapphire)] hover:underline flex items-center gap-2"
                    >
                        Explore Our Methodology
                        <ArrowRight size={20} />
                    </Link_Next>
                </div>
            </motion.div>
        </section>
    );
};

// --- Main Page Component ---
export default function AboutPage() {
    return (
        <main className="bg-[var(--color-background)]">
            <StickyCTA />
            <HeroAboutK12 />
            <PurposeSection />
            <ProblemWithTutoring />
            <DifferentiationSection />
            <GlobalCurriculumSection />
            <BrandSection />
            <ParentTestimonials />
            <VisionSection />
            <FinalCTA />
        </main>
    );
}
