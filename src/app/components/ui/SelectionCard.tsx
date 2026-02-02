
'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                relative p-5 rounded-2xl cursor-pointer transition-all duration-300
                border backdrop-blur-md flex items-center gap-4 group
                ${selected
                    ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    : 'bg-white/5 border-white/10 hover:border-white/30 hover:shadow-lg'
                }
            `}
        >
            {/* Selection Ring Indicator */}
            <div className={`
                absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                ${selected ? 'bg-blue-500 border-blue-500 scale-100' : 'border-white/20 scale-90 opacity-50 group-hover:opacity-100'}
            `}>
                {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>

            {/* Icon / Avatar Container */}
            <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner
                ${selected ? 'bg-blue-500 text-white' : 'bg-gray-800/50 text-gray-400'}
            `}>
                {icon || <User size={20} />}
            </div>

            {/* Text */}
            <div className="flex flex-col">
                <span className={`font-bold text-base ${selected ? 'text-white' : 'text-gray-200'}`}>
                    {title}
                </span>
                {subtitle && (
                    <span className="text-xs text-gray-400 font-medium">
                        {subtitle}
                    </span>
                )}
            </div>

            {/* Glow Effect on Selection */}
            {selected && (
                <motion.div
                    layoutId="outline"
                    className="absolute inset-0 rounded-2xl border-2 border-blue-500"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </motion.div>
    );
};
