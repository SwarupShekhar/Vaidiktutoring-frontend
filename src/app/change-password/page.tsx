'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import Loader from '@/app/components/Loader';
import { Eye, EyeOff } from 'lucide-react';

export default function ChangePasswordPage() {
    const router = useRouter();
    const { changePassword, user, logout } = useAuthContext();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [busy, setBusy] = useState(false);
    
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const validatePassword = (pwd: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(pwd);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setBusy(true);

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            setBusy(false);
            return;
        }

        if (!validatePassword(newPassword)) {
            setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
            setBusy(false);
            return;
        }

        try {
            await changePassword(currentPassword, newPassword);
            setSuccess(true);
            // Redirect to dashboard logic based on role
            setTimeout(() => {
                if (user?.role === 'parent') router.push('/parent/dashboard');
                else if (user?.role === 'student') router.push('/students/dashboard');
                else if (user?.role === 'tutor') router.push('/tutor/dashboard');
                else if (user?.role === 'admin') router.push('/admin/dashboard');
                else router.push('/');
            }, 2000);
        } catch (err: any) {
            setError(err.message);
            setBusy(false);
        }
    };

    return (
        <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            {/* Background blobs matching Login */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-300/40 dark:bg-red-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-300/40 dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 w-full max-w-lg">
                <div className="bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl shadow-2xl p-8 space-y-6">

                    {success ? (
                        <div className="text-center animate-in fade-in zoom-in duration-300">
                            <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                                <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Changed!</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Redirecting you to dashboard...</p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Change Password
                                </h2>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    {user?.force_password_change ? 'You must change your password to continue.' : 'Update your password'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                {error && (
                                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-sm text-red-600 dark:text-red-400 font-medium">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="current" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="current"
                                                type={showCurrent ? "text" : "password"}
                                                required
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="appearance-none relative block w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm bg-white/50 dark:bg-white/5"
                                                placeholder="Enter current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrent(!showCurrent)}
                                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            >
                                                {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="new" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="new"
                                                type={showNew ? "text" : "password"}
                                                required
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="appearance-none relative block w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm bg-white/50 dark:bg-white/5"
                                                placeholder="Min 8 chars, mixed case & symbols"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNew(!showNew)}
                                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            >
                                                {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="confirm"
                                                type={showConfirm ? "text" : "password"}
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="appearance-none relative block w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm bg-white/50 dark:bg-white/5"
                                                placeholder="Re-enter new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirm(!showConfirm)}
                                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            >
                                                {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    {!user?.force_password_change && (
                                        <button
                                            type="button"
                                            onClick={() => router.back()}
                                            className="w-1/3 py-4 px-4 border border-gray-300 dark:border-gray-700 text-sm font-bold rounded-xl text-gray-700 dark:text-gray-300 bg-white/50 hover:bg-white/80 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={busy}
                                        className={`group relative flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${user?.force_password_change ? 'w-full' : 'w-2/3'}`}
                                    >
                                        {busy ? (
                                            <span className="flex items-center gap-2">
                                                <Loader />
                                                <span>Updating...</span>
                                            </span>
                                        ) : 'Update Password'}
                                    </button>
                                </div>

                                {user?.force_password_change && (
                                    <div className="text-center mt-4">
                                        <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700 underline">Logout</button>
                                    </div>
                                )}
                            </form>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
