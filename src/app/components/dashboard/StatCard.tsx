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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="relative h-full"
        >
            
            {/* Main Card Container */}
            <div className="group h-full flex flex-col p-6 rounded-4xl bg-white border border-slate-100 shadow-sm transition-all duration-300 overflow-hidden relative">
                

                {/* Header: Icon + Label */}
                <div className="flex items-center gap-4 mb-6">
                    <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 bg-slate-50"
                    >
                        <Icon size={20} className="text-slate-600" strokeWidth={2} />
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
                             <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ backgroundColor: color }}
                                />
                             </div>
                             <span className="text-[10px] font-bold text-slate-400 uppercase">{description}</span>
                        </div>
                    )}
                </div>

            </div>
        </motion.div>
    );
};
