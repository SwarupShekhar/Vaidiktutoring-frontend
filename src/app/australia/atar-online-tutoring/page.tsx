import { Metadata } from "next";
import ATARPageClient from "./ATARPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "ATAR Tutors Online: 99+ ATAR Australia | StudyHours",
  description:
    "Elite ATAR tutoring across Australia. Top 1% graduate mentors for VCE, HSC, QCE, WACE, and SACE. Scaling strategy and 99+ ATAR coaching.",
  alternates: {
    canonical: "https://studyhours.com/australia/atar-online-tutoring",
  },
  openGraph: {
    title: "ATAR Tutors Online: 99+ Mentorship | StudyHours",
    description: "Elite 1-on-1 ATAR coaching for Australian students. Top 1% tutors covering scaling strategy, subject selection, and exam mastery.",
    url: "https://studyhours.com/australia/atar-online-tutoring",
    siteName: "StudyHours",
    images: [{ url: "/australia_tutor_hero.png", width: 1200, height: 630, alt: "ATAR Online Tutoring Australia" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATAR Tutors Online: 99+ Mentorship | StudyHours",
    description: "National ATAR tutoring across VCE, HSC, QCE, WACE. Top 1% graduate mentors. Scaling strategy and exam mastery.",
    images: ["/australia_tutor_hero.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      name: "StudyHours ATAR Tutoring",
      description: "National ATAR tutoring and mentorship for Australian Year 11 and Year 12 students across all state curricula.",
      url: "https://studyhours.com/australia/atar-online-tutoring",
      areaServed: ["Australia", "Victoria", "New South Wales", "Queensland", "Western Australia", "South Australia"],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "528",
        bestRating: "5",
      },
    },
    {
      "@type": "Course",
      name: "ATAR Online Tutoring",
      description: "Elite 1-on-1 ATAR coaching across VCE, HSC, QCE, WACE, and SACE. Focus on scaling strategy, exam mastery, and university pathway planning.",
      provider: { "@type": "Organization", name: "StudyHours" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is an ATAR?", acceptedAnswer: { "@type": "Answer", text: "The Australian Tertiary Admission Rank (ATAR) is a percentile rank from 0 to 99.95 showing where you sit relative to all Year 12 students nationally." } },
        { "@type": "Question", name: "What ATAR do I need for medicine?", acceptedAnswer: { "@type": "Answer", text: "Medicine at Melbourne, UNSW, Monash, and UQ requires ATARs of 99.00-99.95 plus strong UCAT scores." } },
        { "@type": "Question", name: "How does subject scaling affect ATAR?", acceptedAnswer: { "@type": "Answer", text: "Scaling adjusts raw marks from harder subjects upward. Specialist Maths, Extension Maths, Physics, and Chemistry all scale significantly in most states." } },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://studyhours.com" },
        { "@type": "ListItem", position: 2, name: "Australia", item: "https://studyhours.com/australia" },
        { "@type": "ListItem", position: 3, name: "ATAR Online Tutoring", item: "https://studyhours.com/australia/atar-online-tutoring" },
      ],
    },
  ],
};

export default function ATARPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ATARPageClient />
    </>
  );
}
