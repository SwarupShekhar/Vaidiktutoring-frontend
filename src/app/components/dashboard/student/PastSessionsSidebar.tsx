'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface Session {
  id: string;
  subject?: { name: string };
  start_time: string;
}

interface PastSessionsSidebarProps {
  pastSessions: Session[];
  fmtDate: (date: string) => string;
}

export const PastSessionsSidebar: React.FC<PastSessionsSidebarProps> = ({ 
  pastSessions, 
  fmtDate 
}) => {
  return (
    <aside className="space-y-6">
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm overflow-hidden relative">
        <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 relative z-10">
          <CheckCircle2 size={18} className="text-green-500" /> Recently Finished
        </h2>
        <div className="space-y-4 relative z-10 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
          {pastSessions.length > 0 ? (
            pastSessions.map((session) => (
              <div key={session.id} className="relative pl-6 border-l-2 border-green-100 dark:border-green-900/30 pb-4 last:pb-0">
                <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-green-400" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">{session.subject?.name || 'Session'}</h4>
                  <p className="text-[10px] text-text-secondary uppercase font-bold opacity-60">{fmtDate(session.start_time).split(',')[0]}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 opacity-50">
              <p className="text-xs font-bold">Your journey is just beginning!</p>
            </div>
          )}
        </div>
        <div className="absolute bottom-[-20px] right-[-20px] text-8xl opacity-5 pointer-events-none select-none">🎓</div>
      </div>

      <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
        <h3 className="font-extrabold text-lg mb-2 relative z-10">Practice makes perfect!</h3>
        <p className="text-xs text-white/80 mb-4 relative z-10">Review your past classes to improve your skills faster.</p>
        <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-all relative z-10">Daily Challenge (Coming Soon)</button>
        <div className="absolute top-[-10px] right-[-10px] w-20 h-20 bg-white/10 rounded-full blur-xl" />
      </div>
    </aside>
  );
};
