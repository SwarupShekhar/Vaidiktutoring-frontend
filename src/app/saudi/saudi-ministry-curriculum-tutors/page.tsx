import { Metadata } from "next";
import SaudiMinistryPageClient from "./SaudiMinistryPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Saudi MOE Tutors Online | Tawjihi Exam Prep for Top Scores",
  description:
    "At Study hours, get expert Saudi MOE tutors online for Tawjihi exam prep. 1-on-1 coaching, personalized lessons, and proven strategies to boost scores fast.",
  alternates: {
    canonical: "https://studyhours.com/saudi/saudi-ministry-curriculum-tutors",
    languages: {
      "en-SG": "https://studyhours.com/singapore/moe-singapore-curriculum-tutors",
      "en-AE": "https://studyhours.com/uae/moe-uae-curriculum-tutors",
      "en-SA": "https://studyhours.com/saudi/saudi-ministry-curriculum-tutors",
      "en-AU": "https://studyhours.com/australia/curriculum-tutoring",
    },
  },
  openGraph: {
    title: "Saudi Ministry Curriculum Tutors | Expert Online Tawjihi & Qudurat Prep",
    description: "Expert online tutors for Saudi Ministry of Education curriculum. Arabic-medium instruction for Tawjihi, Qudurat, Tahsili and Saudi MOE school assessments.",
    url: "https://studyhours.com/saudi/saudi-ministry-curriculum-tutors",
    images: [{ url: "/hero_calm_education.png", width: 1200, height: 630, alt: "StudyHours Saudi Ministry Curriculum Tutors" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saudi MOE Tutors Online | Tawjihi Exam Prep for Top Scores",
    description: "At Study hours, get expert Saudi MOE tutors online for Tawjihi exam prep. 1-on-1 coaching, personalized lessons, and proven strategies to boost scores fast.",
    images: ["/hero_calm_education.png"],
  },
  authors: [{ name: "StudyHours Academic Team" }],
};

export default function Page() {
  const faqs = [
    {
      q: "What is the Saudi Ministry of Education curriculum?",
      a: "The Saudi Ministry of Education (MOE) curriculum is the national education framework governing all government schools and many private schools in Saudi Arabia. It spans three stages: Primary (Grades 1-6), Intermediate (Grades 7-9), and Secondary (Grades 10-12). The curriculum is primarily delivered in Arabic and includes compulsory Islamic Education at all levels. The secondary stage culminates in the General Secondary Education Certificate (Tawjihi). Since 2016, Vision 2030 education reforms have progressively updated mathematics and science syllabuses to align with international benchmarks.",
    },
    {
      q: "How is the Saudi school system structured by stage?",
      a: "Saudi Arabia's school system has three stages: Primary (ابتدائي, Grades 1-6, ages 6-12), Intermediate (متوسط, Grades 7-9, ages 12-15), and Secondary (ثانوي, Grades 10-12, ages 15-18). Each stage has distinct subject requirements and assessment approaches. The Primary stage builds Arabic Language, Islamic Studies, and foundational Mathematics. The Intermediate stage introduces Sciences and Social Studies. The Secondary stage splits into Scientific and Literary tracks, with the Scientific track including higher-level Mathematics, Physics, Chemistry, and Biology.",
    },
    {
      q: "What is the Tawjihi examination in Saudi Arabia?",
      a: "Tawjihi refers to the Saudi General Secondary Education Certificate Examination (شهادة الثانوية العامة), taken at the end of Grade 12. Tawjihi results, combined with Qudurat (aptitude test) and Tahsili (achievement test) scores, determine university admission. Saudi universities including King Saud University, King Abdulaziz University, and KAUST use composite scores for competitive programmes in Medicine, Engineering, and Computer Science. StudyHours tutors help Secondary students prepare for both school assessments and these high-stakes admission tests.",
    },
    {
      q: "What are Qudurat and Tahsili tests and why do they matter?",
      a: "Qudurat (قدرات) is Saudi Arabia's national scholastic aptitude test measuring verbal and quantitative reasoning: similar in purpose to the SAT. Tahsili (تحصيلي) is the national achievement test measuring subject-specific knowledge in sciences and mathematics. Both are administered by the National Center for Assessment (Qiyas). Top Saudi university programmes require combined Tawjihi, Qudurat, and Tahsili scores. StudyHours tutors prepare students for the specific test format and content of both examinations.",
    },
    {
      q: "What subjects are in the Saudi national curriculum?",
      a: "Saudi national curriculum subjects include: Arabic Language (reading, grammar, writing across all stages), Islamic Education (Quran, Hadith, Fiqh, Tawheed), Mathematics (Primary through Secondary), Sciences (integrated in Primary, then separate Physics, Chemistry, Biology in Secondary Scientific track), Social Studies, English as a Foreign Language (from Grade 1), Computer Science, and Physical Education. The Secondary Scientific track adds advanced Mathematics, Physics, Chemistry, and Biology alongside the humanities core.",
    },
    {
      q: "Can StudyHours tutors teach in Arabic for Saudi MOE subjects?",
      a: "Yes. Saudi MOE curriculum is primarily Arabic-medium. Our Arabic-speaking tutors can deliver sessions fully in Arabic for subjects including Arabic Language, Islamic Studies, Mathematics (Arabic instruction), and Sciences (Arabic instruction). For Saudi students who prefer English-medium support for Mathematics and Sciences, we also have bilingual tutors who can bridge between Arabic and English academic terminology.",
    },
    {
      q: "How does StudyHours help students in the Saudi Scientific track?",
      a: "Saudi Secondary Scientific track students take higher-level Mathematics, Physics, Chemistry, and Biology in Grades 10-12. These subjects are assessed in Tawjihi and tested in Tahsili. Scientific track tutors at StudyHours understand the Saudi MOE syllabus document requirements, the depth expected in Secondary Science, and the format of both school exams and Tahsili Science papers. Distinction in Scientific track subjects is essential for Medical and Engineering programme admission at Saudi universities.",
    },
    {
      q: "Can expat children in Saudi Arabia access Saudi MOE curriculum tutoring?",
      a: "Yes. Some expatriate families in Saudi Arabia enrol their children in Saudi government schools or Saudi-curriculum private schools. StudyHours supports these students with the same Arabic-medium Saudi MOE curriculum tutoring, including Arabic Language for non-native speakers, Islamic Studies, and the Mathematics and Sciences that are tested in school assessments. We also help children of returning Saudi families who have been abroad and are re-integrating into the Saudi curriculum.",
    },
  ];

  const educationalOrgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "StudyHours: Saudi Ministry of Education Curriculum Tutors",
    description: "Expert online tutors for the Saudi Ministry of Education curriculum. Arabic, Islamic Studies, Mathematics, Sciences across Primary, Intermediate and Secondary stages. Tawjihi, Qudurat and Tahsili preparation.",
    url: "https://studyhours.com/saudi/saudi-ministry-curriculum-tutors",
    image: "https://studyhours.com/hero_calm_education.png",
    areaServed: { "@type": "Country", name: "Saudi Arabia" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: 294,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Saudi Ministry of Education Curriculum Online Tutoring",
    provider: { "@type": "Organization", name: "StudyHours" },
    description: "Specialist online tutoring for the Saudi MOE national curriculum. Arabic Language, Islamic Studies, Mathematics, Sciences for Primary through Secondary. Tawjihi examination preparation and Qudurat aptitude test coaching.",
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
      { "@type": "ListItem", position: 2, name: "Saudi Tutoring", item: "https://studyhours.com/saudi" },
      { "@type": "ListItem", position: 3, name: "Saudi Ministry Curriculum Tutors", item: "https://studyhours.com/saudi/saudi-ministry-curriculum-tutors" },
    ],
  };

  const jsonLd = [educationalOrgSchema, courseSchema, faqSchema, breadcrumbSchema];

  const testimonials = [
    {
      text: "My son was in Grade 11 Scientific track and struggling with Saudi MOE Chemistry and Physics. The exam format and Arabic-medium instruction were very different from what I could help with at home. His StudyHours tutor delivered sessions entirely in Arabic, used the exact Saudi MOE textbooks as reference, and rebuilt his understanding of Organic Chemistry within two months. His end-of-term grade improved from 65 to 88.",
      author: "Khalid A.",
      role: "Saudi Parent: Grade 11 Scientific Track, Riyadh",
      rating: 5,
    },
    {
      text: "My daughter needed Qudurat preparation. The test format is very specific and most tutors don't understand the quantitative reasoning section well. Her StudyHours tutor had specific Qudurat preparation experience, particularly in the Arabic verbal section and the mathematical problem-solving patterns. Her Qudurat score increased by 14 points in the retake.",
      author: "Fatima H.",
      role: "Saudi Parent: Grade 12, Jeddah",
      rating: 5,
    },
    {
      text: "We returned to Saudi Arabia after 8 years in the UK and my son needed to re-enter the Saudi national curriculum at Grade 9 Intermediate level. He had strong English but very weak Arabic Language and Islamic Studies from the UK curriculum. His StudyHours tutor treated it as a transition challenge and built both systematically. By Grade 10 he was integrated into the Saudi stream without repeating a year.",
      author: "Omar S.",
      role: "Returning Saudi Family: Dammam",
      rating: 5,
    },
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
         <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      ))}
      <SaudiMinistryPageClient testimonials={testimonials} faqs={faqs} />
    </>
  );
}
