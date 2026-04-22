"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../../components/subjects/ParentTestimonials";
import StickyCTA from "../../components/subjects/StickyCTA";
import SubjectFAQ from "../../components/subjects/SubjectFAQ";
import Image from "next/image";
import { Monitor, School, ArrowRight, ShieldCheck, Navigation } from "lucide-react";

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
    levels: "Key Stage 3, IGCSE, A-Level",
    schools: "BSAK, Cranleigh, Brighton College, Repton, Foremarke",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "International Baccalaureate",
    icon: "🌐",
    levels: "IB PYP, IB MYP, IB DP",
    schools: "GEMS World Academy, Raha International, The Haberdashers",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "MOE UAE National",
    icon: "🇦🇪",
    levels: "Cycle 1 (G1-4), Cycle 2 (G5-8), Cycle 3 (G9-12)",
    schools: "All Abu Dhabi government schools, ADEK-regulated national schools",
    color: "from-red-500 to-rose-600",
  },
  {
    name: "American / AP",
    icon: "🇺🇸",
    levels: "AP subjects, SAT preparation",
    schools: "American Community School (ACS) Abu Dhabi",
    color: "from-sky-500 to-blue-600",
  },
  {
    name: "CBSE (Indian)",
    icon: "🇮🇳",
    levels: "Grade 1-12, Board Examination",
    schools: "Indian schools Abu Dhabi, Al Ain Indian School",
    color: "from-orange-500 to-amber-600",
  },
  {
    name: "EmSAT Preparation",
    icon: "📊",
    levels: "English, Math, Physics, Chemistry, Biology",
    schools: "All UAE government and national school graduates",
    color: "from-violet-500 to-purple-600",
  },
];

const abuDhabiSchools = [
  "Cranleigh Abu Dhabi (IB DP / A-Level)",
  "British School Al Khubairat (IGCSE / A-Level)",
  "GEMS World Academy Abu Dhabi (IB MYP / DP)",
  "Raha International School (IB MYP / DP)",
  "The Haberdashers' School Abu Dhabi (British / IGCSE)",
  "Repton Abu Dhabi (British / IGCSE)",
  "Foremarke School Abu Dhabi (British / IGCSE)",
  "Brighton College Abu Dhabi (British / IGCSE)",
  "American Community School (ACS) Abu Dhabi (AP / American)",
  "Al Yasmina Academy (British / IGCSE)",
  "Bloom Education Schools (British / IGCSE)",
  "Abu Dhabi Grammar School (ADGS)",
  "Pakistan International School Abu Dhabi (Matric / IGCSE)",
  "Indian School Abu Dhabi (CBSE)",
  "Al Ain British School (British / IGCSE)",
  "All ADEK-regulated government schools (MOE UAE)",
];

const abuDhabiAreas = [
  "Saadiyat Island", "Al Reem Island", "Yas Island", "Khalifa City",
  "Khalidiyah", "Al Bateen", "Corniche", "Masdar City",
  "Al Maryah Island", "Mohammed Bin Zayed City", "Al Reef", "Al Ain",
  "Al Mushrif", "Tourist Club Area", "Al Zaab", "Shakhbout City",
];

const whyOnline = [
  {
    point: "Traffic across Abu Dhabi and Khalifa City corridors",
    detail: "Driving from Khalidiyah to Khalifa City for tutoring adds 45-60 minutes each way. Online sessions eliminate commute entirely.",
  },
  {
    point: "Curriculum specialists across all 6 curricula",
    detail: "No local tutor can cover IB, IGCSE, CBSE, AP, MOE UAE, and EmSAT with equal depth. Online access gives students the right specialist.",
  },
  {
    point: "Flexible scheduling around school activities",
    detail: "Abu Dhabi school days run Sunday to Thursday. Evening and weekend sessions fit around CCAs, family time, and the UAE working week.",
  },
  {
    point: "ADEK-regulated schools change syllabuses regularly",
    detail: "MOE UAE and ADEK school curricula update annually. Online tutors who specialise in UAE schools track these changes systematically.",
  },
  {
    point: "EmSAT preparation requires specific test-format training",
    detail: "EmSAT question formats differ from school continuous assessment. EmSAT-specialist tutors focus on the exact test structure.",
  },
  {
    point: "Transition students between curricula",
    detail: "Abu Dhabi families frequently move between schools and curricula. Specialist tutors help students transition from CBSE to IB or from UK to UAE national schools.",
  },
];

export default function AbuDhabiPageClient({ testimonials, faqs }: Props) {
  const { user } = useAuthContext();
  const ctaHref = user ? "/bookings/new" : "/signup?type=assessment";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <StickyCTA />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center bg-deep-navy py-20 px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={optimizeCloudinaryUrl("https://res.cloudinary.com/de8vvmpip/image/upload/v1776666577/A_soft__slightly_202604201159_dgge00.jpg")}
            alt="Abu Dhabi skyline and educational abstract background"
            fill
            className="object-cover opacity-60 scale-110"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-deep-navy/80 via-deep-navy/60 to-deep-navy" />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-sapphire/20 via-transparent to-transparent opacity-40 pointer-events-none" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[10px] font-black mb-6 tracking-[0.2em] uppercase text-white/90">
            <span>🇦🇪</span> ADEK Regulated Schools · All Abu Dhabi Curricula
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.1 } } }} 
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[0.95] uppercase drop-shadow-2xl text-white">
            Online Tutors <span className="text-ice-blue underline decoration-primary/30 underline-offset-8">Abu Dhabi</span>
          </motion.h1>
          <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.2 } } }} 
            className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-ice-blue to-primary italic mb-8 drop-shadow-sm">
            IB, IGCSE, British and MOE UAE
          </motion.div>
          <motion.p initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.2 } } }} className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-10 font-medium">
            Expert online tutors for Abu Dhabi students across every curriculum. Cranleigh, BSAK, GEMS, Raha International, ACS and all ADEK-regulated schools. EmSAT preparation included.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.3 } } }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ctaHref} className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-white font-black text-sm tracking-wide hover:bg-sapphire hover:scale-105 transition-all shadow-xl shadow-blue-500/30">
              Book Free Trial Lesson
            </Link>
            <a href="#curricula" className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-all">
              See Curricula Covered
            </a>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: 0.4 } } }} className="mt-10 flex flex-wrap justify-center gap-3 text-xs">
            {["IB DP and MYP", "IGCSE and A-Level", "MOE UAE Cycle 1-3", "American AP", "CBSE", "EmSAT Preparation"].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 font-medium">{tag}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Curricula Cards */}
      <section id="curricula" className="py-24 px-4 bg-background overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Comprehensive Coverage</span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-navy dark:text-white mb-6 tracking-tighter uppercase leading-[0.95]">
              Every Abu Dhabi <span className="text-primary italic">Curriculum</span> Covered
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto font-medium text-lg leading-relaxed">
              Abu Dhabi hosts over 200 private schools running six major curricula. StudyHours matches each student to a specialist in their exact curriculum and school.
            </p>
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
                className="group relative p-10 rounded-[3rem] bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-primary/30 transition-all overflow-hidden flex flex-col"
              >
                {/* Subtle Background Glow on Hover */}
                <div className="absolute inset-0 bg-linear-to-br from-sapphire/5 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-border shadow-sm flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      {c.icon}
                    </div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">
                      ADEK-MATCHED
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase leading-none italic group-hover:text-primary transition-colors">
                    {c.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <p className="text-[11px] font-black text-primary/70 uppercase tracking-widest">
                      {c.levels}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <p className="text-sm font-medium text-text-secondary dark:text-slate-400 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                      Specialist tutoring for students at {c.schools.split(',').length} major Abu Dhabi schools including {c.schools.split(',')[0]} and {c.schools.split(',')[1]}.
                    </p>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                       {c.schools.split(',').slice(0, 3).map((school, idx) => (
                         <span key={idx} className="px-3 py-1 rounded-full bg-slate-50 dark:bg-white/5 border border-border/50 text-[9px] font-bold text-text-secondary uppercase tracking-tight">
                           {school.trim()}
                         </span>
                       ))}
                       <span className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-bold text-primary uppercase tracking-tight italic">
                         + more
                       </span>
                    </div>
                  </div>

                  <div className="mt-12 flex items-center justify-between text-primary group-hover:translate-x-1 transition-transform duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest">Book Curriculum Specialist</span>
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

      {/* Why Online */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-4">Why Abu Dhabi Families Choose Online Tutoring</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyOnline.map((w, i) => (
              <motion.div
                key={w.point}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.08 } } }}
                className="group relative p-10 rounded-[3rem] bg-white dark:bg-slate-900/50 border border-border hover:shadow-2xl hover:border-primary/30 transition-all flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 font-black text-sm group-hover:scale-110 transition-transform shadow-sm border border-primary/20">
                  {i + 1}
                </div>
                <h3 className="text-xl font-black text-deep-navy dark:text-white mb-4 tracking-tighter uppercase leading-tight italic group-hover:text-primary transition-colors">
                  {w.point}
                </h3>
                <p className="text-[14px] text-text-secondary font-medium leading-relaxed opacity-80 italic">
                  {w.detail}
                </p>
                <div className="mt-8 pt-6 border-t border-border/30 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 text-primary">
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none">Abu Dhabi Optimized</span>
                  <ArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Abu Dhabi Schools */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">Abu Dhabi Schools We Support</h2>
            <p className="text-text-secondary">From ADEK Outstanding-rated private schools to government national schools</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-3">
            {abuDhabiSchools.map((school, i) => (
              <motion.div key={school} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.04 } } }} className="flex items-center gap-2 p-3 rounded-xl border border-border bg-white dark:bg-white/5 text-sm">
                <span className="text-primary text-xs font-black">✓</span>
                <span className="text-deep-navy dark:text-white font-medium text-xs">{school}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
              <div className="rounded-[3rem] overflow-hidden border border-border bg-white dark:bg-slate-900/50 shadow-2xl">
                <div className="grid grid-cols-12 bg-linear-to-r from-deep-navy to-sapphire text-white text-[10px] font-black uppercase tracking-[0.2em]">
                  <div className="col-span-12 px-8 py-6 flex items-center justify-between">
                    <span>Performance Trajectory</span>
                    <span className="text-emerald-400">ADEK Standard Excellence</span>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {[
                    {
                      lvl: "IB DP Year 2   Cranleigh",
                      without: "Predicted 4 in Chemistry HL. Internal Assessment incomplete. Extended Essay unstructured.",
                      with: "Final grade 6. IA criteria met. EE completed to 4000-word standard.",
                    },
                    {
                      lvl: "IGCSE Year 10   BSAK",
                      without: "A-Math extended paper method errors. Lost 30-40% on working marks.",
                      with: "A* in IGCSE Maths. Extended working fully marks-compliant.",
                    },
                    {
                      lvl: "EmSAT Math   Grade 12",
                      without: "School continuous assessment 75%. EmSAT practice tests failing at 400-450 range.",
                      with: "EmSAT Math score 900. UAEU Engineering minimum requirement met.",
                    },
                    {
                      lvl: "IB MYP   GEMS Abu Dhabi",
                      without: "Transitioning from CBSE. MYP Criteria A-D approach unfamiliar. Below class average.",
                      with: "Above class average. MYP criterion-based assessment approach mastered.",
                    },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-12 group border-t border-border first:border-0">
                      <div className="md:col-span-4 p-8 bg-slate-50/50 dark:bg-white/5 border-b md:border-b-0 md:border-r border-border">
                        <span className="text-[10px] font-black text-sapphire uppercase tracking-widest block mb-2">{row.lvl}</span>
                        <p className="text-xs font-bold text-deep-navy dark:text-white uppercase leading-tight tracking-tight">Academic Milestone</p>
                      </div>
                      <div className="md:col-span-4 p-8 bg-red-50/20 dark:bg-red-900/5 border-b md:border-b-0 md:border-r border-border group-hover:bg-red-50/40 transition-colors">
                        <span className="text-[8px] font-black text-red-500 uppercase tracking-widest block mb-4">Baseline Prediction</span>
                        <p className="text-[13px] text-text-secondary font-medium leading-relaxed italic">{row.without}</p>
                      </div>
                      <div className="md:col-span-4 p-8 bg-emerald-50/20 dark:bg-emerald-900/5 group-hover:bg-emerald-50/40 transition-colors">
                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest block mb-4">StudyHours Outcome</span>
                        <p className="text-[13px] text-deep-navy dark:text-white font-black leading-relaxed italic">{row.with}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

      {/* Areas */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-deep-navy dark:text-white mb-3">Serving All Abu Dhabi Areas</h2>
            <p className="text-text-secondary">Online means no commute. We support students in every Abu Dhabi neighbourhood.</p>
          </motion.div>
          <div className="flex flex-wrap gap-2 justify-center">
            {abuDhabiAreas.map((area, i) => (
              <motion.span key={area} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.04 } } }} className="px-4 py-2 rounded-full border border-border bg-white dark:bg-white/5 text-sm font-medium text-deep-navy dark:text-white">
                {area}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <ParentTestimonials testimonials={testimonials} />

      {/* FAQ */}
      <SubjectFAQ items={faqs} />

      {/* Internal Links */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-8">
            <h2 className="text-2xl font-black text-deep-navy dark:text-white">More UAE and Regional Tutoring</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Online Tutors Dubai", href: "/uae/online-tutors-dubai", desc: "KHDA regulated, all Dubai curricula" },
              { name: "Online Tutors Riyadh", href: "/saudi/online-tutors-riyadh", desc: "BIS, AISR, Saudi MOE" },
              { name: "MOE UAE Curriculum", href: "/uae/moe-uae-curriculum-tutors", desc: "UAE national schools, EmSAT" },
              { name: "Saudi Ministry Curriculum", href: "/saudi/saudi-ministry-curriculum-tutors", desc: "Tawjihi and Qudurat prep" },
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
            <h2 className="text-3xl md:text-4xl font-black mb-4">Find the Right Tutor for Your Abu Dhabi School</h2>
            <p className="text-white/70 mb-8 text-lg">IB, IGCSE, British, American, CBSE or MOE UAE. Cranleigh, BSAK, GEMS, Raha or any ADEK school. Free trial lesson with a curriculum specialist.</p>
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
            StudyHours provides expert online tutors for Abu Dhabi students across all major curricula. We support students at Cranleigh Abu Dhabi (IB DP and A-Level), British School Al Khubairat (IGCSE and A-Level), GEMS World Academy Abu Dhabi (IB MYP and DP), Raha International School (IB), The Haberdashers School Abu Dhabi, Repton Abu Dhabi, Brighton College Abu Dhabi, Foremarke School Abu Dhabi, and American Community School (ACS) Abu Dhabi. For MOE UAE government school students across Abu Dhabi, Al Ain, and Al Dhafra, we provide Arabic-medium and bilingual tutoring in Arabic Language, Islamic Education, Mathematics, Sciences, and Moral Education aligned to Cycle 1, Cycle 2, and Cycle 3 ADEK requirements. Our EmSAT preparation specialists help Grade 12 students meet minimum score thresholds for UAE University, Zayed University, and Higher Colleges of Technology programme admission. StudyHours tutors serve students in Saadiyat Island, Al Reem Island, Yas Island, Khalifa City, Khalidiyah, Al Bateen, Masdar City, Al Ain, and all other Abu Dhabi communities.
          </p>
        </div>
      </section>
    </main>
  );
}
