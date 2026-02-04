'use client';

import React from 'react';
import { motion } from 'framer-motion';
import FadeUpSection from './FadeUpSection';

export default function SessionOutputs() {
    return (
        <section className="py-20 bg-background relative z-10">
            <div className="container mx-auto px-6">
                <FadeUpSection className="p-10 md:p-16 rounded-[3rem] bg-indigo-950/40 border border-white/10 backdrop-blur-3xl relative overflow-hidden group shadow-2xl">
                    {/* Decorative background glow */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
                        <h4 className="text-2xl md:text-3xl font-black text-white tracking-tighter flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            Session Outputs
                        </h4>
                        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                            Continuous Evidence Generation
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {[
                            {
                                label: "3 Key Takeaways",
                                icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>,
                                color: "bg-green-500/20 text-green-400"
                            },
                            {
                                label: "Next Goal",
                                icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                                color: "bg-blue-500/20 text-blue-400"
                            },
                            {
                                label: "Saved Learning Artifact",
                                icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>,
                                color: "bg-amber-500/20 text-amber-400"
                            },
                            {
                                label: "Confidence Signal",
                                icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
                                color: "bg-purple-500/20 text-purple-400"
                            }
                        ].map((output, i) => (
                            <div key={i} className="group cursor-default">
                                <div className={`w-12 h-12 rounded-xl ${output.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                                    {output.icon}
                                </div>
                                <p className="text-xs font-black uppercase tracking-[0.15em] text-white/80 mb-4">{output.label}</p>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "70%" }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                                        className="h-full bg-white/30 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </FadeUpSection>
            </div>
        </section>
    );
}
