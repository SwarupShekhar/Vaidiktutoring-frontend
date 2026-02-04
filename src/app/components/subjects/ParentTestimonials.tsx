'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

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
        }
    ];

    return (
        <section className="py-24 px-6 bg-[var(--color-surface)]">
            <div className="max-w-7xl mx-auto">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, idx) => (
                        <div key={idx} className="bg-[var(--color-surface)] p-8 rounded-[2rem] relative border border-[var(--color-border)] hover:shadow-lg transition-shadow">
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
                </div>
            </div>
        </section>
    );
}
