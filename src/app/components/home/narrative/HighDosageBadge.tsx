'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function HighDosageBadge() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-12 flex justify-center"
        >
            <div className="relative group cursor-default inline-block">
                {/* Ambient Glow */}
                <div className="absolute inset-0 bg-sapphire/20 rounded-full blur-xl group-hover:bg-sapphire/40 transition-all duration-700" />

                <div className="relative px-6 py-3 rounded-full bg-[#020617] dark:bg-sapphire/10 border border-sapphire/30 flex items-center gap-4 shadow-2xl backdrop-blur-xl group-hover:border-sapphire/50 transition-colors">
                    <div className="relative flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-sapphire animate-ping absolute" />
                        <div className="w-2 h-2 rounded-full bg-sapphire relative z-10 shadow-[0_0_8px_rgba(15,82,186,0.8)]" />
                    </div>

                    <div className="text-left flex flex-col">
                        <span className="text-base font-luckiest text-white dark:text-ice-blue uppercase tracking-widest mb-0.5 group-hover:text-sapphire transition-colors shadow-black drop-shadow-sm">
                            High-Dosage Certified
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                            Short terms, frequent cycles, compounding results.
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
