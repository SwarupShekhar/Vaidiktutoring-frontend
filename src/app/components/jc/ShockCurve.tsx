"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const POINTS = [
  { label: "O-Levels", value: 95, note: "A1s across the board" },
  { label: "JC1 Block 1", value: 20, note: "U grades. Panic sets in." },
  { label: "JC1 Block 2", value: 38, note: "S grades. Still struggling." },
  { label: "Promos", value: 55, note: "Scraping through. Relief." },
  { label: "JC2 Prelims", value: 68, note: "B/C. Starting to get it." },
  { label: "A-Levels", value: 82, note: "A/B. Hard-earned." },
];

export default function ShockCurve() {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const W = 600;
  const H = 220;
  const PAD = { top: 24, right: 24, bottom: 48, left: 32 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const xs = POINTS.map((_, i) => PAD.left + (i / (POINTS.length - 1)) * innerW);
  const ys = POINTS.map((p) => PAD.top + innerH - (p.value / 100) * innerH);

  const pathD = POINTS.map((_, i) => {
    if (i === 0) return `M ${xs[i]} ${ys[i]}`;
    const cpx = (xs[i - 1] + xs[i]) / 2;
    return `C ${cpx} ${ys[i - 1]}, ${cpx} ${ys[i]}, ${xs[i]} ${ys[i]}`;
  }).join(" ");

  const areaD = `${pathD} L ${xs[xs.length - 1]} ${H - PAD.bottom} L ${xs[0]} ${H - PAD.bottom} Z`;

  return (
    <div ref={ref} className="bg-white dark:bg-[oklch(0.14_0.01_240)] border border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] rounded-2xl p-6 overflow-hidden">
      <div className="mb-4">
        <h4 className="font-heading font-bold text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] text-lg">
          The JC1 Shock Curve
        </h4>
        <p className="text-sm text-[oklch(0.5_0.01_230)] dark:text-[oklch(0.65_0.01_230)] mt-1">
          This is normal. This is recoverable. We see this every year.
        </p>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          aria-label="Line graph showing typical student grade trajectory from O-Levels through A-Levels"
          role="img"
        >
          <defs>
            <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.45 0.18 250)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="oklch(0.45 0.18 250)" stopOpacity="0.01" />
            </linearGradient>
            <clipPath id="revealClip">
              <motion.rect
                x={0}
                y={0}
                width={animated ? W : 0}
                height={H}
                animate={{ width: animated ? W : 0 }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </clipPath>
          </defs>

          {/* Grid lines */}
          {[25, 50, 75].map((v) => {
            const y = PAD.top + innerH - (v / 100) * innerH;
            return (
              <line
                key={v}
                x1={PAD.left}
                y1={y}
                x2={W - PAD.right}
                y2={y}
                stroke="var(--color-border)"
                strokeWidth={1}
              />
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#curveGrad)" clipPath="url(#revealClip)" />

          {/* Curve line */}
          <path
            d={pathD}
            fill="none"
            stroke="oklch(0.45 0.18 250)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            clipPath="url(#revealClip)"
          />

          {/* Data points */}
          {POINTS.map((p, i) => (
            <g key={i} clipPath="url(#revealClip)">
              <circle
                cx={xs[i]}
                cy={ys[i]}
                r={5}
                fill={i === 1 ? "oklch(0.55 0.18 25)" : "oklch(0.45 0.18 250)"}
                stroke="white"
                strokeWidth={2}
              />
            </g>
          ))}

          {/* X axis labels */}
          {POINTS.map((p, i) => (
            <text
              key={i}
              x={xs[i]}
              y={H - PAD.bottom + 16}
              textAnchor="middle"
              fontSize={9}
              fill="var(--color-text-secondary)"
              fontFamily="var(--font-dm-sans)"
            >
              {p.label}
            </text>
          ))}

          {/* Annotation on the low point */}
          <text
            x={xs[1]}
            y={ys[1] - 12}
            textAnchor="middle"
            fontSize={9}
            fill="oklch(0.55 0.18 25)"
            fontFamily="var(--font-dm-sans)"
          >
            The dip
          </text>
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {POINTS.map((p, i) => (
          <div key={i} className="bg-[oklch(0.97_0.01_230)] dark:bg-[oklch(0.12_0.01_240)] rounded-lg px-3 py-2">
            <p className="text-xs font-semibold text-[oklch(0.3_0.01_240)] dark:text-[oklch(0.85_0.01_230)]">
              {p.label}
            </p>
            <p className="text-xs text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] mt-0.5">{p.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
