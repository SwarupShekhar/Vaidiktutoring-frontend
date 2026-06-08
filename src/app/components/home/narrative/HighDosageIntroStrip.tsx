'use client';

import React from 'react';
import Reveal from './Reveal';

import Image from 'next/image';

const BADGES = [
    { label: "3× per week", icon: "https://res.cloudinary.com/de8vvmpip/image/upload/f_auto,w_40,h_40,c_limit/v1770623538/calendar_yjeieu.gif" },
    { label: "30 mins/session", icon: "https://res.cloudinary.com/de8vvmpip/image/upload/f_auto,w_40,h_40,c_limit/v1770623536/time_ieoruf.gif" },
    { label: "4:1 or better", icon: "https://res.cloudinary.com/de8vvmpip/image/upload/f_auto,w_40,h_40,c_limit/v1770623534/discussion_zoj9pq.gif" },
    { label: "Trained educators", icon: "https://res.cloudinary.com/de8vvmpip/image/upload/f_auto,w_40,h_40,c_limit/v1770623531/webinar_tyvnog.gif" }
];

export default function HighDosageIntroStrip() {
    return (
        <section className="w-full py-4 bg-deep-navy dark:bg-slate-950 border-y border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-deep-navy dark:from-slate-950 via-sapphire/5 to-deep-navy dark:to-slate-950 pointer-events-none opacity-50" />

            <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                <Reveal
                    variant="left"
                    className="flex items-center gap-3"
                >
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="text-base font-luckiest text-white tracking-widest uppercase shadow-black drop-shadow-md">High-Dosage Standard</span>
                </Reveal>

                <div className="flex flex-wrap justify-center md:justify-end gap-2">
                    {BADGES.map((badge, i) => (
                        <Reveal
                            key={i}
                            variant="up"
                            delay={i * 0.1 + 0.3}
                            className="px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 hover:bg-white/10 transition-colors"
                        >
                            <div className="relative w-5 h-5">
                                <Image
                                    src={badge.icon}
                                    alt={badge.label}
                                    fill
                                    className="object-contain"
                                    unoptimized // GIFs often need unoptimized to animate correctly if backend optimization is aggressive
                                />
                            </div>
                            <span className="text-xs font-medium text-slate-200">{badge.label}</span>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
