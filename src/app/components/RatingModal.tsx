'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { api } from '@/app/lib/api';
import { useFocusTrap } from '@/app/Hooks/useFocusTrap';

interface PendingRating {
  sessionId: string;
  tutorId: string;
  tutorName: string;
  studentName?: string;
  sessionDate: string | null;
  subjectName: string;
}

interface RatingModalProps {
  pending: PendingRating[];
  onDone: () => void;
}

export default function RatingModal({ pending, onDone }: RatingModalProps) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOpen = pending.length > 0 && index < pending.length;

  const handleSkip = () => {
    setScore(0);
    setHovered(0);
    setComment('');
    if (index === pending.length - 1) {
      onDone();
    } else {
      setIndex((i) => i + 1);
    }
  };

  const panelRef = useFocusTrap<HTMLDivElement>(isOpen, handleSkip);

  if (!isOpen) return null;

  const current = pending[index];
  const isLast = index === pending.length - 1;

  const handleSubmit = async () => {
    if (score === 0) return;
    setSubmitting(true);
    try {
      await api.post(`/ratings/sessions/${current.sessionId}`, {
        score,
        comment: comment.trim() || undefined,
      });
    } catch {
      // Already rated or error — skip silently
    } finally {
      setSubmitting(false);
      setScore(0);
      setHovered(0);
      setComment('');
      if (isLast) {
        onDone();
      } else {
        setIndex((i) => i + 1);
      }
    }
  };

  const displayScore = hovered || score;
  const dateStr = current.sessionDate
    ? new Date(current.sessionDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Recent session';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rating-modal-title"
        tabIndex={-1}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6"
      >
        <div className="text-center space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500">Rate your session</p>
          <h2 id="rating-modal-title" className="text-2xl font-black text-gray-900 dark:text-white">
            How was {current.tutorName}?
          </h2>
          {current.studentName && (
            <p className="text-sm text-gray-500">
              for {current.studentName} · {current.subjectName}
            </p>
          )}
          {!current.studentName && (
            <p className="text-sm text-gray-500">{current.subjectName} · {dateStr}</p>
          )}
        </div>

        <div className="flex justify-center gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setScore(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={40}
                className={`transition-colors ${
                  star <= displayScore
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-none text-gray-300 dark:text-gray-600'
                }`}
              />
            </button>
          ))}
        </div>

        <p className="text-center text-sm font-semibold text-gray-500 h-5">
          {displayScore === 1 && 'Needs improvement'}
          {displayScore === 2 && 'Below expectations'}
          {displayScore === 3 && 'Good'}
          {displayScore === 4 && 'Very good'}
          {displayScore === 5 && 'Excellent!'}
        </p>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Any comments? (optional)"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {pending.length > 1 && (
          <div className="flex justify-center gap-1.5">
            {pending.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === index ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={score === 0 || submitting}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-40 transition-colors"
          >
            {submitting ? 'Submitting...' : isLast ? 'Submit' : 'Submit & Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
