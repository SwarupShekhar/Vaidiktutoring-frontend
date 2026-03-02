"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import BookSessionButton from "../BookSessionButton";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/app/context/AuthContext";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextImage, 4000);
    return () => clearInterval(interval);
  }, [nextImage]);

  const headline =
    "Your child doesn't need more classes. They need the right kind of attention.";
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
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-background to-indigo-50/40 dark:from-purple-950/20 dark:via-background dark:to-indigo-950/15" />

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
            <div className="mb-6 flex flex-wrap gap-x-3 gap-y-1">
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
            </div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.9 }}
              className="mb-8"
            >
              <p className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed max-w-lg">
                Expert tutors guided by intelligent systems, delivering
                personalized 1-on-1 sessions aligned with major global
                curricula.
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

          {/* Right Side — Shuffling Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            {/* Glow behind image */}
            <div className="absolute inset-0 scale-90 bg-gradient-to-br from-purple-400/20 via-indigo-400/15 to-pink-400/10 dark:from-purple-600/15 dark:via-indigo-600/10 dark:to-pink-600/8 rounded-3xl blur-2xl" />

            {/* Image container */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 dark:shadow-purple-900/20 ring-1 ring-white/20 dark:ring-white/5">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Image navigation dots */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
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
        <div className="w-px h-12 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600" />
      </motion.div>
    </section>
  );
}
