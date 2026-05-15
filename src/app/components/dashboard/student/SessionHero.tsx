'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SessionCommandCard } from '@/app/components/dashboard/SessionCommandCard';

interface SessionHeroProps {
  nextSession: any;
  loading: boolean;
  isEnrolled: boolean;
  sessionLabel?: string | null;
  countdown?: string;
  startWithin5Min?: boolean;
  onJoinSession?: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

export const SessionHero: React.FC<SessionHeroProps> = ({
  nextSession,
  loading,
  isEnrolled,
  sessionLabel,
  countdown,
  startWithin5Min,
  onJoinSession
}) => {
  if (isEnrolled) {
    return (
      <motion.div variants={itemVariants}
        className="bg-linear-to-br from-violet-600 to-blue-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-violet-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <span className="font-bold text-lg">{nextSession?.subject?.name ?? 'Your Next Class'}</span>
              </div>
              {nextSession?.tutor && (
                <p className="text-white/80 text-sm">with {nextSession.tutor.name}</p>
              )}
              <p className="text-white/90 font-medium">{sessionLabel ?? 'No upcoming class scheduled'}</p>
              {countdown && <p className="text-white/70 text-sm">Starts in {countdown}</p>}
            </div>
            <button
              disabled={!startWithin5Min}
              onClick={onJoinSession}
              className={`px-8 py-4 rounded-2xl font-bold text-base transition-all ${
                startWithin5Min
                  ? 'bg-white text-violet-700 shadow-lg shadow-white/30 animate-pulse hover:scale-105'
                  : 'bg-white/20 text-white/60 cursor-not-allowed'
              }`}
            >
              Join Class
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants} className="space-y-4">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        <span className="text-blue-500">🎓</span> Priority Task
      </h3>
      <SessionCommandCard session={nextSession} loading={loading} />
    </motion.div>
  );
};
