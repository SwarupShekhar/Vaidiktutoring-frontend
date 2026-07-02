// Curated global exam calendar (Jun 2026 – Jun 2027) used to let a student pick
// their target exam on the homescreen. The `dates` strings are human-readable
// windows; `parseSoonestDate` extracts a best-effort default date for the
// countdown, which the student then confirms/adjusts.

export interface ExamEntry {
  id: string; // stable slug (region-exam) — this is what we persist on the student
  region: string;
  category: string;
  exam: string;
  curriculum: string;
  dates: string;
  notes?: string;
}

type RawExam = Omit<ExamEntry, 'id'>;

const RAW_EXAMS: RawExam[] = [
  // ── USA ──
  { region: 'USA', category: 'College Admissions', exam: 'SAT', curriculum: 'College Board Digital SAT', dates: 'Aug 22, Sep 12, Oct 3, Nov 7, Dec 5, 2026 · Mar 6, May 1, Jun 5, 2027', notes: 'Year-round; school-day dates also available' },
  { region: 'USA', category: 'College Admissions', exam: 'ACT', curriculum: 'Enhanced ACT (Eng/Math/Reading; Sci & Writing optional)', dates: 'Jul 11, Sep 19, Oct 17, Dec 12, 2026 · Feb, Apr, Jun, Jul 2027', notes: '7×/yr; no NY centers in July' },
  { region: 'USA', category: 'College Admissions', exam: 'PSAT/NMSQT', curriculum: 'College Board', dates: 'Oct 1–30, 2026 (school chooses date)', notes: 'For Grades 10–11; National Merit qualifier' },
  { region: 'USA', category: 'AP (College Credit)', exam: 'AP Exams', curriculum: 'College Board (38 subjects)', dates: 'May 4–8 & May 11–15, 2026 · Late testing ~May 18–22', notes: 'Late testing with alternate papers' },
  { region: 'USA', category: 'K12 State', exam: "NAEP (Nation's Report Card)", curriculum: 'US Dept of Education (Grade 4, 8, 12)', dates: 'Jan–Mar 2027 (biennial)', notes: 'Sampled — not every student' },
  { region: 'USA', category: 'Graduate Admissions', exam: 'GRE General', curriculum: 'ETS (Verbal/Quant/AWA)', dates: 'Year-round at Prometric & online', notes: '5-yr validity; ~$220 fee' },
  { region: 'USA', category: 'Graduate Admissions', exam: 'GMAT Focus', curriculum: 'GMAC (Quant/Verbal/DI)', dates: 'Year-round at test centers & online', notes: 'Max 5 attempts/year; $275–$300' },
  { region: 'USA', category: 'Graduate Admissions', exam: 'LSAT', curriculum: 'LSAC (Law)', dates: 'Jul, Aug, Sep, Oct, Nov 2026; Jan, Feb, Mar, Apr 2027', notes: 'Key dates: Oct for early-deadline law schools' },
  { region: 'USA', category: 'Graduate Admissions', exam: 'MCAT', curriculum: 'AAMC (Bio/Biochem/Psych/CARS/Chem/Phys)', dates: '~Jan–Sep 2027 (28 dates); registration opens ~Oct 2026', notes: 'Score valid 3 yrs' },
  { region: 'USA', category: 'Graduate Admissions', exam: 'DAT / OAT', curriculum: 'ADA / AOA', dates: 'Year-round at Prometric', notes: 'Dentistry / Optometry' },
  { region: 'USA', category: 'English Proficiency', exam: 'TOEFL iBT', curriculum: 'ETS', dates: 'Year-round (multiple dates/month worldwide)', notes: '2-yr validity; ~$200–260' },
  { region: 'USA', category: 'English Proficiency', exam: 'IELTS Academic', curriculum: 'British Council/IDP/Cambridge', dates: 'Year-round (~48 dates/yr at each centre)', notes: '2-yr validity' },
  { region: 'USA', category: 'Professional', exam: 'CFA Level 1–3', curriculum: 'CFA Institute', dates: 'L1: Feb, May, Aug, Nov 2027 · L2/L3: May & Nov 2027', notes: 'Sequential; L3 Nov added 2024' },
  { region: 'USA', category: 'Professional', exam: 'CPA (Core+Discipline)', curriculum: 'AICPA/NASBA', dates: 'Year-round (testing windows every quarter)', notes: '4-section exam; 18-month window' },

  // ── UK ──
  { region: 'UK', category: 'K12 Primary', exam: 'KS2 SATs', curriculum: 'England National Curriculum (Yr 6: Reading, Maths, GPS)', dates: 'May 11–15, 2026 · May 2027 (TBC)', notes: 'State schools only' },
  { region: 'UK', category: 'K12 Secondary', exam: 'GCSE', curriculum: 'AQA / Edexcel / OCR / WJEC / CCEA', dates: 'May 11 – Jun 26, 2026 · Results: Aug 20, 2026 · Exams ~May 10 – Jun 25, 2027', notes: 'Year 11 (age 16). Oct/Nov re-sit window also available' },
  { region: 'UK', category: 'K12 Post-16', exam: 'A-Level', curriculum: 'AQA / Edexcel / OCR / WJEC / CCEA', dates: 'May 11 – Jun 23, 2026 · Results: Aug 13, 2026 · May 10 – Jun 2027 (prov.)', notes: 'Year 13 (age 18); AS-Level same window' },
  { region: 'UK', category: 'K12 Post-16', exam: 'AS-Level', curriculum: 'AQA / Edexcel / OCR', dates: 'May 11 – Jun 23, 2026', notes: 'Standalone or as first year of A-Level' },
  { region: 'UK', category: 'K12 Post-16', exam: 'International Baccalaureate (IB DP)', curriculum: 'IB Diploma Programme', dates: 'Apr 24 – May 18, 2026 (written) · Nov session: Oct–Nov 2026', notes: 'Southern Hemisphere / Nov session for Aus/NZ schools' },
  { region: 'UK', category: 'K12 Post-16', exam: 'Cambridge Pre-U', curriculum: 'Cambridge International', dates: 'May–Jun 2026 (same window as A-Level)', notes: 'Alternative to A-Level at select independent schools' },
  { region: 'UK', category: 'Vocational / Post-16', exam: 'BTEC (Pearson)', curriculum: 'Pearson BTEC Nationals/Level 3', dates: 'Coursework ongoing; written exams May–Jun 2026', notes: 'Equivalents to A-Levels for university entry' },
  { region: 'UK', category: 'Vocational / Post-16', exam: 'T-Levels', curriculum: 'NCFE / Pearson / City & Guilds', dates: 'Core exam: May–Jun 2026; industry placement year-round', notes: '2-year vocational qualification; 45-day placement required' },
  { region: 'UK', category: 'Vocational / Post-16', exam: 'NCFE (Vocational)', curriculum: 'NCFE', dates: 'Ongoing assessments; synoptic exam windows vary by qualification', notes: 'Health, Education, Business, Digital tracks' },
  { region: 'UK', category: 'University Admissions Tests', exam: 'UCAT', curriculum: 'UCAT Consortium (Medicine/Dentistry)', dates: 'Testing window: Jul 13 – Sep 24, 2026 · Booking deadline: Sep 16, 2026', notes: 'For 2027 university entry' },
  { region: 'UK', category: 'University Admissions Tests', exam: 'LNAT', curriculum: 'Law National Aptitude Test', dates: 'Registration opens Aug 1, 2026 · Oxbridge deadline: Oct 15, 2026 · Final deadline: Jan 31, 2027', notes: 'University of Oxford, UCL, Durham, Bristol, KCL etc.' },
  { region: 'UK', category: 'University Admissions Tests', exam: 'TMUA', curriculum: 'Cambridge Assessment', dates: 'Registration opens Aug 1, 2026 · Testing: Oct 2026', notes: 'For Maths/CS at Cambridge, Durham, Bath, Warwick' },
  { region: 'UK', category: 'University Admissions Tests', exam: 'ESAT', curriculum: 'Cambridge/Imperial', dates: 'Registration opens Aug 1, 2026 · Testing: Oct 2026', notes: 'Engineering & Science Admissions Test (Cambridge, Imperial)' },
  { region: 'UK', category: 'University Admissions Tests', exam: 'TARA (NEW 2026)', curriculum: 'University Admissions Tests UK (UCL)', dates: '2026 (dates TBC — new test)', notes: 'For Math & Social Science programmes at UCL' },
  { region: 'UK', category: 'University Admissions Tests', exam: 'STEP (Cambridge Maths)', curriculum: 'Cambridge Assessment', dates: 'Jun 2027 (typical window)', notes: 'Sixth Term Examination Papers; for Cambridge Maths offers' },
  { region: 'UK', category: 'Graduate Admissions', exam: 'UKCAT / UCAT Graduate', curriculum: 'UCAT Consortium', dates: 'Same window as undergraduate UCAT', notes: 'Some graduate-entry medicine programmes' },
  { region: 'UK', category: 'Professional', exam: 'ACCA', curriculum: 'ACCA (Accountancy)', dates: 'Mar, Jun, Sep, Dec 2026 & 2027', notes: 'Papers available every quarter' },

  // ── SINGAPORE ──
  { region: 'Singapore', category: 'K12 Primary', exam: 'PSLE', curriculum: 'MOE Singapore (English, Maths, Science, Mother Tongue)', dates: 'Oral: Aug 12–13, 2026 · LC: Sep 15 · Written: Sep 24–30, 2026 · Results: Nov 24–25, 2026', notes: 'Primary 6 national exam' },
  { region: 'Singapore', category: 'K12 Secondary', exam: 'GCE N(A)-Level & N(T)-Level', curriculum: 'MOE / SEAB Cambridge', dates: 'Oral: Jul 2026 · Written: Sep–Oct 13, 2026 · Results: Dec 17–21, 2026', notes: 'Sec 4/5 Normal Academic & Normal Technical streams' },
  { region: 'Singapore', category: 'K12 Secondary', exam: 'GCE O-Level', curriculum: 'MOE / SEAB Cambridge (10+ subjects)', dates: 'MT written: Jun 2, 2026 · Oral: Jul 2026 · Practicals: Sep–Oct · Written: Oct 19 – Nov 10, 2026 · Results: Jan 13–15, 2027', notes: 'Sec 4/5; leads to JC/Polytechnic/ITE' },
  { region: 'Singapore', category: 'K12 Pre-University', exam: 'GCE A-Level', curriculum: 'MOE / SEAB Cambridge (H1/H2/H3 subjects)', dates: 'Early papers: Jun 2, 2026 · Main written: Nov 2–27, 2026 · Results: Feb 19–23, 2027', notes: 'JC Year 2; leads to university admission' },
  { region: 'Singapore', category: 'K12 Pre-University', exam: 'International Baccalaureate (IB DP)', curriculum: 'IB Diploma Programme', dates: 'Apr–May 2026 written (IB schools)', notes: 'Offered at ACS(I), UWCSEA, Singapore American School etc.' },
  { region: 'Singapore', category: 'K12 Integrated Programme', exam: 'Integrated Programme (IP) Internal Exams', curriculum: 'School-based (no O-Level)', dates: 'Year-end: Oct–Nov 2026 (school-specific)', notes: 'IP schools skip O-Level; direct to A-Level or IB' },
  { region: 'Singapore', category: 'University Admissions', exam: 'UCAT ANZ (NUS Medicine)', curriculum: 'UCAT ANZ Consortium', dates: 'Jun–Sep 2026 (similar window to UK UCAT)', notes: 'Required for NUS Yong Soo Lin Medicine' },

  // ── AUSTRALIA ──
  { region: 'Australia', category: 'K12 National', exam: 'NAPLAN', curriculum: 'ACARA (Literacy & Numeracy, Yr 3/5/7/9)', dates: 'Mar 11–21, 2026', notes: 'Online adaptive; all states except NT/VIC who have slight variations' },
  { region: 'Australia', category: 'K12 – NSW', exam: 'HSC (Higher School Certificate)', curriculum: 'NESA (NSW)', dates: 'Trial exams: Aug 2026 · Written: Oct 13 – Nov 2026 · Results + ATAR: Dec 2026', notes: 'Year 12; 100+ courses' },
  { region: 'Australia', category: 'K12 – VIC', exam: 'VCE (Victorian Certificate of Education)', curriculum: 'VCAA', dates: 'GAT: Jun 16, 2026 · Oral/Performance: Oct–Nov · Written: Oct 26 – Nov 2026 · Results: Dec 2026', notes: 'Year 12; includes VCE VM (Voc. Major)' },
  { region: 'Australia', category: 'K12 – QLD', exam: 'QCE (Queensland Certificate of Education)', curriculum: 'QCAA', dates: 'External assessments: Oct 26 – Nov 17, 2026', notes: 'Year 12; school-based assessments throughout the year' },
  { region: 'Australia', category: 'K12 – WA', exam: 'WACE (Western Australian Certificate of Education)', curriculum: 'School Curriculum & Standards Authority', dates: 'Practical ATAR: Sep 26 – Oct 25, 2026 · Written ATAR: Oct 28 – Nov 19, 2026 · ATAR: Dec 2026', notes: 'Year 12' },
  { region: 'Australia', category: 'K12 – SA', exam: 'SACE (South Australian Certificate of Education)', curriculum: 'SACE Board', dates: 'Written exams: Nov 2 – Nov 2026 · Results + ATAR: Dec 2026', notes: 'Year 12; Research Project compulsory' },
  { region: 'Australia', category: 'K12 – TAS', exam: 'TCE (Tasmanian Certificate of Education)', curriculum: 'TASC', dates: 'Written: Nov 9–19, 2026 · Results: Dec 2026', notes: 'Levels 3 & 4' },
  { region: 'Australia', category: 'K12 – ACT', exam: 'ACT Senior Secondary Certificate', curriculum: 'ACT Board of Senior Secondary Studies (BSSS)', dates: 'AST: Aug 25–26, 2026 · School-based assessment year-round', notes: 'Most assessment is school-based' },
  { region: 'Australia', category: 'University Admissions', exam: 'UCAT ANZ', curriculum: 'UCAT ANZ Consortium (Medicine/Dentistry)', dates: 'Testing window: Jul–Sep 2026 (similar to UK)', notes: 'Required for most AU/NZ medical schools' },
  { region: 'Australia', category: 'University Admissions', exam: 'GAMSAT', curriculum: 'ACER (Graduate Medicine)', dates: 'Sep 2026 & Mar 2027', notes: 'Graduate-entry medicine; UK sitting also available' },
  { region: 'Australia', category: 'English Proficiency', exam: 'IELTS Academic', curriculum: 'British Council/IDP', dates: 'Year-round at test centres nationwide', notes: 'Required for most university admissions for international students' },

  // ── MIDDLE EAST ──
  { region: 'Middle East', category: 'International / British Curriculum', exam: 'IGCSE / Cambridge O-Level', curriculum: 'Cambridge International Assessment', dates: '⚠️ May/Jun 2026 CANCELLED in UAE, Kuwait, Bahrain, Lebanon · Oct/Nov 2026 series TBC · Jan 2027 series TBC', notes: 'Conflict disruption; portfolio-of-evidence alternative for May/Jun 2026' },
  { region: 'Middle East', category: 'International / British Curriculum', exam: 'Cambridge AS & A-Level (CAIE)', curriculum: 'Cambridge International Assessment', dates: '⚠️ May/Jun 2026 CANCELLED in UAE, Kuwait, Bahrain, Lebanon · Oct/Nov 2026 TBC', notes: 'Alternative assessment in force for affected countries' },
  { region: 'Middle East', category: 'International / British Curriculum', exam: 'Pearson Edexcel International GCSE / IAL', curriculum: 'Pearson Edexcel', dates: '⚠️ May/Jun 2026 CANCELLED in UAE, Kuwait, Bahrain, Lebanon · Oct/Nov 2026 TBC', notes: 'Contingency evidence route for May/Jun 2026' },
  { region: 'Middle East', category: 'International / British Curriculum', exam: 'OxfordAQA International GCSE / A-Level', curriculum: 'OxfordAQA', dates: '⚠️ May/Jun 2026 SUSPENDED in UAE, Kuwait, Bahrain · Oct/Nov 2026 TBC', notes: 'School evidence submitted by Jun 12, 2026 deadline' },
  { region: 'Middle East', category: 'International', exam: 'IB Diploma Programme (DP)', curriculum: 'IB Organisation', dates: '⚠️ May 2026: Non-Exam Contingency in UAE, Bahrain, Kuwait, Lebanon (12 countries affected) · Nov 2026 session ongoing', notes: 'Defer/transfer options available at no cost; Nov session unaffected' },
  { region: 'Middle East', category: 'International', exam: 'IB MYP (Middle Years)', curriculum: 'IB Organisation', dates: 'May 2026 impacted in conflict zones (NECM applied)', notes: '12 affected countries: UAE, KSA, Kuwait, Qatar, Bahrain, Jordan, Oman, Lebanon, Iraq, Iran, Israel, Palestine' },
  { region: 'Middle East', category: 'Indian Curriculum (Gulf)', exam: 'CBSE Board (Class 10 & 12)', curriculum: 'Central Board of Secondary Education', dates: 'Class 10 CANCELLED (Gulf, Mar 2026) · Class 12 postponed/rescheduled', notes: 'Affects India-curriculum schools in UAE, KSA, Kuwait, Qatar, Bahrain, Oman' },
  { region: 'Middle East', category: 'Indian Curriculum (Gulf)', exam: 'CISCE (ICSE / ISC)', curriculum: 'Council for the Indian School Certificate Examinations', dates: 'Class 10 & 12 CANCELLED (UAE, Gulf region, Mar–Apr 2026)', notes: 'Alternative assessment mechanism under development' },
  { region: 'Middle East', category: 'US Curriculum', exam: 'SAT / ACT / AP', curriculum: 'College Board / ACT Inc.', dates: 'Ongoing as per global schedule (test centres permitting)', notes: 'Students should verify specific centre availability in their city' },

  // ── GLOBAL ──
  { region: 'Global', category: 'English Proficiency', exam: 'IELTS Academic & General', curriculum: 'Cambridge / British Council / IDP', dates: 'Year-round (Paper & Computer-based, 48+ dates/yr)', notes: 'Accepted: UK, AU, CA, NZ, EU, most universities worldwide. 2-yr validity.' },
  { region: 'Global', category: 'English Proficiency', exam: 'TOEFL iBT', curriculum: 'ETS', dates: 'Year-round (multiple dates/month at Prometric & online)', notes: 'Widely accepted in USA, Canada, Australia. 2-yr validity.' },
  { region: 'Global', category: 'English Proficiency', exam: 'PTE Academic', curriculum: 'Pearson', dates: 'Year-round (daily slots; book 48 hrs in advance)', notes: 'Fast results (2–5 days). Accepted: AU, UK, NZ, Canada, EU. 2-yr validity.' },
  { region: 'Global', category: 'English Proficiency', exam: 'Duolingo English Test (DET)', curriculum: 'Duolingo', dates: 'Year-round (online, on demand)', notes: '~$65; growing acceptance at 3000+ universities' },
  { region: 'Global', category: 'English Proficiency', exam: 'Cambridge C1 Advanced / C2 Proficiency', curriculum: 'Cambridge Assessment English', dates: 'Year-round at Cambridge centres', notes: 'Lifetime validity; widely accepted in UK/EU universities' },
  { region: 'Global', category: 'Graduate Admissions', exam: 'GRE General & Subject Tests', curriculum: 'ETS', dates: 'General: year-round at Prometric & online · Subject: Nov 2026, Dec 2026', notes: 'Subject tests: Biology, Chemistry, Literature, Maths, Physics, Psychology' },
  { region: 'Global', category: 'Graduate Admissions', exam: 'GMAT Focus Edition', curriculum: 'GMAC', dates: 'Year-round at test centers & online', notes: 'Accepted at 7000+ MBA programmes globally' },
  { region: 'Global', category: 'International K12', exam: 'IB Diploma Programme (DP)', curriculum: 'IB Organisation', dates: 'May session: Apr 24 – May 20, 2027 · Nov session: Oct–Nov 2026', notes: '5500+ schools in 159 countries; 2 sessions/yr' },
  { region: 'Global', category: 'International K12', exam: 'IB Primary Years Programme (PYP)', curriculum: 'IB Organisation', dates: 'School-determined (no external exams; portfolio-based)', notes: 'Ages 3–12' },
  { region: 'Global', category: 'International K12', exam: 'IB Middle Years Programme (MYP)', curriculum: 'IB Organisation', dates: 'Personal Project: submitted Apr 2026 · eAssessments: Apr–May 2026', notes: 'Ages 11–16' },
  { region: 'Global', category: 'International K12', exam: 'Cambridge IGCSE', curriculum: 'Cambridge International Assessment Education', dates: 'May/Jun 2026 (main) · Oct/Nov 2026 (second sitting)', notes: 'Offered in 150+ countries; 70+ subjects' },
  { region: 'Global', category: 'International K12', exam: 'Cambridge International AS & A-Level', curriculum: 'Cambridge International Assessment Education', dates: 'May/Jun 2026 · Oct/Nov 2026', notes: 'Offered in 150+ countries' },
];

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Build the exported list with stable, unique ids (region-exam, deduped).
export const EXAMS: ExamEntry[] = (() => {
  const seen = new Map<string, number>();
  return RAW_EXAMS.map((e) => {
    let id = `${slug(e.region)}-${slug(e.exam)}`;
    const n = seen.get(id) ?? 0;
    seen.set(id, n + 1);
    if (n > 0) id = `${id}-${n + 1}`;
    return { id, ...e };
  });
})();

export const EXAM_REGIONS = ['USA', 'UK', 'Singapore', 'Australia', 'Middle East', 'Global'];

export function getExamById(id?: string | null): ExamEntry | null {
  if (!id) return null;
  return EXAMS.find((e) => e.id === id) ?? null;
}

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11,
};

const NO_FIXED_DATE = /year-?round|on demand|ongoing|school-determined|school chooses|biennial|tbc|tba/i;

/**
 * Best-effort: pull the soonest FUTURE date out of a human-readable `dates`
 * string, returned as `YYYY-MM-DD` for an <input type="date"> default. Returns
 * null for year-round / undated / clearly-disrupted windows — the student then
 * picks their own date. Only a starting suggestion; the student confirms.
 */
export function parseSoonestDate(dates: string, now: Date = new Date()): string | null {
  if (!dates || NO_FIXED_DATE.test(dates)) return null;

  const re = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\.?\s+(\d{1,2})\b|\b(20\d{2})\b/gi;
  const pending: { month: number; day: number }[] = [];
  const candidates: Date[] = [];

  let m: RegExpExecArray | null;
  while ((m = re.exec(dates)) !== null) {
    if (m[3]) {
      const year = parseInt(m[3], 10);
      for (const p of pending) candidates.push(new Date(year, p.month, p.day));
      pending.length = 0;
    } else {
      const month = MONTHS[m[1].toLowerCase()];
      const day = parseInt(m[2], 10);
      if (month != null && day >= 1 && day <= 31) pending.push({ month, day });
    }
  }

  if (candidates.length === 0) return null;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const future = candidates
    .filter((d) => d.getTime() >= startOfToday)
    .sort((a, b) => a.getTime() - b.getTime());
  const chosen = future[0];
  if (!chosen) return null;

  const y = chosen.getFullYear();
  const mo = String(chosen.getMonth() + 1).padStart(2, '0');
  const d = String(chosen.getDate()).padStart(2, '0');
  return `${y}-${mo}-${d}`;
}

/** True if the exam's window mentions cancellation/disruption keywords. */
export function isExamDisrupted(e: Pick<ExamEntry, 'dates' | 'notes'>): boolean {
  const t = `${e.dates} ${e.notes ?? ''}`;
  return /CANCELLED|SUSPENDED|⚠️|postponed|impacted|contingency/i.test(t);
}
