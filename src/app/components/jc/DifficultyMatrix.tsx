"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// difficulty: how hard students find it (1–10)
// impact:     how much it affects UAS (1–10)
// uasMax:     max points available (determines bubble size)
const SUBJECTS = [
  {
    name: "H2 Math",
    difficulty: 8.5,
    impact: 9.5,
    uasMax: 20,
    note: "Hardest marking, highest return. Method marks are the difference between a B and an A: your workings must be airtight.",
    action: "Most students need structured worked-example drilling, not more past papers.",
    color: "oklch(0.48 0.22 25)",
    labelOffset: { x: 12, y: -14 },
  },
  {
    name: "H2 Chemistry",
    difficulty: 8.0,
    impact: 9.2,
    uasMax: 20,
    note: "Organic synthesis pathway trips most students. Once you map the reactions as a connected network, it becomes systematic rather than chaotic.",
    action: "Build the organic synthesis map. Every reaction connected to its reagents.",
    color: "oklch(0.48 0.2 45)",
    labelOffset: { x: 12, y: 10 },
  },
  {
    name: "H2 Physics",
    difficulty: 7.5,
    impact: 8.8,
    uasMax: 20,
    note: "Needs conceptual clarity AND calculation precision. Students who excel at one but not the other plateau at grade B.",
    action: "Electricity and Waves are where most marks go. Prioritise these first.",
    color: "oklch(0.48 0.18 200)",
    labelOffset: { x: -80, y: -14 },
  },
  {
    name: "H2 Economics",
    difficulty: 5.5,
    impact: 8.5,
    uasMax: 20,
    note: "Most students start from zero: that is actually an advantage. No bad habits to undo. Structured PEEL approach makes it learnable faster than sciences.",
    action: "Diagram + explanation + evidence + link back. Every single point.",
    color: "oklch(0.48 0.18 145)",
    labelOffset: { x: 12, y: -14 },
  },
  {
    name: "General Paper",
    difficulty: 5.0,
    impact: 7.8,
    uasMax: 10,
    note: "14% of your entire UAS. The most underestimated subject in JC. One C in GP when your sciences are A costs you 4 UAS points: possibly your university course.",
    action: "Write a proper thesis first. Then build the essay around it. Not the other way.",
    color: "oklch(0.5 0.2 300)",
    labelOffset: { x: 12, y: 10 },
  },
  {
    name: "H2 Biology",
    difficulty: 6.2,
    impact: 8.2,
    uasMax: 20,
    note: "High content load but more recall-based than Chem or Physics. More manageable for systematic learners.",
    action: "Flashcard the definitions. Diagrams with labels. Recall under time pressure.",
    color: "oklch(0.5 0.15 120)",
    labelOffset: { x: 12, y: -14 },
  },
  {
    name: "H2 History",
    difficulty: 6.5,
    impact: 6.8,
    uasMax: 20,
    note: "Essay-heavy. Thesis precision matters more than volume of facts. Students who write well but argue weakly score Bs.",
    action: "Argument structure first. Facts are ammunition, not the argument itself.",
    color: "oklch(0.5 0.12 260)",
    labelOffset: { x: -72, y: 10 },
  },
  {
    name: "H2 Literature",
    difficulty: 6.0,
    impact: 6.5,
    uasMax: 20,
    note: "Subjective marking with objective patterns. Examiners have clear criteria: tutors who know these criteria produce consistent grade improvements.",
    action: "Learn the assessment criteria vocabulary. Use it explicitly in answers.",
    color: "oklch(0.52 0.1 280)",
    labelOffset: { x: -78, y: -14 },
  },
];

// SVG canvas config
const W = 560;
const H = 380;
const PAD = { top: 28, right: 28, bottom: 52, left: 52 };
const IW = W - PAD.left - PAD.right;
const IH = H - PAD.top - PAD.bottom;

function toX(d: number) { return PAD.left + ((d - 1) / 9) * IW; }
function toY(i: number) { return PAD.top + IH - ((i - 1) / 9) * IH; }
function bubbleR(uasMax: number) { return uasMax === 20 ? 22 : 14; }

const TICKS = [2, 4, 6, 8, 10];
const QUADRANT_LABELS = [
  { x: 0.75, y: 0.2, text: "Hard + High impact", sub: "invest here", fill: "oklch(0.55 0.18 25 / 0.12)", stroke: "oklch(0.78 0.1 25 / 0.3)" },
  { x: 0.25, y: 0.2, text: "Manageable + High impact", sub: "don't neglect", fill: "oklch(0.55 0.18 145 / 0.08)", stroke: "oklch(0.78 0.1 145 / 0.3)" },
  { x: 0.75, y: 0.75, text: "Hard + Lower impact", sub: "be strategic", fill: "oklch(0.92 0.01 230 / 0.6)", stroke: "oklch(0.85 0.02 230 / 0.5)" },
  { x: 0.25, y: 0.75, text: "Easier + Lower impact", sub: "maintain", fill: "oklch(0.96 0.005 230 / 0.4)", stroke: "oklch(0.88 0.01 230 / 0.5)" },
];

export default function DifficultyMatrix() {
  const [active, setActive] = useState<string | null>(null);
  const [animated, setAnimated] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setAnimated(true); },
      { threshold: 0.25 }
    );
    if (svgRef.current) observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, []);

  const activeSubject = SUBJECTS.find((s) => s.name === active);

  return (
    <div className="bg-white dark:bg-[oklch(0.14_0.01_240)] border border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] rounded-2xl overflow-hidden">
      <div className="px-6 pt-6 pb-4">
        <h4 className="font-heading font-bold text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] text-xl">
          Subject Difficulty vs UAS Impact
        </h4>
        <p className="text-sm text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] mt-1 max-w-lg">
          Bubble size = max UAS points available. Use this to decide where your
          study time has the highest return. Click any subject for detail.
        </p>
      </div>

      <div className="w-full overflow-x-auto px-2 pb-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full max-w-[560px] mx-auto block"
          aria-label="Scatter plot of H2 subjects by difficulty and UAS impact"
          role="img"
        >
          <defs>
            {/* Quadrant fills */}
            {QUADRANT_LABELS.map((q, i) => (
              <React.Fragment key={i} />
            ))}
          </defs>

          {/* ── Quadrant zones ─────────────────────────────────────── */}
          {/* Top-right: Hard + High impact */}
          <rect
            x={PAD.left + IW / 2}
            y={PAD.top}
            width={IW / 2}
            height={IH / 2}
            fill="oklch(0.55 0.14 25 / 0.12)"
            rx={8}
          />
          {/* Top-left: Manageable + High impact */}
          <rect
            x={PAD.left}
            y={PAD.top}
            width={IW / 2}
            height={IH / 2}
            fill="oklch(0.55 0.14 145 / 0.10)"
            rx={8}
          />
          {/* Bottom-right: Hard + Lower impact */}
          <rect
            x={PAD.left + IW / 2}
            y={PAD.top + IH / 2}
            width={IW / 2}
            height={IH / 2}
            fill="oklch(0.5 0.01 230 / 0.07)"
            rx={8}
          />
          {/* Bottom-left: Easy + Lower */}
          <rect
            x={PAD.left}
            y={PAD.top + IH / 2}
            width={IW / 2}
            height={IH / 2}
            fill="oklch(0.5 0.01 230 / 0.04)"
            rx={8}
          />

          {/* ── Quadrant dividers ──────────────────────────────────── */}
          <line
            x1={PAD.left + IW / 2} y1={PAD.top}
            x2={PAD.left + IW / 2} y2={PAD.top + IH}
            stroke="var(--color-border)" strokeWidth={1} strokeDasharray="4 4"
          />
          <line
            x1={PAD.left} y1={PAD.top + IH / 2}
            x2={PAD.left + IW} y2={PAD.top + IH / 2}
            stroke="var(--color-border)" strokeWidth={1} strokeDasharray="4 4"
          />

          {/* ── Quadrant labels ────────────────────────────────────── */}
          {/* Top-right */}
          <text x={PAD.left + IW * 0.76} y={PAD.top + 16} fontSize={9} fontFamily="var(--font-dm-sans)" fill="oklch(0.5 0.12 25)" fontWeight="600" textAnchor="middle">HARD + HIGH IMPACT</text>
          <text x={PAD.left + IW * 0.76} y={PAD.top + 26} fontSize={8} fontFamily="var(--font-dm-sans)" fill="oklch(0.6 0.08 25)" textAnchor="middle">invest here</text>
          {/* Top-left */}
          <text x={PAD.left + IW * 0.26} y={PAD.top + 16} fontSize={9} fontFamily="var(--font-dm-sans)" fill="oklch(0.45 0.12 145)" fontWeight="600" textAnchor="middle">MANAGEABLE + HIGH</text>
          <text x={PAD.left + IW * 0.26} y={PAD.top + 26} fontSize={8} fontFamily="var(--font-dm-sans)" fill="oklch(0.55 0.08 145)" textAnchor="middle">don't neglect</text>
          {/* Bottom-right */}
          <text x={PAD.left + IW * 0.76} y={PAD.top + IH - 8} fontSize={9} fontFamily="var(--font-dm-sans)" fill="var(--color-text-secondary)" fontWeight="600" textAnchor="middle">be strategic</text>
          {/* Bottom-left */}
          <text x={PAD.left + IW * 0.26} y={PAD.top + IH - 8} fontSize={9} fontFamily="var(--font-dm-sans)" fill="var(--color-text-secondary)" fontWeight="600" textAnchor="middle">maintain</text>

          {/* ── Grid lines ─────────────────────────────────────────── */}
          {TICKS.map((t) => (
            <React.Fragment key={t}>
              {/* Vertical */}
              <line
                x1={toX(t)} y1={PAD.top}
                x2={toX(t)} y2={PAD.top + IH}
                stroke="var(--color-border)" strokeWidth={0.75}
              />
              {/* Horizontal */}
              <line
                x1={PAD.left} y1={toY(t)}
                x2={PAD.left + IW} y2={toY(t)}
                stroke="var(--color-border)" strokeWidth={0.75}
              />
              {/* X tick labels */}
              <text
                x={toX(t)} y={PAD.top + IH + 16}
                fontSize={10} fontFamily="var(--font-dm-sans)"
                fill="var(--color-text-secondary)" textAnchor="middle"
              >
                {t}
              </text>
              {/* Y tick labels */}
              <text
                x={PAD.left - 10} y={toY(t) + 4}
                fontSize={10} fontFamily="var(--font-dm-sans)"
                fill="var(--color-text-secondary)" textAnchor="end"
              >
                {t}
              </text>
            </React.Fragment>
          ))}

          {/* ── Axis labels ────────────────────────────────────────── */}
          {/* X axis */}
          <text
            x={PAD.left + IW / 2} y={H - 6}
            fontSize={11} fontFamily="var(--font-dm-sans)"
            fill="oklch(0.4 0.01 230)" textAnchor="middle" fontWeight="600"
          >
            Student difficulty →
          </text>
          {/* Y axis */}
          <text
            x={12} y={PAD.top + IH / 2}
            fontSize={11} fontFamily="var(--font-dm-sans)"
            fill="oklch(0.4 0.01 230)" textAnchor="middle" fontWeight="600"
            transform={`rotate(-90, 12, ${PAD.top + IH / 2})`}
          >
            UAS impact →
          </text>

          {/* ── Axis border ────────────────────────────────────────── */}
          <rect
            x={PAD.left} y={PAD.top}
            width={IW} height={IH}
            fill="none"
            stroke="var(--color-border)" strokeWidth={1} rx={2}
          />

          {/* ── Bubbles ────────────────────────────────────────────── */}
          {SUBJECTS.map((s, i) => {
            const cx = toX(s.difficulty);
            const cy = toY(s.impact);
            const r = bubbleR(s.uasMax);
            const isActive = active === s.name;

            return (
              <g key={s.name}>
                {/* Pulse ring on active */}
                {isActive && (
                  <motion.circle
                    cx={cx} cy={cy} r={r + 10}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={1.5}
                    initial={{ opacity: 0.6, scale: 0.9 }}
                    animate={{ opacity: 0, scale: 1.3 }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}

                {/* Bubble */}
                <motion.circle
                  cx={cx} cy={cy}
                  r={animated ? (isActive ? r + 4 : r) : 0}
                  fill={s.color}
                  fillOpacity={isActive ? 0.95 : 0.82}
                  stroke="white"
                  strokeWidth={isActive ? 2.5 : 1.5}
                  style={{ cursor: "pointer" }}
                  initial={{ r: 0 }}
                  animate={{ r: animated ? (isActive ? r + 4 : r) : 0 }}
                  transition={{
                    delay: i * 0.09,
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => setActive(isActive ? null : s.name)}
                  onMouseEnter={() => setActive(s.name)}
                  onMouseLeave={() => setActive(null)}
                  aria-label={`${s.name}: difficulty ${s.difficulty}/10, impact ${s.impact}/10`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setActive(isActive ? null : s.name)}
                />

                {/* UAS points label inside bubble */}
                <motion.text
                  x={cx} y={cy + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={s.uasMax === 20 ? 9 : 8}
                  fontFamily="var(--font-dm-sans)"
                  fill="white"
                  fontWeight="700"
                  style={{ pointerEvents: "none" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: animated ? 1 : 0 }}
                  transition={{ delay: i * 0.09 + 0.3, duration: 0.3 }}
                >
                  {s.uasMax}pt
                </motion.text>

                {/* Subject name label (always visible) */}
                <motion.text
                  x={cx + s.labelOffset.x}
                  y={cy + s.labelOffset.y}
                  fontSize={10.5}
                  fontFamily="var(--font-dm-sans)"
                  fill={isActive ? s.color : "oklch(0.25 0.02 240)"}
                  fontWeight={isActive ? "700" : "600"}
                  style={{ pointerEvents: "none" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: animated ? 1 : 0 }}
                  transition={{ delay: i * 0.09 + 0.35, duration: 0.3 }}
                >
                  {s.name}
                </motion.text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Detail panel ─────────────────────────────────────────────── */}
      <div className="px-6 pb-6">
        <AnimatePresence mode="wait">
          {activeSubject ? (
            <motion.div
              key={activeSubject.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22 }}
              className="rounded-xl overflow-hidden border"
              style={{ borderColor: activeSubject.color.replace("oklch(", "oklch(").replace(")", " / 0.25)") }}
            >
              <div
                className="px-5 py-3 flex items-center justify-between bg-[oklch(0.97_0.01_230)] dark:bg-[oklch(0.17_0.01_240)]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: activeSubject.color }}
                  />
                  <span className="font-heading font-bold text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] text-base">
                    {activeSubject.name}
                  </span>
                </div>
                <div className="flex gap-4 text-xs font-semibold">
                  <span style={{ color: activeSubject.color }}>
                    Difficulty {activeSubject.difficulty}/10
                  </span>
                  <span style={{ color: activeSubject.color }}>
                    Impact {activeSubject.impact}/10
                  </span>
                  <span style={{ color: activeSubject.color }}>
                    {activeSubject.uasMax} UAS pts max
                  </span>
                </div>
              </div>
              <div className="px-5 py-4 bg-white dark:bg-[oklch(0.14_0.01_240)] grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.6_0.01_230)] mb-1.5">
                    Why it matters
                  </p>
                  <p className="text-sm text-[oklch(0.35_0.01_240)] dark:text-[oklch(0.80_0.01_230)] leading-relaxed">
                    {activeSubject.note}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.6_0.01_230)] mb-1.5">
                    What to do first
                  </p>
                  <p className="text-sm text-[oklch(0.35_0.01_240)] dark:text-[oklch(0.80_0.01_230)] leading-relaxed font-medium">
                    {activeSubject.action}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-[oklch(0.65_0.01_230)] text-center py-4"
            >
              Click or hover any bubble to see insight and recommended first action
            </motion.p>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)]">
            <svg width="36" height="16" viewBox="0 0 36 16">
              <circle cx="8" cy="8" r="7" fill="oklch(0.55 0.1 250)" fillOpacity="0.7" stroke="white" strokeWidth="1.5" />
              <text x="8" y="9" textAnchor="middle" dominantBaseline="middle" fontSize="6" fill="white" fontWeight="700">20pt</text>
              <circle cx="28" cy="8" r="5" fill="oklch(0.55 0.1 250)" fillOpacity="0.7" stroke="white" strokeWidth="1.5" />
              <text x="28" y="9" textAnchor="middle" dominantBaseline="middle" fontSize="5" fill="white" fontWeight="700">10pt</text>
            </svg>
            Bubble size = max UAS points
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)]">
            <div className="w-3 h-3 rounded bg-[oklch(0.96_0.04_25_/_0.5)]" />
            High priority zone
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)]">
            <div className="w-3 h-3 rounded bg-[oklch(0.96_0.04_145_/_0.4)]" />
            Don't neglect zone
          </div>
        </div>
      </div>
    </div>
  );
}
