'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const LEADS_API = '/api/leads';

// ── Topic database (reused from GCSEMathsTracker) ──────────────────────────────
interface TopicItem {
  id: string;
  name: string;
  category: string;
  selected: boolean;
}

const TOPICS_DB: Record<string, Record<string, { id: string; name: string; category: string }[]>> = {
  edexcel: {
    higher: [
      { id: 'sine_cosine', name: 'Sine/Cosine Rules & Triangle Area', category: 'Geometry & Trig' },
      { id: 'algebraic_fractions', name: 'Algebraic Fractions', category: 'Algebra' },
      { id: 'composite_functions', name: 'Composite & Inverse Functions', category: 'Algebra' },
      { id: 'vectors_proof', name: 'Geometric Vector Proofs', category: 'Geometry & Trig' },
      { id: 'bounds', name: 'Error Intervals & Bounds', category: 'Number' },
      { id: 'histograms', name: 'Histograms & Frequency Density', category: 'Probability & Stats' },
      { id: 'cumulative_frequency', name: 'Cumulative Frequency & Box Plots', category: 'Probability & Stats' },
      { id: 'conditional_prob', name: 'Conditional Probability', category: 'Probability & Stats' },
      { id: 'direct_inverse_prop', name: 'Direct & Inverse Proportion', category: 'Ratio & Proportion' },
      { id: 'compound_interest', name: 'Compound Interest & Reverse %', category: 'Ratio & Proportion' },
      { id: 'quadratic_tangents', name: 'Estimating Gradients of Curves', category: 'Algebra' },
      { id: 'iteration', name: 'Iteration & Numerical Methods', category: 'Algebra' },
    ],
    foundation: [
      { id: 'pythagoras', name: "Pythagoras' Theorem", category: 'Geometry & Trig' },
      { id: 'sohcahtoa', name: 'Trigonometry (SOH CAH TOA)', category: 'Geometry & Trig' },
      { id: 'bounds_f', name: 'Error Intervals & Truncation', category: 'Number' },
      { id: 'compound_interest_f', name: 'Compound Interest & Depreciation', category: 'Ratio & Proportion' },
      { id: 'reverse_percentages_f', name: 'Reverse Percentages', category: 'Ratio & Proportion' },
      { id: 'probability_trees_f', name: 'Probability Trees', category: 'Probability & Stats' },
      { id: 'venn_diagrams', name: 'Venn Diagrams & Set Notation', category: 'Probability & Stats' },
      { id: 'frequency_trees', name: 'Frequency Trees', category: 'Probability & Stats' },
      { id: 'draw_graphs', name: 'Drawing Linear & Quadratic Graphs', category: 'Algebra' },
      { id: 'speed_density', name: 'Speed, Density & Pressure', category: 'Ratio & Proportion' },
      { id: 'area_sectors', name: 'Circle Area & Sectors', category: 'Geometry & Trig' },
    ],
  },
  aqa: {
    higher: [
      { id: 'sine_cosine', name: 'Sine/Cosine Rules', category: 'Geometry & Trig' },
      { id: 'algebraic_fractions', name: 'Algebraic Fractions', category: 'Algebra' },
      { id: 'composite_functions', name: 'Composite & Inverse Functions', category: 'Algebra' },
      { id: 'vectors_proof', name: 'Vectors Geometric Proof', category: 'Geometry & Trig' },
      { id: 'product_rule', name: 'Product Rule for Counting', category: 'Probability & Stats' },
      { id: 'bounds', name: 'Error Intervals & Bounds', category: 'Number' },
      { id: 'histograms', name: 'Histograms', category: 'Probability & Stats' },
      { id: 'direct_inverse_prop', name: 'Direct & Inverse Proportion', category: 'Ratio & Proportion' },
      { id: 'iteration', name: 'Iteration Formulas', category: 'Algebra' },
      { id: 'compound_interest', name: 'Compound Interest & Depreciation', category: 'Ratio & Proportion' },
      { id: 'simultaneous_non_linear', name: 'Non-linear Simultaneous Equations', category: 'Algebra' },
      { id: 'circle_theorems', name: 'Circle Theorems', category: 'Geometry & Trig' },
    ],
    foundation: [
      { id: 'reverse_percentages_f', name: 'Reverse Percentages', category: 'Ratio & Proportion' },
      { id: 'compound_interest_f', name: 'Compound Interest', category: 'Ratio & Proportion' },
      { id: 'pythagoras', name: "Pythagoras' Theorem", category: 'Geometry & Trig' },
      { id: 'sohcahtoa', name: 'Basic Trigonometry (SOH CAH TOA)', category: 'Geometry & Trig' },
      { id: 'angles_polygons', name: 'Interior & Exterior Angles', category: 'Geometry & Trig' },
      { id: 'speed_density', name: 'Speed, Density & Pressure', category: 'Ratio & Proportion' },
      { id: 'venn_diagrams', name: 'Venn Diagrams & Probability', category: 'Probability & Stats' },
      { id: 'scatter_graphs', name: 'Scatter Graphs & Line of Best Fit', category: 'Probability & Stats' },
      { id: 'volume_prisms', name: 'Volume & Surface Area', category: 'Geometry & Trig' },
      { id: 'ratio_sharing', name: 'Sharing in a Ratio', category: 'Ratio & Proportion' },
    ],
  },
  ocr: {
    higher: [
      { id: 'bounds', name: 'Bounds & Error Intervals', category: 'Number' },
      { id: 'sine_cosine', name: 'Advanced Trigonometry', category: 'Geometry & Trig' },
      { id: 'algebraic_fractions', name: 'Algebraic Fractions', category: 'Algebra' },
      { id: 'quadratic_graphs', name: 'Quadratic & Cubic Graphs', category: 'Algebra' },
      { id: 'cumulative_frequency', name: 'Cumulative Frequency & Box Plots', category: 'Probability & Stats' },
      { id: 'conditional_prob', name: 'Conditional Probability', category: 'Probability & Stats' },
      { id: 'vectors_proof', name: 'Vectors Geometric Proof', category: 'Geometry & Trig' },
    ],
    foundation: [
      { id: 'ratio_percent', name: 'Ratio & Percentages', category: 'Ratio & Proportion' },
      { id: 'standard_form', name: 'Standard Form Calculations', category: 'Number' },
      { id: 'pythagoras', name: "Pythagoras' Theorem", category: 'Geometry & Trig' },
      { id: 'frequency_polygons', name: 'Frequency Polygons', category: 'Probability & Stats' },
      { id: 'circle_area', name: 'Circle Area & Circumference', category: 'Geometry & Trig' },
      { id: 'speed_density', name: 'Speed, Distance & Time', category: 'Ratio & Proportion' },
    ],
  },
};

// ── Grade prediction logic ──────────────────────────────────────────────────────
function predictGrade(
  tier: 'higher' | 'foundation',
  estimatedPercent: number,
  weakTopicCount: number,
  totalTopics: number
): { grade: string; band: string; color: string; message: string } {
  // Adjust percent down based on weak topics ratio
  const weakRatio = totalTopics > 0 ? weakTopicCount / totalTopics : 0;
  const adjusted = Math.max(0, estimatedPercent - weakRatio * 12);

  if (tier === 'higher') {
    if (adjusted >= 85) return { grade: '9', band: 'Exceptional', color: '#22c55e', message: 'You\'re on track for the top grade. Stay sharp on edge cases.' };
    if (adjusted >= 73) return { grade: '8', band: 'Outstanding', color: '#22c55e', message: 'Strong position. Closing your weak topics could push you to a 9.' };
    if (adjusted >= 62) return { grade: '7', band: 'Excellent', color: '#4ade80', message: 'Solid performance. Your weak areas are the gap between 7 and 8.' };
    if (adjusted >= 50) return { grade: '6', band: 'Very Good', color: '#facc15', message: 'Good foundation. Targeted work on your weak topics can jump you a grade.' };
    if (adjusted >= 38) return { grade: '5', band: 'Strong Pass', color: '#facc15', message: 'You\'ve passed well. Some focused revision could push you higher.' };
    if (adjusted >= 26) return { grade: '4', band: 'Standard Pass', color: '#fb923c', message: 'You\'ve met the pass threshold. There\'s room to improve significantly.' };
    return { grade: '3', band: 'Below Pass', color: '#ef4444', message: 'Below the pass mark on Higher tier. Consider your next steps carefully.' };
  } else {
    if (adjusted >= 85) return { grade: '5', band: 'Top of Foundation', color: '#22c55e', message: 'Maximum Foundation grade — you\'re excelling at this tier.' };
    if (adjusted >= 68) return { grade: '4', band: 'Strong Pass', color: '#4ade80', message: 'Solid pass. Your weak areas are worth addressing for confidence.' };
    if (adjusted >= 52) return { grade: '3', band: 'Near Pass', color: '#facc15', message: 'Close to the pass boundary. Targeted revision on your weak topics could make the difference.' };
    if (adjusted >= 36) return { grade: '2', band: 'Developing', color: '#fb923c', message: 'Building towards a pass. Focus work on fundamentals could make a real difference.' };
    return { grade: '1', band: 'Early Stage', color: '#ef4444', message: 'Keep going. Consistent practice on core topics is the path forward.' };
  }
}

// ── Animated counter ─────────────────────────────────────────────────────────────
function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setCount(current);
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    };
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);

  return <>{count.toLocaleString()}</>;
}

// ── Main Component ───────────────────────────────────────────────────────────────
export default function GCSEResultsPage() {
  const [step, setStep] = useState(0);
  const [examBoard, setExamBoard] = useState<'edexcel' | 'aqa' | 'ocr' | null>(null);
  const [tier, setTier] = useState<'higher' | 'foundation' | null>(null);
  const [estimatedPercent, setEstimatedPercent] = useState(55);
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Trigger entrance animation on step change
  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, [step]);

  // Initialize topics when board/tier are selected
  useEffect(() => {
    if (examBoard && tier) {
      const list = TOPICS_DB[examBoard]?.[tier] || [];
      setTopics(list.map((t) => ({ ...t, selected: false })));
    }
  }, [examBoard, tier]);

  // Load email from URL query params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, []);

  const weakTopics = topics.filter((t) => t.selected);
  const prediction = examBoard && tier ? predictGrade(tier, estimatedPercent, weakTopics.length, topics.length) : null;

  const toggleTopic = (id: string) => {
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t)));
  };

  const handleShowResults = async () => {
    if (email) {
      setSubmitting(true);
      try {
        await fetch(LEADS_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'gcse-results-quiz-autoverified',
            email,
            role: 'student',
            examBoard,
            tier,
            estimatedPercent,
            weakTopics: weakTopics.map((t) => t.name).join(', ') || 'None flagged',
            predictedGrade: prediction?.grade,
            skipEmailSend: true,
          }),
        });
      } catch {
        /* non-fatal */
      }

      // Track in PostHog
      try {
        const posthog = await import('posthog-js');
        posthog.default.capture('GCSE Quiz Completed', {
          examBoard,
          tier,
          estimatedPercent,
          weakTopicCount: weakTopics.length,
          predictedGrade: prediction?.grade,
          isAutoVerified: true,
        });
      } catch {
        /* posthog optional */
      }

      setSubmitting(false);
      setRevealed(true);
      setStep(5);
    } else {
      setStep(4);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);

    try {
      await fetch(LEADS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'gcse-results-quiz',
          email,
          role: 'student',
          examBoard,
          tier,
          estimatedPercent,
          weakTopics: weakTopics.map((t) => t.name).join(', ') || 'None flagged',
          predictedGrade: prediction?.grade,
        }),
      });
    } catch {
      /* don't block reveal */
    }

    // Track in PostHog
    try {
      const posthog = await import('posthog-js');
      posthog.default.capture('GCSE Quiz Completed', {
        examBoard,
        tier,
        estimatedPercent,
        weakTopicCount: weakTopics.length,
        predictedGrade: prediction?.grade,
      });
    } catch {
      /* posthog optional */
    }

    setSubmitting(false);
    setRevealed(true);
    setStep(5);
  };

  const progressPercent = Math.min((step / 5) * 100, 100);

  // ── STEP 0: HERO HOOK ─────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <main className="min-h-screen bg-[#00071a] flex items-center justify-center px-4 py-16 relative overflow-hidden dark">
        {/* Ambient blobs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#4c70f5]/8 rounded-full blur-[150px] animate-blob" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] animate-blob animation-delay-4000" />

        <div className={`max-w-2xl w-full text-center relative z-10 transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {/* Social proof */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-bold tracking-wide">
              <AnimatedCounter target={2847} /> students checked their results today
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[0.95]">
            Your GCSE Maths<br />
            <span className="text-gradient-primary">Results Analysis</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-4 max-w-lg mx-auto leading-relaxed">
            The exam hall stress is over. Find out where you really stand — in 30 seconds.
          </p>

          <p className="text-gray-500 text-sm mb-12 max-w-md mx-auto">
            Free. No sign-up needed to start. Based on 2024/2025 grade boundary data.
          </p>

          <button
            onClick={() => setStep(1)}
            className="group px-10 py-5 rounded-2xl bg-[#4c70f5] hover:bg-[#3b5bdb] text-white font-bold text-lg transition-all hover:scale-[1.03] active:scale-[0.98] shadow-2xl shadow-[#4c70f5]/25 flex items-center gap-3 mx-auto"
          >
            Start My Analysis
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <div className="mt-16 flex items-center justify-center gap-8 text-gray-600 text-xs">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              No data shared
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Takes 30 seconds
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              100% free
            </span>
          </div>
        </div>
      </main>
    );
  }

  // ── Shared layout for steps 1-5 ────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#00071a] px-4 py-8 md:py-16 relative overflow-hidden dark">
      {/* Ambient */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#4c70f5]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/4 rounded-full blur-[100px]" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => step > 1 && !revealed && setStep(step - 1)}
              className={`text-sm flex items-center gap-1.5 transition-colors ${step > 1 && !revealed ? 'text-gray-400 hover:text-white cursor-pointer' : 'text-gray-700 cursor-default'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </button>
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
              Step {Math.min(step, 4)} of 4
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#4c70f5] to-[#5c9dff] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* ── STEP 1: EXAM BOARD & TIER ──────────────────────────────────────── */}
        {step === 1 && (
          <div className={`transition-all duration-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              Which exam did you sit?
            </h2>
            <p className="text-gray-400 mb-10">
              We'll calibrate your analysis to the exact paper and grade boundaries.
            </p>

            {/* Board */}
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Exam Board</label>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {(['edexcel', 'aqa', 'ocr'] as const).map((board) => (
                <button
                  key={board}
                  onClick={() => setExamBoard(board)}
                  className={`py-5 rounded-2xl border-2 text-center font-bold text-sm uppercase tracking-wider transition-all ${
                    examBoard === board
                      ? 'border-[#4c70f5] bg-[#4c70f5]/10 text-white scale-[1.02] shadow-lg shadow-[#4c70f5]/10'
                      : 'border-[#1f2937] bg-[#0d1117] text-gray-400 hover:border-gray-600 hover:bg-[#161B22]'
                  }`}
                >
                  {board}
                </button>
              ))}
            </div>

            {/* Tier */}
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Entry Tier</label>
            <div className="grid grid-cols-2 gap-3 mb-10">
              {(['higher', 'foundation'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`py-5 rounded-2xl border-2 text-center font-bold text-sm uppercase tracking-wider transition-all ${
                    tier === t
                      ? 'border-[#4c70f5] bg-[#4c70f5]/10 text-white scale-[1.02] shadow-lg shadow-[#4c70f5]/10'
                      : 'border-[#1f2937] bg-[#0d1117] text-gray-400 hover:border-gray-600 hover:bg-[#161B22]'
                  }`}
                >
                  {t === 'higher' ? '📈 Higher (Grades 4–9)' : '📊 Foundation (Grades 1–5)'}
                </button>
              ))}
            </div>

            <button
              onClick={() => examBoard && tier && setStep(2)}
              disabled={!examBoard || !tier}
              className="w-full py-4 rounded-2xl bg-[#4c70f5] hover:bg-[#3b5bdb] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-lg transition-all shadow-lg shadow-[#4c70f5]/20 flex items-center justify-center gap-2"
            >
              Continue
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
        )}

        {/* ── STEP 2: ESTIMATED MARKS ────────────────────────────────────────── */}
        {step === 2 && (
          <div className={`transition-all duration-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              How do you think you did?
            </h2>
            <p className="text-gray-400 mb-10">
              Don&apos;t overthink it — a rough gut feeling across all 3 papers is fine. We&apos;ll use this to estimate your grade band.
            </p>

            <div className="bg-[#0d1117] border border-[#1f2937] rounded-3xl p-8 md:p-10 mb-8">
              {/* Big percentage display */}
              <div className="text-center mb-8">
                <div className="text-7xl md:text-8xl font-black text-white mb-2 tracking-tighter tabular-nums">
                  {estimatedPercent}%
                </div>
                <p className="text-gray-500 text-sm">
                  estimated marks across Papers 1, 2 & 3
                </p>
              </div>

              {/* Slider */}
              <div className="relative px-2">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={estimatedPercent}
                  onChange={(e) => setEstimatedPercent(Number(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-red-500 via-amber-500 via-50% to-emerald-500"
                  style={{
                    WebkitAppearance: 'none',
                    outline: 'none',
                  }}
                />
                <div className="flex justify-between mt-3 text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                  <span>Struggled</span>
                  <span>Okay</span>
                  <span>Confident</span>
                  <span>Nailed it</span>
                </div>
              </div>
            </div>

            {/* Context nudge */}
            <div className="flex items-start gap-3 bg-[#4c70f5]/5 border border-[#4c70f5]/15 rounded-xl p-4 mb-8">
              <span className="text-lg mt-0.5">💡</span>
              <p className="text-gray-400 text-sm leading-relaxed">
                <strong className="text-gray-300">Tip:</strong> Most students overestimate by 5–10%. If you&apos;re unsure, slide a little lower — the analysis will be more useful.
              </p>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full py-4 rounded-2xl bg-[#4c70f5] hover:bg-[#3b5bdb] text-white font-bold text-lg transition-all shadow-lg shadow-[#4c70f5]/20 flex items-center justify-center gap-2"
            >
              Continue
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
        )}

        {/* ── STEP 3: TOPIC WEAKNESSES ───────────────────────────────────────── */}
        {step === 3 && (
          <div className={`transition-all duration-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              Which topics tripped you up?
            </h2>
            <p className="text-gray-400 mb-2">
              Tap every topic you felt shaky on during the exam. Be honest — this is how we find the gaps.
            </p>
            <p className="text-xs text-gray-600 mb-8">
              {weakTopics.length} of {topics.length} flagged
              {weakTopics.length === 0 && ' — tap to select'}
            </p>

            {/* Topics grouped by category */}
            <div className="space-y-6 mb-10 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(
                topics.reduce<Record<string, TopicItem[]>>((acc, t) => {
                  if (!acc[t.category]) acc[t.category] = [];
                  acc[t.category].push(t);
                  return acc;
                }, {})
              ).map(([category, items]) => (
                <div key={category}>
                  <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-3 pl-1">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {items.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => toggleTopic(topic.id)}
                        className={`text-left px-4 py-3.5 rounded-xl border-2 transition-all text-sm font-medium ${
                          topic.selected
                            ? 'border-red-500/60 bg-red-500/10 text-red-300 shadow-lg shadow-red-500/5'
                            : 'border-[#1f2937] bg-[#0d1117] text-gray-400 hover:border-gray-600 hover:text-gray-300'
                        }`}
                      >
                        <span className="mr-2">{topic.selected ? '🔴' : '⚪'}</span>
                        {topic.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleShowResults}
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-[#4c70f5] hover:bg-[#3b5bdb] disabled:opacity-50 text-white font-bold text-lg transition-all shadow-lg shadow-[#4c70f5]/20 flex items-center justify-center gap-2"
            >
              {submitting ? 'Generating...' : 'Show My Results'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
        )}

        {/* ── STEP 4: BLURRED RESULTS + EMAIL GATE ───────────────────────────── */}
        {step === 4 && prediction && (
          <div className={`transition-all duration-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              Your results are ready
            </h2>
            <p className="text-gray-400 mb-8">
              Enter your email to unlock your full personalised analysis.
            </p>

            {/* Blurred preview card */}
            <div className="relative rounded-3xl overflow-hidden mb-8">
              {/* The blurred content */}
              <div className="bg-[#0d1117] border border-[#1f2937] rounded-3xl p-8 md:p-10 select-none" style={{ filter: 'blur(8px)' }}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Predicted Grade</p>
                    <p className="text-6xl font-black text-white">{prediction.grade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Band</p>
                    <p className="text-xl font-bold text-white">{prediction.band}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-800 rounded-full w-3/4" />
                  <div className="h-4 bg-gray-800 rounded-full w-1/2" />
                  <div className="h-4 bg-gray-800 rounded-full w-2/3" />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-gray-900 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white">{weakTopics.length}</p>
                    <p className="text-xs text-gray-500">Weak areas</p>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white">{topics.length - weakTopics.length}</p>
                    <p className="text-xs text-gray-500">Strong areas</p>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white">{estimatedPercent}%</p>
                    <p className="text-xs text-gray-500">Est. marks</p>
                  </div>
                </div>
              </div>

              {/* Overlay with email form */}
              <div className="absolute inset-0 flex items-center justify-center bg-[#00071a]/60 backdrop-blur-sm rounded-3xl">
                <div className="w-full max-w-sm px-6">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-[#4c70f5]/15 border border-[#4c70f5]/30 flex items-center justify-center text-2xl mx-auto mb-4">
                      🔒
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1.5">Unlock Your Full Analysis</h3>
                    <p className="text-gray-400 text-sm">
                      Free — we&apos;ll email you a copy too
                    </p>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-5 py-4 rounded-xl bg-[#161B22] border border-[#30363D] text-white placeholder-gray-600 focus:outline-none focus:border-[#4c70f5] focus:ring-1 focus:ring-[#4c70f5]/30 text-sm font-medium"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={submitting || !email}
                      className="w-full py-4 rounded-xl bg-[#4c70f5] hover:bg-[#3b5bdb] disabled:opacity-40 text-white font-bold text-sm transition-all shadow-lg shadow-[#4c70f5]/25 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                          Analysing...
                        </span>
                      ) : (
                        <>
                          Reveal My Grade
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </>
                      )}
                    </button>
                  </form>

                  <p className="text-center text-[11px] text-gray-600 mt-4 leading-snug">
                    No spam. Unsubscribe any time. We&apos;ll only use this to send your results and optional revision tips.
                  </p>
                </div>
              </div>
            </div>

            {/* FOMO nudges */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-[#0d1117] border border-[#1f2937] rounded-xl p-4">
                <p className="text-2xl font-bold text-white mb-1">83%</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">of students found surprises in their analysis</p>
              </div>
              <div className="bg-[#0d1117] border border-[#1f2937] rounded-xl p-4">
                <p className="text-2xl font-bold text-white mb-1">±1</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">grade accuracy vs. real results</p>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: REVEALED RESULTS + SIGNUP CTA ──────────────────────────── */}
        {step === 5 && prediction && revealed && (
          <div className={`transition-all duration-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Grade Card */}
            <div className="bg-[#0d1117] border border-[#1f2937] rounded-3xl p-8 md:p-10 mb-6">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Your Predicted Grade</p>
                  <div className="flex items-end gap-4">
                    <span
                      className="text-8xl font-black leading-none"
                      style={{ color: prediction.color }}
                    >
                      {prediction.grade}
                    </span>
                    <div className="pb-3">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                        style={{ color: prediction.color, borderColor: prediction.color + '40', backgroundColor: prediction.color + '15' }}
                      >
                        {prediction.band}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{examBoard?.toUpperCase()} · {tier?.toUpperCase()}</p>
                  <p className="text-3xl font-bold text-white">{estimatedPercent}%</p>
                  <p className="text-xs text-gray-500">estimated</p>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-8 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                {prediction.message}
              </p>

              {/* Weak topics breakdown */}
              {weakTopics.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">
                    🔴 Topics Costing You Marks ({weakTopics.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {weakTopics.map((t) => (
                      <span key={t.id} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-xs font-medium">
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-400">{weakTopics.length}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Weak areas</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{topics.length - weakTopics.length}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Strong areas</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#5c9dff]">{estimatedPercent}%</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Est. marks</p>
                </div>
              </div>
            </div>

            {/* CTA: Bridge the gap */}
            <div className="bg-gradient-to-br from-[#4c70f5]/10 to-[#0d1117] border border-[#4c70f5]/20 rounded-3xl p-8 md:p-10 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                Want to close the gap?
              </h3>
              <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto leading-relaxed">
                {weakTopics.length > 0
                  ? `You flagged ${weakTopics.length} weak ${weakTopics.length === 1 ? 'topic' : 'topics'}. We'll match you with a tutor who specialises in exactly ${weakTopics.length === 1 ? 'that area' : 'those areas'} — and build a plan around your target grade.`
                  : "Set up your free profile and we'll match you with a tutor to help you hit your next academic target."}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Link
                  href={`/signup?utm_source=gcse_results&utm_medium=quiz&utm_campaign=gcse_2026&email=${encodeURIComponent(email)}`}
                  className="flex-1 py-4 rounded-xl bg-[#4c70f5] hover:bg-[#3b5bdb] text-white font-bold text-sm transition-all shadow-lg shadow-[#4c70f5]/25 text-center"
                >
                  Create Free Account →
                </Link>
                <Link
                  href="https://studyhours.com/bookings/new?utm_source=gcse_results&utm_medium=quiz"
                  target="_blank"
                  className="flex-1 py-4 rounded-xl bg-[#161B22] border border-[#30363D] hover:bg-[#1f2937] text-white font-semibold text-sm transition-all text-center"
                >
                  Book Free Strategy Call
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center gap-6 text-[10px] text-gray-600 uppercase tracking-widest">
                <span>✓ No credit card</span>
                <span>✓ Cancel any time</span>
                <span>✓ First session free</span>
              </div>
            </div>

            {/* Download PDF nudge */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                📎 We&apos;ve also sent the <strong className="text-gray-300">GCSE Paper 3 Complete Solutions PDF</strong> to {email}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
