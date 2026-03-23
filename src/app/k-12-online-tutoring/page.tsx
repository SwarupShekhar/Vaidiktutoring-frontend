import { Metadata } from "next";
import K12PageClient from "./K12PageClient";

export const metadata: Metadata = {
  title: "Premium K-12 Online Tutoring Service | StudyHours",
  description: "Achieve better results with our K-12 online tutoring service. Personalized live classes and academic support programs for students in every grade.",
  alternates: {
    canonical: "https://studyhours.com/k-12-online-tutoring",
  },
  openGraph: {
    title: "Premium K-12 Online Tutoring Service | StudyHours",
    description: "Achieve better results with our K-12 online tutoring service. Personalized live classes and academic support programs for students in every grade.",
    url: "https://studyhours.com/k-12-online-tutoring",
    images: [
      {
        url: "https://studyhours.com/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours K-12 Online Tutoring",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium K-12 Online Tutoring Service | StudyHours",
    description: "Achieve better results with our K-12 online tutoring service. Personalized live classes and academic support programs for students in every grade.",
  },
};

export default function Page() {
  return <K12PageClient />;
}
