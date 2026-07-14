'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FAQItemType {
    q: string;
    a: string;
}

interface SubjectFAQProps {
    items?: FAQItemType[];
    title?: string;
    description?: string;
}

export default function SubjectFAQ({ 
    items, 
    title = "Common Questions", 
    description = "Everything you need to know about our structured learning approach." 
}: SubjectFAQProps) {
    const defaultQuestions = [
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

    const questions = items || defaultQuestions;

    return (
        <section className="py-16 md:py-24 px-6 bg-background">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10 md:mb-16">
                    <p className="text-text-secondary text-sm md:text-base">
                        {description}
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
        <div className="group border-b border-border/50 bg-transparent overflow-hidden transition-all">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-8 text-left transition-colors"
            >
                <h3 className="font-bold text-deep-navy dark:text-white text-xl pr-8 tracking-tight leading-snug group-hover:text-primary transition-colors">{question}</h3>
                <span className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-primary transition-all duration-500 ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-primary/5 hover:bg-primary/10'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                    </svg>
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="pb-8 text-text-secondary font-normal leading-relaxed text-lg opacity-90">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
