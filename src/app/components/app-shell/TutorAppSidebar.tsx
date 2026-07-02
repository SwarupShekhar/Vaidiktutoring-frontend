'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Briefcase,
  Users,
  Vault,
  PenLine,
  UserCircle,
} from 'lucide-react';
import SHLogo from '@/app/components/SHLogo';
import { useAuthContext } from '@/app/context/AuthContext';

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

// Only routes that actually exist under src/app/tutor/.
const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/tutor/dashboard', icon: Home },
  { label: 'Jobs', href: '/tutor/jobs', icon: Briefcase },
  { label: 'My Students', href: '/tutor/students', icon: Users },
  { label: 'Vault', href: '/tutor/vault', icon: Vault },
  { label: 'Blogs', href: '/tutor/blogs', icon: PenLine },
  { label: 'Profile', href: '/tutor/profile', icon: UserCircle },
];

export default function TutorAppSidebar() {
  const pathname = usePathname();
  const { user } = useAuthContext();

  const displayName =
    (user?.firstName
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user?.name) ||
    user?.email ||
    'Tutor';
  const initial = (displayName || 'T').charAt(0).toUpperCase();
  const avatarUrl = (user?.imageUrl as string | undefined) || undefined;

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + '/');

  return (
    <aside className="flex h-full flex-col bg-slate-950 border-r border-white/5 select-none">
      {/* Brand lockup */}
      <Link
        href="/tutor/dashboard"
        className="flex items-center gap-2.5 px-4 h-16 shrink-0 group"
      >
        <div className="w-8 h-8 shrink-0">
          <SHLogo className="w-full h-full" />
        </div>
        <span className="text-base font-black tracking-tight text-white group-hover:opacity-80 transition-opacity">
          StudyHours
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                active
                  ? 'bg-indigo-500/15 text-indigo-300 shadow-sm shadow-indigo-500/10'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                  active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}
              />
              <span>{label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer — taps through to Profile (which holds Sign out). */}
      <div className="shrink-0 border-t border-white/5 p-3">
        <Link
          href="/tutor/profile"
          className="flex items-center gap-3 min-w-0 rounded-lg px-2 py-2 hover:bg-white/5 transition-colors"
        >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-white/10"
              />
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white ring-1 ring-white/10">
                {initial}
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-slate-200">
                {displayName}
              </span>
              <span className="block truncate text-xs text-slate-500">Tutor</span>
            </span>
          </Link>
      </div>
    </aside>
  );
}
