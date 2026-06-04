import { Metadata } from "next";
import WorksheetClient from "./WorksheetClient";

export const metadata: Metadata = {
  title: "Free GCSE Maths Paper 3 Worksheet 2025 | AQA & Edexcel Calculator Practice",
  description: "Free printable GCSE Maths Paper 3 practice worksheet. Top 10 calculator topics for AQA and Edexcel — compound interest, trig, bounds, and more. Exam on Wednesday 10 June.",
  alternates: {
    canonical: "https://studyhours.com/gcse-maths-paper3-worksheet",
  },
  openGraph: {
    title: "Free GCSE Maths Paper 3 Worksheet | AQA & Edexcel",
    description: "Top 10 calculator topics with practice questions. Free printable. Exam on Wednesday 10 June.",
    url: "https://studyhours.com/gcse-maths-paper3-worksheet",
    type: "website",
  },
};

export default function Page() {
  return <WorksheetClient />;
}
