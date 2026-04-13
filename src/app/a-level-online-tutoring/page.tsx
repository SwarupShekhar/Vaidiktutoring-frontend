import { Metadata } from "next";
import ALevelPageClient from "./ALevelPageClient";

export const metadata: Metadata = {
  title: "Expert A-Level Tutors Online | Private A-Level Tuition & Exam Prep",
  description: "Boost your grades with expert A-Level tutors online. StudyHours provides premium 1-on-1 private A-Level tuition and exam preparation across all subjects and exam boards.",
  alternates: {
    canonical: "https://studyhours.com/a-level-online-tutoring",
  },
  openGraph: {
    title: "Expert A-Level Tutors Online | Private A-Level Tuition & Exam Prep",
    description: "Boost your grades with expert A-Level tutors online. StudyHours provides premium 1-on-1 private A-Level tuition and exam preparation across all subjects and exam boards.",
    url: "https://studyhours.com/a-level-online-tutoring",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours A-Level Tutoring",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expert A-Level Tutors Online | Private A-Level Tuition & Exam Prep",
    description: "Boost your grades with expert A-Level tutors online. StudyHours provides premium 1-on-1 private A-Level tuition and exam preparation across all subjects and exam boards.",
    images: ["/hero_calm_education.png"],
  },
};


export default function Page() {
  const faqs = [
    {
      q: "When should I start A-Level tutoring?",
      a: "Ideally from the beginning of Year 12 to build strong foundations early. However tutoring at any stage is valuable - whether catching up on AS content, preparing for mocks, or doing final exam revision in Year 13.",
    },
    {
      q: "How is A-Level tutoring different from GCSE?",
      a: "A-Level requires much deeper subject knowledge, independent thinking, and exam technique. Our tutors are subject specialists, not generalists - they know the exact demands of your syllabus and university application context.",
    },
    {
      q: "Can tutoring help with university personal statements?",
      a: "Yes. Our tutors can help you connect your subject knowledge to your personal statement, identify strong examples from your studies, and refine your academic writing — all of which strengthen your university application.",
    },
    {
      q: "Which exam boards do your A-Level tutors cover?",
      a: "We cover all major UK exam boards including AQA, Edexcel, OCR, and Cambridge International. Your tutor will be matched specifically to your board and syllabus.",
    },
  ];

  const subjectSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Core Subjects" },
      { "@type": "ListItem", "position": 2, "name": "Humanities & Social Sciences" },
      { "@type": "ListItem", "position": 3, "name": "Practical Subjects" },
      { "@type": "ListItem", "position": 4, "name": "Languages" }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
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
        name: "Subjects",
        item: "https://studyhours.com/subjects",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "A-Level Tutoring",
        item: "https://studyhours.com/a-level-online-tutoring",
      },
    ],
  };

  const ratingSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Expert A-Level Tutors Online — Private A-Level Tuition",
    "image": "https://studyhours.com/hero_calm_education.png",
  };

  const jsonLd = [subjectSchema, faqSchema, breadcrumbSchema, ratingSchema];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
      ))}
      <ALevelPageClient />
    </>
  );
}
