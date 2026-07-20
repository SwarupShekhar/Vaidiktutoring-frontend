'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, ChevronRight } from 'lucide-react';

interface OnboardingStep {
  id: number;
  label: string;
  complete: boolean;
  link?: string;
}

interface OnboardingCardProps {
  steps: OnboardingStep[];
  completedCount: number;
  onDismiss: () => void;
  onCompleteStep: (stepId: number, link?: string) => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

export const OnboardingCard: React.FC<OnboardingCardProps> = ({ 
  steps, 
  completedCount, 
  onDismiss,
  onCompleteStep
}) => {
  return (
    <motion.div variants={itemVariants} className="mb-8 bg-surface rounded-3xl shadow-sm border border-blue-100 dark:border-blue-900/30 overflow-hidden relative">
      <button onClick={onDismiss}
        className="absolute top-4 right-4 p-1 text-text-secondary hover:text-foreground">
        <X size={20} />
      </button>
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to StudyHours 👋 Let's get you started</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(completedCount / steps.length) * 100}%` }} />
          </div>
          <span className="text-sm font-medium text-text-secondary">{completedCount} of {steps.length} steps complete</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.id} className={`p-4 rounded-2xl border ${step.complete ? 'bg-green-50/50 border-green-100 dark:bg-green-900/10' : 'bg-background border-border'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${step.complete ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-surface text-text-secondary'}`}>
                  {step.complete ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 flex items-center justify-center font-bold text-xs">{step.id}</div>}
                </div>
              </div>
              <p className="font-semibold text-foreground mb-3">{step.label}</p>
              {!step.complete && (step.link || step.id === 1) ? (
                <button onClick={() => onCompleteStep(step.id, step.link)}
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                  Complete Now <ChevronRight size={14} />
                </button>
              ) : !step.complete ? (
                <span className="text-sm font-medium text-text-tertiary flex items-center gap-1">
                  Waiting for your next session
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
