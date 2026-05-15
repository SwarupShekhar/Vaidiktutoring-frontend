'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import { format, isToday } from 'date-fns';

interface WeekDay {
  day: Date;
  sessions: any[];
}

interface WeeklyScheduleProps {
  weekDays: WeekDay[];
  upcomingSessions: any[];
  isEnrolled: boolean;
  onSetUpSchedule?: () => void;
  fmtDate: (date: string) => string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ 
  weekDays, 
  upcomingSessions,
  isEnrolled,
  onSetUpSchedule,
  fmtDate
}) => {
  return (
    <motion.div variants={itemVariants} className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Calendar size={20} className="text-blue-500" /> 
          {upcomingSessions.length > 0 && !weekDays.some(wd => wd.sessions.length > 0) 
            ? 'Schedule Overview' 
            : 'This Week'}
        </h2>
        {upcomingSessions.length > 0 && !weekDays.some(wd => wd.sessions.length > 0) && (
          <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase tracking-widest">
            Next session starting soon
          </span>
        )}
      </div>

      {upcomingSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-dashed border-border">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
            <Calendar size={32} className="text-blue-400" />
          </div>
          <div>
            <p className="font-bold text-foreground text-lg">No sessions scheduled yet</p>
            <p className="text-sm text-text-secondary max-w-xs mx-auto mt-1">
              {isEnrolled 
                ? "Your sessions are being prepared. Check back soon for your updated schedule."
                : "Your schedule hasn't been set up. Complete your enrollment to book sessions with your tutor."}
            </p>
          </div>
          {!isEnrolled && onSetUpSchedule && (
            <button
              onClick={onSetUpSchedule}
              className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-500/20"
            >
              Set Up My Schedule
            </button>
          )}
        </div>
      ) : !weekDays.some(wd => wd.sessions.length > 0) ? (
        <div className="p-8 text-center bg-indigo-50/30 dark:bg-indigo-500/5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 mb-4">
            <Calendar size={24} />
          </div>
          <h3 className="font-bold text-foreground">Nothing scheduled for this week</h3>
          <p className="text-sm text-text-secondary mt-1">You have {upcomingSessions.length} upcoming sessions starting next week.</p>
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border flex items-center justify-between max-w-md mx-auto">
            <div className="text-left">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Next Class</p>
              <p className="font-bold text-foreground">{fmtDate(upcomingSessions[0].start_time)}</p>
              <p className="text-xs text-text-secondary">{upcomingSessions[0].subject?.name}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <ChevronRight size={20} />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {weekDays.map(({ day, sessions }) => {
            const isNow = isToday(day);
            return (
              <div key={day.toISOString()} className={`min-w-[100px] rounded-2xl p-3 border transition-all ${
                isNow ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10 shadow-sm' : 'border-border bg-background'
              }`}>
                <p className={`text-[10px] font-black uppercase mb-1 ${isNow ? 'text-blue-600 dark:text-blue-400' : 'text-text-secondary'}`}>
                  {format(day, 'EEE')}
                </p>
                <p className={`text-xl font-black ${isNow ? 'text-blue-700 dark:text-blue-300' : 'text-foreground'}`}>
                  {format(day, 'd')}
                </p>
                {sessions.length > 0 ? (
                  <div className="mt-3 space-y-1.5">
                    {sessions.map((s: any) => (
                      <div key={s.id} className="text-[10px] bg-indigo-600 text-white rounded-lg px-2 py-1 font-bold truncate shadow-sm">
                        {format(new Date(s.start_time ?? s.requested_start), 'h:mm a')}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-white/10 mx-auto" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
