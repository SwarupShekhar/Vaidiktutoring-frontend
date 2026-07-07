'use client';

import React, { useRef, useState } from 'react';
import { FileText, X, Upload, Loader2 } from 'lucide-react';
import { api } from '@/app/lib/api';
import { toast } from 'sonner';
import { useFocusTrap } from '@/app/Hooks/useFocusTrap';

/**
 * Share notes/files with the student of a specific session.
 *
 * Posts to `POST /sessions/:id/notes`. The backend enforces that the caller is
 * the session's assigned tutor (or admin) and that the session has already
 * happened — so a tutor can only reach students they've actually taught.
 * The student sees the result in their Notes screen (web + app).
 */
export default function ShareNotesModal({
  sessionId,
  studentName,
  onClose,
}: {
  sessionId: string;
  studentName?: string;
  onClose: () => void;
}) {
  const [title, setTitle] = useState('');
  const [noteType, setNoteType] = useState('general');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const panelRef = useFocusTrap<HTMLDivElement>(true, onClose);

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
    } catch (err: any) {
      // Surface the backend's eligibility message (e.g. not this session's tutor).
      const msg = err?.response?.data?.message || 'Failed to share notes. Please try again.';
      toast.error(typeof msg === 'string' ? msg : 'Failed to share notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-notes-modal-title"
        tabIndex={-1}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 id="share-notes-modal-title" className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText size={20} className="text-green-500" /> Share Notes
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {studentName && (
          <p className="-mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sharing with <span className="font-bold text-slate-700 dark:text-slate-200">{studentName}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Algebra – Chapter 3 Notes"
              className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</label>
            <select
              value={noteType}
              onChange={e => setNoteType(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="general">General Notes</option>
              <option value="annotated_pdf">Annotated PDF</option>
              <option value="after_class">After-Class Notes</option>
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Text Notes (optional)</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write any text notes here..."
              rows={3}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            />
          </div>

          {/* File upload */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Attach File (optional)</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="mt-1 flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 hover:border-green-400 hover:text-green-500 transition-colors cursor-pointer text-sm"
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
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
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
