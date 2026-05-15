'use client';

import React from 'react';
import { motion } from 'framer-motion';

const BADGES = [
  { id: 'first_step', label: 'First Step', videoUrl: 'https://res.cloudinary.com/de8vvmpip/video/upload/v1775649916/goal_v94vs6.gif', description: 'Completed your first session' },
  { id: 'consistent', label: 'Consistent', videoUrl: 'https://res.cloudinary.com/de8vvmpip/video/upload/v1775649812/consistency_lx5v5n.gif', description: 'Attended 4 sessions in a month' },
  { id: 'quick_learner', label: 'Quick Learner', videoUrl: 'https://res.cloudinary.com/de8vvmpip/video/upload/v1775649979/reading_zyvlll.gif', description: '2 week streak' },
  { id: 'dedicated', label: 'Dedicated', videoUrl: 'https://res.cloudinary.com/de8vvmpip/video/upload/v1775650132/resilience_kurkwb.gif', description: '10 sessions completed' },
  { id: 'star_student', label: 'Star Student', videoUrl: 'https://res.cloudinary.com/de8vvmpip/video/upload/v1775650214/student_hahzeg.gif', description: '4 week streak' },
];

interface AchievementSectionProps {
  progress: any;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

export const AchievementSection: React.FC<AchievementSectionProps> = ({ progress }) => {
  if (!progress) return null;
  
  return (
    <motion.section variants={itemVariants} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">My Achievements</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {BADGES.map((badge) => {
          const isEarned = progress.badges?.includes(badge.id);
          return (
            <div 
              key={badge.id}
              className={`group relative p-4 rounded-2xl border text-center transition-all ${
                isEarned 
                  ? 'bg-surface border-green-100 dark:border-green-900/30' 
                  : 'bg-surface/50 border-dashed border-border opacity-60'
              }`}
            >
              <div className={`w-20 h-20 mx-auto mb-3 transition-all duration-500 group-hover:scale-125 flex items-center justify-center overflow-hidden ${!isEarned ? 'filter grayscale opacity-40' : 'opacity-100'}`}>
                <img 
                  src={badge.videoUrl} 
                  alt={badge.label}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className={`text-xs font-bold ${isEarned ? 'text-foreground' : 'text-text-secondary'}`}>
                {badge.label}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                {badge.description}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};
