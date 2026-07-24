'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const LEADS_API = '/api/leads';
const BOOKING_URL = 'https://studyhours.com/bookings/new?utm_source=sat_quiz&utm_medium=website&utm_campaign=score_ceiling';
const DISCORD_URL = 'https://discord.gg/gDhGVWd6Cm';

type Answers = {
  score: string;
  mathWeak: string;
  reviewFinds: string;
  rwWeak: string;
};

const QUESTIONS = [
  {
    id: 'score',
    question: 'What\'s your current SAT practice score?',
    sub: 'Your most recent full practice test.',
    options: [
      { value: 'under_1100', label: 'Under 1100' },
      { value: '1100_1200', label: '1100 – 1200' },
      { value: '1200_1300', label: '1200 – 1300' },
      { value: 'above_1300', label: '1300+' },
    ],
  },
  {
    id: 'mathWeak',
    question: 'In the Math section, which costs you the most points?',
    sub: 'Pick the one that stings the most.',
    options: [
      { value: 'systems', label: 'Systems of equations and word problems' },
      { value: 'geometry', label: 'Geometry, circles, and coordinate problems' },
      { value: 'quadratics', label: 'Quadratics, parabolas, and vertex problems' },
      { value: 'time', label: 'I run out of time before I even get to the hard ones' },
    ],
  },
  {
    id: 'reviewFinds',
    question: 'When you review a practice test, what do you usually find?',
    sub: 'Be honest — this is the most important question.',
    options: [
      { value: 'careless', label: 'Mostly careless errors — I knew it but got it wrong' },
      { value: 'knowledge', label: 'Genuinely didn\'t know how to solve it' },
      { value: 'time', label: 'Ran out of time and guessed on several' },
      { value: 'no_review', label: 'I don\'t really review my practice tests' },
    ],
  },
  {
    id: 'rwWeak',
    question: 'On the Reading & Writing section, which trips you up most?',
    sub: 'The RW section is 50% of your score.',
    options: [
      { value: 'words_context', label: '"Words in Context" — picking the right word for the blank' },
      { value: 'evidence', label: '"Command of Evidence" — finding the quote that supports a claim' },
      { value: 'synthesis', label: 'Rhetorical synthesis — combining notes into one sentence' },
      { value: 'all', label: 'Honestly, all of it — I just read and hope for the best' },
    ],
  },
];

function buildResult(a: Answers): { ceiling: number; headline: string; analysis: string; priority: string } {
  // Base ceiling from current score
  const baseCeiling: Record<string, number> = {
    under_1100: 1240,
    '1100_1200': 1320,
    '1200_1300': 1400,
    above_1300: 1470,
  };
  let ceiling = baseCeiling[a.score] ?? 1300;

  // Adjust ceiling based on what's holding them back
  if (a.reviewFinds === 'no_review') ceiling -= 40;
  if (a.mathWeak === 'time') ceiling -= 30;
  if (a.rwWeak === 'all') ceiling -= 20;
  if (a.reviewFinds === 'careless') ceiling += 20; // careless errors = fixable fast
  if (a.mathWeak === 'systems' || a.mathWeak === 'geometry' || a.mathWeak === 'quadratics') ceiling += 10; // specific = fixable

  // Round to nearest 10
  ceiling = Math.round(ceiling / 10) * 10;

  // Build a personalized paragraph based on their specific combo
  const mathDescriptions: Record<string, string> = {
    systems: 'systems of equations and word problems',
    geometry: 'geometry and coordinate problems',
    quadratics: 'quadratics and parabola questions',
    time: 'running out of time before reaching the harder questions',
  };

  const rwDescriptions: Record<string, string> = {
    words_context: 'Words in Context',
    evidence: 'Command of Evidence',
    synthesis: 'rhetorical synthesis questions',
    all: 'the entire RW section without a clear strategy',
  };

  const mathDesc = mathDescriptions[a.mathWeak];
  const rwDesc = rwDescriptions[a.rwWeak];

  let analysis = '';
  let priority = '';

  // Careless errors + specific math weakness
  if (a.reviewFinds === 'careless' && a.mathWeak !== 'time') {
    analysis = `You're losing points you already know how to earn — that's a pacing problem in Module 1, not a knowledge gap. When you rush the first 10 questions to save time for later, you make errors that route you into the easier Module 2. The easier Module 2 caps your total score around 1,300 regardless of how well you finish. On the ${mathDesc} side: those questions are specifically solvable with Desmos in under 10 seconds — graphing the system or parabola directly instead of working it out algebraically. On RW, ${rwDesc} is costing you points that don't require reading the whole passage.`;
    priority = `Slow down on the first 10 questions of each module. Double-check instead of trusting your first instinct. That alone is usually worth 40–60 points before touching anything else.`;
  }

  // Time as the main problem
  else if (a.mathWeak === 'time' || a.reviewFinds === 'time') {
    analysis = `Running out of time on the SAT is almost never a speed problem — it's a tool problem. Students who learn to use Desmos for ${mathDesc === 'running out of time before reaching the harder questions' ? 'systems of equations, geometry, and quadratics' : mathDesc} save between 8 and 14 minutes per Math section. That's not a small edge — it's the difference between finishing and guessing on 4 questions. On the RW side, ${rwDesc} questions are eating into your time because the strategy isn't clear yet. There's a reliable method for each question type that takes 30–60 seconds maximum.`;
    priority = `Learn the Desmos shortcut for one question type this week — start with systems of equations. Graph both lines, tap the intersection. That's 8 seconds instead of 2 minutes per question.`;
  }

  // Knowledge gaps
  else if (a.reviewFinds === 'knowledge') {
    analysis = `Genuinely not knowing how to solve questions is the most honest answer — and the most specific to fix. For ${mathDesc}, there are 3 or 4 question templates that cover the vast majority of what the SAT actually tests. You're not missing broad knowledge, you're missing those specific patterns. For ${rwDesc}, the same logic applies — the SAT reuses the same question structures every single test. Learning to recognise them is faster than re-reading everything from scratch.`;
    priority = `Stop doing full practice tests for now. Do targeted drills on ${mathDesc} only — 20 questions of that type back to back. Pattern recognition comes from repetition, not variety.`;
  }

  // Doesn't review tests
  else if (a.reviewFinds === 'no_review') {
    analysis = `Not reviewing practice tests is the single most common reason students plateau. You can take 50 practice tests and improve very little if you're not diagnosing what went wrong. Right now your ${mathDesc} weakness and your ${rwDesc} struggles are likely patterns — the same question types getting you each time. Without reviewing, you keep making the same errors and calling it a bad day.`;
    priority = `Before your next practice test, review every wrong answer from your last one. Write down what the question was actually testing. You'll likely find 3–4 recurring types. Those are your targets.`;
  }

  // Fallback
  else {
    analysis = `Your current score and your pattern on ${mathDesc} in Math and ${rwDesc} on RW suggest you're close to a significant jump — the pieces are mostly there. The SAT at your score range is less about knowledge and more about knowing exactly which shortcut applies to which question type, consistently.`;
    priority = `Focus your next two weeks on one thing: Module 1 accuracy. Getting 15+ correct in Math Module 1 unlocks the hard Module 2, which is the only version where 1,400+ is possible. Everything else comes after.`;
  }

  const headlines: Record<string, string> = {
    under_1100: 'You\'re building the foundation — here\'s what to fix first',
    '1100_1200': 'You\'re closer than you think — one shift moves the needle',
    '1200_1300': 'You\'re in the most fixable range on the SAT',
    above_1300: 'You\'re close to a significant jump — here\'s what\'s in the way',
  };

  return {
    ceiling,
    headline: headlines[a.score] ?? 'Here\'s what\'s capping your score',
    analysis,
    priority,
  };
}

export default function SATScoreQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof buildResult> | null>(null);

  const questionIndex = step - 1;
  const currentQ = QUESTIONS[questionIndex];
  const progress = Math.min(step / QUESTIONS.length, 1);

  function handleNext() {
    if (step === 0) { setStep(1); return; }
    if (!selected) return;
    const updated = { ...answers, [currentQ.id]: selected };
    setAnswers(updated);
    setSelected(null);
    setStep(step + 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);

    const res = buildResult(answers as Answers);
    setResult(res);

    const labelFor = (qId: string, val: string) =>
      QUESTIONS.find(q => q.id === qId)?.options.find(o => o.value === val)?.label ?? val;

    try {
      await fetch(LEADS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'sat_quiz',
          email,
          score: labelFor('score', answers.score!),
          mathWeak: labelFor('mathWeak', answers.mathWeak!),
          reviewFinds: labelFor('reviewFinds', answers.reviewFinds!),
          rwWeak: labelFor('rwWeak', answers.rwWeak!),
          ceiling: String(res.ceiling),
          bottleneck: res.headline,
          priority: res.priority,
        }),
      });
    } catch { /* don't block the user */ }

    setSubmitting(false);
    setStep(QUESTIONS.length + 2);
  }

  // Intro
  if (step === 0) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-4 py-20">
        <div className="max-w-xl w-full text-center">
          <p className="text-sm text-rose-400 font-semibold uppercase tracking-widest mb-4">
            4 questions · 90 seconds · no sign-up to start
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            What's actually<br />capping your SAT score?
          </h1>
          <p className="text-gray-400 text-lg mb-4 max-w-md mx-auto">
            Most students are 100–200 points below their real ceiling and don't know why.
            This tells you exactly what it is — not a generic tip, your specific pattern.
          </p>
          <p className="text-gray-600 text-sm mb-10">Used by 500+ students to find their score bottleneck.</p>
          <button
            onClick={() => setStep(1)}
            className="px-10 py-4 rounded-full bg-rose-600 text-white font-bold text-lg hover:bg-rose-500 transition-all hover:scale-105 shadow-lg"
          >
            Find my bottleneck
          </button>
        </div>
      </main>
    );
  }

  // Questions
  if (step >= 1 && step <= QUESTIONS.length) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-4 py-20">
        <div className="max-w-xl w-full">
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Question {step} of {QUESTIONS.length}</span>
            </div>
            <div className="w-full h-0.5 bg-white/10 rounded-full">
              <div
                className="h-0.5 bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{currentQ.question}</h2>
          <p className="text-gray-500 text-sm mb-8">{currentQ.sub}</p>

          <div className="space-y-3 mb-8">
            {currentQ.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelected(opt.value)}
                className={`w-full text-left px-6 py-4 rounded-2xl border transition-all font-medium text-base ${
                  selected === opt.value
                    ? 'border-rose-500 bg-rose-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/8'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!selected}
            className="w-full py-4 rounded-full bg-rose-600 text-white font-bold text-lg disabled:opacity-25 disabled:cursor-not-allowed hover:bg-rose-500 transition-all"
          >
            {step === QUESTIONS.length ? 'Show my result →' : 'Next →'}
          </button>
        </div>
      </main>
    );
  }

  // Email gate
  if (step === QUESTIONS.length + 1) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-4 py-20">
        <div className="max-w-xl w-full text-center">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-400 text-sm font-medium">Analysing your answers...</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your score analysis is ready.
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-sm mx-auto">
            Where do we send it? We'll also include the specific practice questions for your exact weakness.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-lg focus:outline-none focus:border-rose-500 transition-colors"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full bg-rose-600 text-white font-bold text-lg hover:bg-rose-500 transition-all disabled:opacity-50"
            >
              {submitting ? 'Loading your result...' : 'See my score analysis →'}
            </button>
            <p className="text-xs text-gray-700 text-center">
              I am over 13, or I have my parent's permission. No spam. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </main>
    );
  }

  // Result
  if (result) {
    return (
      <main className="min-h-screen bg-black flex items-start justify-center px-4 py-20">
        <div className="max-w-xl w-full">
          <p className="text-sm text-rose-400 font-semibold uppercase tracking-widest mb-3">Your result</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            Here's what's limiting your score
          </h2>
          <p className="text-gray-400 mb-10">{result.headline}</p>

          <div className="bg-white/3 border border-white/10 rounded-3xl p-7 mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">What your answers reveal</p>
            <p className="text-gray-200 leading-relaxed text-[15px]">{result.analysis}</p>
          </div>

          <div className="bg-rose-950/40 border border-rose-500/20 rounded-3xl p-7 mb-8">
            <p className="text-xs text-rose-400 uppercase tracking-widest mb-3">The one thing to fix first</p>
            <p className="text-white leading-relaxed font-medium">{result.priority}</p>
          </div>

          <div className="space-y-3">
            <Link
              href={BOOKING_URL}
              target="_blank"
              className="w-full flex items-center justify-center py-4 rounded-full bg-rose-600 text-white font-bold text-lg hover:bg-rose-500 transition-all hover:scale-105 shadow-lg"
            >
              Book a free 15-min strategy call
            </Link>
            <Link
              href={DISCORD_URL}
              target="_blank"
              className="w-full flex items-center justify-center py-4 rounded-full border border-white/15 text-gray-300 font-semibold text-base hover:bg-white/5 transition-all"
            >
              Join free Discord — daily SAT questions
            </Link>
          </div>

          <p className="text-center text-gray-700 text-xs mt-6">
            We sent your full breakdown to {email}
          </p>
        </div>
      </main>
    );
  }

  return null;
}
