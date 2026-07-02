'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ShieldCheck, Zap, Star, Layout, HelpCircle, ChevronDown, CheckCircle, Loader2, X } from 'lucide-react';
import Link_Next from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import StickyCTA from '../components/subjects/StickyCTA';
import { useCurriculum } from '../context/CurriculumContext';
import { CURRICULA } from '../config/curricula';
import { useIsAppShell } from '@/app/Hooks/useIsAppShell';
import api from '@/app/lib/api';

// --- Section 1: HeroPricing ---
const HeroPricing = () => {
    return (
        <section className="pt-32 pb-20 px-6 relative overflow-hidden bg-linear-to-b from-ice-blue to-background dark:from-slate-900/50 dark:to-background">
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
                            Book Free Session
                        </Link_Next>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// --- Section 2: TestPrepLeadForm ---
const TestPrepLeadForm = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', target_test: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await api.post('/leads/test-prep', formData);
            setStatus('success');
            setFormData({ name: '', phone: '', email: '', target_test: '' });
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-w-2xl mx-auto rounded-4xl bg-gradient-to-br from-white via-blue-50 to-white dark:from-slate-900 dark:via-blue-900/20 dark:to-slate-900 border-2 border-primary/40 backdrop-blur-3xl shadow-[0_0_50px_-12px_rgba(37,99,235,0.6)] overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 skew-x-12"></div>
            <div className="relative p-8">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">Custom Test Prep Plans</h3>
                    <p className="text-text-secondary font-medium">Classes starting at $20/hour. Let us know your goals and we'll craft the perfect plan.</p>
                </div>

            {status === 'success' ? (
                <div className="p-6 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4 text-green-600">
                        <Check size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-green-800 dark:text-green-300 mb-2">Thank you!</h4>
                    <p className="text-green-700 dark:text-green-400">We've received your request and an expert mentor will contact you shortly.</p>
                    <button onClick={() => setStatus('idle')} className="mt-6 px-6 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors">Submit Another</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-deep-navy dark:text-white mb-1">Full Name</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl bg-white dark:bg-[#000926] border border-border dark:border-white/10 focus:ring-2 focus:ring-primary outline-hidden transition-all text-deep-navy dark:text-white" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-deep-navy dark:text-white mb-1">Phone Number</label>
                            <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 rounded-xl bg-white dark:bg-[#000926] border border-border dark:border-white/10 focus:ring-2 focus:ring-primary outline-hidden transition-all text-deep-navy dark:text-white" placeholder="+1 (555) 000-0000" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-deep-navy dark:text-white mb-1">Email Address</label>
                        <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 rounded-xl bg-white dark:bg-[#000926] border border-border dark:border-white/10 focus:ring-2 focus:ring-primary outline-hidden transition-all text-deep-navy dark:text-white" placeholder="john@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-deep-navy dark:text-white mb-1">Target Test</label>
                        <select required value={formData.target_test} onChange={e => setFormData({...formData, target_test: e.target.value})} className="w-full p-3 rounded-xl bg-white dark:bg-[#000926] border border-border dark:border-white/10 focus:ring-2 focus:ring-primary outline-hidden transition-all text-deep-navy dark:text-white">
                            <option value="">Select a test</option>
                            <option value="SAT">SAT</option>
                            <option value="ACT">ACT</option>
                            <option value="AP">AP</option>
                            <option value="Other">Other / Unsure</option>
                        </select>
                    </div>
                    {status === 'error' && (
                        <p className="text-red-500 text-sm font-medium">Failed to submit. Please try again.</p>
                    )}
                    <button disabled={status === 'loading'} type="submit" className="w-full py-4 rounded-xl font-bold bg-primary text-white hover:bg-sapphire transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
                        {status === 'loading' ? 'Submitting...' : 'Request Custom Plan'}
                        {status !== 'loading' && <ArrowRight size={18} />}
                    </button>
                </form>
            )}
            </div>
        </motion.div>
    );
};

// --- Section 3: PricingPlans ---
const PricingPlans = () => {
    const { user } = useAuthContext();
    const router = useRouter();
    const isAppShell = useIsAppShell();
    const { activeCurriculum, setCurriculum } = useCurriculum();
    const [dynamicPackages, setDynamicPackages] = useState<any[]>([]);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [leadData, setLeadData] = useState({ name: '', email: '', phone: '', target_test: '' });
    const [leadStatus, setLeadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [selectedTestPlan, setSelectedTestPlan] = useState('');

    React.useEffect(() => {
        api.get('/packages')
            .then(res => setDynamicPackages(res.data))
            .catch(err => console.error('Failed to fetch packages:', err));
    }, []);

    const packageIds: Record<string, Record<string, string>> = {
        'foundation': { 
            global: '47a32d16-64e0-4965-983b-3d0b84f331ad',
            uk: 'f47385ef-963d-4299-bb6e-2f54297a73e3',
            middleeast: 'da36d75d-8e6d-4786-9a25-9de7890f5d5e',
            australia: 'e1f22d16-64e0-4965-983b-3d0b84f331b0',
            singapore: 'c1d22d16-64e0-4965-983b-3d0b84f331b3',
            southafrica: '6a7b2d16-64e0-4965-983b-3d0b84f331b6'
        },
        'mastery': { 
            global: '9b8c2d16-64e0-4965-983b-3d0b84f331ae',
            uk: '76fb2bd0-96f3-47ad-9a00-50284b7f4337',
            middleeast: '8d89045b-3814-4632-95f7-873b8852e690',
            australia: 'f2a32d16-64e0-4965-983b-3d0b84f331b1',
            singapore: 'd2e32d16-64e0-4965-983b-3d0b84f331b4',
            southafrica: '7b8c2d16-64e0-4965-983b-3d0b84f331b7'
        },
        'elite': { 
            global: 'b3d42d16-64e0-4965-983b-3d0b84f331af',
            uk: '6f48a101-3820-4180-8b1e-25ba3194a0d9',
            middleeast: '5952f418-477c-4749-8086-5389476b7bd1',
            australia: 'a3b42d16-64e0-4965-983b-3d0b84f331b2',
            singapore: 'e3f42d16-64e0-4965-983b-3d0b84f331b5',
            southafrica: '8c9d2d16-64e0-4965-983b-3d0b84f331b8'
        }
    };

    const handlePlanClick = (planId: string, regionCode: string) => {
        if (regionCode === 'test-prep') {
            setSelectedTestPlan(planId);
            setIsLeadModalOpen(true);
            return;
        }

        if (!user) {
            const checkoutUrl = `/checkout?plan=${planId.toUpperCase()}&region=${regionCode}`;
            router.push(`/login?redirect_url=${encodeURIComponent(checkoutUrl)}`);
        } else {
            router.push(`/checkout?plan=${planId.toUpperCase()}&region=${regionCode}`);
        }
    };

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLeadStatus('loading');
        try {
            await api.post('/leads/test-prep', {
                name: leadData.name,
                email: leadData.email,
                phone: leadData.phone,
                target_test: leadData.target_test || selectedTestPlan.toUpperCase()
            });
            setLeadStatus('success');
            setTimeout(() => {
                setIsLeadModalOpen(false);
                setLeadStatus('idle');
                setLeadData({ name: '', email: '', phone: '', target_test: '' });
            }, 3000);
        } catch (error) {
            console.error('Failed to submit lead', error);
            setLeadStatus('error');
        }
    };

    // Refined pricing configuration mapping
    const pricingConfig: Record<string, any> = {
        global: {
            currency: '$',
            name: 'Global – International Curriculum Mastery',
            target: 'IB, IGCSE, A-Levels, SAT, AP',
            plans: [
                { id: 'foundation', name: 'Foundation', frequency: '2 sessions / week', monthlyPrice: 149, credits: 8, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in'] },
                { id: 'mastery', name: 'Mastery', frequency: '4 sessions / week', monthlyPrice: 249, credits: 16, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in', 'Priority Support'] },
                { id: 'elite', name: 'Elite', frequency: '6 sessions / week', monthlyPrice: 375, credits: 25, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in', 'Priority Support', 'Advanced Analytics'] }
            ]
        },
        uk: {
            currency: '£',
            name: 'United Kingdom – GCSE/A-Level Mastery',
            target: 'KS3, GCSE, A-Level',
            plans: [
                { id: 'foundation', name: 'Foundation', frequency: '2 sessions / week', monthlyPrice: 149, credits: 8, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in'] },
                { id: 'mastery', name: 'Mastery', frequency: '4 sessions / week', monthlyPrice: 249, credits: 16, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in', 'Priority Support'] },
                { id: 'elite', name: 'Elite', frequency: '6 sessions / week', monthlyPrice: 375, credits: 25, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in', 'Priority Support', 'Advanced Analytics'] }
            ]
        },
        australia: {
            currency: 'A$',
            name: 'Australia – NAPLAN/ATAR Mastery',
            target: 'Year 1–12, NAPLAN, VCE/HSC/ATAR',
            plans: [
                { id: 'foundation', name: 'Foundation', frequency: '2 sessions / week', monthlyPrice: 250, credits: 8, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in'] },
                { id: 'mastery', name: 'Mastery', frequency: '4 sessions / week', monthlyPrice: 450, credits: 16, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in', 'Priority Support'] },
                { id: 'elite', name: 'Elite', frequency: '6 sessions / week', monthlyPrice: 650, credits: 25, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in', 'Priority Support', 'Advanced Analytics'] }
            ]
        },
        singapore: {
            currency: 'S$',
            name: 'Singapore – PSLE/O-Level Mastery',
            target: 'P1–P6, S1–S5, PSLE, O-Level',
            plans: [
                { id: 'foundation', name: 'Foundation', frequency: '2 sessions / week', monthlyPrice: 280, credits: 8, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in'] },
                { id: 'mastery', name: 'Mastery', frequency: '4 sessions / week', monthlyPrice: 520, credits: 16, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in', 'Priority Support'] },
                { id: 'elite', name: 'Elite', frequency: '6 sessions / week', monthlyPrice: 750, credits: 25, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in', 'Priority Support', 'Advanced Analytics'] }
            ]
        },
        middleeast: {
            currency: '$',
            name: 'UAE / GCC – Global Curriculum Mastery',
            target: 'IB, IGCSE, British, American',
            plans: [
                { id: 'foundation', name: 'Foundation', frequency: '2 sessions / week', monthlyPrice: 199, credits: 8, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in'] },
                { id: 'mastery', name: 'Mastery', frequency: '4 sessions / week', monthlyPrice: 349, credits: 16, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in', 'Priority Support'] },
                { id: 'elite', name: 'Elite', frequency: '6 sessions / week', monthlyPrice: 499, credits: 25, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in', 'Priority Support', 'Advanced Analytics'] }
            ]
        },
        southafrica: {
            currency: 'R',
            name: 'South Africa – CAPS/IEB Mastery',
            target: 'Grade R–12, Matric, NSC',
            plans: [
                { id: 'foundation', name: 'Foundation', frequency: '2 sessions / week', monthlyPrice: 1500, credits: 8, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in'] },
                { id: 'mastery', name: 'Mastery', frequency: '4 sessions / week', monthlyPrice: 2800, credits: 16, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in', 'Priority Support'] },
                { id: 'elite', name: 'Elite', frequency: '6 sessions / week', monthlyPrice: 4200, credits: 25, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in', 'Priority Support', 'Advanced Analytics'] }
            ]
        },
        us: {
            currency: '$',
            name: 'United States – SAT/AP Mastery',
            target: 'Grade K–12, SAT, ACT, AP',
            plans: [
                { id: 'foundation', name: 'Foundation', frequency: '2 sessions / week', monthlyPrice: 149, credits: 8, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in'] },
                { id: 'mastery', name: 'Mastery', frequency: '4 sessions / week', monthlyPrice: 249, credits: 16, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in', 'Priority Support'] },
                { id: 'elite', name: 'Elite', frequency: '6 sessions / week', monthlyPrice: 375, credits: 25, features: ['Tutor OS Access', 'AI Transcript + Summary', 'Confidence Tracking', 'Monthly Subscription', 'No Lock-in', 'Priority Support', 'Advanced Analytics'] }
            ]
        },
        'test-prep': {
            currency: '$',
            name: 'Elite Test Preparation',
            target: 'SAT, ACT, AP, UCAT, BMAT',
            plans: [
                { id: 'foundation', name: 'Test Prep Starter', frequency: '12 Hours Package', monthlyPrice: 240, credits: 12, features: ['Diagnostic Assessment', 'Targeted Score Tracking', 'Practice Exams', 'Flexible Scheduling', 'No Lock-in'] },
                { id: 'mastery', name: 'Test Prep Intensive', frequency: '24 Hours Package', monthlyPrice: 480, credits: 24, features: ['Diagnostic Assessment', 'Targeted Score Tracking', 'Practice Exams', 'Flexible Scheduling', 'No Lock-in', 'Priority Support'] },
                { id: 'elite', name: 'Test Prep Elite', frequency: '40 Hours Package', monthlyPrice: 800, credits: 40, features: ['Diagnostic Assessment', 'Targeted Score Tracking', 'Practice Exams', 'Flexible Scheduling', 'No Lock-in', 'Priority Support', 'University Counseling'] }
            ]
        }
    };

    // Helper to merge dynamic prices into config
    const getDynamicPrice = (region: string, planId: string, fallback: number) => {
        // Fallback to global for 'us' since US uses global pricing
        const effectiveRegion = region === 'us' ? 'global' : region;
        const uuid = packageIds[planId]?.[effectiveRegion];
        if (!uuid) return fallback;
        
        const pkg = dynamicPackages.find(p => p.id === uuid);
        if (pkg && pkg.price_cents) {
            return pkg.price_cents / 100;
        }
        return fallback;
    };

    const currentConfigRaw = pricingConfig[activeCurriculum.id] || pricingConfig['global'];
    const currentConfig = {
        ...currentConfigRaw,
        plans: currentConfigRaw.plans.map((p: any) => ({
            ...p,
            monthlyPrice: getDynamicPrice(activeCurriculum.id, p.id, p.monthlyPrice)
        }))
    };

    // ---- App-shell (desktop) native plans view ----
    if (isAppShell) {
        return (
            <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold tracking-tight text-white">Plans</h1>
                    <p className="mt-1 max-w-xl text-sm text-white/45">
                        Personalized tutoring built around your child&apos;s needs. Final pricing
                        follows a free academic assessment — cancel anytime, no lock-in.
                    </p>
                </div>

                {/* Region / curriculum selector */}
                <div className="mb-5 flex flex-wrap gap-1.5">
                    {CURRICULA.map((c) => {
                        const active = activeCurriculum.id === c.id;
                        return (
                            <button
                                key={c.id}
                                onClick={() => setCurriculum(c.id)}
                                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${
                                    active
                                        ? 'bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/40'
                                        : 'bg-white/5 text-white/55 ring-1 ring-white/10 hover:bg-white/10 hover:text-white/80'
                                }`}
                            >
                                <span>{c.flag}</span>
                                {c.country}
                            </button>
                        );
                    })}
                </div>

                {/* Region name + exams */}
                <div className="mb-6">
                    <h2 className="text-sm font-bold text-white/80">{currentConfig.name}</h2>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {activeCurriculum.exams.map((exam) => (
                            <span
                                key={exam}
                                className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white/50"
                            >
                                {exam}
                            </span>
                        ))}
                    </div>
                </div>

                {activeCurriculum.id === 'test-prep' ? (
                    <TestPrepLeadForm />
                ) : (
                    <div className="grid gap-4 md:grid-cols-3">
                        {currentConfig.plans.map((plan: any) => {
                            const recommended = plan.id === 'mastery';
                            return (
                                <div
                                    key={plan.id}
                                    className={`relative flex flex-col rounded-2xl border bg-[#15131f] p-6 ${
                                        recommended ? 'border-indigo-400/50 ring-1 ring-indigo-500/20' : 'border-white/10'
                                    }`}
                                >
                                    {recommended && (
                                        <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-indigo-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                                            <Star size={10} fill="white" /> Recommended
                                        </span>
                                    )}
                                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                                    <p className="text-xs text-white/45">{plan.frequency}</p>

                                    <div className="mt-4 flex items-baseline gap-1">
                                        <span className="text-3xl font-extrabold text-white">
                                            {currentConfig.currency}{plan.monthlyPrice}
                                        </span>
                                        <span className="text-sm text-white/45">/ month</span>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                                        <span className="text-xs font-bold text-indigo-300">Monthly credits</span>
                                        <span className="text-sm font-black text-white">
                                            {plan.credits}
                                            <span className="text-[10px] font-medium text-white/45"> sessions</span>
                                        </span>
                                    </div>

                                    <ul className="mt-5 flex-1 space-y-2.5">
                                        {plan.features.map((feat: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-white/75">
                                                <Check size={14} strokeWidth={3} className="mt-0.5 shrink-0 text-indigo-300" />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => handlePlanClick(plan.id, activeCurriculum.id)}
                                        className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-opacity hover:opacity-90 ${
                                            recommended
                                                ? 'bg-indigo-500 text-white'
                                                : 'bg-white/[0.06] text-indigo-200 ring-1 ring-white/10'
                                        }`}
                                    >
                                        Choose {plan.name}
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-7xl mx-auto">
                {/* Subject Tape - New dynamic row */}
                <div className="mb-20 flex flex-wrap justify-center gap-2">
                    {activeCurriculum.subjects.map((sub, i) => (
                        <span 
                            key={sub}
                            className="px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-text-secondary animate-in fade-in slide-in-from-bottom-2"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            {sub}
                        </span>
                    ))}
                    {activeCurriculum.subjectNote && (
                        <div className="w-full text-center mt-3 text-[10px] uppercase tracking-widest font-bold text-primary opacity-70">
                            {activeCurriculum.subjectNote}
                        </div>
                    )}
                </div>

                {/* Region Toggle - Now using Global Context */}
                <div className="flex justify-center mb-16">
                    <div className="p-1.5 rounded-2xl bg-white/50 dark:bg-white/5 border border-border dark:border-white/10 backdrop-blur-md flex flex-wrap justify-center gap-1">
                        {CURRICULA.map((c) => {
                            const isTestPrep = c.id === 'test-prep';
                            const isActive = activeCurriculum.id === c.id;

                            return (
                                <button
                                    key={c.id}
                                    onClick={() => setCurriculum(c.id)}
                                    className={`px-5 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm flex items-center gap-2 relative overflow-hidden group ${
                                        isActive 
                                            ? 'bg-primary text-white shadow-lg scale-105' 
                                            : isTestPrep
                                                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] hover:scale-105 animate-[pulse_3s_ease-in-out_infinite]'
                                                : 'text-text-secondary hover:text-primary hover:bg-slate-100 dark:hover:bg-white/5'
                                    }`}
                                >
                                    {isTestPrep && !isActive && (
                                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    )}
                                    <span className="relative z-10">{c.flag}</span>
                                    <span className={`relative z-10 ${isActive ? 'block' : 'hidden md:block'}`}>
                                        {c.country} {isTestPrep && !isActive && '✨'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Region Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-deep-navy dark:text-white mb-2">{currentConfig.name}</h2>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {activeCurriculum.exams.map(exam => (
                            <span key={exam} className="px-3 py-1 rounded-lg bg-sapphire text-white text-[10px] font-black tracking-widest uppercase">
                                {exam}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Pricing Cards or Lead Form */}
                {activeCurriculum.id === 'test-prep' ? (
                    <TestPrepLeadForm />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                        {currentConfig.plans.map((plan: any, idx: number) => (
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
                                    {plan.features.map((feat: string, i: number) => (
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
                                        onClick={() => handlePlanClick(plan.id, activeCurriculum.id)}
                                        className={`w-full py-4 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 ${plan.id === 'mastery' ? 'bg-primary text-white shadow-lg shadow-blue-500/30 hover:bg-sapphire' : 'bg-ice-blue dark:bg-white/5 text-primary hover:bg-powder-blue'}`}
                                    >
                                        Choose Plan
                                        <ArrowRight size={18} />
                                    </button>
                                    <Link_Next
                                        href={user ? '/students/dashboard' : '/signup?type=assessment'}
                                        className="w-full py-3 text-sm font-bold text-text-secondary hover:text-primary text-center transition-colors"
                                    >
                                        Book Free Session
                                    </Link_Next>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lead Modal */}
            <AnimatePresence>
                {isLeadModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden border border-slate-200 dark:border-slate-800"
                        >
                            <button
                                onClick={() => setIsLeadModalOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {leadStatus === 'success' ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Request Received!</h3>
                                    <p className="text-slate-600 dark:text-slate-300">
                                        One of our expert counselors will contact you shortly to discuss your custom Test Prep plan.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Talk to a Counselor</h3>
                                    <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm">
                                        Leave your details and our academic experts will reach out to craft your perfect {selectedTestPlan ? selectedTestPlan.charAt(0).toUpperCase() + selectedTestPlan.slice(1) : ''} preparation plan.
                                    </p>

                                    <form onSubmit={handleLeadSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={leadData.name}
                                                onChange={e => setLeadData({ ...leadData, name: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                value={leadData.email}
                                                onChange={e => setLeadData({ ...leadData, email: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                required
                                                value={leadData.phone}
                                                onChange={e => setLeadData({ ...leadData, phone: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Target Exam (Optional)</label>
                                            <input
                                                type="text"
                                                value={leadData.target_test}
                                                onChange={e => setLeadData({ ...leadData, target_test: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                placeholder="e.g. SAT, UCAT, AP Calculus"
                                            />
                                        </div>

                                        {leadStatus === 'error' && (
                                            <p className="text-red-500 text-sm mt-2 font-medium">Something went wrong. Please try again.</p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={leadStatus === 'loading'}
                                            className="w-full py-4 mt-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-sapphire transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 disabled:opacity-70"
                                        >
                                            {leadStatus === 'loading' ? (
                                                <><Loader2 className="animate-spin" size={20} /> Sending...</>
                                            ) : (
                                                'Request Consultation'
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

// --- Section 3: ValueComparison ---
const ValueComparison = () => {
    const features = [
        { name: 'Free Assessment', foundation: true, mastery: true, elite: true },
        { name: 'Personalized Plan', foundation: true, mastery: true, elite: true },
        { name: 'Live Sessions', foundation: '2/wk', mastery: '4/wk', elite: '6/wk' },
        { name: 'Progress Dashboard', foundation: 'Basic', mastery: 'Detailed', elite: 'Advanced' },
        { name: 'Parent Updates', foundation: 'Monthly', mastery: 'Bi-weekly', elite: 'Weekly' },
        { name: 'Priority Support', foundation: false, mastery: true, elite: true },
        { name: 'Advanced Analytics', foundation: false, mastery: false, elite: true },
        { name: 'Curriculum Alignment', foundation: 'Standard', mastery: 'Matched', elite: 'Custom' }
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
                                <th className="p-6 font-bold text-deep-navy dark:text-white text-center">Foundation</th>
                                <th className="p-6 font-bold text-primary text-center bg-blue-50/30 dark:bg-blue-900/10">Mastery</th>
                                <th className="p-6 font-bold text-deep-navy dark:text-white text-center">Elite</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border dark:divide-white/5">
                            {features.map((feat, idx) => (
                                <tr key={idx} className="hover:bg-white/50 dark:hover:bg-white/2 transition-colors">
                                    <td className="p-6 font-bold text-sm text-(--color-text-primary) dark:text-slate-300">{feat.name}</td>
                                    <td className="p-6 text-center text-sm font-medium">
                                        {typeof feat.foundation === 'boolean' ? (feat.foundation ? <Check size={18} className="mx-auto text-green-500" /> : '-') : feat.foundation}
                                    </td>
                                    <td className="p-6 text-center text-sm font-bold bg-blue-50/10 dark:bg-blue-900/5 text-primary">
                                        {typeof feat.mastery === 'boolean' ? (feat.mastery ? <Check size={18} className="mx-auto text-green-500" /> : '-') : feat.mastery}
                                    </td>
                                    <td className="p-6 text-center text-sm font-medium">
                                        {typeof feat.elite === 'boolean' ? (feat.elite ? <Check size={18} className="mx-auto text-green-500" /> : '-') : feat.elite}
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
                            Book Free Session
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
    const isAppShell = useIsAppShell();

    // In the desktop app, drop the marketing chrome (hero, comparison, FAQ, sticky
    // CTA + out-of-app links) and show a clean, app-native plans view. PricingPlans
    // renders its own dark app-shell layout when isAppShell. Web is unchanged.
    if (isAppShell) {
        return (
            <main className="min-h-full bg-[#0a0a0f]">
                <PricingPlans />
            </main>
        );
    }

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
