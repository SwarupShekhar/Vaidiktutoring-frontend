'use client';

import React, { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import ProtectedClient from '@/app/components/ProtectedClient';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { useAuthContext } from '@/app/context/AuthContext';
import { useIsAppShell } from '@/app/Hooks/useIsAppShell';
import { TutorAppDashboard } from '@/app/components/app-shell/TutorAppDashboard';
import MagicBento, { type BentoCardProps } from '@/app/components/MagicBento';
import { useTutorBentoCards } from '@/app/Hooks/useTutorBentoCards';
import { ACCENT } from '@/app/components/app-shell/ui';
import BlogManagementSection from '@/app/components/admin/BlogManagementSection';
import { api } from '@/app/lib/api';
import {
  Users,
  Star,
  MessageSquare,
  FileText,
  X,
  Upload,
  Loader2,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import TutorStudentMessages from './TutorStudentMessages';
import TutorRecentReviews from './TutorRecentReviews';

// ─── Share Notes Modal ───
function ShareNotesModal({ sessionId, onClose }: { sessionId: string; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [noteType, setNoteType] = useState('general');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Please add a title'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('note_type', noteType);
      if (content) formData.append('content', content);
      if (file) formData.append('file', file);

      await api.post(`/sessions/${sessionId}/notes`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Notes shared with student!');
      onClose();
    } catch {
      toast.error('Failed to share notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileText size={20} className="text-emerald-500" /> Share Notes
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Algebra – Chapter 3 Notes"
              className="mt-1 w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Type</label>
            <select
              value={noteType}
              onChange={e => setNoteType(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="general">General Notes</option>
              <option value="annotated_pdf">Annotated PDF</option>
              <option value="after_class">After-Class Notes</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Text Notes (optional)</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write any text notes here..."
              rows={3}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Attach File (optional)</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="mt-1 flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-border text-text-secondary hover:border-emerald-400 hover:text-emerald-500 transition-colors cursor-pointer text-sm"
            >
              <Upload size={16} />
              {file ? file.name : 'Click to attach PDF or image'}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              className="hidden"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border text-text-secondary text-sm font-semibold hover:bg-border/40 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
              Share Notes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TutorDashboardPage() {
  const { user } = useAuthContext();
  const [shareNotesSessionId, setShareNotesSessionId] = useState<string | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const isAppShell = true; // useIsAppShell();

  // Web tutor dashboard shares ONE card-builder with the desktop app. Omitting
  // cardColor keeps the cards theme-aware (light/dark) via the --bento-* vars set
  // on the wrapper below; the app-shell passes its dark CARD_COLOR instead.
  const { cards, loading } = useTutorBentoCards({ onShareNotes: setShareNotesSessionId });

  // Web-only: drop a compact "Messages" tile into the empty 4-col slot beside
  // Completed/Vault (it scrolls to the full chat below), and stretch the Upcoming
  // Roadmap to full width so the grid has no dead space. The app-shell bento,
  // which renders `cards` directly, is untouched.
  const webCards = useMemo<BentoCardProps[]>(() => {
    const list = [...cards];
    const messagesTile: BentoCardProps = {
      accent: ACCENT.sky,
      colSpan: 4,
      label: 'Messages',
      icon: <MessageSquare className="h-4 w-4" />,
      title: 'Student messages',
      description: 'Questions from your students',
      onClick: () => document.getElementById('comm-center')?.scrollIntoView({ behavior: 'smooth' }),
      children: (
        <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: `rgb(${ACCENT.sky})` }}>
          Open messages <ArrowRight size={13} />
        </span>
      ),
    };
    const idx = list.findIndex((c) => c.label === 'Upcoming roadmap');
    if (idx >= 0) {
      list[idx] = { ...list[idx], colSpan: 12 };
      list.splice(idx, 0, messagesTile);
    } else {
      list.push(messagesTile);
    }
    return list;
  }, [cards]);

  // Desktop app-shell: native Magic Bento homescreen (dark surface, full effects).
  if (isAppShell) {
    return (
      <ProtectedClient roles={['tutor']}>
        <ErrorBoundary>
          <TutorAppDashboard user={user} />
        </ErrorBoundary>
      </ProtectedClient>
    );
  }

  return (
    <ProtectedClient roles={['tutor']}>
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8 space-y-8">

            {/* HEADER */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  Welcome, {user?.firstName || user?.first_name || 'there'}
                </h1>
                <p className="mt-1 text-sm text-text-secondary">Your teaching overview.</p>
              </div>
              <Link
                href="/tutor/students"
                className="inline-flex items-center gap-2 self-start rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-border/40"
              >
                <Users size={16} /> My Students
              </Link>
            </header>

            {/* BENTO GRID — calm effects, theme-aware via --bento-* vars */}
            <div className="[--bento-fg:#0f172a] [--bento-fg-muted:#64748b] [--bento-hairline:rgba(15,23,42,0.12)] [--bento-surface:#ffffff] [--bento-row:rgba(15,23,42,0.03)] dark:[--bento-fg:#ffffff] dark:[--bento-fg-muted:rgba(255,255,255,0.62)] dark:[--bento-hairline:rgba(255,255,255,0.12)] dark:[--bento-surface:#15131f] dark:[--bento-row:rgba(255,255,255,0.05)]">
              {loading && cards.length === 0 ? (
                <div className="h-40 rounded-2xl border border-border bg-surface animate-pulse" />
              ) : (
                <MagicBento
                  cards={webCards}
                  textAutoHide={false}
                  enableStars={false}
                  enableTilt={false}
                  enableMagnetism={false}
                  enableSpotlight
                  enableBorderGlow
                  clickEffect={false}
                  spotlightRadius={280}
                  glowColor="129, 140, 248"
                />
              )}
            </div>

            {/* COMMUNICATION CENTER */}
            <section id="comm-center" className="scroll-mt-6 overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                <MessageSquare size={18} className="text-indigo-500" />
                <div>
                  <h2 className="text-base font-bold text-foreground">Communication Center</h2>
                  <p className="text-xs text-text-secondary">Student inquiries & feedback</p>
                </div>
              </div>
              <div className="p-4 md:p-5">
                <TutorStudentMessages currentUserId={user?.id} />
              </div>
            </section>

            {/* RECENT FEEDBACK (collapsible, closed by default) */}
            <section className="rounded-2xl border border-border bg-surface">
              <button
                type="button"
                onClick={() => setFeedbackOpen((v) => !v)}
                aria-expanded={feedbackOpen}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 md:px-6"
              >
                <span className="flex items-center gap-3">
                  <Star size={18} className="text-amber-500" fill="currentColor" />
                  <span className="text-base font-bold text-foreground">Recent student feedback</span>
                </span>
                <ChevronDown
                  size={18}
                  className={`text-text-secondary transition-transform ${feedbackOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {feedbackOpen && (
                <div className="border-t border-border px-5 py-5 md:px-6">
                  <TutorRecentReviews />
                </div>
              )}
            </section>

            {/* BLOG MANAGEMENT */}
            <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
              <BlogManagementSection filterOnlyMyBlogs={true} />
            </section>
          </div>
        </div>

        {shareNotesSessionId && (
          <ShareNotesModal
            sessionId={shareNotesSessionId}
            onClose={() => setShareNotesSessionId(null)}
          />
        )}
      </ErrorBoundary>
    </ProtectedClient>
  );
}
