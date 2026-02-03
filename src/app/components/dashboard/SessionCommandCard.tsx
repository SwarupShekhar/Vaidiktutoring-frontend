'use client';

import React from 'react';
import { Clock, Calendar, Video, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow, isWithinInterval, addMinutes, subMinutes } from 'date-fns';

interface SessionCommandCardProps {
    session: any; // Ideally normalized booking/session type
    loading?: boolean;
}

export const SessionCommandCard = ({ session, loading }: SessionCommandCardProps) => {
    const router = useRouter();

    if (loading) {
        return (
            <div className="animate-pulse bg-white/10 rounded-2xl h-48 w-full border border-white/5" />
        );
    }

    if (!session) {
        return (
            <div className="bg-glass border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 italic text-2xl">
                    📭
                </div>
                <h3 className="text-lg font-bold text-white mb-1">No sessions scheduled</h3>
                <p className="text-white/60 text-sm mb-4">Book a new class to start your learning journey!</p>
                <button
                    onClick={() => router.push('/bookings/new')}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-bold hover:bg-white/90 transition-all"
                >
                    Book Now
                </button>
            </div>
        );
    }

    const startTime = new Date(session.start_time || session.requested_start);
    const endTime = new Date(session.end_time || session.requested_end);
    const now = new Date();

    // Can join 10 mins before and until end
    const canJoin = isWithinInterval(now, {
        start: subMinutes(startTime, 10),
        end: endTime
    });

    const isLive = isWithinInterval(now, { start: startTime, end: endTime });

    return (
        <div className="relative group overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-blue-700 rounded-2xl p-6 text-white shadow-2xl border border-white/20">
            {/* Animated background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700 font-bold" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isLive ? 'bg-red-500 animate-pulse' : 'bg-white/20 text-white'}`}>
                        {isLive ? '● Live Now' : 'Upcoming Session'}
                    </span>
                    <div className="flex items-center gap-2 text-white/80 text-xs font-bold">
                        <Clock size={14} />
                        {isLive ? 'Started' : formatDistanceToNow(startTime, { addSuffix: true })}
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-1 truncate">
                    {session.subject?.name || 'Vaidik Tutoring Session'}
                </h2>
                <div className="flex items-center gap-4 mb-6 text-white/80 text-sm">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {startTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                        <Clock size={14} />
                        {startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </div>
                </div>

                <div className="flex gap-3">
                    {canJoin ? (
                        <button
                            onClick={() => router.push(`/session/${session.id}`)}
                            className="flex-1 py-3 bg-white text-blue-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 active:scale-95 transition-all shadow-lg"
                        >
                            <Video size={18} />
                            Join Session
                        </button>
                    ) : (
                        <button
                            onClick={() => router.push(`/session/${session.id}`)}
                            className="flex-1 py-3 bg-white/20 border border-white/30 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/30 transition-all opacity-80"
                        >
                            View Details
                            <ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
