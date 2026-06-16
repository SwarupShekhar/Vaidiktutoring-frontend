import { Metadata } from "next";
import RescueSheetClient from "../RescueSheetClient";

export const metadata: Metadata = {
  title: "Edexcel A-Level Maths Paper 3 Rescue Sheet (2025) | Free PDF | StudyHours",
  description: "Free last-minute revision sheet for Edexcel A-Level Maths Paper 3 (9MA0/03). Statistics & Mechanics formula triage, SUVAT decision tree, LDS cheat sheet, and examiner red flags.",
  alternates: {
    canonical: "https://studyhours.com/a-level/edexcel-maths-paper-3-rescue-sheet",
  },
  openGraph: {
    title: "Edexcel A-Level Maths Paper 3 Rescue Sheet (2025) | Free PDF | StudyHours",
    description: "Free last-minute revision sheet for Edexcel A-Level Maths Paper 3 (9MA0/03). Statistics & Mechanics formula triage, SUVAT decision tree, LDS cheat sheet, and examiner red flags.",
    url: "https://studyhours.com/a-level/edexcel-maths-paper-3-rescue-sheet",
    type: "website",
  },
};

export default function EdexcelRescueSheetPage() {
  return <RescueSheetClient board="edexcel" />;
}
