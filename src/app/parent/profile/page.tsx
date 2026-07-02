'use client';

import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  Video,
  KeyRound,
  LogOut,
} from 'lucide-react';

import ProtectedClient from '@/app/components/ProtectedClient';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { useIsAppShell } from '@/app/Hooks/useIsAppShell';
import { useAuthContext } from '@/app/context/AuthContext';
import { api } from '@/app/lib/api';
import {
  AppPage,
  AppPageItem,
  AppPageHeader,
  AppCard,
} from '@/app/components/app-shell/ui';

/* ------------------------------------------------------------------ */
/* Shared data                                                         */
/* ------------------------------------------------------------------ */
type ChildConsent = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  grade?: string | null;
  recording_consent_granted?: boolean;
  recording_consent_at?: string | null;
};

function useChildrenConsent() {
  const { user, loading: authLoading } = useAuthContext();
  const isReady = !!user && !authLoading;
  const queryClient = useQueryClient();

  const { data: children, isLoading } = useQuery<ChildConsent[]>({
    queryKey: ['parent-children-consent', user?.id],
    queryFn: async () => {
      const res = await api.get('/parent/students');
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: isReady,
  });

  const mutation = useMutation({
    mutationFn: async ({ childId, granted }: { childId: string; granted: boolean }) => {
      const res = await api.patch(`/parent/children/${childId}/recording-consent`, { granted });
      return res.data;
    },
    onSuccess: (_data, vars) => {
      toast.success(
        vars.granted ? 'Recording consent granted' : 'Recording consent withdrawn',
      );
      queryClient.invalidateQueries({ queryKey: ['parent-children-consent'] });
      queryClient.invalidateQueries({ queryKey: ['parent-dashboard-summary'] });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || 'Could not update consent');
    },
  });

  return { children: children || [], isLoading, mutation };
}

const childName = (c: ChildConsent) =>
  `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Your child';

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function ParentProfilePage() {
  const isAppShell = useIsAppShell();
  return (
    <ProtectedClient roles={['parent']}>
      <ErrorBoundary>
        {isAppShell ? <ParentProfileApp /> : <ParentProfileWeb />}
      </ErrorBoundary>
    </ProtectedClient>
  );
}

/* ------------------------------------------------------------------ */
/* App-shell (desktop) — premium dark                                  */
/* ------------------------------------------------------------------ */
function ParentProfileApp() {
  const { user, logout } = useAuthContext();
  const { children, isLoading, mutation } = useChildrenConsent();

  const displayName =
    (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.name) ||
    user?.email ||
    'Parent';

  return (
    <AppPage>
      <AppPageItem>
        <AppPageHeader
          icon={UserIcon}
          accent="indigo"
          eyebrow="Account"
          title="Profile & settings"
          subtitle="Manage your account and your children's privacy choices."
        />
      </AppPageItem>

      {/* Account */}
      <AppPageItem>
        <AppCard accent="indigo" interactive={false}>
          <h2 className="mb-4 text-sm font-bold text-white/80">Account</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-white/80">
              <UserIcon size={15} className="text-white/40" />
              <span>{displayName}</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Mail size={15} className="text-white/40" />
              <span>{user?.email || '—'}</span>
            </div>
          </div>
        </AppCard>
      </AppPageItem>

      {/* Privacy & Recording */}
      <AppPageItem>
        <AppCard accent="emerald" interactive={false}>
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-300" />
            <h2 className="text-sm font-bold text-white/80">Privacy &amp; recording</h2>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-white/50">
            Live tutoring uses your child's camera and microphone. Sessions are only
            recorded — so your child can review them later — if you turn it on below.
            You can withdraw consent at any time; it takes effect immediately.{' '}
            <Link
              href="/legal/privacy"
              className="text-emerald-300 underline underline-offset-2 hover:text-emerald-200"
            >
              How we handle recordings
            </Link>
          </p>

          {isLoading ? (
            <div className="h-16 animate-pulse rounded-xl bg-white/5" />
          ) : children.length === 0 ? (
            <p className="text-sm text-white/40">No children on your account yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {children.map((c) => {
                const granted = !!c.recording_consent_granted;
                const busy = mutation.isPending && mutation.variables?.childId === c.id;
                return (
                  <li
                    key={c.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {childName(c)}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/45">
                        <Video size={12} />
                        {granted ? 'Recording allowed' : 'Recording off — sessions still run live'}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={granted}
                      disabled={busy}
                      onClick={() => mutation.mutate({ childId: c.id, granted: !granted })}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
                        granted ? 'bg-emerald-500' : 'bg-white/15'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          granted ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </AppCard>
      </AppPageItem>

      {/* Actions */}
      <AppPageItem>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-300 transition-colors hover:bg-rose-500/20"
          >
            <LogOut size={15} /> Sign out
          </button>
          <Link
            href="/change-password"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-white/70 transition-colors hover:bg-white/[0.06]"
          >
            <KeyRound size={15} /> Change password
          </Link>
        </div>
      </AppPageItem>
    </AppPage>
  );
}

/* ------------------------------------------------------------------ */
/* Web — light                                                         */
/* ------------------------------------------------------------------ */
function ParentProfileWeb() {
  const { user, logout } = useAuthContext();
  const { children, isLoading, mutation } = useChildrenConsent();

  const displayName =
    (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.name) ||
    user?.email ||
    'Parent';

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
        Profile &amp; settings
      </h1>

      <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-200">Account</h2>
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <UserIcon size={15} className="text-slate-400" /> {displayName}
          </div>
          <div className="flex items-center gap-2">
            <Mail size={15} className="text-slate-400" /> {user?.email || '—'}
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Privacy &amp; recording
          </h2>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Live tutoring uses your child's camera and microphone. Sessions are only
          recorded — so your child can review them later — if you turn it on below. You
          can withdraw consent at any time.{' '}
          <Link href="/legal/privacy" className="text-emerald-600 underline underline-offset-2">
            How we handle recordings
          </Link>
        </p>

        {isLoading ? (
          <div className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        ) : children.length === 0 ? (
          <p className="text-sm text-slate-400">No children on your account yet.</p>
        ) : (
          <ul className="space-y-2.5">
            {children.map((c) => {
              const granted = !!c.recording_consent_granted;
              const busy = mutation.isPending && mutation.variables?.childId === c.id;
              return (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {childName(c)}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {granted ? 'Recording allowed' : 'Recording off — sessions still run live'}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={granted}
                    disabled={busy}
                    onClick={() => mutation.mutate({ childId: c.id, granted: !granted })}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
                      granted ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        granted ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-100"
        >
          <LogOut size={16} /> Sign out
        </button>
        <Link
          href="/change-password"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        >
          <KeyRound size={16} /> Change password
        </Link>
      </div>
    </div>
  );
}
