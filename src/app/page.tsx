import NarrativeHome from "@/app/components/home/narrative/NarrativeHome";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StudyHours | Outcome-Driven K-12 Tutoring Platform",
  description:
    "Expert-guided K-12 tutoring for Math, Science, English and more. Personalized 1-on-1 sessions aligned with IB, IGCSE, and US curricula.",
  openGraph: {
    title: "StudyHours | Personalized K-12 Tutoring",
    description:
      "Empowering students with personalized, world-class tutoring. Expert tutors guided by intelligent systems.",
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
  twitter: {
    card: "summary_large_image",
    title: "StudyHours | Personalized K-12 Tutoring",
    description:
      "Expert tutors guided by intelligent systems, delivering personalized 1-on-1 sessions.",
    images: ["https://studyhours.com/hero_calm_education.png"],
  },
};

export default function Home() {
  return <NarrativeHome />;
}
