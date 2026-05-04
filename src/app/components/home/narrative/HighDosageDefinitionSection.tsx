"use client";

import React from "react";
import FadeUpSection from "./FadeUpSection";

import Image from "next/image";

const CRITERIA = [
  {
    title: "3× per week",
    desc: "Structured programs",
    icon: "https://res.cloudinary.com/de8vvmpip/image/upload/v1770623538/calendar_yjeieu.gif",
  },
  {
    title: "30 mins",
    desc: "Focused attention blocks",
    icon: "https://res.cloudinary.com/de8vvmpip/image/upload/v1770623536/time_ieoruf.gif",
  },
  {
    title: "4:1 or better",
    desc: "Small-group / 1:1 by design",
    icon: "https://res.cloudinary.com/de8vvmpip/image/upload/v1770623534/discussion_zoj9pq.gif",
  },
  {
    title: "Trained tutors",
    desc: "Pedagogically trained",
    icon: "https://res.cloudinary.com/de8vvmpip/image/upload/v1770623531/webinar_tyvnog.gif",
  },
];

export default function HighDosageDefinitionSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-sapphire/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left Column */}
          <div className="lg:w-1/3 sticky top-32">
            <FadeUpSection>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sapphire mb-4 block">
                Proven Methodology
              </span>
              <h2 className="text-3xl md:text-4xl font-luckiest text-deep-navy dark:text-ice-blue tracking-wide mb-6 leading-tight drop-shadow-sm">
                <span className="text-gradient-primary">The Gold Standard</span>{" "}
                <br /> of Learning
              </h2>
              <p className="text-base text-text-secondary font-medium leading-relaxed mb-8">
                What research defines as high-impact tutoring isn&apos;t just
                about showing up - it&apos;s about frequency, ratio, and
                training.
              </p>

              <div className="p-6 rounded-2xl bg-sapphire/5 border border-sapphire/10 backdrop-blur-sm dark:bg-sapphire/10 dark:border-sapphire/20">
                <p className="text-xs font-bold text-deep-navy dark:text-ice-blue italic">
                  &quot;Most online tutoring is on-demand. We are built for
                  consistency.&quot;
                </p>
              </div>
            </FadeUpSection>
          </div>

          {/* Right Column - Grid */}
          <div className="lg:w-2/3 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CRITERIA.map((item, i) => (
                <FadeUpSection key={i} delay={i * 0.1} className="group h-full">
                  <div className="h-full p-8 rounded-4xl bg-glass card-hover border border-white/20 dark:border-white/5 dark:bg-white/5 hover:border-sapphire/30 transition-all">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-ice-blue/50 dark:bg-sapphire/20 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 relative">
                        <Image
                          src={item.icon}
                          alt={item.title}
                          fill
                          className="object-contain p-2"
                          unoptimized
                        />
                      </div>
                      <div className="w-8 h-8 rounded-full border border-sapphire/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg
                          className="w-4 h-4 text-sapphire"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>

                    <h3 className="text-xl font-luckiest text-deep-navy dark:text-white mb-2 tracking-wide group-hover:text-sapphire transition-colors drop-shadow-sm">
                      {item.title}
                    </h3>
                    <div className="h-1 w-12 bg-sapphire/20 rounded-full mb-4 group-hover:w-full group-hover:bg-sapphire/50 transition-all duration-500" />

                    <p className="text-sm text-text-secondary font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </FadeUpSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
