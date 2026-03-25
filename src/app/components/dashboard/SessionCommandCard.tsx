'use client';

import React from 'react';
import { Clock, Calendar, Video, ArrowRight, User, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow, isWithinInterval, subMinutes } from 'date-fns';
import { motion } from 'framer-motion';

interface SessionCommandCardProps {
    session: any; // Ideally normalized booking/session type
    loading?: boolean;
}

export const SessionCommandCard = ({ session, loading }: SessionCommandCardProps) => {
    const router = useRouter();

    if (loading) {
        return (
            <div className="animate-pulse bg-slate-100 dark:bg-white/5 rounded-3xl h-64 w-full border border-slate-200/50 dark:border-white/5" />
        );
    }

    if (!session) {
        return (
            <div className="relative overflow-hidden bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
                    📭
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">No sessions scheduled</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-xs mx-auto">Book a new class to start your personalized learning journey!</p>
                <button
                    onClick={() => router.push('/bookings/new')}
                    className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md"
                >
                    Book Now
                </button>
                
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 0H0V100C30 80 70 80 100 100V0Z" fill="currentColor" />
                    </svg>
                </div>
            </div>
        );
    }

    const startTime = new Date(session.start_time || session.requested_start);
    const endTime = new Date(session.end_time || session.requested_end);
    const now = new Date();

    const canJoin = isWithinInterval(now, {
        start: subMinutes(startTime, 10),
        end: endTime
    });

    const isLive = isWithinInterval(now, { start: startTime, end: endTime });
    const subjectName = session.subject?.name || session.subject_name || 'StudyHours Session';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="group relative overflow-hidden bg-white rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-300"
        >

            <div className="p-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 ${isLive ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-indigo-600'}`}>
                            <BookOpen size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${isLive ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                    {isLive && <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />}
                                    {isLive ? 'Live Now' : 'Upcoming Priority'}
                                </span>
                                {isLive && (
                                    <span className="text-[10px] font-bold text-red-500">
                                        Session in progress
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                                {subjectName}
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5 flex items-center gap-2">
                            <Calendar size={14} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                {startTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                        <div className="px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5 flex items-center gap-2">
                            <Clock size={14} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                {startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    {canJoin ? (
                        <button
                            onClick={() => router.push(`/session/${session.id}`)}
                            className="flex-2 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-md active:scale-95"
                        >
                            <Video size={20} />
                            Join Your Classroom
                        </button>
                    ) : (
                        <button
                            onClick={() => router.push(`/session/${session.id}`)}
                            className="flex-2 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-lg active:scale-98"
                        >
                            <ArrowRight size={18} />
                            View Session Details
                        </button>
                    )}
                    
                    <button 
                        className="flex-1 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200/50 dark:border-white/5"
                    >
                        <User size={16} />
                        Get Help
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
