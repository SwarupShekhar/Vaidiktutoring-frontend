import { Metadata } from "next";
import HitlistClient from "./HitlistClient";

export const metadata: Metadata = {
  title: "Free GCSE Maths Paper 3 Hit-List & Formula Cheat Sheet 2025",
  description: "Get the definitive Paper 3 Calculator Hit-List and Formula Cheat Sheet for Edexcel, AQA, and OCR. Exam on Wednesday 10 June.",
  alternates: {
    canonical: "https://studyhours.com/paper-3-hitlist",
  },
  openGraph: {
    title: "Free GCSE Maths Paper 3 Hit-List | StudyHours",
    description: "Download the definitive Paper 3 Calculator Hit-List and Formula Cheat Sheet for Wednesday's exam.",
    url: "https://studyhours.com/paper-3-hitlist",
    type: "website",
  },
};

export default function Page() {
  return <HitlistClient />;
}
