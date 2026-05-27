import { Metadata } from "next";
import QCEPageClient from "./QCEPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "QCE Online Tutoring for Higher Exam Results - Study Hours",
  description:
    "At Study hours, join our best QCE online tutoring with skilled tutors. Enhance weak areas, boost marks & study confidently for upcoming exams.",
  alternates: {
    canonical: "https://studyhours.com/australia/qce-online-tutoring",
  },
  openGraph: {
    title: "QCE Online Tutoring for Higher Exam Results - Study Hours",
    description: "At Study hours, join our best QCE online tutoring with skilled tutors. Enhance weak areas, boost marks & study confidently for upcoming exams.",
    url: "https://studyhours.com/australia/qce-online-tutoring",
    siteName: "StudyHours",
    images: [{ url: "/australia_tutor_hero.jpg", width: 1200, height: 630, alt: "QCE Online Tutoring Queensland" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QCE Online Tutoring for Higher Exam Results - Study Hours",
    description: "At Study hours, join our best QCE online tutoring with skilled tutors. Enhance weak areas, boost marks & study confidently for upcoming exams.",
    images: ["/australia_tutor_hero.jpg"],
  },
  authors: [{ name: "StudyHours Academic Team" }],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      name: "StudyHours QCE Tutoring",
      description: "Expert online QCE tutoring for students across Brisbane and Queensland. QCAA-aligned 1-on-1 sessions covering all QCE subjects.",
      url: "https://studyhours.com/australia/qce-online-tutoring",
      areaServed: ["Queensland", "Brisbane", "Gold Coast", "Sunshine Coast", "Townsville", "Cairns"],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 4.9,
        reviewCount: 301,
        bestRating: 5,
      },
    },
    {
      "@type": "Course",
      name: "QCE Online Tutoring",
      description: "1-on-1 QCE tutoring for Year 11 and Year 12 students in Queensland. QCAA-aligned coaching for IA1, IA2, IA3, and External Assessment.",
      provider: { "@type": "Organization", name: "StudyHours" },
      hasCourseInstance: [
        { "@type": "CourseInstance", name: "QCE Mathematical Methods", courseMode: "Online" },
        { "@type": "CourseInstance", name: "QCE Specialist Mathematics", courseMode: "Online" },
        { "@type": "CourseInstance", name: "QCE Physics", courseMode: "Online" },
        { "@type": "CourseInstance", name: "QCE English", courseMode: "Online" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "How do internal assessments work in QCE?", acceptedAnswer: { "@type": "Answer", text: "QCE subjects have 3 internal assessments (IA1, IA2, IA3) and 1 external assessment, each worth 25%. IAs are set and marked by your school against QCAA criteria." } },
        { "@type": "Question", name: "What is the QCAA?", acceptedAnswer: { "@type": "Answer", text: "The Queensland Curriculum and Assessment Authority (QCAA) governs the Queensland Certificate of Education and sets all senior syllabus content and assessment standards." } },
        { "@type": "Question", name: "Is QCE English compulsory for ATAR?", acceptedAnswer: { "@type": "Answer", text: "Yes. To receive an ATAR in Queensland, you must complete English or English as an Additional Language." } },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://studyhours.com" },
        { "@type": "ListItem", position: 2, name: "Australia", item: "https://studyhours.com/australia" },
        { "@type": "ListItem", position: 3, name: "QCE Online Tutoring", item: "https://studyhours.com/australia/qce-online-tutoring" },
      ],
    },
  ],
};

export default function QCEPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <QCEPageClient />
    </>
  );
}
