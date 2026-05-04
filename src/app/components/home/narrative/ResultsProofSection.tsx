'use client';

import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import FadeUpSection from './FadeUpSection';
import {
  TrendingUp,
  Award,
  Users,
  ArrowUpRight,
} from 'lucide-react';

/* ─── Animated counter ─── */
function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          const controls = animate(0, value, {
            duration: 2.2,
            ease: 'easeOut',
            onUpdate: (latest) => setDisplay(Math.round(latest)),
          });
          return () => controls.stop();
        }
      },
      { threshold: 0.5 }
    );
    const el = document.getElementById(`counter-${value}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span id={`counter-${value}`} className="text-5xl md:text-6xl font-black tracking-tighter text-foreground">
      {display}
      {suffix}
    </span>
  );
}

/* ─── Stats data ─── */
const STATS = [
  {
    value: 95,
    suffix: '%',
    label: 'of parents report improved confidence',
    source: 'Parent survey, n=84',
    icon: Award,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    value: 1.5,
    suffix: ' grades',
    label: 'average improvement in 3 months',
    source: 'Internal progress data, 2024-25',
    icon: TrendingUp,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    value: 92,
    suffix: '%',
    label: 'of students continue after their trial',
    source: 'Retention data, Q1 2025',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
];

/* ─── Case studies ─── */
const CASE_STUDIES = [
  {
    name: 'Aisha K.',
    location: 'Dubai, UAE',
    result: 'C → A* in GCSE Maths',
    timeline: '4 months',
    quote: "My tutor found the exact gaps in my algebra foundations that no one else had spotted. Everything clicked after that.",
    curriculum: 'IGCSE',
    initials: 'AK',
  },
  {
    name: 'Tom H.',
    location: 'London, UK',
    result: 'Grade 4 → Grade 8 in A-Level Chemistry',
    timeline: '5 months',
    quote: "The structured sessions meant I wasn't just revising, I was actually understanding the concepts for the first time.",
    curriculum: 'A-Level',
    initials: 'TH',
  },
  {
    name: 'Priya S.',
    location: 'Singapore',
    result: 'AL 22 → AL 8 in PSLE',
    timeline: '6 months',
    quote: "My daughter went from dreading science to asking questions at dinner. That's the real result.",
    curriculum: 'PSLE',
    initials: 'PS',
  },
];

export default function ResultsProofSection() {
  return (
    <section className="py-28 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/4 blur-[100px] rounded-full" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Header */}
        <FadeUpSection className="text-center mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-5">
            Proven Results
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter leading-tight">
            Real numbers, real students
          </h2>
          <p className="text-text-secondary font-medium mt-4 max-w-xl mx-auto">
            We measure everything because vague claims don&apos;t help you make decisions.
          </p>
        </FadeUpSection>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-8 rounded-3xl bg-surface border border-border/40 hover:border-primary/20 hover:shadow-xl transition-all duration-400 group"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mx-auto mb-5 group-hover:scale-105 transition-transform`}>
                <stat.icon size={22} className={stat.color} />
              </div>
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="text-sm font-semibold text-text-secondary mt-3">
                {stat.label}
              </p>
              <p className="text-[11px] text-text-secondary/50 mt-2 italic">
                {stat.source}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Case studies */}
        <FadeUpSection className="mb-6">
          <h3 className="text-2xl font-bold text-foreground tracking-tight text-center mb-12">
            Student success stories
          </h3>
        </FadeUpSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CASE_STUDIES.map((study, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              viewport={{ once: true }}
              className="p-7 rounded-3xl bg-surface border border-border/40 hover:border-primary/20 hover:shadow-xl transition-all duration-400 flex flex-col justify-between group"
            >
              <div>
                {/* Result badge */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight size={14} />
                    <span className="text-xs font-bold">{study.result}</span>
                  </div>
                  <span className="text-xs text-text-secondary/60 font-medium">
                    in {study.timeline}
                  </span>
                </div>

                <p className="text-sm text-text-secondary font-medium leading-relaxed italic mb-6">
                  &ldquo;{study.quote}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-border/30">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {study.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{study.name}</p>
                  <p className="text-[11px] text-text-secondary/70 font-medium">
                    {study.location} · {study.curriculum}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
