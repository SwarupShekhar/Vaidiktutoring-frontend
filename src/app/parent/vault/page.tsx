'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Shield, FileText, Loader2, Baby, Eye, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import ProtectedClient from '@/app/components/ProtectedClient';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { vaultApi, VaultAsset } from '@/app/lib/vault';
import { useParentDashboard } from '@/app/Hooks/useParentDashboard';
import {
  AppPage,
  AppPageItem,
  AppPageHeader,
  AppCard,
  AppEmptyState,
  AppPillButton,
  AppSkeletonCard,
  SecureDocViewer,
} from '@/app/components/app-shell/ui';

export default function ParentVaultPage() {
  return (
    <ProtectedClient roles={['parent']}>
      <ErrorBoundary>
        <Suspense fallback={null}>
          <ParentVault />
        </Suspense>
      </ErrorBoundary>
    </ProtectedClient>
  );
}

const childLabel = (s: { first_name?: string; last_name?: string }) =>
  `${s.first_name ?? ''} ${s.last_name ?? ''}`.trim() || 'Child';

function ParentVault() {
  const router = useRouter();
  const { students, loadingStudentList } = useParentDashboard();

  const preChild = useSearchParams().get('child');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  useEffect(() => {
    if (!selectedChildId && students.length > 0) {
      const initial = preChild && students.some((s) => s.id === preChild) ? preChild : students[0].id;
      setSelectedChildId(initial);
    }
  }, [students, selectedChildId, preChild]);

  const selectedChild = useMemo(
    () => students.find((s) => s.id === selectedChildId) ?? null,
    [students, selectedChildId],
  );

  const [assets, setAssets] = useState<VaultAsset[]>([]);
  const [loading, setLoading] = useState(false);

  // Read-only viewer (streams bytes through the backend, scoped to the child).
  const [viewerAsset, setViewerAsset] = useState<VaultAsset | null>(null);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerLoading, setViewerLoading] = useState(false);

  useEffect(() => {
    if (!selectedChildId) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await vaultApi.getAssets({ studentId: selectedChildId });
        if (!cancelled) setAssets(Array.isArray(data) ? data : data.assets || []);
      } catch (err) {
        console.error('Failed to load child vault', err);
        if (!cancelled) toast.error("Could not load your child's materials.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedChildId]);

  const openAsset = async (asset: VaultAsset) => {
    if (!selectedChildId) return;
    setViewerAsset(asset);
    setViewerUrl((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return null;
    });
    setViewerLoading(true);
    try {
      const blob = await vaultApi.getAssetBlob(asset.id, selectedChildId);
      setViewerUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Failed to open asset', err);
      toast.error('Could not open this material.');
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

  useEffect(() => {
    if (!viewerAsset) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeViewer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewerAsset]);

  return (
    <AppPage>
      <AppPageItem>
        <AppPageHeader
          icon={Shield}
          accent="indigo"
          title="Study Vault"
          subtitle={
            selectedChild
              ? `Materials shared with ${childLabel(selectedChild)}.`
              : "Your child's study materials."
          }
        />
      </AppPageItem>

      {/* Child selector */}
      {students.length > 1 && (
        <AppPageItem>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/40">
              <Baby size={14} /> Viewing
            </span>
            {students.map((s) => {
              const active = s.id === selectedChildId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedChildId(s.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${
                    active
                      ? 'bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/40'
                      : 'bg-white/5 text-white/55 ring-1 ring-white/10 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  {childLabel(s)}
                </button>
              );
            })}
          </div>
        </AppPageItem>
      )}

      {/* Assets */}
      <AppPageItem>
        {loading || loadingStudentList ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AppSkeletonCard />
            <AppSkeletonCard />
            <AppSkeletonCard />
          </div>
        ) : students.length === 0 ? (
          <AppEmptyState
            icon={Baby}
            accent="indigo"
            title="No children yet"
            description="Add your first child to start viewing their study materials here."
            action={
              <AppPillButton accent="indigo" variant="solid" onClick={() => router.push('/onboarding/student')}>
                <UserPlus size={14} /> Add your first child
              </AppPillButton>
            }
          />
        ) : assets.length === 0 ? (
          <AppEmptyState
            icon={FileText}
            accent="indigo"
            title="No materials yet"
            description="Materials will appear here after your child's next session."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => (
              <AppCard key={asset.id} accent="indigo" onClick={() => openAsset(asset)}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-white">{asset.title}</p>
                    {asset.description && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-white/45">{asset.description}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                  <Eye size={13} /> View
                </div>
              </AppCard>
            ))}
          </div>
        )}
      </AppPageItem>

      {/* Read-only viewer modal */}
      {viewerAsset && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/80 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-white/10 bg-[#0a0a0f] px-5 py-3">
            <p className="truncate text-sm font-bold text-white">{viewerAsset.title}</p>
            <button
              onClick={closeViewer}
              className="rounded-lg px-3 py-1.5 text-xs font-bold text-white/70 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
            >
              Close (Esc)
            </button>
          </div>
          <div className="relative min-h-0 flex-1">
            {viewerLoading || !viewerUrl ? (
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
      )}
    </AppPage>
  );
}
