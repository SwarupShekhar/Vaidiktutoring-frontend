import { Metadata } from 'next';
import ACTPrepPageClient from './ACTPrepPageClient';

export const metadata: Metadata = {
  title: 'Elite ACT Prep Tutoring | Score 34+ | StudyHours',
  description: 'Specialized 1-on-1 ACT prep. Master the pace of the ACT with Ivy-league caliber tutors and proven time-management strategies for Math, Science, Reading, and English.',
  alternates: {
    canonical: 'https://studyhours.com/us/act-prep',
  },
};

// Keep in sync with the FAQ accordion in ACTPrepPageClient.tsx
const actFaqs = [
  {
    q: "Is it really possible to improve my ACT score significantly?",
    a: "Absolutely. While jumping from a 20 to a 36 is incredibly rare, a 4-5 point composite increase is highly achievable with structured practice. We focus on 'easy wins' first—like fixing punctuation rules in English—which instantly inflates your score.",
  },
  {
    q: "Should I take the SAT or the ACT?",
    a: "It comes down to pacing vs. complexity. The SAT gives you more time per question but the questions (especially reading) are more complex. The ACT questions are more straightforward, but the time limit is punishing. Our initial diagnostic will tell you which test naturally fits your brain.",
  },
  {
    q: "Do I need to take the ACT Writing (Essay) section?",
    a: "For the vast majority of students, no. Almost all top-tier universities no longer require or even review the ACT essay. Unless a specific program you are applying to requires it, skip it and focus your energy on the core four sections.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: actFaqs.map((faq) => ({
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
    { "@type": "ListItem", position: 1, name: "Home", item: "https://studyhours.com" },
    { "@type": "ListItem", position: 2, name: "US & AP", item: "https://studyhours.com/us/american-curriculum" },
    { "@type": "ListItem", position: 3, name: "ACT Prep", item: "https://studyhours.com/us/act-prep" },
  ],
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "ACT Prep Online Tutoring",
  url: "https://studyhours.com/us/act-prep",
  provider: { "@type": "Organization", name: "StudyHours", url: "https://studyhours.com" },
  description: "Specialized 1-on-1 ACT prep covering English, Math, Reading, and Science with pacing and endurance strategies for the 2025 Core ACT.",
  educationalLevel: "ACT",
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

const jsonLd = [faqSchema, breadcrumbSchema, courseSchema];

export default function ACTPrepPage() {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
      ))}
      <ACTPrepPageClient />
    </>
  );
}
