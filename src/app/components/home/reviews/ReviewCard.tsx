'use client';
import React, { useEffect, useRef, useState } from 'react';

export default function ReviewCard({ review }: { review: any }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(entries => {
            for (const e of entries) {
                if (e.isIntersecting) {
                    setIsVisible(true);
                }
            }
        }, { threshold: 0.4 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <article
            ref={ref}
            className={`max-w-[320px] sm:w-[360px] lg:w-[380px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-white/30 dark:border-slate-700/50 shadow-lg shrink-0 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-[0.99]'}`}
            tabIndex={0}
            aria-label={`${review.name} - ${review.short}`}
        >
            <div className="flex items-center gap-4 mb-4">
                {review.avatar && (
                    <img src={review.avatar} alt={`${review.name} avatar`} className="w-12 h-12 rounded-full object-cover" />
                )}
                <div>
                    <div className="font-semibold text-(--color-text-primary)">{review.name}</div>
                    <div className="text-xs text-text-secondary">{review.role}</div>
                </div>
            </div>

            <div className="mb-3">
                <div className="text-sm text-(--color-text-primary) font-medium">{review.short}</div>
                <p className="mt-2 text-xs text-text-secondary line-clamp-3">{review.long}</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} />
                </div>
                <div className="text-xs text-text-secondary">Tag: <span className="font-medium">{review.tag}</span></div>
            </div>

            <div className="mt-4">
                <div className="text-xs text-text-secondary">Impact</div>
                <div className="flex gap-3 mt-2">
                    {review.highlightMetrics && Object.entries(review.highlightMetrics).map(([k, v]) => (
                        <div key={k} className="text-center">
                            <AnimatedNumber value={Number(v)} />
                            <div className="text-xs text-text-secondary">{k.replace(/([A-Z])/g, ' $1')}</div>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
}

// small helpers (implement below or inline)
function StarRating({ rating = 5 }: { rating: number }) {
    return (
        <div className="flex gap-1" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0L5.21 17.87c-.785.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L1.213 8.213c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69L9.05 2.927z" /></svg>
            ))}
        </div>
    );
}

function AnimatedNumber({ value }: { value: number }) {
    const [display, setDisplay] = React.useState(0);
    useEffect(() => {
        let start = 0;
        const duration = 800;
        const step = 16;
        const steps = Math.ceil(duration / step);
        const inc = (value - start) / steps;
        const id = setInterval(() => {
            start += inc;
            if ((inc > 0 && start >= value) || (inc < 0 && start <= value)) {
                setDisplay(value);
                clearInterval(id);
            } else {
                setDisplay(Math.round(start));
            }
        }, step);
        return () => clearInterval(id);
    }, [value]);
    return <div className="text-lg font-bold text-primary" aria-live="polite">{display}</div>;
}
