'use client';

import React, { useState, useEffect, useRef } from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import StudentListModal from '@/app/components/admin/StudentListModal';
import TutorAllocationModal from '@/app/components/admin/TutorAllocationModal';
import TutorListModal from '@/app/components/admin/TutorListModal';
import AdminSessionSummaryModal from '@/app/components/admin/AdminSessionSummaryModal';
import SupportTicketsSection from '@/app/components/admin/SupportTicketsSection';
import { useAuthContext } from '@/app/context/AuthContext';
import Link from 'next/link';
import api from '@/app/lib/api';
import BookingsTableSection from '@/app/components/admin/BookingsTableSection';
import BlogManagementSection from '@/app/components/admin/BlogManagementSection';
import ActivityPulseFeed from '@/app/components/admin/ActivityPulseFeed';
import ActiveSessionsMonitor from '@/app/components/admin/ActiveSessionsMonitor';
import OperationalSuccessHub from '@/app/components/admin/OperationalSuccessHub';
import { StatCard } from '@/app/components/dashboard/StatCard';
import { toast } from 'sonner';
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
    ShieldAlert,
    ChevronRight,
    LifeBuoy,
    Shield,
    FileText,
    RefreshCw
} from 'lucide-react';

export default function AdminDashboardPage() {
    const { user } = useAuthContext();
    const [stats, setStats] = React.useState({ 
        students: 0, 
        parents: 0, 
        tutors: 0, 
        upcomingSessions: 0, 
        pendingAllocations: 0, 
        activeNow: 0, 
        inactiveTutors: 0,
        revenue: [] as { currency: string, total: number }[],
        enrollment: {} as Record<string, number>,
        recentFailures: 0,
        upcomingExpirations: 0,
        success: {
            attendanceRate: 0,
            avgMastery: 0
        }
    });
    const [loading, setLoading] = React.useState(true);

    // Modal states
    const [showStudents, setShowStudents] = useState(false);
    const [showAllocation, setShowAllocation] = useState(false);
    const [showTutors, setShowTutors] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [summarySessionId, setSummarySessionId] = useState<string | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [newTicketCount, setNewTicketCount] = useState(0);
    const socketRef = useRef<any>(null);

    // Join admin WebSocket room for real-time support ticket alerts
    useEffect(() => {
        let socket: any;
        const connectSocket = async () => {
            try {
                const { io } = await import('socket.io-client');
                const token = document.cookie.match(/manual_auth_token=([^;]+)/)?.[1] || '';
                socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001', {
                    auth: { token },
                    transports: ['websocket'],
                });
                socketRef.current = socket;
                socket.emit('join_admin_room', { role: 'admin' });
                socket.on('support:new_ticket', (data: { userName: string; message: string }) => {
                    setNewTicketCount(c => c + 1);
                    window.dispatchEvent(new CustomEvent('support:new_ticket'));
                    toast(`New help request from ${data.userName}`, {
                        description: data.message.slice(0, 80) + (data.message.length > 80 ? '…' : ''),
                        icon: '🆘',
                        duration: 8000,
                    });
                });

                // Phase 3: Real-time Payment Failure Alerts
                socket.on('payment_failed', (data: { email: string, orderId: string, reason: string }) => {
                    toast.error(`Critical: Payment Failed`, {
                        description: `${data.email} - ${data.reason}`,
                        icon: <ShieldAlert className="text-rose-500" size={16} />,
                        duration: 10000,
                    });
                    // Refresh stats to show new failure count
                    window.dispatchEvent(new CustomEvent('refresh-admin-stats'));
                });
            } catch {
                // Socket not critical — admin can still see tickets by refreshing
            }
        };
        connectSocket();
        return () => { socket?.disconnect(); };
    }, []);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data || { 
                    students: 0, 
                    parents: 0, 
                    tutors: 0, 
                    upcomingSessions: 0, 
                    pendingAllocations: 0, 
                    activeNow: 0, 
                    inactiveTutors: 0,
                    revenue: [],
                    enrollment: {},
                    recentFailures: 0,
                    upcomingExpirations: 0,
                    success: {
                        attendanceRate: 0,
                        avgMastery: 0
                    }
                });
            } catch (e) {
                console.warn('Failed to fetch admin stats', e);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Auto-refresh stats every 10 seconds for a "Live" feel
        const interval = setInterval(fetchStats, 10000);

        const handleOpenAllocation = (e: any) => {
            setSelectedBooking(e.detail?.booking || null);
            setShowAllocation(true);
        };
        window.addEventListener('open-tutor-allocation', handleOpenAllocation);
        window.addEventListener('refresh-admin-stats', fetchStats);
        
        const handleOpenSummary = (e: any) => {
            setSummarySessionId(e.detail?.sessionId || null);
            setShowSummary(true);
        };
        window.addEventListener('open-admin-session-summary', handleOpenSummary);

        return () => {
            clearInterval(interval);
            window.removeEventListener('open-tutor-allocation', handleOpenAllocation);
            window.removeEventListener('refresh-admin-stats', fetchStats);
            window.removeEventListener('open-admin-session-summary', handleOpenSummary);
        };
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <ProtectedClient roles={['admin']}>
            <div className="dark min-h-screen p-4 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700 text-slate-100">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-1">Control Plane</p>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Strategic Intelligence</h1>
                    </div>
                    <button 
                        onClick={() => window.dispatchEvent(new Event('refresh-admin-stats'))}
                        className="group flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
                    >
                        <RefreshCw size={16} className="text-indigo-500 group-hover:rotate-180 transition-transform duration-700" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/70">Sync Now</span>
                    </button>
                </div>

                {/* BENTO GRID START */}
                <div className="grid grid-cols-12 gap-6 pb-20">
                    
                    {/* 1. WELCOME & IDENTITY TILE (Col 1-5, Row 1) */}
                    <div className="col-span-full lg:col-span-5 bg-slate-900 rounded-4xl p-10 text-white relative overflow-hidden shadow-2xl flex flex-col justify-center min-h-[260px] group border border-white/5">
                        {/* Dynamic Background Noise */}
                        <div className="absolute inset-0 opacity-/5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/30 transition-colors duration-1000" />
                        
                        <div className="relative z-10 text-left">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-indigo-400">System_Live</span>
                                </div>
                                <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">v4.2.0-STABLE</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-6">
                                {getGreeting()},<br />
                                <span className="text-indigo-400 opacity-90">{user?.firstName || 'Admin'}</span>
                            </h1>

                            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                                <div>
                                    <p className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em] mb-1">Active Core</p>
                                    <p className="text-sm font-black text-white/90 uppercase tracking-widest">{stats.activeNow} Node Clusters</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em] mb-1">Uptime</p>
                                    <p className="text-sm font-black text-white/90 uppercase tracking-widest">99.98%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. INSTRUMENTATION BAR (Stats) */}
                    <div className="col-span-full lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { 
                                label: 'Students', 
                                value: stats.students, 
                                color: 'blue', 
                                icon: GraduationCap, 
                                onclick: () => setShowStudents(true),
                                detail: stats.enrollment?.active ? `${stats.enrollment.active} Active` : 'Review Enrollment'
                            },
                            { 
                                label: 'Tutors', 
                                value: stats.tutors, 
                                color: 'amber', 
                                icon: UserCheck, 
                                onclick: () => setShowTutors(true),
                                detail: stats.inactiveTutors > 0 ? `${stats.inactiveTutors} Inactive` : 'Full Performance'
                            },
                            { 
                                label: 'Revenue', 
                                value: stats.revenue.length > 0 
                                    ? stats.revenue.map(r => `${r.currency === 'INR' ? '₹' : '$'}${Math.round(r.total/100).toLocaleString()}`).join(' / ')
                                    : '$0', 
                                color: 'emerald', 
                                icon: Activity,
                                detail: 'Total Completed' 
                            },
                            { 
                                label: 'Intelligence', 
                                value: stats.recentFailures + stats.upcomingExpirations, 
                                color: stats.recentFailures > 0 ? 'rose' : 'purple', 
                                icon: stats.recentFailures > 0 ? ShieldAlert : ShieldCheck,
                                detail: stats.recentFailures > 0 ? `${stats.recentFailures} Failures` : `${stats.upcomingExpirations} Expiries`
                            }
                        ].map((stat, idx) => (
                            <div 
                                key={idx} 
                                onClick={stat.onclick}
                                className={`bg-slate-900 rounded-4xl p-6 border border-white/5 hover:border-${stat.color}-500/30 transition-all group relative cursor-pointer overflow-hidden shadow-sm`}
                            >
                                <div className="flex flex-col h-full justify-between relative z-10">
                                    <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-500 mb-4 group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xl font-black text-white tracking-tighter mb-1 truncate">{stat.value}</p>
                                        <div className="flex flex-col">
                                            <p className="text-[9px] uppercase font-mono font-black tracking-[0.2em] text-white/30">{stat.label}</p>
                                            <p className={`text-[8px] font-bold ${stat.color === 'rose' ? 'text-rose-500' : 'text-white/20'} uppercase tracking-widest mt-1`}>
                                                {stat.detail}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* Technical Detail: Dotted Visual Indicator */}
                                <div className="absolute bottom-4 right-4 flex gap-0.5">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`w-1 h-3 rounded-full ${i <= 2 ? `bg-${stat.color}-500/40` : 'bg-white/5'}`} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 3. ACTIVE MONITOR TILE (Full Width, Row 2) */}
                    <div className="col-span-full">
                        <ActiveSessionsMonitor />
                    </div>

                    {/* PHASE 2 & 3: SUCCESS & INTELLIGENCE HUB */}
                    <div className="col-span-full">
                        <OperationalSuccessHub stats={stats} />
                    </div>

                    {/* 4. MAIN OPERATIONAL HUB (Col 1-8, Row 3-4) */}
                    <div className="col-span-full lg:col-span-8 flex flex-col gap-6">
                        {/* BOOKINGS TILE */}
                        <div className="bg-glass rounded-4xl p-6 border border-white/10 shadow-sm flex-1">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-black uppercase tracking-tighter text-(--color-text-primary) flex items-center gap-2">
                                        <Calendar size={18} className="text-blue-500" />
                                        Session Orchestration
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setShowAllocation(true)}
                                    className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                                >
                                    New Allocation
                                </button>
                            </div>
                            <BookingsTableSection />
                        </div>

                        {/* BLOG MANAGEMENT TILE */}
                        <div className="bg-glass rounded-4xl p-6 border border-white/10 shadow-sm">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <h2 className="text-lg font-black uppercase tracking-tighter text-(--color-text-primary) flex items-center gap-2">
                                    <PenTool size={18} className="text-pink-500" />
                                    Content Engine
                                </h2>
                                <Link href="/admin/blogs/new" className="px-4 py-2 border border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                                    Create Post
                                </Link>
                            </div>
                            <BlogManagementSection />
                        </div>
                    </div>

                    {/* 5. COMMAND TILE STACK (Col 9-12, Row 3-4) */}
                    <div className="col-span-full lg:col-span-4 flex flex-col gap-6">
                        
                        {/* COMMAND CONSOLE (Executive Actions) */}
                        <div className="bg-slate-900 rounded-4xl p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
                            {/* Technical Grid Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[20px_20px]" />
                            <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-white/20 tracking-tighter uppercase">
                                Console_v4.2 // SYS_AUTH_LVL_0
                            </div>
                            
                            <div className="relative z-10">
                                <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                                    <Zap className="text-indigo-400" size={20} />
                                    Executive Modules
                                </h2>

                                <div className="space-y-4">
                                    {/* PRIMARY ACTION: THE ALLOCATOR */}
                                    <button 
                                        onClick={() => setShowAllocation(true)} 
                                        className="w-full p-6 bg-linear-to-r from-indigo-600 to-blue-600 rounded-[1.8rem] group/btn relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-500/20"
                                    >
                                        <div className="absolute top-0 right-0 p-3 opacity-20">
                                            <Zap size={48} className="rotate-12 group-hover/btn:rotate-45 transition-transform duration-500" />
                                        </div>
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-xl">
                                                <Zap size={28} className="text-white" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black text-white text-xl tracking-tighter">Allocate Tutor</p>
                                                <p className="text-[10px] text-white/60 font-mono uppercase tracking-widest mt-0.5">Primary OPS / Priority {stats.pendingAllocations}</p>
                                            </div>
                                        </div>
                                    </button>

                                    {/* SECONDARY CLUSTER */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Link href="/admin/tutors/new" className="p-5 bg-white/5 border border-white/5 rounded-[1.8rem] hover:bg-white/10 hover:border-white/20 transition-all group/sub text-left">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                                                    <Plus size={18} />
                                                </div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            </div>
                                            <p className="text-white font-bold text-sm">Add Tutor</p>
                                            <p className="text-[9px] text-white/40 font-mono uppercase mt-1">Onboarding</p>
                                        </Link>

                                        <Link href="/admin/vault" className="p-5 bg-white/5 border border-white/5 rounded-[1.8rem] hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group/sub text-left">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                                                    <Shield size={18} />
                                                </div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40" />
                                            </div>
                                            <p className="text-white font-bold text-sm">Vault</p>
                                            <p className="text-[9px] text-white/40 font-mono uppercase mt-1">Archival Access</p>
                                        </Link>
                                    </div>
                                    
                                    {/* SYSTEM UTILITY BUTTON */}
                                    <button 
                                        onClick={() => (document.getElementById('support-section') as HTMLElement)?.scrollIntoView({behavior: 'smooth'})}
                                        className="w-full py-4 px-6 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/5 hover:border-pink-500/30 transition-all group/btn mb-2"
                                    >
                                        <div className="flex items-center gap-3">
                                            <LifeBuoy size={16} className="text-pink-500" />
                                            <span className="text-xs font-bold text-white/70">Support Operations</span>
                                        </div>
                                        <ChevronRight size={14} className="text-white/20 group-hover/btn:text-pink-500 transition-colors" />
                                    </button>

                                    {/* INTELLIGENCE REPORTING (CSV) */}
                                    <button 
                                        onClick={async () => {
                                            try {
                                                const res = await api.get('/admin/reports/finance', { responseType: 'blob' });
                                                const url = window.URL.createObjectURL(new Blob([res.data]));
                                                const link = document.createElement('a');
                                                link.href = url;
                                                link.setAttribute('download', `financial_ledger_${new Date().toISOString().split('T')[0]}.csv`);
                                                document.body.appendChild(link);
                                                link.click();
                                                link.parentNode?.removeChild(link);
                                                toast.success('Ledger generated successfully');
                                            } catch (e) {
                                                toast.error('Failed to generate report');
                                            }
                                        }}
                                        className="w-full py-4 px-6 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/5 hover:border-amber-500/30 transition-all group/btn"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText size={16} className="text-amber-500" />
                                            <span className="text-xs font-bold text-white/70">Export Finance Ledger</span>
                                        </div>
                                        <ChevronRight size={14} className="text-white/20 group-hover/btn:text-amber-500 transition-colors" />
                                    </button>
                                </div>
                            </div>
                        </div>


                        {/* SUPPORT TICKETS BENTO */}
                        <div id="support-section" className="bg-white/5 dark:bg-black/20 rounded-4xl p-8 border border-white/5 flex-1 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-(--color-text-primary)">Active Intelligence</h2>
                                {newTicketCount > 0 && (
                                    <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-full animate-pulse uppercase tracking-widest">
                                        {newTicketCount} Urgent
                                    </span>
                                )}
                            </div>
                            <div className="max-h-[400px] overflow-hidden">
                                <SupportTicketsSection />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-background to-transparent pointer-events-none" />
                        </div>
                    </div>

                    {/* 6. TECHNICAL HEALTH & SYSTEM ANALYTICS (Col 1-12, Row 5) */}
                    <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        <div className="bg-glass rounded-4xl p-6 border border-white/10 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:rotate-12 transition-transform">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-(--color-text-primary) uppercase tracking-widest">System Integrity</p>
                                    <p className="text-[10px] text-emerald-500 font-bold">ALL SERVICES OPERATIONAL</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-3 bg-emerald-500/40 rounded-full" />)}
                            </div>
                        </div>

                        <div className="bg-glass rounded-4xl p-6 border border-white/10 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl group-hover:rotate-12 transition-transform">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-(--color-text-primary) uppercase tracking-widest">Activity Pulse</p>
                                    <p className="text-[10px] text-text-secondary font-bold">LIVE METRIC STREAM ACTIVE</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-linear-to-br from-gray-900 to-black rounded-4xl p-6 border border-white/5 flex items-center justify-between group cursor-help">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white/80 transition-colors">
                                StudyHours Dashboard v4.2.0
                            </p>
                            <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
                        </div>
                    </div>

                </div>
                {/* BENTO GRID END */}


                {/* MODALS */}
                <StudentListModal isOpen={showStudents} onClose={() => setShowStudents(false)} />
                <TutorAllocationModal 
                    isOpen={showAllocation} 
                    onClose={() => {
                        setShowAllocation(false);
                        setSelectedBooking(null);
                        // trigger refresh of bookings table
                        window.dispatchEvent(new CustomEvent('refresh-bookings-table'));
                    }} 
                    booking={selectedBooking}
                />
                <TutorListModal isOpen={showTutors} onClose={() => setShowTutors(false)} />
                <AdminSessionSummaryModal 
                    isOpen={showSummary} 
                    onClose={() => {
                        setShowSummary(false);
                        setSummarySessionId(null);
                    }} 
                    sessionId={summarySessionId}
                />
            </div>
        </ProtectedClient>
    );
}
