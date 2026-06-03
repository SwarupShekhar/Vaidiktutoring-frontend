'use client';

import React, { useEffect, useState } from 'react';
import { useExitIntent } from '@/app/Hooks/useExitIntent';
import ExitIntentPopup from '@/app/components/ui/ExitIntentPopup';

export default function ExitPopupHandler() {
  const { isIntentTriggered, resetIntent } = useExitIntent();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (isIntentTriggered) {
      setIsPopupOpen(true);
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Event: popup_shown');
      }
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'popup_shown');
      }
    }
  }, [isIntentTriggered]);

  const handleClose = () => {
    setIsPopupOpen(false);
    resetIntent();
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event: popup_dismissed');
    }
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'popup_dismissed');
    }
  };

  const handleCtaClick = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event: popup_cta_clicked');
    }
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'popup_cta_clicked');
    }
    window.location.href = '/signup';
  };

  return (
    <ExitIntentPopup
      isOpen={isPopupOpen}
      onClose={handleClose}
      title="Wait! Don't let hidden learning gaps hold your child back."
      hook="80% of students have concept gaps from previous years. Find your child's for free."
      description="Book a free 30-minute Diagnostic Assessment to identify specific gaps and get a custom improvement plan."
      ctaText="Claim Free Assessment"
      onCtaClick={handleCtaClick}
      secondaryCtaText="No thanks, I'll take the risk"
      onSecondaryCtaClick={handleClose}
    />
  );
}
