
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
        closeTime.setHours(18, 0, 0, 0); // End at 6 PM

        while (current < closeTime) {
            slots.push(new Date(current));
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
                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => {
                                // Default to 9 AM on click if time not set, or preserve time?
                                // Simplified: Just set date part, keep time part if exists? 
                                // For now, nice default: 10 AM
                                const newStart = new Date(day);
                                newStart.setHours(10, 0, 0, 0);
                                onSelect(newStart.toISOString(), addHours(newStart, durationHours).toISOString());
                            }}
                            className={`
                                flex flex-col items-center justify-center min-w-[80px] h-20 rounded-2xl border transition-all
                                ${isSelected
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg scale-105'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
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
                    {generateSlots(selectedDate).map((slot) => {
                        const isSelected = start && new Date(start).getTime() === slot.getTime();
                        return (
                            <button
                                key={slot.toISOString()}
                                onClick={() => {
                                    onSelect(slot.toISOString(), addHours(slot, durationHours).toISOString());
                                }}
                                className={`
                                    py-2 px-3 rounded-xl text-sm font-medium border transition-all
                                    ${isSelected
                                        ? 'bg-blue-500/20 border-blue-500 text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                        : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                                    }
                                `}
                            >
                                {format(slot, 'h:mm a')}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Custom Manual Input (Fallback) */}
            <div className="pt-4 border-t border-white/10 mt-4">
                <p className="text-xs text-gray-500 mb-2">Or enter manually:</p>
                <input
                    type="datetime-local"
                    value={start ? start.slice(0, 16) : ''}
                    onChange={(e) => {
                        const d = new Date(e.target.value);
                        if (!isNaN(d.getTime())) {
                            onSelect(d.toISOString(), addHours(d, durationHours).toISOString());
                        }
                    }}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>
        </div>
    );
};
