"use client";

import { useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

interface CounterProps {
  value: number;
  direction?: "up" | "down";
  suffix?: string;
}

/**
 * Animated Counter Component
 * Displays a number that animates when scrolled into view
 */
export default function Counter({ value, suffix = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const display = useTransform(
    spring,
    (current) => Math.floor(current).toLocaleString() + suffix,
  );

  if (inView) {
    spring.set(value);
  }

  return <motion.span ref={ref}>{display}</motion.span>;
}
