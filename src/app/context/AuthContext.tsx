// src/context/AuthContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { decodeToken } from '@/app/lib/jwt';
import * as authLib from '@/app/lib/auth';
import { setAuthToken, setTokenGetter, getManualAuthToken } from '@/app/lib/api';
import { cmsApi } from '@/app/lib/cms';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs';
import { useQueryClient } from '@tanstack/react-query';

type User = {
  id?: string;
  email?: string;
  role?: string;
  email_verified?: boolean;
  force_password_change?: boolean;
  status?: string;
  [k: string]: any;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, shouldRedirect?: boolean) => Promise<void>;
  signup: (payload: any) => Promise<void>;
  logout: () => void;
  /** Re-fetch the authoritative user (role, etc.) from the backend. Call after a
   *  server-side change like role selection so the context isn't left stale. */
  refreshUser: () => Promise<void>;
  resendVerification: () => Promise<any>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  verificationModalOpen: boolean;
  setVerificationModalOpen: (open: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { getToken, signOut } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [backendUser, setBackendUser] = useState<User | null>(null);

  // Sync token and fetch user
  useEffect(() => {
    async function initAuth() {
      // 1. Try Local Token
      let savedToken = null;
      try {
        savedToken = localStorage.getItem('auth_token');
      } catch (e) {
        console.warn('LocalStorage access failed in AuthContext:', e);
      }

      // A leftover manual auth_token must NOT mask an active Clerk session — that
      // makes the app authenticate as a PREVIOUS user (the cause of cross-account
      // 403s after switching accounts). If Clerk is loaded with an active user,
      // discard any stale manual token and fall through to the Clerk path below.
      if (savedToken && isClerkLoaded && clerkUser) {
        try { localStorage.removeItem('auth_token'); } catch { /* ignore */ }
        savedToken = null;
      }

      if (savedToken) {
        setToken(savedToken);
        setAuthToken(savedToken);
        setTokenGetter(getManualAuthToken); // sliding refresh keeps long sessions alive

        // Decode JWT immediately (no network) so ProtectedClient can unblock now.
        // getMe() runs in the background to validate and replace with full profile.
        const decoded = decodeToken<{ sub?: string; userId?: string; role?: string; email?: string }>(savedToken);
        if (decoded) {
          setBackendUser({ id: decoded.sub || decoded.userId, role: decoded.role, email: decoded.email } as User);
        }
        setLoading(false);
        setInitialCheckDone(true);

        // Background validation — clears session on 401, enriches user on success
        authLib.getMe().then((u) => {
          setBackendUser(u);
          if (u.force_password_change) {
            router.push('/change-password');
          }
        }).catch((err) => {
          console.error("Manual session invalid:", err);
          localStorage.removeItem('auth_token');
          setToken(null);
          setBackendUser(null);
        });
        return;
      }

      // 2. Try Clerk if no Local Token
      if (isClerkLoaded) {
        if (clerkUser) {
          setTokenGetter(getToken);
          try {
            const t = await getToken();
            if (t) {
              setToken(t);
              setAuthToken(t);
              const u = await authLib.getMe();
              setBackendUser(u);
              // Mirror the authoritative DB role into the `user_role` cookie so
              // Edge middleware can route Clerk/OAuth users whose Clerk session
              // token has no publicMetadata.role yet (legacy / not-yet-backfilled
              // accounts) straight to their dashboard instead of bouncing them
              // through /onboarding. Manual login sets this in login(); this is
              // the Clerk-session equivalent.
              document.cookie = `user_role=${u.role || 'student'}; path=/; max-age=604800; SameSite=Lax`;
            }
          } catch (err) {
            console.error("Clerk session sync failed:", err);
          }
        } else {
          // No Clerk + No Local = Not Logged In
          setToken(null);
          setBackendUser(null);
        }
        setLoading(false);
        setInitialCheckDone(true);
      }
    }

    initAuth();
  }, [isClerkLoaded, clerkUser, getToken]);

  // Merge Clerk User + Backend User
  // If Clerk is not present, we rely solely on backendUser for manual logins
  const user: User | null = backendUser || (clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress,
    role: (clerkUser.publicMetadata?.role as string) || 'student',
    imageUrl: clerkUser.imageUrl,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    ...clerkUser.publicMetadata,
  } : null);

  // Debug logging for role issues
  if (clerkUser && !backendUser) {
    // Special handling for known admin email
    if (clerkUser.primaryEmailAddress?.emailAddress === 'swarupshekhar.vaidikedu@gmail.com') {
      (user as any).role = 'admin';
    }
    
    // Additional check: If user has admin email but no metadata, force admin role
    if (clerkUser.primaryEmailAddress?.emailAddress === 'swarupshekhar.vaidikedu@gmail.com' && !clerkUser.publicMetadata?.role) {
      (user as any).role = 'admin';
    }
  }

  useEffect(() => {
    if (user?.id && user?.email) {
      import('posthog-js').then((posthog) => {
        posthog.default.identify(user.id, {
          email: user.email,
          role: user.role,
          name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : undefined
        });
      });
    } else if (user === null && initialCheckDone) {
      import('posthog-js').then((posthog) => {
        posthog.default.reset();
      });
    }
  }, [user?.id, user?.email, user?.role, initialCheckDone]);

  // Attribute a peer referral once the invited user is authenticated. The signup page
  // stashed ?ref=<inviterId> in localStorage (the redirect drops query params). Fire once,
  // then clear — the backend is one-shot and rejects self-referrals.
  useEffect(() => {
    if (!user?.id) return;
    const ref = localStorage.getItem('sh_ref');
    if (!ref) return;
    localStorage.removeItem('sh_ref');
    if (ref !== user.id) cmsApi.attributeReferral(ref).catch(() => {});
  }, [user?.id]);

  async function login(email: string, password: string, shouldRedirect = true) {
    setLoading(true);
    try {
      const res = await authLib.login(email, password);
      const { token: newToken, user: u } = res;

      setToken(newToken);
      setAuthToken(newToken);
      setBackendUser(u);

      localStorage.setItem('auth_token', newToken); // Persist for session
      setTokenGetter(getManualAuthToken); // sliding refresh keeps long sessions alive
      
      document.cookie = `manual_auth_token=${newToken}; path=/; max-age=604800; SameSite=Lax`; // 1 week
      document.cookie = `user_role=${u.role || 'student'}; path=/; max-age=604800; SameSite=Lax`;

      if (u.force_password_change) {
        router.push('/change-password');
        return;
      }

      if (shouldRedirect) {
        // Use specifically typed dashboard paths
        const rolePaths: Record<string, string> = {
          admin: '/admin/dashboard',
          tutor: '/tutor/dashboard',
          parent: '/parent/dashboard',
          student: '/students/dashboard'
        };
        const target = rolePaths[u.role || ''] || '/';
        router.push(target);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      throw new Error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  async function signup(payload: any) {
    // Redirect to Clerk Sign Up
    router.push('/signup');
  }

  function logout() {
    try {
      localStorage.removeItem('auth_token');
    } catch (e) {
      console.warn('Failed to remove auth_token from localStorage:', e);
    }
    // Fully clear the token from the api client and auth state so NO request can
    // send a previous user's token after logout / account-switch.
    setAuthToken(null);
    setTokenGetter(async () => null);
    setToken(null);
    setBackendUser(null);
    document.cookie = "manual_auth_token=; path=/; max-age=0";
    document.cookie = "user_role=; path=/; max-age=0";
    // Drop every cached query (dashboard/profile/notifications/credits/etc.) so the
    // next sign-in — same tab, no hard reload in the desktop app — can't render a
    // previous user's stale/half-resolved data (was the "stuck after sign-in" bug).
    queryClient.clear();
    // In the desktop app the marketing homepage has no purpose — send unauthenticated
    // users straight to /login. Web logout still returns to the marketing home.
    const isAppShell =
      typeof window !== 'undefined' &&
      (!!(window as any).electron?.isDesktopApp ||
        (typeof navigator !== 'undefined' && navigator.userAgent.includes('StudyHoursApp')) ||
        document.documentElement.classList.contains('app-shell-mode'));
    // Hard nav, not router.push: a soft nav can leave stale component state/subscriptions
    // (sidebar, sockets) alive across the auth boundary and race with Clerk's signOut.
    signOut(() => {
      if (typeof window !== 'undefined') {
        window.location.assign(isAppShell ? '/login' : '/');
      }
    });
  }

  async function resendVerification() {
    // Handled by Clerk mostly, but if needed we can use clerk client
    return true;
  }

  async function changePassword(current: string, newPass: string) {
    setLoading(true);
    try {
      const res = await authLib.changePassword({ currentPassword: current, password: newPass });
      if (res.token) {
        setToken(res.token);
        setAuthToken(res.token);
        localStorage.setItem('auth_token', res.token);

        // Refresh profile to ensure force_password_change flag is updated locally
        const u = await authLib.getMe();
        setBackendUser(u);
      }
    } catch (err: any) {
      console.error('Password change failed:', err);
      throw new Error(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  }

  // Verification Modal State (Keep as dummy or handle via logic)
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);

  // Re-pull the authoritative user from the backend. `user` prefers `backendUser`
  // (the cached getMe result) over Clerk's publicMetadata, so after a server-side
  // role change we MUST refresh backendUser or the context keeps the stale role
  // (e.g. the 'student' JIT default) and role-gated pages 403.
  const refreshUser = async () => {
    try {
      const u = await authLib.getMe();
      setBackendUser(u);
    } catch (err) {
      console.error('refreshUser failed:', err);
    }
  };

  const value: AuthContextValue = {
    user,
    token,
    loading: loading, // Use our own loading state which covers both Clerk and Backend sync
    login,
    signup,
    logout,
    refreshUser,
    resendVerification,
    changePassword,
    verificationModalOpen,
    setVerificationModalOpen
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
}