'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Clock, GraduationCap, CalendarClock, Loader2, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import ProtectedClient from '@/app/components/ProtectedClient';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { api } from '@/app/lib/api';
import { useCreditStatus } from '@/app/Hooks/useCreditStatus';
import {
  AppPage,
  AppPageItem,
  AppPageHeader,
  AppCard,
  AppEmptyState,
  AppSkeletonCard,
} from '@/app/components/app-shell/ui';

type StudentSession = {
  sessionId: string;
  subject: string;
  tutorName: string | null;
  startTime: string | null;
  endTime: string | null;
  status: string | null;
  attendanceStatus: 'upcoming' | 'attended' | 'absent';
};

type RescheduleReq = { id: string; session_id: string | null; status: string };

export default function StudentSchedulePage() {
  return (
    <ProtectedClient roles={['student']}>
      <ErrorBoundary>
        <StudentSchedule />
      </ErrorBoundary>
    </ProtectedClient>
  );
}

function StudentSchedule() {
  const router = useRouter();
  const { status: credit, loading: creditLoading } = useCreditStatus();

  // Trial students book via the diagnostic/booking wizard; paid/learning students
  // have pre-scheduled classes shown here.
  const isTrial =
    credit?.mode === 'trial_active' ||
    credit?.mode === 'trial_exhausted' ||
    credit?.mode === 'trial_expired' ||
    credit?.mode === 'no_access';

  useEffect(() => {
    if (!creditLoading && isTrial) router.replace('/bookings/new');
  }, [creditLoading, isTrial, router]);

  const [sessions, setSessions] = useState<StudentSession[]>([]);
  const [requests, setRequests] = useState<RescheduleReq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (creditLoading || isTrial) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [sRes, rRes] = await Promise.all([
          api.get('/students/me/sessions'),
          api.get('/students/me/reschedule-requests').catch(() => ({ data: [] })),
        ]);
        if (cancelled) return;
        const all: StudentSession[] = Array.isArray(sRes.data) ? sRes.data : [];
        setSessions(
          all
            .filter((s) => s.attendanceStatus === 'upcoming')
            .sort((a, b) => new Date(a.startTime || 0).getTime() - new Date(b.startTime || 0).getTime()),
        );
        setRequests(Array.isArray(rRes.data) ? rRes.data : []);
      } catch {
        if (!cancelled) setSessions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [creditLoading, isTrial]);

  const pendingBySession = useMemo(() => {
    const m = new Set<string>();
    requests.forEach((r) => {
      if (r.status === 'pending' && r.session_id) m.add(r.session_id);
    });
    return m;
  }, [requests]);

  // Reschedule modal
  const [target, setTarget] = useState<StudentSession | null>(null);
  const [reason, setReason] = useState('');
  const [preferred, setPreferred] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitReschedule = async () => {
    if (!target) return;
    setSubmitting(true);
    try {
      await api.post('/students/me/reschedule-requests', {
        sessionId: target.sessionId,
        reason: reason.trim() || undefined,
        preferredSlots: preferred.trim() || undefined,
      });
      toast.success('Reschedule request sent to the team.');
      setRequests((prev) => [
        { id: `tmp-${target.sessionId}`, session_id: target.sessionId, status: 'pending' },
        ...prev,
      ]);
      setTarget(null);
      setReason('');
      setPreferred('');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Could not send request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (creditLoading || isTrial) {
    return (
      <AppPage>
        <AppPageItem>
          <AppSkeletonCard />
        </AppPageItem>
      </AppPage>
    );
  }

  return (
    <AppPage>
      <AppPageItem>
        <AppPageHeader
          icon={CalendarDays}
          accent="indigo"
          title="Your Schedule"
          subtitle="Your upcoming classes. Need to move one? Request a reschedule and our team will sort it."
        />
      </AppPageItem>

      <AppPageItem>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <AppSkeletonCard />
            <AppSkeletonCard />
          </div>
        ) : sessions.length === 0 ? (
          <AppEmptyState
            icon={CalendarClock}
            accent="indigo"
            title="No upcoming classes"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {sessions.map((s) => {
              const pending = pendingBySession.has(s.sessionId);
              return (
                <AppCard key={s.sessionId} accent="indigo" interactive={false}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                      <GraduationCap size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-white">{s.subject}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/45">
                        <Clock size={12} />
                        {s.startTime ? format(new Date(s.startTime), 'EEE, d MMM · h:mm a') : 'Time TBD'}
                        {s.tutorName ? ` · ${s.tutorName}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    {pending ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-bold text-amber-300 ring-1 ring-amber-400/20">
                        <Clock size={13} /> Reschedule requested
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setTarget(s)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-indigo-200 ring-1 ring-white/10 transition-colors hover:bg-white/10"
                      >
                        <CalendarClock size={13} /> Request reschedule
                      </button>
                    )}
                  </div>
                </AppCard>
              );
            })}
          </div>
        )}
      </AppPageItem>

      {/* Reschedule request modal */}
      {target && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#15131f] p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white">Request reschedule</h2>
                <p className="mt-0.5 text-xs text-white/45">
                  {target.subject}
                  {target.startTime ? ` · ${format(new Date(target.startTime), 'EEE, d MMM · h:mm a')}` : ''}
                </p>
              </div>
              <button
                onClick={() => setTarget(null)}
                className="rounded-lg p-1.5 text-white/50 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/40">
              Reason (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Family commitment that day"
              className="mb-4 min-h-[64px] w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-400/60"
            />

            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/40">
              Preferred alternative times
            </label>
            <textarea
              value={preferred}
              onChange={(e) => setPreferred(e.target.value)}
              placeholder="e.g. Weekday evenings after 6pm, or Sat mornings"
              className="mb-5 min-h-[64px] w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-400/60"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setTarget(null)}
                className="rounded-xl px-4 py-2 text-sm font-bold text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={submitReschedule}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                Send request
              </button>
            </div>
          </div>
        </div>
      )}
    </AppPage>
  );
}
