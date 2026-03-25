import NarrativeHome from "@/app/components/home/narrative/NarrativeHome";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Tutoring for Kids | 1-on-1 Learning | StudyHours",
  description:
    "Find an expert online tutoring for kids with personalized 1-on-1 sessions. StudyHours helps students improve grades, confidence, and learning outcomes.",
  openGraph: {
    title: "Online Tutoring for Kids | 1-on-1 Learning | StudyHours",
    description:
      "Find an expert online tutoring for kids with personalized 1-on-1 sessions. StudyHours helps students improve grades, confidence, and learning outcomes.",
    url: "https://studyhours.com",
    siteName: "StudyHours",
    images: [
      {
        url: "https://studyhours.com/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours Learning Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://studyhours.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Tutoring for Kids | 1-on-1 Learning | StudyHours",
    description:
      "Find an expert online tutoring for kids with personalized 1-on-1 sessions. StudyHours helps students improve grades, confidence, and learning outcomes.",
    images: ["https://studyhours.com/hero_calm_education.png"],
  },
};

export default function Home() {
  return <NarrativeHome />;
}
