'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import ProtectedClient from '@/app/components/ProtectedClient';
import api from '@/app/lib/api';
import useCatalog from '@/app/Hooks/useCatalog';

type CreateStudentForm = {
    first_name: string;
    last_name: string;
    grade: string;
    school: string;
    curriculum_preference?: string;
    interests_raw?: string;
    recent_focus?: string;
    struggle_areas_raw?: string;
};

export default function AddStudentOnboardingPage() {
    const router = useRouter();
    const { curricula } = useCatalog();
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<CreateStudentForm>();
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(values: CreateStudentForm) {
        setError(null);
        try {
            await api.post('/students', {
                first_name: values.first_name,
                last_name: values.last_name,
                grade: values.grade,
                school: values.school,
                curriculum_preference: values.curriculum_preference || null,
                interests: values.interests_raw ? values.interests_raw.split(',').map(i => i.trim()).filter(Boolean) : [],
                recent_focus: values.recent_focus || '',
                struggle_areas: values.struggle_areas_raw ? values.struggle_areas_raw.split(',').map(i => i.trim()).filter(Boolean) : [],
            });

            // Redirect to dashboard after successful add
            router.push('/parent/dashboard');
        } catch (err: any) {
            console.error('Create student error', err);
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Could not create student. Please try again.';
            setError(msg);
        }
    }

    return (
        <ProtectedClient roles={['parent']}>
            <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 p-6">

                {/* Animated Blobs Background - Reusing style for consistency */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-900/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[100px] animate-blob"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-900/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[100px] animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative z-10 w-full max-w-2xl">
                    <div className="bg-white/80 dark:bg-black/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[2rem] shadow-2xl p-8 md:p-10">

                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Add your child
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Tell us about your child so we can personalize their learning experience.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-sm text-red-600 dark:text-red-400 font-medium text-center">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">First Name</label>
                                    <input
                                        {...register('first_name', { required: true })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all font-medium"
                                        placeholder="Alex"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Last Name</label>
                                    <input
                                        {...register('last_name', { required: true })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all font-medium"
                                        placeholder="Smith"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Current Grade</label>
                                    <select
                                        {...register('grade', { required: true })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all appearance-none font-medium"
                                    >
                                        <option value="">Select Grade</option>
                                        {Array.from({ length: 12 }).map((_, idx) => (
                                            <option key={idx + 1} value={(idx + 1).toString()}>Grade {idx + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">School Name</label>
                                    <input
                                        {...register('school', { required: true })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all font-medium"
                                        placeholder="Springfield High"
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-100 dark:border-gray-800" />

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">What are their interests?</label>
                                <input
                                    {...register('interests_raw')}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all font-medium"
                                    placeholder="e.g. Minecraft, Space Exploration, Piano"
                                />
                                <p className="text-[10px] text-gray-400 ml-1">Separate interests with commas</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Current Learning Focus</label>
                                <textarea
                                    {...register('recent_focus')}
                                    rows={2}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all font-medium"
                                    placeholder="e.g. Mastered 2D geometry, now moving to coordinate planes."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Known Challenges / Struggles</label>
                                <input
                                    {...register('struggle_areas_raw')}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all font-medium"
                                    placeholder="e.g. Word problems, fractions, focus"
                                />
                                <p className="text-[10px] text-gray-400 ml-1">Separate with commas</p>
                            </div>

                            <div className="pt-4 flex items-center justify-between gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors uppercase text-xs tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black hover:opacity-90 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed uppercase text-xs tracking-widest"
                                >
                                    {isSubmitting ? 'Syncing...' : 'Activate Student Account →'}
                                </button>
                            </div>

                        </form>
                    </div>
                    <p className="text-center mt-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        Student Initialization Core
                    </p>
                </div>
            </div>
        </ProtectedClient>
    );
}
