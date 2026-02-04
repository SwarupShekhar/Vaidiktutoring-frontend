'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SelectorProps = {
    activeSubject: string;
    onSelect: (id: string) => void;
};

const subjects = [
    { id: 'math', name: 'Math', tagline: 'Logical thinking & problem solving' },
    { id: 'science', name: 'Science', tagline: 'Concept clarity & scientific reasoning' },
    { id: 'english', name: 'English', tagline: 'Fluency & confidence' },
];

export default function SubjectSelector({ activeSubject, onSelect }: SelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {subjects.map((subject) => (
                <button
                    key={subject.id}
                    onClick={() => onSelect(subject.id)}
                    className="relative group focus:outline-none"
                >
                    <motion.div
                        initial={false}
                        animate={{
                            scale: activeSubject === subject.id ? 1.05 : 1,
                            backgroundColor: activeSubject === subject.id
                                ? 'var(--color-surface)'
                                : 'var(--color-surface)',
                            borderColor: activeSubject === subject.id
                                ? 'var(--color-sapphire)'
                                : 'var(--color-border)',
                            boxShadow: activeSubject === subject.id
                                ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                                : '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={`p-6 rounded-2xl border-2 text-left h-full transition-colors duration-300 relative overflow-hidden`}
                    >
                        {/* Active Accent Bar */}
                        <AnimatePresence>
                            {activeSubject === subject.id && (
                                <motion.div
                                    layoutId="active-subject-bar"
                                    className="absolute bottom-0 left-0 right-0 h-1.5 bg-[var(--color-sapphire)]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                        </AnimatePresence>

                        <div className="flex items-center justify-between mb-2">
                            <h3 className={`text-xl font-bold transition-colors duration-300 ${activeSubject === subject.id ? 'text-[var(--color-sapphire)]' : 'text-[var(--color-text-primary)]'
                                }`}>
                                {subject.name}
                            </h3>
                            {activeSubject === subject.id && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-2.5 h-2.5 rounded-full bg-[var(--color-sapphire)]"
                                />
                            )}
                        </div>
                        <p className={`text-sm transition-colors duration-300 ${activeSubject === subject.id ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                            }`}>
                            {subject.tagline}
                        </p>
                    </motion.div>
                </button>
            ))}
        </div>
    );
}

