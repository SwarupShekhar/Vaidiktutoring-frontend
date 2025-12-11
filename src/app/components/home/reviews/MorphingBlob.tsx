// src/app/components/home/reviews/MorphingBlob.tsx
import React from 'react';

export default function MorphingBlob({ className = '' }: { className?: string }) {
    return (
        <svg className={className} width="900" height="500" viewBox="0 0 900 500" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <defs>
                <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0%" stopColor="#1C3A5A" stopOpacity="0.18" className="dark:stop-color-[#38bdf8] dark:stop-opacity-20" />
                    <stop offset="100%" stopColor="#F7C548" stopOpacity="0.10" className="dark:stop-color-[#facc15] dark:stop-opacity-10" />
                </linearGradient>
                <filter id="blur">
                    <feGaussianBlur stdDeviation="30" />
                </filter>
            </defs>

            <g filter="url(#blur)">
                <path fill="url(#g1)">
                    <animate attributeName="d" dur="12s" repeatCount="indefinite" values="M100,100 C200,0 400,0 500,100 C600,200 700,300 600,400 C500,500 300,500 200,400 C100,300 0,200 100,100 Z; M120,80 C250,30 480,10 540,130 C610,260 720,340 640,420 C560,500 350,480 230,400 C120,320 10,220 120,80 Z; M180,120 C300,10 470,0 580,160 C700,350 760,350 700,440 C640,530 370,520 240,420 C110,320 70,220 180,120 Z; M100,100 C200,0 400,0 500,100 C600,200 700,300 600,400 C500,500 300,500 200,400 C100,300 0,200 100,100 Z" />
                </path>
            </g>
        </svg>
    );
}
