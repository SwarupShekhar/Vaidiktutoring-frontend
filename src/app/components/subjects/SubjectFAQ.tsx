'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubjectFAQ() {
    const questions = [
        {
            q: "Is this aligned with my child's school curriculum?",
            a: "Yes. Whether your child follows the US Common Core, UK National Curriculum, IB, or Cambridge standards, our tutors align every session directly with their specific school goals."
        },
        {
            q: "How are tutors selected?",
            a: "We only hire the top 3% of applicants. Every tutor undergoes a rigorous vetting process: subject proficiency testing, a mock teaching session with a master tutor, and full background checks."
        },
        {
            q: "How is progress measured?",
            a: "We provide detailed feedback after every lesson. Additionally, we conduct a diagnostic assessment every 8 weeks to track quantitative growth against established academic benchmarks."
        },
        {
            q: "What if my child doesn't click with the tutor?",
            a: "We offer a 'Perfect Match Guarantee'. If you feel the tutor isn't the right fit after the first session, we'll rematch you immediately and your next session is free."
        }
    ];

    return (
        <section className="py-24 px-6 bg-[var(--color-background)]">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-[var(--color-deep-navy)] mb-4">
                        Common Questions
                    </h2>
                    <p className="text-[var(--color-text-secondary)]">
                        Everything you need to know about our structured learning approach.
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

    return (
        <div className="border border-[var(--color-border)] rounded-2xl bg-[var(--color-surface)] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--color-background)] transition-colors"
            >
                <span className="font-bold text-[var(--color-text-primary)] text-lg pr-8">{question}</span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] transition-all duration-300 ${isOpen ? 'bg-[var(--color-primary)] text-white rotate-45 border-[var(--color-primary)]' : 'bg-[var(--color-surface)]'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="px-6 pb-6 text-[var(--color-text-primary)] leading-relaxed border-t border-[var(--color-border)]/50 pt-4 bg-[var(--color-background)]/30">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
