"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SHLogo from "./SHLogo";
import InstagramButton from "./InstagramButton";
import LinkedInButton from "./LinkedInButton";
import DiscordButton from "./DiscordButton";
import FacebookButton from "./FacebookButton";
import RedditButton from "./RedditButton";
import { cmsApi } from "../lib/cms";

export default function Footer() {
  const pathname = usePathname();
  const [year, setYear] = useState(2026);
  const [featuredResources, setFeaturedResources] = useState<{ title: string; slug: string; addToFooter?: boolean }[]>([]);
  const [isResourcesExpanded, setIsResourcesExpanded] = useState(false);
  const [isLocationsExpanded, setIsLocationsExpanded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYear(new Date().getFullYear());

    // Fetch dynamic landing pages to show in the footer
    cmsApi.getLandingPages()
      .then((data) => setFeaturedResources(data))
      .catch((err) => console.warn("[Footer] Failed to fetch featured landing pages:", err));
  }, []);

  if (pathname?.startsWith("/session")) return null;

  return (
    <footer className="relative bg-black text-white border-t border-white/10 pt-12 pb-16 transition-colors duration-300 overflow-hidden">
      {/* Sleek top glowing border gradient */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" />

      {/* CSS-only space background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40" style={{ background: 'radial-gradient(circle at 50% 100%, #1a1a3a 0%, #000000 60%)' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
          {/* Brand Column */}
          <div className="space-y-3 col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg shadow-lg shadow-primary/20">
                <SHLogo className="w-full h-full" />
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
                StudyHours
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Empowering K-12 students worldwide with personalized 1-on-1 expert tutoring.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Trusted in 20+ Countries
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/subjects" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  Subjects
                </Link>
              </li>
              <li>
                <Link href="/experts" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  Find Experts
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  Join as Student
                </Link>
              </li>
            </ul>
          </div>

          {/* Free Tools Column */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Free Tools
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sat-score-quiz" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  SAT Score Quiz
                </Link>
              </li>
              <li>
                <Link href="/sat-desmos-guide" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  Desmos Cheat Sheet
                </Link>
              </li>
              <li>
                <Link href="/gcse-maths-paper-3-tracker" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  GCSE Paper 3 Tracker
                </Link>
              </li>
              <li>
                <Link href="https://discord.gg/gDhGVWd6Cm" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  Discord Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs Column */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Programs
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/k-12-online-tutoring" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  K-12 Tutoring
                </Link>
              </li>
              <li>
                <Link href="/ib-online-tutoring" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  IB Tutoring
                </Link>
              </li>
              <li>
                <Link href="/a-level-online-tutoring" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  A-Level Tutoring
                </Link>
              </li>
              <li>
                <Link href="/igcse-online-tutoring" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  IGCSE Tutoring
                </Link>
              </li>
              <li>
                <Link href="/gcse-online-tutoring" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  GCSE Tutoring
                </Link>
              </li>
              <li>
                <Link href="/online-tutoring-uk" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  Online Tutoring UK
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column (Includes Resources) */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  Methodology
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  Contact
                </Link>
              </li>

              {/* Nested Expandable Resources */}
              {featuredResources.length > 0 && (
                <li className="pt-1">
                  <button
                    onClick={() => setIsResourcesExpanded(!isResourcesExpanded)}
                    className="text-gray-400 hover:text-white transition-colors text-xs flex items-center justify-between w-full text-left font-medium group py-1"
                    aria-expanded={isResourcesExpanded}
                  >
                    <span className="flex items-center gap-1.5">
                      Resources
                      <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-primary/20 text-primary border border-primary/30">
                        {featuredResources.length}
                      </span>
                    </span>
                    <svg
                      className={`w-3 h-3 text-gray-400 group-hover:text-primary transition-transform duration-200 ${
                        isResourcesExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isResourcesExpanded ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                    } overflow-hidden`}
                  >
                    <ul className="space-y-1.5 pl-2.5 border-l border-primary/30 min-h-0 text-[11px]">
                      {featuredResources.map((res) => (
                        <li key={res.slug}>
                          <Link
                            href={`/resources/${res.slug}`}
                            className="text-gray-400 hover:text-white transition-colors block truncate hover:translate-x-0.5 transition-transform"
                          >
                            {res.title
                              .replace(/\s*\|\s*StudyHours/gi, '')
                              .replace(/\s*—\s*Free Download/gi, '')
                              .replace(/\s*Prep\s*&\s*Resources/gi, '')
                              .trim()}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/privacy" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/aup" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  Acceptable Use
                </Link>
              </li>
              <li>
                <Link href="/legal/refunds" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-gray-400 hover:text-white transition-colors text-xs hover:translate-x-0.5 inline-block">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-banner'))}
                  className="text-gray-400 hover:text-white transition-colors text-xs text-left hover:translate-x-0.5 inline-block"
                >
                  Cookie Preferences
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Tutoring by Location (Collapsible with Country Badges) */}
        <div className="border-t border-white/10 pt-5 mb-8">
          <button
            onClick={() => setIsLocationsExpanded(!isLocationsExpanded)}
            className="w-full flex items-center justify-between text-left group focus:outline-none py-1.5"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-primary transition-colors">
                Tutoring by Location
              </h3>
              {!isLocationsExpanded && (
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">🇺🇸 US</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">🇦🇺 Australia</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">🇸🇬 Singapore</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">🇦🇪 Middle East</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-primary transition-colors">
              <span className="text-[11px] font-medium">{isLocationsExpanded ? "Hide" : "Explore"}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-300 ${isLocationsExpanded ? "rotate-180 text-primary" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out ${
              isLocationsExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
            } overflow-hidden`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 min-h-0 pt-2">
              {/* US */}
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <Link href="/us/american-curriculum" className="text-[11px] font-bold text-white uppercase tracking-widest mb-2.5 flex items-center gap-1.5 hover:text-primary transition-colors">
                  <span>🇺🇸</span> US &amp; AP
                </Link>
                <ul className="space-y-1.5">
                  {[
                    { href: "/us/american-curriculum", label: "American Curriculum" },
                    { href: "/us/sat-prep", label: "SAT Prep" },
                    { href: "/us/act-prep", label: "ACT Prep" },
                    { href: "/us/ap-tutoring", label: "AP Tutoring" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-xs block hover:translate-x-0.5 transition-transform">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Australia */}
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <Link href="/australia" className="text-[11px] font-bold text-white uppercase tracking-widest mb-2.5 flex items-center gap-1.5 hover:text-primary transition-colors">
                  <span>🇦🇺</span> Australia
                </Link>
                <ul className="space-y-1.5">
                  {[
                    { href: "/australia/vce-online-tutoring", label: "VCE Tutoring" },
                    { href: "/australia/hsc-online-tutoring", label: "HSC Tutoring" },
                    { href: "/australia/qce-online-tutoring", label: "QCE Tutoring" },
                    { href: "/australia/wace-online-tutoring", label: "WACE Tutoring" },
                    { href: "/australia/atar-online-tutoring", label: "ATAR Tutoring" },
                    { href: "/australia/curriculum-tutoring", label: "Australian Curriculum" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-xs block hover:translate-x-0.5 transition-transform">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Singapore */}
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <Link href="/singapore" className="text-[11px] font-bold text-white uppercase tracking-widest mb-2.5 flex items-center gap-1.5 hover:text-primary transition-colors">
                  <span>🇸🇬</span> Singapore
                </Link>
                <ul className="space-y-1.5">
                  {[
                    { href: "/singapore/psle-tutors-online", label: "PSLE Tutors" },
                    { href: "/singapore/o-level-tutors-singapore", label: "O-Level Tutors" },
                    { href: "/singapore/a-level-tutors-singapore", label: "A-Level Tutors" },
                    { href: "/singapore/ip-programme-tutors-singapore", label: "IP Programme Tutors" },
                    { href: "/singapore/moe-singapore-curriculum-tutors", label: "MOE Singapore Curriculum" },
                    { href: "/singapore/primary-school-tutors-singapore", label: "Primary School Tutors" },
                    { href: "/singapore-jc-guide", label: "Singapore JC Guide" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-xs block hover:translate-x-0.5 transition-transform">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* UAE */}
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <Link href="/uae" className="text-[11px] font-bold text-white uppercase tracking-widest mb-2.5 flex items-center gap-1.5 hover:text-primary transition-colors">
                  <span>🇦🇪</span> UAE &amp; Middle East
                </Link>
                <ul className="space-y-1.5">
                  {[
                    { href: "/uae/online-tutors-dubai", label: "Online Tutors Dubai" },
                    { href: "/uae/online-tutors-abu-dhabi", label: "Online Tutors Abu Dhabi" },
                    { href: "/saudi/online-tutors-riyadh", label: "Online Tutors Riyadh" },
                    { href: "/uae/moe-uae-curriculum-tutors", label: "MOE UAE Curriculum" },
                    { href: "/saudi/saudi-ministry-curriculum-tutors", label: "Saudi Ministry Curriculum" },
                    { href: "/uae/physics-maths-tutor", label: "Physics & Maths Tutor UAE" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-xs block hover:translate-x-0.5 transition-transform">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <p className="text-xs text-gray-500">
            &copy; {year} StudyHours. All rights reserved.
          </p>
          <div className="flex gap-3 items-center">
            <InstagramButton />
            <LinkedInButton />
            <DiscordButton />
            <FacebookButton />
            <RedditButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
