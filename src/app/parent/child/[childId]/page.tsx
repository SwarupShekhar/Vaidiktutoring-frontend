'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  GraduationCap,
  Library,
  NotebookPen,
  Video,
  CalendarClock,
  ClipboardCheck,
  Ticket,
  Flame,
  TrendingUp,
  Crown,
  ChevronRight,
  Atom,
  Microscope,
  X,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import ProtectedClient from '@/app/components/ProtectedClient';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { useParentDashboard } from '@/app/Hooks/useParentDashboard';
import { getPlanBadge } from '@/app/lib/plan';
import { INTERACTIVE_TOOLS, type InteractiveTool } from '@/app/lib/interactive-tools';
import {
  AppPage,
  AppPageItem,
  AppPageHeader,
  AppCard,
  AppSkeletonCard,
  AppEmptyState,
} from '@/app/components/app-shell/ui';

export default function ParentChildSpacePage() {
  return (
    <ProtectedClient roles={['parent']}>
      <ErrorBoundary>
        <ChildSpace />
      </ErrorBoundary>
    </ProtectedClient>
  );
}

const TRIAL_LIMIT = 3;
const nameOf = (s: any) => `${s?.first_name ?? ''} ${s?.last_name ?? ''}`.trim() || 'Your child';

function ChildSpace() {
  const params = useParams();
  const router = useRouter();
  const childId = String(params?.childId || '');

  const { students, childSummaries, childCredits, upcomingSessions, loadingStudentList } =
    useParentDashboard();

  const child = useMemo(() => students.find((s) => s.id === childId) ?? null, [students, childId]);

  // If the list has loaded and this isn't one of the parent's children, bounce home.
  useEffect(() => {
    if (!loadingStudentList && students.length > 0 && !child) {
      router.replace('/parent/dashboard');
    }
  }, [loadingStudentList, students, child, router]);

  const summary = childSummaries[childId] ?? null;
  const credit = childCredits[childId] ?? null;
  const planBadge = getPlanBadge(credit);

  const hasAttendance = (summary?.totalSessions ?? 0) > 0;
  const attendanceRate = Math.round(summary?.attendanceRate ?? 0);

  const sessionsLabel = useMemo(() => {
    if (!credit) return ', ';
    if (credit.mode === 'trial_active') return `${Math.max(0, TRIAL_LIMIT - (credit.sessionsUsed ?? 0))} of ${TRIAL_LIMIT} free`;
    if (credit.mode === 'trial_exhausted' || credit.mode === 'trial_expired') return 'Trial ended';
    return `${Math.max(0, credit.creditsRemaining ?? 0)} left`;
  }, [credit]);

  const childUpcoming = useMemo(
    () =>
      upcomingSessions
        .filter((s) => s.students?.id === childId)
        .slice(0, 5),
    [upcomingSessions, childId],
  );

  const resources = [
    { label: 'Vault', desc: 'Study materials', href: `/parent/vault?child=${childId}`, icon: Library },
    { label: 'Notes', desc: 'Shared class notes', href: `/parent/notes?child=${childId}`, icon: NotebookPen },
    { label: 'Recordings', desc: 'Recorded sessions', href: `/parent/recordings?child=${childId}`, icon: Video },
  ];

  // Interactive learning labs, open to every child (trial included), same as the
  // student dashboard. Launches the tool in a fullscreen iframe.
  const [activeTool, setActiveTool] = useState<InteractiveTool | null>(null);
  const [labLoading, setLabLoading] = useState(true);
  useEffect(() => {
    if (!activeTool) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveTool(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeTool]);
  const launchTool = (t: InteractiveTool) => {
    setLabLoading(true);
    setActiveTool(t);
  };
  const toolIcon = (name: string) => (name === 'Microscope' ? Microscope : Atom);

  if (loadingStudentList || (!child && students.length === 0)) {
    return (
      <AppPage>
        <AppPageItem>
          <AppSkeletonCard />
        </AppPageItem>
      </AppPage>
    );
  }

  if (!child) {
    return (
      <AppPage>
        <AppPageItem>
          <AppEmptyState icon={GraduationCap} accent="indigo" title="Child not found" />
        </AppPageItem>
      </AppPage>
    );
  }

  const stat = (label: string, value: string, Icon: any, accent: string, sub?: string) => (
    <AppCard accent={accent as any} interactive={false}>
      <div className="flex items-center gap-2 text-white/50">
        <Icon size={14} /> <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-white/40">{sub}</p>}
    </AppCard>
  );

  return (
    <AppPage>
      <AppPageItem>
        <AppPageHeader
          icon={GraduationCap}
          accent="indigo"
          eyebrow="Learning space"
          title={`${nameOf(child)}`}
          subtitle={`${child.grade ? `Grade ${child.grade} · ` : ''}Everything for this child in one place.`}
          right={
            planBadge ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 px-3 py-1.5 text-xs font-bold text-indigo-200 ring-1 ring-indigo-400/30">
                <Crown size={13} /> {planBadge.label}
              </span>
            ) : undefined
          }
        />
      </AppPageItem>

      {/* Key stats */}
      <AppPageItem>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stat(
            'Attendance',
            hasAttendance ? `${attendanceRate}%` : ', ',
            ClipboardCheck,
            attendanceRate >= 90 ? 'emerald' : attendanceRate >= 70 ? 'amber' : 'indigo',
            hasAttendance ? undefined : 'No sessions yet',
          )}
          {stat('Sessions', sessionsLabel, Ticket, 'cyan')}
          {stat('Momentum', `${summary?.streakWeeks ?? 0} wk`, Flame, 'amber', `${summary?.totalHoursLearned ?? 0}h · ${summary?.totalSessions ?? 0} sessions`)}
        </div>
      </AppPageItem>

      {/* Resources */}
      <AppPageItem>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/40">Resources</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {resources.map((r) => (
            <Link key={r.label} href={r.href}>
              <AppCard accent="indigo">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                      <r.icon size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-white">{r.label}</p>
                      <p className="text-xs text-white/45">{r.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-white/25" />
                </div>
              </AppCard>
            </Link>
          ))}
        </div>
      </AppPageItem>

      {/* Interactive labs, available to every child */}
      <AppPageItem>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/40">Interactive labs</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {INTERACTIVE_TOOLS.map((tool) => {
            const Icon = toolIcon(tool.iconName);
            return (
              <AppCard key={tool.title} accent="magenta" onClick={() => launchTool(tool)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/15 text-fuchsia-300">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-white">{tool.title}</p>
                      <p className="text-xs text-white/45">Explore &amp; experiment in 3D</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-fuchsia-500/15 px-2.5 py-1 text-[11px] font-bold text-fuchsia-200 ring-1 ring-fuchsia-400/25">
                    <Icon size={12} /> Launch
                  </span>
                </div>
              </AppCard>
            );
          })}
        </div>
      </AppPageItem>

      {/* Upcoming classes */}
      <AppPageItem>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/40">Upcoming classes</p>
        {childUpcoming.length === 0 ? (
          <AppCard accent="indigo" interactive={false}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/50">No classes scheduled yet.</p>
              <Link
                href="/bookings/new"
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-bold text-white"
              >
                <CalendarClock size={13} /> Book a session
              </Link>
            </div>
          </AppCard>
        ) : (
          <div className="space-y-3">
            {childUpcoming.map((s) => (
              <AppCard key={s.id} accent="indigo" interactive={false}>
                <div className="flex items-center gap-3">
                  <TrendingUp size={16} className="text-indigo-300" />
                  <div>
                    <p className="font-semibold text-white">
                      {s.subject?.name || s.subjects?.name || 'Class'}
                    </p>
                    <p className="text-xs text-white/45">
                      {s.requested_start ? format(new Date(s.requested_start), 'EEE, d MMM · h:mm a') : 'Time TBD'}
                      {s.tutors?.users?.first_name ? ` · Tutor ${s.tutors.users.first_name}` : ''}
                    </p>
                  </div>
                </div>
              </AppCard>
            ))}
          </div>
        )}
      </AppPageItem>

      {/* Fullscreen interactive-lab modal (mirrors the student dashboard). */}
      {activeTool && (
        <div className="fixed inset-0 z-[120] flex flex-col bg-slate-950 p-4 sm:p-6">
          <div className="mb-4 flex shrink-0 items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/80 text-fuchsia-400">
                {(() => {
                  const Icon = toolIcon(activeTool.iconName);
                  return <Icon size={18} />;
                })()}
              </div>
              <div>
                <h2 className="text-lg font-black leading-tight text-white">{activeTool.title}</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Studyhours.com Interactive Learning Lab
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTool(null)}
              className="rounded-xl bg-slate-800 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-red-500"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
          <div className="relative w-full flex-1 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
            {labLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-slate-900 text-slate-400">
                <Loader2 size={32} className="animate-spin text-fuchsia-400" />
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Initializing…</p>
              </div>
            )}
            <iframe
              src={activeTool.url}
              title={activeTool.title}
              loading="lazy"
              onLoad={() => setLabLoading(false)}
              allow="fullscreen; autoplay; xr-spatial-tracking; accelerometer; gyroscope"
              className="h-full w-full rounded-3xl border-0"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        </div>
      )}
    </AppPage>
  );
}
