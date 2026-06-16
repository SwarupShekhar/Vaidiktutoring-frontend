"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.studyhours.com").replace(/\/$/, "");

interface RescueSheetClientProps {
  board: "aqa" | "edexcel";
}

const CONTENT = {
  aqa: {
    headline: "AQA A-Level Maths Paper 3 - Rescue Sheet",
    subheadline: "Pure Maths & Statistics | 7357/3 | June 2025",
    urgency: "Your exam is on June 18th. This is everything examiners actually mark you on - built from their own reports.",
    cards: [
      {
        icon: "📋",
        title: "Formula Triage",
        points: [
          "Which formulas are IN the booklet (stop wasting time on these)",
          "Which ones you MUST memorise - mapped topic by topic",
          "The ones 40% of students forget and lose marks on"
        ]
      },
      {
        icon: "🎯",
        title: "Hypothesis Testing Blueprint",
        points: [
          "The exact 6-step layout that scores full marks",
          "Full worked example with examiner annotations",
          "The specific words that score vs. the ones that don't"
        ]
      },
      {
        icon: "⚖️",
        title: "Statistics Decision Framework",
        points: [
          "Binomial vs Normal vs Normal Approximation - how to pick in 10 seconds",
          "When continuity correction is required (and when it isn't)",
          "The AQA Large Data Set quirks you need to know (it's NOT the weather data)"
        ]
      },
      {
        icon: "🪤",
        title: "Pure Maths Trap Questions",
        points: [
          "The 6 topics examiners recycle and how they set traps",
          "\"Show that\" technique - why students keep losing marks here",
          "Newton-Raphson failure - the 1-sentence answer they want"
        ]
      },
      {
        icon: "🔍",
        title: "Mark Scheme Decoder",
        points: [
          "How M1 and A1 marks actually work",
          "Where students get M1 but lose A1 - and how to fix it",
          "The exact conclusion phrasing AQA rewards (from their own reports)"
        ]
      },
      {
        icon: "⏱️",
        title: "Last 30 Minutes Strategy",
        points: [
          "How to grab 8-10 method marks in the final half hour",
          "The 15-second actions worth 1-2 marks each",
          "When to abandon algebra and move on"
        ]
      }
    ],
    tag: "a-level-aqa-paper3",
    otherBoard: "edexcel",
    otherBoardLink: "/a-level/edexcel-maths-paper-3-rescue-sheet",
    otherBoardText: "Sitting Edexcel? → Get the Edexcel Rescue Sheet",
    otherBoardLinkText: "Sitting Edexcel instead? Get the Edexcel Rescue Sheet →",
  },
  edexcel: {
    headline: "Edexcel A-Level Maths Paper 3 - Rescue Sheet",
    subheadline: "Statistics & Mechanics | 9MA0/03 | June 2025",
    urgency: "Your exam is on June 18th. This is everything examiners actually mark you on - built from their own reports.",
    cards: [
      {
        icon: "📊",
        title: "Formula Triage - Statistics",
        points: [
          "What's in the booklet vs what's not - side by side",
          "Data coding rules most students get wrong",
          "Normal approximation to Binomial setup"
        ]
      },
      {
        icon: "⚙️",
        title: "Formula Triage - Mechanics",
        points: [
          "F = ma is NOT in the booklet (yes, really)",
          "Every mechanics formula you must memorise",
          "The resolving forces setup for inclined planes"
        ]
      },
      {
        icon: "🎯",
        title: "Hypothesis Testing Blueprint",
        points: [
          "The exact 5-step structure Edexcel's mark scheme rewards",
          "Full worked example (Binomial) with mark annotations",
          "Conclusion language that scores vs. language that doesn't"
        ]
      },
      {
        icon: "📈",
        title: "Large Data Set Cheat Sheet",
        points: [
          "The Perth trap (Southern Hemisphere = winter during exam data window)",
          "What \"tr\" means and how to handle it in calculations",
          "Oktas, missing data, wind direction - every quirk in one list"
        ]
      },
      {
        icon: "🏗️",
        title: "Mechanics Frameworks",
        points: [
          "Connected particles: the simultaneous equation method examiners expect",
          "Moments twist variations: \"uniform\", \"non-uniform\", \"on the point of tilting\"",
          "Variable acceleration: the distance vs displacement trap",
          "SUVAT decision tree: which equation based on which variable you don't need"
        ]
      },
      {
        icon: "🚩",
        title: "Examiner Red Flags & Last 30 Minutes",
        points: [
          "What gets M1 vs M0 in Mechanics (omitting mass = instant M0)",
          "The g = 9.8 rule and significant figures",
          "How to grab 8-10 marks in the final half hour"
        ]
      }
    ],
    tag: "a-level-edexcel-paper3",
    otherBoard: "aqa",
    otherBoardLink: "/a-level/aqa-maths-paper-3-rescue-sheet",
    otherBoardText: "Sitting AQA? → Get the AQA Rescue Sheet",
    otherBoardLinkText: "Sitting AQA instead? Get the AQA Rescue Sheet →",
  }
};

export default function RescueSheetClient({ board }: RescueSheetClientProps) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const data = CONTENT[board];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !firstName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: firstName.trim(), email: email.trim(), source: data.tag }),
      });
      if (!res.ok) throw new Error("Failed email delivery");

      await fetch(`${API_URL}/leads/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: firstName.trim(), email: email.trim(), source: data.tag }),
      }).catch(err => console.error("DB save error", err));

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 flex flex-col font-sans transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="bg-[#0F3460] dark:bg-gray-950 text-white py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-[#16A085] text-white text-sm font-bold tracking-wider px-3 py-1 rounded-full mb-6 uppercase">
            {data.subheadline}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            {data.headline}
          </h1>
          <p className="text-xl md:text-2xl font-medium text-gray-200 max-w-3xl mx-auto">
            {data.urgency}
          </p>
          
          <div className="mt-8">
            <Link href={data.otherBoardLink} className="text-sm text-gray-300 hover:text-white underline underline-offset-4 transition-colors">
              {data.otherBoardText}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. WHAT'S INSIDE SECTION */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0F3460] dark:text-white">What's inside the Rescue Sheet</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.cards.map((card, idx) => {
            const isGated = idx >= 3;
            return (
              <div 
                key={idx} 
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden transition-colors ${
                  isGated ? 'opacity-90 dark:opacity-80' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{card.icon}</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{card.title}</h3>
                </div>
                <ul className="space-y-3">
                  {card.points.map((point, pIdx) => (
                    <li key={pIdx} className={`flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300`}>
                      <span className="text-[#16A085] dark:text-teal-400 mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {isGated && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/70 backdrop-blur-[2px] flex items-center justify-center p-4">
                    <div className="bg-[#0F3460] dark:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg border border-transparent dark:border-gray-600">
                      <span>🔒</span> Unlock below
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SOCIAL PROOF / CREDIBILITY STRIP */}
      <section className="bg-gray-100 dark:bg-gray-800/50 py-6 px-4 transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-medium">
            Built from {board === 'aqa' ? 'AQA' : 'Edexcel'} examiner reports (2019-2025), official mark schemes, and the published specification. Every claim is sourced.
          </p>
        </div>
      </section>

      {/* 4. EMAIL CAPTURE FORM / 5. SUCCESS STATE */}
      <section className="py-16 px-4 md:px-8 max-w-xl mx-auto w-full">
        {!submitted ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl transition-colors">
            <h2 className="text-2xl font-bold text-[#0F3460] dark:text-white mb-2 text-center">
              Send it to my inbox
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6">
              We'll send the PDF to your inbox within 2 minutes.
            </p>

            {/* FOMO PRE-SUBMIT ALERT */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4 mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚠️</span>
                <h3 className="text-red-800 dark:text-red-400 font-bold text-sm">Don't walk into the exam hall blind.</h3>
              </div>
              <p className="text-red-900 dark:text-red-300 text-sm leading-relaxed">
                Thousands of students are using this exact sheet to secure their M1/A1 marks. Don't be the only one in your school missing these examiner red flags on Wednesday.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="firstName" className="sr-only">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  required
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg px-4 py-3 text-base focus:outline-none focus:border-[#16A085] dark:focus:border-teal-400 focus:ring-1 focus:ring-[#16A085] dark:focus:ring-teal-400 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg px-4 py-3 text-base focus:outline-none focus:border-[#16A085] dark:focus:border-teal-400 focus:ring-1 focus:ring-[#16A085] dark:focus:ring-teal-400 transition-colors"
                />
              </div>
              <input type="hidden" name="board" value={board} />
              
              {error && <p className="text-red-500 text-sm">{error}</p>}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#16A085] hover:bg-[#12826c] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold rounded-lg py-4 text-lg transition-colors disabled:opacity-70 mt-2"
              >
                {loading ? "Sending..." : "Send Me the Rescue Sheet"}
              </button>
            </form>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
              Free. No spam. Unsubscribe anytime.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl text-center transition-colors">
            <div className="w-16 h-16 bg-[#e6f7f4] dark:bg-[#16A085]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">✉️</span>
            </div>
            <h2 className="text-2xl font-bold text-[#0F3460] dark:text-white mb-3">
              Check your inbox! You now have the advantage.
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-base">
              We've sent the Rescue Sheet to <strong>{email}</strong>. You are now in the top tier of students who know exactly what the examiners are looking for.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-left">
              <h3 className="text-[#0F3460] dark:text-blue-300 font-bold text-base mb-2">⚠️ Warn your friends</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Your friends don't know these traps, and they are going to lose marks on the {board === 'aqa' ? 'Hypothesis Testing' : 'Perth data'} question. Warn them before it's too late.
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold mb-2">
                Send them this link to level the playing field:
              </p>
              <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 overflow-x-auto">
                <code className="text-sm text-[#16A085] dark:text-teal-400 whitespace-nowrap font-medium">
                  https://studyhours.com/a-level/{board}-maths-paper-3-rescue-sheet
                </code>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 6. FOOTER SECTION */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-10 mt-auto transition-colors">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-6">
            <Link href={data.otherBoardLink} className="text-[#0F3460] dark:text-blue-400 font-semibold hover:underline">
              {data.otherBoardLinkText}
            </Link>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-600">
            &copy; {new Date().getFullYear()} StudyHours. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
