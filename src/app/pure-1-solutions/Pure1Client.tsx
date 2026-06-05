"use client";

import { useState } from "react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.studyhours.com").replace(/\/$/, "");

export default function Pure1Client() {
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
      // 1. Send email to user via Next.js API
      const res = await fetch('/api/leads', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "pure1_solutions" }),
      });
      if (!res.ok) throw new Error("Failed email delivery");

      // 2. Save lead to NestJS database
      await fetch(`${API_URL}/leads/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "pure1_solutions" }),
      }).catch(err => console.error("DB save error", err));

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-16 px-4">
      {/* Header */}
      <div className="max-w-3xl w-full text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 rounded-full px-4 py-1.5 text-sm font-bold mb-6">
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
          Edexcel A-Level Maths · Paper 1: Pure Mathematics
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Pure 1 Worked Solutions (June 2026)
        </h1>
        <p className="text-xl text-slate-600">
          Mark your own script accurately. Every method step shown exactly how an examiner wants it, built by expert tutors.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl w-full grid lg:grid-cols-[1.2fr_1fr] gap-8">
        
        {/* Left Col: Preview */}
        <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <h3 className="font-bold">Preview: Q1 & Q2</h3>
            <span className="text-xs text-slate-400">15 Questions Total</span>
          </div>
          
          <div className="p-6 space-y-8 select-none relative">
            {/* Question 1 */}
            <div>
              <div className="flex gap-4 mb-4">
                <div className="bg-indigo-50 text-indigo-700 font-bold rounded-lg w-8 h-8 flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-slate-900">Transformations of y = f(x), point P(−4, 5)</h4>
                  <div className="text-sm text-slate-500 font-bold">4 marks</div>
                </div>
              </div>
              
              <div className="pl-12 space-y-4">
                <div>
                  <p className="font-bold text-indigo-700 text-sm mb-2">(a) y = 4f(2x)</p>
                  <p className="text-sm text-slate-600 mb-2">2x inside → horizontal stretch scale factor ½: x-coord halved.<br/>×4 outside → vertical stretch scale factor 4: y-coord ×4.</p>
                  <p className="text-sm text-slate-600 mb-2">x: −4 → −2 &nbsp;&nbsp; y: 5 → 20</p>
                  <span className="inline-block bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-md text-sm font-bold">(−2, 20)</span>
                </div>
                <div>
                  <p className="font-bold text-indigo-700 text-sm mb-2">(b) y = f(x + 3) − 2</p>
                  <p className="text-sm text-slate-600 mb-2">x+3 → translate left 3: −4 → −7. &nbsp; −2 → translate down 2: 5 → 3.</p>
                  <span className="inline-block bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-md text-sm font-bold">(−7, 3)</span>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Question 2 */}
            <div>
              <div className="flex gap-4 mb-4">
                <div className="bg-indigo-50 text-indigo-700 font-bold rounded-lg w-8 h-8 flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-slate-900">Iteration · f(x) = e^(2x−1) + 3x − 7</h4>
                  <div className="text-sm text-slate-500 font-bold">5 marks</div>
                </div>
              </div>
              
              <div className="pl-12 space-y-4">
                <div>
                  <p className="font-bold text-indigo-700 text-sm mb-2">(a) Show α lies in [1.1, 1.2]</p>
                  <p className="text-sm text-slate-600 mb-1">f(1.1) = e^1.2 + 3.3 − 7 = 3.320 − 3.7 = −0.380 &lt; 0</p>
                  <p className="text-sm text-slate-600 mb-2">f(1.2) = e^1.4 + 3.6 − 7 = 4.055 − 3.4 = +0.655 &gt; 0</p>
                  <p className="text-sm text-slate-600">Sign change and f is continuous → a root α lies in [1.1, 1.2]. ∎</p>
                </div>
              </div>
            </div>

            {/* Fading overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-8 z-10 pointer-events-none">
            </div>
          </div>
        </div>

        {/* Right Col: Capture Form */}
        <div className="flex flex-col justify-center">
          {!submitted ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-indigo-900/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500" />
              
              <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center mt-2">
                Get the Full Solutions
              </h2>
              <p className="text-slate-500 text-sm text-center mb-8">
                Enter your email to instantly receive the complete 15-question worked solutions PDF.
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
                    className="w-full border-2 border-slate-200 rounded-xl px-5 py-4 text-base focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-4 text-lg transition-all disabled:opacity-60 disabled:hover:bg-indigo-600 shadow-lg shadow-indigo-600/30"
                >
                  {loading ? "Sending..." : "Send me the PDF →"}
                </button>
              </form>
              
              <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-bold text-amber-800 text-sm flex items-center gap-2 mb-2">
                  <span>💡</span> Note on Marking
                </h4>
                <p className="text-xs text-amber-900 leading-relaxed">
                  "Show that" questions give marks for the <strong>method line</strong>, not just the answer. Accuracy drops are the most common source of lost marks — ensure you distinguish between 3 d.p. and exact form. Our PDF shows where every method mark is awarded.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-green-200 shadow-xl shadow-green-900/5 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Check your inbox!
              </h2>
              <p className="text-slate-600 mb-8 text-lg">
                We've just emailed the full PDF to <strong>{email}</strong>.
              </p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
                <p className="text-sm text-slate-600 mb-2">
                  <strong>Can't find it?</strong> Make sure to check your spam or promotions folder. It should arrive in the next 60 seconds.
                </p>
              </div>
              
              <p className="text-sm text-slate-500 mt-6">
                Good luck tracking your marks. If you need help preparing for Paper 2, just reply to the email!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
