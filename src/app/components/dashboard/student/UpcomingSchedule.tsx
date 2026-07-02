'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Loader2 } from 'lucide-react';
import api from '@/app/lib/api';

interface SessionVideoInfo {
  id?: string;
  video_provider?: 'DAILYCO' | 'ZOOM';
  zoom_join_url?: string | null;
  meet_link?: string;
}

interface Session extends SessionVideoInfo {
  id: string;
  subject?: { name: string };
  start_time: string;
  // The booking payload nests the underlying session row(s) here.
  sessions?: SessionVideoInfo[];
}

interface UpcomingScheduleProps {
  sessions: Session[];
  loading: boolean;
  fmtDate: (date: string) => string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

// Resolve the video provider for a session/booking. ZOOM sessions are joined
// externally via `zoom_join_url`; everything else uses the in-app room.
function resolveZoom(session: Session): { isZoom: boolean; zoomUrl: string | null } {
  const sess = session.sessions?.[0] ?? session;
  const provider = sess?.video_provider ?? session.video_provider;
  const zoomUrl = sess?.zoom_join_url ?? session.zoom_join_url ?? null;
  const legacyZoomLink = !!session.meet_link && session.meet_link.includes('zoom.us');
  return {
    isZoom: provider === 'ZOOM' || legacyZoomLink,
    zoomUrl: zoomUrl || (legacyZoomLink ? session.meet_link! : null),
  };
}

import { useRouter } from 'next/navigation';

export const UpcomingSchedule: React.FC<UpcomingScheduleProps> = ({ 
  sessions, 
  loading,
  fmtDate
}) => {
  const router = useRouter();
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinClick = async (e: React.MouseEvent, session: Session) => {
    e.stopPropagation();
    const { isZoom } = resolveZoom(session);

    if (isZoom) {
      try {
        setIsJoining(true);
        // Fetch unique join URL that bypasses registration
        const { data } = await api.get(`/sessions/${session.sessions?.[0]?.id || session.id}/zoom/join`);
        if (data.joinUrl) {
          window.open(data.joinUrl, '_blank', 'noopener,noreferrer');
        }
      } catch (err) {
        console.error("Failed to join Zoom session", err);
        // Fallback to the saved zoom url if available
        const { zoomUrl } = resolveZoom(session);
        if (zoomUrl) window.open(zoomUrl, '_blank', 'noopener,noreferrer');
      } finally {
        setIsJoining(false);
      }
    } else {
      // Daily.co (or default/unset) — join the in-app room.
      router.push(`/session/${session.id}`);
    }
  };

  return (
    <motion.div variants={itemVariants} className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Calendar size={20} className="text-blue-500" /> Upcoming Schedule
        </h2>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-background px-2 py-1 rounded-md border border-border">
          {sessions.length} Other Classes
        </span>
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="py-10 text-center text-blue-300">Loading schedule...</div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <div key={session.id} className="rounded-xl bg-surface border border-border overflow-hidden group transition-all">
              <div 
                onClick={() => setExpandedId(expandedId === session.id ? null : session.id)}
                className="p-4 flex justify-between items-center hover:bg-background cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-lg shadow-sm">📚</div>
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-blue-600 transition-colors">{session.subject?.name || 'Class Session'}</h3>
                    <p className="text-xs text-text-secondary">{fmtDate(session.start_time)}</p>
                  </div>
                </div>
                <ChevronRight className={`text-gray-300 group-hover:text-blue-400 transform transition-all ${expandedId === session.id ? 'rotate-90' : 'group-hover:translate-x-1'}`} size={16} />
              </div>
              
              {/* Expandable Content */}
              {expandedId === session.id && (() => {
                const { isZoom } = resolveZoom(session);
                return (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4 pt-1 flex justify-end border-t border-border bg-background/50"
                  >
                    <button
                      disabled={isJoining}
                      onClick={(e) => handleJoinClick(e, session)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isJoining ? <Loader2 size={16} className="animate-spin" /> : null}
                      {isZoom ? 'Join Zoom' : 'Join Class'}
                    </button>
                  </motion.div>
                );
              })()}
            </div>
          ))
        ) : (
          <div className="py-8 text-center bg-background rounded-2xl border border-dashed border-border">
            <p className="text-sm text-text-secondary italic">No other classes scheduled.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
