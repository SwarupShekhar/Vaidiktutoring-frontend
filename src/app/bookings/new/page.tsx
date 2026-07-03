// src/app/bookings/new/page.tsx
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import ProtectedClient from '@/app/components/ProtectedClient';
import BookingWizard from '@/app/components/bookings/BookingWizard';
import { useAuthContext } from '@/app/context/AuthContext';
import { useCreditStatus } from '@/app/Hooks/useCreditStatus';
import { useIsAppShell } from '@/app/Hooks/useIsAppShell';
import { useRouter } from 'next/navigation';

interface StudentSummary {
    id: string;
    name: string;
}

export default function NewBookingPage() {
    const { user } = useAuthContext();
    const router = useRouter();
    const isAppShell = useIsAppShell();
    const isParent = user?.role === 'parent';
    const { status: creditStatus } = useCreditStatus();

    const shouldRedirect = creditStatus && !creditStatus.canBook && user?.role === 'student';

    // Redirect to dashboard if student can't book
    React.useEffect(() => {
        if (shouldRedirect) {
            router.push('/students/dashboard');
        }
    }, [shouldRedirect, router]);

    if (shouldRedirect) return null;

    const {
        data: students = [],
        isError,
        error,
        isLoading,
    } = useQuery<StudentSummary[]>({
        queryKey: ['students', isParent ? 'parent' : 'self'],
        queryFn: async () => {
            // If user is a student, they can only book for themselves
            if (!isParent && user) {
                // Use a valid UUID placeholder because backend DTO requires UUID, 
                // but Backend Service ignores valid UUID and uses req.user.id to find/create student profile.
                return [{ id: '00000000-0000-0000-0000-000000000000', name: user.first_name || 'Me' }];
            }

            try {
                // this is the backend route we built earlier
                const res = await api.get('/students/parent');
                return res.data.map((s: any) => ({
                    id: s.id,
                    name: s.name || (s.school ? `${s.school} - Grade ${s.grade}` : s.id),
                }));
            } catch (err: any) {
                // If backend hasn't implemented /students/parent yet or returns 404,
                // treat it as "no students yet" instead of a hard error.
                if (err?.response?.status === 404) {
                    return [];
                }
                throw err;
            }
        },
        enabled: !!user, // only run if user is loaded
        staleTime: 30_000,
    });

    // Only show the big red banner if it's a *real* error, not just 404
    const hardError =
        isError && (error as any)?.response?.status !== 404;

    // ---- Desktop app-shell premium view: BookingWizard owns its own AppPage
    // layout (matches Vault/Notes/etc.), so this branch just supplies the
    // phone-verify nudge above it. Web path (below) is unchanged. ----
    if (isAppShell) {
        return (
            <ProtectedClient roles={['parent', 'student']}>
                {(hardError || (user && user.phone_verified === false)) && (
                    <div className="max-w-xl mx-auto px-4 pt-6 space-y-3">
                        {hardError && (
                            <div className="rounded-xl px-4 py-3 text-sm bg-rose-500/10 border border-rose-500/30 text-rose-300">
                                Could not load students. Please refresh the page.
                            </div>
                        )}
                        {user && user.phone_verified === false && (
                            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📱</span>
                                    <div>
                                        <p className="text-sm font-semibold text-amber-300">
                                            Add your phone number
                                        </p>
                                        <p className="text-xs text-amber-400/80">
                                            Verify your number for session reminders and account security.
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href="/verify-phone"
                                    className="shrink-0 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors"
                                >
                                    Verify now →
                                </a>
                            </div>
                        )}
                    </div>
                )}
                <BookingWizard students={students} isStudentsLoading={isLoading} />
            </ProtectedClient>
        );
    }

    return (
        <ProtectedClient roles={['parent', 'student']}>
            <div className="max-w-5xl mx-auto px-6 py-10">
                {hardError && (
                    <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        Could not load students. Please refresh the page.
                    </div>
                )}

                {user && user.phone_verified === false && (
                    <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📱</span>
                            <div>
                                <p className="text-sm font-semibold text-amber-800">
                                    Add your phone number
                                </p>
                                <p className="text-xs text-amber-700">
                                    Verify your number for session reminders and account security.
                                </p>
                            </div>
                        </div>
                        <a
                            href="/verify-phone"
                            className="shrink-0 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors"
                        >
                            Verify now →
                        </a>
                    </div>
                )}

                <BookingWizard students={students} isStudentsLoading={isLoading} />
            </div>
        </ProtectedClient>
    );
}