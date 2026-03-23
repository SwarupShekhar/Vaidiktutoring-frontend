import { Metadata } from "next";
import GCSEPageClient from "./GCSEPageClient";

export const metadata: Metadata = {
  title: "Expert GCSE Tutors Online | Personalized GCSE Online Tuition",
  description:
    "Improve your results with expert GCSE tutors online. StudyHours offers premium 1-on-1 GCSE online tuition across all exam boards (AQA, Edexcel, OCR) to build conceptual foundations and confidence.",
  alternates: {
    canonical: "https://studyhours.com/gcse-online-tutoring",
  },
  openGraph: {
    title: "Expert GCSE Tutors Online | Personalized GCSE Online Tuition",
    description:
      "Get the best GCSE online tuition with expert tutors. Achieve top results through personalized 1-on-1 learning.",
    url: "https://studyhours.com/gcse-online-tutoring",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours GCSE Tutoring",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expert GCSE Tutors Online | Personalized GCSE Online Tuition",
    description:
      "Expert tutors for all GCSE subjects including Maths, Sciences, and Humanities.",
    images: ["/hero_calm_education.png"],
  },
};

export default function Page() {
  return <GCSEPageClient />;
}
