'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import ProtectedClient from '@/app/components/ProtectedClient';
import api from '@/app/lib/api';

type CreateStudentForm = {
    first_name: string;
    last_name: string;
    grade: string;
    school: string;
    curriculum_preference?: string;
};

import useCatalog from '@/app/Hooks/useCatalog';

// ... (imports)

export default function NewStudentPage() {
    const router = useRouter();
    const { curricula } = useCatalog(); // Get curricula from catalog
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<CreateStudentForm>();
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState(false);

    async function onSubmit(values: CreateStudentForm) {
        setError(null);
        setSuccess(false);
        try {
            const payload = {
                first_name: values.first_name,
                last_name: values.last_name,
                grade: values.grade,
                school: values.school,
                curriculum_preference: values.curriculum_preference || null,
            };

            await api.post('/students', payload);

            setSuccess(true);

            // After creating a child, send them to the booking flow
            router.push('/bookings/new');
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
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="w-full max-w-xl bg-white/80 backdrop-blur rounded-3xl shadow-lg p-6 md:p-8 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold text-slate-900">
                            Add your child
                        </h1>
                        <p className="text-sm text-slate-500">
                            We use this information to personalise sessions and match your child
                            with suitable tutors and curricula.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">
                                    First Name
                                </label>
                                <input
                                    {...register('first_name', { required: true })}
                                    placeholder="Child's first name"
                                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A5A]/70"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">
                                    Last Name
                                </label>
                                <input
                                    {...register('last_name', { required: true })}
                                    placeholder="Child's last name"
                                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A5A]/70"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">
                                    Grade
                                </label>
                                <select
                                    {...register('grade', { required: true })}
                                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A5A]/70 bg-white"
                                >
                                    <option value="">Select a grade</option>
                                    {Array.from({ length: 12 }).map((_, idx) => {
                                        const g = (idx + 1).toString();
                                        return (
                                            <option key={g} value={g}>
                                                Grade {g}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">
                                    School
                                </label>
                                <input
                                    {...register('school', { required: true })}
                                    placeholder="eg: Central School"
                                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A5A]/70"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-slate-700">
                                Curriculum (optional)
                            </label>
                            <select
                                {...register('curriculum_preference')}
                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A5A]/70 bg-white"
                            >
                                <option value="">No preference yet</option>
                                {curricula?.map((c: any) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-500 mt-1">
                                This helps us align content and assessments with the right standard.
                            </p>
                        </div>

                        {/* ... (error, success, buttons) */}

                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                                Child added successfully. Redirecting you to the booking flow.
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 rounded-xl bg-[#1C3A5A] text-white text-sm font-medium shadow-sm hover:opacity-90 disabled:opacity-60"
                            >
                                {isSubmitting ? 'Saving...' : 'Save and continue'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedClient>
    );
}