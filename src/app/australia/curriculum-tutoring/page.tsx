import { Metadata } from "next";
import CurriculumPageClient from "./CurriculumPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Australian Curriculum Online Tutoring For Success Path",
  description:
    "Start your success path with Australian Curriculum online tutoring. Gain confidence, improve marks, & enjoy smarter learning online.",
  alternates: {
    canonical: "https://studyhours.com/australia/curriculum-tutoring",
  },
  openGraph: {
    title: "Australian Curriculum Online Tutoring For Success Path",
    description: "Start your success path with Australian Curriculum online tutoring. Gain confidence, improve marks, & enjoy smarter learning online.",
    url: "https://studyhours.com/australia/curriculum-tutoring",
    siteName: "StudyHours",
    images: [{ url: "/australia_tutor_hero.png", width: 1200, height: 630, alt: "Australian Curriculum Tutoring ACARA Prep to Year 10" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Australian Curriculum Online Tutoring For Success Path",
    description: "Start your success path with Australian Curriculum online tutoring. Gain confidence, improve marks, & enjoy smarter learning online.",
    images: ["/australia_tutor_hero.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      name: "StudyHours Australian Curriculum Tutoring",
      description: "Expert online tutoring for the Australian Curriculum (ACARA) from Foundation to Year 10, covering all states and territories.",
      url: "https://studyhours.com/australia/curriculum-tutoring",
      areaServed: ["Australia", "Victoria", "New South Wales", "Queensland", "Western Australia", "South Australia"],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "344",
        bestRating: "5",
      },
    },
    {
      "@type": "Course",
      name: "Australian Curriculum Online Tutoring",
      description: "1-on-1 tutoring aligned to the Australian Curriculum (ACARA) for Foundation through Year 10. Covers English, Mathematics, Science, and Humanities.",
      provider: { "@type": "Organization", name: "StudyHours" },
      hasCourseInstance: [
        { "@type": "CourseInstance", name: "AC Mathematics Prep-Year 10", courseMode: "Online" },
        { "@type": "CourseInstance", name: "AC English Prep-Year 10", courseMode: "Online" },
        { "@type": "CourseInstance", name: "AC Science Year 3-10", courseMode: "Online" },
        { "@type": "CourseInstance", name: "NAPLAN Preparation Years 3,5,7,9", courseMode: "Online" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is ACARA?", acceptedAnswer: { "@type": "Answer", text: "ACARA (Australian Curriculum, Assessment and Reporting Authority) develops the national curriculum framework for Foundation to Year 10 across all 8 learning areas." } },
        { "@type": "Question", name: "Is the Australian Curriculum the same in every state?", acceptedAnswer: { "@type": "Answer", text: "The national curriculum sets the framework, but each state implements it with local adaptations. Victoria uses the Victorian Curriculum, NSW has its own Syllabus. Our tutors know both." } },
        { "@type": "Question", name: "What is NAPLAN?", acceptedAnswer: { "@type": "Answer", text: "NAPLAN tests students in Years 3, 5, 7, and 9 in Reading, Writing, Language Conventions, and Numeracy. Results affect school progression and selective school eligibility." } },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://studyhours.com" },
        { "@type": "ListItem", position: 2, name: "Australia", item: "https://studyhours.com/australia" },
        { "@type": "ListItem", position: 3, name: "Australian Curriculum Tutoring", item: "https://studyhours.com/australia/curriculum-tutoring" },
      ],
    },
  ],
};

export default function CurriculumPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CurriculumPageClient />
    </>
  );
}
