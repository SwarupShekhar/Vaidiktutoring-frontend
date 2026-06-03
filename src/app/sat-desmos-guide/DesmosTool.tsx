'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1511608449811611648/g5AOsrFpWuu_20NNuRb8Qc7rANvdsUQx4j09vNW-RaDhTtJGs157_e-8DTh3aRPxHtZx';
const BOOKING_URL = 'https://studyhours.com/bookings/new?utm_source=desmos_guide&utm_medium=website&utm_campaign=desmos_tool';
const DISCORD_URL = 'https://discord.gg/7PYHxCPK';

type Topic = {
  id: string;
  label: string;
  emoji: string;
  timeSaved: string;
  what: string;
  how: string[];
  example: { problem: string; steps: string[]; answer: string };
  tip: string;
};

const TOPICS: Topic[] = [
  {
    id: 'systems',
    label: 'Systems of Equations',
    emoji: '⟨⟩',
    timeSaved: '~3 min saved',
    what: 'Two equations, find x and y where they meet.',
    how: [
      'Type the first equation exactly as given (e.g. y = 2x + 3)',
      'Press Enter, type the second equation (e.g. y = -x + 6)',
      'Two lines appear — click their intersection point',
      'The coordinates shown ARE your answer',
    ],
    example: {
      problem: '2x + y = 7 and x − y = 2. Find x and y.',
      steps: [
        'Rearrange to: y = -2x + 7',
        'Then type: y = x - 2',
        'Click the intersection point',
      ],
      answer: 'Desmos shows (3, 1) — done in 8 seconds.',
    },
    tip: 'If equations aren\'t in y = form, just rearrange the first equation. Takes 10 extra seconds but still beats algebra.',
  },
  {
    id: 'quadratic_roots',
    label: 'Quadratic Roots / Zeros',
    emoji: 'x²',
    timeSaved: '~2 min saved',
    what: 'Find where a parabola crosses the x-axis.',
    how: [
      'Type the quadratic: y = x² - 5x + 6',
      'Two x-intercepts appear on the graph',
      'Click each one to see the exact coordinates',
      'The x-values ARE your roots/zeros',
    ],
    example: {
      problem: 'What are the solutions to x² - 5x + 6 = 0?',
      steps: [
        'Type: y = x² - 5x + 6',
        'Click the left intercept → (2, 0)',
        'Click the right intercept → (3, 0)',
      ],
      answer: 'x = 2 and x = 3. No factoring needed.',
    },
    tip: 'You can also type x² - 5x + 6 = 0 directly into Desmos — it will solve it and show the roots.',
  },
  {
    id: 'vertex',
    label: 'Quadratic Vertex (Max/Min)',
    emoji: '∧',
    timeSaved: '~2 min saved',
    what: 'Find the highest or lowest point of a parabola.',
    how: [
      'Type the quadratic: y = -2x² + 8x - 3',
      'The parabola appears — find the curved peak or trough',
      'Click the vertex point directly',
      'The coordinates shown are (h, k) — your vertex',
    ],
    example: {
      problem: 'What is the maximum value of f(x) = -2x² + 8x - 3?',
      steps: [
        'Type: y = -2x² + 8x - 3',
        'Click the top of the curve (vertex)',
      ],
      answer: 'Desmos shows (2, 5) — maximum value is 5 at x = 2.',
    },
    tip: 'Negative leading coefficient = parabola opens down = vertex is the maximum. Positive = minimum.',
  },
  {
    id: 'circles',
    label: 'Circles & Centre/Radius',
    emoji: '○',
    timeSaved: '~90 sec saved',
    what: 'Find the centre and radius of a circle from its equation.',
    how: [
      'Type the standard form: (x-2)² + (y-3)² = 25',
      'A circle appears immediately',
      'The centre is (2, 3) — read it from the equation',
      'The radius is √25 = 5',
    ],
    example: {
      problem: 'What is the centre and radius of (x+1)² + (y-4)² = 36?',
      steps: [
        'Type the equation directly into Desmos',
        'Circle appears — centre is at (-1, 4)',
        'Radius = √36 = 6',
      ],
      answer: 'Centre (-1, 4), radius 6. Confirm by clicking the circle edge.',
    },
    tip: 'If given general form (x² + y² + bx + cy + d = 0), type it in — Desmos handles it and draws the circle anyway.',
  },
  {
    id: 'inequalities',
    label: 'Linear Inequalities',
    emoji: '>',
    timeSaved: '~60 sec saved',
    what: 'Find which region satisfies an inequality.',
    how: [
      'Type the inequality exactly: y > 2x + 1',
      'Desmos shades the correct region automatically',
      'To check if a point is in the solution: click it',
      'If it\'s in the shaded region, it satisfies the inequality',
    ],
    example: {
      problem: 'Which point satisfies y < -x + 4: (1, 2) or (3, 3)?',
      steps: [
        'Type: y < -x + 4',
        'See the shaded region below the line',
        'Point (1, 2) is in the shaded area — check',
        'Point (3, 3) is on the line boundary — not in region',
      ],
      answer: '(1, 2) satisfies the inequality.',
    },
    tip: 'For SAT "which point is NOT in the solution set" questions, this eliminates all wrong answers visually in one step.',
  },
  {
    id: 'absolute',
    label: 'Absolute Value Equations',
    emoji: '| |',
    timeSaved: '~90 sec saved',
    what: 'Solve equations involving absolute value.',
    how: [
      'Type the equation as a function: y = |2x - 3|',
      'A V-shaped graph appears',
      'The vertex (bottom of V) = where |2x-3| = 0',
      'To solve |2x-3| = 5: also type y = 5, click both intersections',
    ],
    example: {
      problem: 'Solve |2x - 3| = 5',
      steps: [
        'Type: y = |2x - 3|',
        'Type: y = 5',
        'Two intersection points appear',
      ],
      answer: 'x = 4 and x = -1. Click each intersection to confirm.',
    },
    tip: 'The two intersections give you both solutions instantly — no need to set up ±(2x-3) = 5 manually.',
  },
  {
    id: 'exponential',
    label: 'Exponential Growth & Decay',
    emoji: 'eˣ',
    timeSaved: '~60 sec saved',
    what: 'Find values on exponential growth or decay curves.',
    how: [
      'Type the function: y = 1000(1.05)^x',
      'The curve appears — x is years/time, y is the value',
      'To find the value at x = 10: click that point on the curve',
      'Or type x = 10 as a vertical line and click the intersection',
    ],
    example: {
      problem: 'A population starts at 500 and grows 8% per year. What is it after 6 years?',
      steps: [
        'Type: y = 500(1.08)^x',
        'Type: x = 6',
        'Click where they intersect',
      ],
      answer: 'Desmos shows y ≈ 793.8. Round to 794.',
    },
    tip: 'For decay problems, the growth rate is less than 1: y = 1000(0.92)^x means 8% decrease per period.',
  },
  {
    id: 'regression',
    label: 'Line of Best Fit',
    emoji: '~',
    timeSaved: '~2 min saved',
    what: 'Find the linear equation that fits a set of data points.',
    how: [
      'Click the + button and add a Table',
      'Enter your x values in column x₁ and y values in column y₁',
      'In a new line, type: y₁ ~ mx₁ + b',
      'Desmos calculates m (slope) and b (intercept) instantly',
    ],
    example: {
      problem: 'Points: (1,3), (2,5), (3,6), (4,9). Find the line of best fit.',
      steps: [
        'Add a table, enter the 4 points',
        'Type: y₁ ~ mx₁ + b in a new line',
        'Desmos shows m ≈ 2 and b ≈ 0.5',
      ],
      answer: 'Line of best fit: y ≈ 2x + 0.5',
    },
    tip: 'The SAT sometimes asks you to predict a value using a line of best fit. Once Desmos draws it, type in any x value to get the predicted y.',
  },
];

export default function DesmosTool() {
  const [selected, setSelected] = useState<string[]>([]);
  const [step, setStep] = useState<'pick' | 'email' | 'result'>('pick');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function toggleTopic(id: string) {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);

    const topicLabels = selected.map(id => TOPICS.find(t => t.id === id)?.label).join(', ');

    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '📐 New Desmos Guide Lead',
            color: 0x6366f1,
            fields: [
              { name: 'Email', value: email, inline: false },
              { name: 'Topics selected', value: topicLabels, inline: false },
            ],
            footer: { text: 'studyhours.com/sat-desmos-guide' },
          }],
        }),
      });
    } catch { /* don't block */ }

    setSubmitting(false);
    setStep('result');
  }

  const selectedTopics = TOPICS.filter(t => selected.includes(t.id));

  if (step === 'pick') {
    return (
      <main className="min-h-screen bg-black px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-indigo-400 font-semibold uppercase tracking-widest mb-4">
              Free · No account needed
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Your custom SAT<br />Desmos cheat sheet
            </h1>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Pick the 3 Math topics that cost you the most points.
              We'll show you the exact Desmos shortcut that solves each one in under 10 seconds.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {TOPICS.map((topic) => {
              const isSelected = selected.includes(topic.id);
              const isDisabled = !isSelected && selected.length >= 3;
              return (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  disabled={isDisabled}
                  className={`relative text-left p-5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : isDisabled
                      ? 'border-white/5 bg-white/[0.02] opacity-40 cursor-not-allowed'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <p className="text-2xl mb-2 font-mono text-indigo-300">{topic.emoji}</p>
                  <p className="text-white font-semibold text-sm mb-1">{topic.label}</p>
                  <p className="text-indigo-400 text-xs font-medium">{topic.timeSaved}</p>
                </button>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-gray-600 text-sm mb-4">
              {selected.length === 0
                ? 'Select up to 3 topics'
                : selected.length === 3
                ? '3 topics selected — ready to go'
                : `${selected.length} selected — pick ${3 - selected.length} more`}
            </p>
            <button
              onClick={() => setStep('email')}
              disabled={selected.length === 0}
              className="px-10 py-4 rounded-full bg-indigo-600 text-white font-bold text-lg disabled:opacity-25 disabled:cursor-not-allowed hover:bg-indigo-500 transition-all hover:scale-105 shadow-lg"
            >
              Build my cheat sheet →
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'email') {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center gap-2 mb-8">
            {selectedTopics.map(t => (
              <span key={t.id} className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm">
                {t.label}
              </span>
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your cheat sheet is ready.
          </h2>
          <p className="text-gray-400 mb-8">
            Enter your email and we'll send you the full PDF version with worked examples for all 3 topics.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-lg focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 transition-all disabled:opacity-50"
            >
              {submitting ? 'Building...' : 'Get my cheat sheet →'}
            </button>
            <p className="text-xs text-gray-700">
              I am over 13, or I have my parent's permission. No spam.
            </p>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm text-indigo-400 font-semibold uppercase tracking-widest mb-3">Your custom cheat sheet</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            3 Desmos shortcuts.<br />Saves 8+ minutes per test.
          </h2>
          <p className="text-gray-500 text-sm">Bookmark this page. Open it on your phone during practice.</p>
        </div>

        <div className="space-y-6 mb-10">
          {selectedTopics.map((topic, i) => (
            <div key={topic.id} className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden">
              <div className="px-7 pt-7 pb-5 border-b border-white/5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="text-xs text-indigo-400 font-semibold uppercase tracking-widest">Shortcut {i + 1}</span>
                    <h3 className="text-xl font-bold text-white mt-1">{topic.label}</h3>
                  </div>
                  <span className="flex-shrink-0 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                    {topic.timeSaved}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{topic.what}</p>
              </div>

              <div className="px-7 py-5 border-b border-white/5">
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">How to do it</p>
                <ol className="space-y-2">
                  {topic.how.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-gray-300">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="px-7 py-5 border-b border-white/5 bg-white/[0.02]">
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">Worked example</p>
                <p className="text-white font-medium text-sm mb-3">"{topic.example.problem}"</p>
                <ol className="space-y-1 mb-3">
                  {topic.example.steps.map((s, idx) => (
                    <li key={idx} className="text-gray-400 text-sm flex gap-2">
                      <span className="text-indigo-500">→</span>{s}
                    </li>
                  ))}
                </ol>
                <p className="text-green-400 text-sm font-medium">✓ {topic.example.answer}</p>
              </div>

              <div className="px-7 py-4">
                <p className="text-xs text-amber-500/70 flex gap-2 items-start">
                  <span className="mt-0.5">💡</span>
                  <span>{topic.tip}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-3xl p-7 mb-6 text-center">
          <p className="text-white font-bold text-lg mb-2">Want to see this in action?</p>
          <p className="text-gray-400 text-sm mb-6">
            We do live Desmos walkthroughs in our free Discord every week — with real SAT questions.
          </p>
          <div className="space-y-3">
            <Link
              href={DISCORD_URL}
              target="_blank"
              className="w-full flex items-center justify-center py-3 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all"
            >
              Join the free Discord
            </Link>
            <Link
              href={BOOKING_URL}
              target="_blank"
              className="w-full flex items-center justify-center py-3 rounded-full border border-white/15 text-gray-300 font-semibold hover:bg-white/5 transition-all text-sm"
            >
              Book a free 1-on-1 session
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-700 text-xs">
          Full PDF version sent to {email}
        </p>
      </div>
    </main>
  );
}
