import React, { useEffect, useState } from 'react';
import api from '@/app/lib/api';
import { Play, User, GraduationCap, Video, CheckCircle2, XCircle } from 'lucide-react';

interface ActiveSession {
    id: string;
    start_time: string;
    meet_link: string;
    attendance?: {
        students: { first_name: string; last_name: string };
        present: boolean;
        joinedAt: string | null;
        leftAt: string | null;
    }[];
    bookings: {
        subjects: { name: string };
        students: { first_name: string; last_name: string } | null;
        tutors: { users: { first_name: string; last_name: string } };
    };
}

export default function ActiveSessionsMonitor() {
    const [sessions, setSessions] = useState<ActiveSession[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        try {
            const res = await api.get('/admin/active-sessions');
            setSessions(res.data || []);
        } catch (e) {
            console.error('Failed to fetch active sessions', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
        const interval = setInterval(fetchSessions, 30000); // 30 sec refresh
        return () => clearInterval(interval);
    }, []);

    if (loading && sessions.length === 0) return null;
    if (sessions.length === 0) return null;

    return (
        <div className="bg-glass dark:bg-slate-900 rounded-3xl p-6 border-2 border-green-500/20 shadow-lg animate-in fade-in zoom-in-95 duration-500">
            <h2 className="text-xl font-black text-(--color-text-primary) dark:text-white mb-4 flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                LIVE NOW: Active Sessions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((session) => {
                    const isGroup = !session.bookings?.students;
                    const studentsList = isGroup && session.attendance 
                        ? session.attendance 
                        : (session.bookings?.students ? [{ students: session.bookings.students, present: false, joinedAt: null, leftAt: null, isFallback: true }] : []);

                    return (
                        <div key={session.id} className="p-4 rounded-2xl bg-black/5 dark:bg-white/10 border border-border dark:border-white/10 hover:border-green-400 transition-all flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-lg uppercase">
                                    {session.bookings?.subjects?.name || 'Tutoring'} {isGroup && '(Group)'}
                                </span>
                                <div className="flex gap-2">
                                    {session.meet_link && (
                                        <a 
                                            href={session.meet_link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                                            title="Join Call"
                                        >
                                            <Video size={14} />
                                        </a>
                                    )}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                    <User size={14} className="text-gray-400" />
                                    <span>
                                        Tutor: <span className="font-semibold text-text-primary dark:text-white">{session.bookings?.tutors?.users?.first_name} {session.bookings?.tutors?.users?.last_name}</span>
                                    </span>
                                </div>
                                
                                <div className="text-sm font-semibold mt-2 mb-1 flex items-center gap-2">
                                    <GraduationCap size={14} className="text-gray-400" />
                                    Students ({studentsList.length})
                                </div>
                                <div className="flex flex-col gap-1 pl-6">
                                    {studentsList.map((record, idx) => {
                                        // If it's a 1-on-1 and we don't have real attendance data in the fallback, we try to find it in the attendance array
                                        const actualRecord = session.attendance?.find(a => a.students.first_name === record.students.first_name && a.students.last_name === record.students.last_name) || record;
                                        
                                        const isPresent = actualRecord.present;
                                        const leftMidway = actualRecord.leftAt && !actualRecord.present;

                                        return (
                                            <div key={idx} className="flex items-center justify-between text-xs">
                                                <span className="truncate max-w-[120px] font-medium">
                                                    {record.students.first_name} {record.students.last_name}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    {isPresent ? (
                                                        <span className="text-green-500 flex items-center gap-1"><CheckCircle2 size={12}/> Joined</span>
                                                    ) : leftMidway ? (
                                                        <span className="text-orange-500 flex items-center gap-1"><XCircle size={12}/> Left</span>
                                                    ) : (
                                                        <span className="text-red-500 flex items-center gap-1"><XCircle size={12}/> Absent</span>
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-2 pt-2 border-t border-border dark:border-white/10 flex justify-between items-center">
                                <span className="text-[10px] text-text-secondary opacity-60">
                                    Started {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
