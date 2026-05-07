"use client";
import React, { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen pt-40 pb-32 px-6 bg-linear-to-b from-ice-blue to-background dark:from-slate-900/50 dark:to-background">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-16 px-4">
        <h1 className="text-4xl md:text-7xl font-black text-deep-navy dark:text-white mb-8 tracking-tighter leading-none">
          Get in <span className="text-sapphire">Touch</span>
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary dark:text-slate-400 font-medium italic opacity-80 leading-relaxed max-w-2xl mx-auto">
          &ldquo;Our advisors are here to help you find the right path for your child.&rdquo;
        </p>
      </div>

      {/* Primary Contact Card */}
      <div className="max-w-xl mx-auto mb-24 px-4">
        <div className="group relative p-10 md:p-16 rounded-[3rem] bg-white dark:bg-slate-900 shadow-2xl shadow-sapphire/5 border border-border flex flex-col items-center hover:scale-[1.02] transition-all duration-500 overflow-hidden">
          {/* Subtle Glow Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-sapphire/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-sapphire/10 transition-colors" />
          
          <div className="w-20 h-20 rounded-3xl bg-sapphire/10 text-sapphire flex items-center justify-center mb-8 group-hover:bg-sapphire group-hover:text-white transition-all duration-500 shadow-sm">
            <Mail size={40} />
          </div>
          
          <h2 className="text-sm font-black text-sapphire uppercase tracking-[0.4em] mb-4">Official Support</h2>
          <a 
            href="mailto:support@studyhours.com" 
            className="text-2xl md:text-4xl font-black text-deep-navy dark:text-white hover:text-sapphire transition-colors tracking-tight text-center break-all"
          >
            support@studyhours.com
          </a>
          <p className="mt-6 text-text-secondary dark:text-slate-400 font-medium opacity-60 text-center">
            We typically respond within 12–24 hours.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mb-24 px-4">
        <h2 className="text-3xl md:text-5xl font-black text-center text-deep-navy dark:text-white mb-12 tracking-tight">
          Frequently Asked <span className="text-sapphire">Questions</span>
        </h2>
        <div className="space-y-4">
          {[
            {
              question: "How fast does StudyHours reply to support emails?",
              answer: "We typically respond to all support emails within 12 to 24 hours. For enrolled students and parents, we also provide direct real-time communication channels with their dedicated tutoring coordinators."
            },
            {
              question: "Can I schedule a free diagnostic consultation before enrolling?",
              answer: "Yes, absolutely! We offer a free, no-obligation academic diagnostic call. During this call, our experienced advisors assess your child's current level, identify learning gaps, and structure a custom learning plan paired with the perfect tutor."
            },
            {
              question: "What curriculums and school systems do you support?",
              answer: "StudyHours offers specialized 1-on-1 tutoring for K-12. We support regional and international systems including the Australian Curriculum (VCE, HSC, QCE, WACE), Singapore MOE, UAE MOE, Saudi Ministry Curriculum, as well as IB, IGCSE, GCSE, and A-Levels."
            },
            {
              question: "How do your online tutoring sessions work?",
              answer: "All tutoring sessions are conducted on our custom-built, secure learning classroom. Tutors and students collaborate via an interactive whiteboard, real-time shared document editors, and high-fidelity video/audio feeds optimized for a premium educational experience."
            }
          ].map((faq, idx) => (
            <div 
              key={idx}
              className="border border-gray-100 dark:border-white/5 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-all hover:border-sapphire/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left px-8 py-6 flex justify-between items-center font-bold text-lg md:text-xl text-deep-navy dark:text-white hover:text-sapphire transition-colors gap-4"
              >
                <span>{faq.question}</span>
                <span className="text-2xl text-sapphire transition-transform duration-300 select-none">
                  {openIndex === idx ? "−" : "+"}
                </span>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === idx ? "max-h-[500px] border-t border-gray-100 dark:border-white/5 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-8 py-6 text-sm md:text-base text-text-secondary dark:text-slate-400 font-medium leading-relaxed bg-slate-50/50 dark:bg-slate-900/50">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary CTA */}
      <div className="max-w-3xl mx-auto p-12 md:p-20 rounded-[3.5rem] bg-deep-navy dark:bg-slate-950 text-white text-center shadow-3xl relative overflow-hidden group">
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-linear-to-br from-sapphire/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-sapphire/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Want a free consultation?</h2>
          <p className="text-lg md:text-xl text-blue-100/70 mb-12 font-medium max-w-xl mx-auto leading-relaxed">
            Speak with our academic advisors to understand how we can help your child master their curriculum.
          </p>
          <Link
            href="/signup?type=assessment"
            className="inline-flex items-center gap-3 px-12 py-5 bg-white text-deep-navy font-black rounded-2xl hover:bg-sapphire hover:text-white transition-all shadow-xl shadow-sapphire/20 text-lg uppercase tracking-wider group/btn"
          >
            Book Diagnostic Call
            <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  );
}
