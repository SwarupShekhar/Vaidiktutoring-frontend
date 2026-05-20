'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, Microscope, X, Loader2, PlayCircle, ExternalLink, Lock, CheckCircle2 } from 'lucide-react';
import { INTERACTIVE_TOOLS, InteractiveTool } from '@/app/lib/interactive-tools';
import { useRouter } from 'next/navigation';

interface LearningLabProps {
  isEnrolled?: boolean;
  isTutor?: boolean;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

export const LearningLab: React.FC<LearningLabProps> = ({ isEnrolled = true, isTutor = false }) => {
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<InteractiveTool | null>(null);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Handle escape key to close fullscreen lab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveTool(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLaunch = (tool: InteractiveTool) => {
    if (!isEnrolled) {
      setShowUpgradeModal(true);
      return;
    }
    setActiveTool(tool);
    setIframeLoading(true);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Atom':
        return <Atom className="w-5 h-5 text-indigo-500" />;
      case 'Microscope':
        return <Microscope className="w-5 h-5 text-emerald-500" />;
      default:
        return <Atom className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              🧪
            </span>
            Studyhours Learning Lab
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isTutor 
              ? 'Use these interactive models to demonstrate concepts live during lessons.' 
              : 'Immersive 3D modules and interactive tools to master complex scientific concepts.'}
          </p>
        </div>
        {!isEnrolled && (
          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase rounded-lg tracking-widest flex items-center gap-1.5">
            <Lock size={10} /> Preview Mode
          </span>
        )}
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {INTERACTIVE_TOOLS.map((tool) => (
          <motion.div
            key={tool.id}
            variants={itemVariants}
            className="group relative rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-800/80 transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden"
          >
            {/* Background dynamic blur glow on hover */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50 group-hover:scale-110 transition-transform duration-300">
                  {getIcon(tool.iconName)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                    {tool.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">
                    {tool.id === 'chem' ? 'Chemistry Module' : 'Biology Module'}
                  </p>
                </div>
              </div>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                {tool.description}
                {isTutor && (
                  <span className="block mt-2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                    💡 Ideal for live lesson screen-share demonstrations
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleLaunch(tool)}
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
              >
                {!isEnrolled && <Lock size={12} />}
                <PlayCircle size={14} /> Launch Lab
              </button>
              
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold transition-all text-center flex items-center gap-1.5"
              >
                <ExternalLink size={12} /> External
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Tool Modal Overlay */}
      <AnimatePresence>
        {activeTool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md p-4 sm:p-6"
          >
            {/* Header controls inside fullscreen portal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center">
                  {getIcon(activeTool.iconName)}
                </div>
                <div>
                  <h2 className="text-lg font-black text-white leading-tight">
                    {activeTool.title}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Studyhours.com Interactive Learning Lab
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={activeTool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all"
                >
                  <ExternalLink size={14} /> Open in New Tab
                </a>
                
                <button
                  onClick={() => setActiveTool(null)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 hover:text-red-500 rounded-xl text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Iframe Viewport Container */}
            <div className="flex-1 w-full relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
              {/* Skeleton/Loading spinner indicator */}
              {iframeLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-400 space-y-4">
                  <Loader2 size={32} className="animate-spin text-indigo-500" />
                  <p className="font-bold text-xs uppercase tracking-widest text-slate-500">
                    Initializing WebGL Engine...
                  </p>
                </div>
              )}
              
              <iframe
                src={activeTool.url}
                title={activeTool.title}
                loading="lazy"
                onLoad={() => setIframeLoading(false)}
                allow="fullscreen; autoplay; xr-spatial-tracking; accelerometer; gyroscope"
                className="w-full h-full border-0 rounded-3xl"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trial Premium Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 border border-slate-200 dark:border-slate-800 space-y-6 relative overflow-hidden"
            >
              {/* Dynamic Gradient Top Border */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />

              <button
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-3 pt-4">
                <div className="inline-flex p-4 rounded-3xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-2">
                  <Atom size={32} className="animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Unlock 3D Learning Labs
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Interactive WebGL tools are exclusively available to premium enrolled students on Studyhours.com.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 space-y-3.5">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Premium Student Benefits
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>Unlimited access to 3D Biology Explorer & Chem Labs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>Personalized high-dosage curriculum roadmap</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>Live 1-on-1 tutoring sessions with top certified mentors</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    router.push('/pricing');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-black shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  Upgrade Now →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
