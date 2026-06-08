'use client';

import React from 'react';
import Reveal from './Reveal';
import FadeUpSection from './FadeUpSection';
import {
  Search,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const PILLARS = [
  {
    icon: Search,
    title: 'Diagnose',
    description: 'Every session starts by identifying the specific cognitive gap, not repeating last week\u2019s lesson.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/15',
  },
  {
    icon: Lightbulb,
    title: 'Teach',
    description: 'Short, targeted instruction using visual models designed for your child\u2019s specific grade and learning style.',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/15',
  },
  {
    icon: CheckCircle2,
    title: 'Verify',
    description: 'The student explains the concept back in their own words, the gold standard of learning science.',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/15',
  },
];

export default function OurApproachSection() {
  return (
    <section className="py-28 bg-surface/50 dark:bg-surface/30 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-primary/3 rounded-full blur-[100px] -ml-48 -mb-48" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — narrative */}
          <FadeUpSection>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-5">
              Our Approach
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tighter leading-tight mb-6">
              High-dosage tutoring,{' '}
              <span className="text-gradient-primary">
                built on learning science
              </span>
            </h2>
            <p className="text-text-secondary font-medium leading-relaxed text-base mb-6 max-w-lg">
              Research shows that students who receive frequent, structured 1-on-1
              attention gain the equivalent of an extra year of learning. Our
              Tutor Playbook ensures every session follows a proven
              Diagnose → Teach → Verify loop, so progress is consistent,
              not accidental.
            </p>
            <Link
              href="/our-approach"
              className="group inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline underline-offset-4 transition-all cursor-pointer"
            >
              Learn more about our method
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </Link>
          </FadeUpSection>

          {/* Right — 3 pillars */}
          <div className="space-y-5">
            {PILLARS.map((pillar, i) => (
              <Reveal
                key={i}
                variant="right"
                delay={i * 0.12}
                className={`flex items-start gap-5 p-6 rounded-2xl bg-surface border ${pillar.borderColor} hover:shadow-lg transition-all duration-300 cursor-pointer group`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${pillar.bgColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}
                >
                  <pillar.icon size={22} className={pillar.color} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground tracking-tight mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-text-secondary font-medium leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
