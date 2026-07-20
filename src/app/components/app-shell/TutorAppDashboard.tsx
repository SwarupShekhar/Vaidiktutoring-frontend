'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MagicBento from '../MagicBento';
import { useTutorBentoCards } from '@/app/Hooks/useTutorBentoCards';
import ShareNotesModal from '@/app/tutor/ShareNotesModal';
import { CARD_COLOR, containerVariants, itemVariants } from './ui';

interface TutorAppDashboardProps {
  user: any;
}

export const TutorAppDashboard: React.FC<TutorAppDashboardProps> = () => {
  const [shareNotesSessionId, setShareNotesSessionId] = useState<string | null>(null);
  const { cards, loading, nextSession } = useTutorBentoCards({
    cardColor: CARD_COLOR, // force the dark card surface regardless of OS theme
    onShareNotes: setShareNotesSessionId,
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-6xl space-y-5 px-4 py-3 md:px-6"
    >
      <motion.div variants={itemVariants}>
        {loading && cards.length === 0 ? null : (
          <MagicBento
            cards={cards}
            textAutoHide={false}
            enableStars
            enableSpotlight
            enableBorderGlow
            enableTilt
            enableMagnetism
            clickEffect
            spotlightRadius={300}
            particleCount={12}
            glowColor="132, 0, 255"
          />
        )}
      </motion.div>

      {shareNotesSessionId && (
        <ShareNotesModal
          sessionId={shareNotesSessionId}
          studentName={nextSession?.child_name}
          onClose={() => setShareNotesSessionId(null)}
        />
      )}
    </motion.div>
  );
};
