'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type ResponseEntry = {
  message: string;
  cta: { href: string; label: string };
};

// Reflected response copy keyed by `${type}/${answer}`.
const RESPONSE_MAP: Record<string, ResponseEntry> = {
  'mcq_academic/subject_help': {
    message: "Got it — you're after help with a subject. Let's get you matched.",
    cta: { href: '/onboarding', label: 'Finish setup →' },
  },
  'mcq_academic/exam_prep': {
    message: "Exam prep — perfect, that's our specialty. Let's build your plan.",
    cta: { href: '/onboarding', label: 'Finish setup →' },
  },
  'mcq_academic/catching_up': {
    message: "Catching up is exactly what we're built for. Let's get started.",
    cta: { href: '/onboarding', label: 'Finish setup →' },
  },
  'mcq_academic/get_ahead': {
    message: "Love it — getting ahead. Let's find you the right tutor.",
    cta: { href: '/onboarding', label: 'Finish setup →' },
  },
  'mcq_friction/too_busy': {
    message: "Totally fair. It takes 30 seconds whenever you're ready.",
    cta: { href: '/onboarding', label: 'Finish setup →' },
  },
  'mcq_friction/not_sure': {
    message: "No problem — here's how StudyHours works, and you can book a quick free call.",
    cta: { href: '/bookings/new', label: 'Book a free session →' },
  },
  'mcq_friction/price': {
    message: 'Fair concern. Your first session is free — try before you decide.',
    cta: { href: '/bookings/new', label: 'Book a free session →' },
  },
  'mcq_friction/browsing': {
    message: "No pressure at all. Browse away — we're here when you need us.",
    cta: { href: '/onboarding', label: 'Finish setup →' },
  },
};

const FALLBACK: ResponseEntry = {
  message: 'Thanks for letting us know!',
  cta: { href: '/onboarding', label: 'Finish setup →' },
};

function ThanksContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || '';
  const answer = searchParams.get('a') || '';
  const expired = searchParams.get('expired') === '1';

  // Fire PostHog on a valid tap (not expired, both params present).
  useEffect(() => {
    if (expired || !type || !answer) return;
    import('posthog-js').then((posthog) => {
      posthog.default.capture('MCQ Tapped', { type, answer });
    });
  }, [expired, type, answer]);

  const entry = expired ? null : RESPONSE_MAP[`${type}/${answer}`] || FALLBACK;

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 p-6">
      {/* Animated Blobs Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-900/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-900/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-4xl shadow-2xl p-10 md:p-14 mb-8">
          {expired ? (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500 text-white text-4xl mb-8 shadow-lg shadow-amber-500/30">
                ⌛
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                This link has expired
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-lg mx-auto">
                No worries — you can pick up right where you left off and finish setting up your account.
              </p>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center w-full md:w-auto px-10 py-4 text-lg font-bold text-white bg-primary rounded-full hover:opacity-90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Finish setup →
              </Link>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-white text-4xl mb-8 shadow-lg shadow-blue-500/30">
                💬
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Thanks for the tap!
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-lg mx-auto">
                {entry!.message}
              </p>
              <Link
                href={entry!.cta.href}
                className="inline-flex items-center justify-center w-full md:w-auto px-10 py-4 text-lg font-bold text-white bg-primary rounded-full hover:opacity-90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                {entry!.cta.label}
              </Link>
            </>
          )}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          Don&apos;t want these emails?{' '}
          <a
            href="mailto:hellostudents@studyhours.com?subject=Unsubscribe"
            className="underline hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Unsubscribe
          </a>
        </p>
      </div>
    </div>
  );
}

export default function ThanksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950" />
      }
    >
      <ThanksContent />
    </Suspense>
  );
}
