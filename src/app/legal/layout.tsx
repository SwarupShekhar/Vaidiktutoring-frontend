"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Acceptable Use', href: '/legal/aup' },
    { name: 'Cookie Policy', href: '/legal/cookies' },
    { name: 'Refund Policy', href: '/legal/refunds' },
  ];

  return (
    <div className="min-h-screen py-24 px-6 md:px-12 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-72 shrink-0">
          <nav className="flex flex-col gap-1 sticky top-32">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6 px-4">
              Legal Documents
            </h2>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-blue-500/20' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 max-w-4xl">
          <div className="bg-white/50 dark:bg-white/2 border border-gray-100 dark:border-white/5 rounded-4xl p-8 md:p-12 shadow-sm backdrop-blur-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
