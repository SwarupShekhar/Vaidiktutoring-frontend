'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, ShieldCheck, Zap, Info } from 'lucide-react';
import Link_Next from 'next/link';

// Component wrapper to use useSearchParams
const CheckoutContent = () => {
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan') || 'CORE';
    const billing = searchParams.get('billing') || 'monthly';

    // Pricing mapping
    const pricing: Record<string, { monthly: number, yearly: number }> = {
        'FOUNDATIONS': { monthly: 180, yearly: 135 },
        'CORE': { monthly: 320, yearly: 240 },
        'ADVANCED': { monthly: 540, yearly: 405 }
    };

    const currentPrice = pricing[plan]?.[billing as 'monthly' | 'yearly'] || 0;

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-gradient-to-b from-[var(--color-ice-blue)] to-[var(--color-background)]">
            <div className="max-w-xl mx-auto">
                <Link_Next
                    href="/pricing"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    Back to Pricing
                </Link_Next>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 md:p-12 rounded-[2.5rem] bg-white dark:bg-white/5 border border-[var(--color-border)] dark:border-white/10 shadow-2xl backdrop-blur-3xl relative overflow-hidden"
                >
                    <div className="relative z-10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[var(--color-primary)] mx-auto mb-8 shadow-sm">
                            <CreditCard size={32} />
                        </div>

                        <h1 className="text-3xl font-extrabold text-[var(--color-deep-navy)] dark:text-white mb-2">Confirm Your Plan</h1>
                        <p className="text-[var(--color-text-secondary)] font-medium mb-10">Review your selection before we finalize your assessment.</p>

                        <div className="space-y-4 mb-10 text-left">
                            <div className="p-5 rounded-2xl bg-[var(--color-ice-blue)] dark:bg-blue-900/10 border border-[var(--color-powder-blue)] dark:border-blue-800/20">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-black text-[var(--color-sapphire)] uppercase tracking-widest">Plan Selection</span>
                                    <span className="text-[10px] bg-white dark:bg-white/10 px-2 py-0.5 rounded-full font-bold">{billing}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <h2 className="text-xl font-black text-[var(--color-deep-navy)] dark:text-white">{plan.charAt(0) + plan.slice(1).toLowerCase()}</h2>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-[var(--color-deep-navy)] dark:text-white">${currentPrice}<span className="text-xs">/mo</span></div>
                                        {billing === 'yearly' && <div className="text-[10px] text-green-600 font-bold">SAVED 25%</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 text-amber-800 dark:text-amber-200 text-xs font-medium leading-relaxed">
                                <Info size={16} className="flex-shrink-0 mt-0.5" />
                                <p>Payment systems are currently being integrated. Clicking proceed will flag your account for the {plan.toLowerCase()} plan, and our team will contact you within 24 hours to finalize setup.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                disabled
                                className="w-full py-5 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 font-bold text-lg cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <ShieldCheck size={20} />
                                Proceed (Coming Soon)
                            </button>

                            <p className="text-[10px] text-[var(--color-text-secondary)] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                <Zap size={10} className="text-[var(--color-sapphire)]" /> No immediate charge required
                            </p>
                        </div>
                    </div>

                    {/* Decorative blobs */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl -mr-16 -mt-16" />
                </motion.div>

                <p className="mt-8 text-center text-xs text-[var(--color-text-secondary)] font-medium">
                    Need help? <Link_Next href="/contact" className="text-[var(--color-primary)] hover:underline">Contact academic support</Link_Next>
                </p>
            </div>
        </div>
    );
};

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
