import { Metadata } from "next";
import PSLEPageClient from "./PSLEPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "PSLE Tutors Online for English, Math & Science Tuition",
  description:
    "Get expert PSLE tutors online for English, Math & Science. Personalized lessons, interactive classes & proven strategies to boost scores and exam confidence.",
  alternates: {
    canonical: "https://studyhours.com/singapore/psle-tutors-online",
  },
  openGraph: {
    title: "PSLE Tutors Online for English, Math & Science Tuition",
    description:
      "Get expert PSLE tutors online for English, Math & Science. Personalized lessons, interactive classes & proven strategies to boost scores and exam confidence.",
    url: "https://studyhours.com/singapore/psle-tutors-online",
    images: [
      {
         url: "/hero_calm_education.png",
         width: 1200,
         height: 630,
         alt: "StudyHours PSLE Online Tutoring Singapore",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PSLE Tutors Online for English, Math & Science Tuition",
    description:
      "Get expert PSLE tutors online for English, Math & Science. Personalized lessons, interactive classes & proven strategies to boost scores and exam confidence.",
    images: ["/hero_calm_education.png"],
  },
  authors: [{ name: "StudyHours Academic Team" }],
};

export default function Page() {
  const faqs = [
    {
      q: "What is the PSLE Achievement Level (AL) scoring system?",
      a: "Since 2021, PSLE uses Achievement Levels (AL1–AL8) instead of T-scores. Each subject is scored AL1 (best) to AL8. Your child's four subject AL scores are added together: lower is better. An AL score of 4 (AL1 in all four subjects) is the best possible result. Secondary school posting uses this aggregate score.",
    },
    {
      q: "When should my child start PSLE tutoring?",
      a: "Ideally, structured PSLE tutoring should begin in Primary 5: one full year before the exam. P5 introduces all the major PSLE topics, and a P5 gap in understanding becomes a P6 exam problem. That said, P6 students who start tuition in Term 1 still have time to make meaningful improvement across all four subjects.",
    },
    {
      q: "How many subjects are in PSLE?",
      a: "PSLE comprises four subjects: English Language, Mathematics, Science, and Mother Tongue Language (Chinese, Malay, or Tamil). Each is scored on the AL1–AL8 scale. The aggregate of all four AL scores determines secondary school posting. Foundation-level versions exist for Math and Mother Tongue for students on that track.",
    },
    {
      q: "What are the hardest PSLE subjects?",
      a: "PSLE Mathematics is widely considered the most challenging subject due to complex problem sums, heuristics, and multi-step reasoning. Science open-ended questions and English composition writing are also common weak areas. Our tutors address each subject's specific challenge type: not just general revision.",
    },
    {
      q: "Can online PSLE tutoring replace a tuition centre?",
      a: "For most students, yes. Online 1-on-1 tutoring is more effective than tuition centres because sessions are completely personalised to your child's specific gaps, not a generic class syllabus. Sessions are recorded for replay, scheduling is flexible, and there is no commute to a centre: important in Singapore's busy school schedule.",
    },
    {
      q: "How is PSLE Mathematics different from school classroom teaching?",
      a: "PSLE Maths requires mastery of specific heuristics (model drawing, guess-and-check, working backwards, systematic listing), multi-step problem sums, and fraction/ratio/percentage combinations that are rarely seen in basic classroom work. Our tutors focus precisely on exam-format thinking, not just concept teaching.",
    },
    {
      q: "Do PSLE tutors follow the latest MOE syllabus changes?",
      a: "Yes. StudyHours PSLE tutors follow the current MOE Singapore syllabus, including the 2021 AL scoring changes, updated Science open-ended question formats, and the current English Language syllabus with its revised Oral Examination and Listening Comprehension components.",
    },
    {
      q: "How much does PSLE online tuition cost in Singapore?",
      a: "StudyHours PSLE online tutoring is competitively priced compared to Singapore tuition centres and private home tutors: with no travel surcharges, flexible scheduling, and recorded sessions. Book a free assessment session and we will provide a transparent quote based on your child's subjects and frequency needs.",
    },
  ];

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "PSLE Online Tutoring: Mathematics, English, Science & Mother Tongue",
    provider: { "@type": "Organization", name: "StudyHours" },
    description:
      "Comprehensive 1-on-1 online PSLE tuition for Primary 5 and Primary 6 students in Singapore. MOE-aligned lessons targeting AL1 achievement across all four PSLE subjects.",
    educationalLevel: "Primary School",
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
  };

  const educationalOrgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "StudyHours: PSLE Online Tutors Singapore",
    description:
      "Expert PSLE online tutoring in Singapore for Mathematics, English Language, Science, and Mother Tongue. MOE 2021 AL-score aligned. Serving Primary 5 and Primary 6 students across Singapore.",
    url: "https://studyhours.com/singapore/psle-tutors-online",
    image: "https://studyhours.com/hero_calm_education.png",
    areaServed: { "@type": "Country", name: "Singapore" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1,140",
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
      { "@type": "ListItem", position: 3, name: "PSLE Tutors Online", item: "https://studyhours.com/singapore/psle-tutors-online" },
    ],
  };

  const jsonLd = [courseSchema, educationalOrgSchema, faqSchema, breadcrumbSchema];

  const psleTestimonials = [
    {
      text: "My son was consistently scoring AL3 in PSLE Math and we were worried. After three months of weekly sessions with his StudyHours tutor, he sat the actual PSLE and achieved AL1. The tutor's focus on problem sum heuristics and model drawing made a real difference.",
      author: "Mei Lin T.",
      role: "Parent of P6 Student: Nanyang Primary School",
      rating: 5,
    },
    {
      text: "We started PSLE Science tuition in P5 which turned out to be the best decision. By the time the actual exam arrived in P6, my daughter had done every past year paper format twice and knew exactly what the open-ended questions were looking for. AL1 result.",
      author: "Rajan S.",
      role: "Parent of PSLE Graduate: Anglo-Chinese School (Primary)",
      rating: 5,
    },
    {
      text: "The English composition coaching was exactly what my child needed. The tutor broke down the marking rubric and taught her how examiners score each paragraph. Her composition marks jumped significantly in the school prelim exams and held in the actual PSLE.",
      author: "Grace W.",
      role: "Parent of P6 Student: Raffles Girls' Primary School",
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
      <PSLEPageClient testimonials={psleTestimonials} faqs={faqs} />
    </>
  );
}
