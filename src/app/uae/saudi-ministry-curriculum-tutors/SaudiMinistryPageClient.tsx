"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../../components/subjects/ParentTestimonials";
import StickyCTA from "../../components/subjects/StickyCTA";
import SubjectFAQ from "../../components/subjects/SubjectFAQ";
import Image from "next/image";
import { Monitor, School, ArrowRight, BookOpen, GraduationCap, Globe, Target, ShieldCheck, CheckCircle2 } from "lucide-react";

const optimizeCloudinaryUrl = (url: string) => {
  if (url.includes("cloudinary.com") && !url.includes("f_auto")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  }
  return url;
};

type FAQItemType = { q: string; a: string };

interface Props {
  testimonials: { text: string; author: string; role: string; rating: number }[];
  faqs: FAQItemType[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const saudiStages = [
  {
    stage: "Primary",
    arabic: "ابتدائي",
    grades: "Grades 1-6",
    ages: "Ages 6-12",
    subjects: ["Arabic Language (reading, writing, grammar)", "Islamic Education (Quran, Aqeedah)", "Mathematics", "Science", "Social Studies", "English as a Foreign Language (from G1)", "Physical Education and Art"],
    assessment: "Continuous school-based assessment. No national exam. Promotion based on annual average.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    stage: "Intermediate",
    arabic: "متوسط",
    grades: "Grades 7-9",
    ages: "Ages 12-15",
    subjects: ["Arabic Language (advanced grammar, rhetoric)", "Islamic Education (Fiqh, Hadith, Tawheed)", "Mathematics (algebra, geometry)", "Sciences (Physics, Chemistry, Biology   integrated)", "Social Studies and Geography", "English Language", "Computer Science"],
    assessment: "School-based midterm and final exams. Grade 9 results inform Secondary track placement.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    stage: "Secondary   Scientific Track",
    arabic: "ثانوي / علمي",
    grades: "Grades 10-12",
    ages: "Ages 15-18",
    subjects: ["Arabic Language", "Islamic Education", "Advanced Mathematics (calculus, matrices)", "Physics", "Chemistry", "Biology", "English Language", "Computer Science"],
    assessment: "School exams + Tawjihi Grade 12 national exam. Tahsili Sciences for university admission.",
    color: "from-violet-500 to-purple-600",
  },
  {
    stage: "Secondary   Literary Track",
    arabic: "ثانوي / أدبي",
    grades: "Grades 10-12",
    ages: "Ages 15-18",
    subjects: ["Arabic Language and Literature", "Islamic Education (advanced)", "History and Geography", "Sociology and Psychology", "Economics", "English Language"],
    assessment: "School exams + Tawjihi Grade 12 national exam. Qudurat verbal section critical for this track.",
    color: "from-orange-500 to-amber-600",
  },
];

const saudiExams = [
  {
    exam: "Tawjihi",
    arabic: "شهادة الثانوية العامة",
    purpose: "Saudi national secondary certificate. Required for all Saudi university applications.",
    format: "Subject exams at end of Grade 12. Both Scientific and Literary tracks. Arabic-medium.",
    preparation: "Full subject coverage using Saudi MOE textbooks. Past paper practice. Structured revision for all Tawjihi subjects.",
  },
  {
    exam: "Qudurat",
    arabic: "اختبار القدرات",
    purpose: "Saudi scholastic aptitude test administered by Qiyas. Used in all university composite score calculations.",
    format: "Verbal (Arabic language reasoning, reading comprehension, analogies) and Quantitative (Mathematics and logical reasoning) sections.",
    preparation: "Quantitative problem-solving drills. Arabic verbal comprehension technique. Analogy and reasoning pattern recognition.",
  },
  {
    exam: "Tahsili",
    arabic: "الاختبار التحصيلي",
    purpose: "National achievement test for Sciences. Critical for Medicine, Dentistry, Engineering, and Computer Science admission.",
    format: "Physics, Chemistry, Biology, and Mathematics multiple-choice questions. Scientific track content focus.",
    preparation: "Systematic Sciences and Mathematics content review. Multiple-choice strategy and time management.",
  },
  {
    exam: "IELTS / TOEFL",
    arabic: "اللغة الانجليزية",
    purpose: "Required by Saudi universities for English-medium programmes and by international universities.",
    format: "IELTS Academic 4 skills. TOEFL iBT for US pathway.",
    preparation: "IELTS Academic Writing, Speaking, Listening, and Reading technique aligned to Saudi-applicant common error patterns.",
  },
];

const whySaudiSpecialist = [
  { point: "Saudi MOE textbooks change regularly under Vision 2030", detail: "Curriculum reforms since 2016 have updated Mathematics, Science, and Social Studies content. A tutor must use current Saudi MOE textbooks, not older editions." },
  { point: "Arabic-medium instruction is essential", detail: "Saudi MOE subjects are assessed in Arabic. Maths and Sciences are Arabic-medium at government schools. Tutors must be able to explain content in Arabic using curriculum-specific terminology." },
  { point: "Tawjihi format differs from international exams", detail: "Tawjihi question types and marking approaches are specific to Saudi MOE. Students who study from international resources alone will misalign their preparation." },
  { point: "Qudurat is not a subject test", detail: "Many students confuse Qudurat with academic content review. Qudurat tests reasoning, not curriculum knowledge. This requires a different preparation approach." },
  { point: "Track placement at Grade 10 has long-term consequences", detail: "Scientific vs Literary track choice in Saudi Grade 10 determines university admission eligibility. Tutors help families understand implications and support the transition." },
  { point: "Returning Saudi families face reintegration challenges", detail: "Saudi families who return from abroad often find their children behind on Arabic Language and Islamic Studies. Specialist tutors support reintegration without stigma or repetition." },
];

export default function SaudiMinistryPageClient({ testimonials, faqs }: Props) {
  const { user } = useAuthContext();
  const ctaHref = user ? "/bookings/new" : "/signup?type=assessment";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <StickyCTA />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center text-white pt-32 pb-24 px-4 overflow-hidden bg-deep-navy">
        {/* Background Image With Multi-layered Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src={optimizeCloudinaryUrl("https://res.cloudinary.com/de8vvmpip/image/upload/v1776669065/A_refined__softly_202604201240_p6qolx.jpg")}
            alt="Saudi Ministry of Education curriculum abstract background"
            fill
            className="object-cover opacity-60 scale-110"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-deep-navy/80 via-deep-navy/60 to-deep-navy" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-green-400/30 via-transparent to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[10px] font-black mb-6 tracking-[0.2em] uppercase text-white/90 backdrop-blur-md">
            <span>🇸🇦</span> Saudi Ministry of Education · Primary, Intermediate and Secondary
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.1 } } }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[0.95] uppercase drop-shadow-2xl text-white">
            Saudi Ministry <span className="text-ice-blue underline decoration-primary/30 underline-offset-8">of Education</span>
          </motion.h1>
          <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.2 } } }}
            className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-ice-blue to-primary italic mb-8 drop-shadow-sm">
            Curriculum Tutors Online
          </motion.div>
          <motion.p initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.2 } } }} className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
            Specialist online tutors for the Saudi national curriculum. Arabic Language, Islamic Studies, Mathematics, Sciences. Tawjihi, Qudurat and Tahsili preparation. Primary through Secondary across all Saudi cities.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.3 } } }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ctaHref} className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-white font-black text-sm tracking-wide hover:bg-sapphire hover:scale-105 transition-all shadow-xl shadow-blue-500/30">
              Book Free Trial Lesson
            </Link>
            <a href="#stages" className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-all">
              See Curriculum Stages
            </a>
          </motion.div>
        </div>
      </section>

      {/* Saudi Curriculum Stages */}
      <section id="stages" className="py-24 px-4 bg-surface relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-emerald-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">Saudi MOE Curriculum Stages</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-text-secondary max-w-2xl mx-auto font-medium">Three stages spanning 12 years. Scientific and Literary tracks diverge at Grade 10 and determine university admission eligibility.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {saudiStages.map((s, i) => (
              <motion.div
                key={s.stage}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  ...fadeUp,
                  visible: {
                    ...fadeUp.visible,
                    transition: { duration: 0.5, delay: i * 0.1 },
                  },
                }}
                className="group relative rounded-[3rem] p-10 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-emerald-500/30 transition-all overflow-hidden flex flex-col"
              >
                {/* Subtle Background Glow on Hover */}
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-border shadow-sm flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                      📖
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">
                      {s.arabic}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-deep-navy dark:text-white mb-2 tracking-tighter uppercase leading-none italic group-hover:text-emerald-600 transition-colors">
                    {s.stage}
                  </h3>

                  <p className="text-[11px] font-black text-emerald-600/70 uppercase tracking-widest mb-8">
                    {s.grades} · {s.ages}
                  </p>

                  <div className="space-y-8">
                    <div>
                      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4 opacity-50">Core Domains</p>
                      <div className="flex flex-wrap gap-2">
                        {s.subjects.slice(0, 4).map((sub) => (
                          <span key={sub} className="px-3 py-1 rounded-full bg-slate-50 dark:bg-white/5 border border-border/50 text-[10px] font-bold text-text-secondary uppercase tracking-tight italic">
                            {sub.split('(')[0].trim()}
                          </span>
                        ))}
                        <span className="px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-black text-emerald-600 uppercase tracking-tight italic">
                          + {s.subjects.length - 4} more
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Assessment Matrix</p>
                      <p className="text-sm font-medium text-text-secondary dark:text-slate-400 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                        {s.assessment}
                      </p>
                    </div>
                  </div>

                  <div className="mt-12 flex items-center justify-between text-emerald-600 group-hover:translate-x-1 transition-transform duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest">Matched Specialists</span>
                    <ArrowRight size={16} />
                  </div>
                </div>

                {/* Interactive Corner Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-emerald-500/10 to-transparent -translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Saudi Exams */}
      <section className="py-24 px-4 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/20 to-transparent" />
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">National Examinations</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-text-secondary max-w-2xl mx-auto font-medium lowercase">Saudi national secondary certificates and scholastic aptitude tests preparation guide.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {saudiExams.map((e, i) => (
              <motion.div
                key={e.exam}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.1 } } }}
                className="group relative p-10 rounded-[3rem] bg-surface dark:bg-surface/5 border border-border hover:shadow-2xl hover:border-primary/30 transition-all flex flex-col overflow-hidden"
              >
                {/* Subtle Background Glow on Hover */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-10">
                    <div className="w-20 h-16 rounded-2xl bg-white dark:bg-white/5 border border-border shadow-sm flex items-center justify-center font-black text-primary group-hover:scale-110 transition-transform duration-500">
                      {e.exam}
                    </div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">
                      {e.arabic}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-deep-navy dark:text-white mb-2 tracking-tighter uppercase leading-tight group-hover:text-primary transition-colors italic">
                    {e.purpose.split('.')[0]}
                  </h3>
                  <p className="text-[11px] font-black text-primary/70 uppercase tracking-widest mb-8">
                    Exam Board Protocol
                  </p>

                  <div className="space-y-8">
                    <p className="text-[14px] text-text-secondary font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                      {e.format}
                    </p>

                    <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Strategic Match Strategy</p>
                      <p className="text-[14px] font-bold text-deep-navy dark:text-white leading-relaxed italic border-l-2 border-primary/20 pl-4">{e.preparation}</p>
                    </div>
                  </div>

                  <div className="mt-12 flex items-center justify-between text-primary group-hover:translate-x-1 transition-transform duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Maximise Composite Score</span>
                    <ArrowRight size={16} />
                  </div>
                </div>

                {/* Interactive Corner Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-primary/10 to-transparent -translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Specialist */}
      <section className="py-24 px-4 bg-surface relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">Why Saudi MOE Specialist Tutors?</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-text-secondary max-w-2xl mx-auto font-medium">Navigating the vision 2030 curriculum reforms requires specialized expertise that standard international tutoring cannot provide.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whySaudiSpecialist.map((w, i) => (
              <motion.div
                key={w.point}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.08 } } }}
                className="group relative p-10 rounded-[3rem] bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-primary/30 transition-all flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-8 font-black group-hover:bg-primary group-hover:text-white transition-colors duration-500 shadow-sm border border-primary/10">
                  {i + 1}
                </div>
                <h3 className="text-lg font-black text-deep-navy dark:text-white tracking-tighter uppercase italic leading-tight mb-6 group-hover:text-primary transition-colors">
                  {w.point}
                </h3>
                <p className="text-sm font-medium text-text-secondary dark:text-slate-400 leading-relaxed italic opacity-80">
                  {w.detail}
                </p>

                {/* Visual Accent */}
                <div className="absolute bottom-0 left-10 right-10 h-1 bg-primary/5 group-hover:bg-primary/20 transition-all duration-700 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-24 px-4 bg-background relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tighter">Cinematic Growth Matrix</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </motion.div>
          <div className="rounded-[3.5rem] overflow-hidden border border-border/60 shadow-2xl bg-surface relative">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="grid grid-cols-3 bg-deep-navy text-white text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
              <div className="px-8 py-6">Stage / Focus</div>
              <div className="px-8 py-6 border-l border-white/10 italic text-red-400">Baseline Level</div>
              <div className="px-8 py-6 border-l border-white/10 italic text-emerald-400">Post-Tutoring Delta</div>
            </div>
            {[
              ["G11 Scientific Track   Chemistry", "65% in Chemistry. Organic section not understood in Arabic.", "88%. Organic mechanisms explained in Arabic. Full Tawjihi coverage."],
              ["G12 Tawjihi   Mathematics", "Failing calculus and matrices components. Concerned about composite score.", "Tawjihi Math 94%. King Saud University Engineering admission score met."],
              ["Qudurat   Quantitative section", "Quantitative section score 55-60. Pulling composite score down.", "Quantitative section 74. Overall Qudurat score above 80."],
              ["Returning family   G9 Arabic", "Family returned from UK. Arabic Language G9 level significantly behind peers.", "Reintegrated within 2 terms. Arabic grammar and composition at grade level."],
            ].map(([lvl, before, after], i) => (
              <div key={lvl} className={`grid grid-cols-3 border-t border-border group relative z-10 ${i % 2 === 0 ? 'bg-white/50 dark:bg-white/5' : 'bg-transparent'}`}>
                <div className="px-8 py-8 text-sm font-black text-deep-navy dark:text-white uppercase tracking-tighter italic flex items-center">
                  {lvl}
                </div>
                <div className="px-8 py-8 text-[13px] font-medium text-red-600/80 dark:text-red-400/80 bg-red-500/2 border-l border-border italic leading-relaxed">
                  {before}
                </div>
                <div className="px-8 py-8 text-[13px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-500/4 border-l border-border italic leading-relaxed">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="text-[10px] uppercase tracking-widest text-emerald-500/60">Achieved</span>
                  </div>
                  {after}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">What Saudi Families Say</h2>
          </motion.div>
          <ParentTestimonials testimonials={testimonials} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">Saudi Ministry Curriculum FAQs</h2>
          </motion.div>
          <SubjectFAQ items={faqs} />
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-8">
            <h2 className="text-2xl font-black text-deep-navy dark:text-white">More Regional Tutoring</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Online Tutors Riyadh", href: "/uae/online-tutors-riyadh", desc: "BIS, AISR, Saudi MOE" },
              { name: "MOE UAE Curriculum", href: "/uae/moe-uae-curriculum-tutors", desc: "UAE national schools, EmSAT" },
              { name: "Online Tutors Dubai", href: "/uae/online-tutors-dubai", desc: "All Dubai curricula" },
              { name: "Online Tutors Abu Dhabi", href: "/uae/online-tutors-abu-dhabi", desc: "ADEK regulated schools" },
            ].map((l, i) => (
              <motion.div key={l.href} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.08 } } }}>
                <Link href={l.href} className="block p-4 rounded-xl border border-border bg-white dark:bg-white/5 hover:border-primary hover:shadow-md transition-all group">
                  <p className="font-black text-deep-navy dark:text-white group-hover:text-primary transition-colors text-sm mb-1">{l.name}</p>
                  <p className="text-xs text-text-secondary">{l.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark CTA */}
      <section className="py-20 px-4 bg-linear-to-br from-deep-navy to-[#0d1f3c] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Get a Saudi MOE Curriculum Specialist</h2>
            <p className="text-white/70 mb-8 text-lg">Arabic-medium instruction. Tawjihi, Qudurat and Tahsili preparation. Primary through Grade 12 Scientific and Literary tracks across all Saudi cities.</p>
            <Link href={ctaHref} className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-primary text-white font-black text-sm tracking-wide hover:bg-sapphire hover:scale-105 transition-all shadow-xl shadow-blue-500/30">
              Book Free Trial Lesson
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SEO paragraph */}
      <section className="py-12 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-text-secondary leading-relaxed">
            StudyHours provides specialist online tutors for the Saudi Ministry of Education national curriculum across all three school stages: Primary (Grades 1-6), Intermediate (Grades 7-9), and Secondary (Grades 10-12). Our Saudi MOE tutors cover Arabic Language, Islamic Education (Quran, Hadith, Fiqh, Tawheed), Mathematics, Physics, Chemistry, Biology, English Language, and Social Studies. For Saudi Secondary students, we provide focused Tawjihi examination preparation in both the Scientific and Literary tracks, Qudurat aptitude test coaching for the verbal and quantitative sections, and Tahsili Sciences and Mathematics content review for students targeting competitive programmes at Saudi universities. Our tutors deliver sessions in Arabic using current Saudi MOE textbook editions, reflecting Vision 2030 curriculum reforms. We support students in Riyadh, Jeddah, Dammam, Mecca, Medina, and all other Saudi cities through fully online sessions. Returning Saudi families whose children have fallen behind in Arabic Language and Islamic Studies after time abroad are a particular focus of our Saudi MOE curriculum service.
          </p>
        </div>
      </section>
    </main>
  );
}
