import { Metadata } from "next";
import JCSingaporePageClient from "./JCSingaporePageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Complete JC & A-Level Guide Singapore 2026 | StudyHours",
  description:
    "The definitive Singapore JC guide: 70-point UAS calculator, H2 subject deep dives, subject combination decision tree, exam timeline, and honest tuition advice. Used by students across RI, HCI, VJC and more.",
  alternates: {
    canonical: "https://studyhours.com/singapore-jc-guide",
    languages: {
      "en-SG": "https://studyhours.com/singapore-jc-guide",
      en: "https://studyhours.com/singapore-jc-guide",
    },
  },
  keywords: [
    "JC tuition Singapore",
    "A-Level tuition Singapore",
    "H2 Math tuition Singapore",
    "H2 Chemistry tuition",
    "GP tuition Singapore",
    "JC subject combination guide",
    "A-Level rank points calculator",
    "UAS calculator Singapore",
    "JC1 promos tips",
    "new UAS scoring system Singapore 2026",
    "H2 Chemistry organic synthesis tips",
    "best subject combination NUS Medicine",
    "why am I failing JC after O-Levels",
    "JC vs Polytechnic Singapore",
  ],
  openGraph: {
    title: "Complete JC & A-Level Guide Singapore 2026 | StudyHours",
    description:
      "70-point UAS calculator, subject combination decision tree, exam timeline, and H2 subject deep dives. The resource Singapore JC students actually need.",
    url: "https://studyhours.com/singapore-jc-guide",
    images: [
      {
        url: "/og-singapore-jc-guide.png",
        width: 1200,
        height: 630,
        alt: "Complete JC & A-Level Guide Singapore 2026",
      },
    ],
    type: "website",
    locale: "en_SG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Complete JC & A-Level Guide Singapore 2026 | StudyHours",
    description:
      "70-point UAS calculator, subject combination decision tree, and H2 deep dives. The JC resource Singapore students bookmark.",
  },
  authors: [{ name: "StudyHours Singapore Team" }],
};

export default function Page() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the new A-Level UAS scoring system?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The University Admissions Score (UAS) is now out of 70 points. It is calculated from your best 3 H2 subjects (up to 20 points each, 60 total) plus H1 General Paper (up to 10 points). Your 4th subject or Mother Tongue Language is only added if it improves your score. Project Work is Pass/Fail only. The old 90-point Rank Point system has been replaced.",
        },
      },
      {
        "@type": "Question",
        name: "How many rank points do I need for NUS Medicine?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NUS Medicine is one of the most competitive courses in Singapore, typically requiring a UAS score of 68-70 out of 70. You will also need to clear BMAT and interviews. A near-perfect A-Level result is the baseline, not a guarantee.",
        },
      },
      {
        "@type": "Question",
        name: "When should I start JC tuition: JC1 or JC2?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "JC1 is strongly recommended. The O-Level to A-Level conceptual jump is significant, and students who wait until JC2 or after Promos lose critical time. Starting early allows you to build the right analytical habits before the exam structure becomes fixed in your mind.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between H1 and H2 subjects?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "H2 subjects are full-depth A-Level subjects worth up to 20 UAS points each. H1 subjects cover a reduced syllabus at a lower depth and are worth up to 10 UAS points. Most students take 3 H2 subjects plus H1 General Paper, H1 Mother Tongue, and H1 Project Work.",
        },
      },
      {
        "@type": "Question",
        name: "What if I failed my Promos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Failing Promos is more common than most students realise. It triggers a review by your school, where some students are retained in JC1 to resit, and others are counselled to alternative paths. If you are retained, use the year deliberately. Students who diagnose exactly what failed in Promos and address it systematically regularly come back to score As at A-Levels.",
        },
      },
      {
        "@type": "Question",
        name: "Is online JC tuition as effective as physical?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For JC subjects, online tutoring is equally effective when the tutor uses proper digital tools, including annotatable whiteboards, shared workings, and screen sharing for graph sketching. The key differentiator is tutor quality, not the medium. Online also gives access to tutors who only work digitally but are among the best in Singapore.",
        },
      },
    ],
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
        name: "Singapore JC Guide",
        item: "https://studyhours.com/singapore-jc-guide",
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The Complete JC & A-Level Guide Singapore 2026",
    description:
      "Comprehensive guide to Singapore Junior College: the 70-point UAS system, H2 subject deep dives, subject combination advice, exam timelines, and grade improvement strategies.",
    url: "https://studyhours.com/singapore-jc-guide",
    author: {
      "@type": "Organization",
      name: "StudyHours",
      url: "https://studyhours.com",
    },
    publisher: {
      "@type": "Organization",
      name: "StudyHours",
      url: "https://studyhours.com",
      logo: {
        "@type": "ImageObject",
        url: "https://studyhours.com/Studuhourslogo.svg",
      },
    },
    datePublished: "2026-01-01",
    dateModified: "2026-05-26",
    mainEntityOfPage: "https://studyhours.com/singapore-jc-guide",
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Singapore A-Level Tuition",
    url: "https://studyhours.com/singapore-jc-guide",
    provider: {
      "@type": "Organization",
      name: "StudyHours",
      url: "https://studyhours.com",
    },
    description:
      "Expert online tuition for Singapore H2 Math, H2 Chemistry, H2 Economics, General Paper, and H2 Physics. Aligned to SEAB 2026 syllabuses.",
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

  const jsonLd = [faqSchema, breadcrumbSchema, articleSchema, courseSchema];

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
      <JCSingaporePageClient />
    </>
  );
}
