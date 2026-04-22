import { Metadata } from "next";
import HSCPageClient from "./HSCPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "HSC Tutoring Online | Band 6 Experts Sydney & NSW | Study Hours",
  description:
    "Expert 1-on-1 HSC tutoring for NSW students. Band 6 graduates from selective schools coach you through SBAs and NESA external exams in all subjects.",
  alternates: {
    canonical: "https://studyhours.com/australia/hsc-online-tutoring",
  },
  openGraph: {
    title: "HSC Tutors Online: Band 6 Experts | StudyHours",
    description: "1-on-1 HSC tutoring for NSW students. Band 6 graduates from selective schools coach you through SBAs and NESA external exams.",
    url: "https://studyhours.com/australia/hsc-online-tutoring",
    siteName: "StudyHours",
    images: [{ url: "/australia_tutor_hero.png", width: 1200, height: 630, alt: "HSC Online Tutoring NSW" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HSC Tutors Online: Band 6 Experts | StudyHours",
    description: "Expert HSC tutors for Sydney and NSW. NESA-aligned 1-on-1 coaching for Band 6 results.",
    images: ["/australia_tutor_hero.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      name: "StudyHours HSC Tutoring",
      description: "Expert online HSC tutoring for students in Sydney and New South Wales. NESA-aligned 1-on-1 sessions covering all HSC subjects.",
      url: "https://studyhours.com/australia/hsc-online-tutoring",
      areaServed: ["New South Wales", "Sydney", "Newcastle", "Wollongong", "Central Coast"],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "389",
        bestRating: "5",
      },
    },
    {
      "@type": "Course",
      name: "HSC Online Tutoring",
      description: "1-on-1 HSC tutoring for Year 11 and Year 12 students in NSW. Covers all NESA syllabuses with SBA preparation and Band 6 strategy.",
      provider: { "@type": "Organization", name: "StudyHours" },
      hasCourseInstance: [
        { "@type": "CourseInstance", name: "HSC Maths Extension 1", courseMode: "Online" },
        { "@type": "CourseInstance", name: "HSC Maths Extension 2", courseMode: "Online" },
        { "@type": "CourseInstance", name: "HSC English Advanced", courseMode: "Online" },
        { "@type": "CourseInstance", name: "HSC Physics", courseMode: "Online" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is a Band 6 in HSC?", acceptedAnswer: { "@type": "Answer", text: "A Band 6 is awarded for scores of 90-100 in a subject. It is the highest performance band and required for top ATARs and competitive university entry." } },
        { "@type": "Question", name: "How do school assessments affect my HSC mark?", acceptedAnswer: { "@type": "Answer", text: "School-Based Assessments (SBA) count for 50% of your final HSC mark. They are moderated against your external exam performance by NESA." } },
        { "@type": "Question", name: "What subjects have the highest scaling in NSW?", acceptedAnswer: { "@type": "Answer", text: "Maths Extension 2, Extension 1, Physics, Chemistry, and Economics consistently achieve the highest scaling in the HSC." } },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://studyhours.com" },
        { "@type": "ListItem", position: 2, name: "Australia", item: "https://studyhours.com/australia" },
        { "@type": "ListItem", position: 3, name: "HSC Online Tutoring", item: "https://studyhours.com/australia/hsc-online-tutoring" },
      ],
    },
  ],
};

export default function HSCPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HSCPageClient />
    </>
  );
}
