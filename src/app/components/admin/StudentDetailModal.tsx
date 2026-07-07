'use client';

import React, { useEffect, useState } from 'react';
import api from '@/app/lib/api';
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  GraduationCap, 
  School, 
  Calendar, 
  X,
  Loader2,
  Clock,
  Target,
  UserCheck,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';
import { useFocusTrap } from '@/app/Hooks/useFocusTrap';

interface StudentDetailModalProps {
  studentId: string | null;
  onClose: () => void;
}

export default function StudentDetailModal({ studentId, onClose }: StudentDetailModalProps) {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      setLoading(true);
      api.get(`/admin/students/${studentId}`)
        .then(res => setStudent(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [studentId]);

  const panelRef = useFocusTrap<HTMLDivElement>(!!studentId, onClose);

  if (!studentId) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-detail-modal-title"
        tabIndex={-1}
        className="bg-surface rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-border"
      >
        {/* Header */}
        <div className="p-8 border-b border-border flex justify-between items-start bg-muted/30">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-black">
              {student?.first_name?.[0] || 'S'}
            </div>
            <div>
              <h2 id="student-detail-modal-title" className="text-2xl font-black text-foreground tracking-tight">
                {student ? `${student.first_name} ${student.last_name || ''}` : 'Loading...'}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20">
                  {student?.enrollment_status || 'Unknown'}
                </span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1">
                  <Clock size={10} /> Member since {student?.created_at ? format(new Date(student.created_at), 'MMM yyyy') : '...'}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-2xl transition-all">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="font-bold text-sm uppercase tracking-widest">Compiling Student Dossier...</p>
            </div>
          ) : (
            <>
              {/* Vital Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Contact Intelligence</h3>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 bg-muted rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</p>
                      <p className="text-sm font-bold text-foreground">{student.users_students_user_idTousers?.email || 'Not available'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 bg-muted rounded-xl group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-all">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Phone Number</p>
                      <p className="text-sm font-bold text-foreground">{student.users_students_user_idTousers?.phone || 'Not available'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Academic Context</h3>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 bg-muted rounded-xl group-hover:bg-indigo-500/10 group-hover:text-indigo-500 transition-all">
                      <GraduationCap size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Grade Level</p>
                      <p className="text-sm font-bold text-foreground">Grade {student.grade || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 bg-muted rounded-xl group-hover:bg-violet-500/10 group-hover:text-violet-500 transition-all">
                      <School size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Institution</p>
                      <p className="text-sm font-bold text-foreground">{student.school || 'Private Student'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Acquisition & Status</h3>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 bg-muted rounded-xl group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-all">
                      <Target size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Lead Source</p>
                      <p className="text-sm font-bold text-foreground">{student.users_students_user_idTousers?.lead_source || 'Organic / Unknown'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 bg-muted rounded-xl group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-all">
                      <Activity size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Onboarding Status</p>
                      <p className="text-sm font-bold text-foreground capitalize">{(student.users_students_user_idTousers?.onboarding_status || 'not_started').replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pedagogy Profile */}
              <div className="bg-muted/30 rounded-3xl p-6 border border-border">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">Pedagogical Profile</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen size={14} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Curriculum</span>
                    </div>
                    <p className="text-sm font-bold text-foreground bg-surface px-3 py-2 rounded-xl border border-border inline-block">
                      {student.curricula?.name || 'Standard Curriculum'}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <UserCheck size={14} className="text-indigo-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Assigned Tutor</span>
                    </div>
                    {student.trial_tutor ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 text-xs font-black">
                          {student.trial_tutor.users.first_name[0]}
                        </div>
                        <p className="text-sm font-bold text-foreground">
                          {student.trial_tutor.users.first_name} {student.trial_tutor.users.last_name}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">None allocated</p>
                    )}
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Primary Interests</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {student.interests && Array.isArray(student.interests) ? student.interests.map((it: string, idx: number) => (
                        <span key={idx} className="text-[10px] font-bold px-3 py-1 bg-surface border border-border rounded-full text-foreground">
                          {it}
                        </span>
                      )) : <p className="text-xs text-muted-foreground italic">No interests logged</p>}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target size={14} className="text-rose-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Challenge Areas</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {student.struggle_areas && Array.isArray(student.struggle_areas) ? student.struggle_areas.map((sa: string, idx: number) => (
                        <span key={idx} className="text-[10px] font-bold px-3 py-1 bg-rose-500/5 border border-rose-500/20 rounded-full text-rose-600">
                          {sa}
                        </span>
                      )) : <p className="text-xs text-muted-foreground italic">No challenges logged</p>}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/20 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/10"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
