'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen, FileText, Download, Loader2, Baby } from 'lucide-react';
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

interface ClassNote {
  id: string;
  title: string;
  note_type: string;
  blob_name: string | null;
  content: string | null;
  created_at: string;
  users: { first_name: string | null; last_name: string | null };
  sessions: {
    id: string;
    start_time: string | null;
    bookings: { subjects: { name: string } | null } | null;
  };
}

const NOTE_TYPE_LABEL: Record<string, string> = {
  annotated_pdf: 'Annotated PDF',
  after_class: 'After-Class Notes',
  general: 'General Notes',
  whiteboard_pdf: 'Whiteboard Export',
};

export default function ParentNotesPage() {
  return (
    <ProtectedClient roles={['parent']}>
      <ErrorBoundary>
        <Suspense fallback={null}>
          <ParentNotes />
        </Suspense>
      </ErrorBoundary>
    </ProtectedClient>
  );
}

const childLabel = (s: { first_name?: string; last_name?: string }) =>
  `${s.first_name ?? ''} ${s.last_name ?? ''}`.trim() || 'Child';

function ParentNotes() {
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

  const [notes, setNotes] = useState<ClassNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedChildId) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get('/students/me/notes', { params: { studentId: selectedChildId } });
        if (!cancelled) setNotes(Array.isArray(res.data) ? res.data : []);
      } catch {
        if (!cancelled) setNotes([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedChildId]);

  const handleDownload = async (noteId: string) => {
    setDownloading(noteId);
    try {
      const res = await api.get(`/sessions/notes/${noteId}/download`);
      const url = res.data?.url;
      if (!url) throw new Error('No download URL');
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
    } catch {
      /* swallow — button just re-enables */
    } finally {
      setDownloading(null);
    }
  };

  const tutorName = (note: ClassNote) =>
    [note.users?.first_name, note.users?.last_name].filter(Boolean).join(' ') || 'Tutor';

  return (
    <AppPage>
      <AppPageItem>
        <AppPageHeader
          icon={BookOpen}
          accent="emerald"
          title="Shared Notes"
          subtitle={
            selectedChild
              ? `Notes tutors shared with ${childLabel(selectedChild)}.`
              : 'After-class notes and annotated PDFs from tutors.'
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
                      ? 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40'
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
          <AppEmptyState icon={Baby} accent="emerald" title="No children yet" />
        ) : notes.length === 0 ? (
          <AppEmptyState icon={FileText} accent="emerald" title="No notes shared yet" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {notes.map((note) => (
              <AppCard key={note.id} accent="emerald" interactive={false}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-white">{note.title}</p>
                    <p className="mt-0.5 text-xs text-white/45">
                      {NOTE_TYPE_LABEL[note.note_type] ?? 'Notes'}
                      {note.sessions?.bookings?.subjects?.name
                        ? ` · ${note.sessions.bookings.subjects.name}`
                        : ''}
                    </p>
                    <p className="mt-1 text-[11px] text-white/35">
                      {tutorName(note)}
                      {note.created_at ? ` · ${format(new Date(note.created_at), 'd MMM yyyy')}` : ''}
                    </p>
                  </div>
                </div>
                {note.blob_name && (
                  <button
                    type="button"
                    disabled={downloading === note.id}
                    onClick={() => handleDownload(note.id)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/20 transition-colors hover:bg-emerald-500/25 disabled:opacity-50"
                  >
                    {downloading === note.id ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                    Download
                  </button>
                )}
                {!note.blob_name && note.content && (
                  <p className="mt-3 whitespace-pre-wrap text-sm text-white/70">{note.content}</p>
                )}
              </AppCard>
            ))}
          </div>
        )}
      </AppPageItem>
    </AppPage>
  );
}
