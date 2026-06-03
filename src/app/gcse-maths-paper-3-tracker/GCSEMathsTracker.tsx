'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1511608449811611648/g5AOsrFpWuu_20NNuRb8Qc7rANvdsUQx4j09vNW-RaDhTtJGs157_e-8DTh3aRPxHtZx';
const BOOKING_URL = 'https://studyhours.com/bookings/new?utm_source=gcse_tracker&utm_medium=website&utm_campaign=gcse_paper3';
const DISCORD_URL = 'https://discord.gg/7PYHxCPK';

interface Topic {
  id: string;
  name: string;
  category: string;
  status: 'unseen' | 'tested';
  confidence: 'red' | 'amber' | 'green' | null;
}

const INITIAL_TOPICS_DB: Record<string, Record<string, Omit<Topic, 'status' | 'confidence'>[]>> = {
  edexcel: {
    higher: [
      { id: 'sine_cosine', name: 'Sine/Cosine Rules & Triangle Area (0.5 * a * b * sin C)', category: 'Geometry & Trig' },
      { id: 'algebraic_fractions', name: 'Algebraic Fractions (Solving & Simplifying)', category: 'Algebra' },
      { id: 'composite_functions', name: 'Functions (Composite & Inverse)', category: 'Algebra' },
      { id: 'vectors_proof', name: 'Geometric Vector Proofs', category: 'Geometry & Trig' },
      { id: 'bounds', name: 'Error Intervals & Upper/Lower Bounds Calculations', category: 'Number' },
      { id: 'histograms', name: 'Histograms (Drawing & Calculating Frequency Density)', category: 'Probability & Stats' },
      { id: 'cumulative_frequency', name: 'Cumulative Frequency & Box Plots', category: 'Probability & Stats' },
      { id: 'conditional_prob', name: 'Conditional Probability Trees (Dependent Events)', category: 'Probability & Stats' },
      { id: 'direct_inverse_prop', name: 'Direct & Inverse Proportion (y = k/x or y = kx)', category: 'Ratio & Proportion' },
      { id: 'compound_interest', name: 'Compound Interest & Reverse Percentages', category: 'Ratio & Proportion' },
      { id: 'quadratic_tangents', name: 'Estimating Gradients of Curves via Tangents', category: 'Algebra' },
      { id: 'iteration', name: 'Iteration & Numerical Methods', category: 'Algebra' },
    ],
    foundation: [
      { id: 'pythagoras', name: 'Pythagoras\' Theorem (Hypotenuse & Shorter Sides)', category: 'Geometry & Trig' },
      { id: 'sohcahtoa', name: 'Trigonometry (SOH CAH TOA for Angle & Side)', category: 'Geometry & Trig' },
      { id: 'bounds_f', name: 'Error Intervals & Truncation Bounds', category: 'Number' },
      { id: 'compound_interest_f', name: 'Compound Interest & Asset Depreciation', category: 'Ratio & Proportion' },
      { id: 'reverse_percentages_f', name: 'Reverse Percentages (Original Price)', category: 'Ratio & Proportion' },
      { id: 'probability_trees_f', name: 'Probability Trees (Independent Events)', category: 'Probability & Stats' },
      { id: 'venn_diagrams', name: 'Venn Diagrams & Set Notation (Union/Intersection)', category: 'Probability & Stats' },
      { id: 'frequency_trees', name: 'Frequency Trees (Filling & Reading)', category: 'Probability & Stats' },
      { id: 'draw_graphs', name: 'Drawing Linear & Quadratic Graphs from Tables', category: 'Algebra' },
      { id: 'speed_density', name: 'Compound Measures (Speed, Density, and Pressure)', category: 'Ratio & Proportion' },
      { id: 'area_sectors', name: 'Circumference & Area of Circle / Sectors', category: 'Geometry & Trig' },
    ]
  },
  aqa: {
    higher: [
      { id: 'sine_cosine', name: 'Sine/Cosine Rules & 1/2 * a * b * sin C', category: 'Geometry & Trig' },
      { id: 'algebraic_fractions', name: 'Algebraic Fractions (Simplifying & Operations)', category: 'Algebra' },
      { id: 'composite_functions', name: 'Composite and Inverse Functions', category: 'Algebra' },
      { id: 'vectors_proof', name: 'Vectors Geometric Proof', category: 'Geometry & Trig' },
      { id: 'product_rule', name: 'Product Rule for Counting', category: 'Probability & Stats' },
      { id: 'bounds', name: 'Error Intervals and Bounds Calculations', category: 'Number' },
      { id: 'histograms', name: 'Histograms', category: 'Probability & Stats' },
      { id: 'direct_inverse_prop', name: 'Direct & Inverse Proportion Equations', category: 'Ratio & Proportion' },
      { id: 'iteration', name: 'Iteration Formulas', category: 'Algebra' },
      { id: 'compound_interest', name: 'Compound Interest & Compound Depreciation', category: 'Ratio & Proportion' },
      { id: 'simultaneous_non_linear', name: 'Simultaneous Equations (One Linear, One Quadratic)', category: 'Algebra' },
      { id: 'circle_theorems', name: 'Circle Theorems & Geometric Proofs', category: 'Geometry & Trig' },
    ],
    foundation: [
      { id: 'reverse_percentages_f', name: 'Reverse Percentages', category: 'Ratio & Proportion' },
      { id: 'compound_interest_f', name: 'Compound Interest', category: 'Ratio & Proportion' },
      { id: 'pythagoras', name: 'Pythagoras\' Theorem', category: 'Geometry & Trig' },
      { id: 'sohcahtoa', name: 'Basic Trigonometry (SOH CAH TOA)', category: 'Geometry & Trig' },
      { id: 'angles_polygons', name: 'Interior & Exterior Angles in Polygons', category: 'Geometry & Trig' },
      { id: 'speed_density', name: 'Speed, Density, and Pressure', category: 'Ratio & Proportion' },
      { id: 'venn_diagrams', name: 'Venn Diagrams & Simple Probability', category: 'Probability & Stats' },
      { id: 'scatter_graphs', name: 'Scatter Graphs & Line of Best Fit', category: 'Probability & Stats' },
      { id: 'volume_prisms', name: 'Volume & Surface Area of Prisms & Cylinders', category: 'Geometry & Trig' },
      { id: 'ratio_sharing', name: 'Sharing in a Ratio (Two/Three parts)', category: 'Ratio & Proportion' },
    ]
  },
  ocr: {
    higher: [
      { id: 'bounds', name: 'Bounds & Error Intervals', category: 'Number' },
      { id: 'sine_cosine', name: 'Advanced Trigonometry (Sine/Cosine rules)', category: 'Geometry & Trig' },
      { id: 'algebraic_fractions', name: 'Algebraic Fractions (Simplifying & Equation Solving)', category: 'Algebra' },
      { id: 'quadratic_graphs', name: 'Quadratic & Cubic Graphs (Drawing & Intersection)', category: 'Algebra' },
      { id: 'cumulative_frequency', name: 'Cumulative Frequency and Box Plots', category: 'Probability & Stats' },
      { id: 'conditional_prob', name: 'Conditional Probability Trees', category: 'Probability & Stats' },
      { id: 'vectors_proof', name: 'Vectors Geometric Proof', category: 'Geometry & Trig' },
    ],
    foundation: [
      { id: 'ratio_percent', name: 'Ratio and Percentages Problems', category: 'Ratio & Proportion' },
      { id: 'standard_form', name: 'Standard Form Calculations (Scientific notation)', category: 'Number' },
      { id: 'pythagoras', name: 'Pythagoras\' Theorem', category: 'Geometry & Trig' },
      { id: 'frequency_polygons', name: 'Frequency Polygons', category: 'Probability & Stats' },
      { id: 'circle_area', name: 'Circle Area and Circumference', category: 'Geometry & Trig' },
      { id: 'speed_density', name: 'Speed, Distance, Time and Density', category: 'Ratio & Proportion' },
    ]
  }
};

export default function GCSEMathsTracker() {
  const [step, setStep] = useState(0); // 0 = board/tier select, 1 = dashboard, 2 = success
  const [examBoard, setExamBoard] = useState<'edexcel' | 'aqa' | 'ocr'>('edexcel');
  const [tier, setTier] = useState<'higher' | 'foundation'>('higher');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTab, setActiveTab] = useState<'tracker' | 'calculator'>('tracker');
  const [calcModel, setCalcModel] = useState<'ex' | 'cw' | 'gtx'>('ex'); // ex = fx-991EX, cw = fx-991CW, gtx = fx-83/85GTX

  // Lead capture states
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [gdpr, setGdpr] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Initialize topics when exam board / tier changes
  useEffect(() => {
    const list = INITIAL_TOPICS_DB[examBoard]?.[tier] || [];
    setTopics(list.map(t => ({
      ...t,
      status: 'unseen',
      confidence: null
    })));
  }, [examBoard, tier]);

  const unseenTopics = topics.filter(t => t.status === 'unseen');
  const testedTopics = topics.filter(t => t.status === 'tested');

  function toggleTopicStatus(id: string) {
    setTopics(topics.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'unseen' ? 'tested' : 'unseen'
        };
      }
      return t;
    }));
  }

  function setTopicConfidence(id: string, conf: 'red' | 'amber' | 'green') {
    setTopics(topics.map(t => {
      if (t.id === id) {
        return { ...t, confidence: t.confidence === conf ? null : conf };
      }
      return t;
    }));
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !gdpr) return;
    setSubmitting(true);

    const redList = topics.filter(t => t.status === 'unseen' && t.confidence === 'red').map(t => t.name);
    const amberList = topics.filter(t => t.status === 'unseen' && t.confidence === 'amber').map(t => t.name);
    const greenList = topics.filter(t => t.status === 'unseen' && t.confidence === 'green').map(t => t.name);

    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '🇬🇧 New GCSE Paper 3 Lead',
            color: 0x4c70f5,
            fields: [
              { name: 'Email', value: email, inline: false },
              { name: 'Role', value: role, inline: true },
              { name: 'Exam Board', value: examBoard.toUpperCase(), inline: true },
              { name: 'Tier', value: tier.toUpperCase(), inline: true },
              { name: '🔴 Need Help With', value: redList.length > 0 ? redList.join('\n') : 'None listed', inline: false },
              { name: '🟡 Getting There', value: amberList.length > 0 ? amberList.join('\n') : 'None listed', inline: false },
              { name: '🟢 Confident In', value: greenList.length > 0 ? greenList.join('\n') : 'None listed', inline: false },
              { name: 'Unseen Remaining', value: `${unseenTopics.length} / ${topics.length} topics`, inline: true },
            ],
            footer: { text: 'studyhours.com/gcse-maths-paper-3-tracker' },
          }],
        }),
      });
    } catch (err) {
      console.error('Webhook error:', err);
    }

    setSubmitting(false);
    setStep(2); // Go to success screen
  }

  // ── STEP 0: SELECT BOARD & TIER ──
  if (step === 0) {
    return (
      <main className="min-h-screen bg-[#00071a] flex items-center justify-center px-4 py-20 relative overflow-hidden dark">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4c70f5]/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] animate-blob animation-delay-2000" />

        <div className="max-w-2xl w-full text-center relative z-10">
          <span className="px-4 py-1.5 rounded-full bg-[#4c70f5]/15 border border-[#4c70f5]/30 text-[#5c9dff] text-xs font-semibold uppercase tracking-widest mb-6 inline-block">
            Wednesday 10 June · Calculator Paper
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-none">
            GCSE Maths Paper 3<br />
            <span className="text-gradient-primary">Unseen Topic Tracker</span>
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-lg mx-auto">
            Papers 1 & 2 are finished. Revise smart for the final paper by tracking what hasn't appeared yet, and unlock top Casio calculator shortcuts.
          </p>

          <div className="bg-glass rounded-3xl p-8 mb-10 text-left">
            <h2 className="text-xl font-semibold text-white mb-6">Select your exam setup</h2>
            
            {/* Exam Board selection */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Exam Board</label>
              <div className="grid grid-cols-3 gap-3">
                {(['edexcel', 'aqa', 'ocr'] as const).map(board => (
                  <button
                    key={board}
                    type="button"
                    onClick={() => setExamBoard(board)}
                    className={`py-4 rounded-xl border text-center font-bold text-sm uppercase tracking-wider transition-all-fast ${
                      examBoard === board
                        ? 'border-[#4c70f5] bg-[#4c70f5]/10 text-white'
                        : 'border-[#30363D] bg-[#161B22]/50 text-gray-400 hover:border-gray-600 hover:bg-[#161B22]'
                    }`}
                  >
                    {board}
                  </button>
                ))}
              </div>
            </div>

            {/* Tier selection */}
            <div className="mb-8">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Entry Tier</label>
              <div className="grid grid-cols-2 gap-3">
                {(['higher', 'foundation'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={`py-4 rounded-xl border text-center font-bold text-sm uppercase tracking-wider transition-all-fast ${
                      tier === t
                        ? 'border-[#4c70f5] bg-[#4c70f5]/10 text-white'
                        : 'border-[#30363D] bg-[#161B22]/50 text-gray-400 hover:border-gray-600 hover:bg-[#161B22]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full py-4 rounded-xl bg-[#4c70f5] hover:bg-[#3b5bdb] text-white font-bold text-lg transition-all hover:scale-[1.02] shadow-lg shadow-[#4c70f5]/20 flex items-center justify-center gap-2"
            >
              Start Revision Audit
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── STEP 1: REVISION PLANNER DASHBOARD ──
  if (step === 1) {
    return (
      <main className="min-h-screen bg-[#00071a] px-4 py-12 md:py-24 relative overflow-hidden dark">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#4c70f5]/5 rounded-full blur-[120px]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-8 border-b border-[#30363D]">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-gray-300 text-xs font-mono uppercase">
                  {examBoard}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-gray-300 text-xs font-mono uppercase">
                  {tier}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Paper 3 Revision Hub</h1>
            </div>
            
            <button 
              onClick={() => setStep(0)} 
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              ← Change Exam setup
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT / CENTER COLUMN: TRACKER OR CALCULATOR HACKS */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Tracker Stats Header */}
              <div className="bg-glass rounded-2xl p-6 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h3 className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-1">Paper 3 Revision Focus</h3>
                  <p className="text-2xl font-bold text-white">
                    {unseenTopics.length} Unseen Topics Remaining
                  </p>
                </div>
                <div className="w-full md:w-auto h-2 bg-[#161B22] rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-[#4c70f5] transition-all duration-500" 
                    style={{ width: `${(testedTopics.length / topics.length) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  {testedTopics.length} of {topics.length} tested
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-[#30363D]">
                <button
                  onClick={() => setActiveTab('tracker')}
                  className={`flex-1 pb-4 text-center font-bold text-sm border-b-2 transition-all ${
                    activeTab === 'tracker'
                      ? 'border-[#4c70f5] text-white'
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  📋 Revision Checklist
                </button>
                <button
                  onClick={() => setActiveTab('calculator')}
                  className={`flex-1 pb-4 text-center font-bold text-sm border-b-2 transition-all ${
                    activeTab === 'calculator'
                      ? 'border-[#4c70f5] text-white'
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  🧮 Casio Calculator Hacks
                </button>
              </div>

              {/* TAB 1: TOPIC TRACKER LIST */}
              {activeTab === 'tracker' && (
                <div className="space-y-4">
                  <p className="text-xs text-gray-500 italic">
                    Note: We pre-loaded topics statistically likely to appear in Paper 3. Click the checkbox to mark topics that already appeared in Paper 1 or 2.
                  </p>
                  
                  {unseenTopics.length === 0 ? (
                    <div className="bg-glass rounded-2xl p-12 text-center border border-dashed border-[#30363D]">
                      <span className="text-4xl mb-4 block">🎉</span>
                      <h4 className="text-lg font-bold text-white mb-2">All topics marked as completed!</h4>
                      <p className="text-gray-400 text-sm">Use the form on the right to claim your predicted revision papers.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {unseenTopics.map(topic => (
                        <div 
                          key={topic.id}
                          className="bg-glass rounded-xl p-4 border border-[#30363D]/80 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-gray-800"
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={topic.status === 'tested'}
                              onChange={() => toggleTopicStatus(topic.id)}
                              className="mt-1 w-5 h-5 rounded border-[#30363D] bg-zinc-900 text-[#4c70f5] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                            />
                            <div>
                              <h4 className="font-semibold text-white text-sm md:text-base leading-snug">{topic.name}</h4>
                              <span className="text-xs text-[#5c9dff] font-medium bg-[#4c70f5]/10 px-2 py-0.5 rounded-full inline-block mt-1">
                                {topic.category}
                              </span>
                            </div>
                          </div>

                          {/* Confidence RAG controls */}
                          <div className="flex items-center gap-2 self-end md:self-auto">
                            <span className="text-xs text-gray-500 mr-2">Your Confidence:</span>
                            <button
                              type="button"
                              onClick={() => setTopicConfidence(topic.id, 'red')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all-fast ${
                                topic.confidence === 'red'
                                  ? 'bg-red-500/20 border border-red-500 text-red-400'
                                  : 'bg-zinc-900 border border-zinc-800 text-gray-500 hover:text-red-400 hover:border-red-500/50'
                              }`}
                            >
                              Need Help
                            </button>
                            <button
                              type="button"
                              onClick={() => setTopicConfidence(topic.id, 'amber')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all-fast ${
                                topic.confidence === 'amber'
                                  ? 'bg-amber-500/20 border border-amber-500 text-amber-400'
                                  : 'bg-zinc-900 border border-zinc-800 text-gray-500 hover:text-amber-400 hover:border-amber-500/50'
                              }`}
                            >
                              Okay
                            </button>
                            <button
                              type="button"
                              onClick={() => setTopicConfidence(topic.id, 'green')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all-fast ${
                                topic.confidence === 'green'
                                  ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400'
                                  : 'bg-zinc-900 border border-zinc-800 text-gray-500 hover:text-emerald-400 hover:border-emerald-500/50'
                              }`}
                            >
                              Confident
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tested / Already appeared section */}
                  {testedTopics.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-[#30363D]">
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                        Already Appeared / Completed ({testedTopics.length})
                      </h4>
                      <div className="space-y-2 opacity-50">
                        {testedTopics.map(topic => (
                          <div 
                            key={topic.id}
                            className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-800/80 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={topic.status === 'tested'}
                                onChange={() => toggleTopicStatus(topic.id)}
                                className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-[#4c70f5] cursor-pointer"
                              />
                              <span className="line-through text-gray-400 text-sm">{topic.name}</span>
                            </div>
                            <span className="text-xs text-gray-500 bg-zinc-800 px-2 py-0.5 rounded">
                              {topic.category}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CALCULATOR HACKS */}
              {activeTab === 'calculator' && (
                <div className="space-y-6">
                  {/* Model Selector */}
                  <div className="flex bg-[#161B22]/50 border border-[#30363D] rounded-xl p-1.5">
                    <button
                      onClick={() => setCalcModel('ex')}
                      className={`flex-1 py-2 text-center rounded-lg font-bold text-xs transition-all ${
                        calcModel === 'ex' ? 'bg-[#4c70f5] text-white' : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      Casio fx-991EX (ClassWiz)
                    </button>
                    <button
                      onClick={() => setCalcModel('cw')}
                      className={`flex-1 py-2 text-center rounded-lg font-bold text-xs transition-all ${
                        calcModel === 'cw' ? 'bg-[#4c70f5] text-white' : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      Casio fx-991CW (New Edition)
                    </button>
                    <button
                      onClick={() => setCalcModel('gtx')}
                      className={`flex-1 py-2 text-center rounded-lg font-bold text-xs transition-all ${
                        calcModel === 'gtx' ? 'bg-[#4c70f5] text-white' : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      Casio fx-83/85GTX (Standard)
                    </button>
                  </div>

                  {calcModel === 'ex' && (
                    <div className="space-y-6">
                      
                      {/* Solver 1 */}
                      <div className="bg-glass rounded-2xl p-6 border border-[#30363D]/80">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="w-8 h-8 rounded-full bg-[#5c9dff]/10 text-[#5c9dff] flex items-center justify-center font-bold text-sm">1</span>
                          <h3 className="font-bold text-white text-lg">Instant Quadratic Solver (ax² + bx + c = 0)</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                          Saves you writing out the quadratic formula and prevents double-negative calculation slips. Free marks on Paper 3.
                        </p>
                        <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 font-mono text-sm leading-relaxed text-gray-300">
                          <p className="text-xs text-gray-500 font-semibold mb-2">BUTTON PRESS SEQUENCE:</p>
                          <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mr-1.5">MENU</kbd> → 
                          <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1.5">(-)</kbd> (or navigate down to A: Equation/Func) → 
                          <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1.5">2</kbd> (Polynomial) → 
                          <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1.5">2</kbd> (Degree 2) → 
                          <span className="text-gray-500">Enter coefficients, press</span> <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1.5">=</kbd>
                        </div>
                        <p className="text-xs text-amber-400 mt-3 font-semibold">
                          💡 PRO TIP: Pressing '=' again gives you the X and Y coordinates of the turning point (vertex) of the curve!
                        </p>
                      </div>

                      {/* Solver 2 */}
                      <div className="bg-glass rounded-2xl p-6 border border-[#30363D]/80">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="w-8 h-8 rounded-full bg-[#5c9dff]/10 text-[#5c9dff] flex items-center justify-center font-bold text-sm">2</span>
                          <h3 className="font-bold text-white text-lg">Solve Simultaneous Equations in 5 Seconds</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                          Verify your algebraic solution instantly. Even if the question asks for algebraic steps, solving on the calculator first guarantees you get the correct answer.
                        </p>
                        <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 font-mono text-sm leading-relaxed text-gray-300">
                          <p className="text-xs text-gray-500 font-semibold mb-2">BUTTON PRESS SEQUENCE:</p>
                          <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mr-1.5">MENU</kbd> → 
                          <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1.5">(-)</kbd> → 
                          <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1.5">1</kbd> (Simul Equation) → 
                          <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1.5">2</kbd> (2 unknowns, e.g., x and y) → 
                          <span className="text-gray-500">Input values for ax + by = c, press</span> <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1.5">=</kbd>
                        </div>
                      </div>

                    </div>
                  )}

                  {calcModel === 'cw' && (
                    <div className="space-y-6">
                      <div className="bg-glass rounded-2xl p-6 border border-[#30363D]/80">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="w-8 h-8 rounded-full bg-[#5c9dff]/10 text-[#5c9dff] flex items-center justify-center font-bold text-sm">1</span>
                          <h3 className="font-bold text-white text-lg">Polynomial Solver (New CW Layout)</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                          The new ClassWiz models have a redesigned menu layout. Here is the sequence to solve quadratics:
                        </p>
                        <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 font-mono text-sm leading-relaxed text-gray-300">
                          <p className="text-xs text-gray-500 font-semibold mb-2">BUTTON PRESS SEQUENCE:</p>
                          <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mr-1.5">HOME</kbd> → 
                          <span className="text-gray-500">Navigate to</span> <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1">Equation</kbd> → 
                          <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1.5">OK</kbd> → 
                          <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1.5">Polynomial</kbd> → 
                          <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1.5">ax² + bx + c</kbd> → 
                          <span className="text-gray-500">Enter coefficients, press</span> <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1.5">EXE</kbd>
                        </div>
                      </div>
                    </div>
                  )}

                  {calcModel === 'gtx' && (
                    <div className="space-y-6">
                      <div className="bg-glass rounded-2xl p-6 border border-[#30363D]/80">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="w-8 h-8 rounded-full bg-[#5c9dff]/10 text-[#5c9dff] flex items-center justify-center font-bold text-sm">1</span>
                          <h3 className="font-bold text-white text-lg">Table Mode for Graph Plotting</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                          Crucial for coordinate tables (e.g. cubic or reciprocal graph questions). Automatically generates all Y-values for your table in 3 seconds.
                        </p>
                        <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 font-mono text-sm leading-relaxed text-gray-300">
                          <p className="text-xs text-gray-500 font-semibold mb-2">BUTTON PRESS SEQUENCE:</p>
                          <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mr-1.5">MENU</kbd> → 
                          <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1.5">3</kbd> (Table) → 
                          <span className="text-gray-500">Enter function using</span> <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1.5">ALPHA</kbd> + <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1.5">)</kbd> (to type X) → 
                          <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1.5">=</kbd> → 
                          <span className="text-gray-500">Set Start, End, Step values, press</span> <kbd className="bg-zinc-850 px-2 py-1 rounded border border-zinc-700 shadow text-white mx-1.5">=</kbd>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-300 leading-relaxed">
                    ⚠️ <strong>IMPORTANT:</strong> Always show your working steps! Calculator checkers ensure accuracy, but examiners need to see the formula substitution steps to grant method marks.
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: LEAD MAGNET CARD */}
            <div className="space-y-6">
              <div className="bg-glass border border-[#30363D] rounded-3xl p-6 sticky top-24">
                <div className="w-12 h-12 rounded-2xl bg-[#4c70f5]/15 border border-[#4c70f5]/30 flex items-center justify-center text-2xl mb-6">
                  📥
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Claim Paper 3 Revision Pack</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Submit your email and a tutor will send you a personalised revision pack based on your red topics — within the hour.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="text-emerald-400">✓</span> Custom notes for your weak topics
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="text-emerald-400">✓</span> Casio shortcut reminders for your board
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="text-emerald-400">✓</span> Free — no card required
                  </li>
                </ul>

                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-[#4c70f5] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Who are you?</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-[#4c70f5] text-sm cursor-pointer"
                    >
                      <option value="student">I am a Student</option>
                      <option value="parent">I am a Parent</option>
                      <option value="educator">I am an Educator / Tutor</option>
                    </select>
                  </div>

                  <div className="flex items-start gap-2.5 pt-2">
                    <input
                      type="checkbox"
                      id="gdpr"
                      required
                      checked={gdpr}
                      onChange={(e) => setGdpr(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-[#4c70f5] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="gdpr" className="text-xs text-gray-500 leading-snug cursor-pointer select-none">
                      I agree to receive free GCSE revision updates and tutoring offers. I can unsubscribe anytime. GDPR Compliant.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !gdpr || !email}
                    className="w-full py-4 rounded-xl bg-[#4c70f5] hover:bg-[#3b5bdb] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md shadow-[#4c70f5]/10 mt-4"
                  >
                    {submitting ? 'Creating Pack...' : 'Generate Revision Pack'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>
    );
  }

  // ── STEP 2: SUCCESS STATE ──
  if (step === 2) {
    return (
      <main className="min-h-screen bg-[#00071a] flex items-center justify-center px-4 py-20 relative overflow-hidden dark">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4c70f5]/5 rounded-full blur-[120px]" />
        
        <div className="max-w-xl w-full text-center relative z-10">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto mb-6">
            🎉
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {role === 'parent' ? "Your Child's Revision Pack is Ready!" : "Your Revision Pack is Ready!"}
          </h2>
          <p className="text-gray-400 text-base mb-10 max-w-md mx-auto">
            We have generated your custom checklist and Casio cheat sheet. Click below to download your resources immediately.
          </p>

          <div className="bg-[#161B22] border border-zinc-800 rounded-2xl p-6 mb-8 text-left space-y-3">
            <p className="text-emerald-400 text-sm font-semibold flex items-center gap-2">
              <span>✓</span> Your weak topics have been noted
            </p>
            <p className="text-emerald-400 text-sm font-semibold flex items-center gap-2">
              <span>✓</span> A tutor will email you your custom revision pack within the hour
            </p>
            <p className="text-emerald-400 text-sm font-semibold flex items-center gap-2">
              <span>✓</span> Check your inbox — including your spam folder
            </p>
          </div>

          <div className="bg-glass rounded-3xl p-8 border border-[#30363D] text-left">
            <h3 className="text-lg font-bold text-white mb-2">Want to guarantee a grade boundary jump?</h3>
            <p className="text-gray-400 text-xs md:text-sm mb-6 leading-relaxed">
              Book a free 15-minute exam strategy call. We will match you with a top GCSE Maths scorer who will identify and patch your remaining weak spots in a 1-to-1 session before Wednesday.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={BOOKING_URL}
                target="_blank"
                className="flex-1 text-center py-3.5 rounded-xl bg-[#4c70f5] hover:bg-[#3b5bdb] text-white font-bold text-sm transition-all"
              >
                Book Free Call
              </Link>
              <Link
                href={DISCORD_URL}
                target="_blank"
                className="flex-1 text-center py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-white font-semibold text-sm transition-all"
              >
                Join StudyHours Discord
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
