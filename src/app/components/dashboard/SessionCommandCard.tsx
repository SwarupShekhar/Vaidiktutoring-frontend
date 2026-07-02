'use client';

import React, { useState } from 'react';
import { Clock, Calendar, Video, ArrowRight, User, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow, isWithinInterval, subMinutes } from 'date-fns';
import { motion } from 'framer-motion';
import { SupportModal } from './SupportModal';

interface SessionCommandCardProps {
    session: any; // Ideally normalized booking/session type
    loading?: boolean;
}

export const SessionCommandCard = ({ session, loading }: SessionCommandCardProps) => {
    const router = useRouter();
    const [showSupport, setShowSupport] = useState(false);


    if (loading) {
        return (
            <div className="animate-pulse bg-background rounded-3xl h-64 w-full border border-border" />
        );
    }

    if (!session) {
        return (
            <div className="relative overflow-hidden bg-surface border border-border rounded-3xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner border border-border">
                    📭
                </div>
                <h3 className="text-xl font-black text-foreground mb-2 tracking-tight">No sessions scheduled</h3>
                <p className="text-text-secondary text-sm mb-6 max-w-xs mx-auto">Book a new class to start your personalized learning journey!</p>
                <button
                    onClick={() => router.push('/bookings/new')}
                    className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md"
                >
                    Book Now
                </button>
                
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] dark:opacity-/5 pointer-events-none">
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

    const isLive = isWithinInterval(now, { start: startTime, end: endTime });
    
    // Join opens 5 min before start (and stays open after). Joining a class
    // hours/days early hits a backend daily-token 403 with a misleading
    // "different tutor" screen, so gate the button on the real time window.
    const JOIN_LEAD_MS = 5 * 60_000;
    const canJoin = startTime.getTime() - now.getTime() <= JOIN_LEAD_MS;
    const subjectName = session.subject?.name || session.subject_name || 'StudyHours Session';

    // Resolve the video provider. ZOOM sessions are joined externally via `zoom_join_url`;
    // Daily.co (or unset) sessions use the in-app room at /session/<id>.
    const sess = session.sessions?.[0] ?? session;
    const provider = sess?.video_provider ?? session.video_provider;
    const legacyZoomLink = !!session.meet_link && session.meet_link.includes('zoom.us');
    const isZoom = provider === 'ZOOM' || legacyZoomLink;
    const zoomUrl =
        sess?.zoom_join_url ?? session.zoom_join_url ?? (legacyZoomLink ? session.meet_link : null);
    const zoomUnavailable = isZoom && !zoomUrl;

    const handleJoin = () => {
        if (isZoom) {
            if (zoomUrl) window.open(zoomUrl, '_blank', 'noopener,noreferrer');
        } else {
            router.push(`/session/${session.id}`);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="group relative overflow-hidden bg-surface rounded-4xl border border-border shadow-sm transition-all duration-300"
        >

            <div className="p-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-border ${isLive ? 'bg-red-50 text-red-600' : 'bg-background text-indigo-600'}`}>
                            <BookOpen size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${isLive ? 'bg-red-100 text-red-600' : 'bg-background border border-border text-text-secondary'}`}>
                                    {isLive && <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />}
                                    {isLive ? 'Live Now' : 'Upcoming Priority'}
                                </span>
                                {isLive && (
                                    <span className="text-[10px] font-bold text-red-500">
                                        Session in progress
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl font-black text-foreground tracking-tight leading-none">
                                {subjectName}
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="px-4 py-2 bg-background rounded-2xl border border-border flex items-center gap-2">
                            <Calendar size={14} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                {startTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                        <div className="px-4 py-2 bg-background rounded-2xl border border-border flex items-center gap-2">
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
                            onClick={handleJoin}
                            disabled={zoomUnavailable}
                            className="flex-2 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Video size={20} />
                            {zoomUnavailable ? 'Link Unavailable' : isZoom ? 'Join Zoom' : 'Join Your Classroom'}
                        </button>
                    ) : (
                        <button
                            onClick={() => router.push(`/session/${session.id}`)}
                            className="flex-2 py-4 bg-foreground text-background rounded-2xl font-black flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-lg active:scale-[0.98]"
                        >
                            <ArrowRight size={18} />
                            View Session Details
                        </button>
                    )}
                    
                    <button 
                        onClick={() => setShowSupport(true)}
                        className="flex-1 py-4 bg-background text-text-secondary rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-border transition-all border border-border"
                    >
                        <User size={16} />
                        Get Help
                    </button>
                </div>
            </div>

            <SupportModal 
                isOpen={showSupport} 
                onClose={() => setShowSupport(false)} 
                context={{ session_id: session?.id, subject: subjectName }}
            />
        </motion.div>

    );
};
