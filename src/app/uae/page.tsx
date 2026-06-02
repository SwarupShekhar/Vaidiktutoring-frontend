import { Metadata } from "next";
import UAEPageClient from "./UAEPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Online Tutoring UAE | MOE, British & IB | Study Hours",
  description:
    "Expert online tutoring for students in Dubai, Abu Dhabi, and across the UAE. Specialising in MOE curriculum, British (IGCSE/A-Level), and IB programs.",
  alternates: {
    canonical: "https://studyhours.com/uae",
  },
  openGraph: {
    title: "Online Tutoring UAE | MOE, British & IB | Study Hours",
    description: "Expert online tutoring for students in Dubai, Abu Dhabi, and across the UAE. Specialising in MOE curriculum, British, and IB programs.",
    url: "https://studyhours.com/uae",
    images: [{ url: "/hero_calm_education.png", width: 1200, height: 630, alt: "StudyHours Online Tutoring UAE" }],
    type: "website",
  },
};

const faqs = [
  {
    q: "Which curriculums do you support in the UAE?",
    a: "We support the UAE Ministry of Education (MOE) national curriculum, the British curriculum (IGCSE and A-Levels), the International Baccalaureate (IB), and American curriculum (AP/SAT) taught across international schools in Dubai and Abu Dhabi.",
  },
  {
    q: "Do you offer EmSAT preparation?",
    a: "Yes. For students in the MOE system and those applying to federal universities in the UAE, we offer dedicated EmSAT preparation for English, Mathematics, Physics, Chemistry, and Arabic.",
  },
  {
    q: "Are your tutors familiar with the specific expectations of UAE private and international schools?",
    a: "Absolutely. We tutor students from top international schools across the UAE. Our tutors understand the rigorous internal assessment expectations, KHDA/ADEK frameworks, and specific curriculum demands of these institutions.",
  },
  {
    q: "Do you teach Arabic and Islamic Studies?",
    a: "Yes. For students in both MOE national schools and international schools, we offer specialist tutors for Arabic Language (both native and non-native tracks) and Islamic Studies.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      name: "StudyHours UAE Tutoring",
      description: "Online tutoring across the UAE covering MOE, British, IB, and EmSAT preparation.",
      url: "https://studyhours.com/uae",
      areaServed: { "@type": "Country", name: "United Arab Emirates" },
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

export default function UAEPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <UAEPageClient faqs={faqs} />
    </>
  );
}
