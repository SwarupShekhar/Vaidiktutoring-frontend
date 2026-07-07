'use client';
import React, { useEffect, useState } from 'react';
import api from '@/app/lib/api';
import useCatalog from '@/app/Hooks/useCatalog';
import { 
    Loader2, AlertCircle, CheckCircle2, UserPlus, 
    ChevronRight, Calendar, BookOpen, GraduationCap,
    TrendingDown, Zap, Search, User, Filter, ArrowRight,
    ShieldCheck
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useFocusTrap } from '@/app/Hooks/useFocusTrap';

interface TutorAllocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking?: any; // If passed, we prioritize this specific booking
}

interface QueueItem {
    id: string;
    studentId: string;
    studentName: string;
    studentGrade: string;
    curriculumName: string;
    subjectName: string;
    requestedStart: string;
    requestedEnd: string;
    note: string;
    createdAt: string;
    enrollmentStatus?: string;
}

interface RecommendedTutor {
    id: string;
    name: string;
    workload: number;
    email: string;
}

export default function TutorAllocationModal({ isOpen, onClose, booking }: TutorAllocationModalProps) {
    const { subjects } = useCatalog();
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
    const [recommendations, setRecommendations] = useState<RecommendedTutor[]>([]);
    const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
    const [loadingQueue, setLoadingQueue] = useState(false);
    const [loadingRecs, setLoadingRecs] = useState(false);
    const [allocating, setAllocating] = useState(false);
    const [successId, setSuccessId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Load queue on open
    useEffect(() => {
        if (isOpen) {
            fetchQueue();
            if (booking) {
                // If opened for a specific booking from table
                const mappedItem: QueueItem = {
                    id: booking.id,
                    studentId: booking.student_id || booking.student?.id || '',
                    studentName: `${booking.student?.first_name || ''} ${booking.student?.last_name || ''}`.trim(),
                    studentGrade: booking.student?.grade,
                    curriculumName: booking.curricula?.name || booking.curriculum?.name,
                    subjectName: booking.subjects?.name || booking.subject?.name,
                    requestedStart: booking.requested_start,
                    requestedEnd: booking.requested_end,
                    note: booking.note,
                    createdAt: booking.created_at,
                    enrollmentStatus: booking.enrollment_status || booking.student?.enrollment_status
                };
                setSelectedItem(mappedItem);
                fetchRecommendations(booking.subject_id || booking.subjects?.id || booking.subject?.id);
            }
        } else {
            setSelectedItem(null);
            setRecommendations([]);
            setError(null);
        }
    }, [isOpen, booking]);

    const fetchQueue = async () => {
        setLoadingQueue(true);
        try {
            const res = await api.get('/admin/allocations/queue');
            setQueue(res.data);
        } catch (err: any) {
            setError('Failed to fetch allocation queue');
        } finally {
            setLoadingQueue(false);
        }
    };

    const fetchRecommendations = async (subjectId: string) => {
        if (!subjectId) return;
        setLoadingRecs(true);
        try {
            const res = await api.get(`/admin/allocations/recommendations/${subjectId}`);
            setRecommendations(res.data);
        } catch (err: any) {
            console.error('Failed to fetch recommendations', err);
        } finally {
            setLoadingRecs(false);
        }
    };

    const handleSelectItem = (item: QueueItem) => {
        setSelectedItem(item);
        // Find subject ID to fetch recs
        // We might need the subject object from catalog if the queue item only has name
        const sub = subjects?.find((s: any) => s.name === item.subjectName);
        if (sub) {
            fetchRecommendations(sub.id);
        }
    };

    const handleAllocate = async () => {
        if (!selectedItem || !selectedTutorId) return;
        setAllocating(true);
        try {
            // PATCH /admin/bookings/:id/assign-tutor
            await api.patch(`/admin/bookings/${selectedItem.id}/assign-tutor`, {
                tutorId: selectedTutorId
            });

            // Green flash for the item
            setSuccessId(selectedItem.id);
            
            setTimeout(() => {
                // Refresh queue
                const updatedQueue = queue.filter(q => q.id !== selectedItem.id);
                setQueue(updatedQueue);
                
                // Refresh dependencies
                window.dispatchEvent(new Event('refresh-bookings-table'));
                window.dispatchEvent(new Event('refresh-admin-stats'));
                
                // Auto-select next item if available
                if (updatedQueue.length > 0) {
                    handleSelectItem(updatedQueue[0]);
                } else {
                    setSelectedItem(null);
                }
                
                setSuccessId(null);
                setSelectedTutorId(null);
                setAllocating(false);
            }, 800);

        } catch (err: any) {
            alert(err.response?.data?.message || 'Allocation failed');
            setAllocating(false);
        }
    };

    const panelRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-300">
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Tutor allocation"
                tabIndex={-1}
                className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-6xl h-[85vh] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10 flex overflow-hidden"
            >
                
                {/* Left Panel: The Queue */}
                <div className="w-1/3 border-r border-slate-200 dark:border-white/5 flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="p-8 border-b border-slate-200 dark:border-white/5">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Request Queue</h3>
                            <div className="px-3 py-1 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest">
                                {queue.length} Pending
                            </div>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">First Come, First Served</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {loadingQueue ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 size={32} className="text-blue-500 animate-spin" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hydrating Queue...</span>
                            </div>
                        ) : queue.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-8 opacity-40">
                                <CheckCircle2 size={48} className="mb-4 text-green-500" />
                                <p className="text-sm font-bold text-slate-900 dark:text-white">All caught up!</p>
                                <p className="text-xs text-slate-400 mt-1">No pending tutor requests at the moment.</p>
                            </div>
                        ) : (
                            queue.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelectItem(item)}
                                    className={`w-full text-left p-6 rounded-4xl transition-all duration-300 group relative overflow-hidden ${
                                        selectedItem?.id === item.id 
                                            ? 'bg-blue-600 shadow-2xl shadow-blue-500/20 translate-x-2' 
                                            : successId === item.id
                                            ? 'bg-green-500 scale-95 opacity-0'
                                            : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                    selectedItem?.id === item.id ? 'text-blue-100' : 'text-blue-500'
                                                }`}>
                                                    {item.subjectName}
                                                </span>
                                                <span className={`text-[10px] font-bold ${
                                                    selectedItem?.id === item.id ? 'text-blue-200' : 'text-slate-400'
                                                }`}>
                                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className={`text-lg font-black tracking-tight ${
                                                    selectedItem?.id === item.id ? 'text-white' : 'text-slate-900 dark:text-white'
                                                }`}>
                                                    {item.studentName}
                                                </h4>
                                                {item.enrollmentStatus === 'active' && (
                                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                                        selectedItem?.id === item.id ? 'bg-white text-blue-600' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                                    }`}>
                                                        Premium
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className={`flex items-center gap-1.5 text-xs font-bold ${
                                                    selectedItem?.id === item.id ? 'text-blue-100' : 'text-slate-500'
                                                }`}>
                                                    <GraduationCap size={14} />
                                                    Grade {item.studentGrade}
                                                </div>
                                                <div className={`w-1 h-1 rounded-full ${
                                                    selectedItem?.id === item.id ? 'bg-blue-300/30' : 'bg-slate-300'
                                                }`} />
                                                <div className={`flex items-center gap-1.5 text-xs font-bold ${
                                                    selectedItem?.id === item.id ? 'text-blue-100' : 'text-slate-500'
                                                }`}>
                                                    <BookOpen size={14} />
                                                    {item.curriculumName}
                                                </div>
                                            </div>
                                        </div>
                                        {successId === item.id && (
                                            <CheckCircle2 size={24} className="text-white animate-bounce" />
                                        )}
                                    </div>
                                    {selectedItem?.id === item.id && (
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50">
                                            <ChevronRight size={24} />
                                        </div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Panel: Selection & Allocation */}
                <div className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-slate-900">
                    <button 
                        onClick={onClose}
                        className="absolute top-8 right-8 z-20 w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        ✕
                    </button>

                    {selectedItem ? (
                        <div className="flex-1 flex flex-col p-12 overflow-y-auto custom-scrollbar">
                            {/* Header Section */}
                            <div className="mb-10 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-600/20 flex items-center justify-center text-blue-600">
                                        <UserPlus size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Match Verification</h2>
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Step 2: Assign Expert Tutor</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 p-8 rounded-4xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 relative overflow-hidden">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Subject Focus</span>
                                            <p className="text-xl font-black text-slate-900 dark:text-white">{selectedItem.subjectName}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</span>
                                                <p className="font-bold text-slate-900 dark:text-white">{selectedItem.studentGrade}</p>
                                            </div>
                                            <div className="w-px h-8 bg-slate-200 dark:bg-white/10" />
                                            <div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Curriculum</span>
                                                <p className="font-bold text-slate-900 dark:text-white">{selectedItem.curriculumName}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preferred Window</span>
                                            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                                                <Calendar size={16} className="text-blue-500" />
                                                {selectedItem.requestedStart ? new Date(selectedItem.requestedStart).toLocaleDateString() : 'ASAP'}
                                            </div>
                                        </div>
                                        {selectedItem.note && (
                                            <div className="p-3 bg-white dark:bg-white/5 rounded-xl border border-dotted border-blue-500/30 text-[11px] text-slate-500 leading-relaxed italic">
                                                "{selectedItem.note}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations Section */}
                            <div className="flex-1 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Zap size={14} className="text-amber-500" />
                                        Recommended Tutors
                                    </h4>
                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-bold text-slate-500">
                                            <TrendingDown size={12} />
                                            Lowest Workload First
                                        </div>
                                    </div>
                                </div>

                                {loadingRecs ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-24 rounded-3xl bg-slate-100 dark:bg-white/5 animate-pulse" />
                                        ))}
                                    </div>
                                ) : recommendations.length === 0 ? (
                                    <div className="p-12 rounded-4xl border-2 border-dashed border-red-500/20 bg-red-500/5 flex flex-col items-center justify-center text-center">
                                        <AlertCircle size={32} className="text-red-500 mb-4" />
                                        <p className="text-sm font-bold text-red-500 tracking-tight">No experts found for {selectedItem.subjectName}</p>
                                        <p className="text-xs text-red-400 font-medium mt-1">Please update tutor skills or adjust the student subject focus.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            {recommendations.map((tutor, idx) => (
                                                <button
                                                    key={tutor.id}
                                                    disabled={allocating}
                                                    onClick={() => setSelectedTutorId(tutor.id)}
                                                    className={`group p-5 rounded-4xl border transition-all text-left flex items-center justify-between relative overflow-hidden ${
                                                        selectedTutorId === tutor.id
                                                            ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-500/20'
                                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 hover:border-blue-500'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-4 relative z-10">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                                                            selectedTutorId === tutor.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                                                        }`}>
                                                            <User size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className={`font-black tracking-tight ${selectedTutorId === tutor.id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                                                    {tutor.name}
                                                                </p>
                                                                {idx === 0 && (
                                                                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                                                                        selectedTutorId === tutor.id ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                                                                    }`}>
                                                                        Best Match
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                                    selectedTutorId === tutor.id
                                                                        ? 'bg-white/20 text-white'
                                                                        : tutor.workload < 3 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                    {tutor.workload} Active Sessions
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {selectedTutorId === tutor.id && (
                                                        <div className="text-white animate-in zoom-in duration-300">
                                                            <CheckCircle2 size={24} />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>

                                        {/* ACTION AREA */}
                                        <div className="mt-10 p-2 rounded-4xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 animate-in slide-in-from-bottom-4 duration-500 delay-200">
                                            <button
                                                disabled={!selectedTutorId || allocating}
                                                onClick={handleAllocate}
                                                className={`w-full py-5 rounded-[1.8rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all duration-500 shadow-2xl ${
                                                    selectedTutorId 
                                                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/30' 
                                                        : 'bg-slate-200 dark:bg-white/5 text-slate-400 cursor-not-allowed'
                                                }`}
                                            >
                                                {allocating ? (
                                                    <>
                                                        <Loader2 size={16} className="animate-spin" />
                                                        Processing Allocation...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShieldCheck className={selectedTutorId ? 'text-purple-300' : ''} size={18} />
                                                        Confirm & Finalize Allocation
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* Fallback: Manual Filter */}
                                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                                    <p className="text-[11px] font-bold text-slate-400">Can't find the right fit?</p>
                                    <button className="text-[11px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                        View Full Tutor Directory <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 mb-8">
                                <Filter size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Select a Request</h2>
                            <p className="max-w-xs text-slate-400 text-sm font-medium">Pick a pending booking from the left queue to see tutor matches and intelligently allocate sessions.</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Success/Processing Overlay */}
            {allocating && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-blue-600/20 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-4xl shadow-2xl border border-white/20 flex flex-col items-center gap-6">
                        <Loader2 size={48} className="text-blue-500 animate-spin" />
                        <div className="text-center">
                            <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Syncing Allocation</h4>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Notifying student & tutor...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
