'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import FadeUpSection from './FadeUpSection';
import { ArrowRight, BadgeCheck, Video, Sparkles } from 'lucide-react';

export default function FinalCTASection() {
  const router = useRouter();
  const { user } = useAuthContext();

  const handleBookTrial = () => {
    if (user) {
      router.push('/bookings/new');
    } else {
      router.push('/login?redirect=/bookings/new');
    }
  };

  return (
    <section className="py-32 bg-foreground dark:bg-slate-900 overflow-hidden relative">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/15 blur-[120px] rounded-full -ml-48 -mb-48" />

      <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
        <FadeUpSection>
          <h2 className="text-4xl md:text-6xl font-black text-background dark:text-white tracking-tighter mb-6 leading-[0.95]">
            Give your child the attention classrooms can&apos;t provide
          </h2>

          <p className="text-background/60 dark:text-white/60 font-medium text-lg mb-12 max-w-2xl mx-auto">
            3 free sessions are all it takes to see the difference. No commitment,
            no credit card: experience our premium tutoring for yourself.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              onClick={handleBookTrial}
              className="group flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-full font-bold text-lg shadow-2xl shadow-primary/30 hover:shadow-3xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer w-full sm:w-auto justify-center"
            >
              Book a Free Trial Lesson
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="px-8 py-5 text-background/90 dark:text-white/90 font-semibold text-base rounded-full border-2 border-background/20 dark:border-white/20 hover:border-background/40 dark:hover:border-white/40 hover:bg-background/5 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer w-full sm:w-auto"
            >
              Speak with an Advisor
            </button>
          </div>

          {/* Reassurance strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            {[
              { icon: BadgeCheck, text: 'No credit card required' },
              { icon: Sparkles, text: '3 Free Premium Sessions', highlight: true },
              { icon: Video, text: 'With a real, vetted tutor' },
            ].map((item, i) => (
              <div 
                key={i} 
                className={`flex items-center gap-2 transition-all duration-300 ${
                  item.highlight 
                    ? 'bg-primary/20 px-4 py-2 rounded-full border border-primary/30 shadow-[0_0_20px_rgba(79,70,229,0.3)] animate-pulse scale-110' 
                    : ''
                }`}
              >
                <item.icon size={item.highlight ? 16 : 14} className={item.highlight ? 'text-primary' : 'text-primary/70'} />
                <span className={`text-sm font-medium ${item.highlight ? 'text-background dark:text-white font-bold' : 'text-background/50 dark:text-white/50'}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </FadeUpSection>
      </div>
    </section>
  );
}
