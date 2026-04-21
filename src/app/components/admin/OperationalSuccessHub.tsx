'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, BarChart3, UserCheck, ShieldAlert } from 'lucide-react';

interface SuccessMetricsProps {
    stats: {
        success?: {
            attendanceRate: number;
            avgMastery: number;
        };
        enrollment?: Record<string, number>;
        students: number;
    };
}

export default function OperationalSuccessHub({ stats }: SuccessMetricsProps) {
    const attendance = stats.success?.attendanceRate || 0;
    const mastery = stats.success?.avgMastery || 0;
    const enrollment = stats.enrollment || {};

    const funnelStages = [
        { label: 'Total', value: stats.students, color: 'blue' },
        { label: 'Trial', value: enrollment.trial || 0, color: 'amber' },
        { label: 'Active', value: enrollment.active || 0, color: 'emerald' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* SUCCESS SCORE CARD */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-4xl p-8 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp size={80} />
                </div>
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-6">Pedagogical Health</p>
                    <div className="flex items-end gap-3 mb-8">
                        <span className="text-6xl font-black tracking-tighter text-white">{attendance}%</span>
                        <div className="bg-emerald-500/10 text-emerald-500 p-1 rounded-lg flex items-center mb-2">
                            <TrendingUp size={12} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                            <span>Attendance Stability</span>
                            <span className="text-white/80">{attendance}% Rate</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${attendance}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* MASTERY ENGAGEMENT CARD */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-4xl p-8 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Target size={80} />
                </div>
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-400 mb-6">Achievement Pulse</p>
                    <div className="flex items-end gap-3 mb-8">
                        <span className="text-6xl font-black tracking-tighter text-white">{mastery}</span>
                        <span className="text-sm font-black text-white/30 uppercase mb-3">AVG PTS</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[9px] font-bold text-white/40 uppercase mb-1">Growth Slope</p>
                            <p className="text-lg font-black text-white">+12.4%</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[9px] font-bold text-white/40 uppercase mb-1">Status</p>
                            <p className="text-lg font-black text-emerald-400 uppercase">Thriving</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ENROLLMENT FUNNEL CARD */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-4xl p-8 border border-white/5 relative overflow-hidden group lg:col-span-1 md:col-span-2">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <BarChart3 size={80} />
                </div>
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 mb-6">Conversion Engine</p>
                    
                    <div className="space-y-6">
                        {funnelStages.map((stage, i) => (
                            <div key={stage.label} className="relative">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{stage.label}</span>
                                    <span className="text-lg font-black text-white">{stage.value}</span>
                                </div>
                                <div className="w-full h-3 bg-white/5 rounded-lg overflow-hidden border border-white/5">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(stage.value / (funnelStages[0].value || 1)) * 100}%` }}
                                        transition={{ duration: 1 + i * 0.2, ease: "easeOut" }}
                                        className={`h-full bg-${stage.color}-500/50 rounded-lg`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Overall Retention</p>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">
                            {Math.round(((enrollment.active || 0) / (stats.students || 1)) * 100)}% Conversion
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
