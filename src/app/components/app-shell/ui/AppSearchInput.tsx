'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { accentRgb, type AccentKey } from './tokens';

/**
 * Dark premium search box for app-shell toolbars. Accent drives the focus ring.
 */
export function AppSearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  accent = 'indigo',
  className = '',
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  accent?: AccentKey | string;
  className?: string;
}) {
  return (
    <div className={`relative w-full md:w-72 ${className}`}>
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/35 outline-none transition-all focus:border-transparent focus:ring-2"
        style={{
          // @ts-expect-error custom prop consumed by focus ring
          '--tw-ring-color': accentRgb(accent, 0.55),
        }}
      />
    </div>
  );
}
