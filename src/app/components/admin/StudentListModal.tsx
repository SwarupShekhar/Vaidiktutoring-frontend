'use client';
import React, { useEffect, useState } from 'react';
import api from '@/app/lib/api';

interface Student {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    grade?: string;
    enrollment_status: string;
    subscription_plan?: string;
    subscription_credits: number;
    assigned_tutor_name?: string;
    // Potentially nested user object from backend
    user?: {
        first_name: string;
        last_name: string;
        email?: string;
    };
}

interface StudentListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function StudentListModal({ isOpen, onClose }: StudentListModalProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            api.get('/admin/students')
                .then(res => {
                    const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
                    console.log('[Admin] Student List Data:', data);
                    setStudents(data);
                })
                .catch(() => {
                    setStudents([]);
                })
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'learning':
                return <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Learning</span>;
            case 'trial':
                return <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">Trial</span>;
            case 'paused':
                return <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">Paused</span>;
            default:
                return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider">{status}</span>;
        }
    };

    const getPlanBadge = (plan?: string) => {
        if (!plan) return <span className="text-gray-400 text-[10px] font-bold uppercase">No Plan</span>;
        const colors: Record<string, string> = {
            elite: 'bg-indigo-100 text-indigo-700',
            mastery: 'bg-blue-100 text-blue-700',
            foundation: 'bg-violet-100 text-violet-700',
        };
        const colorClass = colors[plan.toLowerCase()] || 'bg-gray-100 text-gray-700';
        return <span className={`px-2 py-1 rounded-full ${colorClass} text-[10px] font-bold uppercase tracking-wider`}>{plan}</span>;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-5xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl border border-white/10">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Registered Students</h2>
                        <p className="text-xs text-gray-500 mt-1">Manage enrollments, plans, and session credits.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-0">
                    {loading ? (
                        <div className="p-12 flex flex-col items-center justify-center gap-4">
                            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            <div className="text-center text-gray-500 font-medium">Loading student matrix...</div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                                <tr>
                                    <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Name</th>
                                    <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Status</th>
                                    <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Plan</th>
                                    <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center text-indigo-500">Tutor</th>
                                    <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Credits</th>
                                    <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Grade</th>
                                    <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Email</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {students.map(student => (
                                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-bold text-gray-800 dark:text-gray-200">
                                            {(student.user?.first_name || student.first_name || '-') + ' ' + (student.user?.last_name || student.last_name || '')}
                                        </td>
                                        <td className="p-4 text-center">
                                            {getStatusBadge(student.enrollment_status)}
                                        </td>
                                        <td className="p-4 text-center">
                                            {getPlanBadge(student.subscription_plan)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                                {student.assigned_tutor_name || <span className="text-gray-300 italic">Not Assigned</span>}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`font-mono font-bold ${student.subscription_credits > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {student.subscription_credits}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Grade {student.grade || 'N/A'}</td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400 font-mono text-[10px] truncate max-w-[150px]">{student.email || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
