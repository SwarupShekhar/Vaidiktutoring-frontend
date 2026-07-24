'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, ShieldCheck, Zap, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link_Next from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/app/context/AuthContext';
import { loadRazorpay } from '@/app/lib/razorpay';
import { useIsAppShell } from '@/app/Hooks/useIsAppShell';
import api from '@/app/lib/api';

type PaymentState = 'initial' | 'loading' | 'processing' | 'success' | 'cancelled' | 'error';

// Component wrapper to use useSearchParams
const CheckoutContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user, loading: authLoading } = useAuthContext();
    const plan = searchParams.get('plan') || 'FOUNDATION';
    const region = (searchParams.get('region') || 'global').toLowerCase();

    const [paymentState, setPaymentState] = useState<PaymentState>('initial');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [enrollingStudentId, setEnrollingStudentId] = useState<string | null>(null);
    const [dynamicPrice, setDynamicPrice] = useState<number | null>(null);
    const [dynamicCurrency, setDynamicCurrency] = useState<string | null>(null);
    const [couponInput, setCouponInput] = useState<string>('');
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [couponDiscountAmount, setCouponDiscountAmount] = useState<number>(0);
    const [couponMsg, setCouponMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const isAppShell = useIsAppShell();
    // No marketing navbar in the desktop shell → collapse the top padding.
    const pageTopPad = isAppShell ? 'pt-6' : 'pt-32';

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const id = getPackageId(plan, region);
                const res = await api.get('/packages');
                const pkg = res.data.find((p: any) => p.id === id);
                if (pkg && pkg.price_cents) {
                    setDynamicPrice(pkg.price_cents / 100);
                    // Use a mapped symbol or default to what we have in pricingConfig
                    // but for safety we just use the config's currency symbol.
                }
            } catch (err) {
                console.error('Failed to fetch package price:', err);
            }
        };
        fetchPackage();
    }, [plan, region]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            const currentPath = `/checkout?plan=${plan}&region=${region}`;
            router.push(`/login?redirect_url=${encodeURIComponent(currentPath)}`);
        }
    }, [user, authLoading, router, plan, region]);

    // Show loading while checking auth
    if (authLoading || !user) {
        return (
            <div className={`min-h-screen ${pageTopPad} pb-24 px-6 bg-linear-to-b from-ice-blue to-background dark:from-slate-900/50 dark:to-background flex items-center justify-center`}>
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20" />
                    <p className="text-text-secondary font-medium">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    // Handle successful payment
    useEffect(() => {
        if (paymentState === 'success') {
            const timer = setTimeout(() => {
                if (enrollingStudentId) {
                    router.push(`/enroll/${enrollingStudentId}`);
                } else {
                    // Send parents back to the parent dashboard (not the student one).
                    const home = user?.role === 'parent' ? '/parent/dashboard' : '/students/dashboard';
                    router.push(`${home}?payment=success`);
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [paymentState, router, enrollingStudentId, user?.role]);

    const handlePayment = async () => {
        setPaymentState('loading');
        setErrorMessage('');

        try {
            // Step 1: Load Razorpay
            const loaded = await loadRazorpay();
            if (!loaded) {
                throw new Error('Payment system unavailable. Please try again.');
            }

            // Step 2: Create order on backend
            const response = await api.post('/payments/create-order', {
                packageId: getPackageId(plan, region),
                couponCode: appliedCoupon || undefined,
            });

            const { orderId, amount, currency, keyId } = response.data;
            setOrderDetails(response.data);

            // Step 3: Open Razorpay modal
            setPaymentState('processing');

            // Use window.Razorpay directly
            const rzp = new window.Razorpay({
                key: keyId,
                amount: amount,
                currency: currency,
                order_id: orderId,
                name: 'StudyHours',
                description: `${plan} Plan - ${region} Region`,
                image: 'https://studyhours.com/Studuhourslogo.svg',
                prefill: {
                    name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
                    email: user?.email || '',
                },
                theme: {
                    color: '#1A56A0',
                },
                handler: async (paymentResponse: any) => {
                    try {
                        // Step 4: Verify payment on backend
                        const verifyResponse = await api.post('/payments/verify', {
                            razorpayOrderId: paymentResponse.razorpay_order_id,
                            razorpayPaymentId: paymentResponse.razorpay_payment_id,
                            razorpaySignature: paymentResponse.razorpay_signature,
                        });

                        if (verifyResponse.data.success) {
                            if (verifyResponse.data.studentId) {
                                setEnrollingStudentId(verifyResponse.data.studentId);
                            }
                            // Upgrade changes plan/credits → bust the cached credit +
                            // dashboard data so the parent/student dashboards morph into
                            // their paid state immediately instead of lingering on trial.
                            ['credit-status', 'parent-dashboard-summary', 'student-dashboard-summary', 'parent-children-consent', 'student-profile'].forEach(
                                (key) => queryClient.invalidateQueries({ queryKey: [key] }),
                            );
                            setPaymentState('success');
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (verifyError: any) {
                        setPaymentState('error');
                        setErrorMessage(verifyError.response?.data?.message || 'Payment verification failed');
                    }
                },
                modal: {
                    ondismiss: () => {
                        setPaymentState('cancelled');
                    },
                },
            });

            rzp.open();

        } catch (error: any) {
            console.error('Payment error:', error);
            setPaymentState('error');
            setErrorMessage(error.response?.data?.message || error.message || 'Payment failed. Please try again.');
        }
    };

    const getPackageId = (planName: string, regionCode: string): string => {
        // Map plan names and regions to package IDs
        const packageIds: Record<string, Record<string, string>> = {
            'FOUNDATION': { 
                global: '47a32d16-64e0-4965-983b-3d0b84f331ad',
                uk: 'f47385ef-963d-4299-bb6e-2f54297a73e3',
                middleeast: 'da36d75d-8e6d-4786-9a25-9de7890f5d5e',
                australia: 'e1f22d16-64e0-4965-983b-3d0b84f331b0',
                singapore: 'c1d22d16-64e0-4965-983b-3d0b84f331b3',
                southafrica: '6a7b2d16-64e0-4965-983b-3d0b84f331b6'
            },
            'MASTERY': { 
                global: '9b8c2d16-64e0-4965-983b-3d0b84f331ae',
                uk: '76fb2bd0-96f3-47ad-9a00-50284b7f4337',
                middleeast: '8d89045b-3814-4632-95f7-873b8852e690',
                australia: 'f2a32d16-64e0-4965-983b-3d0b84f331b1',
                singapore: 'd2e32d16-64e0-4965-983b-3d0b84f331b4',
                southafrica: '7b8c2d16-64e0-4965-983b-3d0b84f331b7'
            },
            'ELITE': { 
                global: 'b3d42d16-64e0-4965-983b-3d0b84f331af',
                uk: '6f48a101-3820-4180-8b1e-25ba3194a0d9',
                middleeast: '5952f418-477c-4749-8086-5389476b7bd1',
                australia: 'a3b42d16-64e0-4965-983b-3d0b84f331b2',
                singapore: 'e3f42d16-64e0-4965-983b-3d0b84f331b5',
                southafrica: '8c9d2d16-64e0-4965-983b-3d0b84f331b8'
            }
        };
        
        let mappedRegion = regionCode;
        // If the specific region package doesn't exist, fall back to global for THAT plan
        if (!packageIds[planName]?.[mappedRegion]) {
            mappedRegion = 'global';
        }
        
        const selectedPackage = packageIds[planName]?.[mappedRegion];
        if (selectedPackage) return selectedPackage;
        
        // Ultimate fallback if planName itself is invalid
        return '47a32d16-64e0-4965-983b-3d0b84f331ad';
    };

    // Regional pricing configuration
    const pricingConfig: Record<string, any> = {
        global: {
            currency: '$',
            plans: {
                'FOUNDATION': { monthlyPrice: 149, credits: 8 },
                'MASTERY': { monthlyPrice: 249, credits: 16 },
                'ELITE': { monthlyPrice: 349, credits: 24 }
            }
        },
        uk: {
            currency: '£',
            plans: {
                'FOUNDATION': { monthlyPrice: 149, credits: 8 },
                'MASTERY': { monthlyPrice: 249, credits: 16 },
                'ELITE': { monthlyPrice: 349, credits: 24 }
            }
        },
        middleeast: {
            currency: '$',
            plans: {
                'FOUNDATION': { monthlyPrice: 199, credits: 8 },
                'MASTERY': { monthlyPrice: 349, credits: 16 },
                'ELITE': { monthlyPrice: 499, credits: 24 }
            }
        },
        australia: {
            currency: 'A$',
            plans: {
                'FOUNDATION': { monthlyPrice: 250, credits: 8 },
                'MASTERY': { monthlyPrice: 450, credits: 16 },
                'ELITE': { monthlyPrice: 650, credits: 24 }
            }
        },
        singapore: {
            currency: 'S$',
            plans: {
                'FOUNDATION': { monthlyPrice: 280, credits: 8 },
                'MASTERY': { monthlyPrice: 520, credits: 16 },
                'ELITE': { monthlyPrice: 750, credits: 24 }
            }
        },
        southafrica: {
            currency: 'R',
            plans: {
                'FOUNDATION': { monthlyPrice: 1500, credits: 8 },
                'MASTERY': { monthlyPrice: 2800, credits: 16 },
                'ELITE': { monthlyPrice: 4200, credits: 24 }
            }
        }
    };

    const currentConfig = pricingConfig[region] || pricingConfig['global'];
    const planConfig = currentConfig.plans[plan as keyof typeof currentConfig.plans];
    const basePrice = dynamicPrice !== null ? dynamicPrice : (planConfig?.monthlyPrice || 149);
    const currentCredits = planConfig?.credits || 8;

    const handleApplyCoupon = (codeToApply?: string) => {
        const code = (codeToApply || couponInput).trim().toUpperCase();
        if (!code) return;

        if (code === 'MOMENTUM7') {
            // Apply a 7% discount (which perfectly drops $375 to $349, and scales correctly for Australia/other regions)
            const discountPercentage = 0.07;
            const discount = Math.round(basePrice * discountPercentage);
            setCouponDiscountAmount(discount);
            setAppliedCoupon(code);
            setCouponMsg({ text: `Special Offer "${code}" applied! 7% Off.`, type: 'success' });
        } else {
            setCouponMsg({ text: `Invalid or expired promo code.`, type: 'error' });
        }
    };

    const currentPrice = Math.max(1, Math.round(basePrice - couponDiscountAmount));

    // ---- App-shell (desktop) native checkout ----
    if (isAppShell) {
        const prettyPlan = plan.charAt(0) + plan.slice(1).toLowerCase();
        return (
            <div className="mx-auto w-full max-w-lg px-4 py-6 md:px-6">
                <button
                    onClick={() => router.back()}
                    className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/60 transition-colors hover:text-white"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="rounded-2xl border border-white/10 bg-[#15131f] p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                            <CreditCard size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white">Confirm your plan</h1>
                            <p className="text-sm text-white/45">Review before payment.</p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-300">
                            Plan · {region}
                        </span>
                        <div className="mt-1 flex items-end justify-between">
                            <h2 className="text-lg font-black text-white">{prettyPlan}</h2>
                            <div className="text-right">
                                <div className="text-2xl font-black text-white">
                                    {currentConfig.currency}{currentPrice}
                                    <span className="text-xs text-white/45">/mo</span>
                                </div>
                                <div className="text-[11px] font-bold text-emerald-400">{currentCredits} monthly credits</div>
                            </div>
                        </div>
                    </div>

                    <p className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-200 ring-1 ring-emerald-400/20">
                        <ShieldCheck size={15} className="mt-0.5 shrink-0" />
                        Secure payment via Razorpay — card details are encrypted and never stored. Includes {currentCredits} monthly session credits.
                    </p>

                    <div className="mt-6">
                        {paymentState === 'initial' && (
                            <button
                                onClick={handlePayment}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
                            >
                                <CreditCard size={18} /> Pay {currentConfig.currency}{currentPrice}/mo
                            </button>
                        )}
                        {(paymentState === 'loading' || paymentState === 'processing') && (
                            <button disabled className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500/50 py-4 text-sm font-bold text-white">
                                <Loader2 size={18} className="animate-spin" />
                                {paymentState === 'loading' ? 'Preparing…' : 'Processing…'}
                            </button>
                        )}
                        {paymentState === 'success' && (
                            <div className="text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
                                    <CheckCircle size={28} className="text-emerald-400" />
                                </div>
                                <p className="mt-3 font-bold text-emerald-400">Payment successful!</p>
                                <p className="text-sm text-white/45">Taking you to your dashboard…</p>
                            </div>
                        )}
                        {(paymentState === 'cancelled' || paymentState === 'error') && (
                            <div className="space-y-3">
                                <p className={`rounded-xl p-3 text-sm ring-1 ${paymentState === 'error' ? 'bg-rose-500/10 text-rose-200 ring-rose-400/20' : 'bg-amber-500/10 text-amber-200 ring-amber-400/20'}`}>
                                    {paymentState === 'error' ? errorMessage || 'Payment failed. Please try again.' : 'Payment was cancelled.'}
                                </p>
                                <button
                                    onClick={() => setPaymentState('initial')}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
                                >
                                    <CreditCard size={18} /> Try again
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${pageTopPad} pb-24 px-6 bg-linear-to-b from-ice-blue to-background dark:from-slate-900/50 dark:to-background`}>
            <div className="max-w-xl mx-auto">
                <Link_Next
                    href={`/pricing?region=${region}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-primary transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    Back to Pricing
                </Link_Next>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 md:p-12 rounded-4xl bg-white dark:bg-white/5 border border-border dark:border-white/10 shadow-2xl backdrop-blur-3xl relative overflow-hidden"
                >
                    <div className="relative z-10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary mx-auto mb-8 shadow-sm">
                            <CreditCard size={32} />
                        </div>

                        <h1 className="text-3xl font-extrabold text-deep-navy dark:text-white mb-2">Confirm Your Plan</h1>
                        <p className="text-text-secondary font-medium mb-10">Review your selection before we finalize your assessment.</p>

                        <div className="space-y-4 mb-10 text-left">
                            <div className="p-5 rounded-2xl bg-ice-blue dark:bg-blue-900/10 border border-powder-blue dark:border-blue-800/20">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-black text-sapphire uppercase tracking-widest">Plan Selection</span>
                                    <span className="text-[10px] bg-white dark:bg-white/10 px-2 py-0.5 rounded-full font-bold">{region}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <h2 className="text-xl font-black text-deep-navy dark:text-white">{plan.charAt(0) + plan.slice(1).toLowerCase()}</h2>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-deep-navy dark:text-white">{currentConfig.currency}{currentPrice}<span className="text-xs">/mo</span></div>
                                        <div className="text-[10px] text-green-600 font-bold">{currentCredits} monthly credits</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 text-green-800 dark:text-green-200 text-xs font-medium leading-relaxed">
                                <CheckCircle size={16} className="shrink-0 mt-0.5" />
                                <p>Secure payment powered by Razorpay. Your card details are encrypted and never stored on our servers. You get {currentCredits} monthly credits for tutoring sessions.</p>
                            </div>

                            {/* Promo / Coupon Code Section */}
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-left">
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Have a Counselor / Promo Code?
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter code here"
                                        value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleApplyCoupon();
                                            }
                                        }}
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleApplyCoupon()}
                                        className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-sapphire transition-all shadow-md shrink-0"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {couponMsg && (
                                    <p className={`mt-2.5 text-xs font-bold flex items-center gap-1 ${couponMsg.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                        {couponMsg.type === 'success' ? '✓ ' : '✕ '}{couponMsg.text}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Payment States */}
                        {paymentState === 'initial' && (
                            <div className="space-y-4">
                                <button
                                    onClick={handlePayment}
                                    className="w-full py-5 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-sapphire transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                                >
                                    <CreditCard size={20} />
                                    Pay {currentConfig.currency}{currentPrice}/mo
                                </button>

                                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Zap size={10} className="text-sapphire" /> Secure payment with Razorpay
                                </p>
                            </div>
                        )}

                        {paymentState === 'loading' && (
                            <div className="space-y-4">
                                <button
                                    disabled
                                    className="w-full py-5 rounded-2xl bg-primary/50 text-white font-bold text-lg cursor-wait flex items-center justify-center gap-2"
                                >
                                    <Loader2 size={20} className="animate-spin" />
                                    Preparing Checkout...
                                </button>
                            </div>
                        )}

                        {paymentState === 'processing' && (
                            <div className="space-y-4">
                                <button
                                    disabled
                                    className="w-full py-5 rounded-2xl bg-primary/50 text-white font-bold text-lg cursor-wait flex items-center justify-center gap-2"
                                >
                                    <Loader2 size={20} className="animate-spin" />
                                    Processing Payment...
                                </button>
                            </div>
                        )}

                        {paymentState === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-4 text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                                    <CheckCircle size={32} className="text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-green-600">Payment Successful!</h3>
                                <p className="text-sm text-text-secondary">Redirecting to set up your schedule...</p>
                            </motion.div>
                        )}

                        {paymentState === 'cancelled' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 text-amber-800 dark:text-amber-200 text-sm">
                                    Payment was cancelled. Please try again.
                                </div>
                                <button
                                    onClick={() => setPaymentState('initial')}
                                    className="w-full py-5 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-sapphire transition-all flex items-center justify-center gap-2"
                                >
                                    <CreditCard size={20} />
                                    Try Again
                                </button>
                            </div>
                        )}

                        {paymentState === 'error' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 text-red-800 dark:text-red-200 text-sm">
                                    {errorMessage || 'Payment failed. Please try again.'}
                                </div>
                                <button
                                    onClick={() => setPaymentState('initial')}
                                    className="w-full py-5 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-sapphire transition-all flex items-center justify-center gap-2"
                                >
                                    <CreditCard size={20} />
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Decorative blobs */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl -mr-16 -mt-16" />
                </motion.div>

                <p className="mt-8 text-center text-xs text-text-secondary font-medium">
                    Need help? <Link_Next href="/contact" className="text-primary hover:underline">Contact academic support</Link_Next>
                </p>
            </div>
        </div>
    );
};

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
