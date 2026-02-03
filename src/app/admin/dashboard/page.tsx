'use client';

import React, { useState } from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import StudentListModal from '@/app/components/admin/StudentListModal';
import TutorAllocationModal from '@/app/components/admin/TutorAllocationModal';
import TutorListModal from '@/app/components/admin/TutorListModal';
import { useAuthContext } from '@/app/context/AuthContext';
import Link from 'next/link';
import api from '@/app/lib/api';
import BookingsTableSection from '@/app/components/admin/BookingsTableSection';
import BlogManagementSection from '@/app/components/admin/BlogManagementSection';
import { StatCard } from '@/app/components/dashboard/StatCard';
import {
    Users,
    GraduationCap,
    UserCheck,
    Calendar,
    Zap,
    Plus,
    PenTool,
    Activity,
    ShieldCheck,
    ChevronRight
} from 'lucide-react';

export default function AdminDashboardPage() {
    const { user } = useAuthContext();
    const [stats, setStats] = React.useState({ students: 0, parents: 0, tutors: 0, upcomingSessions: 0 });
    const [loading, setLoading] = React.useState(true);

    // Modal states
    const [showStudents, setShowStudents] = useState(false);
    const [showAllocation, setShowAllocation] = useState(false);
    const [showTutors, setShowTutors] = useState(false);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data || { students: 0, parents: 0, tutors: 0, upcomingSessions: 0 });
            } catch (e) {
                console.warn('Failed to fetch admin stats', e);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Auto-refresh stats every 10 seconds for a "Live" feel
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <ProtectedClient roles={['admin']}>
            <div className="min-h-screen p-4 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">

                {/* HEADER SECTION */}
                <header className="bg-glass rounded-[2rem] p-8 md:p-10 border border-white/20 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500/10 rounded-lg relative">
                                    <ShieldCheck className="text-blue-500" size={20} />
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[var(--color-bg)] animate-pulse" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-blue-500">Operation Center</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                                {getGreeting()}, {user?.firstName || user?.first_name || 'Swarup'}
                            </h1>
                            <p className="text-[var(--color-text-secondary)] text-lg mt-2 opacity-80 font-medium">
                                Everything is running smoothly. Here is your overview.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAllocation(true)}
                                className="px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:scale-[1.03] active:scale-95 transition-all text-sm flex items-center gap-2"
                            >
                                <Zap size={18} />
                                Quick Allocation
                            </button>
                        </div>
                    </div>
                </header>

                {/* ANALYTICS SECTION */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div onClick={() => setShowStudents(true)} className="cursor-pointer group">
                        <StatCard
                            icon={GraduationCap}
                            label="Total Students"
                            value={stats.students}
                            color="#3b82f6"
                            description="Active learners"
                            loading={loading}
                        />
                    </div>
                    <StatCard
                        icon={Users}
                        label="Total Parents"
                        value={stats.parents}
                        color="#8b5cf6"
                        description="Family accounts"
                        loading={loading}
                    />
                    <div onClick={() => setShowTutors(true)} className="cursor-pointer group">
                        <StatCard
                            icon={UserCheck}
                            label="Total Tutors"
                            value={stats.tutors}
                            color="#f59e0b"
                            description="Verified experts"
                            loading={loading}
                        />
                    </div>
                    <StatCard
                        icon={Calendar}
                        label="Sessions"
                        value={stats.upcomingSessions}
                        color="#10b981"
                        description="Coming up next"
                        loading={loading}
                    />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* MANAGEMENT CONTROLS */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-glass rounded-3xl p-8 border border-white/20 shadow-sm relative overflow-hidden">
                            <h2 className="text-2xl font-black text-[var(--color-text-primary)] mb-6 flex items-center gap-3">
                                <Zap className="text-yellow-500" size={24} />
                                Tutor Management
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => setShowAllocation(true)}
                                    className="p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg hover:scale-[1.02] active:scale-95 transition-all group flex flex-col justify-between"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                                        <Zap size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-lg leading-tight">Allocate Tutor</p>
                                        <p className="text-xs text-white/70 mt-1">Assign to student</p>
                                    </div>
                                </button>

                                <Link href="/admin/tutors/new" className="p-6 rounded-2xl bg-white/40 border border-white/40 hover:bg-white/60 transition-all group flex flex-col justify-between hover:border-blue-400">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Plus size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-lg leading-tight text-[var(--color-text-primary)]">Add Tutor</p>
                                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">Onboard expert</p>
                                    </div>
                                </Link>

                                <Link href="/admin/blogs/new" className="p-6 rounded-2xl bg-white/40 border border-white/40 hover:bg-white/60 transition-all group flex flex-col justify-between hover:border-pink-400">
                                    <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <PenTool size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-lg leading-tight text-[var(--color-text-primary)]">Publish Blog</p>
                                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">Write new post</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* BOOKINGS TABLE SECTION */}
                        <div className="bg-glass rounded-3xl p-6 border border-white/20 shadow-sm">
                            <BookingsTableSection />
                        </div>
                    </div>

                    {/* SIDEBAR: SYSTEM HEALTH & ACTIVITY */}
                    <div className="space-y-6">
                        <div className="bg-glass rounded-3xl p-8 border border-white/20 shadow-sm">
                            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-3">
                                <Activity className="text-green-500" size={20} />
                                System Health
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-green-50/50 border border-green-100">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="text-green-600" size={18} />
                                        <span className="text-sm font-bold text-green-800">Backups Active</span>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest opacity-60">
                                        <span>Status</span>
                                        <span>Live</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                                        <span className="text-sm">API Server</span>
                                        <span className="text-xs font-black text-green-500">OPERATIONAL</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                                        <span className="text-sm">DB Cluster</span>
                                        <span className="text-xs font-black text-green-500">STABLE</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* REFRESH / ACTION CARD */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-1 shadow-xl">
                            <div className="bg-glass p-8 rounded-[1.4rem] text-white">
                                <h3 className="font-bold text-xl mb-2">Need Help?</h3>
                                <p className="text-sm text-white/80 mb-6 leading-relaxed">Check the documentation or contact system support for assistance.</p>
                                <button className="w-full py-4 bg-white text-blue-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-all">
                                    View Support Docs
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BLOG MANAGEMENT SECTION */}
                <div className="bg-glass rounded-3xl p-6 border border-white/20 shadow-sm">
                    <BlogManagementSection />
                </div>
            </div>

            {/* MODALS */}
            <StudentListModal isOpen={showStudents} onClose={() => setShowStudents(false)} />
            <TutorAllocationModal isOpen={showAllocation} onClose={() => setShowAllocation(false)} />
            <TutorListModal isOpen={showTutors} onClose={() => setShowTutors(false)} />
        </ProtectedClient >
    );
}
