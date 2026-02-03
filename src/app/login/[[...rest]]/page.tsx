'use client';

import React, { useState } from 'react';
import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import { useAuthContext } from '@/app/context/AuthContext';
import { Mail, Lock, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuthContext();
  const { resolvedTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Animated Blobs Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300/40 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-200/40 dark:bg-yellow-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-300/40 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/70 dark:bg-black/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl p-8 space-y-6 flex flex-col justify-center transition-all duration-500 overflow-hidden">

          {!showManual ? (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 flex flex-col items-center w-full">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                  Welcome Back
                </h1>
                <p className="text-[var(--color-text-secondary)] font-medium">
                  Sign in to your account
                </p>
              </div>

              {/* Clerk Sign In with Theme Support */}
              <div className="w-full flex justify-center">
                <SignIn
                  routing="hash"
                  appearance={{
                    baseTheme: resolvedTheme === 'dark' ? dark : undefined,
                    elements: {
                      card: "bg-transparent shadow-none border-none p-0",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "rounded-xl border border-slate-200 dark:border-slate-800",
                      formButtonPrimary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl",
                      footer: "hidden", // Hide Clerk's internal footer to use our own
                    }
                  }}
                />
              </div>

              <div className="mt-6 flex flex-col items-center gap-4 w-full border-t border-slate-200 dark:border-slate-800 pt-6">
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-500">
                    Don't have an account? <a href="/signup" className="text-purple-600 underline">Sign Up</a>
                  </p>
                </div>

                <button
                  onClick={() => setShowManual(true)}
                  className="text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center justify-center gap-2 group w-full py-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10"
                >
                  <span>Tutor or Admin?</span>
                  <span className="text-purple-600">Login with Direct Access →</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full">
              <button
                onClick={() => setShowManual(false)}
                className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-purple-600 transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Social Login
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Direct Access</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Use your system credentials to enter the dashboard</p>
              </div>

              <form onSubmit={handleManualLogin} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-100/50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-bold">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <input
                      required
                      type="email"
                      placeholder="System Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none text-slate-900 dark:text-white font-semibold"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <input
                      required
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none text-slate-900 dark:text-white font-semibold"
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span>Enter Dashboard</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-400 font-medium">
                  Authorized personal only.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}