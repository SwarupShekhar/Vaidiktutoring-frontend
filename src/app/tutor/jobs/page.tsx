'use client';

import React, { useState } from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useTutorDashboard } from '@/app/Hooks/useTutorDashboard';
import { api } from '@/app/lib/api';
import {
    Zap,
    ArrowLeft,
    MapPin,
    Calendar,
    Clock,
    BookOpen,
    CheckCircle2,
    Loader2,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function JobBoardPage() {
    const { availableJobs, loading, refetch } = useTutorDashboard();
    const [claimingId, setClaimingId] = useState<string | null>(null);

    const handleClaim = async (jobId: string) => {
        setClaimingId(jobId);
        try {
            await api.post(`/bookings/${jobId}/claim`);
            toast.success('Session claimed successfully! It will now appear on your dashboard.');
            refetch();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to claim session');
        } finally {
            setClaimingId(null);
        }
    };

    return (
        <ProtectedClient roles={['tutor']}>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-8 transition-colors duration-300">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* BACK BUTTON & HEADER */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <Link
                                href="/tutor/dashboard"
                                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-purple-600 transition-colors mb-4 group"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Back to Command Center
                            </Link>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
                                <Zap className="text-purple-600" />
                                Available Job Market
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                                Explore and claim sessions that match your expertise.
                            </p>
                        </div>
                        <div className="px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Queue Status</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="font-black text-slate-900 dark:text-white">Live Monitoring</span>
                            </div>
                        </div>
                    </div>

                    {/* JOB LIST */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                                <Loader2 size={48} className="text-purple-600 animate-spin" />
                                <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Scanning available sessions...</p>
                            </div>
                        ) : availableJobs.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {availableJobs.map((job: any) => (
                                    <div
                                        key={job.id}
                                        className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col md:flex-row md:items-center justify-between gap-8"
                                    >
                                        <div className="flex items-start gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/20 group-hover:text-purple-600 transition-colors">
                                                <BookOpen size={28} />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase rounded-lg border border-purple-200 dark:border-purple-800 tracking-widest">
                                                        {job.subject_name || 'General'}
                                                    </span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
                                                        Session ID: {job.id.slice(0, 8)}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-purple-600 transition-colors">
                                                    {job.subject_name} Tutoring Session
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-6 pt-2">
                                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-bold">
                                                        <Calendar size={16} className="text-purple-500" />
                                                        {new Date(job.requested_start).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-bold">
                                                        <Clock size={16} className="text-purple-500" />
                                                        {new Date(job.requested_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-bold">
                                                        <MapPin size={16} className="text-purple-500" />
                                                        Online Interactive
                                                    </div>
                                                </div>
                                                {job.note && (
                                                    <p className="text-sm text-slate-400 dark:text-slate-500 font-medium italic mt-2 border-l-2 border-slate-200 dark:border-slate-800 pl-3">
                                                        "{job.note}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center gap-3">
                                            <button
                                                disabled={!!claimingId}
                                                onClick={() => handleClaim(job.id)}
                                                className="w-full md:w-auto px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-purple-500/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 group/btn"
                                            >
                                                {claimingId === job.id ? (
                                                    <>
                                                        <Loader2 size={24} className="animate-spin" />
                                                        Claiming...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 size={24} className="group-hover/btn:scale-110 transition-transform" />
                                                        Claim Session
                                                    </>
                                                )}
                                            </button>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                First-come response
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
                                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6">
                                    <AlertCircle size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Market is Quiet</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-center px-8">
                                    No new job requests match your profile at this moment.<br />
                                    We'll update this list automatically when new sessions appear.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedClient>
    );
}
