import { Metadata } from "next";
import ALevelPageClient from "./ALevelPageClient";

export const metadata: Metadata = {
  title: "Expert A-Level Tutors Online | Private A-Level Tuition & Exam Prep",
  description: "Boost your grades with expert A-Level tutors online. StudyHours provides premium 1-on-1 private A-Level tuition and exam preparation across all subjects and exam boards.",
  alternates: {
    canonical: "https://studyhours.com/a-level-online-tutoring",
  },
  openGraph: {
    title: "Expert A-Level Tutors Online | Private A-Level Tuition & Exam Prep",
    description: "Boost your grades with expert A-Level tutors online. StudyHours provides premium 1-on-1 private A-Level tuition and exam preparation across all subjects and exam boards.",
    url: "https://studyhours.com/a-level-online-tutoring",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours A-Level Tutoring",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expert A-Level Tutors Online | Private A-Level Tuition & Exam Prep",
    description: "Boost your grades with expert A-Level tutors online. StudyHours provides premium 1-on-1 private A-Level tuition and exam preparation across all subjects and exam boards.",
    images: ["/hero_calm_education.png"],
  },
};

export default function Page() {
  return <ALevelPageClient />;
}
