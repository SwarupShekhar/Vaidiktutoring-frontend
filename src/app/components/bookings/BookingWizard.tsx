
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Layers, User, GraduationCap, Calendar, CheckCircle } from 'lucide-react';

import useCatalog from '@/app/Hooks/useCatalog';
import api from '@/app/lib/api';
import { useAuthContext } from '@/app/context/AuthContext';

import { SelectionCard } from '@/app/components/ui/SelectionCard';
import { TimeSlotPicker } from '@/app/components/ui/TimeSlotPicker';

// TYPES
type Step = 0 | 1 | 2; // Reduced to 3 steps
// 0: Context (Program -> Student -> Curriculum -> Subjects)
// 1: Logistics (Tutor -> Time)
// 2: Review & Confirm

type StudentOption = {
    id: string;
    name: string;
    programId?: string;
};

interface BookingWizardProps {
    students: StudentOption[];
    isStudentsLoading?: boolean;
}

// MOCK TUTORS (Ideally fetch /programs/:id/staffing)
const MOCK_TUTORS = [
    { id: 't1', name: 'Dr. Sarah Cohen', bio: 'Expert in Advanced Mathematics', programId: '1' },
    { id: 't2', name: 'James Wilson', bio: 'Physics & Chemistry Specialist', programId: '1' },
    { id: 't3', name: 'Emily Blunt', bio: 'Literature & Arts', programId: '2' },
];

export default function BookingWizard({ students, isStudentsLoading = false }: BookingWizardProps) {
    const router = useRouter();
    const { user } = useAuthContext();
    const { subjects, curricula, packages, loading: loadingCatalog } = useCatalog();

    // STATE
    const [step, setStep] = useState<Step>(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Context Data
    const [programs, setPrograms] = useState<any[]>([]);
    const [programId, setProgramId] = useState<string | null>(null);
    const [studentId, setStudentId] = useState<string | null>(null);
    const [curriculumId, setCurriculumId] = useState<string | null>(null);
    const [subjectId, setSubjectId] = useState<string | null>(null); // Single subject for streamlined flow? Or multiple? Let's use single for simplicity or Primary.

    // Logistics Data
    const [tutorId, setTutorId] = useState<string | null>(null);
    const [start, setStart] = useState<string>('');
    const [end, setEnd] = useState<string>('');
    const [note, setNote] = useState('');

    // Auto-select student if logged in as student
    useEffect(() => {
        if (user?.role === 'student' && students.length > 0) {
            // Find student profile matching the user (assuming students array has filtered context or passed relevant student)
            // For now, if only one student passed or matching logic exists, select it.
            // Simplified: If user is student, assume the first student in the list IS them (since parent/admin fetches "all", student fetches "self")
            setStudentId(students[0]?.id || null);
        }
    }, [user, students]);

    // Fetch Programs
    useEffect(() => {
        api.get('/admin/programs')
            .then(res => setPrograms(res.data))
            .catch(err => console.error(err));
    }, []);

    // Derived Lists
    const availableStudents = students.filter(s => !programId || s.programId === programId || true);
    const availableTutors = MOCK_TUTORS.filter(t => !programId || t.programId === programId);

    // Helpers
    const handleTimeSelect = (s: string, e: string) => {
        setStart(s);
        setEnd(e);
    };

    const submitBooking = async () => {
        setSubmitting(true);
        setError(null);
        try {
            await api.post('/bookings', {
                program_id: programId,
                student_id: studentId,
                tutor_id: tutorId,
                subject_ids: subjectId ? [subjectId] : [], // Array for backend
                curriculum_id: curriculumId,
                start_time: start,
                end_time: end,
                note
            });
            // Success Animation or Redirect
            router.push('/admin/dashboard');
        } catch (e) {
            console.error(e);
            setError('Failed to book session. Please try again.');
            setSubmitting(false);
        }
    };

    const canProceed = () => {
        if (step === 0) return !!programId && !!studentId && !!curriculumId && !!subjectId;
        if (step === 1) return !!tutorId && !!start && !!end;
        return true;
    };

    const steps = [
        { title: 'Context', subtitle: 'Program & details' },
        { title: 'Logistics', subtitle: 'Staff & Time' },
        { title: 'Review', subtitle: 'Confirm booking' }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Header / Progress */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                        New Session
                    </h1>
                    <p className="text-gray-400 mt-1">Book a new learning session in 3 simple steps.</p>
                </div>

                {/* Steps Visual */}
                <div className="flex bg-white/5 backdrop-blur-md rounded-2xl p-2 border border-white/10">
                    {steps.map((s, idx) => {
                        const isActive = step === idx;
                        const isDone = step > idx;
                        return (
                            <div key={idx} className="flex items-center">
                                <motion.div
                                    className={`
                                        flex items-center gap-3 px-5 py-2 rounded-xl transition-all
                                        ${isActive ? 'bg-blue-500/20 text-blue-200 border border-blue-500/50' : ''}
                                        ${isDone ? 'text-green-400 opacity-60' : ''}
                                        ${!isActive && !isDone ? 'text-gray-500' : ''}
                                    `}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-blue-500 text-white' : 'bg-white/10'}`}>
                                        {isDone ? <CheckCircle size={14} /> : idx + 1}
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-sm font-bold leading-none">{s.title}</p>
                                        {isActive && <p className="text-[10px] opacity-70 mt-0.5 font-normal">{s.subtitle}</p>}
                                    </div>
                                </motion.div>
                                {idx < 2 && <div className="w-8 h-[1px] bg-white/10 mx-1" />}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ERROR MSG */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-500/20 text-red-200 p-4 rounded-xl border border-red-500/30 mb-6">
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT AREA */}
            <div className="bg-glass border border-white/10 rounded-3xl p-8 min-h-[500px] relative overflow-hidden backdrop-blur-2xl">
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

                <AnimatePresence mode="wait">
                    {/* STEP 0: CONTEXT */}
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 relative z-10"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Left Col: Program & Student */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2"><Layers className="text-blue-400" size={20} /> Program Context</h2>
                                    <div className="grid grid-cols-1 gap-3 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
                                        {programs.map(p => (
                                            <SelectionCard
                                                key={p.id}
                                                id={p.id}
                                                title={p.name}
                                                selected={programId === p.id}
                                                onClick={() => setProgramId(p.id)}
                                                icon={<Layers size={18} />}
                                            />
                                        ))}
                                    </div>

                                    {/* Student Selection (Hidden if Student Role) */}
                                    {user?.role !== 'student' && (
                                        <>
                                            <h2 className="text-xl font-bold flex items-center gap-2 mt-4"><User className="text-violet-400" size={20} /> Student</h2>
                                            <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
                                                {availableStudents.map(s => (
                                                    <SelectionCard
                                                        key={s.id}
                                                        id={s.id}
                                                        title={s.name}
                                                        subtitle={s.programId ? 'Program Enrolled' : 'General'}
                                                        selected={studentId === s.id}
                                                        onClick={() => setStudentId(s.id)}
                                                        icon={<User size={18} />}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Right Col: Curriculum & Subject */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2"><GraduationCap className="text-pink-400" size={20} /> Curriculum Details</h2>

                                    <div className="space-y-4">
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Curriculum</label>
                                            <div className="flex flex-wrap gap-2">
                                                {curricula?.map((c: any) => (
                                                    <button
                                                        key={c.id}
                                                        onClick={() => setCurriculumId(c.id)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${curriculumId === c.id
                                                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                                                            : 'bg-transparent border-white/10 hover:bg-white/5 text-gray-300'
                                                            }`}
                                                    >
                                                        {c.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Primary Subject</label>
                                            <div className="flex flex-wrap gap-2">
                                                {subjects?.map((s: any) => (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => setSubjectId(s.id)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${subjectId === s.id
                                                            ? 'bg-violet-600 border-violet-500 text-white shadow-lg'
                                                            : 'bg-transparent border-white/10 hover:bg-white/5 text-gray-300'
                                                            }`}
                                                    >
                                                        {s.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 1: LOGISTICS */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 relative z-10"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                {/* Left: Tutors (4 cols) */}
                                <div className="lg:col-span-4 space-y-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <User className="text-orange-400" size={20} /> Select Tutor
                                    </h2>
                                    <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                                        {availableTutors.map(t => (
                                            <SelectionCard
                                                key={t.id}
                                                id={t.id}
                                                title={t.name}
                                                subtitle={t.bio}
                                                selected={tutorId === t.id}
                                                onClick={() => setTutorId(t.id)}
                                            />
                                        ))}
                                        {availableTutors.length === 0 && <p className="text-gray-500 italic">No tutors found for this program.</p>}
                                    </div>
                                </div>

                                {/* Right: Time Picker (8 cols) */}
                                <div className="lg:col-span-8 space-y-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Calendar className="text-green-400" size={20} /> Schedule Session
                                    </h2>
                                    <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                                        <TimeSlotPicker
                                            start={start}
                                            end={end}
                                            onSelect={handleTimeSelect}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: REVIEW */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-2xl mx-auto space-y-8 relative z-10"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">Ready to Book?</h2>
                                <p className="text-gray-400">Please review session details before confirming.</p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl">
                                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                    <span className="text-gray-400">Program</span>
                                    <span className="text-xl font-bold text-white">{programs.find(p => p.id === programId)?.name}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Student</p>
                                        <p className="text-lg font-medium text-blue-200">{students.find(s => s.id === studentId)?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Tutor</p>
                                        <p className="text-lg font-medium text-orange-200">{MOCK_TUTORS.find(t => t.id === tutorId)?.name}</p>
                                    </div>
                                </div>

                                <div className="bg-black/20 rounded-xl p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Date & Time</p>
                                        <p className="text-white font-mono text-lg">
                                            {start ? format(new Date(start), 'EEE, MMM d') : '-'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-400">
                                            {start ? format(new Date(start), 'h:mm a') : '-'}
                                        </p>
                                        <p className="text-xs text-gray-500">to {end ? format(new Date(end), 'h:mm a') : '-'}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">Subject Context</p>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs border border-blue-500/30">
                                            {curricula?.find((c: any) => c.id === curriculumId)?.name}
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs border border-violet-500/30">
                                            {subjects?.find((s: any) => s.id === subjectId)?.name}
                                        </span>
                                    </div>
                                </div>

                                <textarea
                                    placeholder="Add notes for the tutor..."
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                                    rows={3}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ACTION BAR */}
            <div className="flex justify-between items-center mt-6">
                <button
                    disabled={step === 0 || submitting}
                    onClick={() => setStep(s => Math.max(0, s - 1) as Step)}
                    className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium disabled:opacity-0"
                >
                    Back
                </button>

                {step < 2 ? (
                    <button
                        onClick={() => setStep(s => Math.min(2, s + 1) as Step)}
                        disabled={!canProceed()}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold shadow-lg shadow-blue-900/40 transform hover:scale-105 transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                    >
                        Continue
                    </button>
                ) : (
                    <button
                        onClick={submitBooking}
                        disabled={submitting}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold shadow-lg shadow-green-900/40 transform hover:scale-105 transition-all text-lg flex items-center gap-2 disabled:opacity-50"
                    >
                        {submitting ? 'Creating Session...' : 'Confirm & Book'} <CheckCircle size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}