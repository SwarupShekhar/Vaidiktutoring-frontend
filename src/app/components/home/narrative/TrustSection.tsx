'use client';

import React from 'react';
import FadeUpSection from './FadeUpSection';
import { motion } from 'framer-motion';

const VETTING_STEPS = [
    { label: "Academic Screening", side: -1 },
    { label: "Background Check", side: 1 },
    { label: "Pedagogical Interview", side: -1 },
    { label: "Mock Teaching Session", side: 1 },
    { label: "Ongoing Training", side: -1 }
];

export default function TrustSection() {
    return (
        <section className="py-32 bg-background overflow-hidden">
            <div className="container mx-auto px-6 max-w-4xl">
                <FadeUpSection className="text-center mb-24">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Our People</span>
                    <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
                        We only hire the top 3%
                    </h2>
                    <p className="text-text-secondary font-medium mt-4">A rigorous selection process ensures your child works with a professional support system, not just a subject expert.</p>
                </FadeUpSection>

                <div className="relative">
                    <div className="space-y-4">
                        {VETTING_STEPS.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: step.side * 100, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] }}
                                viewport={{ once: true }}
                                className={`flex ${step.side === -1 ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`
                                    w-full md:w-3/4 p-6 rounded-2xl flex items-center gap-6
                                    ${step.side === -1 ? 'bg-surface border-l-4 border-primary shadow-xl text-foreground' : 'bg-foreground text-background shadow-2xl'}
                                `}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${step.side === -1 ? 'bg-primary/10 text-primary' : 'bg-background/20 text-background'}`}>
                                        0{i + 1}
                                    </div>
                                    <span className="text-lg font-black tracking-tight">{step.label}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Badge Row */}
                    <FadeUpSection className="mt-20 pt-12 border-t border-border/50">
                        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
                            {[
                                "Background Verified",
                                "Pedagogy Trained",
                                "Curriculum Certified",
                                "Continuous Quality Reviews"
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-3 group">
                                    <div className="w-6 h-6 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-text-secondary/80 group-hover:text-foreground transition-colors">{badge}</span>
                                </div>
                            ))}
                        </div>
                    </FadeUpSection>

                    {/* Background Graphic */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-5">
                        <span className="text-[200px] font-black pointer-events-none text-foreground dark:text-white">TRUST</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
