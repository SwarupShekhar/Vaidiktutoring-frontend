'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import FadeUpSection from './FadeUpSection';
import HighImpactThreePillars from './HighImpactThreePillars';

export default function ShiftSection() {
    return (
        <section className="py-32 bg-background overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    <div className="lg:w-1/2">
                        <FadeUpSection>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Our Difference</span>
                            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-8 leading-[0.9]">
                                In most classrooms, children wait to be noticed.<br />
                                <span className="text-text-secondary/50">In our system, they are always seen.</span>
                            </h2>

                            <div className="space-y-6 max-w-lg">
                                <p className="text-lg text-foreground/80 font-medium leading-relaxed">
                                    Real learning happens in a loop<br />
                                    <b>Explain → Try → Correct → Improve.</b>
                                </p>
                                <p className="text-sm text-text-secondary font-medium leading-relaxed">
                                    Most platforms focus on the video connection. We focus on what happens inside it. We design sessions so this loop happens continuously.
                                </p>
                            </div>
                        </FadeUpSection>
                    </div>

                    <div className="lg:w-1/2 relative lg:p-0">
                        {/* Background Student Photo - 100% Visibility (Desktop only) */}
                        <div className="absolute inset-0 z-0 rounded-[3rem] overflow-hidden hidden lg:block">
                            <Image 
                                src="https://res.cloudinary.com/de8vvmpip/image/upload/v1774248455/Candid_photography_of_202603231216-Photoroom_efcj3m.png" 
                                alt="Personalized Learning Background | StudyHours" 
                                fill 
                                className="object-cover object-center"
                            />
                        </div>

                        <FadeUpSection className="bg-white/5 dark:bg-slate-950/5 p-12 rounded-[3rem] shadow-2xl border border-white/10 relative z-10">
                            {/* Animated Diagram Area */}
                            <div className="relative h-[400px] flex flex-col justify-center gap-12 text-foreground">
                                {/* Traditional Row */}
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">
                                        <span className="bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-lg inline-block shadow-lg border border-border/50">Traditional Instruction</span>
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="px-5 py-2.5 bg-background dark:bg-slate-800 rounded-xl text-xs font-black text-text-secondary shadow-xl border border-border/50">Tutor Talks</div>
                                        <motion.div
                                            animate={{ x: [0, 40, 0] }}
                                            transition={{ repeat: Infinity, duration: 4 }}
                                            className="w-12 h-1 bg-border/40 rounded-full shadow-inner"
                                        />
                                        <div className="px-5 py-2.5 bg-background/95 dark:bg-slate-800/95 rounded-xl text-xs font-black text-text-secondary opacity-60 shadow-xl border border-border/50">Student Listens</div>
                                    </div>
                                </div>

                                <div className="h-px bg-border w-full opacity-50" />

                                {/* Our System Row */}
                                <div className="space-y-6">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                                        <span className="bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-lg inline-block shadow-lg border border-primary/20">Our Attention Loops</span>
                                    </p>
                                    <div className="relative flex flex-wrap gap-4">
                                        {['Explain', 'Respond', 'Correct', 'Improve'].map((step, i) => (
                                            <React.Fragment key={step}>
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    whileInView={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: i * 0.4, duration: 0.5 }}
                                                    className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-tight shadow-xl flex items-center justify-center min-w-[100px] ${i === 0 ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 text-primary border border-primary/20'}`}
                                                >
                                                    {step}
                                                </motion.div>
                                                {i < 3 && (
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: 24 }}
                                                        transition={{ delay: i * 0.4 + 0.2, duration: 0.3 }}
                                                        className="h-4 flex items-center"
                                                    >
                                                        <svg className="w-full text-primary drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5-5 5" /></svg>
                                                    </motion.div>
                                                )}
                                            </React.Fragment>
                                        ))}

                                        {/* Loop Arrow */}
                                        <motion.div
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            whileInView={{ pathLength: 1, opacity: 1 }}
                                            transition={{ delay: 1.8, duration: 1 }}
                                            className="absolute -bottom-8 left-0 right-0 h-8"
                                        >
                                            <svg className="w-full h-full text-primary/40" viewBox="0 0 300 40" fill="none">
                                                <path d="M280 10C280 30 20 30 20 10" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
                                                <path d="M15 10L20 5L25 10" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        </motion.div>
                                    </div>
                                    <p className="text-[10px] font-bold text-text-secondary mt-10 italic">
                                        <span className="bg-white/95 dark:bg-slate-900/95 px-3 py-1.5 rounded-lg inline-block shadow-lg border border-border/50">The attention loop repeats until mastery is achieved.</span>
                                    </p>
                                </div>
                            </div>
                        </FadeUpSection>

                        {/* Floating Metric */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="absolute -right-8 -bottom-8 bg-foreground text-background p-6 rounded-3xl shadow-2xl z-20"
                        >
                            <p className="text-3xl font-black tracking-tighter">4.2x</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Higher student engagement</p>
                        </motion.div>
                    </div>
                </div>

                <div className="mt-32">
                    <FadeUpSection className="text-center mb-16">
                        <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Why this works</h3>
                    </FadeUpSection>

                    <HighImpactThreePillars />
                </div>
            </div>
        </section>
    );
}
