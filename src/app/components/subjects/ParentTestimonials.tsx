'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ParentTestimonials() {
    const testimonials = [
        {
            text: "We were worried about the transition to high school math, but this program mapped perfectly to his Algebra 1 curriculum. His confidence has soared.",
            author: "Sarah J.",
            role: "Parent of 9th Grader",
            rating: 5
        },
        {
            text: "The structured approach is exactly what we needed. It's not just random tutoring; there's a clear plan for every week that aligns with her school tests.",
            author: "Michael T.",
            role: "Parent of 5th Grader",
            rating: 5
        },
        {
            text: "Finally, a program that understands the IB curriculum. My daughter felt supported immediately and her predicted grades have already gone up.",
            author: "Priya R.",
            role: "Parent of IB Diploma Student",
            rating: 5
        },
        // Duplicate for more content in the loop if needed, or just repeat the array below
    ];

    const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials]; // Quadruple for safety on large screens

    return (
        <section className="py-24 px-6 bg-[var(--color-surface)] overflow-hidden">
            <div className="max-w-[100vw] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-[var(--color-deep-navy)] mb-4">
                        Trusted by Parents
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-yellow-500 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={24} fill="currentColor" />
                        ))}
                    </div>
                    <p className="text-[var(--color-text-secondary)] font-medium">
                        Rated 4.9/5 by over 1,500 families
                    </p>
                </div>

                <div className="relative w-full overflow-hidden mask-linear-fade">
                    {/* Gradient Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--color-surface)] to-transparent z-20 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--color-surface)] to-transparent z-20 pointer-events-none" />

                    <div className="flex w-fit hover:pause-animation">
                        <motion.div
                            className="flex gap-8 pr-8"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                repeat: Infinity,
                                ease: "linear",
                                duration: 50, // Adjust speed
                            }}
                        >
                            {duplicatedTestimonials.map((testimonial, idx) => (
                                <div key={idx} className="w-[350px] md:w-[450px] flex-shrink-0 bg-[var(--color-background)] p-8 rounded-[2rem] relative border border-[var(--color-border)] hover:shadow-lg transition-shadow">
                                    <div className="absolute top-8 right-8 text-[var(--color-ice-blue)]">
                                        <Quote size={48} fill="currentColor" className="opacity-50" />
                                    </div>

                                    <div className="flex gap-1 text-yellow-500 mb-6">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} size={16} fill="currentColor" />
                                        ))}
                                    </div>

                                    <p className="text-[var(--color-text-primary)] text-lg leading-relaxed mb-8 relative z-10 italic">
                                        "{testimonial.text}"
                                    </p>

                                    <div className="mt-auto">
                                        <p className="font-bold text-[var(--color-deep-navy)]">{testimonial.author}</p>
                                        <p className="text-sm text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">{testimonial.role}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
