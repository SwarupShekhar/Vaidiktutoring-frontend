"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../../components/subjects/ParentTestimonials";
import StickyCTA from "../../components/subjects/StickyCTA";
import SubjectFAQ from "../../components/subjects/SubjectFAQ";
import Image from "next/image";
import { BookOpen, GraduationCap, Globe, Star, Target, ShieldCheck, Monitor, Navigation, School, MapPin, CheckCircle2, ArrowRight } from "lucide-react";

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

const curricula = [
  {
    name: "British / Cambridge",
    icon: "🇬🇧",
    levels: "IGCSE, A-Level",
    schools: "BIS Riyadh, Saudi British International",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "American",
    icon: "🇺🇸",
    levels: "AP subjects, SAT, ACT",
    schools: "American International School Riyadh (AISR)",
    color: "from-sky-500 to-blue-600",
  },
  {
    name: "International Baccalaureate",
    icon: "🌐",
    levels: "IB MYP, IB DP",
    schools: "Manarat International, some AISR sections",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Saudi MOE National",
    icon: "🇸🇦",
    levels: "Primary, Intermediate, Secondary (Tawjihi)",
    schools: "All Saudi government and national private schools",
    color: "from-green-600 to-emerald-700",
  },
  {
    name: "CBSE (Indian)",
    icon: "🇮🇳",
    levels: "Grades 1-12, CBSE Board",
    schools: "Indian International School Riyadh (IISR), Pakistan International School",
    color: "from-orange-500 to-amber-600",
  },
  {
    name: "French Baccalaureate",
    icon: "🇫🇷",
    levels: "Baccalaureat",
    schools: "Lycee Francais de Riyad",
    color: "from-violet-500 to-purple-600",
  },
];

const riyadhSchools = [
  "British International School Riyadh (BIS Riyadh)   IGCSE / A-Level",
  "American International School Riyadh (AISR)   AP / American",
  "Manarat International School   IB / Mixed",
  "Lycee Francais de Riyad   French Baccalaureate",
  "Indian International School Riyadh (IISR)   CBSE",
  "Pakistan International School Riyadh   Matric / IGCSE",
  "Saudi British International School   British / IGCSE",
  "Dhahran Ahliyya Schools   Saudi MOE enriched",
  "Riyadh English Speaking School   British / IGCSE",
  "International Programs School (IPS) Riyadh",
  "All Saudi Ministry of Education government schools",
  "Saudi Aramco School (Dhahran) connections",
];

const riyadhAreas = [
  "Al Olaya", "Diplomatic Quarter", "Al Wurud", "Sulaimaniyah",
  "Al Malaz", "Al Rawdah", "Riyadh Hills", "Al Nakheel",
  "Al Murabba", "Al Aqiq", "Al Hamra", "King Fahad District",
  "Al Yasmeen", "Hittin", "Al Rabwah", "Jeddah (remote)",
];

const admissionTests = [
  {
    name: "Tawjihi",
    full: "General Secondary Education Certificate",
    who: "Saudi national Grade 12 students",
    matters: "Determines Saudi university admission eligibility. Combined with Qudurat and Tahsili scores.",
    tutorHelp: "Saudi MOE curriculum revision for all secondary subjects. Mock paper practice.",
  },
  {
    name: "Qudurat",
    full: "Saudi Scholastic Aptitude Test",
    who: "All Saudi university applicants",
    matters: "Verbal and quantitative reasoning. Combined with Tawjihi for university composite score.",
    tutorHelp: "Quantitative reasoning practice. Arabic verbal comprehension and analogy patterns.",
  },
  {
    name: "Tahsili",
    full: "National Achievement Test",
    who: "Science track students targeting Medicine, Engineering, Computer Science",
    matters: "Subject-specific knowledge test. Sciences and Mathematics. Key for competitive programmes.",
    tutorHelp: "Physics, Chemistry, Biology, Mathematics content review aligned to test format.",
  },
  {
    name: "SAT / ACT",
    full: "US University Entrance Tests",
    who: "Students at AISR targeting US universities",
    matters: "Required by US universities. Many UAE and Gulf universities also accept SAT scores.",
    tutorHelp: "AISR students receive SAT Math, SAT Reading, and ACT Science preparation.",
  },
];

export default function RiyadhPageClient({ testimonials, faqs }: Props) {
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
            src={optimizeCloudinaryUrl("https://res.cloudinary.com/de8vvmpip/image/upload/v1776668682/A_softly_blurred_202604201234_cnskjt.jpg")}
            alt="Riyadh skyline and educational abstract background"
            fill
            className="object-cover opacity-60 scale-110"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-deep-navy/80 via-deep-navy/60 to-deep-navy" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-green-400/30 via-transparent to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[10px] font-black mb-6 tracking-[0.2em] uppercase text-white/90 backdrop-blur-md">
            <span>🇸🇦</span> Riyadh · BIS, AISR, Saudi MOE and International Schools
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.1 } } }} 
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[0.95] uppercase drop-shadow-2xl text-white">
            Online Tutors <span className="text-ice-blue underline decoration-primary/30 underline-offset-8">Riyadh</span>
          </motion.h1>
          <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.2 } } }} 
            className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-ice-blue to-primary italic mb-8 drop-shadow-sm">
            IB, IGCSE, AP and Saudi MOE
          </motion.div>
          <motion.p initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.2 } } }} className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
            Specialist online tutors for all Riyadh students. British International School, AISR, Manarat International, Lycee Francais and all Saudi MOE government schools. Tawjihi and Qudurat preparation included.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.3 } } }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ctaHref} className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-white font-black text-sm tracking-wide hover:bg-sapphire hover:scale-105 transition-all shadow-xl shadow-blue-500/30">
              Book Free Trial Lesson
            </Link>
            <a href="#schools" className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-all">
              See Riyadh Schools
            </a>
          </motion.div>
        </div>
      </section>

      {/* Curricula */}
      <section className="py-24 px-4 bg-surface relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-emerald-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 uppercase tracking-tight">All Riyadh Curricula Covered</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {curricula.map((c, i) => (
              <motion.div
                key={c.name}
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
                className="group relative rounded-[3rem] p-10 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-emerald-500/30 transition-all overflow-hidden"
              >
                {/* Subtle Background Glow on Hover */}
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-border shadow-sm flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                      {c.icon}
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">
                      RIYADH-MATCHED
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase leading-none italic group-hover:text-emerald-600 transition-colors">
                    {c.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[11px] font-black text-emerald-600/70 uppercase tracking-widest">
                      {c.levels}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <p className="text-sm font-medium text-text-secondary dark:text-slate-400 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                      Expert preparation for students at {c.schools}. Aligned with Riyadh secondary standards.
                    </p>
                  </div>

                  <div className="mt-12 flex items-center justify-between text-emerald-600 group-hover:translate-x-1 transition-transform duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Find Your Specialist</span>
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

      {/* University Entrance Tests */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-4">University Entrance Tests for Riyadh Students</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Riyadh students face multiple high-stakes tests depending on their curriculum and target university. Our tutors specialise in each format.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {admissionTests.map((t, i) => (
              <motion.div
                key={t.name}
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
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-border shadow-sm flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-500 font-black text-xs uppercase">
                      {t.name}
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">
                      TEST-MATCHED
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-deep-navy dark:text-white mb-2 tracking-tighter uppercase leading-tight italic group-hover:text-emerald-600 transition-colors">
                    {t.full}
                  </h3>
                  <p className="text-[11px] font-black text-emerald-600/70 uppercase tracking-widest mb-8">{t.who}</p>

                  <div className="space-y-8">
                    <div>
                      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4 opacity-50">Impact Matrix</p>
                      <p className="text-[14px] font-medium text-text-secondary dark:text-slate-400 leading-relaxed italic border-l-2 border-emerald-500/20 pl-4">{t.matters}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Strategic Outcome</p>
                      <p className="text-[14px] font-bold text-deep-navy dark:text-white leading-relaxed italic">{t.tutorHelp}</p>
                    </div>
                  </div>

                  <div className="mt-12 flex items-center justify-between text-emerald-600 group-hover:translate-x-1 transition-transform duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest">Maximise Score Outcome</span>
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

      {/* Schools */}
      <section id="schools" className="py-16 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">Riyadh Schools We Support</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-3">
            {riyadhSchools.map((school, i) => (
              <motion.div key={school} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.05 } } }} className="flex items-center gap-2 p-3 rounded-xl border border-border bg-white dark:bg-white/5 text-sm">
                <span className="text-primary text-xs font-black">✓</span>
                <span className="text-deep-navy dark:text-white font-medium text-xs">{school}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">Before and After StudyHours</h2>
          </motion.div>
          <div className="rounded-[3rem] overflow-hidden border border-border bg-white dark:bg-slate-900/50 shadow-2xl">
            <div className="grid grid-cols-12 bg-linear-to-r from-deep-navy to-sapphire text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <div className="col-span-4 px-8 py-6">Student Demographic</div>
              <div className="col-span-4 px-8 py-6 border-l border-white/10 text-red-300">Baseline Assessment</div>
              <div className="col-span-4 px-8 py-6 border-l border-white/10 text-emerald-300">Post-Instruction Outcome</div>
            </div>
            {[
              ["IGCSE Maths   BIS Riyadh", "Grade C/D in extended tier. Method marks lost on algebra and trigonometry.", "A* in IGCSE Maths. Extended working accurate and full."],
              ["AP Calculus BC   AISR", "Score 2. Limits, series, and polar coordinates not understood.", "Score 5. All AP Calculus BC topics covered systematically."],
              ["Tawjihi Sciences   Riyadh Gov School", "65-70% in Physics and Chemistry. Concerned about university composite.", "88-91% in both. Tahsili Sciences score competitive for Engineering."],
              ["CBSE Grade 12   IISR Riyadh", "Maths Board at 74%. CBSE integration and vectors weak.", "Board result 94%. Delhi University competitive stream secured."],
            ].map(([lvl, before, after]) => (
              <div key={lvl} className="grid grid-cols-12 border-t border-border group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <div className="col-span-4 px-8 py-8 text-sm font-black text-deep-navy dark:text-white flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {lvl}
                </div>
                <div className="col-span-4 px-8 py-8 text-[13px] font-medium text-red-600 dark:text-red-400 bg-red-50/30 dark:bg-red-900/5 border-l border-border leading-relaxed">{before}</div>
                <div className="col-span-4 px-8 py-8 text-[13px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/5 border-l border-border leading-relaxed italic">{after}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-8">
            <h2 className="text-2xl font-black text-deep-navy dark:text-white">Riyadh Areas Served</h2>
          </motion.div>
          <div className="flex flex-wrap gap-2 justify-center">
            {riyadhAreas.map((area, i) => (
              <motion.span key={area} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.04 } } }} className="px-4 py-2 rounded-full border border-border bg-white dark:bg-white/5 text-sm font-medium text-deep-navy dark:text-white">
                {area}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">What Riyadh Families Say</h2>
          </motion.div>
          <ParentTestimonials testimonials={testimonials} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">Riyadh Tutoring FAQs</h2>
          </motion.div>
          <SubjectFAQ items={faqs} />
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-8">
            <h2 className="text-2xl font-black text-deep-navy dark:text-white">More Regional Tutoring</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Online Tutors Dubai", href: "/uae/online-tutors-dubai", desc: "KHDA rated Dubai schools" },
              { name: "Online Tutors Abu Dhabi", href: "/uae/online-tutors-abu-dhabi", desc: "ADEK regulated Abu Dhabi" },
              { name: "Saudi Ministry Curriculum", href: "/uae/saudi-ministry-curriculum-tutors", desc: "Saudi MOE, Tawjihi, Qudurat" },
              { name: "MOE UAE Curriculum", href: "/uae/moe-uae-curriculum-tutors", desc: "UAE national schools, EmSAT" },
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
            <h2 className="text-3xl md:text-4xl font-black mb-4">Find the Right Tutor for Your Riyadh School</h2>
            <p className="text-white/70 mb-8 text-lg">BIS Riyadh, AISR, Manarat, Lycee Francais, IISR or Saudi government schools. Curriculum specialists for every Riyadh student.</p>
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
            StudyHours provides specialist online tutors for Riyadh students across all major curricula. We support students at British International School Riyadh (BIS Riyadh) preparing for IGCSE and Cambridge A-Level, American International School Riyadh (AISR) students preparing for AP examinations and SAT, Manarat International School students on IB MYP and IB DP programmes, Lycee Francais de Riyad for French Baccalaureate, and Indian International School Riyadh for CBSE Board examinations. For Saudi national curriculum students, we provide Arabic-medium tutoring for Tawjihi Grade 12 preparation, Qudurat aptitude test coaching, and Tahsili Sciences and Mathematics preparation for competitive university programmes at King Saud University, King Abdulaziz University, and other Saudi institutions. Riyadh operates on Arabia Standard Time and our tutors schedule sessions to accommodate the Saudi Sunday-to-Thursday school week. All sessions are online with interactive whiteboards and session recordings included.
          </p>
        </div>
      </section>
    </main>
  );
}
