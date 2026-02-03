'use client';

import React from 'react';
import Link from 'next/link';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useAuthContext } from '@/app/context/AuthContext';
import { useTutorDashboard } from '@/app/Hooks/useTutorDashboard';
import { StatCard } from '@/app/components/dashboard/StatCard';
import {
  Calendar,
  Clock,
  DollarSign,
  BookOpen,
  Users,
  ArrowRight,
  ExternalLink,
  Zap,
  Star,
  Award,
  Video
} from 'lucide-react';

export default function TutorDashboardPage() {
  const { user } = useAuthContext();
  const { todaySessions, upcomingBookings, availableJobs, stats, loading } = useTutorDashboard();

  return (
    <ProtectedClient roles={['tutor']}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">

          {/* TOP ANNOUNCEMENT: AVAILABLE JOBS */}
          {availableJobs.length > 0 && (
            <div className="relative group overflow-hidden rounded-[2.5rem] p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Zap size={160} />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
                    </span>
                    <h2 className="text-3xl font-black text-white tracking-tight">
                      Opportunity Alert
                    </h2>
                  </div>
                  <p className="text-purple-50 text-xl font-medium max-w-2xl leading-relaxed">
                    There are <strong>{availableJobs.length} new sessions</strong> matching your profile. Grab them before someone else does!
                  </p>
                </div>
                <Link
                  href="/tutor/jobs"
                  className="px-10 py-5 bg-white text-purple-600 font-black rounded-3xl hover:bg-purple-50 transition-all flex items-center gap-4 shadow-2xl hover:scale-105 active:scale-95 group/btn text-lg"
                >
                  Claim Now
                  <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}

          {/* HEADER / WELCOME AREA */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-purple-200 dark:border-purple-800">
                  Teaching Command Center • Real-Time
                </div>
              </div>
              <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                Welcome, {user?.firstName || user?.first_name || 'Instructor'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mt-2">
                Operational overview of your teaching load and analytics.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden lg:flex flex-col items-end">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expert Rating</p>
                <div className="flex items-center gap-1.5 text-emerald-500 font-black text-lg">
                  <Award size={20} />
                  <span>Certified Level 5</span>
                </div>
              </div>
              <div className="h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-purple-500 to-pink-500 p-1 shadow-2xl">
                <div className="h-full w-full rounded-[1.15rem] bg-white dark:bg-slate-900 flex items-center justify-center font-black text-2xl text-purple-600">
                  {user?.firstName?.[0] || 'T'}
                </div>
              </div>
            </div>
          </header>

          {/* ANALYTICS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              label="Today's Priority"
              value={stats.todayCount}
              icon={Calendar}
              color="#8b5cf6"
              description="Live countdown"
              loading={loading}
            />
            <StatCard
              label="Completed Total"
              value={stats.completedCount}
              icon={Users}
              color="#3b82f6"
              description="Lifetime sessions"
              loading={loading}
            />
            <StatCard
              label="Teaching Hours"
              value={stats.totalHours}
              icon={Clock}
              color="#ec4899"
              description="Verified logs"
              loading={loading}
            />
            <StatCard
              label="Est. Earnings"
              value={`$${stats.earnings.toFixed(2)}`}
              icon={DollarSign}
              color="#10b981"
              description="Current cycle"
              loading={loading}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* MAIN COLUMN: SESSIONS */}
            <div className="lg:col-span-2 space-y-8">

              {/* TODAY'S CLASSES */}
              <section className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-white/10 rounded-[3rem] shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                <div className="p-8 md:p-10 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                      <Video size={24} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Today's Sessions
                      </h2>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active & Upcoming</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                      Live Sync
                    </span>
                  </div>
                </div>

                <div className="p-8 md:p-10 flex-1">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-6">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" />
                      </div>
                      <p className="font-black text-slate-400 uppercase tracking-[0.2em] text-xs">Calibrating schedule...</p>
                    </div>
                  ) : todaySessions.length > 0 ? (
                    <div className="space-y-6">
                      {todaySessions.map((session: any) => (
                        <div
                          key={session.id}
                          className="group relative flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 rounded-[2.5rem] bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 hover:border-purple-500 transition-all hover:shadow-2xl hover:shadow-purple-500/10"
                        >
                          <div className="flex items-center gap-8">
                            <div className="hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-center group-hover:bg-purple-50 dark:group-hover:bg-purple-900/10 group-hover:border-purple-200 dark:group-hover:border-purple-800 transition-colors">
                              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">Time</span>
                              <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                                {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase rounded-lg border border-purple-200 dark:border-purple-800">
                                  {session.subject_name}
                                </span>
                                <span className="text-[10px] font-black text-slate-400 uppercase">
                                  Track ID: {session.id.slice(0, 8)}
                                </span>
                              </div>
                              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors tracking-tight">
                                {session.child_name || 'Class Participant'}
                              </h3>
                              <p className="text-slate-500 dark:text-slate-400 text-base font-medium flex items-center gap-2">
                                <span className="w-4 h-px bg-slate-300 dark:bg-slate-700" />
                                {session.note || 'Tailored pedagogical approach'}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            {session.whiteboard_link && (
                              <a
                                href={session.whiteboard_link}
                                target="_blank"
                                className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                              >
                                <ExternalLink size={18} />
                                Whiteboard
                              </a>
                            )}
                            <Link
                              href={`/session/${session.id}`}
                              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/25 group/btn"
                            >
                              <Video size={20} className="group-hover/btn:scale-110 transition-transform" />
                              Join Live Class
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-slate-50/50 dark:bg-white/5 rounded-[2.5rem] border-4 border-dashed border-slate-200 dark:border-slate-800 group hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
                      <div className="h-24 w-24 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mb-6 shadow-xl text-slate-400 group-hover:text-purple-500 transition-colors">
                        <Zap size={40} className="group-hover:animate-pulse" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Schedule is Clear</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium text-center px-6">You have no pending assignments for today.<br />New opportunities will appear at the top.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* UPCOMING SESSIONS LIST */}
              <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                    <Calendar className="text-blue-500" />
                    Upcoming Roadmaps
                  </h2>
                  <Link href="/tutor/schedule" className="text-xs font-black text-purple-600 uppercase tracking-widest hover:underline">
                    View Full Calendar →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingBookings.length > 0 ? (
                    upcomingBookings.slice(0, 4).map((booking: any) => (
                      <div key={booking.id} className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5 hover:border-blue-500 transition-all group">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-blue-500 group-hover:scale-110 transition-transform">
                          <BookOpen size={24} />
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900 dark:text-white mb-0.5">{booking.subject_name}</p>
                          <p className="text-xs font-bold text-slate-500">
                            {new Date(booking.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">
                            Starts at {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-10 text-center bg-slate-50/50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                      <p className="font-bold text-slate-400 px-6">No sessions on the immediate horizon.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* SIDEBAR: PERFORMANCE & TOOLS */}
            <div className="space-y-8">
              {/* PERFORMANCE INDICATOR */}
              <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                  <Star className="text-yellow-500" fill="currentColor" />
                  Instructor Quality
                </h3>
                <div className="flex flex-col items-center py-6">
                  <div className="text-7xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">
                    {stats.quality.isInitial ? '0.0' : stats.quality.rating.toFixed(2)}
                  </div>
                  <div className="flex gap-2 text-yellow-500 mb-6">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star
                        key={i}
                        fill={i <= Math.round(stats.quality.rating) && !stats.quality.isInitial ? "currentColor" : "none"}
                        className={i <= Math.round(stats.quality.rating) && !stats.quality.isInitial ? "text-yellow-500" : "text-slate-300 dark:text-slate-700"}
                        size={24}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 text-center uppercase tracking-[0.2em]">
                    {stats.quality.isInitial ? 'Awaiting First Session Review' : `Verified feedback from ${stats.quality.reviewsCount} sessions`}
                  </p>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-5">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Punctuality</span>
                      <span className={stats.quality.isInitial ? "text-slate-400" : "text-emerald-500"}>
                        {stats.quality.isInitial ? 'N/A' : `${stats.quality.punctuality}%`}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                        style={{ width: `${stats.quality.isInitial ? 0 : stats.quality.punctuality}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Engagement</span>
                      <span className={stats.quality.engagement === 0 ? "text-slate-400" : "text-emerald-500"}>
                        {stats.quality.engagement === 0 ? 'N/A' : `${stats.quality.engagement}%`}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                        style={{ width: `${stats.quality.engagement}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Course Tech</span>
                      <span className={stats.quality.isInitial ? "text-slate-400" : "text-purple-500"}>
                        {stats.quality.isInitial ? 'N/A' : `${stats.quality.techScore}%`}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                        style={{ width: `${stats.quality.isInitial ? 0 : stats.quality.techScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* QUICK ACTIONS */}
              <section className="bg-gradient-to-br from-slate-900 to-black dark:from-slate-800 dark:to-slate-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl">
                <h3 className="text-xl font-black text-white mb-8">Service Modules</h3>
                <div className="grid grid-cols-1 gap-5">
                  <button className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform">
                      <BookOpen size={80} />
                    </div>
                    <div className="p-4 bg-purple-500/20 text-purple-400 rounded-2xl group-hover:scale-110 transition-transform relative z-10">
                      <BookOpen size={24} />
                    </div>
                    <div className="text-left relative z-10">
                      <p className="text-lg font-black text-white">Curriculum Vault</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Asset Repository</p>
                    </div>
                  </button>
                  <Link href="/tutor/schedule" className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform">
                      <Calendar size={80} />
                    </div>
                    <div className="p-4 bg-blue-500/20 text-blue-400 rounded-2xl group-hover:scale-110 transition-transform relative z-10">
                      <Calendar size={24} />
                    </div>
                    <div className="text-left relative z-10">
                      <p className="text-lg font-black text-white">Availability Sync</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Shift Intelligence</p>
                    </div>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </ProtectedClient>
  );
}
