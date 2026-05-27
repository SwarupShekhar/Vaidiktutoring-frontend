"use client";

import React from "react";
import { Download, Lock, CheckCircle2 } from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";

interface Resource {
  title: string;
  description: string;
  gated: boolean;
  tag: string;
  downloadUrl: string;
}

const RESOURCES: Resource[] = [
  {
    title: "H2 Math Formula Sheet",
    description: "Every formula from the SEAB 2026 syllabus, organised by topic. Print-ready.",
    gated: true, // Requires login
    tag: "H2 Math",
    downloadUrl: "/resources/H2_Math_Formula_Sheet_Studyhours.pdf",
  },
  {
    title: "JC1 Survival Checklist",
    description: "What to do in your first month of JC before study habits solidify.",
    gated: false, // Free direct download
    tag: "JC Life",
    downloadUrl: "/resources/JC1_Survival_Checklist_Studyhours.pdf",
  },
  {
    title: "H2 Chemistry Organic Synthesis Pathway Map",
    description: "Every named reaction, reagent, and condition mapped as a visual flowchart. The most-shared resource we have produced.",
    gated: true,
    tag: "H2 Chemistry",
    downloadUrl: "/resources/h2-chemistry-organic-pathway.pdf",
  },
  {
    title: "GP Essay Structures: 5 Templates",
    description: "Argument structure templates for the 5 most common GP essay types, with annotated examples.",
    gated: true,
    tag: "General Paper",
    downloadUrl: "/resources/gp-essay-structures.pdf",
  },
  {
    title: "H2 Economics Essay Framework",
    description: "The exact PEEL structure used by top scorers, with worked examples from past A-Level papers.",
    gated: true,
    tag: "H2 Economics",
    downloadUrl: "/resources/h2-economics-framework.pdf",
  },
  {
    title: "UAS Score Tracker PDF",
    description: "Printable tracker to monitor your projected UAS as grades come in throughout JC2.",
    gated: true,
    tag: "UAS / Results",
    downloadUrl: "/resources/uas-score-tracker.pdf",
  },
];

function ResourceCard({ resource }: { resource: Resource }) {
  const { user } = useAuthContext();
  const isLoggedIn = !!user;

  return (
    <div className="border border-[oklch(0.90_0.02_230)] dark:border-[oklch(0.22_0.02_240)] rounded-xl bg-white dark:bg-[oklch(0.14_0.01_240)] overflow-hidden">
      <div className="px-5 py-4 flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            resource.gated && !isLoggedIn
              ? "bg-[oklch(0.95_0.01_230)]"
              : "bg-[oklch(0.96_0.04_145)] dark:bg-[oklch(0.14_0.04_145)]"
          }`}
        >
          {resource.gated && !isLoggedIn ? (
            <Lock size={16} className="text-[oklch(0.6_0.01_230)]" />
          ) : (
            <Download size={16} className="text-[oklch(0.45_0.15_145)]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className="inline-block text-xs font-semibold text-[oklch(0.45_0.18_250)] bg-[oklch(0.95_0.03_250)] rounded-full px-2 py-0.5">
              {resource.tag}
            </span>
            
            {/* Gated status badge */}
            {resource.gated ? (
              isLoggedIn ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[oklch(0.45_0.15_145)] bg-[oklch(0.96_0.04_145)]/20 dark:bg-[oklch(0.14_0.04_145)]/30 rounded-full px-2 py-0.5 border border-[oklch(0.45_0.15_145)]/20">
                  <Lock size={9} className="opacity-70" /> Gated (Unlocked)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 rounded-full px-2 py-0.5 border border-amber-500/20">
                  <Lock size={9} /> Gated / Sign-in required
                </span>
              )
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 rounded-full px-2 py-0.5 border border-emerald-500/20">
                Free Download
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-heading font-semibold text-[oklch(0.2_0.01_240)] dark:text-[oklch(0.92_0.01_230)] text-sm leading-snug">
              {resource.title}
            </p>
            <p className="text-xs text-[oklch(0.55_0.01_230)] dark:text-[oklch(0.60_0.01_230)] mt-1 leading-relaxed">
              {resource.description}
            </p>
          </div>

          {!resource.gated || isLoggedIn ? (
            <a 
              href={resource.downloadUrl}
              download
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[oklch(0.45_0.15_145)] hover:text-[oklch(0.35_0.18_145)] transition-colors"
            >
              <Download size={13} />
              Download free
            </a>
          ) : (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <a
                href="/login?redirect=/singapore-jc-guide"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[oklch(0.45_0.18_250)] hover:text-[oklch(0.35_0.2_250)] transition-colors"
              >
                <Lock size={12} className="inline" />
                Sign in to download
              </a>
              <span className="text-slate-300 dark:text-slate-700 text-xs">|</span>
              <a
                href="/signup?redirect=/singapore-jc-guide"
                className="text-xs font-semibold text-[oklch(0.45_0.18_250)] hover:text-[oklch(0.35_0.2_250)] transition-colors"
              >
                Sign up free
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResourcesHub() {
  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        {RESOURCES.map((r, i) => (
          <ResourceCard key={i} resource={r} />
        ))}
      </div>
      <p className="text-xs text-[oklch(0.6_0.01_230)] px-1 pt-1">
        Free resources can be downloaded directly. Gated resources require a student account: sign in or sign up free to download instantly.
      </p>
    </div>
  );
}
