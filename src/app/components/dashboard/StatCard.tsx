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
    color = 'var(--color-primary)',
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
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-glass border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all flex items-center gap-5 group overflow-hidden relative"
        >
            {/* Background Accent */}
            <motion.div
                className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5"
                style={{ backgroundColor: color }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.05, 0.08, 0.05]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg relative z-10 transition-transform group-hover:scale-110 duration-300"
                style={{ backgroundColor: `${color}15`, color: color }}
            >
                <Icon size={28} />
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                    {label}
                </p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {loading ? (
                            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
                        ) : (
                            displayValue
                        )}
                    </h3>
                </div>
                {description && (
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                        <motion.span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: color }}
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        {description}
                    </p>
                )}
            </div>
        </motion.div>
    );
};
