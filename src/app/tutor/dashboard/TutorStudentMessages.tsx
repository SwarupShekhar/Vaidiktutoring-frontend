'use client';

import { useState, useEffect } from 'react';
import { api } from '@/app/lib/api';
import { Send, MessageSquare, Loader2, User, Clock, Search, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export default function TutorStudentMessages({ currentUserId }: { currentUserId: string | undefined }) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      const convos = res.data.map((c: any) => ({
        studentId: c.student_id,
        studentName: c.student ? `${c.student.first_name} ${c.student.last_name || ''}`.trim() : null,
        studentGrade: c.student?.grade,
        lastMessage: {
          text: c.text,
          created_at: c.created_at
        },
        unreadCount: c.unreadCount
      }));
      setConversations(convos);
    } catch (e) {
      console.error('Failed to fetch conversations', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (studentId: string) => {
    setMessagesLoading(true);
    try {
      const res = await api.get(`/messages?studentId=${studentId}`);
      setMessages(res.data);
      // Mark as read
      if (res.data.some((m: any) => !m.is_read && m.sender_id !== currentUserId)) {
        await api.post(`/messages/read/${studentId}`);
        fetchConversations();
      }
    } catch (e) {
      console.error('Failed to fetch messages', e);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(() => {
      fetchConversations();
      if (selectedStudent) fetchMessages(selectedStudent.studentId);
    }, 30000); // Increased to 30s
    return () => clearInterval(interval);
  }, [selectedStudent, currentUserId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedStudent || sending) return;

    setSending(true);
    try {
      await api.post('/messages/send', { 
        text: message, 
        studentId: selectedStudent.studentId 
      });
      setMessage('');
      toast.success('Reply sent!');
      fetchMessages(selectedStudent.studentId);
    } catch (e) {
      toast.error('Failed to send reply.');
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.studentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-surface rounded-4xl border border-border shadow-2xl overflow-hidden flex h-[600px]">
      {/* Sidebar: Student List */}
      <div className="w-1/3 border-r border-border flex flex-col bg-muted/10">
        <div className="p-6 border-b border-border">
          <h3 className="font-black text-foreground uppercase tracking-widest text-sm mb-4">Student Queries</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Filter students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground text-xs italic">No messages found.</div>
          ) : (
            filteredConversations.map((convo) => (
              <button
                key={convo.studentId}
                onClick={() => {
                  setSelectedStudent(convo);
                  fetchMessages(convo.studentId);
                }}
                className={`w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-all border-b border-border/50 ${
                  selectedStudent?.studentId === convo.studentId ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    selectedStudent?.studentId === convo.studentId ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {convo.studentName?.[0] || convo.studentId[0].toUpperCase()}
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="font-bold text-sm text-foreground truncate">
                      {convo.studentName || `Student ${convo.studentId.slice(0, 8)}`}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-muted-foreground truncate">{convo.lastMessage.text}</p>
                      {convo.studentGrade && (
                        <span className="text-[8px] px-1 bg-muted rounded border border-border text-muted-foreground font-black">GR {convo.studentGrade}</span>
                      )}
                    </div>
                  </div>
                </div>
                {convo.unreadCount > 0 && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center animate-pulse">
                    <span className="text-[10px] text-white font-black">{convo.unreadCount}</span>
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main: Chat View */}
      <div className="flex-1 flex flex-col bg-surface relative">
        {!selectedStudent ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
              <MessageSquare size={32} />
            </div>
            <h4 className="text-lg font-bold text-foreground">Select a Student</h4>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">Select a student from the left to view their queries and provide academic guidance.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {selectedStudent.studentName?.[0] || selectedStudent.studentId[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="font-black text-foreground text-sm uppercase tracking-widest">
                    {selectedStudent.studentName || 'Student Dossier'}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                    {selectedStudent.studentGrade && (
                      <span className="text-[10px] text-primary font-black">GRADE {selectedStudent.studentGrade}</span>
                    )}
                    {messages[0]?.student?.interests?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter">Interests:</span>
                        <span className="text-[10px] text-emerald-600 font-bold">{messages[0].student.interests.slice(0, 2).join(', ')}</span>
                      </div>
                    )}
                    {messages[0]?.student?.struggle_areas?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter">Challenges:</span>
                        <span className="text-[10px] text-rose-600 font-bold">{messages[0].student.struggle_areas.slice(0, 2).join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {messagesLoading ? (
                <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === currentUserId;
                  return (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] space-y-1`}>
                        <div className={`rounded-2xl p-4 ${
                          isMe 
                            ? 'bg-slate-900 text-white rounded-tr-none shadow-xl shadow-slate-900/10' 
                            : 'bg-muted text-foreground rounded-tl-none'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                        <p className={`text-[9px] font-bold text-muted-foreground uppercase tracking-widest ${isMe ? 'text-right' : 'text-left'}`}>
                          {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-muted/30 border-t border-border">
              <form onSubmit={handleSend} className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your academic response..."
                  rows={2}
                  className="w-full bg-surface border border-border rounded-2xl py-4 pl-5 pr-14 text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none shadow-sm"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
                >
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
