// src/context/AuthContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { decodeToken } from '@/app/lib/jwt';
import * as authLib from '@/app/lib/auth';
import { setAuthToken, setTokenGetter } from '@/app/lib/api';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs';

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
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [backendUser, setBackendUser] = useState<User | null>(null);

  // Sync token and fetch user
  useEffect(() => {
    async function initAuth() {
      // 1. Try Local Token
      const savedToken = localStorage.getItem('auth_token');
      if (savedToken) {
        setToken(savedToken);
        setAuthToken(savedToken);
        try {
          const u = await authLib.getMe();
          setBackendUser(u);
          if (u.force_password_change) {
            router.push('/change-password');
          }
        } catch (err) {
          console.error("Manual session invalid:", err);
          localStorage.removeItem('auth_token');
          setToken(null);
          setBackendUser(null);
        }
        setLoading(false);
        setInitialCheckDone(true);
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

  async function login(email: string, password: string, shouldRedirect = true) {
    setLoading(true);
    try {
      const res = await authLib.login(email, password);
      const { token: newToken, user: u } = res;

      setToken(newToken);
      setAuthToken(newToken);
      setBackendUser(u);

      localStorage.setItem('auth_token', newToken); // Persist for session

      if (u.force_password_change) {
        router.push('/change-password');
        return;
      }

      if (shouldRedirect) {
        if (u.role === 'admin') router.push('/admin/dashboard');
        else if (u.role === 'tutor') router.push('/tutor/dashboard');
        else if (u.role === 'parent') router.push('/parent/dashboard');
        else if (u.role === 'student') router.push('/students/dashboard');
        else router.push('/');
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
    signOut(() => router.push('/'));
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

  const value: AuthContextValue = {
    user,
    token,
    loading: loading, // Use our own loading state which covers both Clerk and Backend sync
    login,
    signup,
    logout,
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