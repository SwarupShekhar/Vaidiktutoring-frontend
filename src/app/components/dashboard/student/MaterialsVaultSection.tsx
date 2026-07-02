'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Video, BookOpen, MessageCircle, PlayCircle, Play, ChevronRight } from 'lucide-react';

interface Recording {
  subject: string;
  date: string;
  sessionId: string;
}

interface MaterialsVaultSectionProps {
  recentRecordings: Recording[];
  fmtDate: (date: string) => string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

export const MaterialsVaultSection: React.FC<MaterialsVaultSectionProps> = ({ 
  recentRecordings, 
  fmtDate 
}) => {
  return (
    <div className="space-y-8">
      {/* Quick Access Grid */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Recordings Link */}
        <Link
          href="/students/recordings"
          className="group p-5 rounded-3xl bg-surface border border-border shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex flex-col gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
            <Video size={20} />
          </div>
          <div>
            <h3 className="font-bold text-foreground group-hover:text-purple-600 transition-colors">Class Recordings</h3>
            <p className="text-xs text-text-secondary mt-0.5">Watch your past sessions</p>
          </div>
          <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-purple-600">
            <PlayCircle size={14} /> View all recordings
          </div>
        </Link>

        {/* Whiteboard Snapshots Link */}
        <Link
          href="/students/recordings"
          className="group p-5 rounded-3xl bg-surface border border-border shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="font-bold text-foreground group-hover:text-blue-600 transition-colors">Whiteboard Snapshots</h3>
            <p className="text-xs text-text-secondary mt-0.5">Review whiteboard notes</p>
          </div>
          <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-blue-600">
            <ChevronRight size={14} /> View snapshots
          </div>
        </Link>

        {/* Shared Notes Link */}
        <Link
          href="/students/notes"
          className="group p-5 rounded-3xl bg-surface border border-border shadow-sm hover:shadow-md hover:border-green-300 transition-all flex flex-col gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
            <MessageCircle size={20} />
          </div>
          <div>
            <h3 className="font-bold text-foreground group-hover:text-green-600 transition-colors">Shared Notes</h3>
            <p className="text-xs text-text-secondary mt-0.5">PDFs and after-class notes</p>
          </div>
          <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-green-600">
            <ChevronRight size={14} /> View notes
          </div>
        </Link>
      </motion.section>

      {/* Recent Recordings List */}
      {recentRecordings && recentRecordings.length > 0 && (
        <motion.section variants={itemVariants} className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <PlayCircle size={20} className="text-red-500" /> Recent Lessons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentRecordings.map((r, i) => (
              <div key={i} className="group p-5 rounded-3xl bg-surface border border-border shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 flex items-center justify-center">
                    <Video size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground line-clamp-1">{r.subject}</h4>
                    <p className="text-[10px] text-text-secondary uppercase">{fmtDate(r.date)}</p>
                  </div>
                </div>
                <Link href={`/students/recordings/${r.sessionId}`}
                  className="w-full py-2.5 bg-background hover:bg-red-500 hover:text-white border border-border hover:border-red-500 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2">
                  <Play size={14} /> Watch Lesson
                </Link>
              </div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};
