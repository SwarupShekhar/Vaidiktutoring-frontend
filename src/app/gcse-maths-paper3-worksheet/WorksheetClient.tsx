"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.studyhours.com").replace(/\/$/, "");

const topics = [
  {
    id: 1,
    title: "Compound Interest & Depreciation",
    tag: "AQA & Edexcel",
    theory: "Formula: A = P(1 ± r/100)ⁿ. Use + for interest, − for depreciation. Always use your calculator's bracket keys to avoid order-of-operations errors.",
    questions: [
      "£3,500 is invested at 4.5% compound interest per year. How much is it worth after 3 years? Give your answer to the nearest penny.",
      "A car worth £12,000 depreciates by 18% each year. What is it worth after 4 years? Give your answer to 3 significant figures.",
      "[Higher] After how many years will £2,000 at 6% compound interest first exceed £3,000? Show your working.",
    ],
    solutions: [
      "Multiplier = 1.045. A = 3500 × 1.045³ = 3500 × 1.141166… = £3,994.08. Type 3500 × 1.045 ^ 3 in one go — don't round 1.045³ early.",
      "Depreciation multiplier = 1 − 0.18 = 0.82. A = 12000 × 0.82⁴ = 12000 × 0.452121… = £5,425.46 = £5,430 (3 s.f.).",
      "Solve 2000 × 1.06ⁿ > 3000. Test values: n = 6 → £2,837.04 (too low); n = 7 → £3,007.26 (exceeds £3,000). Answer: 7 years.",
    ],
    marksLost: "The big one is applying simple interest (e.g. 4.5% × 3 = 13.5%) when the question is compound. On part (c), a decimal answer like 6.96 should round up to the next whole year — 7.",
    tip: "Common trap: students use simple interest (multiply by the rate each time). Always raise to the power of n.",
  },
  {
    id: 2,
    title: "Reverse Percentages",
    tag: "AQA & Edexcel",
    theory: "If a price AFTER a 20% increase is £240, divide by 1.20 (not multiply by 0.80). Always divide by (1 ± percentage as decimal).",
    questions: [
      "After a 15% increase, a jacket costs £69. Find the original price.",
      "After a 30% reduction, a laptop costs £455. Find the original price.",
      "VAT at 20% is added to an item. The price including VAT is £108. What is the price before VAT?",
    ],
    solutions: [
      "A 15% increase means new price = 1.15 × original. So original = 69 ÷ 1.15 = £60.",
      "A 30% reduction leaves 70%, so new price = 0.70 × original. Original = 455 ÷ 0.70 = £650.",
      "Including 20% VAT means price = 1.20 × original. Original = 108 ÷ 1.20 = £90.",
    ],
    marksLost: "The £69 is already the increased price, so you divide to undo it. A common slip is £69 × 0.85 = £58.65, which finds 85% of the wrong starting figure.",
    tip: "Write out: 'After increase, the price IS (1 + r)×original.' Then rearrange. Don't subtract the % from the answer.",
  },
  {
    id: 3,
    title: "Trigonometry (SOHCAHTOA & Sine Rule)",
    tag: "AQA & Edexcel",
    theory: "sin θ = O/H, cos θ = A/H, tan θ = O/A. Check your calculator is in DEGREE mode before starting. For angles: use sin⁻¹, cos⁻¹, tan⁻¹.",
    questions: [
      "A ladder 5 m long leans against a wall. The base is 2 m from the wall. Find the angle the ladder makes with the ground. Give your answer to 1 decimal place.",
      "In triangle ABC, angle B = 90°. AB = 8 cm, BC = 6 cm. Find angle A to 1 decimal place.",
      "[Higher] Triangle PQR has angle P = 35°, angle Q = 85° and side PQ = 12 cm. Use the sine rule to find the length of QR. Give your answer to 3 significant figures.",
    ],
    solutions: [
      "The 2 m base is adjacent to the ground angle; the 5 m ladder is the hypotenuse. cos θ = A/H = 2/5. θ = cos⁻¹(0.4) = 66.4° (1 d.p.).",
      "Relative to angle A: BC = 6 is opposite, AB = 8 is adjacent. tan A = O/A = 6/8. A = tan⁻¹(0.75) = 36.9° (1 d.p.).",
      "Angle R = 180 − 35 − 85 = 60°. QR is opposite P; PQ is opposite R. QR/sin 35° = 12/sin 60°. QR = 12 × sin 35° ÷ sin 60° = 7.95 cm (3 s.f.).",
    ],
    marksLost: "A calculator left in radians gives a completely wrong angle. Press SHIFT → SETUP → Degree and check a small 'D' shows at the top of the screen. On sine rule questions, watch you pair each side with the angle opposite it.",
    tip: "Always draw and label the triangle. Identify O, A, H relative to the angle you know or want.",
  },
  {
    id: 4,
    title: "Standard Form",
    tag: "AQA & Edexcel",
    theory: "a × 10ⁿ where 1 ≤ a < 10. Use EXP or ×10ˣ button on your calculator. To add/subtract, convert to ordinary numbers first.",
    questions: [
      "Calculate (3.2 × 10⁴) × (4.5 × 10³). Give your answer in standard form.",
      "Calculate (8.4 × 10⁶) ÷ (2.1 × 10²). Give your answer in standard form.",
      "The distance from Earth to the Sun is 1.5 × 10⁸ km. Light travels at 3 × 10⁵ km/s. How long does light take to reach Earth from the Sun? Give your answer in standard form.",
    ],
    solutions: [
      "Multiply the numbers, add the powers: 3.2 × 4.5 = 14.4 and 10⁴ × 10³ = 10⁷ → 14.4 × 10⁷. Fix the front number: = 1.44 × 10⁸.",
      "Divide the numbers, subtract the powers: 8.4 ÷ 2.1 = 4 and 10⁶ ÷ 10² = 10⁴ → 4 × 10⁴.",
      "Time = distance ÷ speed = (1.5 × 10⁸) ÷ (3 × 10⁵) = 0.5 × 10³ = 5 × 10² seconds (500 s).",
    ],
    marksLost: "Answers like 14.4 × 10⁷ or 0.5 × 10³ score nothing for the final mark — the front number has to sit between 1 and 10. Always adjust it at the end.",
    tip: "After using your calculator, always check the answer is in correct standard form (1 ≤ a < 10).",
  },
  {
    id: 5,
    title: "Bounds & Error Intervals",
    tag: "Higher",
    theory: "For a value rounded to the nearest unit: lower bound = value − half a unit, upper bound = value + half a unit. For a calculation: to find max, use max numerator ÷ min denominator.",
    questions: [
      "A length is measured as 7.4 cm to 1 decimal place. Write the error interval for the length.",
      "p = 6.3 (1 d.p.) and q = 4.1 (1 d.p.). Find the upper bound of p × q.",
      "A speed is calculated as distance ÷ time where distance = 120 m (3 s.f.) and time = 8.5 s (2 s.f.). Find the upper bound of the speed.",
    ],
    solutions: [
      "Rounded to 1 d.p., so half a unit is 0.05. Error interval: 7.35 ≤ length < 7.45.",
      "Upper bounds: p = 6.35, q = 4.15. Upper of a product uses both maxima: 6.35 × 4.15 = 26.3525.",
      "Upper speed = max distance ÷ MIN time. Upper distance = 120.5, min time = 8.45. 120.5 ÷ 8.45 = 14.3 m/s (3 s.f.).",
    ],
    marksLost: "For the upper bound of a division, the divisor takes its minimum value, not its maximum. A bigger top and smaller bottom give the largest result, so use the lower bound of the time.",
    tip: "Max of a product → both values at max. Max of a quotient (A÷B) → A at max, B at min.",
  },
  {
    id: 6,
    title: "Speed, Distance, Time",
    tag: "AQA & Edexcel",
    theory: "Speed = Distance ÷ Time. Watch for mixed units: convert km/h to m/s by ÷ 3.6. Always check units in the answer.",
    questions: [
      "A train travels 240 km in 1 hour 45 minutes. What is its average speed in km/h?",
      "A car travels at 60 mph for 2.5 hours, then at 40 mph for 45 minutes. What is the total distance?",
      "A cyclist travels 18 km at 9 km/h, then 18 km at 18 km/h. What is the average speed for the whole journey?",
    ],
    solutions: [
      "1 h 45 min = 1.75 h (45 min = 0.75 h, NOT 0.45). Speed = 240 ÷ 1.75 = 137 km/h (3 s.f.).",
      "Distance = speed × time. 60 × 2.5 = 150 miles; 40 × 0.75 = 30 miles. Total = 180 miles.",
      "Time stage 1 = 18 ÷ 9 = 2 h; stage 2 = 18 ÷ 18 = 1 h. Average speed = total distance ÷ total time = 36 ÷ 3 = 12 km/h. (Averaging the speeds would wrongly give 13.5.)",
    ],
    marksLost: "Writing 45 minutes as 0.45 hours when it should be 0.75. And for average speed, the mean of the two speeds is wrong — work out total distance ÷ total time instead.",
    tip: "For average speed over two stages: total distance ÷ total time. Do NOT average the two speeds.",
  },
  {
    id: 7,
    title: "Volume & Surface Area",
    tag: "AQA & Edexcel",
    theory: "Cylinder: V = πr²h, SA = 2πrh + 2πr². Formulae for cone and sphere are given on the exam sheet (Higher).",
    questions: [
      "A cylinder has radius 4 cm and height 10 cm. Find its volume. Give your answer in terms of π.",
      "A cylindrical tin has diameter 8 cm and height 15 cm. Find the total surface area to 3 significant figures.",
      "[Higher] A sphere has volume 288π cm³. Find its radius.",
    ],
    solutions: [
      "V = πr²h = π × 4² × 10 = 160π cm³.",
      "Diameter 8 → radius 4. SA = 2πrh + 2πr² = 2π(4)(15) + 2π(4²) = 120π + 32π = 152π = 478 cm² (3 s.f.).",
      "V = ⁴⁄₃πr³ = 288π → r³ = 288 × ¾ = 216 → r = ∛216 = 6 cm.",
    ],
    marksLost: "Putting the diameter (8) straight into the formula as the radius — halve it first. On the sphere question, students often forget to cancel π on both sides before solving for r.",
    tip: "Diameter ÷ 2 = radius. Easy mark lost if you forget to halve the diameter.",
  },
  {
    id: 8,
    title: "Direct & Inverse Proportion",
    tag: "AQA & Edexcel",
    theory: "Direct: y = kx (or kx²). Inverse: y = k/x. Step 1: find k by substituting the given pair. Step 2: use k to answer the question.",
    questions: [
      "y is directly proportional to x². When x = 3, y = 36. Find y when x = 5.",
      "y is inversely proportional to x. When x = 4, y = 15. Find x when y = 12.",
      "The time to fill a tank is inversely proportional to the number of pipes. With 3 pipes it takes 8 hours. How long with 6 pipes?",
    ],
    solutions: [
      "Write y = kx². Sub in: 36 = k × 3² → k = 4. So y = 4x². When x = 5: y = 4 × 25 = 100.",
      "Write y = k/x. Sub in: 15 = k/4 → k = 60. So y = 60/x. When y = 12: 12 = 60/x → x = 5.",
      "Write t = k/p. Sub in: 8 = k/3 → k = 24. With 6 pipes: t = 24 ÷ 6 = 4 hours.",
    ],
    marksLost: "Treating inverse proportion as if it were direct, so 'double the pipes' becomes 'double the time'. With more pipes the time goes down. Always find k first.",
    tip: "Always write the equation (y = kx²) before substituting. Don't try to do it mentally.",
  },
  {
    id: 9,
    title: "Scatter Graphs & Correlation",
    tag: "AQA & Edexcel",
    theory: "Positive correlation: both increase together. Negative: one increases as other decreases. Line of best fit: drawn through the mean point, roughly equal scatter each side.",
    questions: [
      "Describe the correlation between hours of revision and test score shown in a scatter graph with points rising from bottom-left to top-right.",
      "A line of best fit passes through (2, 45) and (8, 75). Estimate the score for 5 hours of revision.",
      "Explain why it would not be reliable to use the line of best fit to predict a score for 20 hours of revision.",
    ],
    solutions: [
      "Positive correlation — as the number of revision hours increases, the test score increases.",
      "Gradient = (75 − 45) ÷ (8 − 2) = 30 ÷ 6 = 5. Equation: y = 5x + 35. At x = 5: y = 5 × 5 + 35 = 60.",
      "20 hours is outside the plotted data range, so this is extrapolation — the pattern may not continue (and scores are capped at 100%), making the prediction unreliable.",
    ],
    marksLost: "On part (c), 'it's too far away' won't get the mark on its own. Examiners want the word extrapolation and the phrase 'outside the data range'.",
    tip: "For interpolation vs extrapolation: predicting within the data range = interpolation (reliable). Outside = extrapolation (unreliable — say this in your answer).",
  },
  {
    id: 10,
    title: "Probability — Combined Events",
    tag: "AQA & Edexcel",
    theory: "P(A and B) = P(A) × P(B) for independent events. Use a tree diagram when events happen in sequence. P(A or B) = P(A) + P(B) − P(A and B).",
    questions: [
      "A bag has 3 red and 5 blue balls. One is drawn and replaced, then another is drawn. Find P(both red).",
      "A bag has 4 red and 6 blue balls. One is drawn WITHOUT replacement, then another. Find P(one of each colour).",
      "[Higher] Given P(A) = 0.4 and P(B|A) = 0.3, find P(A and B).",
    ],
    solutions: [
      "With replacement, P(red) stays 3/8 each time. P(both red) = 3/8 × 3/8 = 9/64.",
      "Without replacement there are TWO routes. P(red then blue) = 4/10 × 6/9 = 24/90; P(blue then red) = 6/10 × 4/9 = 24/90. Total = 48/90 = 8/15.",
      "P(A and B) = P(A) × P(B|A) = 0.4 × 0.3 = 0.12.",
    ],
    marksLost: "'One of each' has two routes (red-blue and blue-red), and counting only one halves the answer. Also remember the denominator drops from 10 to 9 on the second pick when there's no replacement.",
    tip: "Without replacement: second branch probabilities CHANGE. Without replacement means total reduces by 1.",
  },
];

export default function WorksheetClient() {
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
        body: JSON.stringify({ email: email.trim(), source: "gcse-paper3-worksheet" }),
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
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            GCSE Maths Paper 3 — Wednesday 10 June 2025
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Free Paper 3 Revision Worksheet
          </h1>
          <p className="text-lg text-blue-100 mb-2">
            AQA & Edexcel Calculator Paper · 30 practice questions with full worked solutions
          </p>
          <p className="text-blue-200 text-sm">
            Foundation + Higher · Printable · Plus the exact mistakes that lose marks on each topic
          </p>
        </div>
      </section>

      {/* Email gate */}
      {!submitted ? (
        <section className="py-12 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
                Get instant access
              </h2>
              <p className="text-gray-500 text-sm text-center mb-6">
                Enter your email to unlock 30 practice questions across the top 10 Paper 3 topics.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 text-sm transition-colors disabled:opacity-60"
                >
                  {loading ? "Loading..." : "Unlock free worksheet →"}
                </button>
              </form>
              <p className="text-xs text-gray-400 text-center mt-4">
                No spam. We may send occasional GCSE revision tips.
              </p>
            </div>

            {/* Preview of topics */}
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 text-center">
                What's inside
              </p>
              <div className="grid grid-cols-2 gap-2">
                {topics.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-blue-500 font-bold text-xs w-5">{t.id}.</span>
                    <span className="line-clamp-1">{t.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Worksheet content */
        <section className="py-10 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Print button */}
            <div className="flex items-center justify-between mb-8 print:hidden">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Worksheet</h2>
                <p className="text-gray-500 text-sm mt-1">30 questions · worked solutions · mark-loss notes · AQA & Edexcel Paper 3</p>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Print worksheet
              </button>
            </div>

            <div className="space-y-8">
              {topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center print:hidden">
              <h3 className="text-xl font-bold mb-2">Want more support before Wednesday?</h3>
              <p className="text-blue-100 text-sm mb-6">
                Book a 1-hour exam prep session with a GCSE maths specialist. We match you to your exact exam board.
              </p>
              <Link
                href="/gcse-online-tutoring"
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold rounded-xl px-6 py-3 text-sm hover:bg-blue-50 transition-colors"
              >
                Book a free trial session →
              </Link>
            </div>
          </div>
        </section>
      )}

      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          body { font-size: 12px; }
        }
      `}</style>
    </main>
  );
}

type Topic = (typeof topics)[number];

function TopicCard({ topic }: { topic: Topic }) {
  const [showSolutions, setShowSolutions] = useState(false);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      {/* Topic header */}
      <div className="bg-blue-50 border-b border-blue-100 px-6 py-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold flex items-center justify-center">
              {topic.id}
            </span>
            <h3 className="font-bold text-gray-900">{topic.title}</h3>
          </div>
          <span className="text-xs font-medium text-blue-600 bg-blue-100 rounded-full px-2 py-0.5">
            {topic.tag}
          </span>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Theory box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-amber-700 mb-1">Key method</p>
          <p className="text-sm text-amber-900">{topic.theory}</p>
        </div>

        {/* Questions */}
        <div className="space-y-3">
          {topic.questions.map((q, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-gray-400 text-sm font-medium min-w-[20px]">{String.fromCharCode(97 + i)})</span>
              <p className="text-sm text-gray-800">{q}</p>
            </div>
          ))}
        </div>

        {/* Where students lose marks */}
        <div className="flex gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <span className="text-red-600 text-xs font-bold mt-0.5 shrink-0">EXAM TRAP</span>
          <p className="text-xs text-red-800">{topic.marksLost}</p>
        </div>

        {/* Tip */}
        <div className="flex gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <span className="text-green-600 text-xs font-bold mt-0.5 shrink-0">TIP</span>
          <p className="text-xs text-green-800">{topic.tip}</p>
        </div>

        {/* Worked solutions — hidden until revealed, always shown in print */}
        <div className="print:hidden">
          <button
            onClick={() => setShowSolutions((s) => !s)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showSolutions ? "− Hide worked solutions" : "+ Reveal worked solutions"}
          </button>
        </div>

        <div className={showSolutions ? "block" : "hidden print:block"}>
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Worked solutions</p>
            {topic.solutions.map((s, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-blue-500 text-sm font-bold min-w-[20px]">{String.fromCharCode(97 + i)})</span>
                <p className="text-sm text-gray-800">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
