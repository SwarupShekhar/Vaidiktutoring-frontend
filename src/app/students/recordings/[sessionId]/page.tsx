'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedClient from '@/app/components/ProtectedClient';
import { api } from '@/app/lib/api';
import { Play, Image as ImageIcon, ArrowLeft, Loader2, AlertCircle, Camera } from 'lucide-react';

interface Recording {
  id: string;
  created_at: string;
  duration_seconds: number | null;
  file_size_bytes: number | null;
}

function SessionRecordingContent() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [loadingRecording, setLoadingRecording] = useState(false);
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    api.get(`/sessions/${sessionId}/recordings`)
      .then(res => setRecordings(res.data || []))
      .catch(() => setError('Could not load recordings for this session.'));

    // Try to load whiteboard snapshot
    setLoadingSnapshot(true);
    api.get(`/sessions/${sessionId}/whiteboard-snapshot/stream`)
      .then(res => setSnapshotUrl(res.data?.snapshotUrl || null))
      .catch(() => {}) // Snapshot may not exist
      .finally(() => setLoadingSnapshot(false));
  }, [sessionId]);

  const handleWatch = async (recordingId: string) => {
    setLoadingRecording(true);
    setError(null);
    try {
      const res = await api.get(`/sessions/${sessionId}/recordings/${recordingId}/stream`);
      const url = res.data?.streamUrl || res.data?.url || res.data?.sasUrl;
      if (!url) throw new Error('No stream URL returned');
      setStreamUrl(url);
    } catch {
      setError('Could not load recording. Please try again.');
    } finally {
      setLoadingRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-2xl font-bold text-foreground">Session Recordings</h1>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">
            <AlertCircle size={18} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Video player */}
        {streamUrl && (
          <div className="rounded-3xl overflow-hidden border border-border shadow-lg bg-black">
            <video
              src={streamUrl}
              controls
              autoPlay
              className="w-full max-h-[500px]"
            >
              Your browser does not support video playback.
            </video>
          </div>
        )}

        {/* Recording list */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Play size={18} className="text-purple-500" /> Recording{recordings.length !== 1 ? 's' : ''}
          </h2>

          {recordings.length === 0 && !error && (
            <div className="p-6 rounded-2xl bg-surface border border-border text-center text-text-secondary text-sm">
              No recordings available for this session yet.
            </div>
          )}

          {recordings.map((rec) => (
            <div
              key={rec.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border shadow-sm"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {rec.created_at
                    ? new Date(rec.created_at).toLocaleString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric',
                        hour: 'numeric', minute: '2-digit',
                      })
                    : 'Recording'}
                </p>
                {rec.duration_seconds && (
                  <p className="text-xs text-text-secondary">
                    Duration: {Math.floor(rec.duration_seconds / 60)}m {rec.duration_seconds % 60}s
                  </p>
                )}
              </div>
              <button
                onClick={() => handleWatch(rec.id)}
                disabled={loadingRecording}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
              >
                {loadingRecording ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                Watch
              </button>
            </div>
          ))}
        </section>

        {/* Whiteboard snapshot */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Camera size={18} className="text-blue-500" /> Whiteboard Snapshot
          </h2>

          {loadingSnapshot && (
            <div className="flex items-center gap-2 text-sm text-text-secondary p-4">
              <Loader2 size={16} className="animate-spin" /> Loading snapshot...
            </div>
          )}

          {!loadingSnapshot && snapshotUrl && (
            <div className="rounded-3xl overflow-hidden border border-border shadow-sm bg-white">
              <img
                src={snapshotUrl}
                alt="Whiteboard snapshot"
                className="w-full object-contain max-h-[500px]"
              />
            </div>
          )}

          {!loadingSnapshot && !snapshotUrl && (
            <div className="p-6 rounded-2xl bg-surface border border-border text-center text-text-secondary text-sm flex items-center justify-center gap-2">
              <ImageIcon size={16} /> No whiteboard snapshot for this session.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function SessionRecordingPage() {
  return (
    <ProtectedClient roles={['student', 'parent', 'admin']}>
      <SessionRecordingContent />
    </ProtectedClient>
  );
}
