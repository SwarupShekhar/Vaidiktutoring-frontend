'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle, FileWarning } from 'lucide-react';

type Status = 'loading' | 'ready' | 'error' | 'unsupported';

/**
 * View-only document viewer for vault materials.
 *
 * PDFs are rendered with pdf.js onto <canvas> elements — there is NO native
 * browser PDF toolbar, so there are no download / print / "save as" affordances.
 * Right-click is suppressed and images are marked non-draggable. This is a strong
 * deterrent against casual saving; it is NOT DRM (a determined user can still
 * screenshot or pull the short-lived signed URL from network traffic).
 *
 * Non-PDF / non-image types (e.g. PPT) can't be canvas-rendered safely, so they
 * show a notice instead of exposing a downloadable link.
 */
export function SecureDocViewer({
  url,
  mimeType,
  fileType,
}: {
  url: string;
  mimeType?: string;
  fileType?: string;
}) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>('loading');

  const ft = (fileType || '').toUpperCase();
  const mt = (mimeType || '').toLowerCase();
  const isPdf = mt.includes('pdf') || ft === 'PDF';
  const isImage =
    mt.startsWith('image/') || ['PNG', 'JPG', 'JPEG', 'WEBP', 'GIF', 'IMAGE'].includes(ft);

  const blockContext = (e: React.MouseEvent | Event) => e.preventDefault();

  useEffect(() => {
    let cancelled = false;

    if (!url) return;
    if (isImage) {
      setStatus('ready');
      return;
    }
    if (!isPdf) {
      setStatus('unsupported');
      return;
    }

    (async () => {
      try {
        setStatus('loading');
        // Fetch the bytes ourselves (matches the in-session flow) then hand them
        // to pdf.js — avoids relying on pdf.js range requests against Azure.
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
        const buf = new Uint8Array(await resp.arrayBuffer());
        if (cancelled) return;

        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        if (cancelled) return;

        const host = canvasHostRef.current;
        if (!host) return;
        host.innerHTML = '';

        const dpr = window.devicePixelRatio || 1;
        for (let n = 1; n <= pdf.numPages; n++) {
          const page = await pdf.getPage(n);
          if (cancelled) return;
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;
          canvas.width = Math.floor(viewport.width * dpr);
          canvas.height = Math.floor(viewport.height * dpr);
          canvas.style.width = '100%';
          canvas.style.maxWidth = `${Math.floor(viewport.width)}px`;
          canvas.style.height = 'auto';
          canvas.style.display = 'block';
          canvas.style.margin = '0 auto 16px';
          canvas.style.borderRadius = '6px';
          ctx.scale(dpr, dpr);

          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          if (cancelled) return;
          host.appendChild(canvas);
        }

        if (!cancelled) setStatus('ready');
      } catch (err) {
        console.error('[SecureDocViewer] render failed', err);
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url, isPdf, isImage]);

  return (
    <div
      onContextMenu={blockContext}
      className="h-full w-full overflow-y-auto bg-slate-900 px-3 py-4 sm:px-6"
      style={{ userSelect: 'none' }}
    >
      {status === 'loading' && (
        <div className="flex h-full min-h-[40vh] flex-col items-center justify-center gap-3 text-white/50">
          <Loader2 size={30} className="animate-spin text-indigo-400" />
          <p className="text-xs font-bold uppercase tracking-widest">Loading…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex h-full min-h-[40vh] flex-col items-center justify-center gap-3 text-rose-300">
          <AlertCircle size={30} />
          <p className="text-sm font-semibold">Couldn’t display this document.</p>
          <p className="text-xs text-white/40">Try again, or ask your tutor to re-share it.</p>
        </div>
      )}

      {status === 'unsupported' && (
        <div className="flex h-full min-h-[40vh] flex-col items-center justify-center gap-3 text-white/55">
          <FileWarning size={30} className="text-amber-300" />
          <p className="text-sm font-semibold">Preview not available for this file type.</p>
          <p className="max-w-sm text-center text-xs text-white/40">
            Your tutor can open it for you during a live session.
          </p>
        </div>
      )}

      {isImage && status === 'ready' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt="Material preview"
          draggable={false}
          onContextMenu={blockContext}
          className="mx-auto block max-w-full rounded-lg"
        />
      )}

      {/* pdf.js canvases mount here */}
      <div ref={canvasHostRef} className={isImage ? 'hidden' : ''} />
    </div>
  );
}
