
'use client';

import React from 'react';
import { addHours, format, addDays, startOfToday, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface TimeSlotPickerProps {
    start: string; // ISO string
    end: string;
    onSelect: (start: string, end: string) => void;
    durationHours?: number;
}

export const TimeSlotPicker = ({ start, end, onSelect, durationHours = 1 }: TimeSlotPickerProps) => {
    // Generate next 5 days
    const today = startOfToday();
    const days = Array.from({ length: 5 }).map((_, i) => addDays(today, i));

    // Generate slots for a day (Example: 9am to 6pm)
    const generateSlots = (day: Date) => {
        const slots = [];
        let current = new Date(day);
        current.setHours(9, 0, 0, 0); // Start at 9 AM
        const closeTime = new Date(day);
        closeTime.setHours(21, 0, 0, 0); // Extend to 9 PM for more flexibility

        const now = new Date();

        while (current < closeTime) {
            // Only add future slots
            if (current > now) {
                slots.push(new Date(current));
            }
            current = addHours(current, 1);
        }
        return slots;
    };

    const selectedDate = start ? new Date(start) : null;

    return (
        <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Clock size={16} /> Select Date & Time
            </h3>

            {/* Date Scroller */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {days.map((day) => {
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    // Check if day has ANY available slots
                    const availableSlots = generateSlots(day);
                    const isDisabled = availableSlots.length === 0;

                    return (
                        <button
                            key={day.toISOString()}
                            disabled={isDisabled}
                            onClick={() => {
                                if (isDisabled) return;
                                // Auto-select first available slot
                                const firstSlot = availableSlots[0];
                                onSelect(firstSlot.toISOString(), addHours(firstSlot, durationHours).toISOString());
                            }}
                            className={`
                                flex flex-col items-center justify-center min-w-[80px] h-20 rounded-2xl border transition-all
                                ${isDisabled ? 'opacity-30 cursor-not-allowed grayscale bg-white/5 border-white/5' : ''}
                                ${isSelected && !isDisabled
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg scale-105'
                                    : !isDisabled ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10' : ''
                                }
                            `}
                        >
                            <span className="text-xs font-medium uppercase">{format(day, 'EEE')}</span>
                            <span className="text-xl font-bold">{format(day, 'd')}</span>
                        </button>
                    );
                })}
            </div>

            {/* Time Grid (only if date selected) */}
            {selectedDate && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {generateSlots(selectedDate).length === 0 ? (
                        <p className="col-span-4 text-center text-gray-500 italic py-4">No slots available for this date.</p>
                    ) : (
                        generateSlots(selectedDate).map((slot) => {
                            const isSelected = start && new Date(start).getTime() === slot.getTime();
                            return (
                                <button
                                    key={slot.toISOString()}
                                    onClick={() => {
                                        onSelect(slot.toISOString(), addHours(slot, durationHours).toISOString());
                                    }}
                                    className={`
                                        py-2 px-3 rounded-xl text-sm font-medium border transition-all relative overflow-hidden group
                                        ${isSelected
                                            ? 'bg-blue-500 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105 z-10'
                                            : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:text-gray-200 hover:bg-white/10'
                                        }
                                    `}
                                >
                                    <span className="relative z-10">{format(slot, 'h:mm a')}</span>
                                    {isSelected && <div className="absolute inset-0 bg-blue-400/20 blur-md rounded-xl" />}
                                </button>
                            );
                        })
                    )}
                </div>
            )}

            {/* Custom Manual Input (Fallback) */}
            <div className="pt-6 border-t border-white/10 mt-6">
                <div className="bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col gap-2">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Manual Entry</p>
                    <input
                        type="datetime-local"
                        value={start ? format(new Date(start), "yyyy-MM-dd'T'HH:mm") : ''}
                        onChange={(e) => {
                            const d = new Date(e.target.value);
                            if (!isNaN(d.getTime())) {
                                onSelect(d.toISOString(), addHours(d, durationHours).toISOString());
                            }
                        }}
                        className="w-full bg-transparent border-none p-0 text-white text-lg font-mono focus:ring-0 focus:outline-none placeholder-gray-600"
                    />
                </div>
            </div>
        </div>
    );
};
