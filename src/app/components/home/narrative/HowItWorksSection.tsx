'use client';

import React from 'react';
import Reveal from './Reveal';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import FadeUpSection from './FadeUpSection';
import {
  MessageSquareText,
  UserCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: MessageSquareText,
    title: 'Book a Free Trial',
    description:
      "Tell us your child's exam board, subjects, and pain points. We'll design the first session around their actual gaps, not a generic placement test.",
    accent: 'from-sapphire to-indigo-500',
    iconColor: 'text-sapphire',
    badge: 'Step One',
  },
  {
    number: '02',
    icon: UserCheck,
    title: 'Match with a Specialist',
    description:
      "We pair your child with a tutor who specialises in their specific curriculum. Every match is vetted through our rigorous 5-stage screening process.",
    accent: 'from-emerald-500 to-teal-500',
    iconColor: 'text-emerald-500',
    badge: 'Step Two',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'See Real Progress',
    description:
      "Structured sessions with real-time feedback and a progress report after every lesson. Parents stay informed and students stay motivated.",
    accent: 'from-amber-500 to-orange-500',
    iconColor: 'text-amber-500',
    badge: 'Step Three',
  },
];

export default function HowItWorksSection() {
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
    <section id="how-it-works" className="py-32 bg-background relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sapphire/5 rounded-full blur-[160px] -mr-96 -mt-96 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -ml-48 -mb-48" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Header */}
        <FadeUpSection className="text-center mb-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sapphire/10 text-sapphire text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-sapphire/20 backdrop-blur-sm">
            <Sparkles size={12} className="animate-spin-slow" />
            The Experience
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-deep-navy dark:text-white tracking-tighter leading-[0.9] mb-8">
            Three steps to <br /> <span className="text-gradient-primary">better learning</span>
          </h2>
          <p className="text-text-secondary font-medium max-w-xl mx-auto text-xl leading-relaxed opacity-80">
            From first trial to measurable improvement, here is how StudyHours transforms the learning experience.
          </p>
        </FadeUpSection>

        {/* Steps grid with connecting path */}
        <div className="relative mb-24">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[28%] left-[10%] right-[10%] h-[2px] bg-linear-to-r from-transparent via-border/50 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            {STEPS.map((step, i) => (
              <Reveal
                key={i}
                variant="up"
                delay={i * 0.2}
                className="group"
              >
                <div className="relative h-full flex flex-col items-center text-center">
                  {/* Icon Node */}
                  <div className="relative mb-10">
                    <div className={`absolute -inset-4 bg-linear-to-br ${step.accent} opacity-0 group-hover:opacity-20 blur-2xl rounded-full transition-opacity duration-700`} />
                    <div className="w-20 h-20 rounded-4xl bg-surface border border-border/40 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 relative z-10 group-hover:border-sapphire/30">
                      <step.icon size={32} className={step.iconColor} />
                    </div>
                    {/* Number Overlay */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-deep-navy text-white text-[10px] font-black flex items-center justify-center shadow-lg border-2 border-background z-20">
                      {step.number}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-8 rounded-[3rem] bg-surface/50 backdrop-blur-xl border border-border/40 group-hover:border-sapphire/20 group-hover:bg-surface/80 transition-all duration-500 shadow-sm group-hover:shadow-3xl group-hover:shadow-sapphire/5 grow flex flex-col w-full">
                    <div className="mb-4">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] bg-linear-to-r ${step.accent} bg-clip-text text-transparent`}>
                        {step.badge}
                      </span>
                    </div>
                    <h3 className="text-3xl font-black text-deep-navy dark:text-white mb-5 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-base text-text-secondary font-medium leading-relaxed mb-8 grow">
                      {step.description}
                    </p>
                    <div className="pt-6 border-t border-border/10 flex justify-center">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-sapphire opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        Details <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CTA after steps */}
        <FadeUpSection className="text-center">
          <div className="relative inline-block group">
            <div className="absolute -inset-4 bg-sapphire/30 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <button
              onClick={handleBookTrial}
              className="relative flex items-center gap-4 px-12 py-6 bg-linear-to-br from-sapphire to-primary text-white rounded-full font-black text-xl shadow-2xl shadow-sapphire/30 hover:scale-[1.03] active:scale-[0.97] transition-all duration-500 cursor-pointer overflow-hidden"
            >
              <span className="relative z-10">Start Your Free Trial</span>
              <ArrowRight
                size={24}
                className="relative z-10 group-hover:translate-x-2 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
          <p className="mt-8 text-sm text-text-secondary font-bold tracking-wide uppercase opacity-60">
            No credit card required, cancel anytime
          </p>
        </FadeUpSection>
      </div>
    </section>
  );
}
