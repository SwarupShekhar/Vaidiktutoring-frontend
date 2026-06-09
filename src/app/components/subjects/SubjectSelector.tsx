'use client';
import React from 'react';
import { Calculator, FlaskConical, BookOpen } from 'lucide-react';

type SelectorProps = {
    activeSubject: string;
    onSelect: (id: string) => void;
};

const subjects = [
    { id: 'math', name: 'Math', tagline: 'Logical thinking & problem solving', Icon: Calculator, color: '#2563eb' },
    { id: 'science', name: 'Science', tagline: 'Concept clarity & scientific reasoning', Icon: FlaskConical, color: '#059669' },
    { id: 'english', name: 'English', tagline: 'Fluency & confidence', Icon: BookOpen, color: '#dc2626' },
];

export default function SubjectSelector({ activeSubject, onSelect }: SelectorProps) {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {subjects.map((subject) => {
                    const Icon = subject.Icon;
                    const isActive = activeSubject === subject.id;
                    return (
                        <button
                            key={subject.id}
                            onClick={() => onSelect(subject.id)}
                            className="relative group focus:outline-none w-full text-left"
                            style={{
                                '--hover-color': subject.color,
                            } as React.CSSProperties}
                        >
                            <div 
                                className="flex flex-col items-center text-center w-full p-8 bg-surface rounded-2xl border-2 transition-all duration-200 cursor-pointer group-hover:-translate-y-0.5"
                                style={{
                                    borderColor: isActive ? subject.color : 'var(--color-border)',
                                    boxShadow: isActive ? `0 8px 30px ${subject.color}25` : '0 4px 6px rgba(0,0,0,0.05)',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.borderColor = subject.color;
                                        e.currentTarget.style.boxShadow = `0 8px 30px ${subject.color}15`;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.borderColor = 'var(--color-border)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                                    }
                                }}
                            >
                                <div 
                                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" 
                                    style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                                >
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-(--color-text-primary) mb-1">{subject.name}</h3>
                                <p className="text-[13px] text-text-secondary leading-snug">{subject.tagline}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
