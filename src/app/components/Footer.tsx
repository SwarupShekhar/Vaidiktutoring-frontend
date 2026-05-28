"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SHLogo from "./SHLogo";
import InstagramButton from "./InstagramButton";
import LinkedInButton from "./LinkedInButton";
import dynamic from "next/dynamic";

const Galaxy = dynamic(() => import("./home/narrative/galaxy/Galaxy"), { ssr: false });

export default function Footer() {
  const pathname = usePathname();
  const [year, setYear] = useState(2026);
  const [hasMounted, setHasMounted] = useState(false);
  const [featuredResources, setFeaturedResources] = useState<{ title: string; slug: string; addToFooter?: boolean }[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYear(new Date().getFullYear());
    setHasMounted(true);

    // Fetch dynamic landing pages that should be featured in the footer
    const API_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.studyhours.com').replace(/\/$/, '');
    fetch(`${API_URL}/cms/landing-pages`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const featured = data.filter((page: any) => page.addToFooter === true);
          setFeaturedResources(featured);
        }
      })
      .catch((err) => console.warn("[Footer] Failed to fetch featured landing pages:", err));
  }, []);

  if (pathname?.startsWith("/session")) return null;

  return (
    <footer className="relative bg-black text-white border-t border-white/10 pt-16 pb-32 transition-colors duration-300 overflow-hidden">
      {/* Interactive Galaxy Background - Only rendered on client to avoid hydration mismatch */}
      {hasMounted && (
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <Galaxy 
            mouseRepulsion
            mouseInteraction
            density={0.65} // Reduced particles by 35%
            glowIntensity={0.5}
            saturation={0.8}
            hueShift={260}
            twinkleIntensity={0.5}
            rotationSpeed={0.08}
            repulsionStrength={2}
            autoCenterRepulsion={0}
            starSpeed={0.4}
            speed={1}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`grid grid-cols-1 md:grid-cols-3 ${featuredResources.length > 0 ? 'lg:grid-cols-6' : 'lg:grid-cols-5'} gap-12 mb-16`}>
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg">
                <SHLogo className="w-full h-full" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
                StudyHours
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering students across Grades K-12 with personalized,
              world-class tutoring. Unlock your full potential today.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/subjects"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Subjects
                </Link>
              </li>
              <li>
                <Link
                  href="/experts"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Find Experts
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/onboarding"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Join as Student
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs Column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Programs
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/k-12-online-tutoring"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  K-12 Tutoring
                </Link>
              </li>
              <li>
                <Link
                  href="/ib-online-tutoring"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  IB Tutoring
                </Link>
              </li>
              <li>
                <Link
                  href="/a-level-online-tutoring"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  A-Level Tutoring
                </Link>
              </li>
              <li>
                <Link
                  href="/igcse-online-tutoring"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  IGCSE Tutoring
                </Link>
              </li>
              <li>
                <Link
                  href="/gcse-online-tutoring"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  GCSE Tutoring
                </Link>
              </li>
              <li>
                <Link
                  href="/online-tutoring-uk"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Online Tutoring UK
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column (Dynamic) */}
          {featuredResources.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Resources
              </h3>
              <ul className="space-y-3">
                {featuredResources.map((res) => (
                  <li key={res.slug}>
                    <Link
                      href={`/resources/${res.slug}`}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
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
          )}

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/methodology"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Methodology
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/aup"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Acceptable Use
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/refunds"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-banner'))}
                  className="text-gray-400 hover:text-white transition-colors text-sm text-left"
                >
                  Cookie Preferences
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Locations Section */}
        <div className="mb-16">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
            Tutoring by Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Australia */}
            <div>
              <Link href="/australia" className="text-xs font-bold text-white uppercase tracking-widest mb-3 block hover:text-primary transition-colors">
                Australia
              </Link>
              <ul className="space-y-2">
                {[
                  { href: "/australia/vce-online-tutoring", label: "VCE Tutoring" },
                  { href: "/australia/hsc-online-tutoring", label: "HSC Tutoring" },
                  { href: "/australia/qce-online-tutoring", label: "QCE Tutoring" },
                  { href: "/australia/wace-online-tutoring", label: "WACE Tutoring" },
                  { href: "/australia/atar-online-tutoring", label: "ATAR Tutoring" },
                  { href: "/australia/curriculum-tutoring", label: "Australian Curriculum" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Singapore */}
            <div>
              <Link href="/singapore" className="text-xs font-bold text-white uppercase tracking-widest mb-3 block hover:text-primary transition-colors">
                Singapore
              </Link>
              <ul className="space-y-2">
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
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* UAE */}
            <div>
              <Link href="/uae" className="text-xs font-bold text-white uppercase tracking-widest mb-3 block hover:text-primary transition-colors">
                UAE &amp; Middle East
              </Link>
              <ul className="space-y-2">
                {[
                  { href: "/uae/online-tutors-dubai", label: "Online Tutors Dubai" },
                  { href: "/uae/online-tutors-abu-dhabi", label: "Online Tutors Abu Dhabi" },
                  { href: "/saudi/online-tutors-riyadh", label: "Online Tutors Riyadh" },
                  { href: "/uae/moe-uae-curriculum-tutors", label: "MOE UAE Curriculum" },
                  { href: "/saudi/saudi-ministry-curriculum-tutors", label: "Saudi Ministry Curriculum" },
                  { href: "/uae/physics-maths-tutor", label: "Physics & Maths Tutor UAE" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <p className="text-sm text-gray-500">
            &copy; {year} StudyHours. All rights reserved.
          </p>
          <div className="flex gap-4 items-center">
            <InstagramButton />
            <LinkedInButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
