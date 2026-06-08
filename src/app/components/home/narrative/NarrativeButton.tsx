'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    children: React.ReactNode;
}

export default function NarrativeButton({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
    // CSS hover/active (replaces framer whileHover y:-2 / whileTap scale:0.98).
    const baseStyles = "px-8 py-4 rounded-full font-bold text-sm tracking-tight transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50";

    const variants = {
        primary: "bg-foreground text-background hover:opacity-90 shadow-xl shadow-black/5",
        secondary: "bg-primary text-white hover:opacity-90 shadow-xl shadow-primary/20",
        outline: "bg-transparent border-2 border-border text-foreground hover:border-foreground"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
