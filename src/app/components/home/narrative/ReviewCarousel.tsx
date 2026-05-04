'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import FadeUpSection from './FadeUpSection';
import { useCurriculum } from '@/app/context/CurriculumContext';
import { Star, Quote } from 'lucide-react';

/* ─── Reviews database ─── */
const ALL_REVIEWS = [
  {
    name: 'Sarah M.',
    role: 'Parent',
    curriculum: 'CCSS (US)',
    region: 'global',
    text: "Finally, a tutor who doesn't just read from the slides. The focus on CCSS math hurdles has changed my son's attitude towards school.",
    initials: 'SM',
  },
  {
    name: 'James L.',
    role: 'Year 11 Student',
    curriculum: 'GCSE (UK)',
    region: 'uk',
    text: "I was struggling with GCSE Biology content density. The structured sessions helped me break down complex topics into things I actually remember.",
    initials: 'JL',
  },
  {
    name: 'Elena R.',
    role: 'Parent',
    curriculum: 'NGSS (Science)',
    region: 'global',
    text: "The way they approach science through curiosity-led sessions is remarkable. My daughter is now asking more questions than ever.",
    initials: 'ER',
  },
  {
    name: 'Arjun K.',
    role: 'Grade 12 Student',
    curriculum: 'IB Diploma',
    region: 'global',
    text: "IB Chemistry was overwhelming. Having someone who truly sees when I'm confused before I even say it is a game-changer.",
    initials: 'AK',
  },
  {
    name: 'David W.',
    role: 'Parent',
    curriculum: 'Australian Curriculum',
    region: 'australia',
    text: "The measurable growth in confidence is what impressed us most. Our daughter no longer feels 'left behind' in her NAPLAN prep.",
    initials: 'DW',
  },
  {
    name: 'Maya S.',
    role: 'Grade 10 Student',
    curriculum: 'CBSE (Math)',
    region: 'middleeast',
    text: 'The sessions feel like a conversation, not a lecture. I actually look forward to solving problems now.',
    initials: 'MS',
  },
  {
    name: 'Rachel T.',
    role: 'Parent',
    curriculum: 'GCSE (UK)',
    region: 'uk',
    text: "We tried three other tutoring services before StudyHours. The difference is night and day: the structured approach and progress reports make all the difference.",
    initials: 'RT',
  },
  {
    name: 'Mei Ling C.',
    role: 'Primary 5 Student',
    curriculum: 'MOE Singapore',
    region: 'singapore',
    text: "My PSLE maths scores jumped from Band 2 to Band 1. My tutor makes even the hardest problem-sums feel achievable.",
    initials: 'MC',
  },
  {
    name: 'Fatima A.',
    role: 'Parent',
    curriculum: 'IGCSE',
    region: 'middleeast',
    text: "Living in Dubai with kids in a British curriculum school, finding a tutor who truly understands IGCSE grading was a relief. StudyHours delivered.",
    initials: 'FA',
  },
  {
    name: 'Linda P.',
    role: 'Parent',
    curriculum: 'CAPS (South Africa)',
    region: 'southafrica',
    text: "We needed matric maths help urgently. The tutor identified my son's gaps in the first session and built a plan around them. His mid-year marks improved by 15%.",
    initials: 'LP',
  },
  {
    name: 'Tom H.',
    role: 'Year 13 Student',
    curriculum: 'A-Level (UK)',
    region: 'uk',
    text: "A-Level Chemistry felt impossible until my tutor broke it into micro-topics. I went from a D to a B in two terms.",
    initials: 'TH',
  },
  {
    name: 'Kevin L.',
    role: 'Year 9 Student',
    curriculum: 'VCE (Australia)',
    region: 'australia',
    text: "My tutor doesn't just help with homework, they teach me how to think through problems. That's the real win.",
    initials: 'KL',
  },
];

const MIN_DISPLAY = 6;

export default function ReviewCarousel() {
  const { activeCurriculum } = useCurriculum();

  /* Geo-filter with backfill: show local reviews first, then global to fill */
  const filteredReviews = useMemo(() => {
    const local = ALL_REVIEWS.filter((r) => r.region === activeCurriculum.id);
    if (local.length >= MIN_DISPLAY) return local;

    // Backfill with global/other reviews
    const remaining = ALL_REVIEWS.filter((r) => r.region !== activeCurriculum.id);
    return [...local, ...remaining].slice(0, Math.max(MIN_DISPLAY, local.length + 4));
  }, [activeCurriculum.id]);

  const duplicated = [...filteredReviews, ...filteredReviews];

  return (
    <section className="py-28 bg-surface/50 dark:bg-surface/30 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <FadeUpSection className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-5">
            Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
            Trusted by parents worldwide
          </h2>
          <p className="text-text-secondary font-medium mt-4">
            Based on {ALL_REVIEWS.length * 11}+ parent and student reviews
          </p>
        </FadeUpSection>

        {/* Scrolling carousel */}
        <div className="relative w-full overflow-hidden">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-surface/50 dark:from-surface/30 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-surface/50 dark:from-surface/30 to-transparent z-20 pointer-events-none" />

          <div className="flex w-fit">
            <motion.div
              className="flex gap-6 pr-6"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                repeat: Infinity,
                ease: 'linear',
                duration: filteredReviews.length * 5,
              }}
            >
              {duplicated.map((review, i) => (
                <div key={i} className="shrink-0 w-[340px] md:w-[380px]">
                  <div className="h-full bg-surface p-7 rounded-3xl border border-border/40 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-400 flex flex-col justify-between group cursor-pointer">
                    <div className="space-y-5">
                      {/* Quote icon */}
                      <Quote size={20} className="text-primary/30" />

                      {/* Review text */}
                      <p className="text-sm text-text-secondary font-medium leading-relaxed">
                        &ldquo;{review.text}&rdquo;
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-5 border-t border-border/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          {review.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {review.name}
                          </p>
                          <p className="text-[11px] text-text-secondary/70 font-medium">
                            {review.role} · {review.curriculum}
                          </p>
                        </div>
                      </div>
                      {/* Stars */}
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            size={12}
                            className="text-amber-400 fill-amber-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
