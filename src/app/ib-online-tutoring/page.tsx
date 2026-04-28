import { Metadata } from "next";
import IBPageClient from "./IBPageClient";

export const revalidate = 3600; // Revalidate every hour for ISR

export const metadata: Metadata = {
  title: "IB Tutors Online UK & Global | IB Diploma Tutoring | StudyHours",
  description: "Expert IB tutors online for UK and international students. 94% achieved target grades. Specialist IA, EE and TOK support across all six subject groups.",
  alternates: {
    canonical: "https://studyhours.com/ib-online-tutoring",
    languages: {
      "en-GB": "https://studyhours.com/ib-online-tutoring",
      "en": "https://studyhours.com/ib-online-tutoring",
    },
  },
  openGraph: {
    title: "IB Tutors Online UK & Global | IB Diploma Tutoring | StudyHours",
    description: "Master IB with expert tutoring. 94% achieved target predicted grades. IA, EE, TOK support with specialized IB curriculum guidance.",
    url: "https://studyhours.com/ib-online-tutoring",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours IB Tutoring",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IB Tutors Online UK & Global | IB Diploma Tutoring | StudyHours",
    description: "Master IB with expert tutoring. 94% achieved target predicted grades. IA, EE, TOK support with specialized IB curriculum guidance.",
    images: ["https://studyhours.com/hero_calm_education.png"],
  },
  authors: [{ name: "Dr. Michael Thompson" }],
};

export default function Page() {
  const ibFaqs = [
    {
      q: "What makes IB tutoring different at StudyHours?",
      a: "We focus on the specific rigors of the IB programme, including IA support, TOK guidance, and Extended Essay mentoring, alongside standard subject tutoring.",
    },
    {
      q: "Do you support all IB Diploma subjects?",
      a: "Yes, we have certified tutors for all six subject groups plus core requirements like Theory of Knowledge and IA writing support.",
    },
    {
      q: "How do you help with Internal Assessments (IA)?",
      a: "Our tutors provide guidance on topic selection, research structure, and critical analysis while ensuring academic integrity and adherence to IB criteria.",
    },
    {
      q: "Can I choose between SL and HL tutoring?",
      a: "Absolutely. Our tutors are specialised in both Standard Level (SL) and Higher Level (HL) requirements for all subjects.",
    },
    {
      q: "Do you support IB students at UK schools?",
      a: "Yes. StudyHours tutors work with IB Diploma students at schools across the UK — including international schools in London, Manchester, Edinburgh, and beyond. Our tutors understand the UK IB school environment, UCAS personal statement requirements for IB students, and predicted grade pressures unique to UK university applications.",
    },
  ];

  const subjectSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Language & Literature (Group 1)",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Language Acquisition (Group 2)",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Individuals & Societies (Group 3)",
      },
      { "@type": "ListItem", position: 4, name: "Sciences (Group 4)" },
      { "@type": "ListItem", position: 5, name: "Mathematics (Group 5)" },
      { "@type": "ListItem", position: 6, name: "The Arts (Group 6)" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ibFaqs.map((faq) => ({
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
        name: "IB Tutoring",
        item: "https://studyhours.com/ib-online-tutoring",
      },
    ],
  };

  const ratingSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "IB Online Tutoring — Premium IB Diploma Tuition",
    url: "https://studyhours.com/ib-online-tutoring",
    image: "https://studyhours.com/hero_calm_education.png",
    areaServed: [
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "Australia" },
      { "@type": "Country", name: "Singapore" },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: 800,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "IB Online Tutoring",
    url: "https://studyhours.com/ib-online-tutoring",
    provider: { "@type": "Organization", name: "StudyHours", url: "https://studyhours.com" },
    description: "Comprehensive IB tutoring covering all programmes with specialized support for IA, EE, TOK, and CAS components.",
    educationalLevel: "IB Diploma",
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

  const ibTestimonials = [
    {
      text: "The IA guidance was exceptional. My son received detailed feedback on his Internal Assessment that directly led to a 7 in Biology.",
      author: "Anita S.",
      role: "Parent of IB Diploma Student",
      rating: 5
    },
    {
      text: "TOK support made all the difference. The structured approach to Theory of Knowledge helped my daughter achieve a B, exceeding expectations.",
      author: "James P.",
      role: "Parent of IB Student",
      rating: 5
    },
    {
      text: "EE mentoring was invaluable. From topic selection to final submission, the guidance was professional and comprehensive.",
      author: "Lisa T.",
      role: "Parent of IB Diploma Candidate",
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
      <IBPageClient testimonials={ibTestimonials} />
    </>
  );
}
