'use client';

import React from 'react';
import Reveal from './Reveal';
import { Check, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


export default function AssessmentJourney() {
  return (
    <section className="relative py-32 overflow-hidden bg-background dark:bg-deep-navy/50">
      {/* Background Accents */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-sapphire/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sapphire/10 text-sapphire text-xs font-black uppercase tracking-[0.2em] mb-6 border border-sapphire/20">
            <Sparkles size={12} /> The Method
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-deep-navy dark:text-white mb-6 tracking-tight leading-[1.1]">
            Your 3-Session <span className="text-gradient-primary">Diagnostic Journey</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
            We don't just teach. We diagnose, fix, and plan for long-term academic success.
          </p>
        </div>

        {/* Live Dashboard Container */}
        <Reveal
          variant="up"
          className="relative bg-white/90 dark:bg-surface/90 border border-border/40 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl overflow-hidden"
        >
          {/* Dashboard Header Bar */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-text-secondary font-black uppercase tracking-widest opacity-60">
                Live Assessment Dashboard
              </span>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
              Active Session
            </div>
          </div>

          {/* Dashboard Content: 3-Step Workflow */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Connecting Lines (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-[30%] right-[30%] h-px bg-linear-to-r from-sapphire/50 via-primary/50 to-emerald-500/50 opacity-30" />

            {/* Step 1: The Diagnostic */}
            <div className="relative flex flex-col bg-gray-50/50 dark:bg-deep-navy/40 rounded-2xl p-6 border border-gray-100 dark:border-white/5 hover:border-sapphire/20 transition-all duration-300">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-sapphire text-white flex items-center justify-center font-black text-sm shadow-lg shadow-sapphire/20">
                1
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sapphire mb-3 block">
                Session 1: Diagnostic
              </span>
              <h3 className="text-xl font-black text-deep-navy dark:text-white mb-4">Identify the Root Cause</h3>
              
              {/* Image Asset */}
              <div className="relative w-full h-36 mb-4 overflow-hidden rounded-xl border border-gray-100 dark:border-white/5">
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/q_auto,f_auto/v1779096784/Minimalist_3D_isometric_illustration_of_202605181501_nh7if6.jpg"
                  quality={60}
                  alt="Diagnostic Assessment"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />

              </div>
              
              {/* Mock UI: Test Question */}
              <div className="bg-white dark:bg-surface/50 rounded-xl p-4 border border-gray-100 dark:border-white/5 mt-auto shadow-xs">
                <div className="text-xs text-text-secondary opacity-60 mb-2 font-mono">Q14: Algebra I</div>
                <p className="text-sm text-deep-navy dark:text-white font-bold mb-3">Solve for x: <span className="text-sapphire">2x + 5 = 15</span></p>
                <div className="space-y-2">
                  <div className="text-xs p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-text-secondary flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <span>A) x = 10</span>
                    <span className="text-[10px] text-red-400 opacity-0 hover:opacity-100">Common Trap</span>
                  </div>
                  <div className="text-xs p-2 rounded-lg bg-sapphire/10 dark:bg-sapphire/20 border border-sapphire/20 dark:border-sapphire/40 text-sapphire dark:text-white flex justify-between items-center">
                    <span>B) x = 5</span>
                    <Check size={12} className="text-sapphire" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Gap Discovery */}
            <div className="relative flex flex-col bg-gray-50/50 dark:bg-deep-navy/40 rounded-2xl p-6 border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-all duration-300">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm shadow-lg shadow-primary/20">
                2
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3 block">
                Session 2: Targeted Help
              </span>
              <h3 className="text-xl font-black text-deep-navy dark:text-white mb-4">Fix the Concept Gap</h3>
              
              {/* Image Asset */}
              <div className="relative w-full h-36 mb-4 overflow-hidden rounded-xl border border-gray-100 dark:border-white/5">
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/q_auto,f_auto/v1779096802/Minimalist_3D_isometric_illustration_of_202605181503_f2tcrx.jpg"
                  quality={60}
                  alt="Concept Gap Fix"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />

              </div>
              
              {/* Mock UI: Gap List */}
              <div className="bg-white dark:bg-surface/50 rounded-xl p-4 border border-gray-100 dark:border-white/5 mt-auto shadow-xs">
                <div className="text-xs text-text-secondary opacity-60 mb-3 font-mono">Concept Analysis</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-deep-navy dark:text-white font-bold">Fractions</span>
                      <span className="text-emerald-500 font-black">92%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="w-[92%] h-full bg-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-deep-navy dark:text-white font-bold">Linear Equations</span>
                      <span className="text-amber-500 font-black">45%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="w-[45%] h-full bg-amber-500" />
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-amber-500 font-black uppercase tracking-wider">
                  <AlertCircle size={10} /> Focus of Session 2
                </div>
              </div>
            </div>

            {/* Step 3: The Roadmap */}
            <div className="relative flex flex-col bg-gray-50/50 dark:bg-deep-navy/40 rounded-2xl p-6 border border-gray-100 dark:border-white/5 hover:border-emerald-500/20 transition-all duration-300">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-emerald-500/20">
                3
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-3 block">
                Session 3: Progress Review
              </span>
              <h3 className="text-xl font-black text-deep-navy dark:text-white mb-4">Build the Long-Term Plan</h3>
              
              {/* Image Asset */}
              <div className="relative w-full h-36 mb-4 overflow-hidden rounded-xl border border-gray-100 dark:border-white/5">
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/q_auto,f_auto/v1779096852/Minimalist_3D_isometric_illustration_of_202605181504_t3z55e.jpg"
                  quality={60}
                  alt="Improvement Plan"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />

              </div>
              
              {/* Mock UI: Roadmap */}
              <div className="bg-white dark:bg-surface/50 rounded-xl p-4 border border-gray-100 dark:border-white/5 mt-auto shadow-xs">
                <div className="text-xs text-text-secondary opacity-60 mb-3 font-mono">Custom Roadmap</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <Check size={10} />
                    </div>
                    <div className="text-xs">
                      <p className="text-deep-navy dark:text-white font-bold">Diagnose Gaps</p>
                      <p className="text-text-secondary text-[10px] opacity-60">Completed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <Check size={10} />
                    </div>
                    <div className="text-xs">
                      <p className="text-deep-navy dark:text-white font-bold">Targeted Gap Fix</p>
                      <p className="text-text-secondary text-[10px] opacity-60">Completed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-emerald-500 animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-xs">
                      <p className="text-emerald-500 font-bold">Long-Term Strategy</p>
                      <p className="text-text-secondary text-[10px] opacity-60">Next Step</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-white/40">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-deep-navy dark:text-white">Interactive Assessment</p>
                <p className="text-xs text-text-secondary opacity-60">3 sessions of 30–40 mins each</p>
              </div>
            </div>
            
            <Link href="/signup" className="flex items-center gap-2 px-8 py-3.5 bg-linear-to-br from-sapphire to-primary text-white rounded-full font-black text-sm shadow-lg shadow-sapphire/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer">
              Get Your Assessment <ArrowRight size={14} />
            </Link>

          </div>
        </Reveal>
      </div>
    </section>
  );
}
