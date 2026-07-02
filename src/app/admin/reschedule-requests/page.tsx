'use client';

import { useEffect, useState } from 'react';
import { CalendarClock, Check, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import ProtectedClient from '@/app/components/ProtectedClient';
import { api } from '@/app/lib/api';

type RescheduleRequest = {
  id: string;
  student_name: string | null;
  subject: string | null;
  class_time: string | null;
  reason: string | null;
  preferred_slots: string | null;
  status: 'pending' | 'approved' | 'declined';
  admin_note: string | null;
  created_at: string | null;
};

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-300 ring-amber-400/30',
  approved: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30',
  declined: 'bg-rose-500/15 text-rose-300 ring-rose-400/30',
};

export default function AdminReschedulePage() {
  return (
    <ProtectedClient roles={['admin']}>
      <AdminReschedule />
    </ProtectedClient>
  );
}

function AdminReschedule() {
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [rows, setRows] = useState<RescheduleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/reschedule-requests', {
        params: filter === 'pending' ? { status: 'pending' } : undefined,
      });
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Approve modal, admin picks the NEW class time (approving actually reschedules).
  const [approving, setApproving] = useState<RescheduleRequest | null>(null);
  const [newStart, setNewStart] = useState('');
  const [duration, setDuration] = useState(60);

  const openApprove = (r: RescheduleRequest) => {
    // Prefill the picker with the current class time (local) for easy tweaking.
    if (r.class_time) {
      const d = new Date(r.class_time);
      const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setNewStart(local);
    } else {
      setNewStart('');
    }
    setDuration(60);
    setApproving(r);
  };

  const patch = async (id: string, body: any) => {
    setBusy(id);
    try {
      await api.patch(`/admin/reschedule-requests/${id}`, body);
      toast.success(body.action === 'approved' ? 'Class rescheduled & approved' : 'Request declined');
      setApproving(null);
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Could not update request.');
    } finally {
      setBusy(null);
    }
  };

  const confirmApprove = () => {
    if (!approving || !newStart) return;
    const start = new Date(newStart);
    const end = new Date(start.getTime() + duration * 60000);
    patch(approving.id, { action: 'approved', newStart: start.toISOString(), newEnd: end.toISOString() });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 text-(--color-text-primary)">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
            <CalendarClock size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Reschedule Requests</h1>
            <p className="text-sm text-slate-500 dark:text-white/45">Students asking to move a pre-scheduled class.</p>
          </div>
        </div>

        <div className="mb-5 flex gap-2">
          {(['pending', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-all ${
                filter === f
                  ? 'bg-indigo-600 text-white dark:bg-indigo-500/20 dark:text-indigo-200 dark:ring-1 dark:ring-indigo-400/40'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-white/55 dark:ring-1 dark:ring-white/10 dark:hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/40">
            No {filter === 'pending' ? 'pending ' : ''}reschedule requests.
          </p>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:shadow-none">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {r.student_name || 'Student'} · {r.subject || 'Class'}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-white/45">
                      Class: {r.class_time ? format(new Date(r.class_time), 'EEE, d MMM yyyy · h:mm a') : 'Unknown'}
                      {r.created_at ? ` · requested ${format(new Date(r.created_at), 'd MMM')}` : ''}
                    </p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${STATUS_STYLE[r.status]}`}>
                    {r.status}
                  </span>
                </div>

                {(r.reason || r.preferred_slots) && (
                  <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-white/10 dark:bg-white/[0.02]">
                    {r.reason && (
                      <p className="text-slate-700 dark:text-white/70">
                        <span className="text-slate-400 dark:text-white/40">Reason: </span>
                        {r.reason}
                      </p>
                    )}
                    {r.preferred_slots && (
                      <p className="text-slate-700 dark:text-white/70">
                        <span className="text-slate-400 dark:text-white/40">Prefers: </span>
                        {r.preferred_slots}
                      </p>
                    )}
                  </div>
                )}

                {r.status === 'pending' && (
                  <div className="mt-4 flex gap-2">
                    <button
                      disabled={busy === r.id}
                      onClick={() => openApprove(r)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-4 py-2 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/20 transition-colors hover:bg-emerald-500/25 disabled:opacity-50"
                    >
                      <Check size={13} /> Approve &amp; reschedule
                    </button>
                    <button
                      disabled={busy === r.id}
                      onClick={() => patch(r.id, { action: 'declined' })}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300 ring-1 ring-rose-400/20 transition-colors hover:bg-rose-500/20 disabled:opacity-50"
                    >
                      {busy === r.id ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />} Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approve modal, pick the new class time (this actually moves the class). */}
      {approving && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Reschedule &amp; approve</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-white/45">
              {approving.student_name || 'Student'} · {approving.subject || 'Class'}
              {approving.class_time ? ` · now ${format(new Date(approving.class_time), 'EEE d MMM, h:mm a')}` : ''}
            </p>
            {approving.preferred_slots && (
              <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-white/[0.03] dark:text-white/60">
                <span className="text-slate-400 dark:text-white/40">Student prefers: </span>{approving.preferred_slots}
              </p>
            )}

            <label className="mt-4 mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40">
              New date &amp; time
            </label>
            <input
              type="datetime-local"
              value={newStart}
              onChange={(e) => setNewStart(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:focus:border-emerald-400/60"
            />

            <label className="mt-4 mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:focus:border-emerald-400/60"
            >
              {[30, 45, 60, 90, 120].map((m) => (
                <option key={m} value={m}>{m} minutes</option>
              ))}
            </select>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button onClick={() => setApproving(null)} className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white">
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                disabled={!newStart || busy === approving.id}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busy === approving.id ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                Reschedule &amp; approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
