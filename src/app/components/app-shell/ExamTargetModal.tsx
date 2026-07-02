'use client';

import React, { useMemo, useState } from 'react';
import { X, Search, GraduationCap, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/app/lib/api';
import {
  EXAMS,
  EXAM_REGIONS,
  getExamById,
  parseSoonestDate,
  isExamDisrupted,
  type ExamEntry,
} from '@/app/lib/exams';

interface ExamTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any; // needs id, target_exam, exam_date
  /** Default region filter — pass the student's region if known. */
  defaultRegion?: string;
  onSaved?: () => void;
}

export function ExamTargetModal({ isOpen, onClose, student, defaultRegion, onSaved }: ExamTargetModalProps) {
  const queryClient = useQueryClient();

  const [region, setRegion] = useState<string>(
    defaultRegion && EXAM_REGIONS.includes(defaultRegion) ? defaultRegion : 'All',
  );
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(student?.target_exam ?? null);
  const [date, setDate] = useState<string>(() => {
    const raw = student?.exam_date;
    return raw ? new Date(raw).toISOString().slice(0, 10) : '';
  });
  const [saving, setSaving] = useState(false);

  const selected = getExamById(selectedId);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return EXAMS.filter((e) => {
      const matchRegion = region === 'All' || e.region === region;
      const matchSearch =
        !q ||
        e.exam.toLowerCase().includes(q) ||
        e.curriculum.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q);
      return matchRegion && matchSearch;
    });
  }, [region, search]);

  const pickExam = (e: ExamEntry) => {
    setSelectedId(e.id);
    // Pre-fill with the soonest parsed window date (student can adjust).
    if (!date) {
      const guess = parseSoonestDate(e.dates);
      if (guess) setDate(guess);
    }
  };

  const handleSave = async () => {
    if (!selectedId || !student?.id) return;
    setSaving(true);
    try {
      await api.patch(`/students/${student.id}`, {
        target_exam: selectedId,
        exam_date: date || null,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['student-profile'] }),
        queryClient.invalidateQueries({ queryKey: ['student-dashboard-summary'] }),
      ]);
      toast.success('Target exam saved.');
      onSaved?.();
      onClose();
    } catch (err) {
      console.error('Failed to save target exam', err);
      toast.error('Could not save your target exam. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#15131f] shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-300">
              <GraduationCap size={18} />
            </span>
            <div>
              <h2 className="text-base font-black text-white">Your target exam</h2>
              <p className="text-[11px] text-white/45">Pick your exam, then confirm your exam date.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg bg-white/5 p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-red-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filters */}
        <div className="shrink-0 space-y-3 border-b border-white/10 px-5 py-3">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exams (e.g. GCSE, SAT, IB)…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['All', ...EXAM_REGIONS].map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  region === r
                    ? 'bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/40'
                    : 'bg-white/5 text-white/55 hover:bg-white/10 hover:text-white/80'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Exam list */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-white/40">No exams match. Try another filter.</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((e) => {
                const active = e.id === selectedId;
                const disrupted = isExamDisrupted(e);
                return (
                  <button
                    key={e.id}
                    onClick={() => pickExam(e)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                      active
                        ? 'border-cyan-400/50 bg-cyan-500/10'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{e.exam}</span>
                          <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/45">
                            {e.region}
                          </span>
                          {disrupted && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                              <AlertTriangle size={10} /> Disrupted
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-xs text-white/50">{e.curriculum}</p>
                        <p className="mt-1 text-[11px] text-white/40">{e.dates}</p>
                      </div>
                      {active && <Check size={18} className="mt-0.5 shrink-0 text-cyan-300" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Confirm date + save */}
        <div className="shrink-0 border-t border-white/10 px-5 py-4">
          {selected ? (
            <div className="mb-3 flex flex-wrap items-end gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Selected</p>
                <p className="truncate text-sm font-bold text-white">
                  {selected.exam} <span className="font-normal text-white/45">· {selected.region}</span>
                </p>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white/40">
                  Your exam date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/50 [color-scheme:dark]"
                />
              </div>
            </div>
          ) : (
            <p className="mb-3 text-xs text-white/40">Select your exam above to set a date.</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-white/70 transition-colors hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedId || saving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-cyan-400 active:scale-95 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Save target exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
