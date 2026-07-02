'use client';

import { useState } from 'react';
import { useAuthContext } from '@/app/context/AuthContext';
import { api } from '@/app/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Calendar,
  GraduationCap,
  School,
  Star,
  Target,
  ChevronLeft,
  Loader2,
  LogOut,
  ShieldCheck,
  FileText,
  ExternalLink,
  Video,
  VideoOff,
  Pencil,
  X,
  Save
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useIsAppShell } from '@/app/Hooks/useIsAppShell';
import useCatalog from '@/app/Hooks/useCatalog';
import {
  AppPage,
  AppPageItem,
  AppPageHeader,
  AppCard,
  AppPillButton,
  AppEmptyState,
  AppSkeleton,
  AppSkeletonCard,
  accentRgb,
} from '@/app/components/app-shell/ui';

export default function StudentProfilePage() {
  const { user, token, loading: authLoading, logout } = useAuthContext();
  const isAppShell = useIsAppShell();

  // Legal / policy pages. Open in the system browser inside the desktop app
  // (they live on the marketing site, outside the app shell), normal new tab on web.
  const LEGAL_LINKS = [
    { label: 'Privacy Policy', path: '/legal/privacy' },
    { label: 'Terms of Use', path: '/legal/terms' },
    { label: 'Cookie Policy', path: '/legal/cookies' },
    { label: 'Acceptable Use', path: '/legal/aup' },
    { label: 'Refund Policy', path: '/legal/refunds' },
  ];
  const openLegal = (path: string) => {
    if (isAppShell && typeof window !== 'undefined' && window.electron?.openExternal) {
      window.electron.openExternal(`https://studyhours.com${path}`);
    } else if (typeof window !== 'undefined') {
      window.open(path, '_blank', 'noopener,noreferrer');
    }
  };

  const { data: profile, isLoading } = useQuery({
    queryKey: ['student-profile', user?.id],
    queryFn: async () => {
      const res = await api.get('/students/me');
      return res.data;
    },
    // Gate on the auth TOKEN (not just `user`) so the request never fires before
    // auth is bootstrapped. In the desktop app `token` and `user` hydrate at
    // different times; gating on `user` made this page short-circuit to
    // "Profile not found" while auth was still resolving. Mirrors
    // useStudentDashboardSummary, which is why the homescreen loads but this didn't.
    enabled: !!token && !authLoading,
  });

  // Adult-learner self-consent to recording. Minors are refused server-side; here
  // we only show the toggle when the account is 18+ (see RecordingConsentCard).
  const queryClient = useQueryClient();
  const consentMutation = useMutation({
    mutationFn: async (vars: { granted: boolean; birthDate?: string }) => {
      const res = await api.patch('/students/me/recording-consent', vars);
      return res.data;
    },
    onSuccess: (_d, vars) => {
      toast.success(
        vars.granted ? 'Recording consent granted' : 'Recording consent withdrawn',
      );
      queryClient.invalidateQueries({ queryKey: ['student-profile'] });
    },
    onError: (e: any) => {
      const msg = e?.response?.data?.message;
      toast.error(
        msg === 'DOB_REQUIRED'
          ? 'Please enter your date of birth to enable recording.'
          : msg || 'Could not update consent',
      );
    },
  });

  // ---- Editable profile (everything except name + email) ----
  const { curricula } = useCatalog();
  type EditForm = {
    grade: string;
    school: string;
    curriculum_preference: string;
    interests: string; // comma-separated
    struggle_areas: string; // comma-separated
  };
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const splitList = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);
  const profileMutation = useMutation({
    mutationFn: async (f: EditForm) => {
      const res = await api.patch('/students/me', {
        grade: f.grade || undefined,
        school: f.school || undefined,
        curriculum_preference: f.curriculum_preference || undefined,
        interests: splitList(f.interests),
        struggle_areas: splitList(f.struggle_areas),
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Profile updated');
      queryClient.invalidateQueries({ queryKey: ['student-profile'] });
      setEditForm(null);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Could not save profile'),
  });
  const openEdit = (p: any) =>
    setEditForm({
      grade: p?.grade ?? '',
      school: p?.school ?? '',
      curriculum_preference: p?.curriculum_preference ?? '',
      interests: Array.isArray(p?.interests) ? p.interests.join(', ') : '',
      struggle_areas: Array.isArray(p?.struggle_areas) ? p.struggle_areas.join(', ') : '',
    });

  // While auth is still bootstrapping (no token yet) OR the query is in flight,
  // show the loading state, NOT the "not found" state.
  const authResolving = authLoading || !token;

  if (authResolving || isLoading) {
    if (isAppShell) {
      return (
        <AppPage>
          <AppPageItem>
            <div className="flex items-center gap-3.5">
              <AppSkeleton className="h-11 w-11 rounded-xl" />
              <div className="space-y-2">
                <AppSkeleton className="h-7 w-48" />
                <AppSkeleton className="h-4 w-72" />
              </div>
            </div>
          </AppPageItem>
          <AppPageItem>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-6 md:col-span-2">
                <AppSkeletonCard />
                <AppSkeletonCard />
              </div>
              <div className="space-y-6">
                <AppSkeletonCard />
                <AppSkeletonCard />
                <AppSkeletonCard />
              </div>
            </div>
          </AppPageItem>
        </AppPage>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    if (isAppShell) {
      return (
        <AppPage>
          <AppPageItem>
            <AppEmptyState
              icon={User}
              accent="indigo"
              title="Profile not found."
              tone="error"
            />
          </AppPageItem>
        </AppPage>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Profile not found.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (isAppShell) {
    // Use the authoritative credit status (same source the homescreen shows via
    // useCreditStatus), NOT the denormalized `sessions_remaining` column, the two
    // drift apart, which is what made Profile ≠ homescreen.
    const credit = profile.creditStatus ?? null;
    const sessionsRemaining = credit?.creditsRemaining ?? profile.sessions_remaining ?? 0;
    const creditModeLabel =
      credit?.mode === 'trial_active'
        ? 'Free trial sessions'
        : credit?.mode === 'paid' || credit?.mode === 'learning'
          ? 'Plan sessions remaining'
          : credit?.mode === 'trial_expired' || credit?.mode === 'trial_exhausted'
            ? 'Trial ended, renew to add sessions'
            : 'Sessions remaining';
    const interests: string[] =
      profile.interests && Array.isArray(profile.interests) ? profile.interests : [];
    const struggleAreas: string[] =
      profile.struggle_areas && Array.isArray(profile.struggle_areas)
        ? profile.struggle_areas
        : [];

    return (
      <AppPage>
        <AppPageItem>
          <AppPageHeader
            icon={User}
            accent="indigo"
            title="My Profile"
            subtitle="Manage and verify your personal information."
            right={
              <AppPillButton accent="indigo" variant="soft" onClick={() => openEdit(profile)}>
                <Pencil size={14} /> Edit
              </AppPillButton>
            }
          />
        </AppPageItem>

        <AppPageItem>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Left column */}
            <div className="space-y-6 md:col-span-2">
              {/* Personal Information */}
              <AppCard accent="indigo">
                <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
                  <User size={18} style={{ color: accentRgb('indigo') }} /> Personal Information
                </h2>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/45">
                      Full Name
                    </p>
                    <p className="mt-1 font-semibold text-white">
                      {profile.first_name} {profile.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/45">
                      Email Address
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Mail size={15} className="text-white/45" />
                      <p className="font-medium text-white">{profile.email || 'Not provided'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/45">
                      Grade / Level
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <GraduationCap size={15} className="text-white/45" />
                      <p className="font-medium text-white">{profile.grade || 'Not specified'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/45">
                      School Name
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <School size={15} className="text-white/45" />
                      <p className="font-medium text-white">{profile.school || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </AppCard>

              {/* Academic Profile */}
              <AppCard accent="indigo">
                <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
                  <Target size={18} style={{ color: accentRgb('indigo') }} /> Academic Profile
                </h2>
                <div className="space-y-6">
                  <div>
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-white/45">
                      Curriculum Preference
                    </p>
                    <span
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-bold"
                      style={{
                        background: accentRgb('indigo', 0.14),
                        color: accentRgb('indigo'),
                        border: `1px solid ${accentRgb('indigo', 0.3)}`,
                      }}
                    >
                      <BookOpen size={15} />
                      {profile.curricula?.name || 'Standard'}
                    </span>
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-white/45">
                      Learning Interests
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {interests.length > 0 ? (
                        interests.map((interest, i) => (
                          <span
                            key={i}
                            className="rounded-full px-3 py-1 text-sm font-medium"
                            style={{
                              background: accentRgb('indigo', 0.12),
                              color: accentRgb('indigo'),
                              border: `1px solid ${accentRgb('indigo', 0.25)}`,
                            }}
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm italic text-white/45">No interests listed.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-white/45">
                      Areas for Improvement
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {struggleAreas.length > 0 ? (
                        struggleAreas.map((area, i) => (
                          <span
                            key={i}
                            className="rounded-full px-3 py-1 text-sm font-medium"
                            style={{
                              background: accentRgb('rose', 0.12),
                              color: accentRgb('rose'),
                              border: `1px solid ${accentRgb('rose', 0.25)}`,
                            }}
                          >
                            {area}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm italic text-white/45">No areas specified.</p>
                      )}
                    </div>
                  </div>
                </div>
              </AppCard>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Enrollment Status */}
              <AppCard accent="indigo">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-white">
                  <Star size={16} style={{ color: accentRgb('indigo') }} /> Enrollment Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Type</span>
                    <span
                      className="rounded-lg px-2 py-0.5 text-sm font-bold capitalize"
                      style={{
                        background: accentRgb('indigo', 0.14),
                        color: accentRgb('indigo'),
                      }}
                    >
                      {profile.enrollment_status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Member Since</span>
                    <span className="text-sm font-bold text-white">
                      {profile.created_at
                        ? new Date(profile.created_at).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Sessions Remaining</span>
                      <span className="font-black" style={{ color: accentRgb('indigo') }}>
                        {sessionsRemaining}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-white/40">{creditModeLabel}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                    <Link
                      href="/pricing"
                      className="flex items-center justify-center rounded-xl px-3 py-2 text-sm font-bold transition-opacity hover:opacity-90"
                      style={{ background: accentRgb('indigo'), color: '#fff' }}
                    >
                      View plans
                    </Link>
                    <Link
                      href="/students/sessions"
                      className="flex items-center justify-center rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white/80 transition-colors hover:bg-white/5"
                    >
                      Session history
                    </Link>
                  </div>
                </div>
              </AppCard>

              {/* Your Expert Tutor */}
              <AppCard accent="indigo">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-white">
                  <GraduationCap size={16} style={{ color: accentRgb('indigo') }} /> Your Expert Tutor
                </h3>
                {profile.trial_tutor ? (
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold"
                      style={{
                        background: accentRgb('indigo', 0.18),
                        color: accentRgb('indigo'),
                      }}
                    >
                      {profile.trial_tutor.users.first_name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-white">
                        {profile.trial_tutor.users.first_name}{' '}
                        {profile.trial_tutor.users.last_name}
                      </p>
                      <p className="text-xs text-white/45">Assigned Expert</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <p className="mb-3 text-sm italic text-white/45">No tutor assigned yet.</p>
                    <Link
                      href="/experts"
                      className="text-xs font-bold hover:underline"
                      style={{ color: accentRgb('indigo') }}
                    >
                      Browse Tutors
                    </Link>
                  </div>
                )}
              </AppCard>

              {/* Privacy & recording (adult self-consent) */}
              <RecordingConsentCard
                variant="app"
                birthDate={profile.birth_date}
                granted={!!profile.recording_consent_granted}
                pending={consentMutation.isPending}
                onToggle={(next, dob) => consentMutation.mutate({ granted: next, birthDate: dob })}
              />

              {/* Legal & Privacy */}
              <AppCard accent="indigo">
                <h3 className="mb-1 flex items-center gap-2 font-bold text-white">
                  <ShieldCheck size={16} style={{ color: accentRgb('indigo') }} /> Legal &amp; Privacy
                </h3>
                <p className="mb-3 text-xs text-white/45">
                  Policies open in your browser.
                </p>
                <div className="flex flex-col divide-y divide-white/5">
                  {LEGAL_LINKS.map((l) => (
                    <button
                      key={l.path}
                      onClick={() => openLegal(l.path)}
                      className="flex items-center justify-between py-2.5 text-left text-sm font-semibold text-white/80 transition-colors hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <FileText size={14} className="text-white/40" /> {l.label}
                      </span>
                      <ExternalLink size={13} className="text-white/50" />
                    </button>
                  ))}
                </div>
              </AppCard>

              {/* Account */}
              <AppCard accent="indigo">
                <h3 className="mb-1 flex items-center gap-2 font-bold text-white">
                  <LogOut size={16} style={{ color: accentRgb('indigo') }} /> Account
                </h3>
                <p className="mb-4 text-xs text-white/45">
                  Signed in as{' '}
                  {profile.email || `${profile.first_name} ${profile.last_name}`}
                </p>
                <AppPillButton
                  accent="rose"
                  variant="soft"
                  onClick={() => logout()}
                  className="w-full"
                >
                  <LogOut size={15} /> Sign out
                </AppPillButton>
              </AppCard>
            </div>
          </div>
        </AppPageItem>

        {/* Edit profile modal, everything except name + email. */}
        {editForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#15131f] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Edit profile</h2>
                <button onClick={() => setEditForm(null)} className="rounded-lg p-1.5 text-white/50 ring-1 ring-white/10 hover:bg-white/10 hover:text-white" aria-label="Close">
                  <X size={16} />
                </button>
              </div>
              <p className="mb-4 text-xs text-white/40">Name and email can't be changed here.</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/40">Grade / Level</label>
                    <input value={editForm.grade} onChange={(e) => setEditForm({ ...editForm, grade: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-indigo-400/60" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/40">School</label>
                    <input value={editForm.school} onChange={(e) => setEditForm({ ...editForm, school: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-indigo-400/60" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/40">Curriculum</label>
                  <select value={editForm.curriculum_preference} onChange={(e) => setEditForm({ ...editForm, curriculum_preference: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-indigo-400/60">
                    <option value="" className="bg-[#15131f]">No preference</option>
                    {(curricula || []).map((c: any) => (
                      <option key={c.id} value={c.id} className="bg-[#15131f]">{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/40">Interests</label>
                  <input value={editForm.interests} onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })} placeholder="Comma-separated, e.g. Coding, Football" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-indigo-400/60" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/40">Areas to improve</label>
                  <input value={editForm.struggle_areas} onChange={(e) => setEditForm({ ...editForm, struggle_areas: e.target.value })} placeholder="Comma-separated, e.g. Algebra, Essays" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-indigo-400/60" />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button onClick={() => setEditForm(null)} className="rounded-xl px-4 py-2 text-sm font-bold text-white/60 hover:text-white">Cancel</button>
                <button onClick={() => profileMutation.mutate(editForm)} disabled={profileMutation.isPending} className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50">
                  {profileMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save
                </button>
              </div>
            </div>
          </div>
        )}
      </AppPage>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Back Link (hidden in the desktop app, sidebar handles navigation) */}
        {!isAppShell && (
          <Link
            href="/students/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>
        )}

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-black text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage and verify your personal information.</p>
        </header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Main Info Card */}
          <motion.div variants={itemVariants} className="md:col-span-2 space-y-8">
            {/* Personal Details */}
            <div className="bg-surface rounded-3xl p-8 border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User size={20} className="text-primary" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <p className="text-lg font-semibold text-foreground">{profile.first_name} {profile.last_name}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail size={16} className="text-muted-foreground" />
                    <p className="font-medium text-foreground">{profile.email || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Grade / Level</label>
                  <div className="flex items-center gap-2 mt-1">
                    <GraduationCap size={16} className="text-muted-foreground" />
                    <p className="font-medium text-foreground">{profile.grade || 'Not specified'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">School Name</label>
                  <div className="flex items-center gap-2 mt-1">
                    <School size={16} className="text-muted-foreground" />
                    <p className="font-medium text-foreground">{profile.school || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Focus */}
            <div className="bg-surface rounded-3xl p-8 border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Target size={20} className="text-indigo-500" /> Academic Profile
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Curriculum Preference</label>
                  <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                    <BookOpen size={16} />
                    <span className="font-bold">{profile.curricula?.name || 'Standard'}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Learning Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests && Array.isArray(profile.interests) && profile.interests.length > 0 ? (
                      profile.interests.map((interest: string, i: number) => (
                        <span key={i} className="bg-muted px-3 py-1 rounded-full text-sm font-medium">
                          {interest}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No interests listed.</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Areas for Improvement</label>
                  <div className="flex flex-wrap gap-2">
                    {profile.struggle_areas && Array.isArray(profile.struggle_areas) && profile.struggle_areas.length > 0 ? (
                      profile.struggle_areas.map((area: string, i: number) => (
                        <span key={i} className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium border border-red-100 dark:border-red-500/20">
                          {area}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No areas specified.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar / Status Card */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Enrollment Card */}
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
              <h3 className="font-bold text-foreground mb-4">Enrollment Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-bold capitalize px-2 py-0.5 bg-primary/10 text-primary rounded-lg">
                    {profile.enrollment_status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="text-sm font-bold text-foreground">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Sessions Remaining</span>
                    <span className="font-black text-primary">{profile.sessions_remaining}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{ width: `${Math.min(100, (profile.sessions_remaining / (profile.creditStatus?.credits_total || 10)) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                  <Link href="/pricing" className="flex items-center justify-center rounded-xl bg-primary px-3 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90">
                    View plans
                  </Link>
                  <Link href="/students/sessions" className="flex items-center justify-center rounded-xl border border-border px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted">
                    Session history
                  </Link>
                </div>
              </div>
            </div>

            {/* Assigned Tutor Card */}
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
              <h3 className="font-bold text-foreground mb-4">Your Expert Tutor</h3>
              {profile.trial_tutor ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl font-bold">
                    {profile.trial_tutor.users.first_name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">
                      {profile.trial_tutor.users.first_name} {profile.trial_tutor.users.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">Assigned Expert</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground italic mb-3">No tutor assigned yet.</p>
                  <Link href="/experts" className="text-xs font-bold text-primary hover:underline">
                    Browse Tutors
                  </Link>
                </div>
              )}
            </div>

            {/* Privacy & recording (adult self-consent) */}
            <RecordingConsentCard
              variant="web"
              birthDate={profile.birth_date}
              granted={!!profile.recording_consent_granted}
              pending={consentMutation.isPending}
              onToggle={(next, dob) => consentMutation.mutate({ granted: next, birthDate: dob })}
            />

            {/* Account / Sign out */}
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
              <h3 className="font-bold text-foreground mb-1">Account</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Signed in as {profile.email || `${profile.first_name} ${profile.last_name}`}
              </p>
              <button
                onClick={() => logout()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-sm font-bold hover:bg-red-500 hover:text-white transition-colors"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* Age check, true only when a birth date is present AND the learner is 18+. */
function isAdult(birthDate?: string | null): boolean {
  if (!birthDate) return false;
  const dob = new Date(birthDate);
  if (isNaN(dob.getTime())) return false;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age >= 18;
}

/**
 * Recording-consent card for a student's OWN account. Only adult learners (18+)
 * see a toggle; for a minor (or unknown age) it explains that a parent/guardian
 * must enable recording. Renders app-shell (dark) or web (light) styling.
 */
function RecordingConsentCard({
  birthDate,
  granted,
  pending,
  onToggle,
  variant,
}: {
  birthDate?: string | null;
  granted: boolean;
  pending: boolean;
  onToggle: (next: boolean, birthDate?: string) => void;
  variant: 'app' | 'web';
}) {
  const [dob, setDob] = useState('');
  const app = variant === 'app';
  const hasDob = !!birthDate;
  const adult = isAdult(birthDate);
  // Three states: known adult → toggle; known minor → parent-only note;
  // unknown age (no DOB on file) → collect a self-attested date of birth.
  const state: 'adult' | 'minor' | 'needs-dob' = hasDob
    ? adult
      ? 'adult'
      : 'minor'
    : 'needs-dob';

  const blurb = 'Turn on to let your tutor record your sessions so you can review them later. Off by default; change anytime. Recordings auto-delete after 30 days.';
  const minorNote = "Sessions are only recorded with consent. For a learner under 18, a parent or guardian must enable recording from their own account, it can't be turned on here.";

  const toggle = (
    <button
      type="button"
      role="switch"
      aria-checked={granted}
      disabled={pending}
      onClick={() => onToggle(!granted)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
        granted ? 'bg-emerald-500' : app ? 'bg-white/15' : 'bg-slate-300 dark:bg-slate-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          granted ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const heading = (
    <h3
      className={
        app
          ? 'mb-1 flex items-center gap-2 font-bold text-white'
          : 'font-bold text-foreground mb-1 flex items-center gap-2'
      }
    >
      <ShieldCheck size={16} style={app ? { color: accentRgb('emerald') } : undefined} className={app ? '' : 'text-emerald-600'} />{' '}
      Privacy &amp; recording
    </h3>
  );

  const body = (
    <>
      {state === 'adult' && (
        <>
          <p className={app ? 'mb-4 text-xs text-white/45' : 'text-xs text-muted-foreground mb-4'}>{blurb}</p>
          <div
            className={
              app
                ? 'flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3'
                : 'flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3'
            }
          >
            <span className={app ? 'flex items-center gap-2 text-sm text-white/80' : 'flex items-center gap-2 text-sm text-foreground'}>
              {granted ? <Video size={15} /> : <VideoOff size={15} />}
              {granted ? 'Recording allowed' : 'Recording off'}
            </span>
            {toggle}
          </div>
        </>
      )}

      {state === 'minor' && (
        <p className={app ? 'text-xs leading-relaxed text-white/45' : 'text-xs text-muted-foreground leading-relaxed'}>
          {minorNote}
        </p>
      )}

      {state === 'needs-dob' && (
        <>
          <p className={app ? 'mb-3 text-xs text-white/45' : 'text-xs text-muted-foreground mb-3'}>
            {blurb} To enable it, confirm you're 18 or older.
          </p>
          <label className={app ? 'mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/40' : 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground'}>
            Date of birth
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dob}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDob(e.target.value)}
              className={
                app
                  ? 'flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/60'
                  : 'flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-emerald-500'
              }
            />
            <button
              type="button"
              disabled={pending || !dob || !isAdult(dob)}
              onClick={() => onToggle(true, dob)}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Enable
            </button>
          </div>
          {dob && !isAdult(dob) && (
            <p className="mt-2 text-xs text-rose-400">You must be 18 or older to self-consent to recording.</p>
          )}
        </>
      )}
    </>
  );

  if (app) {
    return (
      <AppCard accent="emerald">
        {heading}
        {body}
      </AppCard>
    );
  }
  return (
    <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
      {heading}
      {body}
    </div>
  );
}
