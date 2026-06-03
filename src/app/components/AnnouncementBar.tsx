'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ANNOUNCEMENTS = [
  {
    id: 'gcse-paper3',
    text: 'GCSE Maths Paper 3 is in 7 days — ',
    cta: 'Check your unseen topics →',
    href: '/gcse-maths-paper-3-tracker',
    bg: 'bg-indigo-600',
    expires: '2026-06-11', // hide after exam date
  },
  {
    id: 'sat-quiz',
    text: 'Find out what\'s capping your SAT score — ',
    cta: 'Take the free 90-second quiz →',
    href: '/sat-score-quiz',
    bg: 'bg-rose-600',
    expires: null,
  },
];

export default function AnnouncementBar() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = JSON.parse(localStorage.getItem('sh_dismissed_announcements') || '[]');
      setDismissed(saved);
    } catch { /* ignore */ }
  }, []);

  if (pathname?.startsWith('/session')) return null;

  const today = new Date().toISOString().split('T')[0];
  const active = ANNOUNCEMENTS.find(a => {
    if (dismissed.includes(a.id)) return false;
    if (a.expires && today >= a.expires) return false;
    // Don't show the announcement for the page we're already on
    if (pathname === a.href) return false;
    return true;
  });

  if (!active || !mounted) return null;

  function dismiss() {
    const updated = [...dismissed, active!.id];
    setDismissed(updated);
    try { localStorage.setItem('sh_dismissed_announcements', JSON.stringify(updated)); } catch { /* ignore */ }
  }

  return (
    <div className={`${active.bg} text-white text-xs sm:text-sm font-medium py-2.5 px-4 flex items-center justify-center gap-2 relative`}>
      <span className="text-white/80">{active.text}</span>
      <Link href={active.href} className="font-bold underline underline-offset-2 hover:no-underline whitespace-nowrap">
        {active.cta}
      </Link>
      <button
        onClick={dismiss}
        className="absolute right-3 text-white/60 hover:text-white transition-colors text-lg leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
