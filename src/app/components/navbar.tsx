// src/app/components/navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import NotificationsBtn from './NotificationsBtn';
import SHLogo from './SHLogo';

import { useAuthContext } from '@/app/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuthContext();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname?.startsWith(path);

  if (pathname?.startsWith('/session')) return null;

  const navLinks = [
    { name: 'Subjects', href: '/subjects' },
    { name: 'Methodology', href: '/methodology' },
    { name: 'About', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blogs', href: '/blogs' },
  ];

  return (
    <nav className="w-full sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-white/20 dark:border-white/5 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-3 lg:py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-lg shadow-lg group-hover:scale-110 transition-all duration-300">
            <SHLogo className="w-full h-full" />
          </div>
          <div className="text-lg lg:text-xl font-black tracking-tighter text-deep-navy dark:text-white group-hover:opacity-80 transition-all">
            StudyHours
          </div>
        </Link>

        {/* Center: Navigation - Desktop Only */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-100/50 dark:bg-white/5 border border-white/20 dark:border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${isActive(link.href)
                  ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
                  : 'text-text-secondary hover:text-primary'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Auth & Toggle Group */}
        <div className="flex items-center gap-2 lg:gap-6 shrink-0">
          {/* Dashboard Link */}
          {user && (
            <Link
              href={
                user.role === 'admin' ? '/admin/dashboard' :
                  user.role === 'tutor' ? '/tutor/dashboard' :
                    user.role === 'student' ? '/students/dashboard' :
                      '/parent/dashboard'
              }
              className="hidden md:block text-xs font-bold tracking-wide transition-all text-text-secondary hover:text-primary"
            >
              Dashboard
            </Link>
          )}

          {/* Primary CTA */}
          {(!user || user.role !== 'tutor') && (
            <Link
              href={user ? 'https://calendly.com/swarupshekhar-vaidikedu/30min' : '/signup?type=assessment'}
              className="hidden sm:inline-flex items-center justify-center px-4 lg:px-6 py-2 rounded-full bg-primary text-white font-black text-xs tracking-wide hover:bg-sapphire hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20"
              {...(user ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              Book Demo
            </Link>
          )}

          <div className="h-4 w-px bg-slate-200 dark:bg-white/10 hidden lg:block" />

          {user ? (
            <button
              onClick={logout}
              className="hidden md:block px-2 lg:px-4 py-2 text-xs font-bold text-text-secondary hover:text-red-500 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden md:block px-2 lg:px-4 py-2 text-xs font-bold text-text-secondary hover:text-primary transition-colors"
            >
              Login
            </Link>
          )}

          <div className="flex items-center gap-1">
            {user && <NotificationsBtn />}
            <div className="scale-50 origin-right">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5 text-deep-navy dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Inside nav, properly aligned */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/20 dark:border-white/5 bg-white dark:bg-black">
          <div className="max-w-[1400px] mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all ${isActive(link.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <Link
                href={
                  user.role === 'admin' ? '/admin/dashboard' :
                    user.role === 'tutor' ? '/tutor/dashboard' :
                      user.role === 'student' ? '/students/dashboard' :
                        '/parent/dashboard'
                }
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all text-text-secondary hover:bg-slate-100 dark:hover:bg-white/10"
              >
                Dashboard
              </Link>
            )}
            <div className="flex gap-2 mt-2">
              {user ? (
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex-1 px-3 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 px-3 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all text-center text-text-secondary hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  Login
                </Link>
              )}
              {(!user || user.role !== 'tutor') && (
                <Link
                  href={user ? 'https://calendly.com/swarupshekhar-vaidikedu/30min' : '/signup?type=assessment'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 px-3 py-2.5 rounded-lg bg-primary text-white font-bold text-sm tracking-wide text-center hover:bg-sapphire transition-all"
                  {...(user ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  Book Demo
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}