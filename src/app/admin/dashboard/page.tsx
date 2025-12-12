'use client';

import React from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useAuthContext } from '@/app/context/AuthContext';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const { user } = useAuthContext();

    return (
        <ProtectedClient roles={['admin']}>
            <div className="min-h-screen p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
                <section className="bg-glass rounded-[2rem] p-8 md:p-10 border border-white/20 shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-[var(--color-text-secondary)] text-lg mb-6">
                            Welcome back, {user?.first_name || 'Admin'}.
                        </p>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tutor Management Card */}
                    <div className="bg-glass rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Tutors</h2>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                            Onboard new tutors and manage existing accounts.
                        </p>
                        <Link href="/admin/tutors/new" className="block w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-center rounded-lg transition-colors">
                            + Add New Tutor
                        </Link>
                    </div>

                    {/* Placeholders for other admin features */}
                    <div className="bg-glass rounded-2xl p-6 border border-white/20 shadow-sm opacity-50">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Students</h2>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                            Manage student accounts (Coming Soon).
                        </p>
                        <button disabled className="block w-full py-2 bg-gray-300 dark:bg-gray-700 text-gray-500 font-bold text-center rounded-lg cursor-not-allowed">
                            Manage
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedClient>
    );
}
