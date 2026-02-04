import React from 'react';

export default function SubjectsHero() {
    const frameworks = [
        'Common Core State Standards',
        'Next Generation Science Standards',
        'National Curriculum for England',
        'Cambridge Assessment International Education',
        'International Baccalaureate'
    ];

    return (
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-deep-navy)] mb-6 tracking-tight">
                Learning Paths That Align With<br className="hidden md:block" /> Your Child’s School
            </h1>
            <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
                Our programs adapt to US, UK, and International curricula while building real academic skills.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
                {frameworks.map((framework, index) => (
                    <span
                        key={index}
                        className="px-4 py-2 rounded-full bg-[var(--color-ice-blue)]/50 border border-[var(--color-powder-blue)] text-sm font-semibold text-[var(--color-sapphire)] shadow-sm backdrop-blur-sm"
                    >
                        {framework}
                    </span>
                ))}
            </div>
        </div>
    );
}
