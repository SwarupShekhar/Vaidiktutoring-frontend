import { Metadata } from "next";
import MethodologyPageClient from "./MethodologyPageClient";

export const metadata: Metadata = {
  title: "Our Teaching Methodology | StudyHours Expert Learning Approach",
  description: "Discover StudyHours' proven teaching methodology combining expert tutors with AI-powered learning. Personalized education that delivers real results.",
  alternates: {
    canonical: "https://studyhours.com/methodology",
  },
  openGraph: {
    title: "Our Teaching Methodology | StudyHours Expert Learning Approach",
    description: "Discover StudyHours' proven teaching methodology combining expert tutors with AI-powered learning. Personalized education that delivers real results.",
    url: "https://studyhours.com/methodology",
    images: [
      {
        url: "https://studyhours.com/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours Teaching Methodology",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Teaching Methodology | StudyHours Expert Learning Approach",
    description: "Discover StudyHours' proven teaching methodology combining expert tutors with AI-powered learning. Personalized education that delivers real results.",
  },
};

export default function Page() {
  return <MethodologyPageClient />;
}
