'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Target, Globe, Layers, Compass, BarChart3, Users, Zap, BrainCircuit, School, Award, Puzzle, Atom, Pi, BookOpen, Microscope, Book, Pencil, Calculator, Palette, Divide } from 'lucide-react';
import ParentTestimonials from '../components/subjects/ParentTestimonials';
import StickyCTA from '../components/subjects/StickyCTA';
import { useAuthContext } from '@/app/context/AuthContext';
import Link_Next from 'next/link';
import Image from 'next/image';

// --- Section 1: Hero ---
const HeroAboutK12 = () => {
    const { user } = useAuthContext();
    return (
        <section className="min-h-[90vh] flex items-center pt-32 pb-24 px-6 relative overflow-hidden bg-linear-to-b from-ice-blue to-background dark:from-slate-900/50 dark:to-background">
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-sapphire/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-blue-300/10 rounded-full blur-[120px]" />
            </div>



            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                <div className="lg:col-span-7 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ice-blue/80 border border-powder-blue text-sm font-bold text-sapphire mb-8 shadow-sm">
                            <ShieldCheck size={16} />
                            Our Academic Mission
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-deep-navy dark:text-white mb-6 tracking-tight leading-[1.1]">
                            Reimagining K–12 <br />
                            <span className="text-sapphire">Learning Support</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-text-secondary mb-10 leading-relaxed font-medium">
                            A structured, outcome-driven tutoring platform that blends expert educators with intelligent learning systems to help students learn deeply, not just perform temporarily.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Link_Next
                                href="/methodology"
                                className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-sapphire transition-all shadow-xl shadow-blue-500/20 text-center"
                            >
                                See Our Methodology
                            </Link_Next>
                            <Link_Next
                                href={user ? '/students/dashboard' : '/signup'}
                                className="w-full sm:w-auto px-8 py-4 border-2 border-border text-(--color-text-primary) dark:text-white font-bold rounded-full hover:bg-surface transition-all text-center"
                            >
                                Book Free Assessment
                            </Link_Next>
                        </div>
                    </motion.div>
                </div>

                <div className="lg:col-span-5 relative hidden lg:block">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative aspect-square lg:aspect-auto lg:h-[520px] w-full flex items-center justify-center"
                    >
                        {/* Student Photo - Primary Element */}
                        <div className="absolute inset-0 z-0">
                            <Image 
                                src="https://res.cloudinary.com/de8vvmpip/image/upload/v1774247081/Candid_photography_of_202603231154-Photoroom_wf0fd2.png" 
                                alt="Expert K-12 Student Scholar | StudyHours" 
                                fill 
                                className="object-contain object-center drop-shadow-2xl"
                                priority
                            />
                            {/* Academic Doodles - Clustered around Student */}
                            <div className="absolute inset-0 z-10 pointer-events-none opacity-40 dark:opacity-60">
                                <motion.div animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-12 left-1/4 text-sapphire">
                                    <Pi size={40} strokeWidth={1} />
                                </motion.div>
                                <motion.div animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 0.3 }} className="absolute top-10 -right-4 text-primary">
                                    <Atom size={44} strokeWidth={1} />
                                </motion.div>
                                <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 0.6 }} className="absolute top-1/2 -left-12 text-sapphire">
                                    <BookOpen size={32} strokeWidth={1} />
                                </motion.div>
                                <motion.div animate={{ y: [0, -12, 0], scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity, delay: 0.9 }} className="absolute -top-16 right-1/4 text-indigo-400">
                                    <Microscope size={38} strokeWidth={1} />
                                </motion.div>
                                <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-20 -left-6 text-cyan-500">
                                    <Calculator size={34} strokeWidth={1.5} />
                                </motion.div>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-4 right-12 text-emerald-400/50">
                                    <Palette size={40} strokeWidth={1} />
                                </motion.div>
                                <motion.div animate={{ y: [0, -15, 0], x: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 0.5 }} className="absolute bottom-1/3 -right-12 text-amber-500">
                                    <Pencil size={30} strokeWidth={1.5} />
                                </motion.div>
                                <motion.div animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, 360] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute -top-8 left-1/2 text-rose-400">
                                    <Divide size={28} strokeWidth={2} />
                                </motion.div>
                            </div>
                            {/* Soft Fade on Left Edge for Background Blending */}
                            <div className="absolute inset-y-0 -left-1 w-1/3 bg-linear-to-r from-background via-transparent to-transparent z-10" />
                            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-background via-transparent to-transparent z-10" />
                        </div>

                        {/* Metrics Card - 40% Smaller (scale-60), Bottom Left Position */}
                        <motion.div
                            initial={{ opacity: 0, x: -30, y: 30 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="absolute bottom-10 -left-12 z-20 scale-[0.6] origin-bottom-left"
                        >
                            <div className="p-8 rounded-[3rem] bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface/50 border border-border dark:bg-slate-800/80">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Users size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-2 w-24 bg-slate-100 rounded dark:bg-slate-700 mb-2" />
                                            <motion.div
                                                initial={{ width: "20%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                                                className="h-1.5 bg-blue-500 rounded"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-surface/50 border border-border dark:bg-slate-800/80">
                                        <div className="flex justify-between items-end gap-2 h-20">
                                            {[40, 70, 55, 90, 65].map((h, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ delay: 0.8 + (i * 0.1), duration: 0.8, ease: "backOut" }}
                                                    className={`w-4 rounded-t ${h === 90 ? 'bg-sapphire shadow-[0_0_15px_rgba(31,75,255,0.3)]' : 'bg-blue-400 dark:bg-blue-800'}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Measurable Outcomes</div>
                                    </div>
                                    <div className="flex items-center justify-center p-6 rounded-2xl bg-linear-to-r from-blue-600 to-sapphire text-white shadow-lg">
                                        <BrainCircuit size={40} className="animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Decorative Radial Accents */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-sapphire/5 rounded-full blur-[100px] -z-10" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// --- Section 2: Why We Exist ---
const PurposeSection = () => {
    return (
        <section className="py-24 px-6 relative overflow-hidden text-(--color-text-primary)">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="order-2 lg:order-1"
                >
                    <h2 className="text-3xl md:text-5xl font-extrabold text-deep-navy dark:text-white mb-8">
                        Why We Exist
                    </h2>
                    <div className="space-y-6 text-lg font-medium leading-relaxed dark:text-slate-300">
                        <p>
                            Traditional tutoring often focuses on short-term help with homework or exams, rather than long-term understanding. This "patchwork" approach helps students pass the next test but fails to build the conceptual foundation needed for advanced mastery.
                        </p>
                        <p>
                            We exist to change that by creating a learning system that is <span className="text-sapphire font-bold">structured, measurable, and aligned</span> with how students actually learn across different subjects and school curricula.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="order-1 lg:order-2 relative h-[500px] w-full flex items-center justify-center p-4 lg:p-0"
                >
                    {/* Tutor Photo - Brand Layer */}
                    <div className="absolute inset-0 z-0 rounded-[3rem] overflow-hidden group">
                        <Image 
                            src="https://res.cloudinary.com/de8vvmpip/image/upload/v1774247572/Candid_photography_of_202603231201-Photoroom_gd5c4p.png" 
                            alt="Expert World-Class Tutor | StudyHours" 
                            fill 
                            className="object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        {/* Dimensional Blending Gradients */}
                        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10" />
                        <div className="absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-background via-transparent to-transparent z-10" />
                        <div className="absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-background via-transparent to-transparent z-10" />
                        <div className="absolute inset-x-0 top-0 h-1/4 bg-linear-to-b from-background via-transparent to-transparent z-10" />
                    </div>

                    {/* UI Context Card - Repositioned and Scaled down 30% */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileInView={{ opacity: 1, scale: 0.7, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="absolute bottom-4 right-4 z-20 origin-bottom-right drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                    >
                        <div className="w-[420px] p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border border-white/20 shadow-2xl">
                            <div className="relative w-full h-full">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-12 -left-12 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"
                                />
                                <div className="relative z-10">
                                    <div className="h-4 w-3/4 bg-sapphire/10 rounded-full mb-6" />
                                    <div className="space-y-4">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "100%" }}
                                            transition={{ duration: 1, delay: 0.6 }}
                                            className="h-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-full"
                                        />
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "80%" }}
                                            transition={{ duration: 1, delay: 0.8 }}
                                            className="h-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-full"
                                        />
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "90%" }}
                                            transition={{ duration: 1, delay: 1 }}
                                            className="h-2.5 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                        />
                                    </div>
                                    <div className="mt-8 flex justify-between items-center">
                                        <div className="flex gap-1">
                                            {[1,2,3].map(i => (
                                                <div key={i} className="w-6 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                                            ))}
                                        </div>
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className="w-12 h-12 rounded-full bg-linear-to-br from-blue-600 to-sapphire flex items-center justify-center text-white shadow-lg"
                                        >
                                            <Zap size={24} />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Secondary Data Overlay (Floating Bottom Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 0.8, x: 0 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-8 left-8 p-5 rounded-2xl bg-slate-950/90 text-white shadow-2xl text-[11px] font-mono border border-white/10 backdrop-blur-md z-30"
                    >
                        <div className="text-blue-400 mb-2">&gt; CONCEPT_MASTER_ANALYSIS</div>
                        <div className="flex gap-1.5 mb-3">
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} className="h-1.5 w-3 bg-blue-500 rounded-full" />
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="h-1.5 w-6 bg-blue-500 rounded-full" />
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="h-1.5 w-2 bg-blue-500 rounded-full" />
                        </div>
                        <div className="font-bold tracking-wider">RETENTION_RATE: 94.2%</div>
                    </motion.div>
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
        <section className="py-24 px-6 bg-surface border-y border-border dark:border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-deep-navy dark:text-white mb-4">
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
                            className="p-8 rounded-4xl bg-background dark:bg-slate-900/60 backdrop-blur-xl border border-border dark:border-white/10 shadow-sm hover:shadow-2xl transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                                <prob.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-deep-navy dark:text-white mb-4">{prob.title}</h3>
                            <p className="text-text-secondary dark:text-slate-400 leading-relaxed font-medium">
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
                    <h2 className="text-3xl md:text-5xl font-extrabold text-deep-navy dark:text-white mb-6">
                        How We Are Different
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto font-medium">
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
                            className="bg-background dark:bg-slate-900/40 p-10 rounded-[2.5rem] border border-border dark:border-white/10 shadow-sm hover:shadow-2xl transition-all relative"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-ice-blue dark:bg-blue-900/20 flex items-center justify-center text-sapphire mb-8">
                                <pillar.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-deep-navy dark:text-white mb-4">{pillar.title}</h3>
                            <p className="text-(--color-text-primary) dark:text-slate-300 leading-relaxed font-medium">
                                {pillar.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
            <div className="absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-border dark:border-white/5 -z-10" />
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
        <section className="py-24 px-6 bg-linear-to-r from-ice-blue/50 to-white dark:from-slate-900 dark:to-slate-800 border-y border-border dark:border-white/5">
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
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-powder-blue dark:bg-blue-900/30 flex items-center justify-center text-sapphire">
                                <item.icon size={20} />
                            </div>
                            <span className="text-sm font-bold text-deep-navy dark:text-slate-200">{item.text}</span>
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
        <section className="py-24 px-6 text-center bg-background dark:bg-[#000926]/40">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-deep-navy dark:text-white mb-8">
                        About the Platform
                    </h2>
                    <p className="text-xl text-text-secondary dark:text-slate-400 leading-relaxed font-medium">
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
        <section className="py-24 px-6 text-center bg-ice-blue/30 dark:bg-[#000926] text-(--color-text-primary) dark:text-white relative overflow-hidden border-y border-border dark:border-white/5">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-sapphire to-transparent animate-pulse" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-8 text-deep-navy dark:text-white">Our Vision</h2>
                    <p className="text-xl md:text-2xl text-text-secondary dark:text-blue-100 font-medium leading-relaxed opacity-90">
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
        <section className="py-24 px-6 text-center border-t border-border dark:border-white/5 bg-background dark:bg-[#000926]/60">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
            >
                <h2 className="text-3xl md:text-5xl font-extrabold text-deep-navy dark:text-white mb-12">
                    Ready to Start Your <br className="hidden md:block" /> Learning Journey?
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link_Next
                        href={user ? '/students/dashboard' : '/signup'}
                        className="w-full sm:w-auto px-12 py-5 bg-primary text-white font-bold text-xl rounded-full hover:bg-sapphire transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3"
                    >
                        Book a Free Learning Assessment
                        <ArrowRight size={24} />
                    </Link_Next>
                    <Link_Next
                        href="/methodology"
                        className="text-lg font-bold text-sapphire hover:underline flex items-center gap-2"
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
        <main className="bg-background">
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
