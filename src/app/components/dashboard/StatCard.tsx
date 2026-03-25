'use client';

import React, { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion, animate } from 'framer-motion';

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    color?: string;
    description?: string;
    loading?: boolean;
}

export const StatCard = ({
    icon: Icon,
    label,
    value,
    color = '#3b82f6', // Default blue
    description,
    loading = false
}: StatCardProps) => {
    const [displayValue, setDisplayValue] = useState<any>(0);

    useEffect(() => {
        if (!loading) {
            const numericValue = typeof value === 'string' ? parseFloat(value) : value;
            if (isNaN(numericValue)) {
                setDisplayValue(value);
                return;
            }

            const controls = animate(0, numericValue, {
                duration: 1.5,
                ease: "easeOut",
                onUpdate: (latest) => {
                    if (typeof value === 'string' && value.includes('.')) {
                        setDisplayValue(latest.toFixed(1));
                    } else {
                        setDisplayValue(Math.floor(latest));
                    }
                }
            });
            return () => controls.stop();
        }
    }, [value, loading]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative h-full"
        >
            {/* Soft Glow Background */}
            <div 
                className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl -z-10"
                style={{ backgroundColor: color }}
            />
            
            {/* Main Card Container */}
            <div className="group h-full flex flex-col p-6 rounded-[2rem] bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all duration-500 overflow-hidden relative">
                
                {/* Decorative Pattern Layer */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="0" r="100" fill="currentColor" />
                    </svg>
                </div>

                {/* Header: Icon + Label */}
                <div className="flex items-center gap-4 mb-6">
                    <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                        style={{ 
                            background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                            boxShadow: `0 8px 16px -4px ${color}40`,
                        }}
                    >
                        <Icon size={24} className="text-white" strokeWidth={2} />
                    </div>
                    
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mb-0.5">
                            {label}
                        </p>
                        <div 
                            className="h-1 w-6 rounded-full"
                            style={{ backgroundColor: color }}
                        />
                    </div>
                </div>

                {/* Content: Value + Description */}
                <div className="mt-auto">
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-3">
                        {loading ? (
                            <div className="h-10 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
                        ) : (
                            displayValue
                        )}
                    </h3>
                    
                    {description && (
                        <div className="flex items-center gap-2">
                            <span 
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-white/5"
                            >
                                {description}
                            </span>
                        </div>
                    )}
                </div>

                {/* Subtle Hover Gradient Accent */}
                <div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                    style={{ 
                        backgroundImage: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                    }}
                />
            </div>
        </motion.div>
    );
};
