'use client';

import React from 'react';
import Reveal from './Reveal';

interface FadeUpSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    /** Kept for API compatibility; CSS reveal fades the container in. */
    stagger?: boolean;
}

/**
 * Scroll-triggered fade-up. Now CSS-driven (via <Reveal>) instead of
 * framer-motion — keeps framer-motion out of the homepage bundle.
 * Same public API (className, delay, stagger) so all consumers are unchanged.
 */
export default function FadeUpSection({ children, className = '', delay = 0, stagger = false }: FadeUpSectionProps) {
    return (
        <Reveal variant={stagger ? 'fade' : 'up'} delay={delay} className={className}>
            {children}
        </Reveal>
    );
}
