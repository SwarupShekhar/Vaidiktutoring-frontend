import { Metadata } from "next";
import IGCSEPageClient from "./IGCSEPageClient";

export const metadata: Metadata = {
  title: "IGCSE Online Tuition & Tutoring Service | StudyHours",
  description:
    "Expert IGCSE online tuition and tutoring for all subjects. Personalized 1-on-1 IGCSE online courses designed to boost grades and exam confidence.",
  alternates: {
    canonical: "https://studyhours.com/igcse-online-tutoring",
  },
  openGraph: {
    title: "IGCSE Online Tuition & Tutoring Service | StudyHours",
    description:
      "Get the best IGCSE online tuition with expert tutors. Achieve top results through personalized 1-on-1 learning.",
    url: "https://studyhours.com/igcse-online-tutoring",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours IGCSE Tutoring",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IGCSE Online Tuition & Tutoring Service | StudyHours",
    description:
      "Expert tutors for all IGCSE subjects including Maths, Sciences, and Humanities.",
    images: ["/hero_calm_education.png"],
  },
};

export default function Page() {
  return <IGCSEPageClient />;
}
