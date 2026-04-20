import { Metadata } from "next";
import MOESingaporePageClient from "./MOESingaporePageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "MOE Singapore Curriculum Tutors Online | StudyHours",
  description:
    "Online tutors for the full MOE Singapore curriculum: Primary, Secondary, and JC. PSLE, O-Level, A-Level, and IP. SEAB-aligned specialists.",
  alternates: {
    canonical: "https://studyhours.com/singapore/moe-singapore-curriculum-tutors",
  },
  openGraph: {
    title: "MOE Singapore Curriculum Tutors Online | StudyHours",
    description:
      "Online tutors for the full MOE Singapore curriculum: Primary, Secondary, and JC. PSLE, O-Level, A-Level, and IP. SEAB-aligned specialists.",
    url: "https://studyhours.com/singapore/moe-singapore-curriculum-tutors",
    images: [{ url: "/hero_calm_education.png", width: 1200, height: 630, alt: "StudyHours MOE Singapore Curriculum Tutors" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MOE Singapore Curriculum Tutors Online | StudyHours",
    description: "Online tutors for the full MOE Singapore curriculum: Primary, Secondary, JC. PSLE, O-Level, A-Level, IP. SEAB-aligned.",
    images: ["/hero_calm_education.png"],
  },
  authors: [{ name: "StudyHours Academic Team" }],
};

export default function Page() {
  const faqs = [
    {
      q: "What is the MOE Singapore curriculum?",
      a: "The MOE (Ministry of Education) Singapore curriculum is the national education framework governing all government and government-aided schools in Singapore. It spans Primary 1 through Junior College 2 (or Centralised Institute Year 3), covering Primary school (PSLE), Secondary school (O-Level or N-Level), and Junior College (A-Level) or Integrated Programme pathways. The curriculum is assessed by SEAB (Singapore Examinations and Assessment Board).",
    },
    {
      q: "What is SEAB and how does it differ from MOE?",
      a: "MOE (Ministry of Education) sets the curriculum framework, syllabuses, and educational policies. SEAB (Singapore Examinations and Assessment Board) is the national body that conducts the actual national examinations: PSLE, N-Level, O-Level, and A-Level. StudyHours tutors are aligned to both the MOE syllabus and the SEAB examination format for each level.",
    },
    {
      q: "Which MOE Singapore levels do StudyHours tutors cover?",
      a: "StudyHours covers the full MOE Singapore education pathway: Primary school (P1–P6, including PSLE preparation), Secondary school (Sec 1–5, including O-Level and N-Level), Integrated Programme (IP, Year 1–6), and Junior College (JC1–JC2, including A-Level). All levels and streams are supported.",
    },
    {
      q: "Are StudyHours tutors aligned to the latest MOE syllabus changes?",
      a: "Yes. Our tutors follow current MOE syllabuses, including the 2021 PSLE Achievement Level (AL) changes, the revised Secondary school curriculum under the MOE Secondary Education Review and Enhancement (SERE), and current A-Level H1/H2/H3 specifications. We update our teaching materials whenever MOE revises syllabus documents.",
    },
    {
      q: "Can StudyHours help students new to the Singapore MOE curriculum?",
      a: "Yes. We regularly support international students and families who have recently arrived in Singapore and need to transition into the MOE curriculum. Our tutors explain the Singapore education system structure, stream placement, and subject combinations: and then align tutoring to the student's specific level and needs.",
    },
    {
      q: "What subjects does the MOE Singapore curriculum cover?",
      a: "At Primary level: English, Mathematics, Science (P3+), and Mother Tongue (Chinese, Malay, or Tamil). At Secondary level: English, Mother Tongue, E-Math, A-Math (optional), Sciences (Pure or Combined), Humanities, and electives. At JC level: H1/H2/H3 subjects including General Paper, Mathematics, Sciences, Humanities, and Mother Tongue. StudyHours covers all subjects at all levels.",
    },
    {
      q: "How is the MOE Singapore curriculum structured by level?",
      a: "Primary (P1–P6): 6 years, culminating in PSLE. Secondary (Sec 1–4 Express, or Sec 1–5 Normal Academic): culminating in O-Level or N-Level. Integrated Programme (IP): 6 years through-train from Sec 1 to JC2, bypassing O-Level. Junior College (JC1–JC2): 2 years, culminating in A-Level. Each pathway has distinct subject structures, assessment formats, and post-secondary implications.",
    },
    {
      q: "Why do Singapore students need a specialist MOE curriculum tutor rather than a general tutor?",
      a: "The MOE Singapore curriculum has examination formats: PSLE AL scoring, O-Level L1R5 aggregates, A-Level H-level subject depth, and IP internal assessments: that require specific preparation strategies. A general tutor teaches content; an MOE-specialist teaches to the assessment format. This distinction directly affects examination grades.",
    },
  ];

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "MOE Singapore Curriculum Online Tutoring: Primary, Secondary & JC",
    provider: { "@type": "Organization", name: "StudyHours" },
    description: "Comprehensive online tutoring for the full MOE Singapore curriculum pathway: from Primary 1 PSLE preparation through Secondary O-Level to Junior College A-Level. SEAB-aligned specialists for all subjects.",
    educationalLevel: "K-12",
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
  };

  const educationalOrgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "StudyHours: MOE Singapore Curriculum Tutors",
    description: "Expert online tutoring for the full MOE Singapore curriculum. PSLE, O-Level, A-Level, and Integrated Programme. All subjects. SEAB examination format aligned.",
    url: "https://studyhours.com/singapore/moe-singapore-curriculum-tutors",
    image: "https://studyhours.com/hero_calm_education.png",
    areaServed: { "@type": "Country", name: "Singapore" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1,580",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://studyhours.com" },
      { "@type": "ListItem", position: 2, name: "Singapore Tutoring", item: "https://studyhours.com/singapore" },
      { "@type": "ListItem", position: 3, name: "MOE Singapore Curriculum Tutors", item: "https://studyhours.com/singapore/moe-singapore-curriculum-tutors" },
    ],
  };

  const jsonLd = [courseSchema, educationalOrgSchema, faqSchema, breadcrumbSchema];

  const testimonials = [
    {
      text: "We moved to Singapore from the UK when my daughter was in P4. The MOE curriculum was completely different from what she knew. Her StudyHours tutor not only taught her the content but explained the Singapore education system: why model drawing works, how SA1/SA2 are structured, and what PSLE actually tests. She scored AL2 in Math at PSLE.",
      author: "Emma R.",
      role: "British Expat Parent: P6 Student, Nanyang Primary",
      rating: 5,
    },
    {
      text: "My son was in the Express stream at Sec 3 and struggling with the jump from PSLE to O-Level standards. The StudyHours tutor understood exactly where the MOE O-Level syllabus diverged from what he remembered from primary: and built the bridge systematically. His Sec 3 end-of-year results improved across all subjects.",
      author: "David K.",
      role: "Parent of Sec 3 Student: Victoria School",
      rating: 5,
    },
    {
      text: "As an Indian expat family, we found Singapore's MOE curriculum quite different from CBSE. StudyHours matched my son with a tutor who understood both systems and helped him transition into the Singapore Math approach and Science OEQ format within two months. His school results are now above average for his class.",
      author: "Sunita M.",
      role: "Indian Expat Parent: P5 Student, Anglo-Chinese School (Primary)",
      rating: 5,
    },
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
         <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      ))}
      <MOESingaporePageClient testimonials={testimonials} faqs={faqs} />
    </>
  );
}
