'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface StickerRewardsProps {
  stickers: string[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

const STICKER_MAP: Record<string, { emoji: string; label: string; image?: string }> = {
  crown: { emoji: '👑', label: 'Crown', image: '/stickers/crown.png' },
  diamond: { emoji: '💎', label: 'Diamond', image: '/stickers/Diamond.png' },
  dinosaur: { emoji: '🦕', label: 'Dino', image: '/stickers/Dinosaur.png' },
  flame: { emoji: '🔥', label: 'Flame', image: '/stickers/Flame.png' },
  rainbow: { emoji: '🌈', label: 'Rainbow', image: '/stickers/Rainbow.png' },
  rocket: { emoji: '🚀', label: 'Rocket', image: '/stickers/Rocket.png' },
  shiningstar: { emoji: '🌟', label: 'Shining Star', image: '/stickers/Shining Star.png' },
  star: { emoji: '⭐', label: 'Star', image: '/stickers/Star.png' },
  trophy: { emoji: '🏆', label: 'Trophy', image: '/stickers/Trophy.png' },
  unicorn: { emoji: '🦄', label: 'Unicorn', image: '/stickers/Unicorn.png' },
  heart: { emoji: '❤️', label: 'Heart' },
  fire: { emoji: '🔥', label: 'Fire', image: '/stickers/Flame.png' },
  brain: { emoji: '🧠', label: 'Genius' },
  clap: { emoji: '👏', label: 'Bravo' },
  sparkle: { emoji: '✨', label: 'Sparkle' },
  thumbsup: { emoji: '👍', label: 'Thumbs Up' },
  lightbulb: { emoji: '💡', label: 'Bright Idea' },
  100: { emoji: '💯', label: 'Perfect' },
};

export const StickerRewards: React.FC<StickerRewardsProps> = ({ stickers }) => {
  if (!stickers || stickers.length === 0) return null;

  const counts: Record<string, number> = {};
  stickers.forEach((s) => { counts[s] = (counts[s] || 0) + 1; });

  return (
    <motion.section variants={itemVariants} className="space-y-4">
      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Star size={20} className="text-yellow-500" /> Tutor Stickers
      </h3>
      <div className="flex flex-wrap gap-3">
        {Object.entries(counts).map(([type, count]) => {
          const normalizedType = type.toLowerCase().replace(' ', '');
          const info = STICKER_MAP[normalizedType] || { emoji: '🏅', label: type };
          return (
            <div key={type} className="group relative flex flex-col items-center p-3 rounded-2xl bg-surface border border-yellow-100 dark:border-yellow-900/30 hover:shadow-md transition-all min-w-[72px]">
              {info.image ? (
                <img src={info.image} alt={info.label} className="w-10 h-10 object-contain group-hover:scale-125 transition-transform" />
              ) : (
                <span className="text-3xl group-hover:scale-125 transition-transform">{info.emoji}</span>
              )}
              <span className="text-[10px] font-bold text-foreground mt-1">{info.label}</span>
              {count > 1 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-yellow-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  ×{count}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};
