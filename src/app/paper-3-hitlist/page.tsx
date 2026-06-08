import { Metadata } from "next";
import HitlistClient from "./HitlistClient";

export const metadata: Metadata = {
  title: "GCSE Maths Paper 3: Final 48-Hour Plan, Hit-List & Calculator Traps",
  description: "Your last-minute GCSE Maths Paper 3 plan for Edexcel, AQA & OCR: hour-by-hour revision schedule plus a free 3-PDF pack — topic Hit-List, Formula Cheat Sheet, and Calculator Setup & 10 Traps. Exam Wednesday 10 June.",
  alternates: {
    canonical: "https://studyhours.com/paper-3-hitlist",
  },
  openGraph: {
    title: "GCSE Maths Paper 3: Final 48-Hour Plan | StudyHours",
    description: "Hour-by-hour last-minute plan plus a free 3-PDF pack — Hit-List, Formula Cheat Sheet & Calculator Traps — for Wednesday's Paper 3.",
    url: "https://studyhours.com/paper-3-hitlist",
    type: "website",
  },
};

export default function Page() {
  return <HitlistClient />;
}
