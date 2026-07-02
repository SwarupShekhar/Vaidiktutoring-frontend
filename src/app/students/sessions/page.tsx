'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Loader2, CalendarClock, Video, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useIsAppShell } from '@/app/Hooks/useIsAppShell';
import { api } from '@/app/lib/api';
import {
  AppPage, AppPageItem, AppPageHeader, AppCard, AppEmptyState, AppSkeletonCard,
} from '@/app/components/app-shell/ui';

interface SessionRow {
  sessionId: string;
  subject: string;
  tutorName: string | null;
  startTime: string | null;
  endTime: string | null;
  status: string | null;
  isPast: boolean;
  attendanceStatus: 'attended' | 'absent' | 'upcoming';
  minutesAttended: number | null;
  hasRecording: boolean;
  recordingId: string | null;
  tutorNote: string | null;
}

function fmt(d: string | null) {
  if (!d) return 'Date n/a';
  try { return format(new Date(d), 'EEE d MMM yyyy · HH:mm'); } catch { return 'Date n/a'; }
}

const STATUS = {
  attended: { label: 'Attended', icon: CheckCircle2, cls: 'text-emerald-500', pill: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  absent: { label: 'Absent', icon: XCircle, cls: 'text-rose-500', pill: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
  upcoming: { label: 'Upcoming', icon: Clock, cls: 'text-slate-400', pill: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300' },
} as const;

function SessionsContent() {
  const isAppShell = useIsAppShell();
  const [rows, setRows] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/students/me/sessions')
      .then(res => setRows(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Could not load your session history.'))
      .finally(() => setLoading(false));
  }, []);

  // Most recent first; past sessions are the "history", upcoming float to top separately.
  const sorted = [...rows].sort((a, b) => {
    const ta = a.startTime ? new Date(a.startTime).getTime() : 0;
    const tb = b.startTime ? new Date(b.startTime).getTime() : 0;
    return tb - ta;
  });

  const Row = ({ s }: { s: SessionRow }) => {
    const st = STATUS[s.attendanceStatus];
    const Icon = st.icon;
    return (
      <div className="flex items-center justify-between gap-3 py-3.5">
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900 dark:text-white">{s.subject}</p>
          <p className="truncate text-xs text-slate-500 dark:text-white/45">
            {fmt(s.startTime)}{s.tutorName ? ` · ${s.tutorName}` : ''}
            {s.attendanceStatus === 'attended' && s.minutesAttended != null ? ` · ${s.minutesAttended} min` : ''}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {s.hasRecording && (
            <Link href="/students/recordings" className="text-indigo-500 hover:text-indigo-400" title="View recording">
              <Video size={16} />
            </Link>
          )}
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${st.pill}`}>
            <Icon size={12} /> {st.label}
          </span>
        </div>
      </div>
    );
  };

  const list = (
    loading ? null : error ? (
      <p className="py-16 text-center font-medium text-rose-500">{error}</p>
    ) : sorted.length === 0 ? null : (
      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {sorted.map(s => <Row key={s.sessionId} s={s} />)}
      </div>
    )
  );

  if (isAppShell) {
    return (
      <AppPage>
        <AppPageItem>
          <AppPageHeader
            icon={CalendarClock}
            accent="amber"
            title="Session History"
            subtitle="Your classes and attendance. Attendance counts when you join for 30+ minutes or your tutor marks you present."
          />
        </AppPageItem>
        <AppPageItem>
          {loading ? (
            <div className="space-y-3"><AppSkeletonCard /><AppSkeletonCard /></div>
          ) : sorted.length === 0 ? (
            <AppEmptyState icon={CalendarClock} accent="amber" title="No sessions yet." />
          ) : (
            <AppCard accent="amber"><div className="px-1">{list}</div></AppCard>
          )}
        </AppPageItem>
      </AppPage>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <Link href="/students/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Session History</h1>
        <p className="mt-1 mb-6 text-sm text-slate-500 dark:text-slate-400">
          Your classes and attendance. Attendance counts when you join for 30+ minutes or your tutor marks you present.
        </p>
        {loading ? (
          <div className="flex justify-center py-16 text-slate-400"><Loader2 className="animate-spin" size={24} /></div>
        ) : sorted.length === 0 ? (
          <p className="py-16 text-center text-slate-400">No sessions yet.</p>
        ) : (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 px-5">{list}</div>
        )}
      </div>
    </div>
  );
}

export default function StudentSessionsPage() {
  return (
    <ProtectedClient roles={['student']}>
      <SessionsContent />
    </ProtectedClient>
  );
}
