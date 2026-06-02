import { Metadata } from "next";
import AustraliaPageClient from "./AustraliaPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Online Tutoring Australia | HSC, VCE, QCE & ATAR Prep | Study Hours",
  description:
    "Expert online tutoring for Australian students. Specialising in HSC, VCE, QCE, WACE, and ATAR strategy. Improve grades with top percentile tutors.",
  alternates: {
    canonical: "https://studyhours.com/australia",
  },
  openGraph: {
    title: "Online Tutoring Australia | HSC, VCE, QCE & ATAR Prep | Study Hours",
    description: "Expert online tutoring for Australian students. Specialising in HSC, VCE, QCE, WACE, and ATAR strategy.",
    url: "https://studyhours.com/australia",
    images: [{ url: "/australia_tutor_hero.jpg", width: 1200, height: 630, alt: "StudyHours Online Tutoring Australia" }],
    type: "website",
  },
};

const faqs = [
  {
    q: "Do your tutors teach the specific state curriculums (HSC, VCE, QCE)?",
    a: "Yes. Our tutors are specialists in their respective state syllabuses. A NSW student receives an HSC-qualified tutor, a Victorian student receives a VCE expert, and so on. We align exactly with NESA, VCAA, and QCAA requirements.",
  },
  {
    q: "How does online tutoring work for ATAR subjects?",
    a: "Online tutoring happens via interactive video calls with collaborative whiteboards. For ATAR subjects, our tutors focus on exam technique, breaking down past papers, and marking extended responses according to specific state criteria.",
  },
  {
    q: "Are the tutors based in Australia?",
    a: "Yes, our Australian curriculum tutors are top-percentile ATAR achievers or experienced teachers from Australia, completely familiar with the nuances of internal assessments (SBA/SACs) and external exams.",
  },
  {
    q: "Do you offer tutoring for younger year levels?",
    a: "Yes. While we specialise in Senior Secondary (Years 11-12), we also provide foundational support for Years 7-10 to prepare students for the rigours of the ATAR pathway.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      name: "StudyHours Australia Tutoring",
      description: "Online tutoring across Australia covering HSC, VCE, QCE, WACE, and ATAR strategy.",
      url: "https://studyhours.com/australia",
      areaServed: { "@type": "Country", name: "Australia" },
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

export default function AustraliaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AustraliaPageClient faqs={faqs} />
    </>
  );
}
