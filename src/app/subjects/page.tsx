'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/app/context/AuthContext';
import { api } from '@/app/lib/api';

import SubjectsHero from '../components/subjects/SubjectsHero';
import SubjectSelector from '../components/subjects/SubjectSelector';
import SubjectLearningPath from '../components/subjects/SubjectLearningPath';
import DeliveryModel from '../components/subjects/DeliveryModel';
import LearnerType from '../components/subjects/LearnerType';
import SubjectMetrics from '../components/subjects/SubjectMetrics';
import SubjectFAQ from '../components/subjects/SubjectFAQ';
import ParentTestimonials from '../components/subjects/ParentTestimonials';
import StickyCTA from '../components/subjects/StickyCTA';

export default function SubjectsPage() {
    const { user } = useAuthContext();
    const [activeSubject, setActiveSubject] = useState('math');
    const [subjectData, setSubjectData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSubject = async () => {
            setIsLoading(true);
            try {
                // Fetch from the backend
                const response = await api.get(`/subjects/${activeSubject}`);
                setSubjectData(response.data);
            } catch (error) {
                console.error('Failed to fetch subject data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubject();
    }, [activeSubject]);

    return (
        <main className="min-h-screen bg-[var(--color-background)] pb-24 transition-colors duration-500 relative">
            {/* Sticky Action Bar */}
            <StickyCTA />

            <div className="pt-24 px-6 max-w-7xl mx-auto">
                {/* Hero Section */}
                <SubjectsHero />

                {/* Subject Selector */}
                <SubjectSelector
                    activeSubject={activeSubject}
                    onSelect={setActiveSubject}
                />

                {/* Dynamic Learning Path - THE CORE */}
                <SubjectLearningPath
                    subject={subjectData}
                    isLoading={isLoading}
                />
            </div>

            {/* Trust & Results Section (Full Width) */}
            <div className="mt-24">
                <SubjectMetrics />
            </div>

            <div className="px-6 max-w-7xl mx-auto">
                {/* Delivery Model */}
                <DeliveryModel />

                {/* Learner Type - Personas */}
                <LearnerType />
            </div>

            {/* Social Proof (Full Width) */}
            <div className="mt-12">
                <ParentTestimonials />
            </div>

            {/* Objection Handling */}
            <SubjectFAQ />

            {/* Final Strong CTA Section */}
            <div className="px-6 max-w-7xl mx-auto text-center mt-20 mb-32 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <h2 className="text-3xl font-bold text-[var(--color-deep-navy)] mb-8">Ready to unlock your child's potential?</h2>

                <Link
                    href={user ? '/students/dashboard' : '/signup'}
                    className="inline-flex items-center justify-center px-16 py-6 rounded-full bg-[var(--color-primary)] text-white font-bold text-xl hover:bg-[var(--color-sapphire)] hover:scale-105 transition-all shadow-xl shadow-blue-500/30"
                >
                    Book a Free Learning Assessment
                </Link>

                <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-[var(--color-text-secondary)] text-sm font-medium">
                    <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        15-Min Diagnostic
                    </span>
                    <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        No Credit Card Required
                    </span>
                    <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Curriculum Aligned
                    </span>
                </div>
            </div>
        </main>
    );
}
