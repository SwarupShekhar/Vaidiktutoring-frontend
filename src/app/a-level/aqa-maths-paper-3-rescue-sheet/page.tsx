import { Metadata } from "next";
import RescueSheetClient from "../RescueSheetClient";

export const metadata: Metadata = {
  title: "AQA A-Level Maths Paper 3 Rescue Sheet (2025) | Free PDF | StudyHours",
  description: "Free last-minute revision sheet for AQA A-Level Maths Paper 3 (7357/3). Formula triage, hypothesis testing blueprint, examiner report patterns, and mark scheme language. Built from official sources.",
  alternates: {
    canonical: "https://studyhours.com/a-level/aqa-maths-paper-3-rescue-sheet",
  },
  openGraph: {
    title: "AQA A-Level Maths Paper 3 Rescue Sheet (2025) | Free PDF | StudyHours",
    description: "Free last-minute revision sheet for AQA A-Level Maths Paper 3 (7357/3). Formula triage, hypothesis testing blueprint, examiner report patterns, and mark scheme language. Built from official sources.",
    url: "https://studyhours.com/a-level/aqa-maths-paper-3-rescue-sheet",
    type: "website",
  },
};

export default function AqaRescueSheetPage() {
  return <RescueSheetClient board="aqa" />;
}
