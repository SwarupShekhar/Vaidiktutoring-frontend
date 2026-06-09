'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface ExitIntentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  hook?: string;
  ctaText: string;
  onCtaClick: () => void;
  secondaryCtaText?: string;
  onSecondaryCtaClick?: () => void;
}

export default function ExitIntentPopup({
  isOpen,
  onClose,
  title,
  description,
  hook,
  ctaText,
  onCtaClick,
  secondaryCtaText,
  onSecondaryCtaClick,
}: ExitIntentPopupProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  // Handle entry animation
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow initial DOM render before triggering transition classes
      const timer = setTimeout(() => setMounted(true), 10);
      return () => clearTimeout(timer);
    } else {
      setMounted(false);
    }
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus the CTA button on open for a11y and attention
      ctaRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle focus trap (simple version)
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        e.stopPropagation();
        ctaRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('focus', handleFocus, true);
    }

    return () => {
      document.removeEventListener('focus', handleFocus, true);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-deep-navy/80 backdrop-blur-md transition-opacity duration-300 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className={`relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-surface/90 border border-border/40 p-10 shadow-2xl backdrop-blur-xl transform transition-all duration-500 ${
            mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-text-secondary hover:text-text-primary transition-colors p-2 rounded-full hover:bg-white/10"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className="text-center">
            {/* Premium Accent */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sapphire/10 text-sapphire text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-sapphire/20">
              Exclusive Offer
            </div>

            <h2
              id="modal-title"
              className="text-3xl md:text-4xl font-black text-deep-navy dark:text-white mb-4 tracking-tight leading-[1.1]"
            >
              {title}
            </h2>

            {hook && (
              <p className="text-lg font-bold text-gradient-primary mb-4">
                {hook}
              </p>
            )}

            <p className="text-base text-text-secondary font-medium leading-relaxed mb-8 opacity-80">
              {description}
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <button
                ref={ctaRef}
                onClick={onCtaClick}
                className="w-full flex items-center justify-center px-8 py-4 bg-linear-to-br from-sapphire to-primary text-white rounded-full font-black text-base shadow-lg shadow-sapphire/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                {ctaText}
              </button>

              {secondaryCtaText && (
                <button
                  onClick={onSecondaryCtaClick || onClose}
                  className="w-full text-xs text-text-secondary font-bold tracking-wide uppercase opacity-60 hover:opacity-100 transition-opacity py-2"
                >
                  {secondaryCtaText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
