'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ShieldCheck, Zap, Star, Layout, HelpCircle, ChevronDown } from 'lucide-react';
import Link_Next from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import StickyCTA from '../components/subjects/StickyCTA';

// --- Section 1: HeroPricing ---
const HeroPricing = () => {
    return (
        <section className="pt-32 pb-20 px-6 relative overflow-hidden bg-linear-to-b from-ice-blue to-background">
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-sapphire/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/20 text-sm font-bold text-sapphire mb-8 shadow-sm">
                        <ShieldCheck size={16} />
                        Simple & Transparent
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-deep-navy dark:text-white mb-6 tracking-tight">
                        Learning Plans Built <br className="hidden md:block" /> For Your Child
                    </h1>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        Personalized tutoring built around your child’s needs, not rigid packages. Final pricing follows a free academic assessment.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                        <Link_Next
                            href="/methodology"
                            className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-sapphire transition-all shadow-xl shadow-blue-500/20"
                        >
                            See How We Teach
                        </Link_Next>
                        <Link_Next
                            href="/signup?type=assessment"
                            className="w-full sm:w-auto px-8 py-4 border-2 border-border text-(--color-text-primary) dark:text-white font-bold rounded-full hover:bg-surface transition-all"
                        >
                            Book Free Assessment
                        </Link_Next>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// --- Section 2: PricingPlans ---
const PricingPlans = () => {
    const { user } = useAuthContext();
    const router = useRouter();
    const [region, setRegion] = useState<'US' | 'UK'>('US');

    const handlePlanClick = (planId: string, regionCode: string) => {
        if (!user) {
            // Redirect to login with the intended checkout URL
            const checkoutUrl = `/checkout?plan=${planId.toUpperCase()}&region=${regionCode}`;
            router.push(`/login?redirect_url=${encodeURIComponent(checkoutUrl)}`);
        } else {
            // User is logged in, go to checkout
            router.push(`/checkout?plan=${planId.toUpperCase()}&region=${regionCode}`);
        }
    };

    // Regional pricing configuration
    const pricingConfig = {
        US: {
            currency: '$',
            name: 'United States (USD) – Core Excellence',
            target: 'Common Core, NGSS, AP',
            plans: [
                {
                    id: 'foundation',
                    name: 'Foundation',
                    frequency: '2 sessions / week',
                    monthlyPrice: 199,
                    credits: 8,
                    features: [
                        'Tutor OS Access',
                        'AI Transcript + Summary',
                        'Confidence Tracking',
                        'Monthly Recurring Subscription',
                        'No Lock-in'
                    ]
                },
                {
                    id: 'mastery',
                    name: 'Mastery',
                    frequency: '4 sessions / week',
                    monthlyPrice: 349,
                    credits: 16,
                    features: [
                        'Tutor OS Access',
                        'AI Transcript + Summary',
                        'Confidence Tracking',
                        'Monthly Recurring Subscription',
                        'No Lock-in',
                        'Priority Support'
                    ]
                },
                {
                    id: 'elite',
                    name: 'Elite',
                    frequency: '6 sessions / week',
                    monthlyPrice: 499,
                    credits: 24,
                    features: [
                        'Tutor OS Access',
                        'AI Transcript + Summary',
                        'Confidence Tracking',
                        'Monthly Recurring Subscription',
                        'No Lock-in',
                        'Priority Support',
                        'Advanced Analytics'
                    ]
                }
            ]
        },
        UK: {
            currency: '£',
            name: 'United Kingdom (GBP) – GCSE/A-Level Mastery',
            target: 'KS3, GCSE, A-Level',
            plans: [
                {
                    id: 'foundation',
                    name: 'Foundation',
                    frequency: '2 sessions / week',
                    monthlyPrice: 149,
                    credits: 8,
                    features: [
                        'Tutor OS Access',
                        'AI Transcript + Summary',
                        'Confidence Tracking',
                        'Monthly Recurring Subscription',
                        'No Lock-in'
                    ]
                },
                {
                    id: 'mastery',
                    name: 'Mastery',
                    frequency: '4 sessions / week',
                    monthlyPrice: 249,
                    credits: 16,
                    features: [
                        'Tutor OS Access',
                        'AI Transcript + Summary',
                        'Confidence Tracking',
                        'Monthly Recurring Subscription',
                        'No Lock-in',
                        'Priority Support'
                    ]
                },
                {
                    id: 'elite',
                    name: 'Elite',
                    frequency: '6 sessions / week',
                    monthlyPrice: 375,
                    credits: 24,
                    features: [
                        'Tutor OS Access',
                        'AI Transcript + Summary',
                        'Confidence Tracking',
                        'Monthly Recurring Subscription',
                        'No Lock-in',
                        'Priority Support',
                        'Advanced Analytics'
                    ]
                }
            ]
        }
    };

    const currentConfig = pricingConfig[region];

    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-7xl mx-auto">
                {/* Region Toggle */}
                <div className="flex justify-center mb-16">
                    <div className="p-1 rounded-2xl bg-white/50 dark:bg-white/5 border border-border dark:border-white/10 backdrop-blur-md flex">
                        <button
                            onClick={() => setRegion('US')}
                            className={`px-8 py-3 rounded-xl font-bold transition-all ${region === 'US' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-primary'}`}
                        >
                            United States
                        </button>
                        <button
                            onClick={() => setRegion('UK')}
                            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${region === 'UK' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-primary'}`}
                        >
                            United Kingdom
                        </button>
                    </div>
                </div>

                {/* Region Header */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-deep-navy dark:text-white mb-2">{currentConfig.name}</h2>
                    <p className="text-text-secondary font-medium">Target: {currentConfig.target}</p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {currentConfig.plans.map((plan, idx) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -6 }}
                            className={`relative p-8 rounded-4xl bg-white/60 dark:bg-white/5 border backdrop-blur-3xl shadow-sm hover:shadow-2xl transition-all flex flex-col ${plan.id === 'mastery' ? 'border-primary border-2 ring-4 ring-blue-500/10' : 'border-border dark:border-white/10'}`}
                        >
                            {plan.id === 'mastery' && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                    <Star size={12} fill="white" /> RECOMMENDED
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-deep-navy dark:text-white mb-2">{plan.name}</h3>
                                <p className="text-sm font-medium text-text-secondary mb-6">{plan.frequency}</p>

                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-extrabold text-deep-navy dark:text-white">{currentConfig.currency}{plan.monthlyPrice}</span>
                                    <span className="text-text-secondary font-medium">/ month</span>
                                </div>

                                <div className="p-3 rounded-xl bg-ice-blue dark:bg-blue-900/10 border border-powder-blue dark:border-blue-800/20">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-sapphire">Monthly Credits</span>
                                        <div className="text-right">
                                            <div className="text-lg font-black text-deep-navy dark:text-white">{plan.credits}<span className="text-xs"> sessions</span></div>
                                            <div className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">30-min sprints</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex gap-3 text-(--color-text-primary) dark:text-slate-300 text-sm font-medium leading-tight">
                                        <div className="shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <div className="space-y-3 pt-6 border-t border-border dark:border-white/5">
                                <button
                                    onClick={() => handlePlanClick(plan.id, region)}
                                    className={`w-full py-4 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 ${plan.id === 'mastery' ? 'bg-primary text-white shadow-lg shadow-blue-500/30 hover:bg-sapphire' : 'bg-ice-blue dark:bg-white/5 text-primary hover:bg-powder-blue'}`}
                                >
                                    Choose Plan
                                    <ArrowRight size={18} />
                                </button>
                                <Link_Next
                                    href={user ? '/students/dashboard' : '/signup?type=assessment'}
                                    className="w-full py-3 text-sm font-bold text-text-secondary hover:text-primary text-center transition-colors"
                                >
                                    Book Free Assessment
                                </Link_Next>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Section 3: ValueComparison ---
const ValueComparison = () => {
    const features = [
        { name: 'Free Assessment', foundations: true, core: true, advanced: true },
        { name: 'Personalized Plan', foundations: true, core: true, advanced: true },
        { name: 'Live Sessions', foundations: '1–2/wk', core: '2–3/wk', advanced: '3–5/wk' },
        { name: 'Progress Dashboard', foundations: 'Basic', core: 'Detailed', advanced: 'Advanced' },
        { name: 'Parent Updates', foundations: 'Monthly', core: 'Bi-weekly', advanced: 'Weekly' },
        { name: 'Mastery Roadmap', foundations: false, core: true, advanced: true },
        { name: 'Curriculum Alignment', foundations: 'Standard', core: 'Matched', advanced: 'Custom' }
    ];

    return (
        <section className="py-24 px-6 bg-surface dark:bg-[#000926]/40 border-y border-border dark:border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-deep-navy dark:text-white mb-4">Value Comparison</h2>
                    <p className="text-text-secondary font-medium">Compare plans across key features and learning outcomes.</p>
                </div>

                <div className="overflow-x-auto rounded-4xl border border-border dark:border-white/10 shadow-sm bg-white/40 dark:bg-white/5 backdrop-blur-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-ice-blue dark:bg-white/5 border-b border-border dark:border-white/10">
                                <th className="p-6 font-bold text-deep-navy dark:text-white">Feature</th>
                                <th className="p-6 font-bold text-deep-navy dark:text-white text-center">Foundations</th>
                                <th className="p-6 font-bold text-primary text-center bg-blue-50/30 dark:bg-blue-900/10">Core Mastery</th>
                                <th className="p-6 font-bold text-deep-navy dark:text-white text-center">Advanced Growth</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border dark:divide-white/5">
                            {features.map((feat, idx) => (
                                <tr key={idx} className="hover:bg-white/50 dark:hover:bg-white/2 transition-colors">
                                    <td className="p-6 font-bold text-sm text-(--color-text-primary) dark:text-slate-300">{feat.name}</td>
                                    <td className="p-6 text-center text-sm font-medium">
                                        {typeof feat.foundations === 'boolean' ? (feat.foundations ? <Check size={18} className="mx-auto text-green-500" /> : '-') : feat.foundations}
                                    </td>
                                    <td className="p-6 text-center text-sm font-bold bg-blue-50/10 dark:bg-blue-900/5 text-primary">
                                        {typeof feat.core === 'boolean' ? (feat.core ? <Check size={18} className="mx-auto text-green-500" /> : '-') : feat.core}
                                    </td>
                                    <td className="p-6 text-center text-sm font-medium">
                                        {typeof feat.advanced === 'boolean' ? (feat.advanced ? <Check size={18} className="mx-auto text-green-500" /> : '-') : feat.advanced}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

// --- Section 4: pricingFAQ ---
const PricingFAQ = () => {
    const faqs = [
        {
            q: "Why show “Starting at” prices?",
            a: "Every child is different. Final pricing follows a free assessment where we determine the frequency and depth of support needed."
        },
        {
            q: "Can I switch plans?",
            a: "Yes, you can upgrade, downgrade, or pause your plan at any time. We are flexible to your child's schedule."
        },
        {
            q: "Do you align with my school curriculum?",
            a: "Yes. Our systems are built to map directly to major global frameworks including IB, GCSE, and US Common Core."
        },
        {
            q: "Is the yearly plan refundable?",
            a: "We offer a 30-day satisfaction guarantee on yearly plans. After that, terms apply based on your specific enrollment agreement."
        }
    ];

    const [openIdx, setOpenIdx] = useState<number | null>(0);

    return (
        <section className="py-24 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-deep-navy dark:text-white mb-4">Billing Questions</h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border border-border dark:border-white/10 rounded-2xl bg-white/50 dark:bg-white/5 overflow-hidden">
                            <button
                                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                                className="w-full p-6 text-left flex justify-between items-center gap-4"
                            >
                                <span className="font-bold text-deep-navy dark:text-white">{faq.q}</span>
                                <ChevronDown size={20} className={`text-text-secondary transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
                            </button>
                            {openIdx === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="px-6 pb-6 text-sm text-text-secondary dark:text-slate-400 font-medium leading-relaxed"
                                >
                                    {faq.a}
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Section 5: StickyPricingCTA ---
const StickyPricingCTA = () => {
    return (
        <section className="py-20 px-6 text-center dark:bg-[#000926] transition-colors relative">
            <div className="max-w-4xl mx-auto">
                <div className="p-12 rounded-[3rem] bg-linear-to-r from-primary to-sapphire text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Not sure which plan is right?</h2>
                        <p className="text-lg text-blue-100 mb-10 opacity-90 font-medium">Get a complete diagnostic report and a tailored recommendation from our academic experts.</p>
                        <Link_Next
                            href="/signup?type=assessment"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary font-black text-xl rounded-full hover:scale-105 hover:shadow-xl transition-all"
                        >
                            Book Free Learning Assessment
                            <ArrowRight size={24} />
                        </Link_Next>
                    </div>
                    {/* Abstract circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl -ml-24 -mb-24" />
                </div>
            </div>
        </section>
    );
};

// --- Main Pricing Page Component ---
export default function PricingPage() {
    return (
        <main className="bg-background">
            <HeroPricing />
            <PricingPlans />
            <ValueComparison />
            <PricingFAQ />
            <StickyPricingCTA />
        </main>
    );
}
