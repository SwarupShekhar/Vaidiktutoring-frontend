import React from 'react';
import { Layers, ShieldCheck, TrendingUp, Zap } from 'lucide-react';

// Define types locally for now, mirroring the backend entities
type CurriculumFramework = {
    region: 'US' | 'UK' | 'International';
    frameworks: string[];
};

type Stage = {
    key: 'foundation' | 'core' | 'advanced';
    label: string;
    ageRange: string;
    focus: string;
    outcome: string;
    curriculumFrameworks: CurriculumFramework[];
};

type Subject = {
    id: string;
    name: string;
    tagline: string;
    skillPillars: string[];
    stages: Stage[];
};

type LearningPathProps = {
    subject: Subject | null;
    isLoading: boolean;
};

const pillarIcons = [Layers, ShieldCheck, Zap, TrendingUp];

export default function SubjectLearningPath({ subject, isLoading }: LearningPathProps) {
    if (isLoading) {
        return (
            <div className="animate-pulse space-y-8 mt-12">
                <div className="grid grid-cols-4 gap-4 h-32">
                    {[1, 2, 3, 4].map(i => <div key={i} className="bg-[var(--color-surface)] rounded-2xl" />)}
                </div>
                <div className="h-96 bg-[var(--color-surface)] rounded-3xl" />
            </div>
        );
    }

    if (!subject) return null;

    return (
        <div className="space-y-20 mt-12 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Skill Pillars */}
            <section>
                {/* No header needed here per user request, just the row of cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subject.skillPillars.map((pillar, idx) => {
                        const Icon = pillarIcons[idx % pillarIcons.length];
                        return (
                            <div key={idx} className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 mb-4 rounded-full bg-[var(--color-ice-blue)] flex items-center justify-center text-[var(--color-sapphire)]">
                                    <Icon size={20} />
                                </div>
                                <h3 className="font-bold text-[var(--color-deep-navy)] text-lg leading-tight">{pillar}</h3>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Learning Stages - The Core */}
            <section>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-[var(--color-deep-navy)]">The Learning Progression</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Learning Journey Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[15%] left-[25%] right-[25%] h-0.5 border-t-2 border-dashed border-[var(--color-border)] pointer-events-none z-0" />

                    {subject.stages.map((stage, idx) => {
                        // Color coding based on stage
                        const isFoundation = stage.key === 'foundation';
                        const isCore = stage.key === 'core';
                        const isAdvanced = stage.key === 'advanced';

                        let accentColorClass = isFoundation ? 'text-green-600' : isCore ? 'text-yellow-600' : 'text-blue-600';
                        let borderColorClass = isFoundation ? 'border-green-100' : isCore ? 'border-yellow-100' : 'border-blue-100';
                        let iconEmoji = isFoundation ? '🟢' : isCore ? '🟡' : '🔵';

                        return (
                            <div key={stage.key} className="relative group flex flex-col h-full">
                                {/* Connector Arrow (Mobile) */}
                                {idx > 0 && (
                                    <div className="flex md:hidden justify-center items-center py-4 text-[var(--color-border)]">
                                        <div className="w-0.5 h-8 bg-gradient-to-b from-[var(--color-border)] to-transparent" />
                                    </div>
                                )}

                                <div className={`flex flex-col bg-[var(--color-surface)] rounded-3xl p-8 border-2 ${borderColorClass} shadow-xl shadow-gray-200/50 dark:shadow-none hover:-translate-y-1 transition-transform duration-300 relative z-10 h-full`}>
                                    {/* Header */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-2xl">{iconEmoji}</span>
                                            <span className={`text-sm font-bold uppercase tracking-wider ${accentColorClass} dark:text-opacity-90 bg-[var(--color-background)] px-2 py-0.5 rounded-md border border-current opacity-80`}>
                                                Ages {stage.ageRange}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-extrabold text-[var(--color-deep-navy)]">{stage.label}</h3>
                                    </div>

                                    {/* Body */}
                                    <div className="space-y-4 mb-8 flex-grow">
                                        <div>
                                            <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase block mb-1">Focus</span>
                                            <p className="font-medium text-[var(--color-text-primary)] leading-snug">{stage.focus}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase block mb-1">Outcome</span>
                                            <p className="font-medium text-[var(--color-text-primary)] leading-snug">{stage.outcome}</p>
                                        </div>
                                    </div>

                                    {/* Footer: Aligned With */}
                                    <div className={`mt-auto pt-6 border-t ${borderColorClass} border-dashed`}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-xs font-black text-[var(--color-deep-navy)] uppercase tracking-tighter">Aligned With:</span>
                                        </div>
                                        <div className="space-y-3">
                                            {stage.curriculumFrameworks.map((cf, index) => (
                                                <div key={index} className="flex items-start gap-2">
                                                    <span className="text-lg leading-none">{cf.region === 'US' ? '🇺🇸' : cf.region === 'UK' ? '🇬🇧' : '🌍'}</span>
                                                    <div className="text-sm text-[var(--color-text-primary)] font-bold">
                                                        <span className="text-[var(--color-text-secondary)] font-medium mr-1 uppercase text-[10px] tracking-wide">
                                                            {cf.region === 'US' ? 'US Core' : cf.region === 'UK' ? 'UK Nat.' : 'Intl.'}
                                                        </span>
                                                        {/* We can simplify this display as chips are too busy here */}
                                                        <span className="block text-xs text-[var(--color-text-secondary)] font-normal opacity-85 truncate max-w-[200px]">
                                                            {cf.frameworks.join(', ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Arrow */}
                                {idx < 2 && (
                                    <div className="hidden md:flex absolute -right-4 top-[15%] -translate-y-1/2 items-center justify-center z-20 text-[var(--color-sapphire)]">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
