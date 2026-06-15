'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const API = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://api.studyhours.com'
).replace(/\/$/, '');

function UnsubscribedContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('t') || '';
  const resubscribed = searchParams.get('resubscribed') === '1';
  const expired = searchParams.get('expired') === '1';

  let emoji = '👋';
  let title = "You've been unsubscribed";
  let body = "You won't get onboarding emails from us.";
  let showResubscribe = false;

  if (resubscribed) {
    emoji = '🎉';
    title = "You're resubscribed";
    body = 'Welcome back — glad to have you with us.';
  } else if (expired) {
    emoji = '⌛';
    title = 'This link has expired';
    body = 'No worries — nothing has changed with your email preferences.';
  } else {
    // Just unsubscribed — offer a misclick safety net when we have a token.
    showResubscribe = Boolean(token);
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 p-6">
      {/* Animated Blobs Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-900/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-900/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-4xl shadow-2xl p-10 md:p-14">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-white text-4xl mb-8 shadow-lg shadow-blue-500/30">
            {emoji}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {title}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto">
            {body}
          </p>

          {showResubscribe && (
            <div className="mt-10">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Unsubscribed by mistake?
              </p>
              <a
                href={`${API}/u/${token}?resub=1`}
                className="inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white bg-primary rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Resubscribe
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UnsubscribedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950" />
      }
    >
      <UnsubscribedContent />
    </Suspense>
  );
}
