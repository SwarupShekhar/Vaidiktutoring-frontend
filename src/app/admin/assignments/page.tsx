'use client';

import React from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import CreateAssignmentSection from '@/app/components/assignments/CreateAssignmentSection';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function AdminAssignmentsPage() {
    return (
        <ProtectedClient roles={['admin', 'tutor']}>
            <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="p-2 bg-surface border border-border rounded-xl hover:bg-surface-secondary transition-colors">
                        <ChevronLeft size={20} className="text-text-secondary" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-(--color-text-primary) tracking-tighter">Assignments</h1>
                        <p className="text-sm text-text-secondary">Create and manage assignments linked to Vault assets.</p>
                    </div>
                </div>

                <CreateAssignmentSection />
            </div>
        </ProtectedClient>
    );
}
