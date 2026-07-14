'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useAuthContext } from '@/app/context/AuthContext';
import { useCurriculum } from '@/app/context/CurriculumContext';
import { CURRICULA } from '@/app/config/curricula';
import StickyCTA from '../components/subjects/StickyCTA';
import {
  BookOpen, Calculator, FlaskConical, Globe2, Music, Palette,
  Landmark, Cpu, Heart, Trophy, TrendingUp, ChevronDown, Zap, Search,
  GraduationCap, ArrowRight, X, Languages, CheckCircle2
} from 'lucide-react';

// ── TYPES ────────────────────────────────────────────────────────────────────

type SubjectEntry = {
  id: string;
  name: string;
  iconName: string;
  hue: string;        // for gradient generation
  tagline: string;
  exams: string[];
  curricula: string[];
  levels: string[];
  topics: string[];
  ctaHref: string;
};

// ── DATA ─────────────────────────────────────────────────────────────────────

const ALL_SUBJECTS: SubjectEntry[] = [
  {
    id: 'mathematics', name: 'Mathematics', iconName: 'calculator', hue: '217',
    tagline: 'From arithmetic to calculus — build unshakeable number sense',
    exams: ['GCSE', 'A-Level', 'SAT', 'ACT', 'IB', 'IGCSE', 'PSLE', 'HSC', 'VCE', 'ATAR', 'Matric', 'CBSE', 'AP'],
    curricula: ['global', 'uk', 'australia', 'singapore', 'middleeast', 'southafrica', 'us', 'test-prep'],
    levels: ['Primary', 'Secondary', 'A-Level / IB', 'University Prep'],
    topics: ['Algebra & Functions', 'Calculus (AB & BC)', 'Statistics & Probability', 'Trigonometry', 'Geometry', 'Pure & Further Maths', 'Additional Maths'],
    ctaHref: '/subjects/mathematics',
  },
  {
    id: 'english', name: 'English', iconName: 'bookopen', hue: '270',
    tagline: 'Language, literature & writing — every word matters',
    exams: ['GCSE', 'A-Level', 'SAT', 'ACT', 'IB', 'IGCSE', 'PSLE', 'Matric'],
    curricula: ['global', 'uk', 'australia', 'singapore', 'middleeast', 'southafrica', 'us', 'test-prep'],
    levels: ['Primary', 'Secondary', 'A-Level / IB', 'SAT/ACT Prep'],
    topics: ['Creative Writing', 'Essay Technique', 'Literature Analysis', 'Reading Comprehension', 'Grammar & Vocabulary', 'Language Paper 1 & 2'],
    ctaHref: '/subjects/english',
  },
  {
    id: 'physics', name: 'Physics', iconName: 'zap', hue: '38',
    tagline: 'Mechanics to quantum — understand the universe',
    exams: ['GCSE', 'A-Level', 'IB', 'IGCSE', 'AP Physics 1/C', 'HSC', 'VCE', 'Matric', 'CBSE'],
    curricula: ['global', 'uk', 'australia', 'middleeast', 'southafrica', 'us'],
    levels: ['Secondary', 'A-Level / IB', 'University Prep'],
    topics: ['Mechanics & Motion', 'Waves & Optics', 'Electricity & Magnetism', 'Thermodynamics', 'Particle Physics', 'Astrophysics', 'Quantum Mechanics'],
    ctaHref: '/subjects/physics',
  },
  {
    id: 'chemistry', name: 'Chemistry', iconName: 'flask', hue: '158',
    tagline: 'Reactions, bonding & lab mastery for top grades',
    exams: ['GCSE', 'A-Level', 'IB', 'IGCSE', 'AP Chemistry', 'HSC', 'VCE', 'Matric', 'CBSE'],
    curricula: ['global', 'uk', 'australia', 'middleeast', 'southafrica', 'us'],
    levels: ['Secondary', 'A-Level / IB', 'University Prep'],
    topics: ['Atomic Structure', 'Organic Chemistry', 'Thermochemistry', 'Equilibrium & Kinetics', 'Electrochemistry', 'Acids & Bases'],
    ctaHref: '/subjects/chemistry',
  },
  {
    id: 'biology', name: 'Biology', iconName: 'heart', hue: '346',
    tagline: 'Cells to ecosystems — life sciences made clear',
    exams: ['GCSE', 'A-Level', 'IB', 'IGCSE', 'AP Biology', 'HSC', 'VCE', 'Matric', 'CBSE'],
    curricula: ['global', 'uk', 'australia', 'middleeast', 'southafrica', 'us'],
    levels: ['Secondary', 'A-Level / IB', 'University Prep'],
    topics: ['Cell Biology', 'Genetics & Evolution', 'Human Physiology', 'Ecology', 'Microbiology', 'Plant Biology', 'Molecular Biology'],
    ctaHref: '/subjects/biology',
  },
  {
    id: 'history', name: 'History', iconName: 'landmark', hue: '24',
    tagline: 'Source skills, essay structure & historical thinking',
    exams: ['GCSE', 'A-Level', 'IB', 'IGCSE', 'AP World/US History', 'Matric'],
    curricula: ['global', 'uk', 'southafrica', 'us'],
    levels: ['Secondary', 'A-Level / IB'],
    topics: ['Modern World History', 'Cold War', 'Civil Rights', 'WWI & WWII', 'Historical Sources', 'Coursework & NEA', 'Essay Technique'],
    ctaHref: '/subjects/history',
  },
  {
    id: 'geography', name: 'Geography', iconName: 'globe', hue: '180',
    tagline: 'Physical & human geography — real-world data skills',
    exams: ['GCSE', 'A-Level', 'IB', 'IGCSE', 'AP Human Geography'],
    curricula: ['global', 'uk', 'singapore', 'southafrica', 'us'],
    levels: ['Secondary', 'A-Level / IB'],
    topics: ['Tectonic Hazards', 'Urban Issues', 'Global Development', 'Climate Change', 'Resource Management', 'Fieldwork Skills'],
    ctaHref: '/subjects/geography',
  },
  {
    id: 'computer-science', name: 'Computer Science', iconName: 'cpu', hue: '194',
    tagline: 'Algorithms, systems & code — build things that matter',
    exams: ['GCSE', 'A-Level', 'IB', 'IGCSE', 'AP CS A', 'HSC', 'VCE'],
    curricula: ['global', 'uk', 'australia', 'us'],
    levels: ['Secondary', 'A-Level / IB'],
    topics: ['Python & Java', 'Data Structures & Algorithms', 'Networks & Security', 'Databases & SQL', 'Theory of Computation', 'AI & Machine Learning'],
    ctaHref: '/subjects/computer-science',
  },
  {
    id: 'economics', name: 'Economics', iconName: 'trending', hue: '246',
    tagline: 'Micro to macro — understand markets and decision-making',
    exams: ['GCSE', 'A-Level', 'IB', 'IGCSE', 'AP Macro/Micro Economics'],
    curricula: ['global', 'uk', 'us'],
    levels: ['Secondary', 'A-Level / IB'],
    topics: ['Supply & Demand', 'Market Structures', 'Macroeconomic Policy', 'International Trade', 'Development Economics', 'Behavioural Economics'],
    ctaHref: '/subjects/economics',
  },
  {
    id: 'languages', name: 'Languages', iconName: 'languages', hue: '320',
    tagline: 'French, Spanish, Arabic, Mandarin & more',
    exams: ['GCSE', 'A-Level', 'IB', 'IGCSE', 'DELF', 'DELE', 'PSLE Mother Tongue'],
    curricula: ['global', 'uk', 'singapore', 'middleeast'],
    levels: ['Primary', 'Secondary', 'A-Level / IB'],
    topics: ['Speaking & Listening', 'Reading Comprehension', 'Writing & Translation', 'Grammar Mastery', 'Cultural Studies', 'Arabic & Quran Studies'],
    ctaHref: '/subjects/languages',
  },
  {
    id: 'art-design', name: 'Art & Design', iconName: 'palette', hue: '291',
    tagline: 'Portfolio, technique & creative process for exam success',
    exams: ['GCSE', 'A-Level', 'IB', 'IGCSE'],
    curricula: ['global', 'uk'],
    levels: ['Secondary', 'A-Level / IB'],
    topics: ['Portfolio Development', 'Critical Analysis', 'Mixed Media', 'Fine Art', 'Graphic Design', 'Art History'],
    ctaHref: '/subjects/art-design',
  },
  {
    id: 'music', name: 'Music', iconName: 'music', hue: '48',
    tagline: 'Theory, composition & performance — all grade levels',
    exams: ['GCSE', 'A-Level', 'IB', 'ABRSM', 'Trinity'],
    curricula: ['global', 'uk'],
    levels: ['Primary', 'Secondary', 'A-Level / IB'],
    topics: ['Music Theory (Grade 1-8)', 'Composition & Harmony', 'Listening & Appraising', 'Instrumental Technique', 'Performance Preparation'],
    ctaHref: '/subjects/music',
  },
  {
    id: 'sat-act', name: 'SAT / ACT', iconName: 'trophy', hue: '0',
    tagline: 'Score higher with strategy, pacing & expert coaching',
    exams: ['SAT', 'ACT', 'PSAT'],
    curricula: ['us', 'test-prep', 'global', 'middleeast'],
    levels: ['High School'],
    topics: ['SAT Math (Algebra & Data)', 'SAT Reading & Writing', 'ACT English', 'ACT Math', 'ACT Science', 'Full-Length Timed Mocks'],
    ctaHref: '/us/sat-prep',
  },
  {
    id: 'social-studies', name: 'Social Studies', iconName: 'graduation', hue: '90',
    tagline: 'HASS, Humanities & Civics for every curriculum',
    exams: ['PSLE', 'O-Level', 'NAPLAN', 'NSW HSC', 'Matric', 'AP Gov'],
    curricula: ['singapore', 'australia', 'southafrica', 'us'],
    levels: ['Primary', 'Secondary'],
    topics: ['Singapore History & Geography', 'Australian HASS', 'Civics & Citizenship', 'AP Government', 'Source-Based Questions'],
    ctaHref: '/subjects/social-studies',
  },
];

// ── ICON MAP ─────────────────────────────────────────────────────────────────

function SubjectIcon({ name, size = 24 }: { name: string; size?: number }) {
  const p = { size, strokeWidth: 1.75 };
  switch (name) {
    case 'calculator': return <Calculator {...p} />;
    case 'bookopen': return <BookOpen {...p} />;
    case 'zap': return <Zap {...p} />;
    case 'flask': return <FlaskConical {...p} />;
    case 'heart': return <Heart {...p} />;
    case 'landmark': return <Landmark {...p} />;
    case 'globe': return <Globe2 {...p} />;
    case 'cpu': return <Cpu {...p} />;
    case 'trending': return <TrendingUp {...p} />;
    case 'languages': return <Languages {...p} />;
    case 'palette': return <Palette {...p} />;
    case 'music': return <Music {...p} />;
    case 'trophy': return <Trophy {...p} />;
    case 'graduation': return <GraduationCap {...p} />;
    default: return <BookOpen {...p} />;
  }
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function SubjectsPage() {
  const { user } = useAuthContext();
  const { activeCurriculum, setCurriculum } = useCurriculum();

  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const filterCurriculumId = selectedId ?? activeCurriculum.id;
  const activeMeta = CURRICULA.find(c => c.id === filterCurriculumId) ?? CURRICULA[0];

  const filtered = useMemo(() => {
    return ALL_SUBJECTS.filter(s => {
      const matches = filterCurriculumId === 'global' ? true : s.curricula.includes(filterCurriculumId);
      const q = search.toLowerCase().trim();
      const matchesSearch = q === '' ? true :
        s.name.toLowerCase().includes(q) ||
        s.topics.some(t => t.toLowerCase().includes(q)) ||
        s.exams.some(e => e.toLowerCase().includes(q));
      return matches && matchesSearch;
    });
  }, [filterCurriculumId, search]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setCurriculum(id);
    setExpandedId(null);
  };

  const ctaHref = user ? '/bookings/new' : '/signup?type=assessment';

  return (
    <main className="min-h-screen bg-white dark:bg-[#050508] text-slate-900 dark:text-white overflow-x-hidden">
      <StickyCTA />

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Aurora background */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[10%] w-[60vw] h-[60vh] rounded-full bg-blue-400/20 dark:bg-blue-600/25 blur-[130px]" />
          <div className="absolute top-[20%] right-[5%] w-[40vw] h-[40vh] rounded-full bg-violet-400/15 dark:bg-violet-600/20 blur-[100px]" />
          <div className="absolute bottom-[10%] left-[30%] w-[30vw] h-[30vh] rounded-full bg-cyan-400/10 dark:bg-cyan-500/15 blur-[90px]" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </motion.div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-5 px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-xs font-semibold tracking-[0.15em] uppercase text-slate-500 dark:text-white/60"
          >
            14 Subjects · 8 Curricula · Every Exam Board
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.88] mb-8"
          >
            <span className="text-slate-900 dark:text-white">Find your</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #34d399 100%)' }}
            >
              subject.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-500 dark:text-white/50 max-w-xl mx-auto mb-12 leading-relaxed font-light"
          >
            Expert 1-on-1 tutoring aligned to your exact curriculum, exam board, and grade level. No guesswork.
          </motion.p>

          {/* Hero search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative max-w-md mx-auto"
          >
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 pointer-events-none" />
            <input
              type="text"
              placeholder="Search subject, topic, or exam board…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-4 rounded-2xl bg-slate-100 dark:bg-white/8 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all backdrop-blur-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer" aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-14 flex flex-col items-center gap-1.5 text-slate-400 dark:text-white/20"
          >
            <span className="text-[10px] uppercase tracking-widest">Choose your curriculum</span>
            <ChevronDown size={16} className="animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ── CURRICULUM SELECTOR ─────────────────────────────────────────── */}
      <section className="sticky top-[60px] z-40 border-b border-slate-200 dark:border-white/5 bg-white/90 dark:bg-[#050508]/85 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {CURRICULA.map((c, i) => {
              const isActive = filterCurriculumId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelect(c.id)}
                  className={`relative flex-shrink-0 flex items-center gap-2.5 px-5 py-4 text-sm font-semibold transition-all duration-200 cursor-pointer border-b-2 ${
                    isActive
                      ? 'text-slate-900 dark:text-white border-blue-500 dark:border-blue-400'
                      : 'text-slate-400 dark:text-white/40 border-transparent hover:text-slate-700 dark:hover:text-white/80 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="hidden md:inline whitespace-nowrap">{c.country}</span>
                </button>
              );
            })}

            <div className="ml-auto pl-4 pr-2 flex-shrink-0">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 w-36 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CURRICULUM CONTEXT BAR ──────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filterCurriculumId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]"
        >
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl leading-none">{activeMeta.flag}</span>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{activeMeta.country}</h2>
                  <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">{activeMeta.gradeRange} · {activeMeta.subjectNote ?? 'All major exam boards'}</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 flex-wrap">
                {activeMeta.exams.map(e => (
                  <span key={e} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/8 text-[10px] font-semibold text-slate-500 dark:text-white/50">{e}</span>
                ))}
              </div>
            </div>
            <Link
              href={ctaHref}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-400 transition-all duration-200 cursor-pointer"
            >
              Book Free Session <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── SUBJECT GRID ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-28"
            >
              <p className="text-4xl mb-4 opacity-30">◌</p>
              <p className="text-slate-500 dark:text-white/50 text-sm">No subjects match your filter.</p>
              <button
                onClick={() => { setSearch(''); setSelectedId('global'); }}
                className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer underline underline-offset-2"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${filterCurriculumId}-${search}`}
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filtered.map(subject => (
                <motion.div
                  key={subject.id}
                  variants={{
                    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
                    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4 } },
                  }}
                >
                  <SubjectCard
                    subject={subject}
                    isExpanded={expandedId === subject.id}
                    onToggle={() => setExpandedId(expandedId === subject.id ? null : subject.id)}
                    ctaHref={ctaHref}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── EXAM BOARD GRID ──────────────────────────────────────────────── */}
      <section className="border-t border-slate-100 dark:border-white/5 py-20 bg-slate-50/50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-white/30 text-center mb-10 font-semibold">Covering Every Major Exam Board</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { board: 'Edexcel', region: 'GCSE & A-Level' },
              { board: 'Cambridge CAIE', region: 'IGCSE & A-Level' },
              { board: 'AQA', region: 'GCSE & A-Level' },
              { board: 'IB (DP & MYP)', region: 'International Bac.' },
              { board: 'College Board', region: 'SAT, AP & PSAT' },
              { board: 'ACT Inc.', region: 'ACT Composite' },
              { board: 'MOE Singapore', region: 'PSLE, O & A Levels' },
              { board: 'ACARA', region: 'Australian Curriculum' },
            ].map((b) => (
              <div key={b.board} className="group flex items-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200 dark:border-white/6 bg-white dark:bg-white/[0.03] hover:border-blue-200 dark:hover:border-white/12 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all duration-200 cursor-default shadow-sm dark:shadow-none">
                <CheckCircle2 size={14} className="text-emerald-500 dark:text-emerald-400/60 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white/80">{b.board}</div>
                  <div className="text-[11px] text-slate-400 dark:text-white/30">{b.region}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[40vh] rounded-full bg-blue-600/15 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-5 leading-tight">
            Ready to unlock your child&apos;s potential?
          </h2>
          <p className="text-slate-500 dark:text-white/40 text-lg mb-10 leading-relaxed">
            Book a free diagnostic session. We&apos;ll match your child with the perfect specialist tutor for their curriculum and goals.
          </p>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-[#050508] font-black text-base hover:bg-slate-700 dark:hover:bg-white/90 transition-all duration-200 cursor-pointer shadow-2xl shadow-slate-900/10 dark:shadow-white/10"
          >
            Book a Free Session <ArrowRight size={18} />
          </Link>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400 dark:text-white/30">
            <span>No credit card</span>
            <span className="w-0.5 h-3 bg-slate-200 dark:bg-white/10 rounded-full" />
            <span>Curriculum aligned</span>
            <span className="w-0.5 h-3 bg-slate-200 dark:bg-white/10 rounded-full" />
            <span>3 free sessions incl. diagnostic</span>
          </div>
        </div>
      </section>
    </main>
  );
}

// ── SUBJECT CARD ─────────────────────────────────────────────────────────────

function SubjectCard({
  subject, isExpanded, onToggle, ctaHref,
}: {
  subject: SubjectEntry;
  isExpanded: boolean;
  onToggle: () => void;
  ctaHref: string;
}) {
  // Dark mode: vivid hue at high lightness; light mode: same hue but more saturated, darker
  const hslDark = `hsl(${subject.hue}, 70%, 65%)`;
  const hslLight = `hsl(${subject.hue}, 65%, 45%)`;
  const hslDim = `hsl(${subject.hue}, 60%, 20%)`;
  const hslBgDark = `hsla(${subject.hue}, 60%, 55%, 0.10)`;
  const hslBgLight = `hsla(${subject.hue}, 60%, 55%, 0.09)`;
  const hslBorderDark = `hsla(${subject.hue}, 60%, 55%, 0.18)`;
  const hslBorderLight = `hsla(${subject.hue}, 60%, 50%, 0.20)`;

  // We pass CSS vars so both light and dark sub-elements can pick the right value
  const cardStyle = {
    '--hsl': hslDark,
    '--hsl-l': hslLight,
    '--hsl-bg': hslBgDark,
    '--hsl-bg-l': hslBgLight,
    '--hsl-border': hslBorderDark,
    '--hsl-border-l': hslBorderLight,
  } as React.CSSProperties;

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer group ${
        isExpanded
          ? 'shadow-2xl dark:shadow-2xl shadow-slate-200'
          : 'hover:shadow-lg hover:shadow-slate-100 dark:hover:shadow-none'
      } bg-white dark:bg-transparent border-slate-200 dark:border-white/7`}
      onClick={onToggle}
    >
      {/* Glow on hover/expand — adapts per mode via CSS vars */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 30%, ${hslBgLight}, transparent 70%)` }}
      />
      {isExpanded && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at 30% 20%, ${hslBgLight}, transparent 65%)` }}
        />
      )}

      {/* Header */}
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ background: hslBgLight, color: hslLight, border: `1px solid ${hslBorderLight}` }}
          >
            <SubjectIcon name={subject.iconName} size={20} />
          </div>

          {/* Expand indicator */}
          <div className="w-5 h-5 flex items-center justify-center mt-0.5">
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronDown size={14} className="text-slate-300 dark:text-white/30 group-hover:text-slate-500 dark:group-hover:text-white/60 transition-colors" />
            </motion.div>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 leading-snug">{subject.name}</h3>
        <p className="text-xs text-slate-500 dark:text-white/60 leading-relaxed">{subject.tagline}</p>

        {/* Exam chips */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {subject.exams.slice(0, 3).map(exam => (
            <span
              key={exam}
              className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
              style={{ background: hslBgLight, color: hslLight, border: `1px solid ${hslBorderLight}` }}
            >
              {exam}
            </span>
          ))}
          {subject.exams.length > 3 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-400 dark:text-white/40">
              +{subject.exams.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div
              className="mx-4 mb-4 rounded-xl p-4 space-y-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10"
            >
              {/* Levels */}
              <div>
                <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-white/40 mb-2">Levels</p>
                <div className="flex flex-wrap gap-1.5">
                  {subject.levels.map(l => (
                    <span key={l} className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/8 text-[11px] text-slate-600 dark:text-white/60 font-medium">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div>
                <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-white/25 mb-2">Topics</p>
                <div className="space-y-1.5">
                  {subject.topics.map(t => (
                    <div key={t} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: hslLight, opacity: 0.7 }} />
                      <span className="text-xs text-slate-600 dark:text-white/50">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-2 pt-1">
                <Link
                  href={ctaHref}
                  className="flex-1 flex items-center justify-center py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer text-white"
                  style={{ background: hslLight }}
                  onClick={e => e.stopPropagation()}
                >
                  Book Free Trial
                </Link>
                <Link
                  href={subject.ctaHref}
                  className="px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-white/8 border border-slate-200 dark:border-white/10 text-[13px] font-semibold text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/12 transition-all duration-200 cursor-pointer"
                  onClick={e => e.stopPropagation()}
                >
                  Learn More
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
