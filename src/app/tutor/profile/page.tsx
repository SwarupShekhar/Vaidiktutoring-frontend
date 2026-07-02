'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  User as UserIcon,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  FileText,
  LogOut,
  BadgeCheck,
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
  AppPillButton,
} from '@/app/components/app-shell/ui';

interface TutorProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  qualifications: string[];
  skills: string[];
  employmentType: string | null;
  isApproved: boolean;
}

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  qualifications: string; // one per line in the textarea
  skills: string; // one per line in the textarea
};

const toLines = (arr: string[]) => (arr || []).join('\n');
const fromLines = (s: string) =>
  s
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean);

function useTutorProfileForm() {
  const { user, loading: authLoading } = useAuthContext();
  const isReady = !!user && !authLoading;
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery<TutorProfile | null>({
    queryKey: ['tutor-profile', user?.id],
    queryFn: async () => {
      const res = await api.get('/tutor/me');
      return res.data ?? null;
    },
    enabled: isReady,
  });

  const [form, setForm] = useState<FormState | null>(null);

  useEffect(() => {
    if (profile && !form) {
      setForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        bio: profile.bio,
        qualifications: toLines(profile.qualifications),
        skills: toLines(profile.skills),
      });
    }
  }, [profile, form]);

  const mutation = useMutation({
    mutationFn: async (f: FormState) => {
      const res = await api.patch('/tutor/me', {
        firstName: f.firstName,
        lastName: f.lastName,
        phone: f.phone,
        bio: f.bio,
        qualifications: fromLines(f.qualifications),
        skills: fromLines(f.skills),
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Profile updated');
      queryClient.invalidateQueries({ queryKey: ['tutor-profile'] });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || 'Could not save profile');
    },
  });

  return { profile, form, setForm, isLoading: isLoading || !form, mutation };
}

export default function TutorProfilePage() {
  const isAppShell = useIsAppShell();

  return (
    <ProtectedClient roles={['tutor']}>
      <ErrorBoundary>
        {isAppShell ? <TutorProfileApp /> : <TutorProfileWeb />}
      </ErrorBoundary>
    </ProtectedClient>
  );
}

/* ------------------------------------------------------------------ */
/* App-shell (desktop) — premium dark                                  */
/* ------------------------------------------------------------------ */
function TutorProfileApp() {
  const { logout } = useAuthContext();
  const { profile, form, setForm, isLoading, mutation } = useTutorProfileForm();

  if (isLoading || !form) {
    return (
      <AppPage>
        <div className="h-10 w-48 animate-pulse rounded-lg bg-white/5" />
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
      </AppPage>
    );
  }

  const set = (k: keyof FormState, v: string) => setForm({ ...form, [k]: v });

  const fieldCls =
    'w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-indigo-400/60 focus:bg-white/[0.05]';
  const labelCls =
    'mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/40';

  return (
    <AppPage>
      <AppPageItem>
        <AppPageHeader
          icon={UserIcon}
          accent="indigo"
          eyebrow="Account"
          title="Your profile"
          subtitle="Keep your details current — students and admins see this."
          right={
            profile?.isApproved ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                <BadgeCheck size={14} /> Approved
              </span>
            ) : undefined
          }
        />
      </AppPageItem>

      <AppPageItem>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(form);
          }}
          className="space-y-6"
        >
          {/* Identity */}
          <AppCard accent="indigo" interactive={false}>
            <h2 className="mb-4 text-sm font-bold text-white/80">Personal details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>First name</label>
                <input
                  className={fieldCls}
                  value={form.firstName}
                  onChange={(e) => set('firstName', e.target.value)}
                  placeholder="First name"
                />
              </div>
              <div>
                <label className={labelCls}>Last name</label>
                <input
                  className={fieldCls}
                  value={form.lastName}
                  onChange={(e) => set('lastName', e.target.value)}
                  placeholder="Last name"
                />
              </div>
              <div>
                <label className={labelCls}>
                  <Mail size={11} className="mr-1 inline" /> Email
                </label>
                <input
                  className={`${fieldCls} cursor-not-allowed opacity-60`}
                  value={profile?.email || ''}
                  disabled
                />
              </div>
              <div>
                <label className={labelCls}>
                  <Phone size={11} className="mr-1 inline" /> Phone
                </label>
                <input
                  className={fieldCls}
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="Phone number"
                />
              </div>
            </div>
          </AppCard>

          {/* Professional */}
          <AppCard accent="violet" interactive={false}>
            <h2 className="mb-4 text-sm font-bold text-white/80">Professional</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>
                  <FileText size={11} className="mr-1 inline" /> Bio
                </label>
                <textarea
                  className={`${fieldCls} min-h-[96px] resize-y`}
                  value={form.bio}
                  onChange={(e) => set('bio', e.target.value)}
                  placeholder="A short intro students will see…"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>
                    <GraduationCap size={11} className="mr-1 inline" /> Qualifications
                  </label>
                  <textarea
                    className={`${fieldCls} min-h-[96px] resize-y`}
                    value={form.qualifications}
                    onChange={(e) => set('qualifications', e.target.value)}
                    placeholder={'One per line\ne.g. MSc Mathematics'}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    <Sparkles size={11} className="mr-1 inline" /> Skills
                  </label>
                  <textarea
                    className={`${fieldCls} min-h-[96px] resize-y`}
                    value={form.skills}
                    onChange={(e) => set('skills', e.target.value)}
                    placeholder={'One per line\ne.g. Algebra'}
                  />
                </div>
              </div>
            </div>
          </AppCard>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-300 transition-colors hover:bg-rose-500/20"
            >
              <LogOut size={15} /> Sign out
            </button>
            <AppPillButton
              accent="indigo"
              variant="solid"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Saving…' : 'Save changes'}
            </AppPillButton>
          </div>
        </form>
      </AppPageItem>
    </AppPage>
  );
}

/* ------------------------------------------------------------------ */
/* Web — light, matches tutor web dashboard                            */
/* ------------------------------------------------------------------ */
function TutorProfileWeb() {
  const { logout } = useAuthContext();
  const { profile, form, setForm, isLoading, mutation } = useTutorProfileForm();

  if (isLoading || !form) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="h-72 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  const set = (k: keyof FormState, v: string) => setForm({ ...form, [k]: v });
  const field =
    'w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500';
  const label =
    'mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500';

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Your profile
          </h1>
          <p className="mt-1 text-sm text-slate-500">Keep your details current.</p>
        </div>
        {profile?.isApproved && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
            <BadgeCheck size={14} /> Approved
          </span>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(form);
        }}
        className="space-y-8"
      >
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-200">
            Personal details
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>First name</label>
              <input className={field} value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
            </div>
            <div>
              <label className={label}>Last name</label>
              <input className={field} value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
            </div>
            <div>
              <label className={label}>Email</label>
              <input className={`${field} opacity-60`} value={profile?.email || ''} disabled />
            </div>
            <div>
              <label className={label}>Phone</label>
              <input className={field} value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-200">Professional</h2>
          <div className="space-y-4">
            <div>
              <label className={label}>Bio</label>
              <textarea className={`${field} min-h-[96px]`} value={form.bio} onChange={(e) => set('bio', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Qualifications (one per line)</label>
                <textarea className={`${field} min-h-[96px]`} value={form.qualifications} onChange={(e) => set('qualifications', e.target.value)} />
              </div>
              <div>
                <label className={label}>Skills (one per line)</label>
                <textarea className={`${field} min-h-[96px]`} value={form.skills} onChange={(e) => set('skills', e.target.value)} />
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-100"
          >
            <LogOut size={16} /> Sign out
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
          >
            {mutation.isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
