// src/context/AuthContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { decodeToken } from '@/app/lib/jwt';
import * as authLib from '@/app/lib/auth';
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
  const [token, setToken] = useState<string | null>(null);

  // Sync token
  useEffect(() => {
    if (isClerkLoaded) {
      if (clerkUser) {
        getToken().then((t) => {
          setToken(t);
          setLoading(false);
        });
      } else {
        setToken(null);
        setLoading(false);
      }
    }
  }, [isClerkLoaded, clerkUser, getToken]);

  const user: User | null = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress,
    role: (clerkUser.publicMetadata?.role as string) || 'student', // Default or fetch from metadata
    imageUrl: clerkUser.imageUrl,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    ...clerkUser.publicMetadata,
  } : null;

  async function login(email: string, password: string, shouldRedirect = true) {
    // Redirect to Clerk Sign In
    router.push('/login');
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
    // Redirect to Clerk User Profile for password change
    router.push('/profile');
  }

  // Verification Modal State (Keep as dummy or handle via logic)
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);

  const value: AuthContextValue = {
    user,
    token,
    loading: loading || !isClerkLoaded,
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