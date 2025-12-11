'use client';
import React from 'react';
import { motion } from 'framer-motion';
import CyberCard from './CyberCard';

export default function HowItWorks() {
    const steps = [
        {
            title: "Free Assessment",
            description: "We identify knowledge gaps with a fun, stress-free quiz.",
            icon: "📝"
        },
        {
            title: "Perfect Match",
            description: "Our AI pairs your child with a tutor who matches their learning style.",
            icon: "🤝"
        },
        {
            title: "Learn & Grow",
            description: "Engage in 1:1 sessions with interactive tools and real-time feedback.",
            icon: "🚀"
        },
        {
            title: "See Results",
            description: "Watch grades and confidence soar with personalized goals.",
            icon: "🏆"
        }
    ];

    return (
        <section className="py-20 lg:py-28 bg-[var(--color-surface)] relative overflow-hidden">
            {/* Decorational line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-100 dark:via-blue-900 to-transparent -translate-y-1/2 hidden lg:block" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                        How it works
                    </h2>
                    <p className="text-[var(--color-text-secondary)]">
                        A simple path to better grades and higher confidence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex justify-center">
                            <CyberCard
                                step={index + 1}
                                title={step.title}
                                description={step.description}
                                icon={step.icon}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
