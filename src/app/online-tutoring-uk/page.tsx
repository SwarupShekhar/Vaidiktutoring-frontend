import { Metadata } from "next";
import OnlineTutoringUKClient from "./OnlineTutoringUKClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Online Tutoring UK | Expert Private Tutors for GCSE, A-Level & IB | StudyHours",
  description:
    "Find expert online tutors across the UK for GCSE, A-Level, IB, and IGCSE. Personalised 1-on-1 sessions. AQA, Edexcel, OCR specialists. Book a free assessment today.",
  alternates: {
    canonical: "https://studyhours.com/online-tutoring-uk",
    languages: {
      "en-GB": "https://studyhours.com/online-tutoring-uk",
      en: "https://studyhours.com/online-tutoring-uk",
    },
  },
  openGraph: {
    title: "Online Tutoring UK | Expert Private Tutors | StudyHours",
    description:
      "Expert online tutors across the UK for GCSE, A-Level, IB, and IGCSE. Personalised 1-on-1 sessions with AQA, Edexcel, OCR specialists.",
    url: "https://studyhours.com/online-tutoring-uk",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours Online Tutoring UK",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Tutoring UK | Expert Private Tutors | StudyHours",
    description:
      "Expert online tutors across the UK for GCSE, A-Level, IB, and IGCSE.",
    images: ["/hero_calm_education.png"],
  },
};

export default function Page() {
  const ukFaqs = [
    {
      q: "What is online tutoring?",
      a: "Online tutoring delivers live, personalised lessons via video call. At StudyHours, each session is 1-on-1 with a subject specialist who tailors lessons to your child's exact curriculum and exam board.",
    },
    {
      q: "How does online tutoring work in the UK?",
      a: "Students book sessions online, connect via video call with a matched tutor, and receive personalised lessons aligned to their school's curriculum — AQA, Edexcel, OCR, or Cambridge International. Progress reports are shared with parents after each session.",
    },
    {
      q: "Is online tutoring as effective as in-person tutoring?",
      a: "Research consistently shows that 1-on-1 online tutoring matches or exceeds in-person tutoring outcomes. At StudyHours, 89% of students showed measurable grade improvement, with the added convenience of no travel and flexible scheduling.",
    },
    {
      q: "How much does online tutoring cost in the UK?",
      a: "Tutoring costs vary by subject and level. GCSE and A-Level tutoring typically ranges from £25–£80 per hour depending on the tutor's qualification and subject. StudyHours offers transparent pricing — see our pricing page for details.",
    },
    {
      q: "Which subjects do you tutor online in the UK?",
      a: "We tutor all major UK subjects at GCSE, A-Level, IGCSE, and IB level — including Maths, English, Biology, Chemistry, Physics, History, Geography, Economics, Psychology, and all languages. Our tutors specialise in specific exam boards.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ukFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const educationalOrgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "StudyHours — Online Tutoring UK",
    url: "https://studyhours.com/online-tutoring-uk",
    image: "https://studyhours.com/hero_calm_education.png",
    areaServed: { "@type": "Country", name: "United Kingdom" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: 2000,
      bestRating: 5,
      worstRating: 1,
    },
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
        name: "Online Tutoring UK",
        item: "https://studyhours.com/online-tutoring-uk",
      },
    ],
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Online Tutoring UK",
    url: "https://studyhours.com/online-tutoring-uk",
    provider: {
      "@type": "Organization",
      name: "StudyHours",
      url: "https://studyhours.com",
    },
    description:
      "Expert 1-on-1 online tutoring for UK students at GCSE, A-Level, IB, and IGCSE level. AQA, Edexcel, OCR, and Cambridge International specialists.",
    educationalLevel: "GCSE, A-Level, IB, IGCSE",
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

  const jsonLd = [
    faqSchema,
    educationalOrgSchema,
    breadcrumbSchema,
    courseSchema,
  ];

  const ukTestimonials = [
    {
      text: "My daughter's GCSE Maths went from a 4 to a 7 after just 8 sessions. The AQA-specific practice made all the difference.",
      author: "Sarah T.",
      role: "Parent of Year 11 Student, London",
      rating: 5,
    },
    {
      text: "Brilliant A-Level Chemistry support. Our son got his first-choice university offer after intensive Edexcel revision sessions.",
      author: "James M.",
      role: "Parent of Year 13 Student, Manchester",
      rating: 5,
    },
    {
      text: "The IB tutoring was exceptional — IA guidance, TOK support, and exam technique all covered. Worth every penny.",
      author: "Priya K.",
      role: "Parent of IB Student, Birmingham",
      rating: 5,
    },
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}
      <OnlineTutoringUKClient faqs={ukFaqs} testimonials={ukTestimonials} />
    </>
  );
}
