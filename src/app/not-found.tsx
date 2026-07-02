'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAppShell } from '@/app/Hooks/useIsAppShell';
import { useAuthContext } from '@/app/context/AuthContext';

// Role-correct dashboard — a tutor/parent bounced to the STUDENT dashboard hits
// a role-mismatch 403. Route each role to its own home.
function dashboardFor(role?: string): string {
    if (role === 'tutor') return '/tutor/dashboard';
    if (role === 'parent') return '/parent/dashboard';
    return '/students/dashboard';
}

// Synchronous app-shell detection (no effect delay) — usable during render.
function detectAppShellSync(): boolean {
    if (typeof window === 'undefined') return false;
    const w = window as any;
    if (w.electron?.isDesktopApp) return true;
    if (typeof navigator !== 'undefined' && navigator.userAgent.includes('StudyHoursApp')) return true;
    if (typeof document !== 'undefined' && document.cookie.includes('sh_app=1')) return true;
    return false;
}

export default function NotFound() {
    const router = useRouter();
    const isAppShell = useIsAppShell();
    const { user, loading } = useAuthContext();
    const dash = dashboardFor(user?.role);
    // In the desktop app there is no marketing home — send users to THEIR dashboard.
    const homeHref = isAppShell ? dash : '/';

    // Set during render (before any effect) so ClientSideComponents' windowReady
    // skips while this transient 404 paints — keeping the splash over it instead
    // of revealing the bad route. The hard nav below reloads into a fresh context
    // (clearing the flag) so windowReady fires normally on the real dashboard.
    if (detectAppShellSync() && typeof window !== 'undefined') {
        (window as any).__shSuppressReady = true;
    }

    // In the desktop app, a transient 404 can flash on launch (route still
    // resolving). Bounce straight to the dashboard so it never dwells on screen.
    useEffect(() => {
        // Wait for auth to resolve so we send them to the RIGHT role dashboard
        // (the splash covers the 404 via __shSuppressReady while we wait).
        if (loading) return;
        if (detectAppShellSync()) {
            // Hard nav (not router.replace) to force a clean remount + window reveal.
            window.location.replace(dash);
        } else if (isAppShell) {
            router.replace(dash);
        }
    }, [isAppShell, router, dash, loading]);

    return (
        <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            {/* Animated Blobs Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-300/40 dark:bg-red-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-200/40 dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-300/40 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* Glass Card */}
            <div className="relative z-10 w-full max-w-lg text-center">
                <div className="bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl shadow-2xl p-12 space-y-8">

                    <div className="space-y-4">
                        <h1 className="text-9xl font-extrabold text-primary opacity-50">404</h1>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Page not found
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            Oops! It seems you've ventured into uncharted territory. The page you are looking for doesn't exist or has been moved.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link
                            href={homeHref}
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-full text-white bg-primary hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Return Home
                        </Link>
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-700 text-base font-bold rounded-full text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-all backdrop-blur-sm"
                        >
                            Go Back
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}
