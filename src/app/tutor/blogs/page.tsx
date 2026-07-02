'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PenLine, FileText, Plus, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import ProtectedClient from '@/app/components/ProtectedClient';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { api } from '@/app/lib/api';
import {
  AppPage,
  AppPageItem,
  AppPageHeader,
  AppCard,
  AppEmptyState,
  AppSkeletonCard,
  AppPillButton,
} from '@/app/components/app-shell/ui';

type Blog = {
  id: string;
  title: string;
  excerpt?: string;
  status?: string;
  slug?: string;
  created_at?: string;
  published_at?: string | null;
};

const STATUS: Record<string, { label: string; cls: string; Icon: any }> = {
  PENDING: { label: 'In review', cls: 'bg-amber-500/15 text-amber-300 ring-amber-400/25', Icon: Clock },
  PUBLISHED: { label: 'Published', cls: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/25', Icon: CheckCircle2 },
  REJECTED: { label: 'Needs changes', cls: 'bg-rose-500/15 text-rose-300 ring-rose-400/25', Icon: XCircle },
  DRAFT: { label: 'Draft', cls: 'bg-white/10 text-white/60 ring-white/15', Icon: FileText },
};

export default function TutorBlogsPage() {
  return (
    <ProtectedClient roles={['tutor']}>
      <ErrorBoundary>
        <TutorBlogs />
      </ErrorBoundary>
    </ProtectedClient>
  );
}

function TutorBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/admin/blogs', { params: { limit: 50 } });
        const list: Blog[] = res.data?.blogs || (Array.isArray(res.data) ? res.data : []);
        if (!cancelled) setBlogs(list);
      } catch {
        if (!cancelled) setBlogs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppPage>
      <AppPageItem>
        <AppPageHeader
          icon={PenLine}
          accent="emerald"
          title="My Blogs"
          subtitle="Write articles and submit them for review — an editor publishes approved posts to the site."
          right={
            <Link href="/tutor/blogs/new">
              <AppPillButton accent="emerald" variant="solid">
                <Plus size={15} /> Write new
              </AppPillButton>
            </Link>
          }
        />
      </AppPageItem>

      <AppPageItem>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <AppSkeletonCard />
            <AppSkeletonCard />
          </div>
        ) : blogs.length === 0 ? (
          <AppEmptyState
            icon={FileText}
            accent="emerald"
            title="No blogs yet — write your first article."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {blogs.map((b) => {
              const s = STATUS[(b.status || 'PENDING').toUpperCase()] ?? STATUS.PENDING;
              return (
                <AppCard key={b.id} accent="emerald" interactive={false}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 flex-1 truncate font-bold text-white">{b.title}</p>
                    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${s.cls}`}>
                      <s.Icon size={11} /> {s.label}
                    </span>
                  </div>
                  {b.excerpt && <p className="mt-1 line-clamp-2 text-xs text-white/45">{b.excerpt}</p>}
                  <p className="mt-3 text-[11px] text-white/35">
                    {b.published_at
                      ? `Published ${format(new Date(b.published_at), 'd MMM yyyy')}`
                      : b.created_at
                        ? `Submitted ${format(new Date(b.created_at), 'd MMM yyyy')}`
                        : ''}
                  </p>
                </AppCard>
              );
            })}
          </div>
        )}
      </AppPageItem>
    </AppPage>
  );
}
