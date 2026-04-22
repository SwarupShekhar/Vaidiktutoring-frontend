import { Metadata } from "next";
import PrimarySchoolPageClient from "./PrimarySchoolPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Primary School Tutors Singapore: P1 to P6 | StudyHours",
  description:
    "Find expert primary school tutors in Singapore for P1 to P6 with StudyHours. engaging online classes, & exam-focused support to boost your child’s performance.",
  alternates: {
    canonical: "https://studyhours.com/singapore/primary-school-tutors-singapore",
  },
  openGraph: {
    title: "Primary School Tutors Singapore: P1 to P6 | StudyHours",
    description:
      "Find expert primary school tutors in Singapore for P1 to P6 with StudyHours. engaging online classes, & exam-focused support to boost your child’s performance.",
    url: "https://studyhours.com/singapore/primary-school-tutors-singapore",
    images: [
      {
         url: "/hero_calm_education.png",
         width: 1200,
         height: 630,
         alt: "StudyHours Primary School Tutors Singapore",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Primary School Tutors Singapore: P1 to P6 | StudyHours",
    description:
      "Find expert primary school tutors in Singapore for P1 to P6 with StudyHours. engaging online classes, & exam-focused support to boost your child’s performance.",
    images: ["/hero_calm_education.png"],
  },
  authors: [{ name: "StudyHours Academic Team" }],
};

export default function Page() {
  const faqs = [
    {
      q: "Do P1 and P2 students in Singapore still have exams?",
      a: "No. Since 2019, MOE Singapore removed all formal weighted assessments (exams) for Primary 1 and Primary 2. P1 and P2 students are assessed only through non-weighted, qualitative feedback. However, building strong foundational skills in P1–P2: particularly in Mathematics and English: is essential for P3 transition when formal assessments begin.",
    },
    {
      q: "When does Science begin in Singapore primary school?",
      a: "Science is introduced at Primary 3 as part of the MOE curriculum. This is one of the most significant transitions in Singapore primary school: P3 students suddenly have a new subject with its own examination format, including open-ended questions (OEQ). Starting P3 Science tutoring early prevents gaps from forming in P4 and P5.",
    },
    {
      q: "What is the GEP (Gifted Education Programme) test and how do tutors help?",
      a: "The GEP Screening Test is held in P3 (Primary 3). Shortlisted students then sit the GEP Selection Test. Both tests assess English Language, Mathematics, and General Ability: with a strong emphasis on higher-order thinking and non-routine problem solving. StudyHours tutors help P3 students develop the reasoning skills and unfamiliar problem formats that GEP tests require.",
    },
    {
      q: "What is the difference between Foundation and Standard track in Singapore primary school?",
      a: "From Primary 5, students are placed in either Standard or Foundation level for Mathematics and Mother Tongue Language. Foundation-level students study a less demanding version of the subject. Both levels are examined at PSLE, with Foundation students receiving a separate AL grade (AL A–E). Our tutors support both Standard and Foundation tracks.",
    },
    {
      q: "Which primary school subjects does StudyHours cover?",
      a: "We cover all MOE Singapore primary school subjects: English Language (P1–P6), Mathematics (P1–P6, Standard and Foundation), Science (P3–P6), Mother Tongue Language: Chinese, Malay, and Tamil (P1–P6, Standard and Foundation), and Higher Mother Tongue (P5–P6). We also offer GEP preparation for P3 students.",
    },
    {
      q: "How is P4 a turning point in Singapore primary school?",
      a: "Primary 4 is widely considered the most critical transition year in Singapore primary education. P4 Mathematics introduces challenging topics like fractions with unlike denominators and complex word problems. P4 Science deepens into systems and cycles. English composition expectations rise significantly. Students who fall behind in P4 typically enter P5 with compounding gaps ahead of PSLE.",
    },
    {
      q: "How early should I start online tutoring for my primary school child?",
      a: "For enrichment and strong foundation building, P2–P3 is a good starting point. For PSLE-focused preparation, P5 is the recommended start. P3 is particularly important for GEP preparation and early Science foundation. Starting earlier is generally better: prevention is more effective than remediation at primary level.",
    },
    {
      q: "Are online sessions effective for young primary school students in Singapore?",
      a: "Yes, with the right approach. StudyHours tutors who work with younger students (P1–P4) are experienced in keeping sessions interactive, visual, and varied to match shorter attention spans. Sessions use digital whiteboards, visual tools, and game-like problem formats to maintain engagement. Sessions are also recorded so parents can review what was covered.",
    },
  ];

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Primary School Online Tutoring Singapore: P1 to P6",
    provider: { "@type": "Organization", name: "StudyHours" },
    description:
      "1-on-1 online primary school tuition for Singapore P1–P6 students. MOE-aligned lessons in English, Mathematics, Science, and Mother Tongue. GEP preparation available. PSLE-readiness pathway for P5–P6.",
    educationalLevel: "Primary School",
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
  };

  const educationalOrgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "StudyHours: Primary School Tutors Singapore",
    description:
      "Expert online primary school tutoring in Singapore for Primary 1 through Primary 6. MOE Singapore syllabus aligned. Math, English, Science, Mother Tongue and GEP preparation.",
    url: "https://studyhours.com/singapore/primary-school-tutors-singapore",
    image: "https://studyhours.com/hero_calm_education.png",
    areaServed: { "@type": "Country", name: "Singapore" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1,320",
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
      { "@type": "ListItem", position: 3, name: "Primary School Tutors Singapore", item: "https://studyhours.com/singapore/primary-school-tutors-singapore" },
    ],
  };

  const jsonLd = [courseSchema, educationalOrgSchema, faqSchema, breadcrumbSchema];

  const testimonials = [
    {
      text: "Our daughter was falling behind in P4 Maths and we were worried about her PSLE trajectory. Her StudyHours tutor spent eight weeks rebuilding her fraction foundations before moving to problem sums. By the P4 end-of-year exam she scored 85: a 22-mark improvement from her mid-year result.",
      author: "Chen Wei L.",
      role: "Parent of P4 Student: Nanyang Primary School",
      rating: 5,
    },
    {
      text: "We started P3 Science tutoring the week it began at school. The tutor taught our son how to answer open-ended questions using proper scientific language: not just the concept but the exact phrasing markers expect. His P3 SA2 Science result was 91.",
      author: "Anita R.",
      role: "Parent of P3 Student: Tao Nan School",
      rating: 5,
    },
    {
      text: "We used StudyHours specifically for GEP preparation in P3. The tutor introduced non-routine Math problem types and higher-order English comprehension questions two months before the GEP screening. My son was shortlisted for the selection test: something we honestly didn't expect.",
      author: "Marcus T.",
      role: "Parent of P3 Student: Rosyth School",
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
      <PrimarySchoolPageClient testimonials={testimonials} faqs={faqs} />
    </>
  );
}
