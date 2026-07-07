'use client';
import React, { useState, useEffect } from 'react';
import api from '@/app/lib/api';
import { Loader2, Calendar, Clock, X, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useFocusTrap } from '@/app/Hooks/useFocusTrap';

interface RescheduleBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: any;
    onSuccess?: () => void;
}

export default function RescheduleBookingModal({ isOpen, onClose, booking, onSuccess }: RescheduleBookingModalProps) {
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && booking) {
            const start = booking.start_time || booking.requested_start;
            const end = booking.end_time || booking.requested_end;
            if (start) {
                // format as YYYY-MM-DDThh:mm
                const date = new Date(start);
                const localStr = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                setStartTime(localStr);
            }
            if (end) {
                const date = new Date(end);
                const localStr = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                setEndTime(localStr);
            }
        } else {
            setError(null);
        }
    }, [isOpen, booking]);

    const panelRef = useFocusTrap<HTMLDivElement>(isOpen && !!booking, onClose);

    if (!isOpen || !booking) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const start = new Date(startTime).toISOString();
            const end = new Date(endTime).toISOString();

            await api.patch(`/admin/group-sessions/${booking.id}/reschedule`, {
                startTime: start,
                endTime: end
            });

            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reschedule session');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="reschedule-booking-modal-title"
                tabIndex={-1}
                className="bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            >
                <div className="px-6 py-4 border-b border-border flex justify-between items-center">
                    <div>
                        <h2 id="reschedule-booking-modal-title" className="text-xl font-bold text-(--color-text-primary)">Reschedule Session</h2>
                        <p className="text-sm text-text-secondary mt-1">
                            {booking.student ? '1-on-1 Class' : 'Group Class'} - {booking.subject?.name || booking.subjects?.name || ''}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-text-secondary hover:text-(--color-text-primary) hover:bg-surface-hover rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                            <AlertCircle className="text-red-500 shrink-0" size={20} />
                            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-(--color-text-primary) mb-1.5 flex items-center gap-2">
                                <Calendar size={16} className="text-brand-primary" /> Start Time
                            </label>
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-(--color-text-primary) focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-(--color-text-primary) mb-1.5 flex items-center gap-2">
                                <Clock size={16} className="text-brand-primary" /> End Time
                            </label>
                            <input
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-(--color-text-primary) focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 font-bold text-text-secondary hover:bg-surface-hover rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !startTime || !endTime}
                            className="px-5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Reschedule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
