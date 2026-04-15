'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import ProtectedClient from '@/app/components/ProtectedClient';
import { api } from '@/app/lib/api';
import {
  BookOpen, ArrowLeft, Loader2, AlertCircle, Download, FileText, Search,
} from 'lucide-react';
import { format } from 'date-fns';

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

const NOTE_TYPE_COLOR: Record<string, string> = {
  annotated_pdf: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  after_class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  general: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  whiteboard_pdf: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

function NotesContent() {
  const router = useRouter();
  const [notes, setNotes] = useState<ClassNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search update
  const updateSearch = useCallback(
    debounce((val: string) => setDebouncedSearch(val), 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    updateSearch(val);
  };

  useEffect(() => {
    api.get('/students/me/notes')
      .then(res => setNotes(res.data || []))
      .catch(() => setError('Could not load your notes.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (noteId: string, title: string) => {
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
      setError('Could not download this note. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const filtered = notes.filter(n =>
    debouncedSearch === '' ||
    n.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    (n.sessions?.bookings?.subjects?.name || '').toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const tutorName = (note: ClassNote) =>
    [note.users?.first_name, note.users?.last_name].filter(Boolean).join(' ') || 'Tutor';

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/students/dashboard')}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} /> Dashboard
          </button>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <BookOpen size={28} className="text-green-500" /> Shared Notes
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Annotated PDFs and after-class notes shared by your tutors.
            </p>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9 pr-4 py-2 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-3 text-text-secondary p-8">
            <Loader2 size={20} className="animate-spin" /> Loading notes...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">
            <AlertCircle size={18} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16 text-text-secondary space-y-2">
            <BookOpen size={40} className="mx-auto opacity-30" />
            <p className="font-medium">No notes shared yet.</p>
            <p className="text-sm">Your tutor will share notes here after sessions.</p>
          </div>
        )}

        <div className="space-y-4">
          {filtered.map(note => {
            const subject = note.sessions?.bookings?.subjects?.name || 'Session';
            const date = note.sessions?.start_time
              ? format(new Date(note.sessions.start_time), 'EEE, MMM d, yyyy')
              : format(new Date(note.created_at), 'EEE, MMM d, yyyy');
            const typeColor = NOTE_TYPE_COLOR[note.note_type] || NOTE_TYPE_COLOR.general;
            const typeLabel = NOTE_TYPE_LABEL[note.note_type] || 'Notes';

            return (
              <div
                key={note.id}
                className="p-5 rounded-3xl bg-surface border border-border shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-foreground">{note.title}</h3>
                      <p className="text-sm text-text-secondary">{subject} · {date}</p>
                      <p className="text-xs text-text-secondary">Shared by {tutorName(note)}</p>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColor}`}>
                        {typeLabel}
                      </span>
                    </div>
                  </div>

                  {note.blob_name && (
                    <button
                      onClick={() => handleDownload(note.id, note.title)}
                      disabled={downloading === note.id}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shrink-0"
                    >
                      {downloading === note.id
                        ? <Loader2 size={14} className="animate-spin" />
                        : <Download size={14} />}
                      Download
                    </button>
                  )}
                </div>

                {note.content && (
                  <div className="mt-4 p-4 rounded-2xl bg-background border border-border">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{note.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function NotesPage() {
  return (
    <ProtectedClient roles={['student', 'parent', 'admin']}>
      <NotesContent />
    </ProtectedClient>
  );
}
