"use client";

import { useState } from "react";
import { PAPER3_PDFS } from "@/app/lib/paper3Pdfs";

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
      // 1. Send email to user via Next.js API
      const res = await fetch('/api/leads', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "gcse-paper3-hitlist" }),
      });
      if (!res.ok) throw new Error("Failed email delivery");

      // 2. Save lead to NestJS database
      await fetch(`${API_URL}/leads/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "gcse-paper3-hitlist" }),
      }).catch(err => console.error("DB save error", err));

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
          The Final 48 Hours: GCSE Maths Paper 3 Hit-List + Calculator Traps
        </h1>
        <p className="text-xl text-gray-600">
          We analyzed past papers for Edexcel, AQA, and OCR. Here is exactly what to revise, hour by hour, before Wednesday's calculator exam — plus the free 3-PDF pack.
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

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-green-700 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">NEW · PDF #3</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">⚙️ Calculator Setup &amp; 10 Traps</h3>
            <ul className="space-y-3 text-sm text-gray-600 mt-4">
              <li className="flex gap-2"><span>✅</span> <strong>60-second setup:</strong> The exact Casio key sequence to run before question 1 (incl. the degrees check that catches most students out).</li>
              <li className="flex gap-2"><span>✅</span> <strong>10 marks-losing traps:</strong> Squaring negatives, rounding early, standard form, iteration — and how to avoid each.</li>
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
                Enter your email to instantly download all three: the Hit-List, the Formula Cheat Sheet, and the Calculator Setup &amp; Traps guide.
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
                Check your inbox!
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                We've just emailed all three PDFs to <strong>{email}</strong>. They'll arrive within the next 60 seconds.
              </p>

              <div className="space-y-2 text-left mb-6">
                {PAPER3_PDFS.map((pdf) => (
                  <div key={pdf.file} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                    <span className="text-xl">{pdf.icon}</span>
                    <span className="flex-1 font-semibold text-gray-900 text-sm">{pdf.label}</span>
                    <span className="text-green-600 text-sm font-bold">Sent ✓</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <p className="text-sm text-gray-600">
                  <strong>Can't find it?</strong> Check your spam or promotions folder. Print the PDFs and keep them on your desk until Wednesday. Good luck!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Free, ungated 48-hour plan */}
      <section className="max-w-4xl w-full mt-20">
        <div className="text-center mb-10">
          <span className="inline-block bg-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
            Free · No email needed
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Your Final 48-Hour Paper 3 Plan
          </h2>
          <p className="text-lg text-gray-600 mt-3">
            Don't try to learn new topics now. These two days are about <strong>consolidating what you know</strong> and not throwing away marks on Wednesday.
          </p>
        </div>

        <div className="space-y-5">
          {[
            {
              tag: "Monday — Tonight",
              colour: "bg-blue-600",
              title: "Drill the predicted topics, not the whole syllabus",
              points: [
                "Work through 1–2 past-paper questions on each Hit-List topic (sine/cosine rule, iteration, bounds, vectors, histograms).",
                "Mark every answer against the official mark scheme — copy the exact wording it rewards.",
                "Make a one-page list of the 5 topics you got wrong. That list is tomorrow's revision.",
              ],
            },
            {
              tag: "Tuesday — Day before",
              colour: "bg-indigo-600",
              title: "Close gaps + run the calculator setup",
              points: [
                "Redo only the 5 topics from last night's wrong list. Aim to get each one right twice in a row.",
                "Read the Calculator Setup & 10 Traps PDF and physically press the keys on your own calculator.",
                "Pack your bag: calculator (degrees mode!), spare batteries, pen, pencil, ruler, protractor, compass. Stop revising by 9pm.",
              ],
            },
            {
              tag: "Wednesday — Exam morning",
              colour: "bg-emerald-600",
              title: "Light recall, then execute",
              points: [
                "Glance over the Formula Cheat Sheet and the calculator traps — do NOT attempt new questions.",
                "In the exam: run the 60-second calculator setup, check it says D for degrees, read every question twice.",
                "Show all working on 'show that' and method questions. Round only the final answer. Leave nothing blank — a guess can earn method marks.",
              ],
            },
          ].map((day) => (
            <div key={day.tag} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className={`${day.colour} text-white text-xs font-bold px-3 py-1.5 rounded-full`}>{day.tag}</span>
                <h3 className="text-lg font-bold text-gray-900">{day.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {day.points.map((p, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-gray-700">
                    <span className="text-blue-500 font-bold">{i + 1}.</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-600 mb-4">Want the topic list, formulas, and calculator guide as printable PDFs?</p>
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-8 py-3.5 transition-all shadow-lg shadow-blue-600/30">
            Get the free 3-PDF pack →
          </a>
        </div>
      </section>
    </main>
  );
}
