'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Shield, Book, Eye, Search, Clock, FileText, ChevronLeft, X, Loader2 } from 'lucide-react';
import { vaultApi, VaultAsset } from '@/app/lib/vault';
import { useAuthContext } from '@/app/context/AuthContext';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useIsAppShell } from '@/app/Hooks/useIsAppShell';
import { toast } from 'sonner';
import {
  AppPage,
  AppPageItem,
  AppPageHeader,
  AppCard,
  AppSearchInput,
  AppPillButton,
  AppEmptyState,
  AppSkeletonCard,
  SecureDocViewer,
  accentRgb,
} from '@/app/components/app-shell/ui';

function VaultContent() {
  const { user } = useAuthContext();
  const isAppShell = useIsAppShell();
  const searchParams = useSearchParams();
  // Deep-link from the dashboard "Your subjects" pills: ?subject=<name> narrows
  // the materials to one subject (resolved + scope-enforced server-side).
  const subjectFilter = searchParams.get('subject') || undefined;
  const [assets, setAssets] = useState<VaultAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // ---- View-only asset viewer ----
  const [viewerAsset, setViewerAsset] = useState<VaultAsset | null>(null);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerLoading, setViewerLoading] = useState(false);

  const openAsset = async (asset: VaultAsset) => {
    setViewerAsset(asset);
    setViewerUrl((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return null;
    });
    setViewerLoading(true);
    try {
      // Stream the bytes through our backend (same-origin, authenticated) and
      // render from an object URL — avoids the Azure CORS block and never exposes
      // a downloadable SAS URL to the browser.
      const blob = await vaultApi.getAssetBlob(asset.id);
      const url = URL.createObjectURL(blob);
      setViewerUrl(url);
    } catch (err) {
      console.error('Failed to open vault asset', err);
      toast.error('Could not open this material. Please try again.');
      setViewerAsset(null);
    } finally {
      setViewerLoading(false);
    }
  };

  const closeViewer = () => {
    setViewerAsset(null);
    setViewerUrl((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return null;
    });
  };

  // Esc closes the viewer.
  useEffect(() => {
    if (!viewerAsset) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeViewer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewerAsset]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const data = await vaultApi.getAssets(subjectFilter ? { subject: subjectFilter } : undefined);
        setAssets(Array.isArray(data) ? data : (data.assets || []));
      } catch (err) {
        console.error('Failed to fetch student vault assets', err);
        toast.error('Could not load your materials.');
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchAssets();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [subjectFilter]);

  const filteredAssets = assets.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ---- Desktop app-shell premium view ----
  const AppShellView = (
    <AppPage>
      <AppPageItem>
        <AppPageHeader
          icon={Shield}
          accent="indigo"
          title="Study Vault"
          subtitle={
            subjectFilter
              ? `Materials for ${subjectFilter}`
              : 'Access all materials and manipulatives shared during your sessions.'
          }
          right={
            <AppSearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search materials…"
              accent="indigo"
            />
          }
        />
      </AppPageItem>

      {subjectFilter && (
        <AppPageItem>
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: accentRgb('indigo', 0.14), border: `1px solid ${accentRgb('indigo', 0.3)}`, color: accentRgb('indigo') }}
          >
            {subjectFilter}
            <Link href="/students/vault" aria-label="Clear subject filter" className="opacity-70 transition-opacity hover:opacity-100">
              <X size={13} />
            </Link>
          </span>
        </AppPageItem>
      )}

      {loading ? (
        <AppPageItem>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <AppSkeletonCard key={i} />
            ))}
          </div>
        </AppPageItem>
      ) : filteredAssets.length === 0 ? (
        <AppPageItem>
          <AppEmptyState
            icon={Book}
            accent="indigo"
            title="No materials shared yet."
            description="Your tutors will upload documents and PPTs here during or after your sessions."
          />
        </AppPageItem>
      ) : (
        <AppPageItem>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <AppCard key={asset.id} accent="indigo">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: accentRgb('indigo', 0.12),
                      color: accentRgb('indigo'),
                    }}
                  >
                    {asset.file_type === 'PDF' ? <FileText size={24} /> : <Book size={24} />}
                  </span>
                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest"
                    style={{
                      background: accentRgb('indigo', 0.12),
                      color: accentRgb('indigo'),
                    }}
                  >
                    {asset.file_type}
                  </span>
                </div>

                <h3 className="text-base font-black text-white mb-1.5 line-clamp-1">
                  {asset.title}
                </h3>
                <p className="text-sm text-white/60 line-clamp-2 mb-5 min-h-[40px]">
                  {asset.description || 'No description provided.'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-white/45">
                    <Clock size={14} />
                    {new Date(asset.created_at).toLocaleDateString()}
                  </div>

                  <AppPillButton
                    accent="indigo"
                    variant="soft"
                    onClick={() => openAsset(asset)}
                  >
                    <Eye size={14} />
                    View Only
                  </AppPillButton>
                </div>
              </AppCard>
            ))}
          </div>
        </AppPageItem>
      )}
    </AppPage>
  );

  // ---- Web view (UNCHANGED) ----
  const WebView = (
    <div className="container mx-auto py-12 px-6">
      <div className="mb-8">
        <Link href="/students/dashboard" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-2 mb-4 group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-black text-(--color-text-primary) flex items-center gap-4">
          <Shield className="text-indigo-500" size={36} />
          Study Vault
        </h1>
        <p className="text-text-secondary mt-2">
          {subjectFilter
            ? `Materials for ${subjectFilter}`
            : 'Access all materials and manipulatives shared during your sessions.'}
        </p>
        {subjectFilter && (
          <Link
            href="/students/vault"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
          >
            {subjectFilter}
            <X size={13} />
          </Link>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-hidden"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-surface rounded-3xl p-6 border border-border pb-8">
              <div className="h-48 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4 animate-pulse" />
              <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-2 animate-pulse" />
              <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center bg-surface/50 border border-dashed border-border rounded-[3rem] text-text-secondary">
          <Book size={64} className="mb-6 opacity-20" />
          <p className="text-xl font-bold">No materials shared yet.</p>
          <p className="mt-2 text-sm max-w-md text-center">Your tutors will upload documents and PPTs here during or after your sessions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="group bg-surface rounded-3xl border border-border overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-video bg-indigo-50 dark:bg-indigo-500/5 flex items-center justify-center relative">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/10 shadow-lg flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                  {asset.file_type === 'PDF' ? <FileText size={32} /> : <Book size={32} />}
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm">
                  {asset.file_type}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-black text-(--color-text-primary) mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {asset.title}
                </h3>
                <p className="text-sm text-text-secondary line-clamp-2 mb-6 min-h-[40px]">
                  {asset.description || 'No description provided.'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Clock size={14} />
                    {new Date(asset.created_at).toLocaleDateString()}
                  </div>

                  <button
                    onClick={() => openAsset(asset)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <Eye size={14} />
                    View Only
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ---- Shared view-only viewer modal (PDFs/images render inline via Chromium) ----
  const ViewerModal = viewerAsset ? (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 p-4 backdrop-blur-sm sm:p-6">
      <div className="mb-4 flex shrink-0 items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
            <FileText size={18} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-base font-black leading-tight text-white">{viewerAsset.title}</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">View only</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 sm:inline-flex">
            View only
          </span>
          <button
            onClick={closeViewer}
            aria-label="Close viewer"
            className="rounded-lg bg-white/5 p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-red-400"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="relative w-full flex-1 overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
        {(viewerLoading || !viewerUrl) ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/50">
            <Loader2 size={30} className="animate-spin text-indigo-400" />
            <p className="text-xs font-bold uppercase tracking-widest">Loading…</p>
          </div>
        ) : (
          <SecureDocViewer
            url={viewerUrl}
            mimeType={viewerAsset.mime_type}
            fileType={viewerAsset.file_type}
          />
        )}
      </div>
    </div>
  ) : null;

  return (
    <ProtectedClient roles={['student']}>
      {isAppShell ? AppShellView : WebView}
      {ViewerModal}
    </ProtectedClient>
  );
}

export default function StudentVaultPage() {
  // useSearchParams requires a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <VaultContent />
    </Suspense>
  );
}
