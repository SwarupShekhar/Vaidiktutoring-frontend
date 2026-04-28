import { Metadata } from "next";
import IGCSEPageClient from "./IGCSEPageClient";

export const revalidate = 3600; // Revalidate every hour for ISR

export const metadata: Metadata = {
  title: "IGCSE Online Tutoring UK | Cambridge & Edexcel Specialists | StudyHours",
  description: "Expert IGCSE tutors online for UK and international students. Cambridge & Edexcel specialists. 89% grade improvement across all subjects. Book a free assessment.",
  alternates: {
    canonical: "https://studyhours.com/igcse-online-tutoring",
    languages: {
      "en-GB": "https://studyhours.com/igcse-online-tutoring",
      "en": "https://studyhours.com/igcse-online-tutoring",
    },
  },
  openGraph: {
    title: "IGCSE Online Tutoring UK | Cambridge & Edexcel Specialists | StudyHours",
    description: "Cambridge & Edexcel IGCSE tutoring for international students. 89% grade improvement. Personalized online courses covering all subjects.",
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
    title: "IGCSE Online Tutoring UK | Cambridge & Edexcel Specialists | StudyHours",
    description: "Cambridge & Edexcel IGCSE tutoring for international students. 89% grade improvement. Personalized online courses covering all subjects.",
    images: ["/hero_calm_education.png"],
  },
  authors: [{ name: "Prof. Raj Patel" }],
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
    {
      q: "Is IGCSE recognised in the UK?",
      a: "Yes. Cambridge IGCSE and Edexcel IGCSE are both recognised by UK universities, employers, and UCAS as equivalent to standard GCSEs. Many independent schools and international schools across the UK follow the IGCSE curriculum. All major UK universities accept IGCSE qualifications for entry requirements.",
    },
    {
      q: "Can UK students access IGCSE online tutoring?",
      a: "Absolutely. StudyHours offers online IGCSE tutoring to students across the UK and internationally. Our tutors specialise in both Cambridge International (CIE) and Edexcel IGCSE specifications, with board-specific past papers and mark scheme practice built into every session.",
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
    url: "https://studyhours.com/igcse-online-tutoring",
    image: "https://studyhours.com/hero_calm_education.png",
    areaServed: [
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "Australia" },
      { "@type": "Country", name: "Singapore" },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: 1200,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "IGCSE Online Tuition",
    url: "https://studyhours.com/igcse-online-tutoring",
    provider: { "@type": "Organization", name: "StudyHours", url: "https://studyhours.com" },
    description: "Comprehensive IGCSE online tuition for Cambridge and Edexcel curricula, designed for international students.",
    educationalLevel: "IGCSE",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      offers: {
        "@type": "Offer",
        category: "Paid",
        url: "https://studyhours.com/pricing",
      },
    },
  };

  const jsonLd = [subjectSchema, faqSchema, breadcrumbSchema, ratingSchema, courseSchema];

  const igcseTestimonials = [
    {
      text: "The Cambridge IGCSE syllabus felt overwhelming until we found StudyHours. The focus on CIE-specific mark schemes helped my son jump from a C to an A* in Maths.",
      author: "Lydia W.",
      role: "Parent of Cambridge IGCSE Student",
      rating: 5
    },
    {
      text: "Exceptional support for Edexcel IGCSE Biology. The interactive sessions and past paper analysis gave my daughter the confidence she needed for her terminal exams.",
      author: "Mark B.",
      role: "Parent of Year 11 Student",
      rating: 5
    },
    {
      text: "Highly recommend the Physics IGCSE tuition. The tutor explained complex concepts with such clarity that my child actually started enjoying the subject.",
      author: "Hassan A.",
      role: "Parent of IGCSE Student",
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
      <IGCSEPageClient testimonials={igcseTestimonials} />
    </>
  );
}
