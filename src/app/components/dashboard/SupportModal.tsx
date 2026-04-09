'use client';

import React, { useState } from 'react';
import { X, Send, LifeBuoy, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
    context?: any;
}

export const SupportModal = ({ isOpen, onClose, context }: SupportModalProps) => {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSubmitting(true);
        try {
            await api.post('/support/contact', { message, context });
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setMessage('');
                onClose();
            }, 3000);
        } catch (err) {
            console.error('Support request failed:', err);
            toast.error('Failed to send request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-surface w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
                                <LifeBuoy size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-foreground tracking-tight">How can we help?</h2>
                                <p className="text-text-secondary text-sm">Tell us what you need and we&apos;ll get back to you.</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-background rounded-full transition-colors text-text-secondary">
                            <X size={20} />
                        </button>
                    </div>

                    {isSuccess ? (
                        <div className="py-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-xl font-black text-foreground mb-2">Message Sent!</h3>
                            <p className="text-text-secondary">Our team will reach out via email shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-text-secondary uppercase tracking-widest mb-3 ml-1">
                                    Your Message
                                </label>
                                <textarea
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Describe the issue you're facing or your question..."
                                    className="w-full bg-background border border-border rounded-3xl p-6 text-sm min-h-[160px] focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-foreground placeholder:text-text-secondary/50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !message.trim()}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-3xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
                            >

                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Send Help Request
                                    </>
                                )}
                            </button>

                            <p className="text-[10px] text-center text-text-secondary font-medium">
                                We usually respond within 2-4 business hours.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
