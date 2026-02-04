'use client';

import React from 'react';
import { motion } from 'framer-motion';
import FadeUpSection from './FadeUpSection';

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
                                    Real learning happens in a loop — <br />
                                    <b>Explain → Try → Correct → Improve.</b>
                                </p>
                                <p className="text-sm text-text-secondary font-medium leading-relaxed">
                                    Most platforms focus on the video connection. We focus on what happens inside it. We design sessions so this loop happens continuously.
                                </p>
                            </div>
                        </FadeUpSection>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <FadeUpSection className="bg-surface p-12 rounded-[3rem] shadow-2xl border border-border/50">
                            {/* Animated Diagram Area */}
                            <div className="relative h-[400px] flex flex-col justify-center gap-12 text-foreground">
                                {/* Traditional Row */}
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Traditional Instruction</p>
                                    <div className="flex items-center gap-4">
                                        <div className="px-4 py-2 bg-background rounded-lg text-xs font-bold text-text-secondary">Tutor Talks</div>
                                        <motion.div
                                            animate={{ x: [0, 40, 0] }}
                                            transition={{ repeat: Infinity, duration: 4 }}
                                            className="w-12 h-0.5 bg-border"
                                        />
                                        <div className="px-4 py-2 bg-background rounded-lg text-xs font-bold text-text-secondary opacity-50">Student Listens</div>
                                    </div>
                                </div>

                                <div className="h-px bg-border w-full" />

                                {/* Our System Row */}
                                <div className="space-y-6">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Our Attention Loops</p>
                                    <div className="relative flex flex-wrap gap-4">
                                        {['Explain', 'Respond', 'Correct', 'Improve'].map((step, i) => (
                                            <React.Fragment key={step}>
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    whileInView={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: i * 0.4, duration: 0.5 }}
                                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter ${i === 0 ? 'bg-primary text-white' : 'bg-primary/5 text-primary border border-primary/20'}`}
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
                                                        <svg className="w-full text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5-5 5" /></svg>
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
                                            <svg className="w-full h-full text-primary/10" viewBox="0 0 300 40" fill="none">
                                                <path d="M280 10C280 30 20 30 20 10" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
                                                <path d="M15 10L20 5L25 10" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        </motion.div>
                                    </div>
                                    <p className="text-[10px] font-bold text-text-secondary mt-8 italic">The attention loop repeats until mastery is achieved.</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Curriculum-Aligned",
                                desc: "Mapped to major global frameworks (US, UK, IB, and more).",
                                icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            },
                            {
                                title: "System + Human Hybrid",
                                desc: "Expert tutors supported by intelligent feedback systems.",
                                icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                            },
                            {
                                title: "Outcome-Focused",
                                desc: "Clear goals, artifacts, and measurable progress.",
                                icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            }
                        ].map((card, i) => (
                            <FadeUpSection key={i} delay={i * 0.1} className="p-8 rounded-[2rem] bg-surface/50 dark:bg-white/5 border border-border/50 backdrop-blur-xl hover:border-primary/50 transition-colors group">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {card.icon}
                                </div>
                                <h4 className="text-xl font-black text-foreground mb-3">{card.title}</h4>
                                <p className="text-sm text-text-secondary font-medium leading-relaxed">{card.desc}</p>
                            </FadeUpSection>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
