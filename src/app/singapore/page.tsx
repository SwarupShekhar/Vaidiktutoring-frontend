import { Metadata } from "next";
import SingaporePageClient from "./SingaporePageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Online Tutoring Singapore | PSLE, O-Level, A-Level | Study Hours",
  description:
    "Expert online tutoring for Singapore students. Specialising in MOE syllabus, PSLE, O-Level, A-Level, and IP/IB programs. Top MOE-aligned tutors.",
  alternates: {
    canonical: "https://studyhours.com/singapore",
  },
  openGraph: {
    title: "Online Tutoring Singapore | PSLE, O-Level, A-Level | Study Hours",
    description: "Expert online tutoring for Singapore students. Specialising in MOE syllabus, PSLE, O-Level, and A-Level.",
    url: "https://studyhours.com/singapore",
    images: [{ url: "/hero_calm_education.png", width: 1200, height: 630, alt: "StudyHours Online Tutoring Singapore" }],
    type: "website",
  },
};

const faqs = [
  {
    q: "Are your tutors aligned with the latest MOE syllabus?",
    a: "Yes. Our Singapore tutors strictly follow the current MOE syllabus, including the new AL scoring system for PSLE, the revised O-Level Science practicals, and the latest A-Level updates.",
  },
  {
    q: "Do you offer IP (Integrated Programme) tutoring?",
    a: "Absolutely. We have tutors specifically experienced with the IP curriculum, knowing the exact rigour and school-based assessment styles required for IP students from Year 1 to Year 6.",
  },
  {
    q: "Can online tutoring be as effective as a tuition centre in Singapore?",
    a: "Online 1-on-1 tutoring is often more effective because every minute is focused exclusively on your child's specific weaknesses. There's no travel time, flexible scheduling, and students can review recorded lessons before exams.",
  },
  {
    q: "How does the matching process work?",
    a: "We start with a diagnostic session to assess the student's current standing. We then pair them with a specialist tutor (e.g., an O-Level Chemistry expert or a PSLE Math heuristics specialist) who fits their learning style.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      name: "StudyHours Singapore Tutoring",
      description: "Online tutoring across Singapore covering PSLE, O-Levels, A-Levels, and IB.",
      url: "https://studyhours.com/singapore",
      areaServed: { "@type": "Country", name: "Singapore" },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(faq => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a }
      }))
    }
  ]
};

export default function SingaporePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SingaporePageClient faqs={faqs} />
    </>
  );
}
