'use client';
import React, { useEffect, useState } from 'react';
import api from '@/app/lib/api';
import { Loader2, X, CheckSquare, Clock, Video, MessageSquare, AlertCircle, PlaySquare, Activity } from 'lucide-react';
import { format } from 'date-fns';

interface AdminSessionSummaryModalProps {
    sessionId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminSessionSummaryModal({ sessionId, isOpen, onClose }: AdminSessionSummaryModalProps) {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && sessionId) {
            setLoading(true);
            setError(null);
            api.get(`/sessions/${sessionId}/admin-summary`)
                .then(res => setSummary(res.data))
                .catch(err => {
                    console.error('Failed to load session summary', err);
                    setError(err.response?.data?.message || 'Failed to fetch session summary.');
                })
                .finally(() => setLoading(false));
        } else {
            setSummary(null);
        }
    }, [isOpen, sessionId]);

    if (!isOpen) return null;

    const safeFormatDate = (dateString: string | undefined | null) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'PP p');
        } catch {
            return 'Invalid Date';
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-white/20 dark:border-white/5 flex flex-col max-h-[90vh] overflow-hidden relative">
                
                {/* Header */}
                <div className="p-8 border-b border-border flex justify-between items-start relative z-10">
                    <div>
                        <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 mb-4">
                            <Activity size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Session Summary</h2>
                        <p className="text-slate-500 font-medium mt-1">ID: {sessionId}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 relative z-10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <Loader2 size={32} className="text-purple-500 animate-spin" />
                            <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Analyzing Session...</p>
                        </div>
                    ) : error ? (
                        <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-4 text-red-600">
                            <AlertCircle size={24} className="shrink-0" />
                            <p className="text-sm font-bold">{error}</p>
                        </div>
                    ) : summary ? (
                        <div className="space-y-8">
                            
                            {/* Meta & Duration */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-border">
                                    <Clock size={16} className="text-blue-500 mb-2" />
                                    <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">Duration (Mins)</p>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">{summary.durationMinutes ?? '-'}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-border">
                                    <MessageSquare size={16} className="text-green-500 mb-2" />
                                    <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">Chat Messages</p>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">{summary.chatLogCount}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-border">
                                    <CheckSquare size={16} className="text-orange-500 mb-2" />
                                    <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">Status</p>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white uppercase mt-1">{summary.booking?.status}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-border">
                                    <Video size={16} className="text-purple-500 mb-2" />
                                    <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">Recordings</p>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">{summary.recordingLinks?.length || 0}</p>
                                </div>
                            </div>

                            {/* Participants */}
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Participants</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border border-border rounded-2xl flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">S</div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500">Student</p>
                                            <p className="font-medium text-sm">{summary.student?.name || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 border border-border rounded-2xl flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-yellow-600">T</div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500">Tutor</p>
                                            <p className="font-medium text-sm">{summary.tutor?.name || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Logs */}
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Session Logs</h3>
                                <div className="bg-slate-50 dark:bg-slate-950 border border-border rounded-2xl p-4 text-sm divide-y divide-border">
                                    <div className="py-2 flex justify-between">
                                        <span className="text-slate-500">Start Time</span>
                                        <span className="font-medium">{safeFormatDate(summary.startTime)}</span>
                                    </div>
                                    <div className="py-2 flex justify-between">
                                        <span className="text-slate-500">End Time</span>
                                        <span className="font-medium">{safeFormatDate(summary.endTime)}</span>
                                    </div>
                                    <div className="py-2 flex justify-between items-center">
                                        <span className="text-slate-500">Whiteboard Used</span>
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${summary.whiteboardInteractions ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                                            {summary.whiteboardInteractions ? 'YES' : 'NO'}
                                        </span>
                                    </div>
                                    {summary.recordingLinks && summary.recordingLinks.length > 0 && (
                                        <div className="py-4 space-y-2">
                                            <span className="text-slate-500 block mb-2">Recording File(s)</span>
                                            {summary.recordingLinks.map((link: string, idx: number) => (
                                                <a key={idx} href={link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-500 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg text-xs font-medium w-fit">
                                                    <PlaySquare size={14} /> Review Recording {idx + 1}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    ) : null}
                </div>

            </div>
        </div>
    );
}
