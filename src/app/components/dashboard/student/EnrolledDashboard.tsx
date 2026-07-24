'use client';

import React from 'react';
import { AppDashboard } from '../../app-shell/AppDashboard';
import TutorCommunication from '@/app/students/dashboard/TutorCommunication';
import { MessageSquare, User as UserIcon } from 'lucide-react';

interface EnrolledDashboardProps {
  studentProfile: any;
  enrollment: any;
  upcomingSessions: any[];
  pastSessions: any[];
  bookings: any[];
  loading: boolean;
  user: any;
  progressSummary: any;
  isEnrolled: boolean;
  pendingRatings?: any[];
  creditStatus?: any;
}

export const EnrolledDashboard: React.FC<EnrolledDashboardProps> = (props) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8 space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Welcome back, {props.user?.firstName || props.user?.first_name || 'there'}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">Ready for your next session?</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/students/profile"
              className="inline-flex items-center gap-2 rounded-xl bg-surface px-4 py-2.5 text-sm font-bold text-foreground shadow-sm ring-1 ring-inset ring-border transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <UserIcon className="h-4 w-4" />
              View Profile
            </a>
          </div>
        </header>

        {/* BENTO DASHBOARD */}
        <div className="[--bento-fg:#0f172a] [--bento-fg-muted:#64748b] [--bento-hairline:rgba(15,23,42,0.12)] [--bento-surface:#ffffff] [--bento-row:rgba(15,23,42,0.03)] dark:[--bento-fg:#ffffff] dark:[--bento-fg-muted:rgba(255,255,255,0.62)] dark:[--bento-hairline:rgba(255,255,255,0.12)] dark:[--bento-surface:#15131f] dark:[--bento-row:rgba(255,255,255,0.05)]">
          <AppDashboard
            {...props}
            embedMode={true}
            themeAware={true}
          />
        </div>

        {/* COMMUNICATION CENTER */}
        <section id="comm-center" className="scroll-mt-6 overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <MessageSquare size={18} className="text-indigo-500" />
            <div>
              <h2 className="text-base font-bold text-foreground">Communication Center</h2>
              <p className="text-xs text-text-secondary">Message your tutor</p>
            </div>
          </div>
          <div className="p-4 md:p-5">
            <TutorCommunication 
              tutorName={props.upcomingSessions?.[0]?.tutor?.name ?? null} 
              currentUserId={props.user?.id} 
            />
          </div>
        </section>

      </div>
    </div>
  );
};
