import { Metadata } from "next";
import ALevelPageClient from "./ALevelPageClient";

export const revalidate = 3600; // Revalidate every hour for ISR

export const metadata: Metadata = {
  title: "A-Level Tutors Online UK | Private A-Level Tuition & Exam Prep",
  description: "Secure university offers with A-Level tutoring. 92% of students achieved target grades. EPQ support, predicted grade guidance, and subject-specific exam prep.",
  alternates: {
    canonical: "https://studyhours.com/a-level-online-tutoring",
    languages: {
      "en-GB": "https://studyhours.com/a-level-online-tutoring",
      "en": "https://studyhours.com/a-level-online-tutoring",
    },
  },
  openGraph: {
    title: "A-Level Tutors Online UK | Private A-Level Tuition & Exam Prep",
    description: "Secure university offers with A-Level tutoring. 92% of students achieved target grades. EPQ support, predicted grade guidance.",
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
    title: "A-Level Tutors Online UK | Private A-Level Tuition & Exam Prep",
    description: "Secure university offers with A-Level tutoring. 92% of students achieved target grades. EPQ support, predicted grade guidance.",
    images: ["/hero_calm_education.png"],
  },
  authors: [{ name: "Ms. Emily Chen" }],
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
    {
      q: "Do you offer A-Level tutoring across the UK?",
      a: "Yes. All our A-Level tutoring is delivered online, meaning students anywhere in the UK can access specialist support — from Year 12 through Year 13. We cover every major UK exam board: AQA, Edexcel, OCR, and Cambridge International (CAIE). Each student is matched to a tutor who specialises in their exact syllabus and university application context.",
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
    url: "https://studyhours.com/a-level-online-tutoring",
    image: "https://studyhours.com/hero_calm_education.png",
    areaServed: { "@type": "Country", name: "United Kingdom" },
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
    name: "A-Level Online Tutoring",
    url: "https://studyhours.com/a-level-online-tutoring",
    provider: { "@type": "Organization", name: "StudyHours", url: "https://studyhours.com" },
    description: "Advanced A-Level tutoring with university application support, EPQ guidance, and predicted grade preparation.",
    educationalLevel: "A-Level",
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

  const aLevelTestimonials = [
    {
      text: "The A-Level Maths support was instrumental in securing my A*. The tutor's deep knowledge of the Edexcel syllabus and focus on Year 13 challenging topics made a huge difference.",
      author: "James T.",
      role: "A-Level Student",
      rating: 5
    },
    {
      text: "Exceptional Biology tuition. The focus on exam technique and application of knowledge helped my daughter move from a predicted B to an A, securing her first-choice university offer.",
      author: "Sonia G.",
      role: "Parent of Year 13 Student",
      rating: 5
    },
    {
      text: "Our son's confidence in Economics skyrocketed after just a few sessions. The link between theory and current real-world examples made the subject much more accessible.",
      author: "Robert M.",
      role: "Parent of A-Level Candidate",
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
      <ALevelPageClient testimonials={aLevelTestimonials} />
    </>
  );
}
