import { Metadata } from "next";
import K12PageClient from "./K12PageClient";

export const revalidate = 3600; // Revalidate every hour for ISR

export const metadata: Metadata = {
  title: "K–12 Online Tutoring | Expert Live Classes for All Subjects",
  description: "US curriculum aligned K-12 tutoring. Grades K-5, 6-8, 9-12 support. 91% of students showed academic improvement across all grade levels.",
  alternates: {
    canonical: "https://studyhours.com/k-12-online-tutoring",
  },
  openGraph: {
    title: "K–12 Online Tutoring | Expert Live Classes for All Subjects",
    description: "US curriculum aligned K-12 tutoring. Grades K-5, 6-8, 9-12 support. 91% of students showed academic improvement across all grade levels.",
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
    title: "K–12 Online Tutors | Expert Live Classes for All Subjects",
    description: "US curriculum aligned K-12 tutoring. Grades K-5, 6-8, 9-12 support. 91% of students showed academic improvement across all grade levels.",
    images: ["https://studyhours.com/hero_calm_education.png"],
  },
  authors: [{ name: "Mrs. Lisa Johnson" }],
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
      ratingValue: 4.9,
      reviewCount: 1500,
      bestRating: 5,
      worstRating: 1,
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

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "K-12 Online Tutoring",
    "provider": { "@type": "Organization", "name": "StudyHours" },
    "description": "Comprehensive K-12 online tutoring aligned with US curriculum standards across all grade levels.",
    "educationalLevel": "K-12",
    "hasCourseInstance": { "@type": "CourseInstance", "courseMode": "online" }
  };

  const jsonLd = [breadcrumbSchema, ratingSchema, faqSchema, courseSchema];

  const k12Testimonials = [
    {
      text: "The personalized attention my daughter received for her 5th-grade math has been transformative. She no longer fears the subject and actually looks forward to her sessions.",
      author: "Jennifer L.",
      role: "Parent of 5th Grader",
      rating: 5
    },
    {
      text: "Exceptional support for middle school writing. The tutor helped my son develop structured thinking and better essay writing skills just in time for his high school transition.",
      author: "Susan K.",
      role: "Parent of 8th Grader",
      rating: 5
    },
    {
      text: "Finding a K-12 program that actually adapts to my child's pace was such a relief. His science grades have improved significantly, but more importantly, so has his interest in the subject.",
      author: "David P.",
      role: "Parent of 10th Grader",
      rating: 5
    }
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
      ))}
      <K12PageClient testimonials={k12Testimonials} />
    </>
  );
}
