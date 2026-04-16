import { Metadata } from "next";
import GCSEPageClient from "./GCSEPageClient";

export const metadata: Metadata = {
  title: "Expert GCSE Tutors Online | Personalized GCSE Online Tuition",
  description: "Boost GCSE grades with expert tutors. 87% of students improved 2+ grades. Personalized tuition for AQA, Edexcel, OCR exam boards. Build conceptual foundations and exam confidence.",
  alternates: {
    canonical: "https://studyhours.com/gcse-online-tutoring",
  },
  openGraph: {
    title: "Expert GCSE Tutors Online | Personalized GCSE Online Tuition",
    description: "Boost GCSE grades with expert tutors. 87% of students improved 2+ grades. Personalized tuition for AQA, Edexcel, OCR exam boards.",
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
    description: "Boost GCSE grades with expert tutors. 87% of students improved 2+ grades. Personalized tuition for AQA, Edexcel, OCR exam boards.",
    images: ["/hero_calm_education.png"],
  },
  authors: [{ name: "Dr. Sarah Mitchell" }],
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

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "GCSE Online Tutoring",
    "provider": { "@type": "Organization", "name": "StudyHours" },
    "description": "Comprehensive GCSE online tuition covering all subjects and exam boards including AQA, Edexcel, and OCR.",
    "educationalLevel": "GCSE",
    "hasCourseInstance": { "@type": "CourseInstance", "courseMode": "online" }
  };

  const jsonLd = [subjectSchema, faqSchema, breadcrumbSchema, ratingSchema, courseSchema];

  const gcseTestimonials = [
    {
      text: "The exam board-specific advice was invaluable. Our son went from predicted D to A in Chemistry thanks to the AQA-focused revision techniques.",
      author: "Emma L.",
      role: "Parent of GCSE Student",
      rating: 5
    },
    {
      text: "Structured revision plans aligned perfectly with school mocks. The grade improvement from foundation to higher tier was remarkable.",
      author: "David K.",
      role: "Parent of Year 11 Student",
      rating: 5
    },
    {
      text: "Finally, tutoring that understands the pressure of GCSEs. The mock exam practice and feedback loops made all the difference.",
      author: "Rachel M.",
      role: "Parent of GCSE Candidate",
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
      <GCSEPageClient testimonials={gcseTestimonials} />
    </>
  );
}
