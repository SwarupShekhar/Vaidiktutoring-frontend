// src/app/components/navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import NotificationsBtn from './NotificationsBtn';

import { useAuthContext } from '@/app/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuthContext();
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  if (pathname?.startsWith('/session')) return null;

  return (
    <nav className="w-full sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-white/20 dark:border-white/5 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between gap-8">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-sapphire)] flex items-center justify-center text-white font-black shadow-lg group-hover:rotate-6 transition-all duration-300">
            VT
          </div>
          <div className="text-xl font-black tracking-tighter text-[var(--color-deep-navy)] dark:text-white group-hover:opacity-80 transition-all">
            Vaidik Tutoring
          </div>
        </Link>

        {/* Center: Navigation - Centered Pill */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-100/50 dark:bg-white/5 border border-white/20 dark:border-white/5">
          {[
            { name: 'Subjects', href: '/subjects' },
            { name: 'Methodology', href: '/methodology' },
            { name: 'About', href: '/about' },
            { name: 'Pricing', href: '/pricing' },
            { name: 'Blogs', href: '/blogs' },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${isActive(link.href)
                  ? 'bg-white dark:bg-white/10 text-[var(--color-primary)] shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Auth & Toggle Group */}
        <div className="flex items-center gap-3 lg:gap-6 flex-shrink-0">
          {/* Dashboard Link - Moved here to keep center clean */}
          {user && (
            <Link
              href={
                user.role === 'admin' ? '/admin/dashboard' :
                  user.role === 'tutor' ? '/tutor/dashboard' :
                    user.role === 'student' ? '/students/dashboard' :
                      '/parent/dashboard'
              }
              className={`hidden md:block text-xs font-bold tracking-wide transition-all ${isActive('/dashboard') ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
                }`}
            >
              Dashboard
            </Link>
          )}

          {/* Primary CTA */}
          {(!user || user.role !== 'tutor') && (
            <Link
              href={user ? 'https://calendly.com/swarupshekhar-vaidikedu/30min' : '/signup?type=assessment'}
              className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[var(--color-primary)] text-white font-black text-xs tracking-wide hover:bg-[var(--color-sapphire)] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20"
              {...(user ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              Book Free Demo
            </Link>
          )}

          <div className="h-4 w-px bg-slate-200 dark:bg-white/10 hidden lg:block" />

          {user ? (
            <button
              onClick={logout}
              className="px-4 py-2 text-xs font-bold text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              Login
            </Link>
          )}

          <div className="flex items-center gap-2">
            {user && <NotificationsBtn />}
            <div className="scale-75 origin-right">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}