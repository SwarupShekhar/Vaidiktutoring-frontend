'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from './tokens';

/**
 * Premium app-shell page wrapper. Provides the centered max-width column,
 * vertical rhythm, responsive padding and the framer-motion stagger container.
 *
 * The AppShell already renders the dark `#0a0a0f` canvas + sticky Back bar, so
 * this wrapper is transparent and does NOT add its own background or back
 * affordance. Render this ONLY in the `isAppShell` branch of a page.
 */
export function AppPage({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`mx-auto w-full max-w-6xl space-y-8 px-4 py-6 md:px-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * A single staggered child of an AppPage. Wrap each top-level block (header,
 * toolbar, section, grid) so it fades + rises in sequence on mount.
 */
export function AppPageItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
