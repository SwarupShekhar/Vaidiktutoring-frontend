import { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Expert Tutors & AI Learning System | About Us",
  description:
    "A modern learning platform combining expert tutors and AI tools to deliver structured, personalized education for students worldwide.",
  alternates: {
    canonical: "https://studyhours.com/about",
  },
  openGraph: {
    title: "Expert Tutors & AI Learning System | About Us",
    description:
      "A modern learning platform combining expert tutors and AI tools to deliver structured, personalized education for students worldwide.",
    url: "https://studyhours.com/about",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours Learning Support",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expert Tutors & AI Learning System | About Us",
    description:
      "A modern learning platform combining expert tutors and AI tools to deliver structured, personalized education for students worldwide.",
    images: ["/hero_calm_education.png"],
  },
};

export default function Page() {
  const eduOrgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "StudyHours",
    image: "https://studyhours.com/hero_calm_education.png",
    description:
      "A modern learning platform combining expert tutors and AI tools.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "Global",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://studyhours.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: "https://studyhours.com/about",
      },
    ],
  };

  return (
    <>
      <Script
        id="edu-org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eduOrgSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutPageClient />
    </>
  );
}
