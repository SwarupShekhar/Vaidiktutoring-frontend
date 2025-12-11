'use client';
import React from 'react';
import styled from 'styled-components';

interface NeonCardProps {
    title: string;
    description: string;
    icon?: string;
    topics: string[];
    gradient?: string;
}

const NeonCard = ({ title, description, icon, topics, gradient }: NeonCardProps) => {
    return (
        <StyledWrapper $gradient={gradient}>
            <div className="card">
                <div className="content">
                    <div className="flex flex-col h-full w-full">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0">
                                {icon || '📚'}
                            </div>
                            <h3 className="text-xl font-bold leading-tight">{title}</h3>
                        </div>

                        <p className="text-sm opacity-80 mb-4 line-clamp-2">
                            {description}
                        </p>

                        <div className="mt-auto space-y-2">
                            <p className="text-xs font-bold uppercase tracking-wider opacity-60">Popular Topics</p>
                            <div className="flex flex-wrap gap-2">
                                {topics.slice(0, 3).map((topic, i) => (
                                    <span key={i} className="text-xs px-2 py-1 rounded-md bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/5">
                                        {topic}
                                    </span>
                                ))}
                                {topics.length > 3 && (
                                    <span className="text-xs px-2 py-1">+ {topics.length - 3} more</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div<{ $gradient?: string }>`
  .card {
    width: 100%;
    min-height: 280px; /* Adapted height */
    background: var(--color-surface);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    border-radius: 20px; /* Added rounded corners */
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1); /* Softer shadow */
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  
  .card:hover {
      transform: translateY(-5px);
  }

  .card .content {
    border-radius: 16px; /* Match inner radius */
    background: var(--color-surface);
    width: calc(100% - 6px); /* 3px border essentially */
    height: calc(100% - 6px);
    z-index: 1;
    padding: 24px;
    color: var(--color-text-primary);
    position: relative;
    /* Ensure content is above the rotation layer */
  }

  /* The white blur line effect */
  .content::before {
    opacity: 0;
    transition: opacity 300ms;
    content: " ";
    display: block;
    background: var(--color-text-primary); /* Adapt to theme text color */
    width: 2px;
    height: 100px;
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    filter: blur(20px);
    overflow: hidden;
    z-index: 2;
  }

  .card:hover .content::before {
    opacity: 0.3;
  }

  /* The Rotating Border */
  .card::before {
    opacity: 0;
    content: " ";
    position: absolute;
    display: block;
    width: 120%; /* Cover corners */
    height: 150%;
    /* Use passed gradient or default */
    background: ${props => props.$gradient || 'linear-gradient(#ff2288, #387ef0)'};
    transition: opacity 300ms;
    animation: rotation_9018 4000ms infinite linear;
    animation-play-state: paused;
    inset: -20%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .card:hover::before {
    opacity: 1;
    animation-play-state: running;
  }

  /* Inner backdrop to ensure text readability over the gradient border area if it leaks? 
     Actually .content background handles this. 
     This ::after adds a backdrop filter effect or subtle tint inside.
  */
  .card::after {
    position: absolute;
    content: " ";
    display: block;
    width: 100%;
    height: 100%;
    background: var(--color-surface);
    opacity: 0.1;
    backdrop-filter: blur(50px);
    pointer-events: none;
  }

  @keyframes rotation_9018 {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

export default NeonCard;
