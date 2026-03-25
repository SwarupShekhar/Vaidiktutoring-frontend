import { Metadata } from "next";
import CareersPageClient from "@/app/careers/CareersPageClient";

export const metadata: Metadata = {
  title: "Careers | Join StudyHours Team",
  description:
    "Join StudyHours and help shape the future of K-12 education. We're looking for passionate educators, engineers, and innovators.",
  alternates: {
    canonical: "https://studyhours.com/careers",
  },
  openGraph: {
    title: "Careers | Join StudyHours Team",
    description: "Join StudyHours and help shape the future of K-12 education.",
    url: "https://studyhours.com/careers",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours Careers",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers | Join StudyHours Team",
    description: "Join StudyHours and help shape the future of K-12 education.",
    images: ["/hero_calm_education.png"],
  },
};

export default function Page() {
  return <CareersPageClient />;
}
