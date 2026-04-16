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
    Shield
} from 'lucide-react';

export default function AdminDashboardPage() {
    const { user } = useAuthContext();
    const [stats, setStats] = React.useState({ students: 0, parents: 0, tutors: 0, upcomingSessions: 0, pendingAllocations: 0, activeNow: 0, inactiveTutors: 0 });
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
                setStats(res.data || { students: 0, parents: 0, tutors: 0, upcomingSessions: 0, pendingAllocations: 0, activeNow: 0, inactiveTutors: 0 });
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
            <div className="min-h-screen p-4 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
                {/* BENTO GRID START */}
                <div className="grid grid-cols-12 gap-6 pb-20">
                    
                    {/* 1. WELCOME & IDENTITY TILE (Col 1-5, Row 1) */}
                    <div className="col-span-full lg:col-span-5 bg-linear-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl flex flex-col justify-center min-h-[220px] group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
                        <div className="relative z-10 text-left">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                    <ShieldCheck size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Command Authority</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-4 text-left">
                                {getGreeting()},<br />
                                <span className="opacity-80 font-medium">{user?.firstName || user?.first_name || 'Admin'}</span>
                            </h1>
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <Activity size={14} className="text-emerald-400 animate-pulse" />
                                <span>System status: <span className="text-white font-bold uppercase text-[10px] tracking-widest">Nominal</span></span>
                            </div>
                        </div>
                    </div>

                    {/* 2. LIVE STATS BAR (Col 6-12, Row 1) */}
                    <div className="col-span-full lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div onClick={() => setShowStudents(true)} className="bg-glass rounded-3xl p-6 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col justify-between">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                <GraduationCap size={20} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-(--color-text-primary)">{stats.students}</p>
                                <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary">Students</p>
                            </div>
                        </div>
                        <div className="bg-glass rounded-3xl p-6 border border-white/10 hover:border-purple-500/50 transition-all group flex flex-col justify-between">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-(--color-text-primary)">{stats.parents}</p>
                                <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary">Parents</p>
                            </div>
                        </div>
                        <div onClick={() => setShowTutors(true)} className="bg-glass rounded-3xl p-6 border border-white/10 hover:border-amber-500/50 transition-all cursor-pointer group flex flex-col justify-between">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                <UserCheck size={20} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-(--color-text-primary)">{stats.tutors}</p>
                                <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary">Tutors</p>
                            </div>
                        </div>
                        <div className="bg-glass rounded-3xl p-6 border border-white/10 hover:border-emerald-500/50 transition-all group flex flex-col justify-between">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                <Activity size={20} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-(--color-text-primary)">{stats.activeNow}</p>
                                <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary">Live Sessions</p>
                            </div>
                        </div>
                    </div>

                    {/* 3. ACTIVE MONITOR TILE (Full Width, Row 2) */}
                    <div className="col-span-full bg-glass rounded-4xl p-2 border border-blue-500/20 shadow-2xl overflow-hidden min-h-[140px]">
                        <ActiveSessionsMonitor />
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
                        
                        {/* QUICK ACTIONS BENTO */}
                        <div className="bg-surface rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-indigo-500 via-purple-500 to-transparent" />
                            <h2 className="text-xl font-black text-(--color-text-primary) mb-8">Executive Panels</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setShowAllocation(true)} className="flex flex-col items-center justify-center p-6 bg-glass border border-white/5 rounded-3xl hover:border-indigo-500/50 transition-all group/btn">
                                    <Zap size={24} className="text-indigo-500 mb-2 group-hover/btn:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Allocate</span>
                                </button>
                                <Link href="/admin/tutors/new" className="flex flex-col items-center justify-center p-6 bg-glass border border-white/5 rounded-3xl hover:border-blue-500/50 transition-all group/btn">
                                    <Plus size={24} className="text-blue-500 mb-2 group-hover/btn:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Add Tutor</span>
                                </Link>
                                <Link href="/admin/vault" className="flex flex-col items-center justify-center p-6 bg-glass border border-white/5 rounded-3xl hover:border-emerald-500/50 transition-all group/btn">
                                    <Shield size={24} className="text-emerald-500 mb-2 group-hover/btn:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Vault</span>
                                </Link>
                                <button onClick={() => (document.getElementById('support-section') as HTMLElement)?.scrollIntoView({behavior: 'smooth'})} className="flex flex-col items-center justify-center p-6 bg-glass border border-white/5 rounded-3xl hover:border-pink-500/50 transition-all group/btn">
                                    <LifeBuoy size={24} className="text-pink-500 mb-2 group-hover/btn:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Support</span>
                                </button>
                            </div>
                        </div>

                        {/* SUPPORT TICKETS BENTO */}
                        <div id="support-section" className="bg-white/5 dark:bg-black/20 rounded-[2.5rem] p-8 border border-white/5 flex-1 relative overflow-hidden">
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


                {/* BLOG MANAGEMENT SECTION */}
                <div className="bg-glass rounded-3xl p-6 border border-white/20 shadow-sm">
                    <BlogManagementSection />
                </div>

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
