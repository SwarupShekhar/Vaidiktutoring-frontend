import { Metadata } from "next";
import IGCSEPageClient from "./IGCSEPageClient";

export const metadata: Metadata = {
  title: "IGCSE Online Tuition & Tutoring Service | StudyHours",
  description:
    "Expert IGCSE online tuition and tutoring for all subjects. Personalized 1-on-1 IGCSE online courses designed to boost grades and exam confidence.",
  alternates: {
    canonical: "https://studyhours.com/igcse-online-tutoring",
  },
  openGraph: {
    title: "IGCSE Online Tuition & Tutoring Service | StudyHours",
    description:
      "Get the best IGCSE online tuition with expert tutors. Achieve top results through personalized 1-on-1 learning.",
    url: "https://studyhours.com/igcse-online-tutoring",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours IGCSE Tutoring",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IGCSE Online Tuition & Tutoring Service | StudyHours",
    description:
      "Expert tutors for all IGCSE subjects including Maths, Sciences, and Humanities.",
    images: ["/hero_calm_education.png"],
  },
};


export default function Page() {
  const igcseFaqs = [
    {
      q: "How to choose an IGCSE tuition provider for multiple subjects?",
      a: "Select a provider with certified subject experts who align lessons to Cambridge patterns and offer flexible online scheduling.",
    },
    {
      q: "What is the hardest IGCSE exam?",
      a: "Difficulty varies, but subjects like Additional Maths and Physics are often cited. Consistent practice makes even these manageable.",
    },
    {
      q: "What is the maximum age to take IGCSE?",
      a: "There is no official limit. While designed for ages 14 to 16, the qualification is open to learners of all ages.",
    },
    {
      q: "Are online IGCSE classes effective for exam preparation?",
      a: "Yes. They provide access to global experts and flexible schedules, using interactive tools that make exam prep highly effective.",
    },
  ];

  const subjectSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "IGCSE Subjects Covered",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "IGCSE Mathematics" },
      { "@type": "ListItem", position: 2, name: "IGCSE Additional Maths" },
      { "@type": "ListItem", position: 3, name: "IGCSE English Language" },
      { "@type": "ListItem", position: 4, name: "IGCSE English Literature" },
      { "@type": "ListItem", position: 5, name: "IGCSE Biology" },
      { "@type": "ListItem", position: 6, name: "IGCSE Chemistry" },
      { "@type": "ListItem", position: 7, name: "IGCSE Physics" },
      { "@type": "ListItem", position: 8, name: "IGCSE Combined Science" },
      { "@type": "ListItem", position: 9, name: "IGCSE Accounting" },
      { "@type": "ListItem", position: 10, name: "IGCSE Business Studies" },
      { "@type": "ListItem", position: 11, name: "IGCSE Economics" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: igcseFaqs.map((faq) => ({
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
        name: "IGCSE Online Tuition & Tutoring Service",
        item: "https://studyhours.com/igcse-online-tutoring",
      },
    ],
  };

  const ratingSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "IGCSE Online Tuition & Tutoring Service",
    image: "https://studyhours.com/hero_calm_education.png",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1200",
      bestRating: "5",
      worstRating: "1",
    },
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
      <IGCSEPageClient />
    </>
  );
}
