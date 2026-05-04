'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import { useUser, useAuth } from '@clerk/nextjs';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import api from '@/app/lib/api';
import { toast } from 'sonner';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { motion, AnimatePresence } from 'framer-motion';

export default function VerifyPhonePage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const hcaptchaRef = React.useRef<HCaptcha>(null);

  const [phone, setPhone] = useState<string>('');
  const [channel, setChannel] = useState<'sms' | 'whatsapp'>('sms');
  const [step, setStep] = useState<'enter' | 'otp'>('enter');
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [expiryTime, setExpiryTime] = useState<number | null>(null);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleSend = async () => {
    if (!phone || !isValidPhoneNumber(phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }
    if (!captchaToken) {
      toast.error('Please complete the captcha');
      return;
    }
    setSending(true);
    try {
      await api.post('/phone-verification/send', { phone, channel, captchaToken });
      setStep('otp');
      setResendCooldown(60);
      setExpiryTime(Date.now() + 600000); // 10 minutes
      toast.success(`Code sent via ${channel === 'sms' ? 'SMS' : 'WhatsApp'}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send code');
      hcaptchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (!code.trim() || code.length < 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }
    setVerifying(true);
    try {
      await api.post('/phone-verification/verify', { phone, code: code.trim() });
      toast.success('Phone verified!');
      
      if (clerkUser) {
        await clerkUser.reload();
      }

      // Refresh logic to ensure backend state is synced
      let attempts = 0;
      const checkSync = async () => {
          try {
              const response = await api.get('/users/me');
              const updatedUser = response.data;
              if (updatedUser?.phone_verified) {
                  // Force refresh Clerk token to update session claims for middleware
              try {
                  await getToken({ skipCache: true });
              } catch (e) {
                  console.warn('Failed to force refresh Clerk token:', e);
              }
              
              toast.success('Phone verified successfully!');
              router.push('/onboarding');
          } else if (attempts < 5) {
              attempts++;
              setTimeout(checkSync, 1500); // Poll every 1.5s
          } else {
              // Final fallback
              toast.success('Phone verified successfully!');
              router.push('/onboarding');
          }
          } catch (e) {
              if (attempts < 5) {
                  attempts++;
                  setTimeout(checkSync, 1500);
              } else {
                  toast.success('Phone verified successfully!');
                  router.push('/onboarding');
              }
          }
      };
      
      await checkSync();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Incorrect or expired code');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setStep('enter');
    setCode('');
    setCaptchaToken(null);
    hcaptchaRef.current?.resetCaptcha();
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 py-12 px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-300/30 dark:bg-blue-900/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/70 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-3xl shadow-2xl p-8 md:p-10">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-3xl mb-4 shadow-lg shadow-blue-500/30">
              📱
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Phone</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              {step === 'enter'
                ? 'We\'ll send a one-time code to confirm your number.'
                : `Enter the code sent to ${phone}`}
            </p>
          </div>

          {step === 'enter' ? (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone Number
                </label>
                <PhoneInput
                  international
                  defaultCountry="GB"
                  value={phone}
                  onChange={(val) => setPhone(val || '')}
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus-within:ring-2 focus-within:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Send code via
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['sms', 'whatsapp'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setChannel(c)}
                      className={`py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                        channel === c
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      {c === 'sms' ? '💬 SMS' : '💚 WhatsApp'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-center py-2">
                  <HCaptcha
                      sitekey={(() => {
                          const key = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;
                          if (!key && process.env.NODE_ENV === 'production') {
                              throw new Error('NEXT_PUBLIC_HCAPTCHA_SITE_KEY is missing');
                          }
                          return key || "10000000-ffff-ffff-ffff-000000000001";
                      })()}
                      onVerify={(token) => setCaptchaToken(token)}
                      onExpire={() => setCaptchaToken(null)}
                      ref={hcaptchaRef}
                  />
              </div>

              <button
                onClick={handleSend}
                disabled={sending || !phone || !captchaToken}
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
              >
                {sending ? 'Sending...' : 'Send Code'}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-lg font-mono text-center tracking-widest focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onKeyDown={e => e.key === 'Enter' && handleVerify()}
                />
              </div>

              <button
                onClick={handleVerify}
                disabled={verifying || code.length < 6}
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
              >
                {verifying ? 'Verifying...' : 'Verify'}
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Didn&apos;t receive it?{' '}
                {resendCooldown > 0 ? (
                  <span className="font-medium text-gray-400">Resend in {resendCooldown}s</span>
                ) : (
                  <button onClick={handleResend} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    Resend
                  </button>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
