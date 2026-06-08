'use client';

import React, { useRef, useEffect, useState } from 'react';
import FadeUpSection from './FadeUpSection';
import Reveal from './Reveal';

// 3D Tilt Card — vanilla mouse-follow tilt (replaces framer motion values/spring).
// Outer <Reveal> handles the scroll fade-up; inner div handles the 3D tilt so the
// two transforms don't collide.
function TiltCard({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        // matches old framer mapping: rotateX [-0.5,0.5]→[15,-15], rotateY [-0.5,0.5]→[-15,15]
        setTilt({ rx: -yPct * 30, ry: xPct * 30 });
    };

    const handleMouseLeave = () => setTilt({ rx: 0, ry: 0 });

    return (
        <Reveal variant="up" delay={delay} className="relative w-full">
            <div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                    transformStyle: "preserve-3d",
                    transition: "transform 0.2s ease-out",
                }}
            >
                <div className="absolute inset-0 bg-linear-to-br from-primary/15 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-[3rem] blur-2xl pointer-events-none" style={{ transform: "translateZ(-50px)" }} />

                <div
                    className="p-12 md:p-16 bg-surface rounded-[3rem] border border-border/50 shadow-lg hover:border-primary/30 transition-colors duration-500 relative z-10 overflow-hidden flex flex-col items-center justify-center min-h-[300px]"
                    style={{ transform: "translateZ(30px)" }}
                >
                    {/* Subtle inner glow */}
                    <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
                    {children}
                </div>
            </div>
        </Reveal>
    );
}

function ScrollCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let raf = 0;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                // rAF count-up with the same easeOutExpo-ish curve (replaces framer animate()).
                const duration = 2500;
                const start = performance.now();
                const tick = (now: number) => {
                    const t = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - t, 3);
                    setDisplay(Math.round(eased * value));
                    if (t < 1) raf = requestAnimationFrame(tick);
                };
                raf = requestAnimationFrame(tick);
            },
            { rootMargin: '0px 0px -100px 0px' }
        );
        observer.observe(el);
        return () => { observer.disconnect(); cancelAnimationFrame(raf); };
    }, [value]);

    return (
        <span ref={ref} className="text-7xl md:text-8xl lg:text-9xl font-heading text-foreground tracking-tighter drop-shadow-sm inline-block" style={{ transform: "translateZ(50px)" }}>
            {display}{suffix}
        </span>
    );
}

export default function ResultsSection() {
    const [nodes, setNodes] = useState<any[]>([]);

    useEffect(() => {
        setNodes([...Array(8)].map(() => ({
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            top: 10 + Math.random() * 80,
            left: 10 + Math.random() * 80,
            delay: Math.random() * 2,
            duration: 5 + Math.random() * 5,
            y: Math.random() * -60 - 20,
            x: Math.random() * 40 - 20,
        })));
    }, []);

    return (
        <section className="py-32 bg-background text-center relative overflow-hidden" style={{ perspective: 1000 }}>
            {/* Background Architecture */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full" />

                {/* Floating Motion Nodes - Only render on client to avoid hydration mismatch from Math.random() */}
                {nodes.map((node, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-primary/30 blur-[1px] nh-node"
                        style={{
                            width: `${node.width}px`,
                            height: `${node.height}px`,
                            top: `${node.top}%`,
                            left: `${node.left}%`,
                            ['--nx' as string]: `${node.x}px`,
                            ['--ny' as string]: `${node.y}px`,
                            ['--nh-node-dur' as string]: `${node.duration}s`,
                            ['--nh-node-delay' as string]: `${node.delay}s`,
                        }}
                    />
                ))}
            </div>


            <div className="container mx-auto px-6 relative z-10">
                <FadeUpSection className="mb-24">
                    <span className="text-xs font-heading font-bold uppercase tracking-[0.3em] text-primary mb-6 block">Proven Impact</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground font-heading leading-tight max-w-3xl mx-auto">
                        Measurable growth through <br className="hidden md:block" /> focused attention.
                    </h2>
                </FadeUpSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-24">
                    <TiltCard delay={0.1}>
                        <ScrollCounter value={95} suffix="%" />
                        <p className="text-sm font-body font-bold uppercase tracking-widest text-text-secondary opacity-60 mt-6" style={{ transform: "translateZ(20px)" }}>Higher Student Confidence</p>

                        {/* Decorative accent */}
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary/5 rounded-tl-full blur-3xl transform translate-x-1/4 translate-y-1/4 pointer-events-none" />
                    </TiltCard>

                    <TiltCard delay={0.3}>
                        <ScrollCounter value={72} suffix="%" />
                        <p className="text-sm font-body font-bold uppercase tracking-widest text-text-secondary opacity-60 mt-6" style={{ transform: "translateZ(20px)" }}>Average Grade Improvement</p>

                        {/* Decorative accent */}
                        <div className="absolute top-0 left-0 w-48 h-48 bg-secondary/5 rounded-br-full blur-3xl transform -translate-x-1/4 -translate-y-1/4 pointer-events-none" />
                    </TiltCard>
                </div>

                <FadeUpSection delay={0.4} className="max-w-3xl mx-auto">
                    <div className="relative p-10 md:p-12 bg-surface/50 backdrop-blur-md rounded-3xl border border-border/50 inline-block mb-12 shadow-sm group hover:border-primary/30 hover:shadow-xl transition-all duration-500">
                        {/* Quote marks decorative */}
                        <div className="absolute -top-8 -left-4 text-9xl text-primary/10 font-heading select-none group-hover:text-primary/20 transition-colors duration-500">"</div>
                        <div className="absolute -bottom-20 -right-4 text-9xl text-primary/10 font-heading select-none group-hover:text-primary/20 transition-colors duration-500 rotate-180">"</div>

                        <p className="text-2xl md:text-3xl lg:text-4xl text-foreground font-heading tracking-tight relative z-10 leading-relaxed">
                            <span className="italic">When children feel understood, they start to understand.</span>
                        </p>
                    </div>
                </FadeUpSection>

                <FadeUpSection delay={0.6}>
                    <p className="text-text-secondary font-body uppercase tracking-[0.2em] text-xs opacity-50">
                        Because learning improves when attention improves.
                    </p>
                </FadeUpSection>
            </div>
        </section>
    );
}
