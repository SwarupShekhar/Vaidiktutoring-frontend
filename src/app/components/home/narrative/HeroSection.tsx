"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/app/context/AuthContext";
import { useCurriculum } from "@/app/context/CurriculumContext";
import { CURRICULA } from "@/app/config/curricula";
import {
  ShieldCheck,
  Star,
  Globe,
  ArrowRight,
  ChevronDown,
  Users,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

/* ─── Hero images: rotating showcase ─── */
const HERO_IMAGES = [
  "https://res.cloudinary.com/de8vvmpip/image/upload/v1772453122/Gemini_Generated_Image_9j0g679j0g679j0g_sptjdf.png",
  "https://res.cloudinary.com/de8vvmpip/image/upload/v1772452861/Gemini_Generated_Image_nrmu60nrmu60nrmu_bemjk1.png",
  "https://res.cloudinary.com/de8vvmpip/image/upload/c_crop,g_north_west,h_1373,w_2816/c_crop,g_north_west,h_1536,w_2816/Gemini_Generated_Image_shisp6shisp6shis_hdvdyh.png",
];

/* ─── Word-by-word headline animation ─── */
const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.6,
      ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
    },
  }),
};

/* ─── Trust bar stats ─── */
const TRUST_STATS = [
  { icon: Users, label: "200+ Vetted Tutors", color: "text-primary" },
  { icon: ShieldCheck, label: "Background Checked", color: "text-emerald-500" },
  { icon: Star, label: "4.9/5 Parent Rating", color: "text-amber-500" },
  { icon: Globe, label: "Students in 30+ Countries", color: "text-blue-500" },
];

export default function HeroSection() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { activeCurriculum, setCurriculum } = useCurriculum();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextImage, 4500);
    return () => clearInterval(interval);
  }, [nextImage]);

  const headline = activeCurriculum.hero;
  const words = headline.split(" ");


  const handleScroll = () => {
    const howSection = document.getElementById("how-it-works");
    if (howSection) {
      howSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-indigo-50/30 dark:from-primary/10 dark:via-background dark:to-indigo-950/20" />

      {/* Floating ambient orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-72 h-72 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300/10 dark:bg-indigo-700/5 rounded-full blur-3xl"
      />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full py-28 lg:py-0">
          {/* ─── Left: Copy + CTA ─── */}
          <div className="flex flex-col justify-center">
            {/* Geo-detection banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 dark:bg-primary/15 border border-primary/20">
                <Sparkles size={14} className="text-primary" />
                <span className="text-xs font-semibold text-primary">
                  Detected: {activeCurriculum.flag} {activeCurriculum.country}
                </span>
                <button
                  onClick={() => setIsCurriculumOpen(!isCurriculumOpen)}
                  className="text-xs font-bold text-primary/70 hover:text-primary underline underline-offset-2 cursor-pointer transition-colors"
                >
                  Change
                </button>
              </div>
            </motion.div>

            {/* Curriculum selector (expandable) */}
            <AnimatePresence>
              {isCurriculumOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-surface border border-border/50 shadow-lg">
                    {CURRICULA.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setCurriculum(c.id);
                          setIsCurriculumOpen(false);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                          activeCurriculum.id === c.id
                            ? "bg-primary text-white shadow-md shadow-primary/25"
                            : "bg-background hover:bg-primary/10 text-foreground border border-border/50 hover:border-primary/30"
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.country}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Animated headline */}
            <h1 className="mb-6 flex flex-wrap gap-x-3 gap-y-1">
              {words.map((word, i) => (
                <motion.span
                  key={`${activeCurriculum.id}-${i}`}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={wordVariants}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-black tracking-tighter leading-[1.08] text-foreground"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subtitle */}
            <motion.p
              key={`sub-${activeCurriculum.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed max-w-lg mb-8"
            >
              {activeCurriculum.subline}
            </motion.p>

            {/* CTA group */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4"
            >
              <Link
                href={user ? "/bookings/new" : "/login?redirect=/bookings/new"}
                className="group flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-full font-bold text-base tracking-tight shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                Book a Free Trial Lesson
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>
              <Link
                href="/contact"
                className="px-6 py-4 text-foreground font-semibold text-sm rounded-full border-2 border-border hover:border-foreground hover:bg-foreground/5 transition-all duration-200 cursor-pointer"
              >
                Speak with an Advisor
              </Link>
            </motion.div>

            {/* Micro-copy reassurance */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary/70"
            >
              <span className="flex items-center gap-1">
                <BadgeCheck size={13} className="text-emerald-500" />
                No credit card required
              </span>
              <span className="hidden sm:inline text-border">•</span>
              <span>Vetted Professional Tutors</span>
              <span className="hidden sm:inline text-border">•</span>
              <motion.span 
                animate={{ 
                  scale: [1, 1.05, 1],
                  filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="flex items-center gap-1.5 font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 shadow-[0_0_20px_rgba(79,70,229,0.25)] dark:shadow-[0_0_20px_rgba(129,140,248,0.3)] cursor-default"
              >
                <Sparkles size={12} className="text-primary animate-pulse" />
                {activeCurriculum.pricingHint}
              </motion.span>
            </motion.div>
          </div>

          {/* ─── Right: Image showcase ─── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: "easeOut" }}
            className="relative flex items-center justify-center w-full"
          >
            <div className="relative w-full">
              {/* Glow behind image */}
              <div className="absolute inset-0 scale-90 bg-linear-to-br from-primary/15 via-indigo-400/10 to-pink-400/5 dark:from-primary/10 dark:via-indigo-600/5 dark:to-pink-600/3 rounded-3xl blur-2xl" />

              {/* Main image container */}
              <div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 dark:shadow-primary/5 z-10 border border-white/20 dark:border-white/5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={HERO_IMAGES[currentImageIndex]}
                      alt="Student and tutor in a focused online learning session"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={currentImageIndex === 0}
                    />
                  </motion.div>
                </AnimatePresence>
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating thumbnail — top left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: -3 }}
                whileHover={{ scale: 1.08, rotate: 0, zIndex: 40 }}
                transition={{ delay: 1.0, duration: 0.7 }}
                className="absolute -top-10 -left-6 w-32 h-24 md:w-36 md:h-28 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 dark:border-slate-800/90 z-20 hidden md:block cursor-pointer"
              >
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/v1776075731/Photorealistic_photo_of_202604131551_met4fe.jpg"
                  alt="Student learning"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </motion.div>

              {/* Floating thumbnail — bottom right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 3 }}
                whileHover={{ scale: 1.08, rotate: 0, zIndex: 40 }}
                transition={{ delay: 1.3, duration: 0.7 }}
                className="absolute bottom-8 -right-10 w-32 h-24 md:w-36 md:h-28 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 dark:border-slate-800/90 z-20 hidden md:block cursor-pointer"
              >
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/v1776076443/Real_photograph_style__202604131603_quzpl2.jpg"
                  alt="Online tutoring session"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </motion.div>

              {/* Exam badge pills */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="absolute -bottom-5 left-6 hidden md:flex items-center gap-2 z-30"
              >
                {activeCurriculum.exams.slice(0, 4).map((exam) => (
                  <span
                    key={exam}
                    className="px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-bold text-foreground rounded-full shadow-lg border border-white/60 dark:border-slate-700/60"
                  >
                    {exam}
                  </span>
                ))}
                {activeCurriculum.exams.length > 4 && (
                  <span className="px-3 py-1.5 bg-primary/10 backdrop-blur-md text-xs font-bold text-primary rounded-full shadow-lg border border-primary/20">
                    +{activeCurriculum.exams.length - 4} more
                  </span>
                )}
              </motion.div>

              {/* Image nav dots */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {HERO_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      i === currentImageIndex
                        ? "bg-primary w-6"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 w-2"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Trust Bar ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto px-6 pb-12"
      >
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 py-6 px-8 rounded-2xl bg-surface/80 dark:bg-surface/60 backdrop-blur-md border border-border/30 shadow-lg">
          {TRUST_STATS.map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 group"
            >
              <stat.icon
                size={18}
                className={`${stat.color} group-hover:scale-110 transition-transform duration-200`}
              />
              <span className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.5 }}
        onClick={handleScroll}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity z-20"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-secondary/50">
          See how it works
        </span>
        <ChevronDown size={16} className="text-text-secondary/40 animate-bounce" />
      </motion.div>
    </section>
  );
}
