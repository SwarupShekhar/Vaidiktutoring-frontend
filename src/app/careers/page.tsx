"use client";
import React from "react";
import { motion } from "framer-motion";
import { Award, Briefcase, Heart, Rocket, UserPlus } from "lucide-react";

export default function CareersPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 bg-linear-to-b from-indigo-50 to-background">
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-black text-deep-navy mb-6 tracking-tight">
          Join the Mission
        </h1>
        <p className="text-xl text-text-secondary font-medium leading-relaxed max-w-2xl mx-auto">
          We are building the future of K-12 learning support. Join a team of
          educators, engineers, and designers dedicated to helping every child
          reach their potential.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <div className="p-8 rounded-[2.5rem] bg-white border border-border/50 shadow-sm hover:shadow-xl transition-all">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
            <Heart size={24} />
          </div>
          <h3 className="text-xl font-bold mb-4">Impact Driven</h3>
          <p className="text-text-secondary font-medium text-sm leading-relaxed">
            Every line of code and every lesson plan is designed to create a
            measurable positive impact on a student's educational journey.
          </p>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white border border-border/50 shadow-sm hover:shadow-xl transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
            <Rocket size={24} />
          </div>
          <h3 className="text-xl font-bold mb-4">Innovation First</h3>
          <p className="text-text-secondary font-medium text-sm leading-relaxed">
            We don't just follow standards; we set them. We leverage intelligent
            systems to empower human tutors to do their best work.
          </p>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white border border-border/50 shadow-sm hover:shadow-xl transition-all">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6">
            <Award size={24} />
          </div>
          <h3 className="text-xl font-bold mb-4">Growth Focused</h3>
          <p className="text-text-secondary font-medium text-sm leading-relaxed">
            We invest in our team as much as we invest in our students.
            Continuous learning and professional growth are at our core.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-12 rounded-[3.5rem] bg-white border-2 border-dashed border-primary/30 text-center shadow-xl">
        <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-8">
          <Briefcase size={40} />
        </div>
        <h2 className="text-3xl font-black text-deep-navy mb-4">
          Current Opportunities
        </h2>
        <p className="text-text-secondary font-medium mb-10 max-w-lg mx-auto">
          We are currently expanding our network of expert tutors and our
          product team. If you're passionate about education, we'd love to hear
          from you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:careers@studyhours.com"
            className="px-10 py-4 bg-primary text-white font-bold rounded-full hover:bg-sapphire transition-all flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            Apply Now
          </a>
        </div>
      </div>
    </main>
  );
}
