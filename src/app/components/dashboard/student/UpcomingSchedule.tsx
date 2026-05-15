'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';

interface Session {
  id: string;
  subject?: { name: string };
  start_time: string;
}

interface UpcomingScheduleProps {
  sessions: Session[];
  loading: boolean;
  fmtDate: (date: string) => string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

export const UpcomingSchedule: React.FC<UpcomingScheduleProps> = ({ 
  sessions, 
  loading,
  fmtDate
}) => {
  return (
    <motion.div variants={itemVariants} className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Calendar size={20} className="text-blue-500" /> Upcoming Schedule
        </h2>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-background px-2 py-1 rounded-md border border-border">
          {sessions.length} Other Classes
        </span>
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="py-10 text-center text-blue-300">Loading schedule...</div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <div key={session.id} className="p-4 rounded-xl bg-surface border border-border flex justify-between items-center group hover:bg-background transition-all cursor-default">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-lg shadow-sm">📚</div>
                <div>
                  <h3 className="font-bold text-foreground group-hover:text-blue-600 transition-colors">{session.subject?.name || 'Class Session'}</h3>
                  <p className="text-xs text-text-secondary">{fmtDate(session.start_time)}</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" size={16} />
            </div>
          ))
        ) : (
          <div className="py-8 text-center bg-background rounded-2xl border border-dashed border-border">
            <p className="text-sm text-text-secondary italic">No other classes scheduled.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
