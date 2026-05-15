'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Calendar, Plus } from 'lucide-react';

interface DashboardHeaderProps {
  user: any;
  isEnrolled: boolean;
  onEditProfile?: () => void;
  onScrollToSchedule?: () => void;
  canBook?: boolean;
  onBookSession?: () => void;
  onUpgrade?: () => void;
  getGreeting: () => string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  isEnrolled,
  onEditProfile,
  onScrollToSchedule,
  canBook,
  onBookSession,
  onUpgrade,
  getGreeting
}) => {
  return (
    <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          {isEnrolled ? (
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter">Student Portal · Enrolled</p>
          ) : (
            <motion.div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-primary font-bold shadow-inner">
              {user?.first_name?.[0] || user?.firstName?.[0] || 'S'}
            </motion.div>
          )}
          {!isEnrolled && (
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-background px-3 py-1 rounded-full uppercase tracking-tighter border border-border">
              Student Portal
            </p>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          {getGreeting()}, {user?.firstName && user.firstName !== 'New' ? user.firstName : (user?.first_name !== 'New' ? user?.first_name : 'Scholar')}
        </h1>
        <div className="flex items-center gap-3">
          <p className="text-text-secondary text-sm">
            {isEnrolled ? 'Welcome back — your classes are pre-scheduled.' : 'Your learning dashboard is up to date.'}
          </p>
          {!isEnrolled && (
            <button onClick={onEditProfile}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all flex items-center gap-1">
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {isEnrolled ? (
          <>
            <Link
              href="/students/profile"
              className="flex items-center gap-2 px-4 py-2.5 bg-surface text-foreground font-bold rounded-2xl border border-border shadow-sm hover:bg-muted transition-all text-sm"
            >
              <User size={16} />
              My Profile
            </Link>
            <button
              onClick={onScrollToSchedule}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-[1.03] active:scale-95 transition-all text-sm"
            >
              <Calendar size={16} />
              View My Schedule
            </button>
          </>
        ) : (
          canBook === true ? (
            <button onClick={onBookSession}
              className="hidden sm:flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-[1.03] active:scale-95 transition-all text-sm">
              <Plus size={18} /> Book New Session
            </button>
          ) : (
            <button onClick={onUpgrade}
              className="hidden sm:flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/20 hover:scale-[1.03] active:scale-95 transition-all text-sm">
              Upgrade to continue
            </button>
          )
        )}
      </div>
    </motion.header>
  );
};
