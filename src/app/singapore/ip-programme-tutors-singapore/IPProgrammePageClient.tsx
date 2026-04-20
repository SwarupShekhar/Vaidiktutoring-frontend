"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../../components/subjects/ParentTestimonials";
import StickyCTA from "../../components/subjects/StickyCTA";
import SubjectFAQ from "../../components/subjects/SubjectFAQ";
import { Monitor, School, ArrowRight, GraduationCap, Target, ShieldCheck, CheckCircle2 } from "lucide-react";

type FAQItemType = { q: string; a: string };

interface Props {
  testimonials: { text: string; author: string; role: string; rating: number }[];
  faqs: FAQItemType[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ipSchools = [
  {
    name: "Raffles Institution (RI)",
    short: "RI",
    type: "Co-ed",
    notable: "Heavy analytical essays, interdisciplinary projects, Research Education (RE) modules.",
    years: "IP Year 1–4, then RIJC for Year 5–6",
    color: "from-red-500 to-rose-600",
  },
  {
    name: "Raffles Girls' School (RGS)",
    short: "RGS",
    type: "Girls",
    notable: "Inquiry-based learning, strong Arts integration, Raffles Academy for gifted students.",
    years: "IP Year 1–4, then RGS JC (RIJC) Year 5–6",
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "Hwa Chong Institution (HCI)",
    short: "HCI",
    type: "Co-ed (Chinese-medium heritage)",
    notable: "Bilingual IP curriculum, Bicultural Studies Programme (BSP), strong Sciences.",
    years: "IP Year 1–6 (internal JC programme)",
    color: "from-blue-600 to-indigo-700",
  },
  {
    name: "Victoria School (VS)",
    short: "VS",
    type: "Boys",
    notable: "Values-in-Action heavy, Victoria-Cedar Alliance for Y5–6 at Cedar Girls'/VJCI.",
    years: "IP Year 1–4, then VJC/VCAA Year 5–6",
    color: "from-emerald-600 to-teal-700",
  },
  {
    name: "Dunman High School",
    short: "DHS",
    type: "Co-ed (Chinese-medium heritage)",
    notable: "Bilingual IP, strong Mathematics and Sciences. Dunman High produces consistent A-Level distinctions.",
    years: "IP Year 1–6 (internal JC)",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "St. Joseph's Institution (SJI)",
    short: "SJI",
    type: "Boys (Catholic)",
    notable: "Learning for Life programme, strong Humanities, International Baccalaureate offered alongside IP.",
    years: "IP Year 1–4, then SJI International or ACJC Year 5–6",
    color: "from-slate-600 to-slate-700",
  },
  {
    name: "Catholic High School (CHS)",
    short: "CHS",
    type: "Boys (Chinese-medium heritage)",
    notable: "Bicultural Studies Programme. Bilingual IP curriculum. Feeds into NYJC for A-Levels.",
    years: "IP Year 1–4, then NYJC Year 5–6",
    color: "from-purple-600 to-violet-700",
  },
  {
    name: "CHIJ St. Nicholas Girls' School",
    short: "SNGS",
    type: "Girls (Catholic)",
    notable: "Holistic education emphasis. Linked to ACJC for Year 5–6. Social enterprise IP modules.",
    years: "IP Year 1–4, then ACJC Year 5–6",
    color: "from-teal-500 to-cyan-600",
  },
  {
    name: "Anglo-Chinese School (Independent)",
    short: "ACS(I)",
    type: "Boys (Methodist)",
    notable: "International Baccalaureate pathway available alongside IP A-Level. Strong Humanities and Maths.",
    years: "IP Year 1–6 (IB or A-Level at Year 5–6)",
    color: "from-sky-500 to-blue-600",
  },
  {
    name: "Methodist Girls' School (MGS)",
    short: "MGS",
    type: "Girls (Methodist)",
    notable: "Holistic IP curriculum. Linked to ACJC for Year 5–6.",
    years: "IP Year 1–4, then ACJC Year 5–6",
    color: "from-indigo-500 to-blue-600",
  },
  {
    name: "NUS High School of Math & Science",
    short: "NUS High",
    type: "Co-ed",
    notable: "STEM-focused. NUS High Diploma instead of A-Level. Modular curriculum, research-heavy.",
    years: "IP Year 1–6 (NUS High Diploma, not SEAB A-Level)",
    color: "from-orange-500 to-amber-600",
  },
  {
    name: "School of the Arts (SOTA)",
    short: "SOTA",
    type: "Co-ed",
    notable: "Arts-integrated IP. SOTA Diploma pathway alongside A-Level. Ballet, Music, Theatre, Visual Arts.",
    years: "IP Year 1–6 (SOTA Diploma + A-Level option)",
    color: "from-fuchsia-500 to-pink-600",
  },
  {
    name: "Nanyang Girls' High School (NYGH)",
    short: "NYGH",
    type: "Girls (Chinese-medium heritage)",
    notable: "Bilingual IP, Bicultural Studies. Strong Mathematics. Connected to HCI for Year 5–6.",
    years: "IP Year 1–4, then HCI Year 5–6",
    color: "from-green-500 to-emerald-600",
  },
];

const ipVsExpress = [
  {
    aspect: "O-Level examination",
    express: "Mandatory. O-Level grades determine JC entry via L1R5.",
    ip: "Not taken. Internal school assessments in Years 1–4 instead.",
  },
  {
    aspect: "Curriculum design",
    express: "National O-Level syllabus set by SEAB / MOE.",
    ip: "Each IP school designs own Y1–4 curriculum. No national standard.",
  },
  {
    aspect: "Assessment format",
    express: "Standardised O-Level paper formats for all Express students.",
    ip: "School-specific. RI, RGS, HCI assessments differ significantly from each other.",
  },
  {
    aspect: "Depth and breadth",
    express: "Content bounded by O-Level syllabus requirements.",
    ip: "Goes beyond O-Level depth. Higher-order thinking, interdisciplinary projects, research.",
  },
  {
    aspect: "Tutor requirements",
    express: "Any O-Level specialist tutor works for content and exam prep.",
    ip: "Must know specific school's assessment style   a generic tutor won't understand RI or RGS formats.",
  },
  {
    aspect: "Year 5–6 (JC1–JC2)",
    express: "Enter JC1 after O-Level results. Start A-Level content fresh.",
    ip: "IP students continue seamlessly from Y4 to Y5   no O-Level disruption. Earlier start on A-Level depth.",
  },
];

const dsaInfo = [
  {
    phase: "DSA Portfolio",
    detail: "Students present a portfolio of achievements   academics, CCAs, external competitions, leadership. Different IP schools weight these differently. RI and HCI prioritise academic competition results. SJI and VS give heavier weight to holistic achievements.",
  },
  {
    phase: "Talent Area Tests",
    detail: "Most IP schools test in the student's declared talent area: Mathematics, Sciences, Humanities, Arts, Sports, or Leadership. Math DSA typically involves problem-solving that goes beyond PSLE   number theory, geometry, combinatorics.",
  },
  {
    phase: "Interview",
    detail: "Shortlisted candidates interview at the school. Interviews assess character, values alignment, and independent thinking. RGS interviews assess communication clarity. NYGH and Dunman High ask bilingual candidates to interview partially in Mandarin.",
  },
  {
    phase: "Offer and Acceptance",
    detail: "DSA offers are typically conditional on achieving PSLE scores above certain thresholds. A student can hold only one DSA offer. StudyHours tutors help students prepare both academically and in terms of interview readiness.",
  },
];

const ipSubjectsByYear = [
  {
    years: "IP Year 1–2 (Sec 1–2 equivalent)",
    subjects: ["English Language (school-designed composition and comprehension)", "Mathematics (enriched beyond O-Level   proof, number theory introduced)", "Sciences (integrated, project-based   no separate Bio/Chem/Phys papers)", "Mother Tongue Language (CL/ML/TL)", "Humanities (integrated Social Studies + History/Geography/Literature)", "IP-specific interdisciplinary modules"],
  },
  {
    years: "IP Year 3–4 (Sec 3–4 equivalent)",
    subjects: ["English (school-specific essay and critical thinking formats)", "Mathematics (school-specific approach to Additional Math concepts)", "Pure Sciences (Biology, Chemistry, Physics   school-designed, not O-Level)", "Humanities (Pure History / Geography / Literature   school-specific assessment)", "Mother Tongue (CL/ML/TL   school paced)", "Research Education / Guided Research modules (RI, RGS, HCI)"],
  },
  {
    years: "IP Year 5–6 (JC1–JC2 / A-Level)",
    subjects: ["H2 Mathematics, H2 Physics, H2 Chemistry, H2 Biology (SEAB syllabus)", "H2 Economics, H2 History, H2 Geography, H2 Literature (SEAB syllabus)", "H1 General Paper (same as mainstream JC)", "H1 Project Work (same as mainstream JC)", "H1/H2 Mother Tongue (same as mainstream JC)", "H3 extension subjects for top students"],
  },
];

export default function IPProgrammePageClient({ testimonials, faqs }: Props) {
  const { user } = useAuthContext();
  const ctaHref = user ? "/bookings/new" : "/signup?type=assessment";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <StickyCTA />

      {/* Hero */}
      <section className="relative bg-linear-to-br from-deep-navy via-[#0d1f3c] to-[#091428] text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-violet-400 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold mb-6 tracking-wide">
            <span>🎓</span> Singapore Integrated Programme   All 13 IP Schools
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.1 } } }} className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
            IP Programme Tutors<br />
            <span className="text-ice-blue">Singapore Online</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.2 } } }} className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Specialist online tutors for Singapore's Integrated Programme (IP)   all 13 schools including RI, RGS, HCI, Dunman High, SJI, and NYGH. School-specific internal assessments for IP Year 1–4. A-Level preparation for IP Year 5–6. No O-Level pressure.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.3 } } }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ctaHref} className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-white font-black text-sm tracking-wide hover:bg-sapphire hover:scale-105 transition-all shadow-xl shadow-blue-500/30">
              Book Free Trial Lesson
            </Link>
            <a href="#schools" className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-all">
              See All 13 IP Schools ↓
            </a>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.4 } } }} className="mt-10 flex flex-wrap justify-center gap-3 text-xs">
            {["RI / RGS / HCI", "Dunman High / SJI / VS", "ACS(I) / MGS / NYGH", "NUS High / SOTA / SNGS", "DSA Preparation", "IP Year 1–6 Specialists"].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 font-medium">{tag}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What is IP */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="group relative rounded-[3rem] p-10 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-violet-500/30 transition-all overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-2 h-8 bg-violet-600 rounded-full" />
                <h2 className="text-3xl font-black text-deep-navy dark:text-white tracking-tighter uppercase italic">The IP Framework Architecture</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8 text-sm">
                <div className="p-8 rounded-4xl bg-violet-50/50 dark:bg-white/5 border border-violet-100/50 dark:border-violet-800/20 group/inner">
                  <p className="font-black text-violet-600 dark:text-violet-400 mb-4 uppercase tracking-widest text-[10px]">Phase 01: Through-Train</p>
                  <p className="text-text-secondary leading-relaxed italic">IP students enter Secondary 1 and progress directly to JC2 without the O-Level disruption. They sit only the GCE A-Level at Year 6.</p>
                </div>
                <div className="p-8 rounded-4xl bg-violet-50/50 dark:bg-white/5 border border-violet-100/50 dark:border-violet-800/20 group/inner">
                  <p className="font-black text-violet-600 dark:text-violet-400 mb-4 uppercase tracking-widest text-[10px]">Phase 02: Custom Syllabi</p>
                  <p className="text-text-secondary leading-relaxed italic">Each of the 13 IP schools designs its own unique curriculum for Years 1–4. There is no national O-Level standard to follow.</p>
                </div>
                <div className="p-8 rounded-4xl bg-violet-50/50 dark:bg-white/5 border border-violet-100/50 dark:border-violet-800/20 group/inner">
                  <p className="font-black text-violet-600 dark:text-violet-400 mb-4 uppercase tracking-widest text-[10px]">Phase 03: RP Integration</p>
                  <p className="text-text-secondary leading-relaxed italic">From Year 5, IP students sync with the national A-Level H1/H2/H3 syllabus. University entry follows the standard Rank Point system.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* IP vs Express */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">IP vs Express Stream   Key Differences</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Understanding why IP students need school-specific tutors rather than standard O-Level tutors</p>
          </motion.div>
          <div className="rounded-[3.5rem] overflow-hidden border border-border/60 shadow-2xl bg-white dark:bg-slate-900/50 relative group">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="grid grid-cols-3 bg-deep-navy text-white text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
              <div className="px-8 py-6">Comparison Aspect</div>
              <div className="px-8 py-6 border-l border-white/10 italic text-blue-400">Express Track</div>
              <div className="px-8 py-6 border-l border-white/10 italic text-violet-400">Integrated Programme (IP)</div>
            </div>
            {ipVsExpress.map((row, i) => (
              <div key={row.aspect} className={`grid grid-cols-3 border-t border-border group relative z-10 ${i % 2 === 0 ? 'bg-white/50 dark:bg-white/5' : 'bg-transparent'}`}>
                <div className="px-8 py-8 text-sm font-black text-deep-navy dark:text-white uppercase tracking-tighter italic flex items-center">
                   {row.aspect}
                </div>
                <div className="px-8 py-8 text-[13px] font-medium text-text-secondary border-l border-border italic leading-relaxed">
                  {row.express}
                </div>
                <div className="px-8 py-8 text-[13px] font-black text-violet-700 dark:text-violet-400 bg-violet-500/4 border-l border-border italic leading-relaxed">
                  {row.ip}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All 13 IP Schools */}
      <section id="schools" className="py-16 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-deep-navy dark:text-white mb-4">All 13 Singapore IP Schools   What Our Tutors Know</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Each IP school designs unique internal assessments. Our tutors know the specific approach at each school   not just generic content.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ipSchools.map((school, i) => (
              <motion.div
                key={school.short}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  ...fadeUp,
                  visible: {
                    ...fadeUp.visible,
                    transition: { duration: 0.5, delay: i * 0.07 },
                  },
                }}
                className="group relative rounded-[3rem] p-10 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-violet-500/30 transition-all overflow-hidden"
              >
                {/* Accent Gradient */}
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-linear-to-r ${school.color}`} />
                
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 rounded-3xl bg-violet-50 dark:bg-white/10 flex items-center justify-center text-sm font-black text-violet-600 shadow-sm border border-violet-500/10 uppercase">
                      {school.short}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-violet-500/30 group-hover:text-violet-500/60 transition-colors uppercase tracking-[0.3em]">
                        {school.type}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter uppercase leading-tight italic group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {school.name}
                  </h3>

                  <div className="space-y-6 mb-10">
                    <div className="p-5 rounded-2xl bg-violet-50/50 dark:bg-violet-900/10 border border-violet-100/50 dark:border-violet-800/30 hover:bg-violet-50 transition-all group/box">
                      <div className="flex items-center gap-3 mb-3">
                        <Monitor size={14} className="text-violet-600" />
                        <p className="text-[10px] font-black text-violet-700 dark:text-violet-300 uppercase tracking-widest leading-none">Notable Focus</p>
                      </div>
                      <p className="text-sm font-bold text-deep-navy/80 dark:text-slate-300 leading-tight uppercase tracking-tight italic opacity-90">
                        {school.notable}
                      </p>
                    </div>

                    <div className="px-2">
                      <div className="flex items-center gap-3 mb-4">
                        <School size={14} className="text-slate-400" />
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] leading-none">Academic Pathway</p>
                      </div>
                      <p className="text-[13px] font-bold text-text-secondary dark:text-slate-400 leading-relaxed italic">{school.years}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-8 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 text-violet-500">
                    <span className="text-[9px] font-black uppercase tracking-widest">Matched school-specialist available</span>
                    <ArrowRight size={14} />
                  </div>
                </div>

                {/* Bottom Interactive Line */}
                <div className="absolute bottom-0 left-10 right-10 h-1 bg-violet-500/10 group-hover:bg-violet-500/40 transition-all duration-700 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IP Subjects by Year */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-4">IP Curriculum by Year   What Students Study</h2>
          </motion.div>
          <div className="space-y-6">
            {ipSubjectsByYear.map((group, i) => (
              <motion.div key={group.years} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.1 } } }} className="rounded-2xl border border-border bg-white dark:bg-white/5 overflow-hidden">
                <div className="px-6 py-4 bg-primary/5 border-b border-border">
                  <h3 className="font-black text-deep-navy dark:text-white">{group.years}</h3>
                </div>
                <div className="px-6 py-4 grid sm:grid-cols-2 gap-2">
                  {group.subjects.map((s) => (
                    <div key={s} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-primary shrink-0 mt-0.5 text-xs">✓</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DSA Guide */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">DSA   The Route Into Singapore's IP Schools</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Direct School Admission (DSA) is the primary entry route to most IP schools. Our tutors help students prepare academically and for the DSA process.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {dsaInfo.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.1 } } }}
                className="group relative rounded-[3rem] p-10 bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-primary/30 transition-all overflow-hidden flex flex-col"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg shadow-sm border border-primary/20 group-hover:scale-110 transition-transform">
                      0{i + 1}
                    </div>
                    <h3 className="text-xl font-black text-deep-navy dark:text-white tracking-tighter uppercase italic">{phase.phase}</h3>
                  </div>
                  <p className="text-[14px] text-text-secondary font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                    {phase.detail}
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-primary/10 to-transparent -translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* When to Start */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">When Should an IP Student Start Tutoring?</h2>
          </motion.div>
          <div className="space-y-4">
            {[
              { when: "IP Year 1 (Sec 1 equivalent)   Ideal Start", why: "The transition from PSLE pressure to IP's breadth-and-depth curriculum is jarring. Top PSLE scorers are often surprised. IP Year 1 is when foundations for all 6 years are set. Starting here prevents compounding of gaps.", urgency: "critical" },
              { when: "IP Year 3 (when school-specific assessments intensify)", why: "Year 3 is when IP schools typically introduce their most distinctive assessment formats. This is when a school-specific tutor is most valuable   they know what RI, RGS, or HCI actually tests.", urgency: "high" },
              { when: "IP Year 5 (JC1 / A-Level content begins)", why: "IP Year 5 is effectively JC1. The jump from Y4 school-designed content to A-Level H2 depth is steep. H2 Math, H2 Chemistry, and H2 Physics tutors must understand IP-specific internal assessment formats within A-Level content.", urgency: "high" },
              { when: "IP Year 6 (JC2 / A-Level examination year)", why: "Standard A-Level examination preparation   same as mainstream JC. GP, Project Work, and maximising university Rank Points remain critical. IP Year 6 students still benefit from tutors who know their school's Prelim formats.", urgency: "medium" },
            ].map((item, i) => (
              <motion.div key={item.when} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.08 } } }} className="flex gap-4 p-5 rounded-2xl border border-border bg-white dark:bg-white/5">
                <div className={`mt-0.5 px-2 py-1 rounded text-xs font-black shrink-0 h-fit ${item.urgency === "critical" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : item.urgency === "high" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400"}`}>
                  {item.urgency.toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-deep-navy dark:text-white text-sm mb-1">{item.when}</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.why}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">Before and After StudyHours IP Tutoring</h2>
          </motion.div>
          <div className="rounded-[3.5rem] overflow-hidden border border-border/60 shadow-2xl bg-white dark:bg-slate-900/50 relative group">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="grid grid-cols-3 bg-deep-navy text-white text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
              <div className="px-8 py-6">Year / School Target</div>
              <div className="px-8 py-6 border-l border-white/10 italic text-red-400">Baseline Prep</div>
              <div className="px-8 py-6 border-l border-white/10 italic text-emerald-400">Post-Tutoring Delta</div>
            </div>
            {[
              ["IP Year 1   RI", "Shocked by depth gap from PSLE. Math proofs unfamiliar. English analytical demands overwhelming.", "Adapted to RI's assessment style. End-of-year results above midyear. Foundational confidence restored."],
              ["IP Year 3   RGS", "Below median. Tutor using O-Level materials   mismatched to RGS interdisciplinary format.", "RGS internal assessment format understood. Project component guidance. Median rank regained."],
              ["IP Year 5   HCI", "H2 Math failing at HCI Promos level. School-specific internal format not understood.", "Distinction at HCI Promos. HCI-specific question formats and marking approach mastered."],
              ["IP Year 6   Dunman High", "RP 68 predicted from Prelims. First-choice NUS course cutoff RP 77.", "A-Level RP 79. NUS Accountancy offer accepted. GP and H2 Economics uplift decisive."],
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
                    <span className="text-[10px] uppercase tracking-widest text-emerald-500/60">Success</span>
                  </div>
                  {after}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">What IP Parents Say</h2>
            <p className="text-text-secondary">Feedback from parents at RI, RGS, and HCI</p>
          </motion.div>
          <ParentTestimonials testimonials={testimonials} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">IP Programme Singapore   Frequently Asked Questions</h2>
          </motion.div>
          <SubjectFAQ items={faqs} />
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-8">
            <h2 className="text-2xl font-black text-deep-navy dark:text-white">Explore Other Singapore Tutoring Pages</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "A-Level Tutors Singapore", href: "/singapore/a-level-tutors-singapore", desc: "H1/H2/H3 and RP strategy" },
              { name: "O-Level Tutors Singapore", href: "/singapore/o-level-tutors-singapore", desc: "Sec 3–5 L1R5 preparation" },
              { name: "PSLE Tutors Online", href: "/singapore/psle-tutors-online", desc: "P4–P6 AL1 target prep" },
              { name: "MOE Curriculum Overview", href: "/singapore/moe-singapore-curriculum-tutors", desc: "Full Singapore pathway" },
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
            <h2 className="text-3xl md:text-4xl font-black mb-4">Find a Tutor Who Knows Your IP School</h2>
            <p className="text-white/70 mb-8 text-lg">RI, RGS, HCI, Dunman High, SJI, Victoria School, ACS(I), NYGH, and all 13 IP schools. School-specific assessment preparation from IP Year 1 to A-Level Year 6.</p>
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
            StudyHours provides specialist online tutors for Singapore's Integrated Programme (IP) at all 13 IP schools: Raffles Institution (RI), Raffles Girls' School (RGS), Hwa Chong Institution (HCI), Victoria School (VS), Dunman High School, St. Joseph's Institution (SJI), Catholic High School (CHS), CHIJ St. Nicholas Girls' School, Anglo-Chinese School Independent (ACS(I)), Methodist Girls' School (MGS), NUS High School of Mathematics and Science, School of the Arts (SOTA), and Nanyang Girls' High School (NYGH). Our IP tutors understand the critical difference between IP and Express stream assessment   IP schools design their own internal assessments for Years 1 to 4, bypassing the O-Level entirely. A tutor who knows only SEAB O-Level content will not understand RI's interdisciplinary project formats, RGS's analytical inquiry approach, HCI's bilingual curriculum, or Dunman High's internal assessment design. StudyHours IP tutors are selected for school-specific knowledge of internal assessment formats, DSA preparation in Mathematics and Sciences, and A-Level H1/H2/H3 depth for IP Years 5 and 6. Whether your child is in IP Year 1 struggling with the PSLE-to-IP transition, IP Year 3 facing school-specific examinations, or IP Year 5 starting the A-Level curriculum   a school-specific IP tutor is the right choice.
          </p>
        </div>
      </section>
    </main>
  );
}
