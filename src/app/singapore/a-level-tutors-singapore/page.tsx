import { Metadata } from "next";
import ALevelSingaporePageClient from "./ALevelSingaporePageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "A-Level Tutors Singapore: JC1 & JC2 H2 H3 | StudyHours",
  description:
    "Expert A-Level and JC tutors in Singapore for H1, H2, H3 subjects. GP, Project Work, and university rank point strategy. SEAB-aligned.",
  alternates: {
    canonical: "https://studyhours.com/singapore/a-level-tutors-singapore",
  },
  openGraph: {
    title: "A-Level Tutors Singapore: JC1 & JC2 H2 H3 | StudyHours",
    description: "Expert A-Level and JC tutors in Singapore for H1, H2, H3 subjects. GP, Project Work, university rank point strategy. SEAB-aligned.",
    url: "https://studyhours.com/singapore/a-level-tutors-singapore",
    images: [{ url: "/hero_calm_education.png", width: 1200, height: 630, alt: "StudyHours A-Level Tutors Singapore" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A-Level Tutors Singapore: JC1 & JC2 H2 H3 | StudyHours",
    description: "Expert A-Level and JC tutors in Singapore for H1, H2, H3. GP, Project Work, rank point strategy.",
    images: ["/hero_calm_education.png"],
  },
  authors: [{ name: "StudyHours Academic Team" }],
};

export default function Page() {
  const faqs = [
    {
      q: "What is the difference between H1, H2, and H3 A-Level subjects in Singapore?",
      a: "H1 (Higher 1) is a single-paper subject worth 1 content unit: taken for subjects like General Paper, Mother Tongue Language, and one contrasting subject. H2 (Higher 2) is the standard JC content subject worth 2 units: the depth is equivalent to UK A-Level. H3 (Higher 3) is an extension subject for top students, taken alongside H2, requiring university-level thinking. A typical JC student takes 3 H2 subjects + 1 H1 contrasting + GP + MTL.",
    },
    {
      q: "What is the Singapore A-Level rank point (RP) system?",
      a: "University admissions in Singapore use a Rank Point (RP) score calculated from your best 3 H2 subjects + 1 H1 contrasting subject + General Paper + Mother Tongue Language. The maximum RP is 90. Each grade (A, B, C, D, E, S, U) carries a specific point value depending on whether it is an H1 or H2 subject. NUS, NTU, and SMU courses typically require RPs of 70–88.75. Our tutors help students identify which subjects to prioritise for maximum RP impact.",
    },
    {
      q: "What is General Paper (GP) and why is it important?",
      a: "General Paper (GP) is a compulsory H1 subject for all Singapore JC students. It tests critical thinking, argumentation, and essay writing across contemporary issues (Paper 1) and comprehension and summary writing (Paper 2). GP is included in every student's RP calculation. Many students with strong content subjects lose RP through low GP grades: our GP tutors address both essay structure and comprehension technique.",
    },
    {
      q: "When should a JC student start A-Level tutoring?",
      a: "JC1 Term 1 is the ideal start. The JC1 Promotional Examination (usually October) determines whether a student can proceed to JC2: many students who fail Promos must repeat JC1 or leave the programme. Starting tuition from JC1 Term 1 prevents Promo failure. JC2 students who start in Term 1 still have two full terms before the October/November A-Level papers.",
    },
    {
      q: "Do StudyHours tutors cover H2 Mathematics?",
      a: "Yes. H2 Mathematics is one of the most requested Singapore A-Level subjects. It covers pure mathematics (calculus, functions, complex numbers, vectors, series) and statistics (probability, distributions, hypothesis testing, correlation). Our tutors are specialists in H2 Math exam technique and the specific question formats used in Singapore A-Level papers.",
    },
    {
      q: "What is Project Work (PW) and can tutors help with it?",
      a: "Project Work (PW) is a compulsory JC subject assessed through a group project and an individual oral presentation. It is graded A–U and included in university applications. While PW is collaborative, our tutors can help students with written components: particularly the Written Report (WR) and Individual Reflection (IR): as well as oral presentation technique.",
    },
    {
      q: "Which Singapore JCs do StudyHours tutors support?",
      a: "Our tutors support students from all Singapore Junior Colleges including RIJC (Raffles Institution JC), HCI (Hwa Chong Institution), VJC (Victoria JC), NJC (National JC), ACJC (Anglo-Chinese JC), SAJC (St Andrew's JC), TJC (Tampines JC), MJC (Meridian JC), CJC (Catholic JC), IJC (Innova JC), NYJC (Nanyang JC), and SRJC (Serangoon Garden Secondary / SRJC). Centralised Institute (MI) students are also supported.",
    },
    {
      q: "How is Singapore A-Level different from UK A-Level?",
      a: "Singapore A-Level (H2) is broadly equivalent in difficulty to UK A-Level but with several key differences: the H1/H2/H3 structure, the compulsory General Paper requirement, a heavier emphasis on application questions, and the unique RP (Rank Point) system for university entry. International students transitioning from UK A-Level to Singapore A-Level, or vice versa, should note these structural differences. StudyHours tutors understand both systems.",
    },
  ];

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "A-Level Online Tutoring Singapore: JC1 & JC2 H1, H2, H3 Subjects",
    provider: { "@type": "Organization", name: "StudyHours" },
    description: "Specialist 1-on-1 online A-Level tutoring for Singapore JC1 and JC2 students. H1, H2, and H3 subjects including General Paper, Mathematics, Sciences, Humanities, and Mother Tongue. University rank point optimisation.",
    educationalLevel: "Junior College",
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
  };

  const educationalOrgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "StudyHours: A-Level Tutors Singapore",
    description: "Expert A-Level tutors for Singapore JC students. H2 Mathematics, Sciences, GP, Humanities, and Mother Tongue. JC1 Promos and JC2 A-Level examination preparation.",
    url: "https://studyhours.com/singapore/a-level-tutors-singapore",
    image: "https://studyhours.com/hero_calm_education.png",
    areaServed: { "@type": "Country", name: "Singapore" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "740",
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
      { "@type": "ListItem", position: 3, name: "A-Level Tutors Singapore", item: "https://studyhours.com/singapore/a-level-tutors-singapore" },
    ],
  };

  const jsonLd = [courseSchema, educationalOrgSchema, faqSchema, breadcrumbSchema];

  const testimonials = [
    {
      text: "H2 Chemistry was my weakest subject and I was at risk of failing JC1 Promos. My StudyHours tutor rebuilt my understanding from Atomic Structure through to Organic Chemistry in three months. I passed Promos comfortably and ended JC2 with a B for A-Level Chemistry: my tutor understood the SEAB marking approach exactly.",
      author: "Wei Jie L.",
      role: "JC2 Student: Hwa Chong Institution",
      rating: 5,
    },
    {
      text: "GP was pulling my rank points down significantly. I had strong H2 subjects but kept scoring D in GP essays. My StudyHours GP tutor restructured my argument approach completely: topic sentences, evidence integration, counter-argument handling. I achieved a B for GP at A-Level which brought my RP up by several points.",
      author: "Priscilla T.",
      role: "A-Level Graduate: Victoria Junior College",
      rating: 5,
    },
    {
      text: "H2 Mathematics at RIJC is notoriously demanding. The tutor I found through StudyHours had previously taught at a JC himself: he knew exactly which question types RIJC sets in internal assessments versus what appears in actual A-Level papers. I went from a U in JC1 midyear to an A at A-Level.",
      author: "Jason K.",
      role: "A-Level Graduate: Raffles Institution JC",
      rating: 5,
    },
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
         <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      ))}
      <ALevelSingaporePageClient testimonials={testimonials} faqs={faqs} />
    </>
  );
}
