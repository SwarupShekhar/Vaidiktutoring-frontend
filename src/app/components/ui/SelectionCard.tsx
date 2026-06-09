'use client';

import React from 'react';
import { Check, User, Play, Briefcase } from 'lucide-react';

interface SelectionCardProps {
    id: string;
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    selected: boolean;
    onClick: () => void;
    image?: string; // Optional avatar
}

export const SelectionCard = ({ id, title, subtitle, icon, selected, onClick }: SelectionCardProps) => {
    return (
        <div
            onClick={onClick}
            className={`
                relative p-5 rounded-2xl cursor-pointer transition-all duration-300
                border backdrop-blur-md flex items-center gap-4 group hover:scale-[1.02] active:scale-[0.98]
                ${selected
                    ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    : 'bg-white/5 border-white/10 hover:border-white/30 hover:shadow-lg hover:bg-white/10'
                }
            `}
        >
            {/* Selection Ring Indicator */}
            <div className={`
                absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                ${selected ? 'bg-blue-500 border-blue-500 scale-100' : 'border-white/20 scale-90 opacity-50 group-hover:opacity-100'}
            `}>
                {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>

            {/* Icon / Avatar Container */}
            <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner transition-colors duration-300
                ${selected ? 'bg-blue-500 text-white' : 'bg-gray-800/50 text-gray-400'}
            `}>
                {icon || <User size={20} />}
            </div>

            {/* Text */}
            <div className="flex flex-col">
                <span className={`font-bold text-base transition-colors duration-300 ${selected ? 'text-white' : 'text-gray-200'}`}>
                    {title}
                </span>
                {subtitle && (
                    <span className="text-xs text-gray-400 font-medium">
                        {subtitle}
                    </span>
                )}
            </div>

            {/* Glow Effect on Selection */}
            <div
                className={`absolute inset-0 rounded-2xl border-2 border-blue-500 transition-opacity duration-300 pointer-events-none ${selected ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    );
};
