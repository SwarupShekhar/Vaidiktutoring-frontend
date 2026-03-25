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
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "StudyHours",
    url: "https://studyhours.com",
    logo: "https://studyhours.com/hero_calm_education.png",
    description:
      "Expert-guided K-12 tutoring for Math, Science, English and more. Personalized 1-on-1 sessions aligned with IB, IGCSE, and US curricula.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "Global",
    },
    sameAs: [
      // Add social media links if available
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "StudyHours",
    url: "https://studyhours.com",
    description:
      "Expert-guided K-12 tutoring for Math, Science, English and more. Personalized 1-on-1 sessions aligned with IB, IGCSE, and US curricula.",
    publisher: {
      "@type": "Organization",
      name: "StudyHours",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <NarrativeHome />
    </>
  );
}
