'use client';

import { useState, useEffect } from 'react';
import { api } from '@/app/lib/api';
import { Send, MessageSquare, Loader2, User, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

type TutorOption = { id: string; name: string };

export default function TutorCommunication({ tutorName, currentUserId }: { tutorName: string | null, currentUserId: string | undefined }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [tutors, setTutors] = useState<TutorOption[]>([]);
  const [selectedTutorId, setSelectedTutorId] = useState<string>('');

  // Load the student's assigned tutors once, so a multi-tutor student can pick.
  useEffect(() => {
    api.get('/messages/my-tutors')
      .then((res) => {
        const list: TutorOption[] = res.data ?? [];
        setTutors(list);
        setSelectedTutorId((prev) => prev || list[0]?.id || '');
      })
      .catch((err) => console.error('Failed to fetch tutors:', err));
  }, [currentUserId]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/messages', {
        params: selectedTutorId ? { tutorId: selectedTutorId } : {},
      });
      setMessages(res.data);

      // Mark as read
      if (res.data.some((m: any) => !m.is_read && m.sender_id !== currentUserId)) {
        await api.post('/messages/read/tutor', selectedTutorId ? { tutorId: selectedTutorId } : {});
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000); // 30s interval
    return () => clearInterval(interval);
    // Re-fetch when the selected tutor changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, selectedTutorId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      await api.post('/messages/send', {
        text: message,
        ...(selectedTutorId && { tutorId: selectedTutorId }),
      });
      setMessage('');
      toast.success('Message sent to your tutor!');
      fetchMessages();
    } catch (e) {
      toast.error('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const selectedTutorName =
    tutors.find((t) => t.id === selectedTutorId)?.name || tutorName || 'Your Assigned Tutor';

  return (
    <div id="tutor-chat-section" className="bg-surface rounded-3xl border border-border shadow-sm flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Message your Tutor</h3>
            <p className="text-xs text-muted-foreground">{selectedTutorName}</p>
          </div>
        </div>

        {tutors.length > 1 && (
          <select
            value={selectedTutorId}
            onChange={(e) => setSelectedTutorId(e.target.value)}
            className="bg-surface border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            {tutors.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <MessageSquare size={20} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground mt-1">Have a question? Ask your tutor below.</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const fromTutor = msg.sender_id !== currentUserId;

            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${fromTutor ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-3 ${
                  fromTutor 
                    ? 'bg-muted text-foreground rounded-tl-none' 
                    : 'bg-primary text-white rounded-tr-none shadow-md shadow-primary/10'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 text-[10px] ${fromTutor ? 'text-muted-foreground' : 'text-white/70'}`}>
                    <Clock size={10} />
                    {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Input area */}
      <div className="p-4 bg-muted/30 border-t border-border">
        <form onSubmit={handleSend} className="relative">
          <textarea
            id="tutor-chat-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question..."
            rows={2}
            className="w-full bg-surface border border-border rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!message.trim() || sending}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Your tutor will be notified via email and respond as soon as possible.
        </p>
      </div>
    </div>
  );
}
