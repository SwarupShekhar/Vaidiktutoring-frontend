'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '@/app/lib/api';
import { LifeBuoy, CheckCircle2, Clock, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  message: string;
  context: any;
  status: 'open' | 'in_progress' | 'resolved';
  admin_note: string | null;
  created_at: string;
  users: { first_name: string | null; last_name: string | null; email: string; role: string };
}

const STATUS_CONFIG = {
  open:        { label: 'Open',        color: 'bg-red-100 text-red-700 border-red-200',    icon: AlertCircle },
  in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  resolved:    { label: 'Resolved',    color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 },
};

export default function SupportTicketsSection() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/support/tickets', { params: filter ? { status: filter } : {} });
      setTickets(res.data || []);
    } catch {
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  // Listen for real-time new ticket events
  useEffect(() => {
    const handler = () => { fetchTickets(); };
    window.addEventListener('support:new_ticket', handler);
    return () => window.removeEventListener('support:new_ticket', handler);
  }, [fetchTickets]);

  const updateTicket = async (id: string, status: string) => {
    setSaving(id);
    try {
      await api.patch(`/support/tickets/${id}`, { status, admin_note: noteInputs[id] ?? undefined });
      toast.success('Ticket updated');
      fetchTickets();
    } catch {
      toast.error('Failed to update ticket');
    } finally {
      setSaving(null);
    }
  };

  const openCount = tickets.filter(t => t.status === 'open').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LifeBuoy className="text-indigo-500" size={20} />
          <h2 className="text-xl font-bold text-foreground">Support Tickets</h2>
          {openCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-black rounded-full">
              {openCount} open
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {(['', 'open', 'in_progress', 'resolved'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                filter === s
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-border text-text-secondary hover:border-indigo-300'
              }`}
            >
              {s === '' ? 'All' : s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          <button onClick={fetchTickets} className="p-2 hover:bg-background rounded-xl text-text-secondary transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-background rounded-2xl animate-pulse border border-border" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="py-12 text-center text-text-secondary">
          <LifeBuoy size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No tickets {filter ? `with status "${filter}"` : 'yet'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map(ticket => {
            const cfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
            const StatusIcon = cfg.icon;
            const isExpanded = expanded === ticket.id;
            const userName = `${ticket.users.first_name || ''} ${ticket.users.last_name || ''}`.trim() || ticket.users.email;

            return (
              <div key={ticket.id} className="border border-border rounded-2xl bg-background overflow-hidden">
                {/* Header row */}
                <button
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-surface transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : ticket.id)}
                >
                  <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 shrink-0 ${cfg.color}`}>
                    <StatusIcon size={11} />
                    {cfg.label}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{userName}
                      <span className="ml-2 text-xs font-normal text-text-secondary capitalize">({ticket.users.role})</span>
                    </p>
                    <p className="text-xs text-text-secondary truncate mt-0.5">{ticket.message}</p>
                  </div>
                  <div className="text-xs text-text-secondary shrink-0">
                    {new Date(ticket.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-text-secondary shrink-0" /> : <ChevronDown size={16} className="text-text-secondary shrink-0" />}
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border space-y-4 pt-4">
                    <div>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Message</p>
                      <p className="text-sm text-foreground bg-surface rounded-xl p-3">{ticket.message}</p>
                    </div>

                    {ticket.context && Object.keys(ticket.context).length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Context</p>
                        <pre className="text-xs bg-surface rounded-xl p-3 overflow-auto text-text-secondary">
                          {JSON.stringify(ticket.context, null, 2)}
                        </pre>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Admin Note (optional)</p>
                      <textarea
                        value={noteInputs[ticket.id] ?? (ticket.admin_note || '')}
                        onChange={e => setNoteInputs(n => ({ ...n, [ticket.id]: e.target.value }))}
                        placeholder="Internal note for this ticket..."
                        className="w-full bg-background border border-border rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {(['open', 'in_progress', 'resolved'] as const).map(s => (
                        <button
                          key={s}
                          disabled={saving === ticket.id || ticket.status === s}
                          onClick={() => updateTicket(ticket.id, s)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-50 ${
                            ticket.status === s
                              ? STATUS_CONFIG[s].color + ' cursor-default'
                              : 'border-border text-text-secondary hover:border-indigo-400'
                          }`}
                        >
                          {saving === ticket.id ? '...' : s === 'in_progress' ? 'Mark In Progress' : `Mark ${s.charAt(0).toUpperCase() + s.slice(1)}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
