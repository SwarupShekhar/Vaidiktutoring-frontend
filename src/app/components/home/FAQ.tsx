'use client';
import React, { useState, useRef, useEffect } from 'react';

export default function FAQ() {
    const questions = [
        {
            q: "How do you match my child with a tutor?",
            a: "We use a combination of your child's grade, subject needs, and learning style preference (Visual, Auditory, Hands-on) to find the perfect mentor from our vetted pool."
        },
        {
            q: "Are the sessions recorded?",
            a: "Yes! Every 1:1 session is recorded and available in your dashboard. This is great for reviewing tough concepts or checking in on your child's progress."
        },
        {
            q: "Can I change tutors if it's not a fit?",
            a: "Absolutely. We offer a 'Perfect Match Guarantee'. If the first session doesn't feel right, we'll match you with a new tutor and the first session is on us."
        },
        {
            q: "What is the cost?",
            a: "Rates vary by grade level and subject complexity, typically ranging from $25 to $60 per hour. We offer package discounts for semester-long commitments."
        },
        {
            q: "Do you follow my school's curriculum?",
            a: "Yes. Our tutors can work directly with your child's homework, school textbooks, and syllabus to ensure what they learn is immediately applicable to their grades."
        }
    ];

    return (
        <section className="py-20 px-6 bg-background">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-(--color-text-primary) mb-4">
                        Got questions?
                    </h2>
                    <p className="text-text-secondary">
                        Common questions from parents like you.
                    </p>
                </div>

                <div className="space-y-4">
                    {questions.map((item, index) => (
                        <AccordionItem key={index} question={item.q} answer={item.a} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function AccordionItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-(--color-text-primary) text-lg pr-4">{question}</span>
                <span className={`text-primary text-2xl transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                    +
                </span>
            </button>
            <div
                className="transition-all duration-300 ease-in-out"
                style={{
                    height: isOpen ? (contentRef.current?.scrollHeight || 0) : 0,
                    opacity: isOpen ? 1 : 0
                }}
            >
                <div ref={contentRef}>
                    <div className="px-6 pb-6 text-text-secondary leading-relaxed border-t border-slate-100 dark:border-slate-700/50 pt-4">
                        {answer}
                    </div>
                </div>
            </div>
        </div>
    );
}
