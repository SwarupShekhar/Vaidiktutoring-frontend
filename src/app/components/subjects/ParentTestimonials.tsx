'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ParentTestimonials({ testimonials = [] }: { testimonials?: any[] }) {
    const defaultTestimonials = [
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
    ];

    const actualTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

    const duplicatedTestimonials = [...actualTestimonials, ...actualTestimonials, ...actualTestimonials, ...actualTestimonials]; // Quadruple for safety on large screens

    return (
        <section className="py-24 px-6 bg-background overflow-hidden relative border-t border-border/30">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,var(--tw-gradient-stops))] from-sapphire/10 via-transparent to-transparent opacity-40 pointer-events-none" />
            <div className="max-w-[100vw] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-deep-navy dark:text-white mb-4">
                        Trusted by Parents
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-yellow-500 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={24} fill="currentColor" />
                        ))}
                    </div>
                    <p className="text-text-secondary font-medium">
                        Rated 4.9/5 by over 1,500 families
                    </p>
                </div>

                <div className="relative w-full overflow-hidden mask-linear-fade">
                    {/* Gradient Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-surface to-transparent z-20 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-surface to-transparent z-20 pointer-events-none" />

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
                                <div key={idx} className="w-[400px] md:w-[500px] shrink-0 bg-white dark:bg-slate-900/40 p-12 rounded-[3.5rem] relative border border-border/40 hover:border-sapphire/30 transition-all group shadow-sm hover:shadow-2xl">
                                    <div className="absolute top-10 right-10 text-sapphire/10 group-hover:text-sapphire/20 transition-colors">
                                        <Quote size={80} fill="currentColor" />
                                    </div>

                                    <div className="flex gap-1.5 text-emerald-500 mb-8">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} size={14} fill="currentColor" />
                                        ))}
                                    </div>

                                    <p className="text-deep-navy dark:text-slate-300 text-xl leading-relaxed mb-10 relative z-10 italic font-medium tracking-tight">
                                        "{testimonial.text}"
                                    </p>

                                    <div className="mt-auto flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-sapphire to-primary shrink-0 opacity-20" />
                                        <div>
                                            <p className="font-black text-deep-navy dark:text-white uppercase tracking-tighter italic text-base leading-none mb-1">{testimonial.author}</p>
                                            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black opacity-60 leading-none">{testimonial.role}</p>
                                        </div>
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
