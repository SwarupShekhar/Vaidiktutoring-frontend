'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { api } from '@/app/lib/api';
import { useAuthContext } from '@/app/context/AuthContext';

// Where a notification takes you when clicked (null = just mark read, no nav).
function routeFor(type?: string): string | null {
  const t = type || '';
  if (t === 'reschedule_requested') return '/admin/reschedule-requests';
  if (t.startsWith('reschedule_')) return '/students/schedule';
  if (t === 'session:note_added') return '/students/notes';
  return null;
}

type Notif = {
  id: string;
  message?: string;
  type?: string;
  read?: boolean;
  is_read?: boolean;
  created_at?: string;
  payload?: { message?: string };
};

const isRead = (n: Notif) => n.read ?? n.is_read ?? false;
const msgOf = (n: Notif) => n.message || n.payload?.message || 'New notification';

/**
 * Notification bell for the desktop app shell, every role sees it. Reuses the
 * existing /notifications API (poll + mark read). App-dark styled dropdown.
 */
export default function NotificationBell() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [items, setItems] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = items.filter((n) => !isRead(n)).length;
  const bellLabel = unread > 0 ? `Notifications, ${unread} unread` : 'Notifications, no new';

  useEffect(() => {
    if (!user) return;
    let stop = false;
    const fetchIt = async () => {
      try {
        const res = await api.get('/notifications');
        const data: Notif[] = Array.isArray(res.data) ? res.data : res.data?.data || [];
        data.sort(
          (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime(),
        );
        if (!stop) setItems(data);
      } catch {
        /* silent background poll */
      }
    };
    fetchIt();
    const t = setInterval(fetchIt, 30000);
    return () => {
      stop = true;
      clearInterval(t);
    };
  }, [user]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const markRead = async (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true, is_read: true } : n)));
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch {
      /* optimistic */
    }
  };

  const markAll = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true, is_read: true })));
    try {
      await api.post('/notifications/mark-all-read');
    } catch {
      /* optimistic */
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={bellLabel}
        aria-haspopup="true"
        aria-expanded={open}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/60 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]"
      >
        <Bell size={17} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-[200] w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#15131f] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-sm font-bold text-white">Notifications</span>
            {unread > 0 && (
              <button
                onClick={markAll}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-300 hover:text-indigo-200"
              >
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-white/40">You're all caught up.</p>
            ) : (
              items.slice(0, 30).map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    markRead(n.id);
                    setOpen(false);
                    const to = routeFor(n.type);
                    if (to) router.push(to);
                  }}
                  className={`flex w-full items-start gap-2.5 border-b border-white/5 px-4 py-3 text-left transition-colors hover:bg-white/[0.04] ${
                    isRead(n) ? 'opacity-60' : ''
                  }`}
                >
                  {!isRead(n) && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />}
                  <span className={isRead(n) ? 'flex-1' : 'flex-1 pl-0'}>
                    <span className="block text-sm text-white/85">{msgOf(n)}</span>
                    {n.created_at && (
                      <span className="mt-0.5 block text-[11px] text-white/55">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </span>
                    )}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
