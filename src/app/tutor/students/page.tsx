'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Users, FileText, Loader2, GraduationCap } from 'lucide-react';
import ProtectedClient from '@/app/components/ProtectedClient';
import { api } from '@/app/lib/api';
import ShareNotesModal from '../ShareNotesModal';

interface TaughtSession {
  sessionId: string;
  date: string | null;
  subject: string;
}
interface TaughtStudent {
  studentId: string;
  studentName: string;
  sessions: TaughtSession[];
}

function fmtDate(d: string | null) {
  if (!d) return 'Date n/a';
  return new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function MyStudentsContent() {
  const [students, setStudents] = useState<TaughtStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [share, setShare] = useState<{ sessionId: string; studentName: string } | null>(null);

  useEffect(() => {
    api
      .get('/tutor/my-students')
      .then(res => setStudents(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Could not load your students.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <Link
          href="/tutor/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
            <Users className="text-emerald-600 dark:text-emerald-400" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Students</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Students you've taught. Share notes &amp; files for any past session.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : error ? (
          <p className="py-20 text-center text-rose-500 font-medium">{error}</p>
        ) : students.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 py-16 text-center">
            <GraduationCap className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={40} />
            <p className="font-bold text-slate-600 dark:text-slate-300">No students yet.</p>
            <p className="text-sm text-slate-400">
              Once you've taught a session, that student appears here for sharing.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {students.map(stu => (
              <div
                key={stu.studentId}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5"
              >
                <h3 className="mb-3 text-lg font-black text-slate-900 dark:text-white">
                  {stu.studentName || 'Student'}
                </h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stu.sessions.map(s => (
                    <div key={s.sessionId} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{s.subject}</p>
                        <p className="text-xs text-slate-400">{fmtDate(s.date)}</p>
                      </div>
                      <button
                        onClick={() => setShare({ sessionId: s.sessionId, studentName: stu.studentName })}
                        className="flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2 text-sm font-black text-green-700 transition-colors hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                      >
                        <FileText size={15} /> Share
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {share && (
        <ShareNotesModal
          sessionId={share.sessionId}
          studentName={share.studentName}
          onClose={() => setShare(null)}
        />
      )}
    </div>
  );
}

export default function TutorStudentsPage() {
  return (
    <ProtectedClient roles={['tutor', 'admin']}>
      <MyStudentsContent />
    </ProtectedClient>
  );
}
