"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import BookSessionButton from "../BookSessionButton";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/app/context/AuthContext";
import { useCurriculum } from "@/app/context/CurriculumContext";
import { 
  Star, 
  Pencil, 
  BookOpen, 
  Calculator, 
  Atom, 
  Brain, 
  Music, 
  FlaskConical, 
  Globe, 
  Compass 
} from "lucide-react";

const DOODLES = [
  { icon: Pencil, color: "text-purple-400/30", size: 24, top: "15%", left: "10%", delay: 0 },
  { icon: Compass, color: "text-indigo-400/25", size: 28, top: "25%", left: "45%", delay: 1 },
  { icon: Calculator, color: "text-pink-400/30", size: 22, top: "70%", left: "8%", delay: 2 },
  { icon: Atom, color: "text-blue-400/25", size: 30, top: "12%", left: "85%", delay: 3 },
  { icon: Brain, color: "text-purple-400/30", size: 26, top: "50%", left: "92%", delay: 1.5 },
  { icon: Music, color: "text-indigo-400/30", size: 24, top: "82%", left: "40%", delay: 0.5 },
  { icon: FlaskConical, color: "text-pink-400/25", size: 28, top: "88%", left: "82%", delay: 2.5 },
  { icon: Globe, color: "text-blue-400/30", size: 26, top: "40%", left: "55%", delay: 4 },
  { icon: BookOpen, color: "text-purple-400/25", size: 24, top: "65%", left: "58%", delay: 1.2 },
];

const HERO_IMAGES = [
  "https://res.cloudinary.com/de8vvmpip/image/upload/v1772453122/Gemini_Generated_Image_9j0g679j0g679j0g_sptjdf.png",
  "https://res.cloudinary.com/de8vvmpip/image/upload/v1772452861/Gemini_Generated_Image_nrmu60nrmu60nrmu_bemjk1.png",
  "https://res.cloudinary.com/de8vvmpip/image/upload/c_crop,g_north_west,h_1373,w_2816/c_crop,g_north_west,h_1536,w_2816/Gemini_Generated_Image_shisp6shisp6shis_hdvdyh.png",
];

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.7,
      ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
    },
  }),
};

export default function HeroSection() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { activeCurriculum } = useCurriculum();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextImage, 4000);
    return () => clearInterval(interval);
  }, [nextImage]);

  const headline = activeCurriculum.hero;
  const words = headline.split(" ");

  const handleBookSession = () => {
    if (user) {
      router.push("/bookings/new");
    } else {
      router.push("/login?redirect=/bookings/new");
    }
  };

  const handleScroll = () => {
    const problemSection = document.getElementById("problem-section");
    if (problemSection) {
      problemSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-50/60 via-background to-indigo-50/40 dark:from-purple-950/20 dark:via-background dark:to-indigo-950/15" />

      {/* Floating Doodles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {DOODLES.map((Doodle, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -15, 0],
              x: [0, 10, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              opacity: { duration: 1, delay: Doodle.delay },
              scale: { duration: 1, delay: Doodle.delay },
              y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 7 + i, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 10 + i, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ 
              position: 'absolute', 
              top: Doodle.top, 
              left: Doodle.left 
            }}
            className={`${Doodle.color} hidden md:block`}
          >
            <Doodle.icon size={Doodle.size} />
          </motion.div>
        ))}
      </div>

      {/* Floating orbs for depth */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 dark:bg-purple-700/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300/15 dark:bg-indigo-700/10 rounded-full blur-3xl"
      />

      {/* Main Split Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full py-28 lg:py-0">
          {/* Left Side — Headline + CTA */}
          <div className="flex flex-col justify-center">
            {/* Animated headline */}
            <h1 className="mb-6 flex flex-wrap gap-x-3 gap-y-1">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={wordVariants}
                  className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[1.1] ${
                    word.includes("attention")
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-foreground"
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.9 }}
              className="mb-8"
            >
              <p className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed max-w-lg">
                {activeCurriculum.subline}
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, duration: 0.7 }}
              className="flex flex-col items-start gap-3"
            >
              <BookSessionButton onClick={handleBookSession} />
              <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                Limited availability for personalized attention
              </p>
            </motion.div>

            {/* Quote */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0, duration: 1.2 }}
              className="mt-10 text-sm font-medium text-gray-400 italic"
            >
              &ldquo;When children feel understood, they start to
              understand.&rdquo;
            </motion.p>
          </div>

          {/* Right Side — Shuffling Image with Collage Elements */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
            className="relative flex items-center justify-center w-full overflow-visible"
          >
            <div className="relative w-full overflow-visible">
              {/* Floating Element: Top-Left Thumbnail */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, x: 0, rotate: -3 }}
                whileHover={{ scale: 1.1, rotate: 0, zIndex: 40 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute -top-12 -left-6 w-32 h-24 md:w-40 md:h-32 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 dark:border-slate-800/90 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 z-20 hidden md:block cursor-pointer transition-colors duration-300"
              >
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/v1776075731/Photorealistic_photo_of_202604131551_met4fe.jpg"
                  alt="Student learning"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Floating Element: Mid-Left Small Thumbnail */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                whileHover={{ scale: 1.1, zIndex: 40 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="absolute top-1/2 -left-12 w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4 border-white/90 dark:border-slate-800/90 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 z-20 hidden lg:block -translate-y-1/2 cursor-pointer transition-colors duration-300"
              >
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/v1776076861/Real_photograph_style__202604131610_ztyfb4.jpg"
                  alt="Tutor helping student"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Glow behind image */}
              <div className="absolute inset-0 scale-90 bg-linear-to-br from-purple-400/20 via-indigo-400/15 to-pink-400/10 dark:from-purple-600/15 dark:via-indigo-600/10 dark:to-pink-600/8 rounded-3xl blur-2xl" />

              {/* Main Slideshow Container */}
              <div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/10 dark:shadow-purple-900/20 z-10 border border-white/20 dark:border-white/5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={HERO_IMAGES[currentImageIndex]}
                      alt="Tutor-student interaction"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={currentImageIndex === 0}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Element: Bottom-Right Thumbnail */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, x: 0, rotate: 3 }}
                whileHover={{ scale: 1.1, rotate: 0, zIndex: 40 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="absolute bottom-12 -right-12 w-32 h-24 md:w-40 md:h-32 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 dark:border-slate-800/90 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 z-20 hidden md:block cursor-pointer transition-colors duration-300"
              >
                <Image
                  src="https://res.cloudinary.com/de8vvmpip/image/upload/v1776076443/Real_photograph_style__202604131603_quzpl2.jpg"
                  alt="Online tutoring session"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Floating Service Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                className="absolute -bottom-6 left-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl shadow-purple-500/20 z-30 items-center gap-3 border border-purple-100 dark:border-purple-900/50 hidden md:flex cursor-pointer transition-all duration-300"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400"
                >
                  <Star size={18} fill="currentColor" />
                </motion.div>
                <div>
                  <div className="text-xs font-black text-foreground uppercase tracking-wider">Live Sessions</div>
                  <div className="text-[10px] font-medium text-text-secondary">Available 24/7 Worldwide</div>
                </div>
              </motion.div>

              {/* Image navigation dots */}
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {HERO_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentImageIndex
                        ? "bg-purple-500 w-6"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 2 }}
        onClick={handleScroll}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity z-20"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
          Scroll to explore our approach
        </span>
        <div className="w-px h-12 bg-linear-to-b from-gray-300 to-transparent dark:from-gray-600" />
      </motion.div>
    </section>
  );
}
