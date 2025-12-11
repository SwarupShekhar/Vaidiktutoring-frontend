'use client';
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

interface Subject {
    id: string;
    title: string;
    description: string;
    icon: string;
    subTopics: string[];
    gradient: string;
}

interface SubjectCardProps {
    subject: Subject;
    index: number;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
    // Generate a gradient based on subject title acting as a seed/key if not provided
    // or use the one from JSON if available.
    // The user's JSON has 'gradient' field.

    return (
        <Link href={`/search?subject=${subject.id}`} className="block h-full">
            <StyledWrapper $gradient={subject.gradient}>
                <div className="card">
                    <div className="content">
                        <div className="flex flex-col h-full w-full relative z-10">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-3xl filter drop-shadow-md">{subject.icon}</span>
                                <h3 className="text-xl font-bold leading-tight text-[var(--color-text-primary)]">
                                    {subject.title}
                                    {/* {subject.title} */}
                                </h3>
                            </div>

                            <p className="text-sm text-[var(--color-text-secondary)] mb-6 line-clamp-3 leading-relaxed">
                                {subject.description}
                            </p>

                            <div className="mt-auto">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]"></span>
                                    Popular Topics
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {subject.subTopics.map((topic: string, i: number) => (
                                        <span
                                            key={i}
                                            className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[var(--color-background)] text-[var(--color-text-primary)] border border-[var(--color-border)] opacity-80"
                                        >
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </StyledWrapper>
        </Link>
    );
}

const StyledWrapper = styled.div<{ $gradient?: string }>`
  height: 100%;
  .card {
    width: 100%;
    height: 100%;
    min-height: 480px;
    background: transparent; /* Outer container transparent */
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    border-radius: 24px;
    cursor: pointer;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
  }
  
  .card:hover { 
      transform: translateY(-5px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }

  /* The Spinning Gradient Background (Border) */
  .card::before {
    content: "";
    position: absolute;
    width: 150%;
    height: 150%;
    background: ${props => props.$gradient || 'linear-gradient(90deg, #ff2288, #387ef0)'};
    animation: rotation_card 4000ms infinite linear;
    animation-play-state: paused;
    opacity: 0; /* Hidden by default */
    transition: opacity 0.3s ease;
  }

  .card:hover::before {
    opacity: 1; /* Show on hover */
    animation-play-state: running;
  }

  /* The Inner Content Mask (Solid Background) */
  .content {
    position: relative;
    z-index: 1;
    border-radius: 20px; /* Slightly smaller radius than card */
    background: var(--color-surface);
    width: calc(100% - 6px); /* 3px border on each side */
    height: calc(100% - 6px);
    padding: 24px;
    color: var(--color-text-primary);
    display: flex;
    flex-direction: column;
    overflow: hidden; /* Keep internal overflow contained */
  }

  /* Ensure the content covers the gradient except at edges */
  
  /* The white blur line effect inside the card */
  .content::before {
    opacity: 0;
    transition: opacity 300ms;
    content: "";
    display: block;
    background: var(--color-primary);
    width: 100px;
    height: 100px;
    position: absolute;
    top: -50px;
    left: -50px;
    filter: blur(40px);
    z-index: -1; /* Behind text but inside content */
    pointer-events: none;
  }

  .card:hover .content::before {
    opacity: 0.15;
  }

  @keyframes rotation_card {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
