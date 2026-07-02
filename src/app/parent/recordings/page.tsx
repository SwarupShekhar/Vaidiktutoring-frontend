'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Video, PlayCircle, Loader2, Baby, X } from 'lucide-react';
import { format } from 'date-fns';
import ProtectedClient from '@/app/components/ProtectedClient';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { api } from '@/app/lib/api';
import { useParentDashboard } from '@/app/Hooks/useParentDashboard';
import {
  AppPage,
  AppPageItem,
  AppPageHeader,
  AppCard,
  AppEmptyState,
  AppSkeletonCard,
} from '@/app/components/app-shell/ui';

type ChildSession = {
  id: string;
  start_time: string | null;
  end_time: string | null;
  status: string | null;
  session_recordings?: Array<{ id: string }>;
  bookings?: {
    subjects?: { name?: string } | null;
    tutors?: { users?: { first_name?: string; last_name?: string } | null } | null;
  } | null;
};

export default function ParentRecordingsPage() {
  return (
    <ProtectedClient roles={['parent']}>
      <ErrorBoundary>
        <Suspense fallback={null}>
          <ParentRecordings />
        </Suspense>
      </ErrorBoundary>
    </ProtectedClient>
  );
}

const childLabel = (s: { first_name?: string; last_name?: string }) =>
  `${s.first_name ?? ''} ${s.last_name ?? ''}`.trim() || 'Child';

function ParentRecordings() {
  const { students, loadingStudentList } = useParentDashboard();

  const preChild = useSearchParams().get('child');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  useEffect(() => {
    if (!selectedChildId && students.length > 0) {
      const initial = preChild && students.some((s) => s.id === preChild) ? preChild : students[0].id;
      setSelectedChildId(initial);
    }
  }, [students, selectedChildId, preChild]);

  const selectedChild = useMemo(
    () => students.find((s) => s.id === selectedChildId) ?? null,
    [students, selectedChildId],
  );

  const [sessions, setSessions] = useState<ChildSession[]>([]);
  const [loading, setLoading] = useState(false);

  // Playback modal
  const [playing, setPlaying] = useState<ChildSession | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [streamLoading, setStreamLoading] = useState(false);

  useEffect(() => {
    if (!selectedChildId) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/parent/children/${selectedChildId}/sessions`);
        const all: ChildSession[] = Array.isArray(res.data) ? res.data : [];
        // Only sessions that actually have a recording.
        if (!cancelled) setSessions(all.filter((s) => (s.session_recordings?.length ?? 0) > 0));
      } catch {
        if (!cancelled) setSessions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedChildId]);

  const openRecording = async (session: ChildSession) => {
    const recordingId = session.session_recordings?.[0]?.id;
    if (!recordingId) return;
    setPlaying(session);
    setStreamUrl(null);
    setStreamLoading(true);
    try {
      const res = await api.get(`/sessions/${session.id}/recordings/${recordingId}/stream`);
      const url = res.data?.streamUrl || res.data?.url || res.data?.sasUrl;
      if (!url) throw new Error('No stream URL');
      setStreamUrl(url);
    } catch {
      setPlaying(null);
    } finally {
      setStreamLoading(false);
    }
  };

  const closePlayer = () => {
    setPlaying(null);
    setStreamUrl(null);
  };

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePlayer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playing]);

  const subjectOf = (s: ChildSession) => s.bookings?.subjects?.name || 'Session';
  const tutorOf = (s: ChildSession) => {
    const u = s.bookings?.tutors?.users;
    return [u?.first_name, u?.last_name].filter(Boolean).join(' ');
  };

  return (
    <AppPage>
      <AppPageItem>
        <AppPageHeader
          icon={Video}
          accent="violet"
          title="Recordings"
          subtitle={
            selectedChild
              ? `Session recordings for ${childLabel(selectedChild)}.`
              : "Your child's recorded sessions."
          }
        />
      </AppPageItem>

      {students.length > 1 && (
        <AppPageItem>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/40">
              <Baby size={14} /> Viewing
            </span>
            {students.map((s) => {
              const active = s.id === selectedChildId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedChildId(s.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${
                    active
                      ? 'bg-violet-500/20 text-violet-200 ring-1 ring-violet-400/40'
                      : 'bg-white/5 text-white/55 ring-1 ring-white/10 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  {childLabel(s)}
                </button>
              );
            })}
          </div>
        </AppPageItem>
      )}

      <AppPageItem>
        {loading || loadingStudentList ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <AppSkeletonCard />
            <AppSkeletonCard />
          </div>
        ) : students.length === 0 ? (
          <AppEmptyState icon={Baby} accent="violet" title="No children yet" />
        ) : sessions.length === 0 ? (
          <AppEmptyState icon={Video} accent="violet" title="No recordings yet" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {sessions.map((s) => (
              <AppCard key={s.id} accent="violet" onClick={() => openRecording(s)}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                    <PlayCircle size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-white">{subjectOf(s)}</p>
                    <p className="mt-0.5 text-xs text-white/45">
                      {s.start_time ? format(new Date(s.start_time), 'EEE, d MMM · h:mm a') : 'Recorded session'}
                      {tutorOf(s) ? ` · ${tutorOf(s)}` : ''}
                    </p>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-violet-300">
                  <PlayCircle size={13} /> Watch
                </div>
              </AppCard>
            ))}
          </div>
        )}
      </AppPageItem>

      {playing && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/85 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-white/10 bg-[#0a0a0f] px-5 py-3">
            <p className="truncate text-sm font-bold text-white">
              {subjectOf(playing)}
              {playing.start_time ? ` · ${format(new Date(playing.start_time), 'd MMM yyyy')}` : ''}
            </p>
            <button
              onClick={closePlayer}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white/70 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={14} /> Close
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center p-4">
            {streamLoading || !streamUrl ? (
              <div className="flex flex-col items-center gap-3 text-white/50">
                <Loader2 size={30} className="animate-spin text-violet-400" />
                <p className="text-xs font-bold uppercase tracking-widest">Loading…</p>
              </div>
            ) : (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video src={streamUrl} controls autoPlay className="max-h-full max-w-full rounded-xl" />
            )}
          </div>
        </div>
      )}
    </AppPage>
  );
}
