import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const WEBHOOK_URL = process.env.DISCORD_LEADS_WEBHOOK_URL!;
const resend = new Resend(process.env.RESEND_API_KEY);
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
    <h1 style="color:#fff;font-size:28px;font-weight:800;margin:0 0 4px">Your SAT ceiling: ${ceiling}</h1>
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
  const board = (data.examBoard || '').toUpperCase();
  const tier = (data.tier || '').charAt(0).toUpperCase() + (data.tier || '').slice(1);
  const redTopics = (data.redTopics || 'None').split(', ').filter(t => t !== 'None');
  const redItems = redTopics.length
    ? redTopics.map(t => `<li style="color:#fca5a5;font-size:14px;padding:4px 0">${t}</li>`).join('')
    : '<li style="color:#6b7280;font-size:14px;padding:4px 0">None marked yet</li>';

  return emailWrapper(`
    <h1 style="color:#fff;font-size:26px;font-weight:800;margin:0 0 8px">Your GCSE Paper 3 revision focus</h1>
    <p style="color:#5c9dff;font-size:14px;margin:0 0 28px">${board} · ${tier} · Paper 3 is Wednesday 10 June</p>

    ${redTopics.length ? `
    <div style="background:#1a0a0a;border:1px solid #7f1d1d;border-radius:12px;padding:20px;margin:0 0 20px">
      <p style="color:#f87171;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px">Topics to focus on today</p>
      <ul style="margin:0;padding:0 0 0 16px">${redItems}</ul>
    </div>
    ` : ''}

    <div style="background:#111;border:1px solid #222;border-radius:12px;padding:20px;margin:0 0 24px">
      <p style="color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">Last-minute advice</p>
      <p style="color:#e5e5e5;font-size:14px;line-height:1.6;margin:0">
        For each topic you marked red: do one past paper question on it, mark it with the mark scheme, and write down the exact phrase the mark scheme uses. That's all you need — pattern recognition, not full revision.
      </p>
    </div>

    <a href="${BOOKING_URL}?utm_source=email&utm_medium=gcse_tracker&utm_campaign=lead" style="display:block;background:#4c70f5;color:#fff;text-align:center;padding:14px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;margin:0 0 12px">
      Book a free GCSE session
    </a>
    <a href="${DISCORD_URL}" style="display:block;background:#1f1f1f;border:1px solid #333;color:#fff;text-align:center;padding:14px;border-radius:50px;font-weight:600;font-size:14px;text-decoration:none">
      Join free Discord
    </a>
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
    sat_quiz:     (d) => `Your SAT score ceiling: ${d.ceiling ?? 'see inside'}`,
    desmos_guide: (d) => `Your Desmos cheat sheet — ${(d.topics ?? '').split(', ').slice(0, 2).join(', ')}`,
    gcse_tracker: (d) => `Your GCSE Paper 3 focus list — ${(d.examBoard ?? '').toUpperCase()} ${d.tier ?? ''}`,
  };

  const template = emailTemplates[source];
  const subjectFn = subjectLines[source];

  if (template && subjectFn) {
    const stringFields = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, String(v ?? '')]));
    try {
      await resend.emails.send({
        from: FROM,
        to: sanitizedEmail,
        subject: subjectFn(stringFields),
        html: template(stringFields),
      });
    } catch { /* non-fatal — lead already captured in Discord */ }
  }

  return NextResponse.json({ ok: true });
}
