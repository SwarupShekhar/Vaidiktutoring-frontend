import { Metadata } from "next";
import VCEPageClient from "./VCEPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "VCE Tutoring Online | Expert Tutors & Better Results",
  description:
    "Get expert VCE tutoring online with personalised lessons, exam strategies, and qualified tutors to improve grades, confidence, and results fast.",
  alternates: {
    canonical: "https://studyhours.com/australia/vce-online-tutoring",
  },
  openGraph: {
    title: "VCE Tutoring Online | Expert Tutors & Better Results",
    description: "Get expert VCE tutoring online with personalised lessons, exam strategies, and qualified tutors to improve grades, confidence, and results fast.",
    url: "https://studyhours.com/australia/vce-online-tutoring",
    siteName: "StudyHours",
    images: [{ url: "/australia_tutor_hero.png", width: 1200, height: 630, alt: "VCE Online Tutoring Victoria" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VCE Tutoring Online | Expert Tutors & Better Results",
    description: "Get expert VCE tutoring online with personalised lessons, exam strategies, and qualified tutors to improve grades, confidence, and results fast.",
    images: ["/australia_tutor_hero.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      name: "StudyHours VCE Tutoring",
      description: "Expert online VCE tutoring for students in Melbourne and Victoria. VCAA-aligned 1-on-1 sessions covering all VCE subjects.",
      url: "https://studyhours.com/australia/vce-online-tutoring",
      areaServed: ["Victoria", "Melbourne", "Geelong", "Ballarat", "Bendigo"],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 4.9,
        reviewCount: 412,
        bestRating: 5,
      },
    },
    {
      "@type": "Course",
      name: "VCE Online Tutoring",
      description: "1-on-1 VCE tutoring for Year 11 and Year 12 students in Victoria. Covers all VCAA study designs with SAC preparation and exam strategy.",
      provider: { "@type": "Organization", name: "StudyHours" },
      hasCourseInstance: [
        { "@type": "CourseInstance", name: "VCE Maths Methods", courseMode: "Online" },
        { "@type": "CourseInstance", name: "VCE Specialist Mathematics", courseMode: "Online" },
        { "@type": "CourseInstance", name: "VCE English", courseMode: "Online" },
        { "@type": "CourseInstance", name: "VCE Sciences", courseMode: "Online" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is the difference between VCE and ATAR?", acceptedAnswer: { "@type": "Answer", text: "VCE is the Victorian Certificate of Education. The ATAR is calculated from your best 4 scaled study scores plus 10% of the 5th and 6th. Your VCE results directly determine your ATAR." } },
        { "@type": "Question", name: "How do SACs affect my final study score?", acceptedAnswer: { "@type": "Answer", text: "SACs contribute around 33-50% of your final study score depending on the subject. Strong SAC marks give you a buffer going into the external exams." } },
        { "@type": "Question", name: "How does VCE scaling work?", acceptedAnswer: { "@type": "Answer", text: "VCAA scales study scores to account for subject difficulty. Specialist Maths, Physics, and Chemistry scale significantly. A raw 40 in Specialist can become a 46+ scaled score." } },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://studyhours.com" },
        { "@type": "ListItem", position: 2, name: "Australia", item: "https://studyhours.com/australia" },
        { "@type": "ListItem", position: 3, name: "VCE Online Tutoring", item: "https://studyhours.com/australia/vce-online-tutoring" },
      ],
    },
  ],
};

export default function VCEPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <VCEPageClient />
    </>
  );
}
