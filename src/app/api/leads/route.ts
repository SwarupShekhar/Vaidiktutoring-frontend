import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const WEBHOOK_URL = process.env.DISCORD_LEADS_WEBHOOK_URL;
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || 'StudyHours <hello@studyhours.com>';
const BOOKING_URL = 'https://studyhours.com/bookings/new';
const DISCORD_URL = 'https://discord.gg/7PYHxCPK';

// Rate limit: 3 submissions per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

// ── Email templates ──────────────────────────────────────────────────────────

function emailWrapper(body: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
        <tr><td style="padding:0 0 24px">
          <span style="color:#fff;font-size:20px;font-weight:700">StudyHours</span>
        </td></tr>
        <tr><td style="background:#0f0f0f;border:1px solid #1f1f1f;border-radius:16px;padding:36px">
          ${body}
        </td></tr>
        <tr><td style="padding:24px 0 0;color:#444;font-size:12px;text-align:center">
          StudyHours · <a href="https://studyhours.com" style="color:#444">studyhours.com</a>
          · <a href="https://studyhours.com/legal/privacy" style="color:#444">Unsubscribe</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function satQuizEmail(data: Record<string, string>) {
  const ceiling = data.ceiling || 'your score ceiling';
  const priority = data.priority || '';
  const bottleneck = data.bottleneck || '';

  return emailWrapper(`
    <h1 style="color:#fff;font-size:28px;font-weight:800;margin:0 0 4px">Here's what's limiting your SAT score</h1>
    <p style="color:#e11d48;font-size:14px;margin:0 0 28px">Based on your answers</p>

    <div style="background:#1a0a0a;border:1px solid #3f1111;border-radius:12px;padding:20px;margin:0 0 20px">
      <p style="color:#f87171;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">What's holding you back</p>
      <p style="color:#e5e5e5;font-size:15px;margin:0">${bottleneck}</p>
    </div>

    <div style="background:#111;border:1px solid #222;border-radius:12px;padding:20px;margin:0 0 28px">
      <p style="color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">The one thing to fix first</p>
      <p style="color:#e5e5e5;font-size:15px;line-height:1.6;margin:0">${priority}</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:0 8px 0 0">
          <a href="${BOOKING_URL}?utm_source=email&utm_medium=sat_quiz&utm_campaign=lead" style="display:block;background:#e11d48;color:#fff;text-align:center;padding:14px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none">
            Book a free 15-min call
          </a>
        </td>
        <td style="padding:0 0 0 8px">
          <a href="${DISCORD_URL}" style="display:block;background:#1f1f1f;border:1px solid #333;color:#fff;text-align:center;padding:14px;border-radius:50px;font-weight:600;font-size:14px;text-decoration:none">
            Join free Discord
          </a>
        </td>
      </tr>
    </table>
  `);
}

function desmosEmail(data: Record<string, string>) {
  const topics = (data.topics || '').split(', ').filter(Boolean);
  const topicItems = topics.map(t =>
    `<li style="color:#e5e5e5;font-size:15px;padding:6px 0;border-bottom:1px solid #1f1f1f">${t}</li>`
  ).join('');

  return emailWrapper(`
    <h1 style="color:#fff;font-size:26px;font-weight:800;margin:0 0 8px">Your Desmos cheat sheet is ready</h1>
    <p style="color:#818cf8;font-size:14px;margin:0 0 28px">Custom shortcuts for your 3 weak topics</p>

    <div style="background:#111;border:1px solid #222;border-radius:12px;padding:20px;margin:0 0 20px">
      <p style="color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px">Your selected topics</p>
      <ul style="margin:0;padding:0 0 0 0;list-style:none">${topicItems}</ul>
    </div>

    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px">
      The full interactive guide with step-by-step worked examples is saved at:
      <a href="https://studyhours.com/sat-desmos-guide" style="color:#818cf8">studyhours.com/sat-desmos-guide</a> — bookmark it and open it on your phone during practice.
    </p>

    <a href="${BOOKING_URL}?utm_source=email&utm_medium=desmos&utm_campaign=lead" style="display:block;background:#6366f1;color:#fff;text-align:center;padding:14px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;margin:0 0 12px">
      Book a free SAT session
    </a>
    <a href="${DISCORD_URL}" style="display:block;background:#1f1f1f;border:1px solid #333;color:#fff;text-align:center;padding:14px;border-radius:50px;font-weight:600;font-size:14px;text-decoration:none">
      Join free Discord — daily SAT questions
    </a>
  `);
}

function gcseTrackerEmail(data: Record<string, string>) {
  const board = (data.examBoard || 'edexcel').toLowerCase();
  const tier = (data.tier || 'higher').toLowerCase();
  const boardLabel = board.toUpperCase();
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
  const redTopics = (data.redTopics || '').split(', ').filter(t => t && t !== 'None');

  // Top predicted Paper 3 topics by board + tier
  const predictedTopics: Record<string, Record<string, string[]>> = {
    edexcel: {
      higher: [
        'Sine & Cosine Rules — area of triangle using ½ab sin C',
        'Iteration — finding roots of equations numerically',
        'Conditional Probability Trees — dependent events',
        'Algebraic Fractions — simplifying and solving',
        'Vector Geometric Proofs',
      ],
      foundation: [
        'Compound Interest & Reverse Percentages',
        'Probability Trees — independent events',
        'Trigonometry (SOH CAH TOA) — finding angles and sides',
        'Venn Diagrams & Set Notation',
        'Compound Measures — Speed, Density, Pressure',
      ],
    },
    aqa: {
      higher: [
        'Sine & Cosine Rules — ½ab sin C for triangle area',
        'Circle Theorems & Geometric Proofs',
        'Simultaneous Equations — one linear, one quadratic',
        'Iteration Formulas',
        'Histograms — frequency density',
      ],
      foundation: [
        'Reverse Percentages',
        'Compound Interest',
        'Pythagoras\' Theorem',
        'Venn Diagrams & Simple Probability',
        'Scatter Graphs & Line of Best Fit',
      ],
    },
    ocr: {
      higher: [
        'Bounds & Error Intervals',
        'Advanced Trigonometry — Sine/Cosine Rules',
        'Algebraic Fractions',
        'Conditional Probability Trees',
        'Vector Geometric Proof',
      ],
      foundation: [
        'Ratio and Percentage Problems',
        'Pythagoras\' Theorem',
        'Circle Area & Circumference',
        'Speed, Distance, Time',
        'Standard Form Calculations',
      ],
    },
  };

  // Mark scheme keywords by board
  const markSchemeNotes: Record<string, string> = {
    edexcel: 'Edexcel mark schemes are strict about method marks (M marks). Show every step even if you get the final answer wrong — you can still earn 1–2 marks for correct working.',
    aqa: 'AQA awards marks for correct method even with arithmetic errors. Circle your final answer clearly — examiners look for it. "Hence" questions require you to use the previous result.',
    ocr: 'OCR often awards follow-through marks (FT) — even if you carried a wrong answer from part (a) into part (b), you can score full marks in (b) if the method is correct.',
  };

  // Casio ClassWiz tip — most common model
  const casioTip = tier === 'higher'
    ? '<strong>Casio fx-991EX tip:</strong> For quadratic equations, press MENU → 8 (Equation) → 2 (Polynomial) → 2 (Degree 2) → enter a, b, c → press =. Roots appear instantly. No quadratic formula needed.'
    : '<strong>Casio tip:</strong> For any multiplication or division in compound measures (Speed = Distance ÷ Time), type it directly into the calculator as a fraction: press ÷, type the denominator, then = . Avoids rounding errors from doing it in steps.';

  const predicted = predictedTopics[board]?.[tier] ?? predictedTopics.edexcel.higher;
  const predictedItems = predicted.map(t =>
    `<li style="color:#e5e5e5;font-size:14px;padding:8px 0;border-bottom:1px solid #1f1f1f;line-height:1.5">${t}</li>`
  ).join('');

  const redSection = redTopics.length ? `
    <div style="background:#1a0a0a;border:1px solid #7f1d1d;border-radius:12px;padding:20px;margin:0 0 20px">
      <p style="color:#f87171;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px">Your weak topics from the tracker</p>
      <p style="color:#6b7280;font-size:12px;margin:0 0 12px">These are the ones you marked as needing help.</p>
      <ul style="margin:0;padding:0 0 0 16px">
        ${redTopics.map(t => `<li style="color:#fca5a5;font-size:14px;padding:5px 0;line-height:1.5">${t}</li>`).join('')}
      </ul>
      <p style="color:#9ca3af;font-size:13px;margin:14px 0 0;line-height:1.6">
        For each one: find one past paper question on that topic, work through it, then check the mark scheme. Write down the exact wording the mark scheme uses — that's the language the examiner wants to see.
      </p>
    </div>
  ` : '';

  return emailWrapper(`
    <p style="color:#5c9dff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px">${boardLabel} · ${tierLabel} · Paper 3 — Wednesday 10 June</p>
    <h1 style="color:#fff;font-size:26px;font-weight:800;margin:0 0 6px;line-height:1.2">Your Paper 3 revision pack</h1>
    <p style="color:#6b7280;font-size:14px;margin:0 0 28px">Based on what statistically appears in Paper 3 after Papers 1 and 2.</p>

    ${redSection}

    <div style="background:#0a0f1a;border:1px solid #1e3a5f;border-radius:12px;padding:20px;margin:0 0 20px">
      <p style="color:#5c9dff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px">Top ${predicted.length} topics likely to appear in Paper 3</p>
      <p style="color:#6b7280;font-size:12px;margin:0 0 12px">${boardLabel} ${tierLabel} — based on what hasn't appeared in Papers 1 & 2 historically.</p>
      <ul style="margin:0;padding:0 0 0 16px">${predictedItems}</ul>
    </div>

    <div style="background:#0f0f0a;border:1px solid #3a3010;border-radius:12px;padding:20px;margin:0 0 20px">
      <p style="color:#fbbf24;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">Calculator tip</p>
      <p style="color:#e5e5e5;font-size:14px;line-height:1.6;margin:0">${casioTip}</p>
    </div>

    <div style="background:#111;border:1px solid #222;border-radius:12px;padding:20px;margin:0 0 24px">
      <p style="color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">${boardLabel} mark scheme — what examiners actually want</p>
      <p style="color:#e5e5e5;font-size:14px;line-height:1.6;margin:0">${markSchemeNotes[board] ?? markSchemeNotes.edexcel}</p>
    </div>

    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px">
      If you're stuck on any of these topics tonight, reply to this email directly — we'll send you a worked example within the hour.
    </p>

    <a href="${BOOKING_URL}?utm_source=email&utm_medium=gcse_tracker&utm_campaign=lead" style="display:block;background:#4c70f5;color:#fff;text-align:center;padding:14px;border-radius:50px;font-weight:700;font-size:15px;text-decoration:none;margin:0 0 10px">
      Book a free last-minute GCSE session
    </a>
    <a href="${DISCORD_URL}" style="display:block;background:#1f1f1f;border:1px solid #333;color:#fff;text-align:center;padding:14px;border-radius:50px;font-weight:600;font-size:14px;text-decoration:none">
      Join free Discord — GCSE students asking questions right now
    </a>

    <p style="color:#444;font-size:13px;margin:24px 0 0;line-height:1.6">
      Good luck on Wednesday. — The StudyHours team
    </p>
  `);
}

// ── Discord embeds ────────────────────────────────────────────────────────────

function buildDiscordEmbed(source: string, email: string, fields: Record<string, string>) {
  const configs: Record<string, { title: string; color: number }> = {
    sat_quiz:     { title: '📊 New SAT Score Quiz Lead',    color: 0xe11d48 },
    desmos_guide: { title: '📐 New Desmos Guide Lead',       color: 0x6366f1 },
    gcse_tracker: { title: '🇬🇧 New GCSE Paper 3 Lead',      color: 0x4c70f5 },
  };
  const { title, color } = configs[source] ?? { title: 'New Lead', color: 0xffffff };

  return {
    title,
    color,
    fields: [
      { name: 'Email', value: email, inline: false },
      ...Object.entries(fields).map(([name, value]) => ({ name, value: value || '—', inline: true })),
    ],
    footer: { text: `studyhours.com/${source.replace('_', '-')}` },
  };
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { source, email, ...fields } = body;

  if (!email?.includes('@') || !source) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const sanitizedEmail = email.trim().toLowerCase().slice(0, 254);

  // ── Send to Discord ──
  if (WEBHOOK_URL) {
    const embedFields = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, String(v ?? '')]));
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [buildDiscordEmbed(source, sanitizedEmail, embedFields)] }),
      });
    } catch { /* non-fatal */ }
  }

  // ── Send confirmation email ──
  const emailTemplates: Record<string, (d: Record<string, string>) => string> = {
    sat_quiz:     satQuizEmail,
    desmos_guide: desmosEmail,
    gcse_tracker: gcseTrackerEmail,
  };

  const subjectLines: Record<string, (d: Record<string, string>) => string> = {
    sat_quiz:     (d) => `Here's what's limiting your SAT score — ${d.score ?? 'your breakdown'}`,
    desmos_guide: (d) => `Your Desmos cheat sheet — ${(d.topics ?? '').split(', ').slice(0, 2).join(', ')}`,
    gcse_tracker: (d) => `Your GCSE Paper 3 focus list — ${(d.examBoard ?? '').toUpperCase()} ${d.tier ?? ''}`,
  };

  const template = emailTemplates[source];
  const subjectFn = subjectLines[source];

  if (template && subjectFn && resend) {
    const stringFields = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, String(v ?? '')]));
    try {
      await resend.emails.send({
        from: FROM,
        to: sanitizedEmail,
        subject: subjectFn(stringFields),
        html: template(stringFields),
      });
    } catch { /* non-fatal — lead already captured in Discord */ }
  } else if (!resend) {
    console.warn('RESEND_API_KEY is missing. Email not sent.');
  }

  return NextResponse.json({ ok: true });
}
