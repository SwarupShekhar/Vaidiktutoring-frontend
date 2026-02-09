'use client';

import React from 'react';
import FadeUpSection from './FadeUpSection';
import Image from 'next/image';

const PILLARS = [
    {
        title: "Consistency",
        desc: "Regular, scheduled sessions build habit and momentum.",
        icon: "https://res.cloudinary.com/de8vvmpip/image/upload/v1770624778/consistency_uerayp.gif"
    },
    {
        title: "Small Groups",
        desc: "Intimate 4:1 ratios ensure every student is heard.",
        icon: "https://res.cloudinary.com/de8vvmpip/image/upload/v1770624780/team_m59vd5.gif"
    },
    {
        title: "Measured Progress",
        desc: "Data-driven insights track growth over time.",
        icon: "https://res.cloudinary.com/de8vvmpip/image/upload/v1770624776/success_q01hth.gif"
    }
];

export default function HighImpactThreePillars() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {PILLARS.map((pillar, i) => (
                <FadeUpSection key={i} delay={i * 0.1} className="group">
                    <div className="h-full p-8 rounded-3xl bg-glass dark:bg-white/5 card-hover border border-white/20 hover:border-sapphire/30 relative overflow-hidden">
                        {/* Gradient Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sapphire/10 rounded-full blur-2xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />

                        <div className="w-14 h-14 rounded-2xl bg-sapphire/5 border border-sapphire/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm relative z-10 dark:bg-sapphire/20 overflow-hidden p-2">
                            <Image
                                src={pillar.icon}
                                alt={pillar.title}
                                fill
                                className="object-contain"
                                unoptimized
                            />
                        </div>
                        <h3 className="text-lg font-luckiest text-deep-navy dark:text-white mb-3 tracking-wide group-hover:text-sapphire transition-colors relative z-10">
                            {pillar.title}
                        </h3>
                        <p className="text-sm text-text-secondary font-medium leading-relaxed relative z-10">
                            {pillar.desc}
                        </p>
                    </div>
                </FadeUpSection>
            ))}
        </div>
    );
}
