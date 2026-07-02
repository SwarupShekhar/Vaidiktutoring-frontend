'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuthContext } from '@/app/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import { assessmentsApi, AssessmentQuestion } from '@/app/lib/assessments';
import { vaultApi } from '@/app/lib/vault';
import { getGradeOptions } from '@/app/lib/gradeTokens';
import {
  Loader2, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Flame, Timer, Zap, Trophy, Target, RotateCcw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MarkdownRenderer } from '@/app/components/ui/MarkdownRenderer';
import { useIsAppShell } from '@/app/Hooks/useIsAppShell';
import {
  AppPage, AppPageItem, AppPageHeader, AppCard, AppPillButton,
} from '@/app/components/app-shell/ui';

const ACCENT = { indigo: '129,140,248', amber: '245,158,11', emerald: '16,185,129', rose: '244,63,94' };
const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function PracticePage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isAppShell = useIsAppShell();

  const [curriculaOptions, setCurriculaOptions] = useState<{ id: string; name: string }[]>([]);

  // Setup
  const [isSetup, setIsSetup] = useState(true);
  const [selectedCurriculum, setSelectedCurriculum] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [loadingSetup, setLoadingSetup] = useState(false);
  const [setupError, setSetupError] = useState('');

  // Quiz
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Gamification
  const [xp, setXp] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [elapsed, setElapsed] = useState(0); // total seconds
  const [lastGain, setLastGain] = useState<{ id: number; correct: boolean; xp: number } | null>(null);

  useEffect(() => {
    vaultApi.getCurricula().then(setCurriculaOptions).catch((e) => console.error('Failed to load curricula', e));
  }, []);

  // Total session timer (runs during quiz, stops on results)
  useEffect(() => {
    if (isSetup || isSubmitted) return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isSetup, isSubmitted]);

  // Auto-dismiss the XP/feedback toast.
  useEffect(() => {
    if (!lastGain) return;
    const t = setTimeout(() => setLastGain(null), 1600);
    return () => clearTimeout(t);
  }, [lastGain]);

  const handleStartPractice = async () => {
    if (!user?.id) return;
    setLoadingSetup(true);
    setSetupError('');
    try {
      const fetched = await assessmentsApi.getPersonalizedQuestions(
        user.id, 20, selectedCurriculum || undefined, selectedGrade || undefined,
      );
      if (fetched.length === 0) {
        setSetupError('No questions available for this curriculum and grade combination yet.');
        return;
      }
      setQuestions(fetched);
      setIsSetup(false);
      setCurrentIndex(0);
      setAnswers({});
      setRevealedAnswers({});
      setXp(0); setCombo(0); setMaxCombo(0); setElapsed(0);
    } catch (error: any) {
      setSetupError(error.response?.data?.message || error.message || 'Failed to load questions. Please try again.');
    } finally {
      setLoadingSetup(false);
    }
  };

  const resetToSetup = () => {
    setIsSetup(true); setIsSubmitted(false); setCurrentIndex(0);
    setAnswers({}); setRevealedAnswers({}); setXp(0); setCombo(0); setMaxCombo(0); setElapsed(0);
  };

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (option: string) => {
    if (isSubmitted || !currentQuestion || revealedAnswers[currentQuestion.id]) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
  };

  // Reveal answer → award XP + update combo (once per question).
  const handleCheck = useCallback(() => {
    if (!currentQuestion || revealedAnswers[currentQuestion.id]) return;
    const correct = answers[currentQuestion.id] === currentQuestion.correct_answer;
    setRevealedAnswers((prev) => ({ ...prev, [currentQuestion.id]: true }));
    if (correct) {
      const newCombo = combo + 1;
      const gain = 10 + Math.min(newCombo - 1, 5) * 2; // base 10 + up to +10 combo bonus
      setCombo(newCombo);
      setMaxCombo((m) => Math.max(m, newCombo));
      setXp((x) => x + gain);
      setLastGain({ id: Date.now(), correct: true, xp: gain });
    } else {
      setCombo(0);
      setLastGain({ id: Date.now(), correct: false, xp: 0 });
    }
  }, [currentQuestion, revealedAnswers, answers, combo]);

  const correctCount = useMemo(
    () => questions.filter((q) => answers[q.id] === q.correct_answer).length,
    [questions, answers],
  );
  const scorePct = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;

  // Finish: show results + persist XP to the dashboard (Momentum card).
  const finishPractice = useCallback(async () => {
    setIsSubmitted(true);
    if (xp > 0) {
      try {
        await api.post('/students/me/practice-result', { xp });
        queryClient.invalidateQueries({ queryKey: ['student-dashboard-summary'] });
      } catch { /* non-blocking — results still show */ }
    }
  }, [xp, queryClient]);

  // Keyboard: 1-4 select, Enter check/next/finish.
  useEffect(() => {
    if (isSetup || isSubmitted || !currentQuestion) return;
    const onKey = (e: KeyboardEvent) => {
      const opts = currentQuestion.content.options;
      const revealed = revealedAnswers[currentQuestion.id];
      if (!revealed && /^[1-9]$/.test(e.key)) {
        const i = parseInt(e.key, 10) - 1;
        if (opts[i]) handleOptionSelect(opts[i]);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (!revealed) { if (answers[currentQuestion.id]) handleCheck(); }
        else if (currentIndex === questions.length - 1) finishPractice();
        else setCurrentIndex((i) => i + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSetup, isSubmitted, currentQuestion, revealedAnswers, answers, currentIndex, questions.length, handleCheck]);

  // ---------- SETUP ----------
  if (isSetup) {
    // Desktop app-shell: premium header + card chrome on the dark canvas.
    if (isAppShell) {
      return (
        <AppPage>
          <AppPageItem>
            <AppPageHeader
              icon={Target}
              accent="teal"
              title="Practice Center"
              subtitle="Drills & quizzes at your own pace."
            />
          </AppPageItem>

          <AppPageItem>
            <div className="mx-auto w-full max-w-lg">
              <AppCard accent="teal">
                {setupError && (
                  <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300">
                    <AlertCircle size={20} className="mt-0.5 shrink-0" />
                    <p className="text-sm">{setupError}</p>
                  </div>
                )}

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-white/45">Curriculum</label>
                    <select
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-teal-400/60"
                      value={selectedCurriculum}
                      onChange={(e) => { setSelectedCurriculum(e.target.value); setSelectedGrade(''); }}
                    >
                      <option value="" className="bg-[#15131f]">Match my profile default</option>
                      {curriculaOptions.map((c) => <option key={c.id} value={c.id} className="bg-[#15131f]">{c.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-white/45">Grade</label>
                    <select
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-teal-400/60 disabled:opacity-50"
                      value={selectedGrade}
                      disabled={!selectedCurriculum}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                    >
                      <option value="" className="bg-[#15131f]">{selectedCurriculum ? 'Select grade…' : 'Pick a curriculum first'}</option>
                      {getGradeOptions(selectedCurriculum).map((g) => <option key={g.value} value={g.value} className="bg-[#15131f]">{g.label} ({g.value})</option>)}
                    </select>
                  </div>

                  <AppPillButton
                    accent="teal"
                    variant="solid"
                    onClick={handleStartPractice}
                    disabled={loadingSetup || !user?.id}
                    className="mt-2 w-full py-3.5 text-sm"
                  >
                    {loadingSetup ? <Loader2 className="animate-spin" size={18} /> : <><Zap size={18} /> Start practising</>}
                  </AppPillButton>
                </div>
              </AppCard>
            </div>
          </AppPageItem>
        </AppPage>
      );
    }

    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#15131f] p-8 shadow-xl">
          <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `rgba(${ACCENT.indigo},0.15)`, color: `rgb(${ACCENT.indigo})` }}>
            <Target size={22} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Practice Center</h1>
          <p className="mt-1 mb-8 text-sm text-white/55">Pick a curriculum and grade for a personalised set. Earn XP, build a streak.</p>

          {setupError && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-300">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <p className="text-sm">{setupError}</p>
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-white/45">Curriculum</label>
              <select
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-indigo-400/60"
                value={selectedCurriculum}
                onChange={(e) => { setSelectedCurriculum(e.target.value); setSelectedGrade(''); }}
              >
                <option value="" className="bg-[#15131f]">Match my profile default</option>
                {curriculaOptions.map((c) => <option key={c.id} value={c.id} className="bg-[#15131f]">{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-white/45">Grade</label>
              <select
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-indigo-400/60 disabled:opacity-50"
                value={selectedGrade}
                disabled={!selectedCurriculum}
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                <option value="" className="bg-[#15131f]">{selectedCurriculum ? 'Select grade…' : 'Pick a curriculum first'}</option>
                {getGradeOptions(selectedCurriculum).map((g) => <option key={g.value} value={g.value} className="bg-[#15131f]">{g.label} ({g.value})</option>)}
              </select>
            </div>

            <button
              onClick={handleStartPractice}
              disabled={loadingSetup || !user?.id}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3.5 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-600 active:scale-[0.99] disabled:opacity-50"
            >
              {loadingSetup ? <Loader2 className="animate-spin" size={18} /> : <><Zap size={18} /> Start practising</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- RESULTS ----------
  if (isSubmitted) {
    const tier = scorePct >= 80 ? 'emerald' : scorePct >= 50 ? 'amber' : 'rose';
    const tierRgb = ACCENT[tier as keyof typeof ACCENT];
    const resultsBody = (
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#15131f] p-8 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full" style={{ background: `rgba(${tierRgb},0.15)`, color: `rgb(${tierRgb})` }}>
            <Trophy size={40} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Practice complete</h2>
          <p className="mt-1 text-white/55">{correctCount} of {questions.length} correct · {fmtTime(elapsed)}</p>

          <div className="my-8 grid grid-cols-3 gap-3">
            {[
              { label: 'Score', value: `${scorePct}%`, accent: tierRgb, icon: <Target size={16} /> },
              { label: 'XP earned', value: `${xp}`, accent: ACCENT.indigo, icon: <Zap size={16} /> },
              { label: 'Best streak', value: `${maxCombo}`, accent: ACCENT.amber, icon: <Flame size={16} /> },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-white/45">
                  <span style={{ color: `rgb(${s.accent})` }}>{s.icon}</span>{s.label}
                </div>
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button onClick={() => router.push('/students/dashboard')} className="rounded-xl border border-white/10 px-6 py-3 font-bold text-white/80 transition-colors hover:bg-white/5">
              Back to dashboard
            </button>
            <button onClick={resetToSetup} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-600 active:scale-[0.99]">
              <RotateCcw size={16} /> Practise again
            </button>
          </div>
        </div>
    );

    // Desktop app-shell: same dark results card, on the premium AppPage canvas.
    if (isAppShell) {
      return (
        <AppPage>
          <AppPageItem>
            <div className="mx-auto w-full max-w-2xl">{resultsBody}</div>
          </AppPageItem>
        </AppPage>
      );
    }

    return <div className="mx-auto max-w-2xl p-4 py-10">{resultsBody}</div>;
  }

  // ---------- QUIZ ----------
  const isRevealed = !!revealedAnswers[currentQuestion.id];
  const selectedAnswer = answers[currentQuestion.id];
  const isAnswered = !!selectedAnswer;
  const progressPct = (currentIndex / questions.length) * 100;

  const quizBody = (
    <>
      {/* HUD: progress + combo + xp + timer */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-white/45">Question {currentIndex + 1} / {questions.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white/80 ring-1 ring-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <Timer size={13} className="text-white/45" /> {fmtTime(elapsed)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold" style={{ background: `rgba(${ACCENT.amber},0.12)`, color: `rgb(${ACCENT.amber})` }}>
            <Flame size={13} /> {combo > 0 ? `x${combo}` : '—'}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold" style={{ background: `rgba(${ACCENT.indigo},0.12)`, color: `rgb(${ACCENT.indigo})` }}>
            <Zap size={13} /> {xp} XP
          </span>
        </div>
      </div>

      {/* progress bar */}
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-indigo-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#15131f] p-6 shadow-sm md:p-8">
        {currentQuestion.content.passage && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <MarkdownRenderer content={currentQuestion.content.passage} className="leading-relaxed text-white/65" />
          </div>
        )}
        <h3 className="mb-7 text-xl font-semibold leading-relaxed text-white">
          <MarkdownRenderer content={currentQuestion.content.question_text} />
        </h3>

        <div className="space-y-3">
          {currentQuestion.content.options.map((opt, idx) => {
            const isSelected = selectedAnswer === opt;
            const isCorrect = opt === currentQuestion.correct_answer;
            let cls = 'border-white/10 bg-white/[0.03] hover:border-indigo-400/50';
            let ring = 'border-white/20';
            if (isRevealed) {
              if (isCorrect) { cls = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'; ring = 'border-emerald-400 bg-emerald-400'; }
              else if (isSelected) { cls = 'border-rose-500/60 bg-rose-500/10 text-rose-300'; ring = 'border-rose-400 bg-rose-400'; }
              else { cls = 'border-white/10 bg-white/[0.02] opacity-50'; }
            } else if (isSelected) { cls = 'border-indigo-500/70 bg-indigo-500/10'; ring = 'border-indigo-400 bg-indigo-400'; }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(opt)}
                disabled={isRevealed}
                className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left text-white transition-all ${cls}`}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/5 text-xs font-bold text-white/50">{idx + 1}</span>
                <span className="flex-1"><MarkdownRenderer content={opt} className="text-base" /></span>
                {isRevealed && isCorrect && <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {isRevealed && currentQuestion.content.explanation && (
          <div className="mt-7 rounded-2xl border p-5 animate-in fade-in slide-in-from-top-2" style={{ borderColor: `rgba(${ACCENT.indigo},0.25)`, background: `rgba(${ACCENT.indigo},0.06)` }}>
            <h4 className="mb-2 flex items-center gap-2 font-bold" style={{ color: `rgb(${ACCENT.indigo})` }}>
              <Zap size={15} /> Explanation
            </h4>
            <MarkdownRenderer content={currentQuestion.content.explanation} className="leading-relaxed text-white/65" />
          </div>
        )}

        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
          <button
            onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 font-medium text-white/70 transition-colors hover:bg-white/5 disabled:opacity-40"
          >
            <ArrowLeft size={18} /> Previous
          </button>

          {!isRevealed ? (
            <button
              onClick={handleCheck}
              disabled={!isAnswered}
              className="rounded-xl bg-indigo-500 px-8 py-2.5 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-600 active:scale-95 disabled:opacity-50"
            >
              Check answer
            </button>
          ) : currentIndex === questions.length - 1 ? (
            <button
              onClick={finishPractice}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-2.5 font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-600 active:scale-95"
            >
              Finish <CheckCircle2 size={18} />
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((p) => Math.min(questions.length - 1, p + 1))}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-8 py-2.5 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-600 active:scale-95"
            >
              Next <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* floating XP / feedback toast */}
      {lastGain && (
        <div
          key={lastGain.id}
          className="pointer-events-none fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-extrabold shadow-xl animate-in fade-in slide-in-from-bottom-4"
          style={lastGain.correct
            ? { background: `rgb(${ACCENT.emerald})`, color: '#04140c' }
            : { background: `rgb(${ACCENT.rose})`, color: '#fff' }}
        >
          {lastGain.correct ? `Correct! +${lastGain.xp} XP${combo > 1 ? ` · 🔥 x${combo}` : ''}` : 'Not quite — streak reset'}
        </div>
      )}
    </>
  );

  // Desktop app-shell: same dark quiz UI, on the premium AppPage canvas.
  if (isAppShell) {
    return (
      <AppPage>
        <AppPageItem>
          <div className="mx-auto w-full max-w-3xl">{quizBody}</div>
        </AppPageItem>
      </AppPage>
    );
  }

  return <div className="mx-auto max-w-3xl p-4 py-6">{quizBody}</div>;
}
