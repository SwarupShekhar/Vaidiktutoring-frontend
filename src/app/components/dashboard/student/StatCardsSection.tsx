'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Hourglass, Flame } from 'lucide-react';
import { StatCard } from '@/app/components/dashboard/StatCard';

interface StatCardsSectionProps {
  completedCount: number;
  totalHours: string;
  streak: number;
  sessionsRemaining?: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

export const StatCardsSection: React.FC<StatCardsSectionProps> = ({
  completedCount,
  totalHours,
  streak,
  sessionsRemaining
}) => {
  return (
    <motion.section variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard 
        icon={CheckCircle2} 
        label="Sessions Completed" 
        value={sessionsRemaining !== undefined ? `${completedCount}/${sessionsRemaining + completedCount}` : completedCount} 
        color="#10b981" 
        description={sessionsRemaining !== undefined ? "in your package" : "Keep it up!"} 
      />
      <StatCard 
        icon={Hourglass} 
        label="Learning Hours" 
        value={totalHours} 
        description="Total time spent" 
        color="#f59e0b" 
      />
      <div className={`bg-surface p-6 rounded-3xl border transition-all duration-500 flex flex-col justify-between shadow-sm ${streak >= 4 ? 'border-amber-400 shadow-amber-100 dark:shadow-none' : 'border-border'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${streak > 0 ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-gray-50 dark:bg-gray-700 text-gray-400'}`}>
            <Flame size={20} fill={streak > 0 ? "currentColor" : "none"} />
          </div>
          {streak >= 8 && (
            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wider">🏆 On fire!</span>
          )}
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground">{streak} week{streak !== 1 ? 's' : ''}</div>
          <div className="text-sm text-text-secondary">{streak > 0 ? 'week streak' : 'Start your streak today'}</div>
        </div>
      </div>
    </motion.section>
  );
};
