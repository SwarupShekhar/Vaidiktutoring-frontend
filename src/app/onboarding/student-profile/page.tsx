'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useAuthContext } from '@/app/context/AuthContext';
import { api } from '@/app/lib/api';

const EXAM_BOARDS = ['Edexcel', 'AQA', 'OCR', 'WJEC / Eduqas', 'Cambridge (CIE)', 'IB', 'Other / Not sure'];
const TARGET_GRADES = ['9', '8', '7', '6', '5', '4', 'A*', 'A', 'B', 'Just exploring'];
const COMMON_TOPICS = [
  'Algebra', 'Trigonometry', 'Geometry', 'Probability', 'Statistics',
  'Calculus', 'Vectors', 'Ratio & Proportion', 'Number', 'Graphs',
];

export default function StudentProfileOnboardingPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1
  const [grade, setGrade] = useState('');
  const [examBoard, setExamBoard] = useState('');
  const [targetGrade, setTargetGrade] = useState('');

  // Step 2
  const [examDate, setExamDate] = useState('');
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const toggleTopic = (t: string) =>
    setWeakTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const canContinue = grade && examBoard && targetGrade;

  async function handleFinish() {
    setSubmitting(true);
    const promise = api.patch('/students/me', {
      grade,
      exam_board: examBoard,
      target_grade: targetGrade,
      exam_date: examDate || null,
      struggle_areas: weakTopics,
      recent_focus: note || '',
    });

    toast.promise(promise, {
      loading: 'Setting up your plan…',
      success: () => {
        import('posthog-js').then((posthog) => {
          posthog.default.capture('Onboarding Completed', { role: 'student' });
        });
        router.push('/onboarding/student-welcome');
        return 'All set! 🎉';
      },
      error: (err) =>
        err?.response?.data?.message || err?.message || 'Something went wrong — try again',
    });

    try {
      await promise;
    } catch {
      setSubmitting(false);
    }
  }

  const firstName = user?.first_name || (user as any)?.firstName || '';

  return (
    <ProtectedClient roles={['student']}>
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 p-6">
        {/* Animated Blobs Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-900/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-900/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[100px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 w-full max-w-xl">
          <div className="bg-white/70 dark:bg-black/50 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-4xl shadow-2xl p-8 md:p-10">
            {/* Progress */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Let&apos;s build your plan{firstName ? `, ${firstName}` : ''} 📚
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    A few quick questions so we can match you with the right tutor and focus on what counts.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Year / Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-white/5 focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="">Select your year/grade</option>
                    {Array.from({ length: 13 }).map((_, i) => (
                      <option key={i + 1} value={(i + 1).toString()}>
                        Year / Grade {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Exam board</label>
                  <div className="grid grid-cols-2 gap-2">
                    {EXAM_BOARDS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setExamBoard(b)}
                        className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          examBoard === b
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-primary/50'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Target grade</label>
                  <div className="flex flex-wrap gap-2">
                    {TARGET_GRADES.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setTargetGrade(g)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                          targetGrade === g
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-primary/50'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep(2)}
                  className="w-full px-6 py-3.5 rounded-xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  Continue →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Almost there 🎯</h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    This helps your tutor prepare before your very first session.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    When&apos;s your next exam? <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-white/5 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Which topics feel hardest? <span className="text-gray-400 font-normal">(tap any)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_TOPICS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTopic(t)}
                        className={`px-3 py-2 rounded-full border text-sm font-medium transition-all ${
                          weakTopics.includes(t)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-primary/50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Anything specific you want help with? <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder="e.g. I keep losing method marks on long algebra questions"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-white/5 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleFinish}
                    className="flex-1 px-6 py-3.5 rounded-xl bg-primary text-white font-bold disabled:opacity-60 hover:opacity-90 transition-opacity"
                  >
                    {submitting ? 'Saving…' : 'Finish setup →'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => router.push('/students/dashboard')}
            className="w-full text-center mt-5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </ProtectedClient>
  );
}
