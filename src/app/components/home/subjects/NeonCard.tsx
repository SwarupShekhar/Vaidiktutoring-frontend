'use client';
import React from 'react';
import styles from './NeonCard.module.css';

interface NeonCardProps {
    title: string;
    description: string;
    icon?: string;
    topics: string[];
    gradient?: string;
}

const NeonCard = ({ title, description, icon, topics, gradient }: NeonCardProps) => {
    return (
        <div style={{ '--neon-gradient': gradient } as React.CSSProperties}>
            <div className={styles.card}>
                <div className={styles.content}>
                    <div className="flex flex-col h-full w-full">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0">
                                {icon || '📚'}
                            </div>
                            <h3 className="text-xl font-bold leading-tight">{title}</h3>
                        </div>

                        <p className="text-sm opacity-80 mb-4 line-clamp-2">
                            {description}
                        </p>

                        <div className="mt-auto space-y-2">
                            <p className="text-xs font-bold uppercase tracking-wider opacity-60">Popular Topics</p>
                            <div className="flex flex-wrap gap-2">
                                {topics.slice(0, 3).map((topic, i) => (
                                    <span key={i} className="text-xs px-2 py-1 rounded-md bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/5">
                                        {topic}
                                    </span>
                                ))}
                                {topics.length > 3 && (
                                    <span className="text-xs px-2 py-1">+ {topics.length - 3} more</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NeonCard;
