'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Quote, ChevronDown, ChevronUp } from 'lucide-react';

interface Feedback {
  subject: string;
  date: string;
  note: string;
}

interface TutorCommunicationSectionProps {
  feedback: Feedback[];
  fmtDate: (date: string) => string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

export const TutorCommunicationSection: React.FC<TutorCommunicationSectionProps> = ({ 
  feedback, 
  fmtDate 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!feedback || feedback.length === 0) return null;

  return (
    <motion.section variants={itemVariants} className="space-y-4 bg-surface border border-border p-5 rounded-3xl shadow-sm">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare size={20} className="text-blue-500" /> Tutor Feedback
        </h3>
        <button className="p-2 hover:bg-background rounded-full transition-colors text-text-secondary">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-4 pt-2">
              {feedback.map((f, i) => (
                <div key={i} className="p-5 rounded-3xl bg-background border border-border shadow-sm group hover:border-blue-200 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{f.subject}</p>
                      <p className="text-[10px] text-text-secondary">{fmtDate(f.date)}</p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500"><Quote size={14} /></div>
                  </div>
                  <p className="text-sm text-foreground italic leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">"{f.note}"</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
