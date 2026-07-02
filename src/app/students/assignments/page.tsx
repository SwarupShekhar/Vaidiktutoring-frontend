'use client';

import React from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import StudentAssignmentsList from '@/app/components/assignments/StudentAssignmentsList';
import { useIsAppShell } from '@/app/Hooks/useIsAppShell';
import Link from 'next/link';
import { ChevronLeft, ListChecks } from 'lucide-react';
import { AppPage, AppPageItem, AppPageHeader } from '@/app/components/app-shell/ui';

export default function StudentAssignmentsPage() {
    const isAppShell = useIsAppShell();

    if (isAppShell) {
        return (
            <ProtectedClient roles={['student']}>
                <AppPage>
                    <AppPageItem>
                        <AppPageHeader
                            icon={ListChecks}
                            accent="amber"
                            eyebrow="My Homework"
                            title="Assignments"
                            subtitle="Homework and ratings your tutors have assigned."
                        />
                    </AppPageItem>
                    <AppPageItem>
                        <StudentAssignmentsList />
                    </AppPageItem>
                </AppPage>
            </ProtectedClient>
        );
    }

    return (
        <ProtectedClient roles={['student']}>
            <div className={isAppShell ? 'p-4 md:p-8 w-full space-y-8 animate-in fade-in slide-in-from-top-4 duration-700' : 'min-h-screen p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-700'}>
                <div className="flex items-center gap-4 mb-8">
                    {!isAppShell && (
                        <Link href="/students/dashboard" className="p-2 bg-surface border border-border rounded-xl hover:bg-surface-secondary transition-colors">
                            <ChevronLeft size={20} className="text-text-secondary" />
                        </Link>
                    )}
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-1">My Homework</p>
                        <h1 className="text-3xl font-black text-(--color-text-primary) tracking-tighter">Assignments</h1>
                    </div>
                </div>

                <StudentAssignmentsList />
            </div>
        </ProtectedClient>
    );
}
