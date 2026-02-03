'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

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
    return (
        <div className="bg-glass border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all hover:scale-[1.02] flex items-center gap-5 group overflow-hidden relative">
            {/* Background Accent */}
            <div
                className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-125 transition-transform duration-500"
                style={{ backgroundColor: color }}
            />

            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg relative z-10"
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
                            value
                        )}
                    </h3>
                </div>
                {description && (
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};
