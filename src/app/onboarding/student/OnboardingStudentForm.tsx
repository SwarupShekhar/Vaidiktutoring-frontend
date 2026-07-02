'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import useCatalog from '@/app/Hooks/useCatalog';
import api from '@/app/lib/api';
import ProtectedClient from '@/app/components/ProtectedClient';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

// Zod Schema
const studentSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().optional(),
    grade: z.string().min(1, 'Grade is required'),
    school: z.string().min(1, 'School is required'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    curriculum_preference: z.string().optional(),
    recording_consent_granted: z.boolean().optional(),
});

type FormValues = z.infer<typeof studentSchema>;

export default function OnboardingStudentForm() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { curricula } = useCatalog();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo');

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<FormValues>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            grade: '',
            school: '',
            curriculum_preference: '',
            email: '',
        },
    });

    async function onSubmit(values: FormValues) {
        const promise = api.post('/students', {
            first_name: values.first_name,
            last_name: values.last_name || '',
            grade: values.grade,
            school: values.school,
            email: values.email || null,
            curriculum_preference: values.curriculum_preference || null,
            recording_consent_granted: values.recording_consent_granted || false,
        });

        toast.promise(promise, {
            loading: 'Adding student...',
            success: () => {
                // Invalidate all related queries
                queryClient.invalidateQueries({ queryKey: ['students'] });
                queryClient.invalidateQueries({ queryKey: ['parent-students-count'] });
                queryClient.invalidateQueries({ queryKey: ['parent-students-list'] });

                if (returnTo === 'booking') {
                    router.push('/bookings/new');
                } else {
                    router.push('/parent/dashboard');
                }
                return 'Student added successfully!';
            },
            error: (err) => {
                return (
                    err?.response?.data?.message ||
                    err?.message ||
                    'Failed to create student'
                );
            },
        });
    }

    return (
        <ProtectedClient roles={['parent']}>
            <div className="bg-surface rounded-2xl shadow-lg px-8 py-7 space-y-6 border border-border">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-(--color-text-primary) mb-1">
                                First name
                            </label>
                            <input
                                type="text"
                                {...register('first_name')}
                                className="w-full rounded-lg border border-border bg-background text-(--color-text-primary) px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                            {errors.first_name && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.first_name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-(--color-text-primary) mb-1">
                                Last name
                            </label>
                            <input
                                type="text"
                                {...register('last_name')}
                                className="w-full rounded-lg border border-border bg-background text-(--color-text-primary) px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-(--color-text-primary) mb-1">
                            Student Email (Optional)
                        </label>
                        <input
                            type="email"
                            {...register('email')}
                            placeholder="student@example.com"
                            className="w-full rounded-lg border border-border bg-background text-(--color-text-primary) px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                        />
                        <p className="text-[10px] text-text-secondary mt-1 opacity-70">
                            Provide this if your child has their own account to sync progress automatically!
                        </p>
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-(--color-text-primary) mb-1">
                                Grade
                            </label>
                            <select
                                {...register('grade')}
                                className="w-full rounded-lg border border-border bg-background text-(--color-text-primary) px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="">Select grade</option>
                                {Array.from({ length: 12 }).map((_, idx) => {
                                    const g = (idx + 1).toString();
                                    return (
                                        <option key={g} value={g}>
                                            Grade {g}
                                        </option>
                                    );
                                })}
                            </select>
                            {errors.grade && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.grade.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-(--color-text-primary) mb-1">
                                School
                            </label>
                            <input
                                type="text"
                                {...register('school')}
                                className="w-full rounded-lg border border-border bg-background text-(--color-text-primary) px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                            {errors.school && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.school.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-(--color-text-primary) mb-1">
                            Curriculum preference
                        </label>
                        <select
                            {...register('curriculum_preference')}
                            className="w-full rounded-lg border border-border bg-background text-(--color-text-primary) px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value="">No preference yet</option>
                            {curricula?.map((c: any) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-text-secondary mt-1">
                            We’ll use this to match the right content and tutors.
                        </p>
                    </div>

                    {/* Recording consent (opt-in). Required for a minor's sessions to
                        be recorded; unchecked = live classes only, and it can be
                        enabled later from Profile → Settings. */}
                    <div className="rounded-lg border border-border bg-background p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('recording_consent_granted')}
                                className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-(--color-text-primary)">
                                I consent to my child's live sessions being recorded so they can
                                review them later.
                                <span className="mt-1 block text-xs text-text-secondary">
                                    Optional. Sessions still run live without this. Recordings are
                                    stored securely, visible only to you, your child and the tutor,
                                    and auto-deleted after 30 days. You can change this anytime in
                                    Profile → Settings. See our{' '}
                                    <a href="/legal/privacy" target="_blank" className="underline">
                                        Privacy Policy
                                    </a>
                                    .
                                </span>
                            </span>
                        </label>
                    </div>

                    <div className="flex justify-between pt-2">
                        <button
                            type="button"
                            onClick={() => router.push('/bookings/new')}
                            className="px-4 py-2 rounded-lg border border-border text-sm text-text-secondary hover:bg-surface hover:text-(--color-text-primary) transition-colors"
                        >
                            Back to booking
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium disabled:opacity-60 hover:opacity-90 transition-opacity"
                        >
                            {isSubmitting ? 'Saving…' : 'Save student'}
                        </button>
                    </div>
                </form>
            </div>
        </ProtectedClient>
    );
}
