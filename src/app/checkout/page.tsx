'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, ShieldCheck, Zap, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link_Next from 'next/link';
import { useAuthContext } from '@/app/context/AuthContext';
import { loadRazorpay } from '@/app/lib/razorpay';
import api from '@/app/lib/api';

type PaymentState = 'initial' | 'loading' | 'processing' | 'success' | 'cancelled' | 'error';

// Component wrapper to use useSearchParams
const CheckoutContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuthContext();
    const plan = searchParams.get('plan') || 'FOUNDATION';
    const region = searchParams.get('region') || 'US';

    const [paymentState, setPaymentState] = useState<PaymentState>('initial');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [orderDetails, setOrderDetails] = useState<any>(null);

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
            <div className="min-h-screen pt-32 pb-24 px-6 bg-linear-to-b from-ice-blue to-background flex items-center justify-center">
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
                router.push('/students/dashboard?payment=success');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [paymentState, router]);

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
                US: 'us-foundation-package-id', 
                UK: 'uk-foundation-package-id' 
            },
            'MASTERY': { 
                US: 'us-mastery-package-id', 
                UK: 'uk-mastery-package-id' 
            },
            'ELITE': { 
                US: 'us-elite-package-id', 
                UK: 'uk-elite-package-id' 
            }
        };
        return packageIds[planName]?.[regionCode] || 'us-foundation-package-id';
    };

    // Regional pricing configuration
    const pricingConfig = {
        US: {
            currency: '$',
            plans: {
                'FOUNDATION': { monthlyPrice: 199, credits: 8 },
                'MASTERY': { monthlyPrice: 349, credits: 16 },
                'ELITE': { monthlyPrice: 499, credits: 24 }
            }
        },
        UK: {
            currency: '£',
            plans: {
                'FOUNDATION': { monthlyPrice: 149, credits: 8 },
                'MASTERY': { monthlyPrice: 249, credits: 16 },
                'ELITE': { monthlyPrice: 375, credits: 24 }
            }
        }
    };

    const currentConfig = pricingConfig[region as keyof typeof pricingConfig];
    const planConfig = currentConfig.plans[plan as keyof typeof currentConfig.plans];
    const currentPrice = planConfig?.monthlyPrice || 199;
    const currentCredits = planConfig?.credits || 8;

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-linear-to-b from-ice-blue to-background">
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
                    className="p-8 md:p-12 rounded-[2.5rem] bg-white dark:bg-white/5 border border-border dark:border-white/10 shadow-2xl backdrop-blur-3xl relative overflow-hidden"
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
                                <p>Secure payment powered by Razorpay. Your card details are encrypted and never stored on our servers. You get {currentCredits} monthly credits for 30-minute tutoring sessions.</p>
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
                                <p className="text-sm text-text-secondary">Redirecting to dashboard...</p>
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
