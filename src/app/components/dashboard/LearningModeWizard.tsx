"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, BookOpen, Check, Loader2, ChevronRight, Zap } from "lucide-react";
import { toast } from "sonner";

const DAYS = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 7 },
];

const PRESETS = [
  { label: "School Nights", value: "TWO_SESSIONS_WEEK", days: [2, 4], desc: "Tue & Thu evenings" },
  { label: "Weekends", value: "THREE_SESSIONS_WEEK", days: [6, 7], desc: "Sat & Sun" },
  { label: "Custom", value: "CUSTOM", days: [], desc: "Pick your own days" },
];

const TIMES = ["07:00","08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"];

interface Props {
  studentId: string;
  programId: string;
  packageId: string;
  curriculumId?: string;
  onComplete: () => void;
}

export function LearningModeWizard({ studentId, programId, packageId, curriculumId, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [preset, setPreset] = useState<string>("TWO_SESSIONS_WEEK");
  const [days, setDays] = useState<number[]>([2, 4]);
  const [time, setTime] = useState("16:00");
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/subjects").then(r => setSubjects(r.data || [])).catch(() => {});
  }, []);

  const toggleDay = (d: number) => {
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const toggleSubject = (id: string) => {
    setSelectedSubjects(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handlePreset = (p: typeof PRESETS[0]) => {
    setPreset(p.value);
    if (p.value !== "CUSTOM") setDays(p.days);
  };

  const handleFinish = async () => {
    if (days.length === 0) { toast.error("Pick at least one day"); return; }
    if (selectedSubjects.length === 0) { toast.error("Pick at least one subject"); return; }
    setSaving(true);
    try {
      await api.post("/enrollments", {
        student_id: studentId,
        program_id: programId,
        package_id: packageId,
        curriculum_id: curriculumId,
        subject_ids: selectedSubjects,
        schedule_preset: preset,
        schedule_days: days,
        start_time: time,
      });
      toast.success("Learning Mode activated! Sessions will be auto-scheduled weekly.");
      onComplete();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Setup failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    { title: "Your Weekly Rhythm", icon: Calendar },
    { title: "Best Time", icon: Clock },
    { title: "Subjects", icon: BookOpen },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={20} className="text-yellow-300" />
            <span className="text-sm font-bold uppercase tracking-widest text-purple-200">Learning Mode</span>
          </div>
          <h2 className="text-2xl font-black">Set Up Your Weekly Rhythm</h2>
          <p className="text-purple-200 text-sm mt-1">We'll auto-book your sessions every week. No more manual scheduling!</p>

          {/* Progress */}
          <div className="flex gap-2 mt-4">
            {steps.map((s, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= step ? 'bg-white' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 0: Schedule Preset + Days */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">How often do you want to learn?</p>
                <div className="grid grid-cols-3 gap-3">
                  {PRESETS.map(p => (
                    <button
                      key={p.value}
                      onClick={() => handlePreset(p)}
                      className={`p-3 rounded-2xl border-2 text-center transition-all ${preset === p.value ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-border hover:border-purple-300'}`}
                    >
                      <p className="text-sm font-bold text-foreground">{p.label}</p>
                      <p className="text-[10px] text-text-secondary mt-0.5">{p.desc}</p>
                    </button>
                  ))}
                </div>

                {preset === "CUSTOM" && (
                  <div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Pick your days:</p>
                    <div className="flex gap-2 flex-wrap">
                      {DAYS.map(d => (
                        <button
                          key={d.value}
                          onClick={() => toggleDay(d.value)}
                          className={`w-12 h-12 rounded-xl text-sm font-bold border-2 transition-all ${days.includes(d.value) ? 'bg-purple-600 border-purple-600 text-white' : 'border-border text-foreground hover:border-purple-300'}`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {preset !== "CUSTOM" && (
                  <div className="flex gap-2 flex-wrap">
                    {DAYS.map(d => (
                      <div
                        key={d.value}
                        className={`w-12 h-12 rounded-xl text-sm font-bold border-2 flex items-center justify-center ${days.includes(d.value) ? 'bg-purple-600 border-purple-600 text-white' : 'border-border text-text-secondary'}`}
                      >
                        {d.label}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 1: Time */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">What time works best?</p>
                <div className="grid grid-cols-4 gap-2">
                  {TIMES.map(t => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={`py-2 rounded-xl text-sm font-bold border-2 transition-all ${time === t ? 'bg-purple-600 border-purple-600 text-white' : 'border-border text-foreground hover:border-purple-300'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Subjects */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Which subjects do you want to study?</p>
                <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                  {subjects.map(s => (
                    <button
                      key={s.id}
                      onClick={() => toggleSubject(s.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-semibold transition-all text-left ${selectedSubjects.includes(s.id) ? 'bg-purple-600 border-purple-600 text-white' : 'border-border text-foreground hover:border-purple-300'}`}
                    >
                      {selectedSubjects.includes(s.id) && <Check size={14} />}
                      {s.name}
                    </button>
                  ))}
                  {subjects.length === 0 && <p className="text-sm text-text-secondary col-span-2">Loading subjects...</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-4 border-t border-border">
            <button
              onClick={() => step > 0 ? setStep(s => s - 1) : undefined}
              className={`text-sm font-semibold text-slate-500 hover:text-foreground transition-colors ${step === 0 ? 'invisible' : ''}`}
            >
              Back
            </button>
            {step < 2 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={step === 0 && days.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-all"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                Activate Learning Mode
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
