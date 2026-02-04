import React from 'react';
import { Video, BrainCircuit, FileBarChart } from 'lucide-react';

export default function DeliveryModel() {
    return (
        <section className="mt-32 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-[var(--color-deep-navy)] mb-6">How Learning Happens</h2>
                <div className="w-24 h-1 bg-[var(--color-sapphire)] mx-auto rounded-full mb-6"></div>
                <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                    A hybrid approach that combines expert human instruction with cutting-edge AI verification.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-10 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl shadow-blue-900/5 hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-20 h-20 mx-auto mb-8 bg-[var(--color-ice-blue)] rounded-full flex items-center justify-center text-[var(--color-sapphire)]">
                        <Video size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-deep-navy)] mb-4">Live Expert Teaching</h3>
                    <p className="text-[var(--color-text-primary)] leading-relaxed">
                        Interaction with top-tier tutors who guide students through complex concepts and facilitate deep understanding.
                    </p>
                </div>
                <div className="text-center p-10 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl shadow-blue-900/5 hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-20 h-20 mx-auto mb-8 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <BrainCircuit size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-deep-navy)] mb-4">Data-Driven Learning</h3>
                    <p className="text-[var(--color-text-primary)] leading-relaxed">
                        Every session generates measurable performance data that helps tutors personalize instruction and helps students see clear, trackable improvement over time.
                    </p>
                </div>
                <div className="text-center p-10 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl shadow-blue-900/5 hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-20 h-20 mx-auto mb-8 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                        <FileBarChart size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-deep-navy)] mb-4">Progress Reports</h3>
                    <p className="text-[var(--color-text-primary)] leading-relaxed">
                        Detailed analytics and evidence-based reports that map student growth against international benchmarks.
                    </p>
                </div>
            </div>
        </section>
    );
}
