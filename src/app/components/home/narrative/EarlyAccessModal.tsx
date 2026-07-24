'use client';

import React, { useState } from 'react';
import { X, Monitor, Laptop, Loader2, CheckCircle2 } from 'lucide-react';

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: 'mac' | 'windows' | null;
}

export default function EarlyAccessModal({ isOpen, onClose, platform }: EarlyAccessModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('submitting');

    try {
      // Use the generic contact/lead endpoint or just simulate a success for now.
      // In a real app, you would POST this email to your backend to add to the Early Access list.
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: `early_access_${platform}`,
          skipEmailSend: true,
          platform
        })
      });

      if (!res.ok) throw new Error('Failed to submit');
      
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const isMac = platform === 'mac';

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-sapphire rounded-2xl flex items-center justify-center mb-6">
            {isMac ? <Laptop size={32} /> : <Monitor size={32} />}
          </div>

          {status === 'success' ? (
            <div className="text-center py-6 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You're on the list!</h3>
              <p className="text-gray-500 dark:text-gray-400">
                We'll email you the {isMac ? 'Mac' : 'Windows'} installation package and setup instructions shortly.
              </p>
              <button
                onClick={onClose}
                className="mt-6 w-full py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Early Access: {isMac ? 'Mac' : 'Windows'} App
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                We're currently rolling out our desktop app to a limited number of early users. Drop your email below and we'll send you the installation package within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="early-access-email" className="sr-only">Email address</label>
                  <input
                    id="early-access-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={status === 'submitting'}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sapphire focus:border-transparent transition-all"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting' || !email}
                  className="w-full py-3 bg-sapphire hover:bg-sapphire/90 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-sapphire/20"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Requesting Access...
                    </>
                  ) : (
                    'Request Access'
                  )}
                </button>
              </form>
              <p className="text-center text-xs text-gray-400 mt-4">
                No spam. You'll only receive the app installation instructions.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
