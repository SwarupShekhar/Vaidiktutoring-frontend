'use client';
import React, { useEffect, useState } from 'react';
import api from '@/app/lib/api';
import useCatalog from '@/app/Hooks/useCatalog';
import { Loader2, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';

interface TutorAllocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking?: any;
}

export default function TutorAllocationModal({ isOpen, onClose, booking }: TutorAllocationModalProps) {
    const { subjects, loading: loadingSubjects } = useCatalog();
    const [loadingData, setLoadingData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [tutors, setTutors] = useState<any[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Selection state
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTutor, setSelectedTutor] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLoadingData(true);
            setFetchError(null);
            
            if (booking) {
                // If opened for a specific booking, prepopulate
                setSelectedStudent(booking.student_id || booking.student?.id || '');
                setSelectedSubject(booking.subject_id || booking.subject?.id || '');
            } else {
                setSelectedStudent('');
                setSelectedSubject('');
            }
            
            // Load real data from admin endpoints
            Promise.all([
                api.get('/admin/students?limit=100'),
                api.get('/admin/tutors')
            ]).then(([studentsRes, tutorsRes]) => {
                const studentsData = Array.isArray(studentsRes.data) ? studentsRes.data : (studentsRes.data.data || []);
                const tutorsData = Array.isArray(tutorsRes.data) ? tutorsRes.data : (tutorsRes.data.data || []);

                setStudents(studentsData);
                setTutors(tutorsData);
            }).catch((err: any) => {
                console.error('[TutorAllocation] Fetch failed:', err);
                const msg = err.response?.data?.message || 'Unauthorized: Admin access required.';
                setFetchError(msg);
            }).finally(() => {
                setLoadingData(false);
            });
        } else {
            // Reset state on close
            setSelectedStudent('');
            setSelectedSubject('');
            setSelectedTutor('');
            setFetchError(null);
        }
    }, [isOpen, booking]);

    // Filter tutors based on selected subject
    const availableTutors = selectedSubject
        ? tutors.filter(t => t.subjects?.includes(selectedSubject))
        : tutors;

    const handleAllocate = async () => {
        if (!selectedTutor) return;
        setLoading(true);
        try {
            if (booking && booking.id) {
                // If we're allocating an existing unassigned booking
                await api.patch(`/bookings/${booking.id}/assign-tutor`, {
                    tutorId: selectedTutor
                });
            } else {
                if (!selectedStudent || !selectedSubject) return;
                // Traditional: Create a new allocation booking from scratch
                await api.post('/admin/allocations', {
                    studentId: selectedStudent,
                    subjectId: selectedSubject,
                    tutorId: selectedTutor
                });
            }
            alert('Tutor assigned and session confirmed successfully!');
            window.dispatchEvent(new Event('refresh-bookings-table'));
            onClose();
        } catch (err: any) {
            console.error('[TutorAllocation] Submit failed:', err);
            const msg = err.response?.data?.message || 'Failed to assign tutor. Database or permission issue.';
            alert(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-white/20 dark:border-white/5 p-10 flex flex-col gap-8 relative overflow-hidden">

                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-6">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                        {booking?.tutor ? 'Switch Tutor' : booking ? 'Assign Tutor' : 'Quick Allocation'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {booking?.tutor
                            ? 'Replace the currently assigned tutor for this booking.'
                            : booking
                            ? 'Assign a tutor to this booking.'
                            : 'Select a student, subject, and tutor to create a new allocation.'}
                    </p>
                </div>

                {fetchError ? (
                    <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-4 text-red-600">
                        <AlertCircle size={24} className="shrink-0" />
                        <p className="text-sm font-bold uppercase tracking-tight">{fetchError}</p>
                    </div>
                ) : loadingData ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                        <Loader2 size={40} className="text-blue-500 animate-spin" />
                        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Syncing Directory...</p>
                    </div>
                ) : (
                    <div className="space-y-6 relative z-10">
                        {booking ? (
                            /* When opened for an existing booking — show student & subject as read-only info,
                               admin only needs to pick the tutor */
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                                        {booking.student?.user?.first_name || booking.student?.first_name || '—'}{' '}
                                        {booking.student?.user?.last_name || booking.student?.last_name || ''}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                                        {booking.subject?.name || '—'}
                                    </span>
                                </div>
                                {booking.tutor && (
                                    <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Tutor</span>
                                        <span className="text-sm font-bold text-amber-600">
                                            {booking.tutor.first_name} {booking.tutor.last_name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Fresh allocation — admin selects student + subject manually */
                            <>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Student</label>
                                    <select
                                        value={selectedStudent}
                                        onChange={e => setSelectedStudent(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    >
                                        <option value="">Select Student</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Subject</label>
                                    <select
                                        value={selectedSubject}
                                        onChange={e => { setSelectedSubject(e.target.value); setSelectedTutor(''); }}
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects?.map((s: any) => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Tutor Select — always shown */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                {booking?.tutor ? 'Switch To' : 'Assign Tutor'}
                            </label>
                            <select
                                value={selectedTutor}
                                onChange={e => setSelectedTutor(e.target.value)}
                                disabled={!booking && !selectedSubject}
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none disabled:opacity-50"
                            >
                                <option value="">{(booking || selectedSubject) ? 'Select Tutor' : 'Select Subject First'}</option>
                                {availableTutors.map(t => (
                                    <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
                                ))}
                            </select>
                            {(booking || selectedSubject) && availableTutors.length === 0 && (
                                <p className="text-[10px] font-black text-red-500 mt-2 ml-1 uppercase tracking-tight flex items-center gap-1">
                                    <AlertCircle size={10} />
                                    No tutors found for this subject.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-end gap-4 relative z-10">
                    <button
                        onClick={onClose}
                        className="px-8 py-4 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-black uppercase text-xs tracking-widest transition-colors"
                    >
                        Cancel Transaction
                    </button>
                    <button
                        onClick={handleAllocate}
                        disabled={loading || !selectedTutor || (!booking && (!selectedStudent || !selectedSubject)) || loadingData}
                        className="px-10 py-5 rounded-3xl bg-blue-600 text-white font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 group"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                                Confirm Match
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
