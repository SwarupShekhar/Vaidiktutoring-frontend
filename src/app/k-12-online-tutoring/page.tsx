import { Metadata } from "next";
import K12PageClient from "./K12PageClient";

export const metadata: Metadata = {
  title: "K-12 Online Tutoring | Expert Live Classes for All Subjects",
  description:
    "At Studyhours, join K-12 online tutoring with live classes in math, English, science & more. Get personalized support and improve academic performance.",
  alternates: {
    canonical: "https://studyhours.com/k-12-online-tutoring",
  },
  openGraph: {
    title: "K-12 Online Tutoring | Expert Live Classes for All Subjects",
    description:
      "At Studyhours, join K-12 online tutoring with live classes in math, English, science & more. Get personalized support and improve academic performance.",
    url: "https://studyhours.com/k-12-online-tutoring",
    images: [
      {
        url: "https://studyhours.com/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours K-12 Online Tutoring",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "K-12 Online Tutoring | Expert Live Classes for All Subjects",
    description:
      "At Studyhours, join K-12 online tutoring with live classes in math, English, science & more. Get personalized support and improve academic performance.",
  },
};

export default function Page() {
  const k12Faqs = [
    {
      q: "What is the purpose of the K-12 program?",
      a: "To provide a strong academic foundation, helping students improve through their school years. It focuses on conceptual clarity and preparing students for higher education and careers.",
    },
    {
      q: "Is K-12 a good homeschool program?",
      a: "Yes, it offers a well-organized curriculum and guided study journey. It works well for families who prefer a directed learning path with structured lesson plans.",
    },
    {
      q: "What is the difference between K-12 and higher education?",
      a: "K-12 builds a foundational footing across different subjects from early schooling to high school. Higher education focuses on specialized learning in a specific field for career growth.",
    },
    {
      q: "What are common challenges in K-12?",
      a: "Maintaining engagement, grasping difficult topics, and adjusting to individual progress rates. Students also face exam pressure and the need to form disciplined study patterns.",
    },
    {
      q: "How does K-12 tutoring work?",
      a: "It provides additional support outside of regular school hours. Tutors help students clear doubts and boost results through customized sessions that match their own learning rhythm.",
    },
  ];

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
        name: "K-12 Tutoring",
        item: "https://studyhours.com/k-12-online-tutoring",
      },
    ],
  };

  const ratingSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "K-12 Online Tutoring",
    image: "https://studyhours.com/hero_calm_education.png",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1500",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: k12Faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const jsonLd = [breadcrumbSchema, ratingSchema, faqSchema];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
      ))}
      <K12PageClient />
    </>
  );
}
