'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  Star,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

// --- Types ---
interface Tutor {
  id: string;
  users: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface Subject {
  id: string;
  name: string;
}

interface EnrollmentData {
  schedule_preset: string;
  schedule_days: string[];
  start_time: string;
  tutor_id: string;
  curriculum_id: string;
  subject_ids: string[];
}

// --- Steps ---
const steps = [
  { id: 'preset', title: 'Plan', description: 'Choose your intensity' },
  { id: 'schedule', title: 'Schedule', description: 'Pick your slots' },
  { id: 'tutor', title: 'Personalize', description: 'Choose tutor & subjects' },
];

export default function EnrollmentWizard() {
  const { studentId } = useParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [student, setStudent] = useState<any>(null);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  // Form State
  const [formData, setFormData] = useState<EnrollmentData>({
    schedule_preset: 'TWO_SESSIONS_WEEK',
    schedule_days: [],
    start_time: '16:00',
    tutor_id: '',
    curriculum_id: '',
    subject_ids: [],
  });

  useEffect(() => {
    fetchInitialData();
  }, [studentId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch student to get program/curriculum context
      const studentRes = await fetch(`/api/students/${studentId}`);
      const studentData = await studentRes.json();
      setStudent(studentData);
      
      // Fetch tutors for recommendations
      const tutorRes = await fetch(`/api/enrollments/tutor-recommendations/${studentId}`);
      const tutorData = await tutorRes.json();
      setTutors(tutorData);
      
      // Fetch subjects
      const subjectRes = await fetch('/api/catalog/subjects');
      const subjectData = await subjectRes.json();
      setSubjects(subjectData);

      // Pre-fill some data
      setFormData(prev => ({
        ...prev,
        curriculum_id: studentData.curriculum_preference || '',
        tutor_id: tutorData[0]?.id || '',
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load required data');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      
      const dayMap: Record<string, number> = {
        'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 
        'Friday': 5, 'Saturday': 6, 'Sunday': 0
      };

      const payload = {
        student_id: studentId,
        tutor_id: formData.tutor_id,
        program_id: student.program_id,
        package_id: student.bookings?.[0]?.package_id || 'DEFAULT_PACKAGE',
        curriculum_id: formData.curriculum_id,
        subject_ids: formData.subject_ids,
        schedule_preset: formData.schedule_preset,
        schedule_days: formData.schedule_days.map(d => dayMap[d]),
        start_time: formData.start_time,
        status: 'active'
      };

      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to create enrollment');
      }

      toast.success('Congratulations! Your schedule has been created.');
      router.push(`/parent/dashboard`);
    } catch (error: any) {
      console.error('Enrollment error:', error);
      toast.error(error.message || 'Something went wrong during enrollment');
    } finally {
      setLoading(false);
    }
  };

  if (!student && loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#000926] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-sapphire/10 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-deep-navy dark:text-white mb-4"
          >
            Welcome to <span className="text-gradient-primary">Learning Mode</span>
          </motion.h1>
          <p className="text-lg text-text-secondary dark:text-slate-400">
            Let's set up {student?.first_name}'s personalized path to mastery.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4 relative px-2">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    idx <= currentStep 
                      ? 'bg-sapphire text-white shadow-lg' 
                      : 'bg-white dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {idx < currentStep ? <Check size={20} /> : <span>{idx + 1}</span>}
                </div>
                <div className="mt-2 text-sm font-semibold dark:text-slate-300 hidden sm:block">
                  {step.title}
                </div>
              </div>
            ))}
            {/* Line connecting steps */}
            <div className="absolute top-5 left-10 right-10 h-[2px] bg-slate-200 dark:bg-slate-700 -z-1" />
            <motion.div 
              className="absolute top-5 left-10 h-[2px] bg-sapphire z-0"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Wizard Content */}
        <div className="bg-glass dark:bg-slate-900/40 rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && (
                <Step1 
                  formData={formData} 
                  setFormData={setFormData} 
                />
              )}
              {currentStep === 1 && (
                <Step2 
                  formData={formData} 
                  setFormData={setFormData} 
                />
              )}
              {currentStep === 2 && (
                <Step3 
                  formData={formData} 
                  setFormData={setFormData}
                  tutors={tutors}
                  subjects={subjects}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                currentStep === 0 
                  ? 'opacity-0 cursor-default' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ChevronLeft className="mr-2" size={20} /> Back
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="flex items-center px-8 py-3 bg-sapphire text-white rounded-xl font-bold shadow-lg shadow-sapphire/20 hover:scale-105 transition-all"
              >
                Next Step <ChevronRight className="ml-2" size={20} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={loading}
                className="flex items-center px-10 py-3 bg-linear-to-r from-sapphire to-primary text-white rounded-xl font-bold shadow-xl shadow-sapphire/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Setting up...' : 'Confirm Enrollment'} <Zap className="ml-2" size={18} fill="currentColor" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Step Components ---

function Step1({ formData, setFormData }: { formData: EnrollmentData, setFormData: (d: any) => void }) {
  const presets = [
    { 
      id: 'TWO_SESSIONS_WEEK', 
      title: 'Accelerated Path', 
      desc: '2 sessions / week',
      icon: <Zap className="text-yellow-500" />
    },
    { 
      id: 'THREE_SESSIONS_WEEK', 
      title: 'Power Path', 
      desc: '3 sessions / week',
      icon: <Star className="text-sapphire" fill="currentColor" />
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left mb-8">
        <h2 className="text-2xl font-bold text-deep-navy dark:text-white">Choose your intensity</h2>
        <p className="text-slate-500">Pick a weekly pace that fits your student's learning goals.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {presets.map(p => (
          <div 
            key={p.id}
            onClick={() => setFormData({ ...formData, schedule_preset: p.id })}
            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all card-hover ${
              formData.schedule_preset === p.id 
                ? 'border-sapphire bg-sapphire/5' 
                : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                {p.icon}
              </div>
              {formData.schedule_preset === p.id && (
                <div className="w-6 h-6 bg-sapphire rounded-full flex items-center justify-center text-white">
                  <Check size={14} />
                </div>
              )}
            </div>
            <h3 className="text-lg font-bold dark:text-white">{p.title}</h3>
            <p className="text-slate-500 text-sm">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step2({ formData, setFormData }: { formData: EnrollmentData, setFormData: (d: any) => void }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const maxDays = formData.schedule_preset === 'TWO_SESSIONS_WEEK' ? 2 : 3;

  const toggleDay = (day: string) => {
    const current = formData.schedule_days;
    if (current.includes(day)) {
      setFormData({ ...formData, schedule_days: current.filter((d: string) => d !== day) });
    } else if (current.length < maxDays) {
      setFormData({ ...formData, schedule_days: [...current, day] });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold dark:text-white">Pick your slots</h2>
        <p className="text-slate-500">Select {maxDays} days and your preferred start time.</p>
      </div>
      
      <div className="space-y-4">
        <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">Available Days</label>
        <div className="flex flex-wrap gap-3">
          {days.map(day => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`px-5 py-3 rounded-xl border transition-all ${
                formData.schedule_days.includes(day)
                  ? 'bg-sapphire border-sapphire text-white shadow-lg shadow-sapphire/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-sapphire'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">Preferred Start Time</label>
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 max-w-xs transition-all-fast focus-within:ring-2 ring-sapphire/20">
          <Clock className="text-slate-400 mr-3" size={20} />
          <input 
            type="time" 
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            className="bg-transparent border-none outline-none dark:text-white w-full text-lg"
          />
        </div>
      </div>
    </div>
  );
}

function Step3({ formData, setFormData, tutors, subjects }: { 
  formData: EnrollmentData, 
  setFormData: (d: any) => void,
  tutors: Tutor[],
  subjects: Subject[]
}) {
  const handleSubjectToggle = (id: string) => {
    const current = formData.subject_ids;
    if (current.includes(id)) {
      setFormData({ ...formData, subject_ids: current.filter((s: string) => s !== id) });
    } else {
      setFormData({ ...formData, subject_ids: [...current, id] });
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold dark:text-white">Final Personalization</h2>
        <p className="text-slate-500">Confirm your tutor and subjects.</p>
      </div>

      <div className="space-y-6">
        <label className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center">
          <User className="mr-2" size={16} /> Recommended Tutors
        </label>
        <div className="grid grid-cols-1 gap-4">
          {tutors.map((t: Tutor) => (
            <div 
              key={t.id}
              onClick={() => setFormData({ ...formData, tutor_id: t.id })}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center ${
                formData.tutor_id === t.id 
                  ? 'border-sapphire bg-sapphire/5' 
                  : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-500 mr-4">
                {t.users.first_name[0]}{t.users.last_name[0]}
              </div>
              <div className="flex-1">
                <h4 className="font-bold dark:text-white">{t.users.first_name} {t.users.last_name}</h4>
                <p className="text-xs text-slate-500">Expert Tutor • High Match</p>
              </div>
              {formData.tutor_id === t.id && (
                <div className="w-6 h-6 bg-sapphire rounded-full flex items-center justify-center text-white">
                  <Check size={14} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <label className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center">
          <BookOpen className="mr-2" size={16} /> Subjects focusing on
        </label>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s: Subject) => (
            <button
              key={s.id}
              onClick={() => handleSubjectToggle(s.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                formData.subject_ids.includes(s.id)
                  ? 'bg-sapphire text-white'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
