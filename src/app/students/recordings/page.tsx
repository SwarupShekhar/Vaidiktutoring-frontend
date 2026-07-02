'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useIsAppShell } from '@/app/Hooks/useIsAppShell';
import { api } from '@/app/lib/api';
import {
  Play, Camera, ArrowLeft, Loader2, AlertCircle, Video, Search,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  AppPage,
  AppPageItem,
  AppPageHeader,
  AppCard,
  AppSearchInput,
  AppPillButton,
  AppEmptyState,
  AppSkeletonCard,
  accentRgb,
} from '@/app/components/app-shell/ui';

interface SessionEntry {
  sessionId: string;
  subject: string;
  startTime: string | null;
  endTime: string | null;
  status: string | null;
  hasRecording: boolean;
  recordingId: string | null;
  hasWhiteboardSnapshot: boolean;
  tutorNote: string | null;
}

function RecordingsContent() {
  const router = useRouter();
  const isAppShell = useIsAppShell();
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search update to prevent excessive re-renders/API calls
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
    api.get('/students/me/sessions')
      .then(res => setSessions(res.data || []))
      .catch(() => setError('Could not load your sessions.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = sessions.filter(s =>
    (s.hasRecording || s.hasWhiteboardSnapshot) &&
    (debouncedSearch === '' || s.subject.toLowerCase().includes(debouncedSearch.toLowerCase()))
  );

  // Group by subject
  const bySubject = filtered.reduce<Record<string, SessionEntry[]>>((acc, s) => {
    const key = s.subject;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  // ----- Desktop app-shell branch (premium dark) -----
  if (isAppShell) {
    return (
      <RecordingsAppShellView
        loading={loading}
        error={error}
        filtered={filtered}
        bySubject={bySubject}
        search={search}
        onSearchChange={handleSearchChange}
        onView={(sessionId) => router.push(`/students/recordings/${sessionId}`)}
      />
    );
  }

  // ----- Web branch (UNCHANGED) -----
  return (
    <div className={isAppShell ? 'p-4 md:p-8' : 'min-h-screen bg-background p-4 md:p-8'}>
      <div className={isAppShell ? 'w-full space-y-8' : 'max-w-5xl mx-auto space-y-8'}>
        {/* Header */}
        {!isAppShell && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/students/dashboard')}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} /> Dashboard
            </button>
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Video size={28} className="text-purple-500" /> Recordings & Snapshots
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              All your session recordings and whiteboard snapshots, grouped by subject.
            </p>
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search subject..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9 pr-4 py-2 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-3 text-text-secondary p-8">
            <Loader2 size={20} className="animate-spin" /> Loading your sessions...
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
            <Video size={40} className="mx-auto opacity-30" />
            <p className="font-medium">No recordings or snapshots yet.</p>
            <p className="text-sm">They will appear here after your sessions.</p>
          </div>
        )}

        {/* Sessions grouped by subject */}
        {Object.entries(bySubject).map(([subject, subjectSessions]) => (
          <section key={subject} className="space-y-4">
            <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">{subject}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectSessions.map(s => (
                <div
                  key={s.sessionId}
                  className="group p-5 rounded-3xl bg-surface border border-border shadow-sm hover:shadow-md transition-all flex flex-col gap-3"
                >
                  {/* Date */}
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {s.startTime
                        ? format(new Date(s.startTime), 'EEE, MMM d, yyyy')
                        : 'Date TBD'}
                    </p>
                    {s.startTime && (
                      <p className="text-xs text-text-secondary">
                        {format(new Date(s.startTime), 'h:mm a')}
                        {s.endTime ? ` – ${format(new Date(s.endTime), 'h:mm a')}` : ''}
                      </p>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap">
                    {s.hasRecording && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                        <Play size={10} /> Recording
                      </span>
                    )}
                    {s.hasWhiteboardSnapshot && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        <Camera size={10} /> Whiteboard
                      </span>
                    )}
                  </div>

                  {/* Tutor note preview */}
                  {s.tutorNote && (
                    <p className="text-xs text-text-secondary italic line-clamp-2">
                      "{s.tutorNote}"
                    </p>
                  )}

                  {/* CTA */}
                  <button
                    onClick={() => router.push(`/students/recordings/${s.sessionId}`)}
                    className="mt-auto w-full py-2.5 bg-background hover:bg-purple-600 hover:text-white border border-border hover:border-purple-600 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2"
                  >
                    <Play size={13} /> View Session
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------
// Desktop app-shell view (premium dark). Renders ONLY inside the Electron
// shell; the web branch above is untouched.
// -------------------------------------------------------------------------
function RecordingsAppShellView({
  loading,
  error,
  filtered,
  bySubject,
  search,
  onSearchChange,
  onView,
}: {
  loading: boolean;
  error: string | null;
  filtered: SessionEntry[];
  bySubject: Record<string, SessionEntry[]>;
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onView: (sessionId: string) => void;
}) {
  return (
    <AppPage>
      <AppPageItem>
        <AppPageHeader
          icon={Video}
          accent="purple"
          title="Recordings & Snapshots"
          subtitle="All your session recordings and whiteboard snapshots, grouped by subject."
          right={
            <AppSearchInput
              value={search}
              onChange={onSearchChange}
              placeholder="Search subject..."
              accent="purple"
            />
          }
        />
      </AppPageItem>

      {loading && (
        <AppPageItem>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <AppSkeletonCard key={i} />
            ))}
          </div>
        </AppPageItem>
      )}

      {!loading && error && (
        <AppPageItem>
          <AppEmptyState
            tone="error"
            icon={AlertCircle}
            title="Couldn't load your sessions"
            description={error}
          />
        </AppPageItem>
      )}

      {!loading && !error && filtered.length === 0 && (
        <AppPageItem>
          <AppEmptyState
            icon={Video}
            accent="purple"
            title="No recordings or snapshots yet"
            description="They will appear here after your sessions."
          />
        </AppPageItem>
      )}

      {!loading && !error &&
        Object.entries(bySubject).map(([subject, subjectSessions]) => (
          <section key={subject} className="space-y-4">
            <AppPageItem>
              <h2 className="border-b border-white/10 pb-2 text-xl font-bold text-white">
                {subject}
              </h2>
            </AppPageItem>
            <AppPageItem>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subjectSessions.map((s) => (
                  <AppCard key={s.sessionId} accent="purple" interactive>
                    <div className="flex h-full flex-col gap-3">
                      {/* Date + time range */}
                      <div>
                        <p className="text-sm font-bold text-white">
                          {s.startTime
                            ? format(new Date(s.startTime), 'EEE, MMM d, yyyy')
                            : 'Date TBD'}
                        </p>
                        {s.startTime && (
                          <p className="text-xs text-white/50">
                            {format(new Date(s.startTime), 'h:mm a')}
                            {s.endTime ? ` – ${format(new Date(s.endTime), 'h:mm a')}` : ''}
                          </p>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        {s.hasRecording && (
                          <span
                            className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                            style={{
                              background: accentRgb('purple', 0.14),
                              color: accentRgb('purple'),
                              border: `1px solid ${accentRgb('purple', 0.3)}`,
                            }}
                          >
                            <Play size={10} /> Recording
                          </span>
                        )}
                        {s.hasWhiteboardSnapshot && (
                          <span
                            className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                            style={{
                              background: accentRgb('sky', 0.14),
                              color: accentRgb('sky'),
                              border: `1px solid ${accentRgb('sky', 0.3)}`,
                            }}
                          >
                            <Camera size={10} /> Whiteboard
                          </span>
                        )}
                      </div>

                      {/* Tutor note preview */}
                      {s.tutorNote && (
                        <p className="line-clamp-2 text-xs italic text-white/55">
                          &ldquo;{s.tutorNote}&rdquo;
                        </p>
                      )}

                      {/* CTA */}
                      <div className="mt-auto pt-1">
                        <AppPillButton
                          accent="purple"
                          variant="soft"
                          className="w-full"
                          onClick={() => onView(s.sessionId)}
                        >
                          <Play size={13} /> View Session
                        </AppPillButton>
                      </div>
                    </div>
                  </AppCard>
                ))}
              </div>
            </AppPageItem>
          </section>
        ))}
    </AppPage>
  );
}

export default function RecordingsPage() {
  return (
    <ProtectedClient roles={['student', 'parent', 'admin']}>
      <RecordingsContent />
    </ProtectedClient>
  );
}
