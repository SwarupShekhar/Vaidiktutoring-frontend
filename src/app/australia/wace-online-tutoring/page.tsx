import { Metadata } from "next";
import WACEPageClient from "./WACEPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "WACE Online Tutor | One-to-One Learning Support",
  description:
    "Connect with a skilled WACE online tutor for personalised guidance, flexible classes, and targeted support to improve confidence & grades.",
  alternates: {
    canonical: "https://studyhours.com/australia/wace-online-tutoring",
  },
  openGraph: {
    title: "WACE Online Tutor | One-to-One Learning Support",
    description: "Connect with a skilled WACE online tutor for personalised guidance, flexible classes, and targeted support to improve confidence & grades.",
    url: "https://studyhours.com/australia/wace-online-tutoring",
    siteName: "StudyHours",
    images: [{ url: "/australia_tutor_hero.png", width: 1200, height: 630, alt: "WACE Online Tutoring Western Australia" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WACE Online Tutor | One-to-One Learning Support",
    description: "Connect with a skilled WACE online tutor for personalised guidance, flexible classes, and targeted support to improve confidence & grades.",
    images: ["/australia_tutor_hero.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      name: "StudyHours WACE Tutoring",
      description: "Expert online WACE tutoring for students across Perth and Western Australia. SCSA-aligned 1-on-1 sessions for all WACE ATAR courses.",
      url: "https://studyhours.com/australia/wace-online-tutoring",
      areaServed: ["Western Australia", "Perth", "Fremantle", "Mandurah", "Bunbury", "Albany"],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 4.9,
        reviewCount: 267,
        bestRating: 5,
      },
    },
    {
      "@type": "Course",
      name: "WACE Online Tutoring",
      description: "1-on-1 WACE ATAR course tutoring for Year 11 and Year 12 students in Western Australia. SCSA-aligned coaching with school assessment and external exam preparation.",
      provider: { "@type": "Organization", name: "StudyHours" },
      hasCourseInstance: [
        { "@type": "CourseInstance", name: "WACE Mathematics Specialist", courseMode: "Online" },
        { "@type": "CourseInstance", name: "WACE Mathematics Methods", courseMode: "Online" },
        { "@type": "CourseInstance", name: "WACE Physics", courseMode: "Online" },
        { "@type": "CourseInstance", name: "WACE English ATAR", courseMode: "Online" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is the SCSA?", acceptedAnswer: { "@type": "Answer", text: "The School Curriculum and Standards Authority (SCSA) is responsible for schooling and curriculum in Western Australia. SCSA governs all WACE ATAR courses and external exams." } },
        { "@type": "Question", name: "How is the WACE ATAR calculated?", acceptedAnswer: { "@type": "Answer", text: "Your WACE ATAR is calculated from your best 4 scaled ATAR course marks plus the mandatory English requirement. Marks are scaled by SCSA to account for subject difficulty." } },
        { "@type": "Question", name: "Is Maths Specialist the best scaling subject in WACE?", acceptedAnswer: { "@type": "Answer", text: "Yes. Mathematics Specialist consistently achieves the highest scaling in WACE with average scaled marks in the 51+ range." } },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://studyhours.com" },
        { "@type": "ListItem", position: 2, name: "Australia", item: "https://studyhours.com/australia" },
        { "@type": "ListItem", position: 3, name: "WACE Online Tutoring", item: "https://studyhours.com/australia/wace-online-tutoring" },
      ],
    },
  ],
};

export default function WACEPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WACEPageClient />
    </>
  );
}
