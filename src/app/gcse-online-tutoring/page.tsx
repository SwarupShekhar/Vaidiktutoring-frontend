import { Metadata } from "next";
import GCSEPageClient from "./GCSEPageClient";

export const metadata: Metadata = {
  title: "Expert GCSE Tutors Online | Personalized GCSE Online Tuition",
  description:
    "Improve your results with expert GCSE tutors online. StudyHours offers premium 1-on-1 GCSE online tuition across all exam boards (AQA, Edexcel, OCR) to build conceptual foundations and confidence.",
  alternates: {
    canonical: "https://studyhours.com/gcse-online-tutoring",
  },
  openGraph: {
    title: "Expert GCSE Tutors Online | Personalized GCSE Online Tuition",
    description:
      "Get the best GCSE online tuition with expert tutors. Achieve top results through personalized 1-on-1 learning.",
    url: "https://studyhours.com/gcse-online-tutoring",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours GCSE Tutoring",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expert GCSE Tutors Online | Personalized GCSE Online Tuition",
    description:
      "Expert tutors for all GCSE subjects including Maths, Sciences, and Humanities.",
    images: ["/hero_calm_education.png"],
  },
};

export default function Page() {
  const gcseFaqs = [
    {
      q: "What is the most picked GCSE subject?",
      a: "The most popular GCSEs are English, Maths, and Science, which are compulsory for nearly all students. Popular optional subjects include History, Geography, and Art & Design. Popularity often reflects a subject's usefulness for A-Levels, university, or career goals.",
    },
    {
      q: "What is the least popular GCSE subject?",
      a: "According to JCQ data from November 2025, the least popular GCSE subjects include Welsh (Second Language), Latin, Astronomy, and various specialist technology courses. However, a small number of entries does not mean a subject is less valuable or respected.",
    },
    {
      q: "When should I start GCSE tutoring for my child?",
      a: "Start as soon as a problem is identified: whether that is a drop in confidence, falling grades, or gaps in understanding. Year 9 or early Year 10 is ideal for building strong foundations without pressure. Mid-Year 10 works well for consolidating key topics and practising exam-style questions. Year 11 is best for intensive revision, exam technique, and reducing last-minute anxiety.",
    },
    {
      q: "How do I choose a reliable GCSE tutor service?",
      a: "Prioritise subject-specific expertise and a proven track record with your child's exact exam board: AQA, Edexcel, or OCR. Look for a tutor who starts with a diagnostic assessment rather than a one-size-fits-all approach. Ensure their teaching style builds confidence and focuses on exam technique, not just content knowledge. Always book a trial session first to confirm they are the right fit for your child.",
    },
  ];

  const subjectSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Core Subjects" },
      { "@type": "ListItem", position: 2, name: "Sciences" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Humanities & Social Sciences",
      },
      { "@type": "ListItem", position: 4, name: "Creative & Technical" },
      { "@type": "ListItem", position: 5, name: "Languages" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: gcseFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
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
        name: "GCSE Tutoring",
        item: "https://studyhours.com/gcse-online-tutoring",
      },
    ],
  };

  const ratingSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "GCSE Tutors Online — Specialist UK GCSE Support",
    image: "https://studyhours.com/hero_calm_education.png",
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
      <GCSEPageClient />
    </>
  );
}
