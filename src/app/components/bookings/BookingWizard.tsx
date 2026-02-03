
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Layers, User, GraduationCap, Calendar, CheckCircle, ChevronDown } from 'lucide-react';

import useCatalog from '@/app/Hooks/useCatalog';
import api from '@/app/lib/api';
import { useAuthContext } from '@/app/context/AuthContext';

import { SelectionCard } from '@/app/components/ui/SelectionCard';
import { TimeSlotPicker } from '@/app/components/ui/TimeSlotPicker';

// --- COMPONENTS ---
interface GlassSelectProps {
    label: string;
    value: string | null;
    options: { id: string; label: string }[];
    onChange: (val: string) => void;
    placeholder?: string;
    icon?: React.ReactNode;
}

function GlassSelect({ label, value, options, onChange, placeholder, icon }: GlassSelectProps) {
    const [open, setOpen] = useState(false);
    const selected = options.find(o => o.id === value);

    return (
        <div className="relative">
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block ml-1">{label}</label>
            <button
                onClick={() => setOpen(!open)}
                onBlur={() => setTimeout(() => setOpen(false), 200)} // Delay to allow click
                className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all
                    bg-black/20 hover:bg-black/30 text-left
                    ${open ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-white/10 hover:border-white/20'}
                `}
            >
                <div className="flex items-center gap-3">
                    {icon && <span className="opacity-50">{icon}</span>}
                    <span className={selected ? 'text-white' : 'text-gray-400'}>
                        {selected?.label || placeholder}
                    </span>
                </div>
                <ChevronDown size={16} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''} opacity-50`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden max-h-[250px] overflow-y-auto scrollbar-thin"
                    >
                        {options.length === 0 ? (
                            <div className="p-3 text-gray-500 text-sm text-center italic">No options available</div>
                        ) : (
                            options.map(opt => (
                                <button
                                    key={opt.id}
                                    onMouseDown={(e) => {
                                        e.preventDefault(); // Prevent blur
                                        onChange(opt.id);
                                        setOpen(false);
                                    }}
                                    className={`
                                        w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between
                                        ${value === opt.id ? 'bg-blue-600/20 text-blue-200' : 'hover:bg-white/5 text-gray-300'}
                                    `}
                                >
                                    {opt.label}
                                    {value === opt.id && <CheckCircle size={14} className="text-blue-400" />}
                                </button>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

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
    { id: 'E43E0C7C-AB33-4509-AF51-70AA40C19E79', name: 'Dr. Sarah Cohen', bio: 'Expert in Advanced Mathematics', programId: '043E5B59-A4EE-4BE0-9101-440043279A50' },
    { id: '8B126AD8-FEA0-4817-97F5-89E752E52611', name: 'James Wilson', bio: 'Physics & Chemistry Specialist', programId: '043E5B59-A4EE-4BE0-9101-440043279A50' },
    { id: '387C72DD-47C1-421A-94BE-9B253A1E7BD9', name: 'Emily Blunt', bio: 'Literature & Arts', programId: '9BF3F499-AC9C-4502-B737-65FD135C024B' },
];

const MOCK_PROGRAMS = [
    { id: '043E5B59-A4EE-4BE0-9101-440043279A50', name: 'K-12 Academic Tutoring' },
    { id: '9BF3F499-AC9C-4502-B737-65FD135C024B', name: 'Standardized Test Prep (SAT/ACT)' },
    { id: '12345678-1234-1234-1234-123456789abc', name: 'College Admissions Counseling' } // Placeholder UUID
];

export default function BookingWizard({ students, isStudentsLoading = false }: BookingWizardProps) {
    const router = useRouter();
    const { user } = useAuthContext();
    const queryClient = useQueryClient();
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
            .then(res => {
                let data = res.data;
                if (!data || data.length === 0) {
                    console.warn('No programs found in DB. Using MOCK data for design validation.');
                    data = MOCK_PROGRAMS;
                }
                setPrograms(data);
                // Auto-select if only one program
                if (data.length === 1) {
                    setProgramId(data[0].id);
                }
            })
            .catch(err => {
                console.error(err);
                // Fallback to mocks on error too for resilience during design phase
                setPrograms(MOCK_PROGRAMS);
                // setError('Failed to load programs. Using mock data.'); 
            });
    }, []);

    // Auto-select student if logged in as student OR if only 1 student available
    useEffect(() => {
        if (students.length > 0) {
            if (user?.role === 'student') {
                setStudentId(students[0]?.id || null);
            } else if (students.length === 1) {
                // Auto-select for parent if only 1 student
                setStudentId(students[0].id);
            }
        }
    }, [user, students]);

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

        // Auto-select first package if not explicitly chosen
        const pkgId = packages?.[0]?.id;
        if (!pkgId) {
            setError('System Error: No service packages available. Please contact admin.');
            setSubmitting(false);
            return;
        }

        try {
            await api.post('/bookings/create', {
                program_id: programId,
                student_id: studentId,
                // tutor_id: tutorId, 
                subject_ids: subjectId ? [subjectId] : [],
                curriculum_id: curriculumId,
                package_id: pkgId, // Required by backend
                requested_start: start, // Matches DTO
                requested_end: end,     // Matches DTO
                note
            });

            // Invalidate queries to refresh dashboard
            queryClient.invalidateQueries({ queryKey: ['student-bookings'] });
            queryClient.invalidateQueries({ queryKey: ['parent-upcoming-sessions'] });

            // Success Animation or Redirect
            // Role-based redirect
            if (user?.role === 'admin') {
                router.push('/admin/dashboard');
            } else if (user?.role === 'parent') {
                router.push('/parent/dashboard');
            } else {
                router.push('/students/dashboard');
            }
        } catch (e: any) {
            console.error('Booking Error:', e);
            if (e.response && e.response.data) {
                console.error('Validation Errors:', JSON.stringify(e.response.data, null, 2));
            }
            const msg = e.response?.data?.message || 'Failed to book session. Please try again.';
            setError(msg);
            setSubmitting(false);
        }
    };

    const canProceed = () => {
        if (step === 0) return !!programId && !!studentId && !!curriculumId && !!subjectId;
        if (step === 1) return !!start && !!end;
        return true;
    };

    const steps = [
        { title: 'Context', subtitle: 'Program & details' },
        { title: 'Schedule', subtitle: 'Select Time' },
        { title: 'Review', subtitle: 'Confirm Request' }
    ];

    return (
        <div className="w-full max-w-xl mx-auto">
            {/* Header / Progress */}
            <div className="mb-10 flex flex-col items-center justify-between gap-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                        New Session
                    </h1>
                    <p className="text-gray-400 mt-1">Request a session in 3 simple steps.</p>
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
                            <div className="max-w-xl mx-auto space-y-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                                    <Layers className="text-blue-400" size={20} /> Session Configuration
                                </h2>

                                {/* Program Dropdown */}
                                <GlassSelect
                                    label="Program"
                                    value={programId}
                                    options={programs.map(p => ({ id: p.id, label: p.name }))}
                                    onChange={setProgramId}
                                    placeholder="Select a Program"
                                    icon={<Layers size={16} />}
                                />

                                {/* Student Dropdown (Hidden if Student Role) */}
                                {user?.role !== 'student' && (
                                    <GlassSelect
                                        label="Student"
                                        value={studentId}
                                        options={availableStudents.map(s => ({ id: s.id, label: s.name }))}
                                        onChange={setStudentId}
                                        placeholder="Select a Student"
                                        icon={<User size={16} />}
                                    />
                                )}

                                {/* Curriculum Dropdown */}
                                <GlassSelect
                                    label="Curriculum"
                                    value={curriculumId}
                                    options={curricula?.map((c: any) => ({ id: c.id, label: c.name })) || []}
                                    onChange={setCurriculumId}
                                    placeholder="Select a Curriculum"
                                    icon={<GraduationCap size={16} />}
                                />

                                {/* Subject Dropdown */}
                                <GlassSelect
                                    label="Subject"
                                    value={subjectId}
                                    options={subjects?.map((s: any) => ({ id: s.id, label: s.name })) || []}
                                    onChange={setSubjectId}
                                    placeholder="Select a Subject"
                                    icon={<Layers size={16} />} // Using Layers as generic placeholder if no specific subject icon
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 1: LOGISTICS (SCHEDULE ONLY) */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-xl mx-auto space-y-8 relative z-10"
                        >
                            <div className="space-y-6">
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
                                        <p className="text-lg font-medium text-orange-200 italic">To Be Assigned</p>
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
                    <div className="flex flex-col items-end">
                        <button
                            onClick={() => setStep(s => Math.min(2, s + 1) as Step)}
                            disabled={!canProceed()}
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold shadow-lg shadow-blue-900/40 transform hover:scale-105 transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                        >
                            Continue
                        </button>
                        {!canProceed() && step === 0 && (
                            <p className="text-xs text-red-400 mt-2 font-medium">
                                {!programId ? 'Select a Program' :
                                    !studentId ? 'Select a Student' :
                                        !curriculumId ? 'Select a Curriculum' :
                                            !subjectId ? 'Select a Subject' : ''}
                            </p>
                        )}
                        {!canProceed() && step === 1 && (
                            <p className="text-xs text-red-400 mt-2 font-medium">
                                {(!start || !end) ? 'Select a Time' : ''}
                            </p>
                        )}
                    </div>
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