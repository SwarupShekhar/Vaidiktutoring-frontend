"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.studyhours.com").replace(/\/$/, "");

export default function HitlistClient() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/leads/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "gcse-paper3-hitlist" }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
      {/* Header */}
      <div className="max-w-3xl w-full text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 rounded-full px-4 py-1.5 text-sm font-bold mb-6">
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          GCSE Maths Paper 3 is on Wednesday 10 June
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Free GCSE Maths Paper 3 Hit-List + Formula Cheat Sheet
        </h1>
        <p className="text-xl text-gray-600">
          We analyzed past papers for Edexcel, AQA, and OCR. Here is exactly what you need to revise for Wednesday's calculator exam.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        
        {/* Left Col: Visuals/Value */}
        <div className="space-y-6">
          {/* Sneak Peek Hook */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚠️</span>
              <h3 className="text-red-800 font-bold text-lg">Did you know?</h3>
            </div>
            <p className="text-red-900 text-sm mb-3">
              Most students lose <strong>at least 4 marks</strong> on Paper 3 because of how their Casio calculator handles negatives.
            </p>
            <div className="bg-white rounded-lg p-3 text-sm text-gray-800 font-mono">
              -3² = -9 <span className="text-red-500 font-bold ml-2">❌ WRONG</span><br />
              (-3)² = 9 &nbsp;<span className="text-green-500 font-bold ml-2">✅ CORRECT</span>
            </div>
            <p className="text-red-800 text-sm mt-3 font-medium">
              Download the Hit-List to get the 4 other calculator traps you must avoid on Wednesday.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">PDF #1</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">📄 The Paper 3 Hit-List</h3>
            <ul className="space-y-3 text-sm text-gray-600 mt-4">
              <li className="flex gap-2"><span>✅</span> <strong>Foundation Must-Haves:</strong> Compound interest, ratio, compound measures, pythagoras/trig.</li>
              <li className="flex gap-2"><span>✅</span> <strong>Higher 7→9 Band:</strong> Sine/cosine rule, vectors, bounds, iteration, rates of change.</li>
              <li className="flex gap-2"><span>✅</span> <strong>Calculator Hacks:</strong> Exactly how to use your Casio to avoid losing silly marks.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">PDF #2</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">🧮 Formula Cheat Sheet</h3>
            <ul className="space-y-3 text-sm text-gray-600 mt-4">
              <li className="flex gap-2"><span>✅</span> <strong>Colour-coded:</strong> Shows exactly what is GIVEN on the exam sheet vs what you MUST memorise.</li>
              <li className="flex gap-2"><span>✅</span> <strong>Grouped properly:</strong> Trig, algebra, mensuration, and stats.</li>
            </ul>
          </div>
        </div>

        {/* Right Col: Capture Form */}
        <div className="flex flex-col justify-center">
          {!submitted ? (
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl shadow-blue-900/5">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                Download the PDFs
              </h2>
              <p className="text-gray-500 text-sm text-center mb-8">
                Enter your email to instantly download both the Hit-List and the Formula Cheat Sheet.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 text-base focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-4 text-lg transition-all disabled:opacity-60 disabled:hover:bg-blue-600 shadow-lg shadow-blue-600/30"
                >
                  {loading ? "Sending..." : "Get Free PDFs →"}
                </button>
              </form>
              <p className="text-xs text-gray-400 text-center mt-6">
                We'll also email you a copy so you can print it later. No spam.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-green-200 shadow-xl shadow-green-900/5 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Success! You're in.
              </h2>
              <p className="text-gray-600 mb-8">
                We've also emailed you a copy, but you can download your PDFs directly below right now:
              </p>
              
              <div className="space-y-4">
                <a
                  href="/GCSE-Maths-Paper3-Calc-Hitlist.pdf"
                  download
                  className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl py-4 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Paper 3 Hit-List
                </a>
                
                <a
                  href="/GCSE-Maths-Calc-Formula-CheatSheet.pdf"
                  download
                  className="flex items-center justify-center gap-2 w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-900 font-semibold rounded-xl py-4 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Formula Sheet
                </a>
              </div>
              
              <p className="text-sm text-gray-500 mt-6">
                Print these off and keep them on your desk until Wednesday. Good luck!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
