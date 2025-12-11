'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewCard from './ReviewCard';
import DemoButton from './DemoButton';
import MorphingBlob from './MorphingBlob';
import reviewsData from '@/data/reviews.json';
import useWindowSize from '@/app/Hooks/useWindowSize';

export default function ReviewsSection() {
    const [reviews] = useState(reviewsData);
    const [index, setIndex] = useState(0);
    const { width } = useWindowSize();
    const slidesPerView = width > 1024 ? 3 : width > 640 ? 2 : 1;

    // auto-advance
    useEffect(() => {
        const id = setInterval(() => setIndex(i => (i + 1) % reviews.length), 6000);
        return () => clearInterval(id);
    }, [reviews.length]);

    // computed window slice for simple carousel
    const visible = [];
    for (let i = 0; i < slidesPerView; i++) {
        // Use modulo to wrap around seamlessly
        visible.push(reviews[(index + i) % reviews.length]);
    }

    return (
        <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-[rgba(240,244,248,1)] to-white dark:from-[#0f172a] dark:to-[#0f172a]">
            <MorphingBlob className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-40 pointer-events-none" />
            <div className="relative max-w-7xl mx-auto px-6">
                <header className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)]">What families are saying</h2>
                        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Short progress stories from parents and students</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIndex((index - 1 + reviews.length) % reviews.length)} aria-label="Previous reviews" className="p-2 rounded bg-white shadow cursor-pointer hover:bg-gray-50">‹</button>
                        <button onClick={() => setIndex((index + 1) % reviews.length)} aria-label="Next reviews" className="p-2 rounded bg-white shadow cursor-pointer hover:bg-gray-50">›</button>
                    </div>
                </header>

                <div className="flex gap-6 items-stretch justify-center">
                    <AnimatePresence mode='popLayout'>
                        {visible.map((r, i) => (
                            <motion.div
                                key={`${r.id}-${index + i}`} // Unique key for animation triggering on slide change
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                                layout
                            >
                                <ReviewCard review={r} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex flex-col justify-center items-center gap-6">
                    <Link href="/signup">
                        <DemoButton />
                    </Link>
                    <div className="text-sm text-[var(--color-text-secondary)]">Trusted by parents. Proven results.</div>
                </div>
            </div>
        </section>
    );
}
