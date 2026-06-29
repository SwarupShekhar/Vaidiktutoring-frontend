'use client';

import React, { useEffect, useState } from 'react';
import { Download, Monitor, Apple } from 'lucide-react';
import { motion } from 'framer-motion';

export const DownloadAppBanner: React.FC = () => {
  const [os, setOs] = useState<'mac' | 'win' | 'other' | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (userAgent.includes('mac')) {
        setOs('mac');
      } else if (userAgent.includes('win')) {
        setOs('win');
      } else {
        setOs('other');
      }
    }
  }, []);

  if (!os) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-indigo-900/5 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative"
    >
      <div className="absolute -top-10 -right-4 p-8 opacity-5 pointer-events-none">
        <Download size={140} />
      </div>
      <div className="flex-1 relative z-10">
        <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
          <Monitor size={20} className="text-indigo-600 dark:text-indigo-400" />
          Get the Desktop App
        </h3>
        <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
          Experience StudyHours without distractions. Download our native app for macOS and Windows.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 shrink-0 w-full md:w-auto">
        {(os === 'mac' || os === 'other') && (
          <button
            disabled
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold opacity-80 cursor-not-allowed transition-colors"
            title="Coming Soon"
          >
            <Apple size={18} />
            Download for macOS <span className="text-[10px] uppercase bg-white/20 px-1.5 py-0.5 rounded ml-1">Soon</span>
          </button>
        )}
        {(os === 'win' || os === 'other') && (
          <button
            disabled
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold opacity-80 cursor-not-allowed transition-colors"
            title="Coming Soon"
          >
            <Monitor size={18} />
            Download for Windows <span className="text-[10px] uppercase bg-white/20 px-1.5 py-0.5 rounded ml-1">Soon</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
