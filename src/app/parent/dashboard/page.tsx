"use client";

import React, { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import ProtectedClient from "@/app/components/ProtectedClient";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import { useAuthContext } from "@/app/context/AuthContext";
import { useParentDashboard } from "@/app/Hooks/useParentDashboard";
import type { ParentDashboardSession, ParentDashboardStudent, PendingRating } from "@/app/Hooks/useParentDashboard";
import { useSearchParams } from "next/navigation";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { SessionCommandCard } from "@/app/components/dashboard/SessionCommandCard";
import {
  Users,
  CheckCircle2,
  Calendar,
  Plus,
  Baby,
  ChevronRight,
  Clock,
  TrendingUp,
  History,
  ArrowUpRight,
  X,
  Layout,
  AlertCircle
} from "lucide-react";
import RatingModal from "@/app/components/RatingModal";
import AttendanceReport from "@/app/components/dashboard/AttendanceReport";
import { useIsAppShell } from "@/app/Hooks/useIsAppShell";
import ParentAppDashboard from "@/app/components/app-shell/ParentAppDashboard";

function DashboardContent() {
  const { user } = useAuthContext();
  const isAppShell = useIsAppShell();
  const {
    studentCount,
    loadingStudents,
    upcomingSessions,
    pastSessions,
    loadingSessions,
    students,
    loadingStudentList,
    childSummaries,
    pendingRatings,
  } = useParentDashboard();

  const [ratingsDismissed, setRatingsDismissed] = useState(false);
  const showRatingModal = pendingRatings.length > 0 && !ratingsDismissed;

  // DERIVE STATS
  const stats = useMemo(() => {
    return {
      totalCompleted: pastSessions.length,
      nextChildClass: upcomingSessions[0]
        ? upcomingSessions[0].students?.first_name
        : "None",
      upcomingCount: upcomingSessions.length,
    };
  }, [pastSessions, upcomingSessions]);

  const nextSession = upcomingSessions[0] || null;

  const searchParams = useSearchParams();
  const initialHistoryChildId = searchParams.get('showHistory') === 'true' ? searchParams.get('childId') : null;

  // History State
  const [showHistoryModal, setShowHistoryModal] = useState(() => !!initialHistoryChildId);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(() => initialHistoryChildId);
  const [expandedNoteStudentId, setExpandedNoteStudentId] = useState<string | null>(null);

  // Group past sessions by child
  const childPastSessions = useMemo(() => {
    const map: Record<string, ParentDashboardSession[]> = {};
    (students || []).forEach((s: ParentDashboardStudent) => (map[s.id] = []));
    (pastSessions || []).forEach((ps: ParentDashboardSession) => {
      if (ps.student_id && map[ps.student_id]) map[ps.student_id].push(ps);
    });
    return map;
  }, [students, pastSessions]);

  // PROGRESS CALCULATIONS
  const { growth, thisMonthCount } = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonth = (pastSessions || []).filter(
      (s: ParentDashboardSession) => new Date(s.requested_start) >= startOfMonth,
    ).length;
    const lastMonth = (pastSessions || []).filter((s: ParentDashboardSession) => {
      const date = new Date(s.requested_start);
      return date >= startOfLastMonth && date <= endOfLastMonth;
    }).length;

    const growthResult =
      lastMonth === 0
        ? thisMonth > 0
          ? 100
          : 0
        : Math.round(((thisMonth - lastMonth) / lastMonth) * 100);

    return { growth: growthResult, thisMonthCount: thisMonth };
  }, [pastSessions]);

  const selectedSummary = selectedChildId ? (childSummaries[selectedChildId] ?? null) : null;

  // Desktop app-shell users get the native Magic Bento homescreen. The web JSX
  // below is rendered byte-for-byte identically for every non-app visitor.
  if (isAppShell) {
    return <ParentAppDashboard />;
  }

  return (
      <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {user && user.phone_verified !== true && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📱</span>
                    <div>
                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                            Verify your phone number
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                            Please verify your phone number to receive session reminders and updates.
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
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-(--color-text-primary) tracking-tight">
              Welcome back, {user?.firstName || user?.first_name || "Parent"}
            </h1>
            <p className="text-text-secondary opacity-80">
              Here is an overview of your family&apos;s learning progress.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/bookings/new"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg hover:scale-[1.03] transition-all text-sm"
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
            loading={loadingStudents}
          />
          <StatCard
            icon={CheckCircle2}
            label="Total Classes"
            value={stats.totalCompleted}
            description="Completed so far"
            color="#10b981"
            loading={loadingSessions}
          />
          <StatCard
            icon={Calendar}
            label="Upcoming"
            value={stats.upcomingCount}
            description="Scheduled sessions"
            color="#3b82f6"
            loading={loadingSessions}
          />
          <StatCard
            icon={TrendingUp}
            label="This Month"
            value={thisMonthCount}
            description={
              growth >= 0 ? `+${growth}% from last month` : `${growth}% from last month`
            }
            color={growth >= 0 ? "#10b981" : "#ef4444"}
            loading={loadingSessions}
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* PRIMARY ACTION: NEXT SESSION */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-(--color-text-primary) flex items-center gap-2">
                <Clock className="text-blue-500" size={20} />
                Next Activity
              </h3>
              <SessionCommandCard
                session={nextSession}
                loading={loadingSessions}
              />
            </div>

            {/* MY CHILDREN (Grid of Cards) */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-(--color-text-primary) flex items-center gap-2">
                  <Baby className="text-purple-500" size={20} />
                  My Children
                </h3>
                <Link
                  href="/onboarding/student"
                  className="text-xs font-bold text-purple-600 hover:underline"
                >
                  + Add Child
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {loadingStudentList ? (
                  Array(2)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="h-24 bg-white/50 animate-pulse rounded-2xl"
                      />
                    ))
                ) : students.length > 0 ? (
                  students.map((student: ParentDashboardStudent) => {
                    const childNext = upcomingSessions.find(
                      (s) => s.students?.id === student.id,
                    );
                    const summary = childSummaries[student.id];
                    const isRenewalNeeded = summary && summary.packageSessionsRemaining <= Math.ceil(summary.packageSessionsTotal * 0.2);

                    return (
                        <div
                          key={student.id}
                          className="bg-glass border border-white/20 p-5 rounded-2xl flex flex-col gap-4 hover:border-purple-300/50 transition-all group cursor-default relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                              {student.gender === "female" ? "👧" : "👦"}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <h4 className="font-bold text-(--color-text-primary) truncate">
                                {student.first_name} {student.last_name}
                              </h4>
                              <div className="flex items-center gap-2">
                                <p className="text-[10px] uppercase font-black text-purple-500 tracking-tighter">
                                    Grade {student.grade}
                                </p>
                                {summary && (
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                                        summary.attendanceRate >= 90 ? 'bg-green-50 text-green-600' :
                                        summary.attendanceRate >= 70 ? 'bg-amber-50 text-amber-600' :
                                        'bg-red-50 text-red-600'
                                    }`}>
                                        {summary.attendanceRate >= 90 ? '✓' : summary.attendanceRate >= 70 ? '⚠' : '↓'}
                                        {summary.attendanceRate}% attendance
                                    </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedChildId(student.id);
                                setShowHistoryModal(true);
                              }}
                              className="p-2 rounded-lg bg-white/50 text-purple-600 opacity-0 group-hover:opacity-100 transition-all"
                              title="View session history"
                            >
                              <History size={16} />
                            </button>
                          </div>

                          {/* Renewal Banner */}
                          {isRenewalNeeded && (
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 rounded-xl p-3 flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                                    <AlertCircle size={14} />
                                    <p className="text-[10px] font-bold uppercase tracking-tight">Renewal Needed</p>
                                </div>
                                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                                    {summary.packageSessionsRemaining} sessions remaining in package
                                </p>
                                <Link 
                                    href="/pricing" 
                                    className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black text-center py-1.5 rounded-lg transition-all"
                                >
                                    RENEW PACKAGE
                                </Link>
                            </div>
                          )}

                          {/* Last Session Note / Info */}
                          <div className="pt-3 border-t border-white/10 mt-auto">
                            {childPastSessions[student.id]?.[0] ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-black uppercase text-text-secondary opacity-50 tracking-widest">
                                    Last Session Note
                                  </span>
                                  <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                                    COMPLETED
                                  </span>
                                </div>
                                <p className="text-[11px] text-text-secondary leading-relaxed italic">
                                  {expandedNoteStudentId === student.id
                                    ? `"${childPastSessions[student.id][0].sessions?.[0]?.tutor_note || `Great work today on ${childPastSessions[student.id][0].subject?.name}!`}"`
                                    : `"${(childPastSessions[student.id][0].sessions?.[0]?.tutor_note || `Great work today on ${childPastSessions[student.id][0].subject?.name}!`).slice(0, 100)}${ (childPastSessions[student.id][0].sessions?.[0]?.tutor_note?.length || 0) > 100 ? '...' : ''}"`
                                  }
                                  {(childPastSessions[student.id][0].sessions?.[0]?.tutor_note?.length || 0) > 100 && (
                                    <button 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setExpandedNoteStudentId(expandedNoteStudentId === student.id ? null : student.id);
                                      }}
                                      className="ml-1 text-[10px] font-black text-purple-600 hover:text-purple-800 transition-colors uppercase tracking-tight"
                                    >
                                      {expandedNoteStudentId === student.id ? 'Show less' : 'Read more'}
                                    </button>
                                  )}
                                </p>
                                {childPastSessions[student.id][0].sessions?.[0]?.session_recordings?.[0]?.file_url && (
                                  <a
                                    href={childPastSessions[student.id][0].sessions![0].session_recordings![0].file_url ?? ''}
                                    target="_blank"
                                    className="inline-flex items-center gap-1 mt-2 text-[9px] font-black text-purple-500 hover:text-purple-700 bg-purple-50 px-2 py-1 rounded-lg uppercase tracking-wider transition-all"
                                  >
                                    <ArrowUpRight size={10} />
                                    Last Recording
                                  </a>
                                )}
                              </div>
                            ) : (
                              <div className="flex bg-gray-50/50 rounded-xl p-3 items-center gap-3">
                                <div className="text-xl opacity-30">📅</div>
                                <div className="text-[10px] text-text-secondary font-medium leading-tight">
                                  {childNext
                                    ? `Next class on ${new Date(childNext.requested_start).toLocaleDateString()}`
                                    : "Getting ready for your first class!"}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                    );
                  })
                ) : (
                  <div className="col-span-full p-8 text-center bg-white/10 rounded-2xl border border-dashed border-white/20">
                    <p className="text-sm text-text-secondary mb-4">
                      You haven&apos;t added any children yet.
                    </p>
                    <Link
                      href="/onboarding/student"
                      className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold"
                    >
                      Add your first child
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* UNIFIED SCHEDULE (Recent Flow) */}
            <div className="bg-glass rounded-3xl p-6 border border-white/20 shadow-sm">
              <h2 className="text-xl font-bold text-(--color-text-primary) mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-blue-500" />
                Unified Schedule
              </h2>

              <div className="space-y-3">
                {loadingSessions ? (
                  <div className="py-10 text-center opacity-30">
                    Loading sessions...
                  </div>
                ) : upcomingSessions.length > 1 ? (
                  upcomingSessions.slice(1).map((session: ParentDashboardSession) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-xl bg-white/40 border border-white/20 flex justify-between items-center group hover:bg-white/60 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-lg">
                          📚
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-(--color-text-primary)">
                            {session.subject?.name}
                          </h3>
                          <p className="text-[10px] text-text-secondary">
                            <span className="font-bold text-blue-600 mr-2 uppercase">
                              {session.students?.first_name}
                            </span>
                            {new Date(session.requested_start).toLocaleString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/session/${session.id}`}
                        className="p-2 rounded-full hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100"
                      >
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
              <h2 className="text-lg font-bold text-(--color-text-primary) mb-6 flex items-center gap-2">
                ⚡ Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <Link
                  href="/bookings/new"
                  className="p-4 rounded-xl bg-white/50 border border-white/30 hover:border-blue-400 group transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    ➕
                  </div>
                  <span className="font-bold text-sm">New Booking</span>
                </Link>
                <Link
                  href="/onboarding/student"
                  className="p-4 rounded-xl bg-white/50 border border-white/30 hover:border-purple-400 group transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    👶
                  </div>
                  <span className="font-bold text-sm">Add Student</span>
                </Link>
                <button
                  disabled
                  className="p-4 rounded-xl bg-white/20 border border-white/10 flex items-center gap-3 opacity-50 cursor-not-allowed text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-xl">
                    💳
                  </div>
                  <div>
                    <span className="font-bold text-sm block">Billing</span>
                    <span className="text-[10px] font-medium opacity-60 italic">
                      Coming Soon
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* RECENT COMPLETED LOG */}
            <div className="bg-glass rounded-3xl p-6 border border-white/20 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-widest text-text-secondary mb-6 flex items-center gap-2 opacity-50">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {pastSessions.slice(0, 3).map((session: ParentDashboardSession) => (
                  <div key={session.id} className="flex gap-3">
                    <div className="w-1 h-8 bg-green-400 rounded-full mt-1" />
                    <div>
                      <p className="text-xs font-bold text-(--color-text-primary)">
                        {session.subject?.name}
                      </p>
                      <p className="text-[10px] text-text-secondary opacity-70">
                        Completed by {session.students?.first_name}
                      </p>
                    </div>
                  </div>
                ))}
                {pastSessions.length === 0 && (
                  <p className="text-xs italic text-text-secondary opacity-50 text-center">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>

        {showRatingModal && pendingRatings.length > 0 && (
          <RatingModal
            pending={pendingRatings as PendingRating[]}
            onDone={() => setRatingsDismissed(true)}
          />
        )}

        {/* SESSION HISTORY MODAL */}
        {showHistoryModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowHistoryModal(false)} />
            <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-6 border-b flex items-center justify-between bg-purple-50">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Session History</h2>
                  <p className="text-xs text-purple-600 font-bold uppercase tracking-widest mt-1">
                    {students.find(s => s.id === selectedChildId)?.first_name}&apos;s Progress Roadmap
                  </p>
                </div>
                <button 
                  onClick={() => setShowHistoryModal(false)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-black shadow-sm transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Attendance Report */}
                <div className="mb-4">
                    <AttendanceReport studentId={selectedChildId} />
                </div>

                {/* Subject Progress indicators */}
                {selectedSummary?.subjectProgress && selectedSummary.subjectProgress.length > 0 && (
                    <div className="space-y-3 mb-6">
                        <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Subject Progress</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedSummary.subjectProgress.map((sp, i) => (
                                <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${
                                    sp.level === 'improving' ? 'bg-green-50 border-green-100 text-green-700' :
                                    sp.level === 'steady' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                                    'bg-red-50 border-red-100 text-red-700'
                                }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                        sp.level === 'improving' ? 'bg-green-500' :
                                        sp.level === 'steady' ? 'bg-amber-500' :
                                        'bg-red-500'
                                    }`} />
                                    <span className="text-[10px] font-bold uppercase">{sp.subject}: {
                                        sp.level === 'improving' ? 'Improving' :
                                        sp.level === 'steady' ? 'Steady' :
                                        'Needs attention'
                                    }</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {childPastSessions[selectedChildId || '']?.length > 0 ? (
                  childPastSessions[selectedChildId || ''].map((booking, idx) => (
                    <div key={booking.id} className="relative pl-8 group">
                      {/* Timeline Line */}
                      {idx !== childPastSessions[selectedChildId || ''].length - 1 && (
                        <div className="absolute left-[11px] top-6 bottom-[-24px] w-0.5 bg-gray-100 group-hover:bg-purple-100 transition-colors" />
                      )}
                      
                      {/* Timeline Dot */}
                      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-purple-500 z-10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                      </div>

                      <div className="bg-gray-50/50 rounded-2xl p-5 border border-transparent hover:border-purple-200 hover:bg-white transition-all shadow-sm hover:shadow-md">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              {new Date(booking.requested_start).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 mt-1">{booking.subject?.name} session</h3>
                          </div>
                          <div className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                            {booking.sessions?.[0]?.duration || 60} mins
                          </div>
                         </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="shrink-0">👨‍🏫</span>
                            <span className="font-medium">Tutor {booking.tutors?.users?.first_name}</span>
                          </div>

                          {booking.sessions?.[0]?.tutor_note ? (
                            <div className="bg-white/80 p-3 rounded-xl border border-purple-100 relative overflow-hidden">
                              <div className="absolute top-0 left-0 bottom-0 w-1 bg-purple-400" />
                              <p className="text-[11px] text-gray-700 leading-relaxed">
                                {booking.sessions[0].tutor_note}
                              </p>
                            </div>
                          ) : (
                            <p className="text-[11px] text-gray-400 italic">No notes recorded for this session.</p>
                          )}

                          <div className="flex flex-wrap gap-2">
                            {booking.sessions?.[0]?.session_recordings?.[0]?.file_url && (
                              <a 
                                href={booking.sessions[0].session_recordings[0].file_url}
                                target="_blank"
                                className="inline-flex items-center gap-1.5 text-[10px] font-black text-purple-600 hover:text-purple-800 uppercase tracking-wide group/link bg-purple-50 px-2 py-1.5 rounded-lg border border-purple-100 transition-all"
                              >
                                <ArrowUpRight size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                Watch Recording
                              </a>
                            )}
                            
                            {booking.sessions?.[0]?.whiteboard_snapshot_url && (
                              <a 
                                href={booking.sessions[0].whiteboard_snapshot_url}
                                target="_blank"
                                className="inline-flex items-center gap-1.5 text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-wide group/link bg-blue-50 px-2 py-1.5 rounded-lg border border-blue-100 transition-all"
                              >
                                <Layout size={12} className="group-hover/link:scale-110 transition-transform" />
                                View Board
                              </a>
                            )}
                          </div>

                          {/* Sticker Rewards display */}
                          {(booking.sessions?.[0]?.sticker_rewards?.length ?? 0) > 0 && (
                            <div className="pt-2 flex flex-wrap gap-2 items-center">
                              <span className="text-[9px] font-black text-yellow-600 uppercase tracking-tighter">Gold Stars:</span>
                              {booking.sessions?.[0]?.sticker_rewards?.map((reward: { id: string; sticker: string }) => (
                                <div key={reward.id} className="relative group/sticker">
                                  <div className="absolute -inset-1 bg-yellow-400 rounded-full blur opacity-20 group-hover/sticker:opacity-40 transition-opacity" />
                                  <img 
                                    src={`/stickers/${reward.sticker}`} 
                                    alt="Reward" 
                                    className="w-6 h-6 object-contain relative z-10 transition-transform group-hover/sticker:scale-125" 
                                    title="Sticker earned in this session!"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                    <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center text-3xl mb-4">
                      📖
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest">No Past Sessions</p>
                    <p className="text-xs mt-1">Complete your first session to see history!</p>
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t bg-gray-50/50">
                <button 
                  onClick={() => setShowHistoryModal(false)}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg hover:shadow-gray-900/20 active:scale-[0.98] transition-all"
                >
                  Close History
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

export default function ParentDashboardPage() {
  return (
    <ProtectedClient roles={["parent"]}>
      <ErrorBoundary>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        }>
          <DashboardContent />
        </Suspense>
      </ErrorBoundary>
    </ProtectedClient>
  );
}
