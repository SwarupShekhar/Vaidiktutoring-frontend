'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useAuthContext } from '@/app/context/AuthContext';
import { useParentDashboard } from '@/app/Hooks/useParentDashboard';
import { StatCard } from '@/app/components/dashboard/StatCard';
import { SessionCommandCard } from '@/app/components/dashboard/SessionCommandCard';
import {
  Users,
  CheckCircle2,
  Calendar,
  Plus,
  Baby,
  CreditCard,
  ChevronRight,
  Clock
} from 'lucide-react';

export default function ParentDashboardPage() {
  const { user } = useAuthContext();
  const {
    studentCount,
    loadingStudents,
    upcomingSessions,
    pastSessions,
    allSessions,
    loadingSessions,
    students,
    loadingStudentList
  } = useParentDashboard();

  // DERIVE STATS
  const stats = useMemo(() => {
    return {
      totalCompleted: pastSessions.length,
      nextChildClass: upcomingSessions[0] ? upcomingSessions[0].students?.first_name : 'None',
      upcomingCount: upcomingSessions.length
    };
  }, [pastSessions, upcomingSessions]);

  const nextSession = upcomingSessions[0] || null;

  return (
    <ProtectedClient roles={['parent']}>
      <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
              Welcome back, {user?.firstName || user?.first_name || 'Parent'}
            </h1>
            <p className="text-[var(--color-text-secondary)] opacity-80">
              Here is an overview of your family's learning progress.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/bookings/new"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-2xl shadow-lg hover:scale-[1.03] transition-all text-sm"
            >
              <Plus size={18} />
              Book Session
            </Link>
          </div>
        </header>

        {/* FAMILY STATS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={Users}
            label="Active Students"
            value={studentCount}
            color="#8b5cf6"
            description="Your children"
          />
          <StatCard
            icon={CheckCircle2}
            label="Total Classes"
            value={stats.totalCompleted}
            description="Completed so far"
            color="#10b981"
          />
          <StatCard
            icon={Calendar}
            label="Upcoming"
            value={stats.upcomingCount}
            description="Scheduled sessions"
            color="#3b82f6"
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* PRIMARY ACTION: NEXT SESSION */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <Clock className="text-blue-500" size={20} />
                Next Activity
              </h3>
              <SessionCommandCard session={nextSession} loading={loadingSessions} />
            </div>

            {/* MY CHILDREN (Grid of Cards) */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                  <Baby className="text-purple-500" size={20} />
                  My Children
                </h3>
                <Link href="/onboarding/student" className="text-xs font-bold text-purple-600 hover:underline">
                  + Add Child
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {loadingStudentList ? (
                  Array(2).fill(0).map((_, i) => <div key={i} className="h-24 bg-white/50 animate-pulse rounded-2xl" />)
                ) : students.length > 0 ? (
                  students.map((student: any) => {
                    const childNext = upcomingSessions.find(s => s.students?.id === student.id);
                    return (
                      <div key={student.id} className="bg-glass border border-white/20 p-5 rounded-2xl flex items-center gap-4 hover:border-purple-300/50 transition-all group cursor-default">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                          {student.gender === 'female' ? '👧' : '👦'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="font-bold text-[var(--color-text-primary)] truncate">
                            {student.first_name} {student.last_name}
                          </h4>
                          <p className="text-[10px] uppercase font-black text-purple-500 tracking-tighter mb-1">
                            Grade {student.grade}
                          </p>
                          {childNext ? (
                            <p className="text-[10px] text-[var(--color-text-secondary)] truncate">
                              Next: {childNext.subject?.name} @ {new Date(childNext.requested_start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </p>
                          ) : (
                            <p className="text-[10px] text-gray-400 italic">No classes booked</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full p-8 text-center bg-white/10 rounded-2xl border border-dashed border-white/20">
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4">You haven't added any children yet.</p>
                    <Link href="/onboarding/student" className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">
                      Add your first child
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* UNIFIED SCHEDULE (Recent Flow) */}
            <div className="bg-glass rounded-3xl p-6 border border-white/20 shadow-sm">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-blue-500" />
                Unified Schedule
              </h2>

              <div className="space-y-3">
                {loadingSessions ? (
                  <div className="py-10 text-center opacity-30">Loading sessions...</div>
                ) : upcomingSessions.length > 1 ? (
                  upcomingSessions.slice(1).map((session: any) => (
                    <div key={session.id} className="p-4 rounded-xl bg-white/40 border border-white/20 flex justify-between items-center group hover:bg-white/60 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-lg">
                          📚
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-[var(--color-text-primary)]">
                            {session.subject?.name}
                          </h3>
                          <p className="text-[10px] text-[var(--color-text-secondary)]">
                            <span className="font-bold text-blue-600 mr-2 uppercase">{session.students?.first_name}</span>
                            {new Date(session.requested_start).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <Link href={`/session/${session.id}`} className="p-2 rounded-full hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100">
                        <ChevronRight size={16} className="text-blue-500" />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center opacity-40 italic text-sm">
                    No other sessions scheduled.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR: RECENT ACTIVITY & QUICK ACTIONS */}
          <aside className="space-y-6">
            <div className="bg-glass rounded-3xl p-6 border border-white/20 shadow-sm shadow-purple-500/5">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2 text-purple-600">
                ⚡ Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <Link href="/bookings/new" className="p-4 rounded-xl bg-white/50 border border-white/30 hover:border-blue-400 group transition-all flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">➕</div>
                  <span className="font-bold text-sm">New Booking</span>
                </Link>
                <Link href="/onboarding/student" className="p-4 rounded-xl bg-white/50 border border-white/30 hover:border-purple-400 group transition-all flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">👶</div>
                  <span className="font-bold text-sm">Add Student</span>
                </Link>
                <button disabled className="p-4 rounded-xl bg-white/20 border border-white/10 flex items-center gap-3 opacity-50 cursor-not-allowed text-left">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-xl">💳</div>
                  <div>
                    <span className="font-bold text-sm block">Billing</span>
                    <span className="text-[10px] font-medium opacity-60 italic">Coming Soon</span>
                  </div>
                </button>
              </div>
            </div>

            {/* RECENT COMPLETED LOG */}
            <div className="bg-glass rounded-3xl p-6 border border-white/20 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-widest text-[var(--color-text-secondary)] mb-6 flex items-center gap-2 opacity-50">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {pastSessions.slice(0, 3).map((session: any) => (
                  <div key={session.id} className="flex gap-3">
                    <div className="w-1 h-8 bg-green-400 rounded-full mt-1" />
                    <div>
                      <p className="text-xs font-bold text-[var(--color-text-primary)]">{session.subject?.name}</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)] opacity-70">
                        Completed by {session.students?.first_name}
                      </p>
                    </div>
                  </div>
                ))}
                {pastSessions.length === 0 && (
                  <p className="text-xs italic text-[var(--color-text-secondary)] opacity-50 text-center">No recent activity</p>
                )}
              </div>
            </div>
          </aside>
        </div>

      </div>
    </ProtectedClient>
  );
}