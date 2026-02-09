import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReviewCard from './ReviewCard';
import DemoButton from './DemoButton';
import MorphingBlob from './MorphingBlob';
import reviewsData from '@/data/reviews.json';

export default function ReviewsSection() {
    const [reviews] = useState([...reviewsData, ...reviewsData]); // Duplicate for seamless loop

    return (
        <section className="relative overflow-hidden py-24 bg-gradient-to-b from-[rgba(240,244,248,1)] to-white dark:from-[#0f172a] dark:to-[#0f172a]">
            <MorphingBlob className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-40 pointer-events-none" />

            <div className="relative max-w-[100vw] mx-auto">
                <header className="flex flex-col items-center justify-center mb-16 px-6 text-center">
                    <h2 className="text-3xl lg:text-5xl font-luckiest text-[var(--color-text-primary)] mb-4 tracking-wide">
                        What families are saying
                    </h2>
                    <p className="text-base text-[var(--color-text-secondary)] font-medium max-w-2xl">
                        Real stories from parents and students who found their rhythm.
                    </p>
                </header>

                <div className="relative w-full overflow-hidden mask-linear-fade">
                    {/* Gradient Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[rgba(240,244,248,1)] to-transparent dark:from-[#0f172a] z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent dark:from-[#0f172a] z-10 pointer-events-none" />

                    <div className="flex w-fit hover:pause-animation">
                        <motion.div
                            className="flex gap-6 pr-6"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                repeat: Infinity,
                                ease: "linear",
                                duration: 40, // Adjust speed here
                            }}
                        >
                            {reviews.map((r, i) => (
                                <div key={`${r.id}-${i}`} className="w-[350px] md:w-[400px] flex-shrink-0">
                                    <ReviewCard review={r} />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                <div className="mt-16 flex flex-col justify-center items-center gap-6 px-6">
                    <Link href="/signup">
                        <DemoButton />
                    </Link>
                    <div className="text-sm text-[var(--color-text-secondary)] font-medium">Trusted by parents. Proven results.</div>
                </div>
            </div>
        </section>
    );
}
