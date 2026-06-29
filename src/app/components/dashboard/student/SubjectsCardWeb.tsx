'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

const LEVEL_STYLE: Record<string, { cls: string; glyph: string }> = {
  improving: {
    cls: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
    glyph: '↑',
  },
  needs_work: {
    cls: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
    glyph: '⚠',
  },
  steady: {
    cls: 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10',
    glyph: '→',
  },
};

/**
 * "Your subjects" card for the web student dashboard: enrolled subjects (with
 * trend) + topics covered recently. Reads from progressSummary (same data the
 * app-shell card uses). Hidden when there's nothing to show.
 */
export function SubjectsCardWeb({ progressSummary }: { progressSummary?: any }) {
  const subjects: { subject: string; level: string }[] = Array.isArray(progressSummary?.subjectProgress)
    ? progressSummary.subjectProgress
    : [];
  const topics: string[] = Array.isArray(progressSummary?.topicsThisMonth)
    ? progressSummary.topicsThisMonth
    : [];

  if (subjects.length === 0 && topics.length === 0) return null;

  return (
    <div className="bg-surface rounded-3xl border border-border p-6 shadow-sm sm:p-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <BookOpen size={18} />
        </span>
        <div>
          <h2 className="text-lg font-black text-(--color-text-primary)">Your subjects</h2>
          <p className="text-xs text-text-secondary">
            Subjects you’re enrolled in and topics covered recently
          </p>
        </div>
      </div>

      {subjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subjects.map((s, i) => {
            const st = LEVEL_STYLE[s.level] ?? LEVEL_STYLE.steady;
            return (
              <Link
                key={i}
                href={`/students/vault?subject=${encodeURIComponent(s.subject)}`}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-transform hover:scale-105 ${st.cls}`}
              >
                <span>{st.glyph}</span>
                {s.subject}
              </Link>
            );
          })}
        </div>
      )}

      {topics.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            Topics covered
          </p>
          <div className="flex flex-wrap gap-1.5">
            {topics.map((t, i) => (
              <span
                key={i}
                className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-(--color-text-primary)"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
