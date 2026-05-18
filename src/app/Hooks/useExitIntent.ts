'use client';

import { useEffect, useState, useCallback } from 'react';

export function useExitIntent() {
  const [isIntentTriggered, setIsIntentTriggered] = useState(false);

  const resetIntent = useCallback(() => {
    setIsIntentTriggered(false);
  }, []);

  useEffect(() => {
    let isArmed = false;
    
    // Desktop trigger: Mouse leaves the window
    const handleMouseLeave = (e: MouseEvent) => {
      if (isArmed && e.clientY < 0) {
        triggerIntent();
      }
    };

    // Mobile fallback: Tab becomes hidden
    const handleVisibilityChange = () => {
      if (isArmed && document.hidden) {
        triggerIntent();
      }
    };

    const triggerIntent = () => {
      const alreadyTriggered = sessionStorage.getItem('exit_intent_triggered');
      if (alreadyTriggered) return;

      setIsIntentTriggered(true);
      sessionStorage.setItem('exit_intent_triggered', 'true');
      cleanup();
    };

    const cleanup = () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

    // Delay guard: Wait 5 seconds before arming
    const timer = setTimeout(() => {
      isArmed = true;
    }, 5000);

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, []);

  return {
    isIntentTriggered,
    resetIntent,
  };
}

