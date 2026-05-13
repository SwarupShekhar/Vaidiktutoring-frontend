// src/app/components/navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import NotificationsBtn from "./NotificationsBtn";
import SHLogo from "./SHLogo";

import { useAuthContext } from "@/app/context/AuthContext";
import { useCurriculum } from "../context/CurriculumContext";
import { CURRICULA } from "../config/curricula";

export default function Navbar() {
  const { user, logout } = useAuthContext();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [activeResourceGroup, setActiveResourceGroup] = useState<string | null>(null);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const { activeCurriculum, setCurriculum } = useCurriculum();

  const isActive = (path: string) => pathname?.startsWith(path);

  if (pathname?.startsWith("/session")) return null;

  const navLinks = [
    { name: "Subjects", href: "/subjects" },
    { name: "Methodology", href: "/methodology" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Blogs", href: "/blogs" },
  ];

  const resourceGroups = [
    {
      label: "UK & International",
      links: [
        { name: "Online Tutoring UK", href: "/online-tutoring-uk" },
        { name: "K-12 Online Tutoring", href: "/k-12-online-tutoring" },
        { name: "IB Tutors Online", href: "/ib-online-tutoring" },
        { name: "A-Level Tutors Online", href: "/a-level-online-tutoring" },
        { name: "IGCSE Tutors Online", href: "/igcse-online-tutoring" },
        { name: "GCSE Tutors Online", href: "/gcse-online-tutoring" },
      ],
    },
    {
      label: "UAE & Middle East",
      links: [
        { name: "Online Tutors Dubai", href: "/uae/online-tutors-dubai" },
        { name: "Online Tutors Abu Dhabi", href: "/uae/online-tutors-abu-dhabi" },
        { name: "Online Tutors Riyadh", href: "/saudi/online-tutors-riyadh" },
        { name: "MOE UAE Curriculum Tutors", href: "/uae/moe-uae-curriculum-tutors" },
        { name: "Saudi Ministry Curriculum Tutors", href: "/saudi/saudi-ministry-curriculum-tutors" },
        { name: "Physics and Maths Tutor UAE", href: "/uae/physics-maths-tutor" },
      ],
    },
    {
      label: "Singapore (MOE)",
      links: [
        { name: "PSLE Tutors Online", href: "/singapore/psle-tutors-online" },
        { name: "O-Level Tutors Singapore", href: "/singapore/o-level-tutors-singapore" },
        { name: "Primary School Tutors Singapore", href: "/singapore/primary-school-tutors-singapore" },
        { name: "MOE Singapore Curriculum Tutors", href: "/singapore/moe-singapore-curriculum-tutors" },
        { name: "A-Level Tutors Singapore", href: "/singapore/a-level-tutors-singapore" },
        { name: "IP Programme Tutors Singapore", href: "/singapore/ip-programme-tutors-singapore" },
      ],
    },
    {
      label: "Australia (ATAR/VCE/HSC)",
      links: [
        { name: "VCE Tutors Online", href: "/australia/vce-online-tutoring" },
        { name: "HSC Tutors Online", href: "/australia/hsc-online-tutoring" },
        { name: "ATAR Tutors Online", href: "/australia/atar-online-tutoring" },
        { name: "QCE Tutors Online", href: "/australia/qce-online-tutoring" },
        { name: "WACE Tutors Online", href: "/australia/wace-online-tutoring" },
        { name: "Australian Curriculum Tutors", href: "/australia/curriculum-tutoring" },
      ],
    },
  ];

  return (
    <nav className="w-full sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-white/20 dark:border-white/5 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 xl:px-12 py-3 lg:py-4 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-lg shadow-lg group-hover:scale-110 transition-all duration-300">
            <SHLogo className="w-full h-full" />
          </div>
          <div className="text-lg lg:text-xl font-black tracking-tighter text-deep-navy dark:text-white group-hover:opacity-80 transition-all">
            StudyHours
          </div>
        </Link>

        {/* Center: Navigation - Desktop Only */}
        <div className="hidden xl:flex items-center gap-1 p-1 rounded-full bg-slate-100/50 dark:bg-white/5 border border-white/20 dark:border-white/5 shrink">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-3 xl:px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
                isActive(link.href)
                  ? "bg-white dark:bg-white/10 text-primary shadow-sm"
                  : "text-text-secondary hover:text-primary"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Resources Dropdown */}
          <div className="relative">
            <button
              onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
              onMouseEnter={() => setResourcesDropdownOpen(true)}
              className={`px-3 xl:px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all flex items-center gap-1 ${
                resourceGroups.some((g) => g.links.some((link) => isActive(link.href)))
                  ? "bg-white dark:bg-white/10 text-primary shadow-sm"
                  : "text-text-secondary hover:text-primary"
              }`}
            >
              Resources
              <svg
                className={`w-3 h-3 transition-transform ${resourcesDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu - Tier 1: Regions */}
            {resourcesDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-black rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 py-3 animate-in fade-in slide-in-from-top-2 duration-200 z-70"
                onMouseLeave={() => {
                   setResourcesDropdownOpen(false);
                   setActiveResourceGroup(null);
                }}
              >
                {resourceGroups.map((group) => (
                  <div 
                    key={group.label} 
                    className="relative group/sub"
                    onMouseEnter={() => setActiveResourceGroup(group.label)}
                  >
                    <div className={`flex items-center justify-between px-4 py-3 text-sm font-bold transition-all cursor-pointer ${activeResourceGroup === group.label ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-slate-100 dark:hover:bg-white/10"}`}>
                      <span>{group.label}</span>
                      <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>

                    {/* Tier 2: Specific Pages (Flyout) */}
                    {activeResourceGroup === group.label && (
                      <div className="absolute left-full top-0 ml-1 w-64 bg-white dark:bg-black rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 py-3 animate-in fade-in zoom-in-95 duration-150">
                        {group.links.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            className={`block px-4 py-2.5 text-xs font-bold transition-all ${
                              isActive(link.href)
                                ? "bg-primary/10 text-primary"
                                : "text-text-secondary hover:bg-slate-100 dark:hover:bg-white/10 hover:text-primary"
                            }`}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Auth & Toggle Group */}
        <div className="flex items-center gap-2 lg:gap-4 shrink-0">
          {/* Country Selector */}
          <div className="relative group/country">
            <button
              onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
              onMouseEnter={() => setCountryDropdownOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-white/20 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-all text-xs font-bold"
            >
              <span className="text-base">{activeCurriculum.flag}</span>
              <span className="hidden xl:block text-text-secondary">{activeCurriculum.country}</span>
              <svg
                className={`w-3 h-3 text-text-secondary transition-transform ${countryDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {countryDropdownOpen && (
              <div 
                className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-black rounded-xl shadow-xl border border-white/20 dark:border-white/10 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-60"
                onMouseLeave={() => setCountryDropdownOpen(false)}
              >
                {CURRICULA.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCurriculum(c.id);
                      setCountryDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-3 ${
                      activeCurriculum.id === c.id
                        ? "bg-primary/10 text-primary"
                        : "text-text-secondary hover:bg-slate-100 dark:hover:bg-white/10 hover:text-primary"
                    }`}
                  >
                    <span className="text-base">{c.flag}</span>
                    <span>{c.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-white/10 hidden xl:block mx-1" />

          {/* Dashboard Link */}
          {user && (
            <Link
              href={
                user.role === "admin"
                  ? "/admin/dashboard"
                  : user.role === "tutor"
                    ? "/tutor/dashboard"
                    : user.role === "student"
                      ? "/students/dashboard"
                      : "/parent/dashboard"
              }
              className="hidden xl:block text-xs font-bold tracking-wide transition-all text-text-secondary hover:text-primary"
            >
              Dashboard
            </Link>
          )}

          {/* Primary CTA */}
          {(!user || user.role !== "tutor") && (
            <Link
              href={user ? "/bookings/new" : "/signup?type=assessment"}
              className="hidden sm:inline-flex items-center justify-center px-4 lg:px-6 py-2 rounded-full bg-primary text-white font-black text-xs tracking-wide hover:bg-sapphire hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20"
            >
              Book Demo
            </Link>
          )}

          <div className="h-4 w-px bg-slate-200 dark:bg-white/10 hidden xl:block" />

          {user ? (
            <button
              onClick={logout}
              className="hidden xl:block px-2 lg:px-4 py-2 text-xs font-bold text-text-secondary hover:text-red-500 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden xl:block px-2 lg:px-4 py-2 text-xs font-bold text-text-secondary hover:text-primary transition-colors"
            >
              Login
            </Link>
          )}

          <div className="flex items-center gap-1">
            {user && <NotificationsBtn />}
            <div className="scale-50 origin-right">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5 text-deep-navy dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Inside nav, properly aligned */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-white/20 dark:border-white/5 bg-white dark:bg-black">
          <div className="max-w-[1400px] mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              key="Explore Hub"
              href="/subjects"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm font-extrabold tracking-wide transition-all flex items-center gap-2 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 border border-indigo-500/20`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Explore Hub
            </Link>

            {/* Mobile Resources Submenu - Tiered Accordion Style */}
            <div className="py-2 space-y-1">
              {resourceGroups.map((group) => (
                <div key={group.label}>
                  <button 
                    onClick={() => setActiveResourceGroup(activeResourceGroup === group.label ? null : group.label)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-black text-sapphire uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                  >
                    <span>{group.label}</span>
                    <svg className={`w-4 h-4 transition-transform ${activeResourceGroup === group.label ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {activeResourceGroup === group.label && (
                    <div className="grid grid-cols-1 gap-0.5 mt-1 border-l-2 border-sapphire/20 ml-4 pl-2 animate-in slide-in-from-top duration-200">
                      {group.links.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                            isActive(link.href)
                              ? "bg-primary/10 text-primary"
                              : "text-text-secondary hover:bg-slate-100 dark:hover:bg-white/10"
                          }`}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {user && (
              <Link
                href={
                  user.role === "admin"
                    ? "/admin/dashboard"
                    : user.role === "tutor"
                      ? "/tutor/dashboard"
                      : user.role === "student"
                        ? "/students/dashboard"
                        : "/parent/dashboard"
                }
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all text-text-secondary hover:bg-slate-100 dark:hover:bg-white/10"
              >
                Dashboard
              </Link>
            )}
            <div className="flex gap-2 mt-2">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 px-3 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 px-3 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all text-center text-text-secondary hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  Login
                </Link>
              )}
              {(!user || user.role !== "tutor") && (
                <Link
                  href={user ? "/bookings/new" : "/signup?type=assessment"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 px-3 py-2.5 rounded-lg bg-primary text-white font-bold text-sm tracking-wide text-center hover:bg-sapphire transition-all"
                >
                  Book Demo
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
