'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExpertsRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/methodology');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]" />
                <p className="text-[var(--color-text-secondary)] font-medium">Redirecting to Methodology...</p>
            </div>
        </div>
    );
}
