'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import ChatLoader from './ChatLoader';
import ReactMarkdown from 'react-markdown';
import { usePathname } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://api.studyhours.com')).replace(/\/$/, '');

// True when Cloudflare Turnstile is actually configured. When it isn't (local dev),
// we bypass with a placeholder token instead of blocking the widget.
const TURNSTILE_ENABLED = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface ChatUiMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const newId = () =>
    (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

// ---------------------------------------------------------------------------
// Guided lead funnel (deterministic, button-driven). One unified flow for ANY
// visitor — no parent/student split. Collects a few quick chip answers, then
// contact details, and POSTs to the lead endpoint. Reuses the parent widget's
// Turnstile token (passed in) rather than mounting a second Turnstile widget.
// ---------------------------------------------------------------------------

type FunnelStep = 'goal' | 'level' | 'region' | 'contact' | 'submitting' | 'done';

interface LeadAnswers {
    goal?: string;
    level?: string;
    region?: string;
}

const GOAL_OPTIONS = [
    'Exam prep',
    'Struggling with a subject',
    'General mastery',
    'SAT/ACT & admissions',
    'Free resource / past papers',
];

const LEVEL_OPTIONS = [
    'Primary',
    'Secondary / GCSE',
    'A-Level / IB',
    'SAT/ACT/AP',
    'Other',
];

const REGION_OPTIONS = [
    'UK',
    'Singapore',
    'Australia',
    'Middle East',
    'South Africa',
    'Other / International',
];

// Simple, permissive client-side email shape check (server does the real work).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FUNNEL_STEPS: FunnelStep[] = ['goal', 'level', 'region', 'contact'];

function LeadFunnel({
    turnstileToken,
    refreshTurnstile,
    onExit,
    initialAnswers,
    initialStep,
}: {
    turnstileToken: string;
    refreshTurnstile: () => void;
    onExit: () => void;
    initialAnswers?: LeadAnswers;
    initialStep?: FunnelStep;
}) {
    const [step, setStep] = useState<FunnelStep>(initialStep ?? 'goal');
    const [answers, setAnswers] = useState<LeadAnswers>(initialAnswers ?? {});
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [note, setNote] = useState('');
    const [preferredContact, setPreferredContact] = useState<'email' | 'phone'>('email');
    const [error, setError] = useState<string | null>(null);
    const submitting = step === 'submitting';

    const emailValid = EMAIL_RE.test(email.trim());
    const canSubmit = emailValid && !!turnstileToken && !submitting;

    const goBack = () => {
        setError(null);
        if (step === 'level') setStep('goal');
        else if (step === 'region') setStep('level');
        else if (step === 'contact') setStep('region');
        else onExit();
    };

    const submit = async () => {
        if (!canSubmit) return;
        setError(null);
        setStep('submitting');

        // Turnstile tokens are single-use: send the current one, then immediately
        // ask the parent widget to mint a fresh token (same pattern as chat send).
        const tokenForRequest = turnstileToken;
        refreshTurnstile();

        try {
            const res = await fetch(`${API_URL}/api/chatbot/lead`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contact: {
                        name: name.trim() || undefined,
                        email: email.trim(),
                        phone: phone.trim() || undefined,
                        preferredContact,
                    },
                    answers: {
                        goal: answers.goal,
                        level: answers.level,
                        region: answers.region,
                    },
                    note: note.trim() || undefined,
                    currentRoute: typeof window !== 'undefined' ? window.location.pathname : undefined,
                    turnstileToken: tokenForRequest,
                }),
            });

            if (res.ok) {
                setStep('done');
                return;
            }

            let msg = 'Something went wrong. Please try again.';
            if (res.status === 429) msg = 'A few too many requests right now — please try again in a moment.';
            else if (res.status === 403) msg = 'Verification failed. Please refresh the page and try again.';
            else {
                try { msg = (await res.json())?.message || msg; } catch { /* keep default */ }
            }
            throw new Error(msg);
        } catch (err) {
            console.error('Lead submit error:', err);
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
            setStep('contact');
        }
    };

    const stepIndex = FUNNEL_STEPS.indexOf(step === 'submitting' ? 'contact' : step);

    return (
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800/50 flex flex-col" aria-live="polite">
            {/* Top row: back + progress */}
            <div className="flex items-center gap-2 mb-4">
                <button
                    onClick={goBack}
                    aria-label={step === 'goal' ? 'Back to chat' : 'Previous step'}
                    disabled={submitting}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                    <span aria-hidden="true">←</span> {step === 'goal' ? 'Chat' : 'Back'}
                </button>
                {step !== 'done' && (
                    <div className="flex-1 flex items-center justify-end gap-1.5" aria-hidden="true">
                        {FUNNEL_STEPS.map((s, i) => (
                            <span
                                key={s}
                                className={`h-1.5 rounded-full transition-all ${i <= stepIndex ? 'w-5 bg-blue-600' : 'w-2 bg-gray-300 dark:bg-gray-600'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {step === 'goal' && (
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-1">What are you hoping to achieve?</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Pick what fits best — we&apos;ll tailor a plan around it.</p>
                    <div className="flex flex-col gap-2">
                        {GOAL_OPTIONS.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => { setAnswers((a) => ({ ...a, goal: opt })); setStep('level'); }}
                                className="text-left px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-sapphire dark:hover:border-sapphire rounded-xl transition-all shadow-sm text-gray-700 dark:text-gray-200 hover:text-sapphire dark:hover:text-sapphire cursor-pointer focus:outline-none focus:ring-2 focus:ring-sapphire"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'level' && (
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-1">What level are we working at?</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This helps us match the right specialist tutor.</p>
                    <div className="flex flex-col gap-2">
                        {LEVEL_OPTIONS.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => { setAnswers((a) => ({ ...a, level: opt })); setStep('region'); }}
                                className="text-left px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-sapphire dark:hover:border-sapphire rounded-xl transition-all shadow-sm text-gray-700 dark:text-gray-200 hover:text-sapphire dark:hover:text-sapphire cursor-pointer focus:outline-none focus:ring-2 focus:ring-sapphire"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'region' && (
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-1">Where are you based?</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">So we can align to your curriculum and timezone.</p>
                    <div className="flex flex-col gap-2">
                        {REGION_OPTIONS.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => { setAnswers((a) => ({ ...a, region: opt })); setStep('contact'); }}
                                className="text-left px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-sapphire dark:hover:border-sapphire rounded-xl transition-all shadow-sm text-gray-700 dark:text-gray-200 hover:text-sapphire dark:hover:text-sapphire cursor-pointer focus:outline-none focus:ring-2 focus:ring-sapphire"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {(step === 'contact' || step === 'submitting') && (
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-1">Almost there — where should we reach you?</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        A StudyHours counsellor will put together a personalized plan and reach out.
                    </p>
                    <div className="flex flex-col gap-3">
                        <label className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Email <span className="text-red-500">*</span></span>
                            <input
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                disabled={submitting}
                                aria-required="true"
                                aria-invalid={email.length > 0 && !emailValid}
                                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-sapphire text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 disabled:opacity-50"
                            />
                            {email.length > 0 && !emailValid && (
                                <span className="text-[11px] text-red-500">Please enter a valid email address.</span>
                            )}
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Name <span className="text-gray-500 font-normal">(optional)</span></span>
                            <input
                                type="text"
                                autoComplete="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                disabled={submitting}
                                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-sapphire text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 disabled:opacity-50"
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Phone <span className="text-gray-500 font-normal">(optional)</span></span>
                            <input
                                type="tel"
                                autoComplete="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+44 …"
                                disabled={submitting}
                                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-sapphire text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 disabled:opacity-50"
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Anything specific? <span className="text-gray-500 font-normal">(optional)</span></span>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="e.g. Year 11 Chemistry, exam in May…"
                                disabled={submitting}
                                rows={2}
                                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-sapphire text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 disabled:opacity-50 resize-none"
                            />
                        </label>

                        <fieldset className="flex items-center gap-2">
                            <legend className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Prefer to be reached by</legend>
                            {(['email', 'phone'] as const).map((pc) => (
                                <button
                                    key={pc}
                                    type="button"
                                    onClick={() => setPreferredContact(pc)}
                                    aria-pressed={preferredContact === pc}
                                    disabled={submitting}
                                    className={`px-3 py-1.5 text-xs rounded-full border transition-all capitalize disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sapphire ${
                                        preferredContact === pc
                                            ? 'bg-sapphire text-white border-sapphire'
                                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-sapphire'
                                    }`}
                                >
                                    {pc}
                                </button>
                            ))}
                        </fieldset>

                        {error && (
                            <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300 p-3 rounded-xl text-sm text-center" role="alert">
                                {error}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => void submit()}
                            disabled={!canSubmit}
                            aria-label="Submit request for a personalized plan"
                            className="w-full mt-1 px-4 py-2.5 rounded-xl bg-sapphire text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sapphire/90 transition-all shadow-lg shadow-sapphire/20 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sapphire focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                        >
                            {submitting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                                    Sending…
                                </>
                            ) : (
                                'Get my personalized plan'
                            )}
                        </button>
                        {!turnstileToken && (
                            <p className="text-[11px] text-center text-gray-500">Validating session…</p>
                        )}
                    </div>
                </div>
            )}

            {step === 'done' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Thanks{name.trim() ? `, ${name.trim()}` : ''}!</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        A counsellor will be in touch shortly with a personalized plan. Meanwhile, feel free to keep chatting with our assistant.
                    </p>
                    <button
                        type="button"
                        onClick={onExit}
                        className="px-4 py-2 rounded-xl bg-sapphire text-white text-sm font-semibold hover:bg-sapphire/90 transition-all shadow-lg shadow-sapphire/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sapphire focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    >
                        Back to chat
                    </button>
                </div>
            )}
        </div>
    );
}

export default function AiChatbotWidget() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [turnstileToken, setTurnstileToken] = useState<string>(TURNSTILE_ENABLED ? '' : 'dev-bypass');
    const [turnstileKey] = useState(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '');
    const [unreadCount, setUnreadCount] = useState(0);
    const turnstileRef = useRef<TurnstileInstance>(null);

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatUiMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inFlight = useRef(false);

    // Guided lead funnel: when active it replaces the chat body. funnelKey forces a
    // fresh LeadFunnel mount (resetting its internal step/answers) on each open.
    const [showFunnel, setShowFunnel] = useState(false);
    const [funnelSeed, setFunnelSeed] = useState<LeadAnswers | undefined>(undefined);
    const [funnelStep, setFunnelStep] = useState<FunnelStep>('goal');
    const [funnelKey, setFunnelKey] = useState(0);

    const openFunnel = (seed?: LeadAnswers, step?: FunnelStep) => {
        setFunnelSeed(seed);
        setFunnelStep(step ?? 'goal');
        setFunnelKey((k) => k + 1);
        setShowFunnel(true);
    };

    // Cloudflare Turnstile tokens are SINGLE-USE and short-lived. After each send we must
    // invalidate the current token and force the invisible widget to mint a fresh one,
    // otherwise every message after the first fails server-side verification (403).
    const refreshTurnstile = () => {
        if (!TURNSTILE_ENABLED) return; // dev bypass keeps its placeholder token
        setTurnstileToken('');
        turnstileRef.current?.reset();
    };

    const doSend = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || isLoading || inFlight.current || !turnstileToken) return;

        inFlight.current = true;
        setIsLoading(true);
        setError(null);

        const tokenForRequest = turnstileToken;
        refreshTurnstile();

        // Build history from prior messages in the backend's expected shape BEFORE we
        // append the new turn.
        const history = messages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        }));

        const userMsg: ChatUiMessage = { id: newId(), role: 'user', content: trimmed };
        const assistantId = newId();
        setMessages((prev) => [...prev, userMsg, { id: assistantId, role: 'assistant', content: '' }]);

        const appendToAssistant = (delta: string) =>
            setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + delta } : m)),
            );

        try {
            const res = await fetch(`${API_URL}/api/chatbot/public`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmed, history, turnstileToken: tokenForRequest }),
            });

            if (!res.ok || !res.body) {
                let msg = 'Assistant unavailable. Please try again.';
                if (res.status === 429) msg = 'The assistant is busy right now. Please try again in a bit.';
                else if (res.status === 403) msg = 'Verification failed. Please refresh and try again.';
                else if (res.status === 400) {
                    try { msg = (await res.json())?.message || msg; } catch { /* keep default */ }
                }
                throw new Error(msg);
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let received = false;
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                if (chunk) {
                    received = true;
                    appendToAssistant(chunk);
                }
            }
            // If the stream closed without any text, surface a soft error instead of a blank bubble.
            if (!received) {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantId && !m.content
                            ? { ...m, content: 'Sorry, I could not generate a response. Please try again or email info@studyhours.com.' }
                            : m,
                    ),
                );
            }
        } catch (err) {
            console.error('Chat error:', err);
            setError(err instanceof Error ? err.message : 'Something went wrong.');
            // Drop the empty assistant placeholder; keep any partial text that already streamed.
            setMessages((prev) => prev.filter((m) => !(m.id === assistantId && m.content === '')));
        } finally {
            inFlight.current = false;
            setIsLoading(false);
        }
    };

    const isOpenRef = useRef(false);
    const previousMessageCount = useRef(messages.length);

    useEffect(() => {
        isOpenRef.current = isOpen;
        if (isOpen) {
            setUnreadCount(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (messages.length > previousMessageCount.current) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant' && !isOpenRef.current) {
                setUnreadCount((prev) => prev + 1);
            }
        }
        previousMessageCount.current = messages.length;
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);

    const handleSubmit = (e?: React.SyntheticEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading || !turnstileToken) return;
        void doSend(input);
        setInput('');
    };

    // Starter chips route either to the free-text chat (action: 'chat') or into the
    // deterministic lead funnel (action: 'funnel'). SAT/ACT is counsellor-led (no
    // fixed price), so it seeds the funnel and skips ahead.
    type StarterChip = { label: string; action: 'chat' | 'funnel'; seed?: LeadAnswers; step?: FunnelStep };
    const starterChips: StarterChip[] = (() => {
        const defaultChips: StarterChip[] = [
            { label: "Book a free trial session", action: 'funnel' },
            { label: "Which curricula do you support? (US/UK/International)", action: 'chat' },
            { label: "View pricing & credit packages", action: 'chat' },
            { label: "Talk to a human / Growth Specialist", action: 'funnel', seed: { goal: 'Talk to an advisor' }, step: 'contact' },
        ];

        if (!pathname) return defaultChips;

        if (pathname.includes('/sat') || pathname.includes('/act')) {
            return [
                { label: "SAT / ACT & admissions help", action: 'funnel', seed: { goal: 'SAT/ACT & admissions' }, step: 'level' },
                { label: "Talk to an advisor", action: 'funnel' },
                { label: "Get free SAT/ACT prep resources", action: 'funnel', seed: { goal: 'Free resource / past papers' }, step: 'level' },
                { label: "How does the SAT program work?", action: 'chat' },
            ];
        }

        if (pathname.includes('/pricing')) {
            return [
                { label: "How do credit packages and pricing work?", action: 'chat' },
                { label: "Get a personalized plan", action: 'funnel' },
                { label: "Book a free assessment", action: 'funnel' },
                { label: "Get free Exam Survival Hub & past papers", action: 'funnel', seed: { goal: 'Free resource / past papers' }, step: 'level' },
            ];
        }

        return defaultChips;
    })();

    const handleChipClick = (chip: StarterChip) => {
        if (chip.action === 'funnel') openFunnel(chip.seed, chip.step);
        else void doSend(chip.label);
    };

    if (pathname?.startsWith('/studio')) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-100 flex flex-col items-end gap-2 pointer-events-none">
            {isOpen && (
                <div className="pointer-events-auto w-[calc(100vw-3rem)] sm:w-87.5 md:w-100 h-137.5 max-h-[calc(100dvh-180px)] flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-slate-200 dark:border-white/10 shadow-2xl origin-bottom-right transition-all animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 bg-sapphire text-white flex justify-between items-center backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold tracking-wider">
                                    SH
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-green-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">StudyHours Assistant</h3>
                                <span className="text-xs text-white/80 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    Online
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                            className="p-2 hover:bg-white/10 rounded-full transition-colors font-bold text-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            &times;
                        </button>
                    </div>

                    {showFunnel ? (
                        <LeadFunnel
                            key={funnelKey}
                            turnstileToken={turnstileToken}
                            refreshTurnstile={refreshTurnstile}
                            onExit={() => setShowFunnel(false)}
                            initialAnswers={funnelSeed}
                            initialStep={funnelStep}
                        />
                    ) : (
                    <>
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50" aria-live="polite">
                        {messages.length === 0 && (
                            <div className="text-center mt-6">
                                <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">We're here to help</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 px-4">
                                    Every student's learning journey is unique. Ask me how StudyHours can support your family's educational goals, from finding the right tutor to exam preparation.
                                </p>

                                <div className="flex flex-col gap-2 px-2">
                                    {starterChips.map((chip, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleChipClick(chip)}
                                            className="text-left px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-sapphire dark:hover:border-sapphire rounded-xl transition-all shadow-sm text-gray-700 dark:text-gray-200 hover:text-sapphire dark:hover:text-sapphire cursor-pointer focus:outline-none focus:ring-2 focus:ring-sapphire"
                                        >
                                            {chip.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <span className="text-[10px] text-gray-400 mb-1 px-1">
                                    {msg.role === 'user' ? 'You' : 'StudyHours Assistant'}
                                </span>
                                <div className={`
                                    max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-sm wrap-break-word whitespace-pre-wrap prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0
                                    ${msg.role === 'user'
                                        ? 'bg-sapphire text-white rounded-tr-sm prose-a:text-white hover:prose-a:text-blue-100'
                                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-600 rounded-tl-sm prose-a:text-blue-600 dark:prose-a:text-blue-400'}
                                `}>
                                    <ReactMarkdown components={{
                                        a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="underline font-medium" />
                                    }}>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}

                        {isLoading && messages[messages.length - 1]?.role === 'user' && (
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] text-gray-400 mb-1 px-1">StudyHours Assistant</span>
                                <div className="px-4 py-3 rounded-2xl bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-tl-sm shadow-sm flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 text-red-600 dark:bg-red-900/20 p-3 rounded-xl text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 relative">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input || ''}
                                onChange={handleInputChange}
                                placeholder={turnstileToken ? 'Ask StudyHours…' : 'Verifying…'}
                                disabled={isLoading || !turnstileToken}
                                className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-sapphire text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!(input || '').trim() || isLoading || !turnstileToken}
                                aria-label="Send message"
                                className="p-2 rounded-xl bg-sapphire text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sapphire/90 transition-all shadow-lg shadow-sapphire/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sapphire"
                            >
                                <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </div>
                        {/* Persistent, tasteful way to reach the guided advisor funnel and assessment. */}
                        <div className="flex flex-col gap-1 mt-2">
                            <button
                                type="button"
                                onClick={() => openFunnel()}
                                className="w-full text-center text-xs font-medium text-sapphire dark:text-blue-400 hover:text-sapphire/80 dark:hover:text-blue-300 transition-colors cursor-pointer focus:outline-none focus:underline"
                            >
                                Book a free assessment
                            </button>
                            <button
                                type="button"
                                onClick={() => openFunnel()}
                                className="w-full text-center text-xs text-gray-500 dark:text-gray-400 hover:text-sapphire dark:hover:text-blue-400 transition-colors cursor-pointer focus:outline-none focus:underline"
                            >
                                Prefer a human? Get a personalized plan from an advisor →
                            </button>
                        </div>
                    </form>
                    </>
                    )}

                    {/* Invisible Turnstile — panel-level so it stays mounted across both
                        the chat and the lead funnel, re-issuing a fresh single-use token
                        after each request (see refreshTurnstile). */}
                    {TURNSTILE_ENABLED && (
                        <div className="sr-only" aria-hidden="true">
                            <Turnstile
                                ref={turnstileRef}
                                siteKey={turnstileKey}
                                onSuccess={(token) => setTurnstileToken(token)}
                                onError={() => { setTurnstileToken(''); console.error('Turnstile error'); }}
                                onExpire={() => refreshTurnstile()}
                                options={{ size: 'invisible' }}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* LOADER TRIGGER */}
            <div
                onClick={toggleChat}
                className={`pointer-events-auto cursor-pointer hover:scale-105 transition-transform relative ${unreadCount > 0 ? 'animate-bounce' : ''}`}
            >
                <ChatLoader />
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-5.5 h-5.5 px-1.5 bg-red-500 text-white text-[11px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-lg shadow-red-500/40 animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                )}
            </div>
        </div>
    );
}
