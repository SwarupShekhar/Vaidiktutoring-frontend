"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Calculator,
  FlaskConical,
  History,
  Globe,
  GraduationCap,
  CheckCircle2,
  Clock,
  Users,
  Lightbulb,
  Target,
  TrendingUp,
  Star,
  Play,
  ChevronDown,
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";
import ParentTestimonials from "../components/subjects/ParentTestimonials";
import StickyCTA from "../components/subjects/StickyCTA";

export default function K12OnlineTutoringPage() {
  const { user } = useAuthContext();

  return (
    <main className="min-h-screen bg-background transition-colors duration-500 relative">
      {/* Sticky Action Bar */}
      <StickyCTA />

      {/* ============================================
          SECTION 1: HERO BANNER
      ============================================ */}
      <section className="min-h-[90vh] flex items-center pt-32 pb-24 px-6 relative overflow-hidden bg-linear-to-b from-ice-blue to-background">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-sapphire/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-blue-300/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ice-blue/80 border border-powder-blue text-sm font-bold text-sapphire mb-8 shadow-sm">
                <ShieldCheck size={16} />
                K-12 Online Tutoring
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-deep-navy dark:text-white mb-6 tracking-tight leading-[1.1]">
                K-12 Online Tutoring Service
              </h1>
              <p className="text-xl md:text-2xl text-text-secondary mb-4 leading-relaxed font-medium">
                Take the best step for your child's academic success with personalized tutoring.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mt-8">
                <Link
                  href={user ? "/bookings/new" : "/signup?type=assessment"}
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-sapphire transition-all shadow-xl shadow-blue-500/20 text-center flex items-center justify-center gap-2"
                  aria-label={user ? "Book a class" : "Sign up to book a class"}
                >
                  Book a Class
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/experts"
                  className="w-full sm:w-auto px-8 py-4 bg-sapphire text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 text-center flex items-center justify-center gap-2"
                  aria-label="Find an online tutor"
                >
                  Find an Online Tutor
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 p-8 rounded-[3rem] bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/20 shadow-2xl">
                <div className="space-y-6">
                  {/* Student Learning Animation */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <GraduationCap size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-24 bg-slate-100 rounded dark:bg-slate-700 mb-2" />
                      <motion.div
                        initial={{ width: "20%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: 1.5,
                          delay: 1,
                          ease: "easeOut",
                        }}
                        className="h-1.5 bg-green-50 rounded dark:bg-green-900/30"
                      />
                    </div>
                  </motion.div>

                  {/* Progress Bars */}
                  <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex justify-between items-end gap-2 h-20">
                      {[40, 70, 55, 90, 65].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{
                            delay: 0.8 + i * 0.1,
                            duration: 0.8,
                            ease: "backOut",
                          }}
                          className={`w-4 rounded-t ${h === 90 ? "bg-sapphire shadow-[0_0_15px_rgba(31,75,255,0.3)]" : "bg-blue-200 dark:bg-blue-800/40"}`}
                        />
                      ))}
                    </div>
                    <div className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                      Student Progress
                    </div>
                  </div>

                  {/* Stats Row */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex justify-center gap-6"
                  >
                    <div className="text-center">
                      <div className="text-2xl font-black text-sapphire">
                        500+
                      </div>
                      <div className="text-xs font-bold text-slate-400">
                        Tutors
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-sapphire">
                        10K+
                      </div>
                      <div className="text-xs font-bold text-slate-400">
                        Students
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-sapphire">
                        95%
                      </div>
                      <div className="text-xs font-bold text-slate-400">
                        Satisfaction
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 2: ONLINE TUTORING THAT ACCELERATES STUDENT OUTCOMES
      ============================================ */}
      <section className="py-24 px-6 bg-surface border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-deep-navy mb-6">
                Online tutoring that accelerates{" "}
                <span className="text-sapphire">Student Outcomes</span>
              </h2>
              <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                Our personalized support helps students master concepts faster, stay on track, and achieve real academic improvement in a flexible, comfortable learning environment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 3: PERSONALIZED K-12 TUTORING
      ============================================ */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ice-blue/50 border border-powder-blue text-sm font-semibold text-sapphire mb-6">
                <Target size={16} />
                Personalized Learning
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-deep-navy mb-6">
                Personalized K-12 Tutoring for Smarter Learning
              </h2>
              <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                StudyHours offers customized K-12 tutoring that adapts to each student's unique learning pace and style. Our expert instructors simplify complex concepts and build strong study habits that provide a lifelong academic advantage.
              </p>
              <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                We create a supportive atmosphere where students feel confident to ask questions and grow, with the flexibility to learn anytime, anywhere.
              </p>

              <Link
                href={user ? "/bookings/new" : "/signup"}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-sapphire transition-all shadow-xl shadow-blue-500/20 mt-8"
                aria-label={user ? "Apply now for tutoring" : "Sign up to apply for tutoring"}
              >
                Apply Now
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {[
                {
                  icon: Clock,
                  title: "Learn Anytime",
                  desc: "Flexible scheduling that fits your routine",
                },
                {
                  icon: Users,
                  title: "Devoted Instructors",
                  desc: "Expert tutors dedicated to student success",
                },
                {
                  icon: Lightbulb,
                  title: "Concept Clarity",
                  desc: "Simplify complex ideas with expert help",
                },
                {
                  icon: TrendingUp,
                  title: "Real Results",
                  desc: "See measurable improvement in grades",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-deep-navy mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: FLEXIBLE ONLINE TUTORING
      ============================================ */}
      <section className="py-24 px-6 bg-linear-to-br from-sapphire/5 to-blue-100/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-deep-navy mb-6">
                Flexible Online Tutoring That Turns Learning into Understanding
              </h2>
              <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                Every student learns differently. In an everyday classroom, it's
                easy to become behind or miss the point entirely. That's where
                online tutoring can be very helpful.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Learn at Your Own Pace",
                description:
                  "Students can learn in a relaxed, focused environment. Our tutors ensure thorough understanding rather than just completion, giving students the space to ask questions and master concepts.",
                icon: Clock,
              },
              {
                title: "Maximum Flexibility",
                description:
                  "Join sessions from home at times that work best for you. Regular study without the stress of travel makes it easier to stay consistent and achieve better results.",
                icon: ShieldCheck,
              },
              {
                title: "Expert Interaction",
                description:
                  "Our tutors engage directly to simplify complex topics. Students gain self-assurance and develop a positive relationship with learning through personalized guidance.",
                icon: Lightbulb,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="p-8 rounded-3xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700"
              >
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-sapphire to-blue-400 flex items-center justify-center text-white mb-6">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-deep-navy mb-4">
                  {item.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 5: HOW OUR TUTORING PROGRAMS WORK
      ============================================ */}
      <section className="py-24 px-6 bg-surface border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-deep-navy mb-4">
                Our Tutoring Programs Works
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Getting started with StudyHours is easy and stress-free. We've
                kept the process simple so students can begin learning smoothly.
              </p>
              <div className="w-20 h-1.5 bg-sapphire mx-auto rounded-full mt-6"></div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Assessment",
                description:
                  "We understand their strengths and weaknesses and what they need help with. This helps us know the right starting point and spot the weak areas that need focus.",
              },
              {
                step: "02",
                title: "Tutor Matching",
                description:
                  "Find the right tutor for their subject and style. The tutor then tailors lessons to the student's learning speed.",
              },
              {
                step: "03",
                title: "Online Sessions",
                description:
                  "Classes are held online at a time that fits their learning style. During each session, the tutor breaks down lessons and resolves all questions.",
              },
              {
                step: "04",
                title: "Progress Tracking",
                description:
                  "As sessions continue, the tutor monitors their improvement regularly and adapts the approach based on student response.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 h-full">
                  <div className="text-4xl font-black text-sapphire/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-deep-navy mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="text-sapphire/30" size={24} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 6: ALL YOUR TUTORING NEEDS FOR GRADES K-12
      ============================================ */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-deep-navy mb-4">
                All Your Tutoring Needs for Grades K-12
              </h2>
              <div className="w-20 h-1.5 bg-sapphire mx-auto rounded-full mt-6"></div>
            </motion.div>
          </div>

          {/* Detailed Subject List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Mathematics",
                subjects: "Arithmetic, Algebra I & II, Geometry, Trigonometry, Pre-Calculus, and Calculus",
                icon: Calculator,
                color: "text-green-600",
                bg: "bg-green-100/50"
              },
              {
                title: "Science",
                subjects: "Earth Science, Biology, Chemistry, and Physics",
                icon: FlaskConical,
                color: "text-purple-600",
                bg: "bg-purple-100/50"
              },
              {
                title: "English/Language Arts",
                subjects: "Reading, writing, grammar, and literature studies",
                icon: BookOpen,
                color: "text-blue-600",
                bg: "bg-blue-100/50"
              },
              {
                title: "Social Studies",
                subjects: "History, Geography, and Civics",
                icon: History,
                color: "text-amber-600",
                bg: "bg-amber-100/50"
              },
              {
                title: "Specialized/Test Prep",
                subjects: "AP/IB courses, SAT/ACT preparation, and computer science/coding",
                icon: Target,
                color: "text-rose-600",
                bg: "bg-rose-100/50"
              },
              {
                title: "College Admissions",
                subjects: "Counseling, Essay writing, University selection, and Application support",
                icon: GraduationCap,
                color: "text-sapphire",
                bg: "bg-sapphire/10"
              },
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl ${category.bg} ${category.color} flex items-center justify-center mb-6`}>
                  <category.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-deep-navy mb-3">
                  {category.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {category.subjects}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 7: BENEFITS OF OUR ONLINE TUTORING
      ============================================ */}
      <section className="py-24 px-6 bg-linear-to-br from-sapphire/5 to-blue-100/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-deep-navy mb-4">
                Benefits of Our Online Tutoring
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                At StudyHours, our tutoring is designed to help them progress on
                their educational path and help them do well in their studies.
                We focus on making learning simple, clear, and useful for
                everyday studies.
              </p>
              <div className="w-20 h-1.5 bg-sapphire mx-auto rounded-full mt-6"></div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "One-on-one focus",
                description:
                  "Students get the time and space to strengthen their weak points and deepen their knowledge of subjects that they find difficult.",
              },
              {
                title: "Builds Confidence",
                description:
                  "Our tutoring also helps students believe in themselves. As they start to understand topics better and solve independently, they feel more comfortable in class and during exams.",
              },
              {
                title: "Self-paced Learning",
                description:
                  "Students can attend sessions at a time that works with their timetable, making it easier to balance school, homework, and other activities.",
              },
              {
                title: "Effective Learning Routines",
                description:
                  "We also help students build effective learning routines. With regular sessions and guidance, they learn how to manage their time, practice regularly, and stay consistent with their studies.",
              },
              {
                title: "Long-term Growth",
                description:
                  "Over time, students keep getting better and become more independent in their learning. They are better prepared not just for exams, but for handling their studies with confidence.",
              },
              {
                title: "Measurable Results",
                description:
                  "Our approach focuses on actual understanding rather than memorization, leading to sustainable academic improvement.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700"
              >
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-deep-navy mb-3">
                  {benefit.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 8: OUR SCIENCE-BACKED LEARNING FRAMEWORK
      ============================================ */}
      <section className="py-24 px-6 bg-surface border-t border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-extrabold text-deep-navy mb-6">
                Our Science-Backed Learning Framework
              </h2>
              <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                We use a data-driven approach to ensure every session drives maximum retention and engagement, positioning our platform as a high-tech solution for academic excellence.
              </p>
              <div className="w-20 h-1.5 bg-sapphire mx-auto rounded-full mt-8"></div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Diagnostic Assessment",
                description: "We identify core knowledge gaps before the first lesson begins, ensuring every study plan is data-informed.",
                icon: Target,
                color: "text-blue-600",
                bg: "bg-blue-100/50"
              },
              {
                title: "Active Engagement Loops",
                description: "Lessons are designed to keep students focused through interactive feedback and real-time concept verification.",
                icon: Lightbulb,
                color: "text-amber-600",
                bg: "bg-amber-100/50"
              },
              {
                title: "Mastery Tracking",
                description: "Real-time progress reports that show exactly where a student is improving and what needs further reinforcement.",
                icon: TrendingUp,
                color: "text-green-600",
                bg: "bg-green-100/50"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="p-10 rounded-3xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-8`}>
                  <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-deep-navy mb-4">
                  {item.title}
                </h3>
                <p className="text-lg text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/methodology"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-sapphire transition-all shadow-xl shadow-blue-500/20"
              aria-label="Learn more about our learning methodology"
            >
              Learn More About Our Methodology
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 9: FINAL CTA
      ============================================ */}
      <section className="py-24 px-6 bg-deep-navy relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-sapphire/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-blue-400/30 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
              Ready to Transform Your Child's Learning?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of students who have improved their grades and
              confidence with StudyHours online tutoring.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Link
                href={user ? "/bookings/new" : "/signup?type=assessment"}
                className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-bold rounded-full hover:bg-sapphire transition-all shadow-xl shadow-blue-500/30 text-lg"
                aria-label={user ? "Book a free class" : "Sign up to book a free class"}
              >
                Book a Free Class
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-10 py-5 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all text-lg"
                aria-label="Talk to us"
              >
                Talk to Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 10: TESTIMONIALS
      ============================================ */}
      <ParentTestimonials />

      {/* ============================================
          SECTION 11: FAQ
      ============================================ */}
      <section className="py-24 px-6 relative overflow-hidden bg-surface">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-deep-navy mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is the purpose of the K-12 program?",
                a: "To provide a strong academic foundation, helping students improve through their school years. It focuses on conceptual clarity and preparing students for higher education and careers."
              },
              {
                q: "Is K12 a good homeschool program?",
                a: "Yes, it offers a well-organized curriculum and guided study journey. It works well for families who prefer a directed learning path with structured lesson plans."
              },
              {
                q: "What is the difference between K-12 and higher education?",
                a: "K-12 builds a foundational footing across different subjects from early schooling to high school. Higher education focuses on specialized learning in a specific field for career growth."
              },
              {
                q: "What are common challenges in K-12?",
                a: "Maintaining engagement, grasping difficult topics, and adjusting to individual progress rates. Students also face exam pressure and the need to form disciplined study patterns."
              },
              {
                q: "How does K-12 tutoring work?",
                a: "It provides additional support outside of regular school hours. Tutors help students clear doubts and boost results through customized sessions that match their own learning rhythm."
              }
            ].map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function FAQItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
      >
        <div className="flex items-start gap-4">
          <span className="w-8 h-8 rounded-full bg-sapphire/10 text-sapphire flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
            Q
          </span>
          <span className="text-lg font-bold text-deep-navy group-hover:text-sapphire transition-colors pt-1">
            {faq.q}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="mt-1 text-slate-400 group-hover:text-sapphire"
        >
          <ChevronDown size={24} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pl-18 pr-12">
              <div className="w-full h-px bg-slate-100 dark:bg-slate-700 mb-4" />
              <p className="text-text-secondary leading-relaxed">
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
