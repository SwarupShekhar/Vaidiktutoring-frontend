'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/app/context/AuthContext';
import { ArrowRight } from 'lucide-react';

export default function StickyCTA() {
    const { user } = useAuthContext();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling past the hero (roughly 600px)
            if (window.scrollY > 600) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-full duration-500">
            <div className="max-w-5xl mx-auto bg-[var(--color-surface)] dark:bg-[#1C2433] text-[var(--color-text-primary)] dark:text-white rounded-2xl shadow-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 border border-[var(--color-border)] dark:border-[var(--color-sapphire)]/30 backdrop-blur-md bg-opacity-95">
                <div className="flex-1 text-center md:text-left">
                    <p className="font-bold text-lg md:text-xl text-[var(--color-deep-navy)] dark:text-white">Limited spots available for February.</p>
                </div>

                <Link
                    href={user ? '/students/dashboard' : '/signup'}
                    className="w-full md:w-auto px-8 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-sapphire)] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                    Book a Free Learning Assessment
                    <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
}
