// Single source of truth for the GCSE Paper 3 lead-magnet PDFs.
// Imported by the landing page (paper-3-hitlist) and the email template (api/leads/route.ts).
//
// The PDFs are NOT in /public — they live in private-assets/paper3/ and are delivered
// ONLY as email attachments after a lead is captured. There is no public URL to the files.

// Path (relative to project root) where the gated PDFs are stored, outside /public.
export const PAPER3_PDF_DIR = "private-assets/paper3";

export interface Paper3Pdf {
  icon: string;
  label: string;
  file: string;
}

export const PAPER3_PDFS: Paper3Pdf[] = [
  { icon: "📄", label: "The Paper 3 Hit-List", file: "GCSE-Maths-Paper3-Calc-Hitlist-v3n7h.pdf" },
  { icon: "🧮", label: "Formula Cheat Sheet", file: "GCSE-Maths-Calc-Formula-CheatSheet-q8m4p.pdf" },
  { icon: "⚙️", label: "Calculator Setup & 10 Traps", file: "GCSE-Maths-Paper3-Calculator-Setup-k7p2w.pdf" },
];
