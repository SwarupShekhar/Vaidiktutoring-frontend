'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PenLine, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import ProtectedClient from '@/app/components/ProtectedClient';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { api } from '@/app/lib/api';
import {
  AppPage,
  AppPageItem,
  AppPageHeader,
  AppCard,
} from '@/app/components/app-shell/ui';

const CATEGORIES = ['Study Tips', 'Exam Prep', 'Subject Guides', 'Parenting', 'Student Life', 'News'];

export default function TutorNewBlogPage() {
  return (
    <ProtectedClient roles={['tutor']}>
      <ErrorBoundary>
        <TutorNewBlog />
      </ErrorBoundary>
    </ProtectedClient>
  );
}

function TutorNewBlog() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    category: CATEGORIES[0],
    imageUrl: '',
    content: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const canSubmit =
    form.title.trim() && form.excerpt.trim() && form.content.trim() && form.category.trim();

  const submit = async () => {
    if (!canSubmit) {
      toast.error('Title, summary, category and content are required.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/admin/blogs', {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content,
        category: form.category,
        imageUrl: form.imageUrl.trim() || undefined,
      });
      toast.success('Submitted for review! An editor will publish it once approved.');
      router.push('/tutor/blogs');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Could not submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    'w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-emerald-400/60';
  const label = 'mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/40';

  return (
    <AppPage>
      <AppPageItem>
        <AppPageHeader
          icon={PenLine}
          accent="emerald"
          title="Write a blog"
          subtitle="Draft your article and submit it for review. An editor polishes and publishes approved posts."
        />
      </AppPageItem>

      <AppPageItem>
        <AppCard accent="emerald" interactive={false}>
          <div className="space-y-5">
            <div>
              <label className={label}>Title</label>
              <input
                className={field}
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="A clear, compelling headline"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Category</label>
                <select
                  className={field}
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#15131f]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>Cover image URL (optional)</label>
                <input
                  className={field}
                  value={form.imageUrl}
                  onChange={(e) => set('imageUrl', e.target.value)}
                  placeholder="https://…"
                />
              </div>
            </div>

            <div>
              <label className={label}>Summary</label>
              <textarea
                className={`${field} min-h-[64px] resize-y`}
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                placeholder="One or two sentences shown in the blog list."
              />
            </div>

            <div>
              <label className={label}>Content</label>
              <textarea
                className={`${field} min-h-[280px] resize-y font-mono text-[13px] leading-relaxed`}
                value={form.content}
                onChange={(e) => set('content', e.target.value)}
                placeholder="Write your article here. Basic HTML is supported; an editor will format and polish it before publishing."
              />
              <p className="mt-1.5 text-[11px] text-white/35">
                Plain text or basic HTML. The editorial team formats and publishes approved posts.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => router.push('/tutor/blogs')}
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={submitting || !canSubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                Submit for review
              </button>
            </div>
          </div>
        </AppCard>
      </AppPageItem>
    </AppPage>
  );
}
