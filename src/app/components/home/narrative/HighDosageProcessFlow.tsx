'use client';

import React from 'react';
import FadeUpSection from './FadeUpSection';
import Image from 'next/image';

const STEPS = [
    {
        id: "01",
        title: "Free Assessment",
        desc: "Understand level, goals, curriculum",
        icon: "https://res.cloudinary.com/de8vvmpip/image/upload/v1770626562/paper-document_bkf2l3.gif"
    },
    {
        id: "02",
        title: "Structured Path",
        desc: "Right tutor + cadence",
        icon: "https://res.cloudinary.com/de8vvmpip/image/upload/v1770626560/career_bnccex.gif"
    },
    {
        id: "03",
        title: "Measured Progress",
        desc: "Feedback, artifacts, confidence tracking",
        icon: "https://res.cloudinary.com/de8vvmpip/image/upload/v1770626558/career-ladder_i6m9gl.gif"
    }
];

export default function HighDosageProcessFlow() {
    return (
        <section className="py-20 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <FadeUpSection className="text-center mb-16">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sapphire mb-3 block">How it works</span>
                    <h2 className="text-3xl md:text-4xl font-luckiest text-foreground tracking-wide drop-shadow-sm">
                        Your path to <span className="text-gradient-primary">consistency</span>
                    </h2>
                </FadeUpSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-sapphire/20 to-transparent z-0" />

                    {STEPS.map((step, i) => (
                        <FadeUpSection key={i} delay={i * 0.2} className="relative group">
                            <div className="h-full p-8 rounded-[2rem] bg-surface border border-white/5 relative z-10 transition-all duration-300 hover:-translate-y-2 card-hover overflow-hidden">
                                {/* Watermark Number */}
                                <div className="absolute -right-4 -bottom-8 text-[8rem] font-black text-foreground/5 pointer-events-none select-none z-0 leading-none">
                                    {step.id}
                                </div>

                                <div className="w-14 h-14 rounded-2xl bg-sapphire/5 border border-sapphire/10 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10 bg-background overflow-hidden p-2">
                                    <Image
                                        src={step.icon}
                                        alt={step.title}
                                        fill
                                        className="object-contain"
                                        unoptimized
                                    />
                                </div>

                                <h3 className="text-lg font-bold text-foreground mb-3 relative z-10">{step.title}</h3>
                                <p className="text-sm text-text-secondary font-medium leading-relaxed relative z-10">
                                    {step.desc}
                                </p>
                            </div>
                        </FadeUpSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
