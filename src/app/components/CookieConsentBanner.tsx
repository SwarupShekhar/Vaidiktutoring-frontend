"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * CookieConsentBanner
 * Fixed banner that appears for first-time visitors to capture GDPR-compliant cookie consent.
 * Choices are persisted to localStorage.
 */
export default function CookieConsentBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check for existing consent
        const consent = localStorage.getItem('studyhours_cookie_consent');
        if (!consent) {
            // Delay appearance slightly for better UX/performance
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }

        // Listen for re-opening the banner via "Cookie Preferences" link
        const handleOpen = () => {
            setIsVisible(true);
        };
        
        window.addEventListener('open-cookie-banner', handleOpen);
        return () => window.removeEventListener('open-cookie-banner', handleOpen);
    }, []);

    const handleChoice = (choice: 'accepted' | 'declined') => {
        localStorage.setItem('studyhours_cookie_consent', choice);
        localStorage.setItem('studyhours_cookie_consent_timestamp', new Date().toISOString());
        setIsVisible(false);
        
        // Dispatch event so other components (like Analytics) can react immediately
        window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: choice }));
    };

    if (!isVisible) return null;

    return (
        <div 
            role="dialog" 
            aria-label="Cookie consent"
            className="fixed bottom-0 left-0 w-full z-100 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-5 duration-700"
        >
            <div className="max-w-7xl mx-auto bg-white dark:bg-[#0A0F29] border border-gray-200 dark:border-white/10 shadow-2xl rounded-2xl md:rounded-4xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl bg-opacity-95 dark:bg-opacity-95">
                <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-extrabold text-deep-navy dark:text-white">We use cookies</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-3xl">
                        We use essential cookies to keep the platform running and analytics cookies to understand how you use StudyHours so we can improve it. We do not use advertising cookies.
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-black">
                        Learn more in our <Link href="/cookies" className="underline text-primary hover:text-sapphire transition-colors">Cookie Policy</Link>
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => handleChoice('declined')}
                        className="w-full sm:w-auto px-8 py-3.5 border-2 border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-sm whitespace-nowrap"
                    >
                        Essential Only
                    </button>
                    <button 
                        onClick={() => handleChoice('accepted')}
                        className="w-full sm:w-auto px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-sapphire transition-all shadow-xl shadow-blue-500/20 text-sm whitespace-nowrap"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
}
