'use client';

import React from 'react';

export default function SubjectMetrics() {
    return (
        <section className="w-full py-20 px-6 relative overflow-hidden bg-[var(--color-surface)]">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Text & Key Stats */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-deep-navy)] mb-6">
                            Real results, real confidence.
                        </h2>
                        <p className="text-lg text-[var(--color-text-secondary)] mb-12">
                            Our structured learning paths are designed to produce measurable academic improvement.
                        </p>

                        <div className="space-y-10">
                            <div className="flex gap-6 items-start">
                                <div className="text-4xl md:text-5xl font-extrabold text-[var(--color-sapphire)]">
                                    95%
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-[var(--color-deep-navy)]">Confidence Boost</p>
                                    <p className="text-[var(--color-text-secondary)]">of students report higher academic confidence</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="text-4xl md:text-5xl font-extrabold text-[var(--color-primary)]">
                                    72%
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-[var(--color-deep-navy)]">Grade Improvement</p>
                                    <p className="text-[var(--color-text-secondary)]">average grade improvement within three months</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] opacity-80">
                                    4.9/5
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-[var(--color-deep-navy)]">Parent Satisfaction</p>
                                    <p className="text-[var(--color-text-secondary)]">average rating from over 10,000 parents</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Progress Visualization */}
                    <div className="bg-[var(--color-surface)] rounded-[2rem] p-8 shadow-2xl shadow-blue-900/10 border border-[var(--color-border)] h-full flex flex-col justify-between transform hover:scale-[1.02] transition-transform duration-500">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-[var(--color-deep-navy)] mb-2">Trackable Progress</h3>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                We visualize growth over time, so you always know where your child stands.
                            </p>
                        </div>

                        {/* Chart Container */}
                        <div className="flex-1 flex items-end justify-between gap-3 px-2 pb-2 relative z-10 min-h-[220px]">

                            {/* Background Reference Lines */}
                            <div className="absolute inset-x-0 bottom-6 top-0 flex flex-col justify-between pointer-events-none opacity-20 dark:opacity-10">
                                <div className="border-t border-dashed border-[var(--color-border)] w-full h-0"></div>
                                <div className="border-t border-dashed border-[var(--color-border)] w-full h-0"></div>
                                <div className="border-t border-dashed border-[var(--color-border)] w-full h-0"></div>
                                <div className="border-t border-dashed border-[var(--color-border)] w-full h-0"></div>
                            </div>

                            {/* Bars */}
                            {[35, 45, 52, 65, 78, 92].map((height, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 group/bar w-full relative z-20">
                                    <div className="relative w-full max-w-[40px] flex items-end h-[180px]">
                                        <div
                                            style={{ height: `${height}%` }}
                                            className={`w-full rounded-t-lg transition-all duration-1000 ease-out relative group-hover/bar:brightness-110 shadow-sm ${i === 5 ? 'bg-gradient-to-t from-[var(--color-sapphire)] to-blue-400' :
                                                i >= 4 ? 'bg-[var(--color-sapphire)]' : 'bg-[var(--color-sapphire)]/40'
                                                }`}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--color-deep-navy)] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                {height}%
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-[var(--color-text-secondary)] font-medium">M{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
