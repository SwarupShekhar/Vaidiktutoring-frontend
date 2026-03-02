import React from 'react';
import { Compass, Medal, Rocket } from 'lucide-react';

export default function LearnerType() {
    return (
        <section className="mb-32">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-deep-navy mb-4">Tailored for Every Learner</h2>
                <p className="text-lg text-text-secondary">We meet students exactly where they are.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Needs Support -> Remediation Path */}
                <div className="group relative bg-surface p-8 rounded-4xl border border-border shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-orange-300 to-orange-500 rounded-t-4xl" />
                    <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6 group-hover:scale-110 transition-transform">
                        <Compass size={28} />
                    </div>

                    <h3 className="text-xl font-bold text-deep-navy mb-1">Remediation Path</h3>
                    <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-4">Needs Support?</p>

                    <p className="text-(--color-text-primary) text-sm leading-relaxed mb-6">
                        We build confidence by revisiting foundational gaps and using scaffolded learning techniques to bring students up to speed efficiently.
                    </p>

                    <ul className="space-y-2 text-sm text-text-secondary">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                            Confidence Building
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                            Gap Analysis
                        </li>
                    </ul>
                </div>

                {/* On Track -> Mastery Path */}
                <div className="group relative bg-surface p-8 rounded-4xl border-2 border-sapphire shadow-2xl scale-105 z-10">
                    <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-sapphire to-blue-600 rounded-t-4xl" />
                    <div className="w-14 h-14 bg-ice-blue rounded-2xl flex items-center justify-center text-sapphire mb-6 group-hover:scale-110 transition-transform">
                        <Medal size={28} />
                    </div>

                    <h3 className="text-xl font-bold text-deep-navy mb-1">Mastery Path</h3>
                    <p className="text-xs font-bold text-sapphire uppercase tracking-widest mb-4">On Track?</p>

                    <p className="text-(--color-text-primary) text-sm leading-relaxed mb-6">
                        We reinforce school learning with rigorous practice and conceptual deepening, ensuring students excel in exams and assessments.
                    </p>

                    <ul className="space-y-2 text-sm text-text-secondary">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-sapphire" />
                            Exam Excellence
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-sapphire" />
                            Conceptual Depth
                        </li>
                    </ul>
                </div>

                {/* Advanced -> Challenge Path */}
                <div className="group relative bg-surface p-8 rounded-4xl border border-border shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-purple-400 to-purple-600 rounded-t-4xl" />
                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                        <Rocket size={28} />
                    </div>

                    <h3 className="text-xl font-bold text-deep-navy mb-1">Challenge Path</h3>
                    <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-4">Advanced Learner?</p>

                    <p className="text-(--color-text-primary) text-sm leading-relaxed mb-6">
                        We challenge high achievers with university-level concepts, critical thinking projects, and competitive exam preparation.
                    </p>

                    <ul className="space-y-2 text-sm text-text-secondary">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            University Prep
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            Critical Thinking
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
