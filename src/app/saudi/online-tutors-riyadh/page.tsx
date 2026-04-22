import { Metadata } from "next";
import RiyadhPageClient from "./RiyadhPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Online Tutors Riyadh: IB, IGCSE & Saudi MOE | StudyHours",
  description:
    "Expert online tutors for Riyadh students. IB, IGCSE, British A-Level, American AP, CBSE and Saudi Ministry curriculum. BIS Riyadh, AISR, Manarat.",
  alternates: {
    canonical: "https://studyhours.com/uae/online-tutors-riyadh",
  },
  openGraph: {
    title: "Online Tutors Riyadh: IB, IGCSE & Saudi MOE | StudyHours",
    description: "Expert online tutors for Riyadh students. IB, IGCSE, British A-Level, American AP, CBSE and Saudi Ministry curriculum.",
    url: "https://studyhours.com/uae/online-tutors-riyadh",
    images: [{ url: "/hero_calm_education.png", width: 1200, height: 630, alt: "StudyHours Online Tutors Riyadh" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Tutors Riyadh: IB, IGCSE & Saudi MOE | StudyHours",
    description: "Expert online tutors for Riyadh students. IB, IGCSE, British, American, CBSE and Saudi MOE. Book free trial.",
    images: ["/hero_calm_education.png"],
  },
  authors: [{ name: "StudyHours Academic Team" }],
};

export default function Page() {
  const faqs = [
    {
      q: "Why do Riyadh students need specialist online tutors?",
      a: "Riyadh is home to a large international community alongside a significant Saudi national student population. International school students at BIS Riyadh, AISR, or Manarat International face IB, IGCSE, and American AP curricula that require examiners-trained specialist tutors rather than general academic support. Saudi national curriculum students preparing for Tawjihi or university entrance need tutors who understand the Saudi MOE assessment format. Online tutoring gives Riyadh families access to curriculum-specific specialists regardless of location within the city.",
    },
    {
      q: "Which curricula do StudyHours tutors cover for Riyadh students?",
      a: "StudyHours covers all major curricula available in Riyadh: British (IGCSE and A-Level through Cambridge International), International Baccalaureate (IB MYP and IB DP), American (AP subjects, SAT, ACT preparation), Saudi Ministry of Education national curriculum (Arabic instruction), CBSE (Indian curriculum for the large expat Indian community), and French Baccalaureate. We match students to the curriculum expert their specific school requires.",
    },
    {
      q: "Which Riyadh schools does StudyHours support?",
      a: "Our tutors support students from all major Riyadh international and private schools including: British International School Riyadh (BIS Riyadh), American International School Riyadh (AISR), Manarat International School, Lycee Francais de Riyad, Pakistan International School Riyadh, Indian International School Riyadh (IISR), Saudi International Schools, Dhahran Ahliyya Schools, and Saudi national government schools following the Ministry of Education curriculum.",
    },
    {
      q: "Does StudyHours cover Saudi MOE national curriculum subjects?",
      a: "Yes. Saudi MOE national curriculum students: in both government schools and government-curriculum private schools: study subjects including Arabic Language, Islamic Studies, Mathematics, Science, Social Studies, and English as a Second Language. Our tutors include Arabic-speaking specialists who understand the Saudi MOE assessment format, grade-level expectations, and the Tawjihi secondary school certificate preparation.",
    },
    {
      q: "How does online tutoring work for the Riyadh time zone?",
      a: "Riyadh operates on Arabia Standard Time (AST, UTC+3). StudyHours tutors are available across time zones to match Riyadh students' schedules, including weekday evenings (post-school hours), Thursday afternoons, and weekend sessions. The Saudi school week runs Sunday to Thursday, which we accommodate explicitly. All sessions are conducted via our online platform with screen sharing, interactive whiteboards, and session recordings.",
    },
    {
      q: "Can StudyHours help with IGCSE preparation for BIS Riyadh students?",
      a: "Yes. BIS Riyadh follows the Cambridge IGCSE curriculum for Years 10-11 and A-Level for Years 12-13. Our IGCSE tutors specialise in Cambridge examination formats, including extended and core tier Mathematics, Cambridge Sciences (triple and co-ordinated), IGCSE English Language and Literature, and Humanities subjects. We understand BIS Riyadh's internal assessment schedule and term structure.",
    },
    {
      q: "What is the Tawjihi and how do tutors help Saudi students prepare?",
      a: "Tawjihi (also called the Saudi General Secondary Education Certificate / Shahadat al-Thanawiyya al-Amma) is the Saudi national examination taken at the end of Grade 12. Tawjihi results, combined with Saudi national Qudurat and Tahsili scores, determine university admission in Saudi Arabia. StudyHours tutors who specialise in the Saudi MOE curriculum help students with Mathematics, Sciences, Arabic, and English components of both Tawjihi preparation and university admission test preparation.",
    },
    {
      q: "Are there StudyHours tutors with experience in both Saudi MOE and international curricula?",
      a: "Yes. Riyadh has a uniquely mixed educational landscape: many students move between Saudi national schools and international schools at different life stages. Our tutors include specialists who understand both the Saudi MOE curriculum and international curricula (IGCSE, IB, AP). This is particularly valuable for Saudi students transitioning to international school pathways or for expat families whose children attend Saudi-curriculum schools temporarily.",
    },
  ];

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "StudyHours: Online Tutors Riyadh",
    description: "Expert online tutoring for Riyadh students across IB, IGCSE, British A-Level, American AP, CBSE and Saudi Ministry of Education curricula. BIS Riyadh, AISR, Manarat International and Saudi national schools supported.",
    url: "https://studyhours.com/uae/online-tutors-riyadh",
    image: "https://studyhours.com/hero_calm_education.png",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Riyadh",
      addressRegion: "Riyadh Province",
      addressCountry: "SA",
    },
    geo: { "@type": "GeoCoordinates", latitude: 24.6877, longitude: 46.7219 },
    areaServed: [
      { "@type": "City", name: "Riyadh" },
      { "@type": "City", name: "Jeddah" },
      { "@type": "City", name: "Dammam" },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "389",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Online Tutoring Riyadh: IB, IGCSE, British, American, Saudi MOE",
    provider: { "@type": "Organization", name: "StudyHours" },
    description: "Specialist 1-on-1 online tutoring for Riyadh students. IB DP and MYP, IGCSE, A-Level, AP, CBSE, and Saudi Ministry of Education national curriculum. Tawjihi and university entrance test preparation.",
    educationalLevel: "K-12",
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
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
      { "@type": "ListItem", position: 2, name: "UAE Tutoring", item: "https://studyhours.com/uae" },
      { "@type": "ListItem", position: 3, name: "Online Tutors Riyadh", item: "https://studyhours.com/uae/online-tutors-riyadh" },
    ],
  };

  const jsonLd = [localBusinessSchema, courseSchema, faqSchema, breadcrumbSchema];

  const testimonials = [
    {
      text: "My son was in Year 11 at BIS Riyadh preparing for IGCSE Mathematics and Physics. Finding a tutor in Riyadh who understood Cambridge extended tier Mathematics was extremely difficult. StudyHours matched him with a specialist who knew exactly how Cambridge marks extended problem-solving questions. He achieved A* in both subjects.",
      author: "David C.",
      role: "Parent of IGCSE Year 11 Student: British International School Riyadh",
      rating: 5,
    },
    {
      text: "Our daughter attends AISR and was struggling with AP Calculus BC and AP Chemistry simultaneously. The StudyHours tutor who works with her has AP teaching experience and understands the College Board mark scheme in detail. Her AP scores improved from 2-3 range to 4-5 range within one academic year.",
      author: "Linda K.",
      role: "American Expat Parent: American International School Riyadh",
      rating: 5,
    },
    {
      text: "As a Saudi family, we needed support for our son's Tawjihi Mathematics and science subjects alongside his English. The StudyHours tutor understood the Saudi MOE curriculum structure and helped him prepare for both school assessments and the Qudurat university entrance test. His Tawjihi scores were significantly above our expectations.",
      author: "Mohammed A.",
      role: "Saudi Parent: Grade 12, Riyadh Government School",
      rating: 5,
    },
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
         <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      ))}
      <RiyadhPageClient testimonials={testimonials} faqs={faqs} />
    </>
  );
}
