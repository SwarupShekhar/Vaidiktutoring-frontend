'use client';

import React, { useEffect, useRef, useState } from 'react';

type RevealVariant = 'up' | 'left' | 'right' | 'fade' | 'scale';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Animation direction. Mirrors the old framer initial offsets. */
  variant?: RevealVariant;
  /** Seconds of delay before the reveal animation starts. */
  delay?: number;
  /** Render element tag. */
  as?: 'div' | 'section' | 'span' | 'li';
  style?: React.CSSProperties;
  id?: string;
}

const VARIANT_CLASS: Record<RevealVariant, string> = {
  up: 'nh-reveal',
  left: 'nh-reveal nh-reveal-left',
  right: 'nh-reveal nh-reveal-right',
  fade: 'nh-reveal nh-reveal-fade',
  scale: 'nh-reveal nh-reveal-scale',
};

/**
 * Scroll-reveal wrapper that replaces framer-motion's whileInView/useInView.
 * Pure CSS animation triggered by a single IntersectionObserver — no framer in
 * the bundle. Content is server-rendered (SEO intact); only the reveal triggers
 * on the client. Reveals once, like framer's `viewport={{ once: true }}`.
 */
export default function Reveal({
  children,
  className = '',
  variant = 'up',
  delay = 0,
  as: Tag = 'div',
  style,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      // matches framer margin: "-100px" (fire slightly before fully in view)
      { rootMargin: '0px 0px -100px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  return (
    <Tag
      // @ts-expect-error — ref typing across the union of tags is fine at runtime
      ref={ref}
      id={id}
      className={`${VARIANT_CLASS[variant]} ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={delay ? { ...style, animationDelay: `${delay}s` } : style}
    >
      {children}
    </Tag>
  );
}
