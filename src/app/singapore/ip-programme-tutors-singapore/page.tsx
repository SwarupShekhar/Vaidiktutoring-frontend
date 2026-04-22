import { Metadata } from "next";
import IPProgrammePageClient from "./IPProgrammePageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "IP Programme Online Tutors Singapore | Study Hours",
  description:
    "Struggling with IP subjects? Expert online tutors in Singapore deliver personalized coaching, clear concepts, and results you can see fast.",
  alternates: {
    canonical: "https://studyhours.com/singapore/ip-programme-tutors-singapore",
  },
  openGraph: {
    title: "IP Programme Online Tutors Singapore | Study Hours",
    description: "Struggling with IP subjects? Expert online tutors in Singapore deliver personalized coaching, clear concepts, and results you can see fast.",
    url: "https://studyhours.com/singapore/ip-programme-tutors-singapore",
    images: [{ url: "/hero_calm_education.png", width: 1200, height: 630, alt: "StudyHours IP Programme Tutors Singapore" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IP Programme Online Tutors Singapore | Study Hours",
    description: "Struggling with IP subjects? Expert online tutors in Singapore deliver personalized coaching, clear concepts, and results you can see fast.",
    images: ["/hero_calm_education.png"],
  },
  authors: [{ name: "StudyHours Academic Team" }],
};

export default function Page() {
  const faqs = [
    {
      q: "What is the Integrated Programme (IP) in Singapore?",
      a: "The Integrated Programme (IP) is a 6-year through-train programme that allows high-achieving students to bypass the GCE O-Level examination. Students enter in Secondary 1 (Year 1 of IP) and progress directly to Junior College Year 2 (Year 6 of IP), sitting the GCE A-Level at the end. The IP is offered at 13 Singapore schools and selects students primarily through the DSA (Direct School Admission) and PSLE results.",
    },
    {
      q: "Which schools in Singapore offer the Integrated Programme?",
      a: "The 13 IP schools in Singapore are: Raffles Institution (RI), Raffles Girls' School (RGS), Hwa Chong Institution (HCI), Victoria School (VS), Dunman High School, St. Joseph's Institution (SJI), Catholic High School (CHS), CHIJ St. Nicholas Girls' School, Anglo-Chinese School (Independent) [ACS(I)], Methodist Girls' School (MGS), NUS High School of Mathematics and Science, School of the Arts (SOTA), and Nanyang Girls' High School (NYGH).",
    },
    {
      q: "Why do IP students need specialist tutors rather than regular O-Level or A-Level tutors?",
      a: "IP students do not sit O-Levels: their internal school assessments follow each school's own curriculum design, not the national SEAB O-Level format. A tutor who only knows standard O-Level content will not understand the specific assessment styles, depth expectations, and project-based components used at RI, RGS, HCI, Dunman High, or SJI. IP students need tutors familiar with school-specific internal assessment formats.",
    },
    {
      q: "What subjects are assessed in Singapore's Integrated Programme?",
      a: "IP schools design their own curriculum for Years 1–4 (Sec 1–4 equivalent). Typical subjects include English Language, Mother Tongue Language, Mathematics, Sciences (Biology, Chemistry, Physics), Humanities (History, Geography, Literature), and unique IP modules specific to each school. From Year 5 (JC1) onward, IP students follow the national A-Level curriculum with H1/H2/H3 subjects.",
    },
    {
      q: "How does IP Year 1–4 differ from the regular Express stream?",
      a: "IP Year 1–4 goes significantly beyond the standard O-Level syllabus in depth and breadth. IP schools design enriched curricula with more analytical thinking, interdisciplinary projects, and independent research. The absence of O-Level pressure means IP internal assessments can test higher-order thinking without being constrained by national examination formats. This is why IP students benefit from tutors who know their specific school's assessment approach.",
    },
    {
      q: "Can StudyHours tutors help with DSA preparation to enter IP schools?",
      a: "Yes. DSA (Direct School Admission) is the primary entry route to most IP schools. DSA portfolios, interviews, and talent area tests vary significantly by school. Our tutors can assist with academic preparation for DSA: particularly in Mathematics, Sciences, and English: as well as helping students understand the specific IP school's culture and expectations.",
    },
    {
      q: "Are IP students eligible for GEP (Gifted Education Programme)?",
      a: "GEP students from primary school frequently progress to IP secondary schools through PSLE and DSA. Many IP students were previously in the GEP programme. StudyHours tutors who work with IP students are often the same tutors who handle GEP preparation: the higher-order thinking skills are closely related.",
    },
    {
      q: "When should an IP student start tutoring?",
      a: "IP Year 1 (Sec 1 equivalent) is the best starting point: this is when the transition from primary PSLE pressure to IP's breadth-and-depth curriculum is most jarring. Many IP students who were top PSLE scorers find IP Year 1 unexpectedly challenging. For Year 5–6 (JC1–JC2), standard A-Level tutoring applies, though IP school-specific knowledge is still valuable.",
    },
  ];

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "IP Programme Online Tutoring Singapore: Integrated Programme Year 1–6",
    provider: { "@type": "Organization", name: "StudyHours" },
    description: "Specialist online tutoring for Singapore Integrated Programme (IP) students at RI, RGS, HCI, Dunman High, SJI, Victoria School, and other IP schools. School-specific internal assessment preparation for IP Year 1–4 and A-Level preparation for Year 5–6.",
    educationalLevel: "Secondary School / Junior College",
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
  };

  const educationalOrgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "StudyHours: IP Programme Tutors Singapore",
    description: "Expert online IP programme tutors for all 13 Singapore Integrated Programme schools. School-specific internal assessments, Mathematics, Sciences, English, and Humanities across IP Year 1–6.",
    url: "https://studyhours.com/singapore/ip-programme-tutors-singapore",
    image: "https://studyhours.com/hero_calm_education.png",
    areaServed: { "@type": "Country", name: "Singapore" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "420",
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
      { "@type": "ListItem", position: 3, name: "IP Programme Tutors Singapore", item: "https://studyhours.com/singapore/ip-programme-tutors-singapore" },
    ],
  };

  const jsonLd = [courseSchema, educationalOrgSchema, faqSchema, breadcrumbSchema];

  const testimonials = [
    {
      text: "My son entered RI IP Year 1 as a top PSLE scorer and was shocked by the difficulty gap. The internal assessments at RI go far beyond what any O-Level preparation would cover. His StudyHours tutor knew RI's specific assessment style and helped him adapt quickly: his Year 1 end-of-year results were well above his midyear performance.",
      author: "Patricia L.",
      role: "Parent of IP Year 1 Student: Raffles Institution",
      rating: 5,
    },
    {
      text: "Finding a tutor who actually understood RGS IP curriculum was very difficult. Most tutors only know O-Level content. StudyHours matched my daughter with someone familiar with RGS's interdisciplinary approach and project components. The difference was immediate: she finally had someone who could explain what her school was actually assessing.",
      author: "Bernard C.",
      role: "Parent of IP Year 3 Student: Raffles Girls' School",
      rating: 5,
    },
    {
      text: "IP Year 5 at HCI is essentially JC1 A-Level content. The jump from IP Year 4 is steep. My son's H2 Mathematics tutor through StudyHours was specifically experienced with HCI's internal assessment formats for JC1: not just generic A-Level content. His HCI Promos result was distinction.",
      author: "Vivienne H.",
      role: "Parent of IP Year 5 Student: Hwa Chong Institution",
      rating: 5,
    },
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
         <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      ))}
      <IPProgrammePageClient testimonials={testimonials} faqs={faqs} />
    </>
  );
}
