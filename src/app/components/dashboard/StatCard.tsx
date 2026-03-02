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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="relative rounded-2xl overflow-hidden group"
        >
            {/* Gradient Border Background */}
            <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10"
                style={{
                    background: `linear-gradient(135deg, ${color}40, transparent)`,
                }}
            />
            
            {/* Main Card */}
            <div className="bg-linear-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-slate-700/50 group-hover:border-slate-600/80 rounded-2xl p-6 transition-all duration-300 relative h-full">
                
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r" style={{
                    backgroundImage: `linear-gradient(90deg, ${color}00, ${color}80, ${color}00)`
                }} />
                
                {/* Icon Section - Top aligned with accent */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-3 flex-1">
                        <motion.div
                            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 relative"
                            style={{ 
                                background: `linear-gradient(135deg, ${color}20, ${color}05)`,
                                borderLeft: `3px solid ${color}`,
                            }}
                            whileHover={{ scale: 1.1 }}
                        >
                            <Icon size={24} style={{ color: color }} strokeWidth={1.5} />
                        </motion.div>
                        
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
                                {label}
                            </p>
                        </div>
                    </div>
                    
                    {/* Small decorative circle */}
                    <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: color }}
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.6, 1, 0.6]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                {/* Value Section */}
                <div className="mb-4">
                    <h3 className="text-4xl font-bold text-white tracking-tight mb-1">
                        {loading ? (
                            <div className="h-10 w-24 bg-slate-800 animate-pulse rounded-lg" />
                        ) : (
                            displayValue
                        )}
                    </h3>
                    
                    {description && (
                        <motion.p 
                            className="text-sm font-medium flex items-center gap-2"
                            style={{ color: color }}
                        >
                            <motion.span
                                className="w-1 h-1 rounded-full inline-block"
                                style={{ backgroundColor: color }}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            {description}
                        </motion.p>
                    )}
                </div>

                {/* Animated bottom accent line */}
                <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-linear-to-r rounded-full"
                    style={{ 
                        backgroundImage: `linear-gradient(90deg, ${color}80, transparent)`,
                    }}
                    animate={{ width: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>
        </motion.div>
    );
};
