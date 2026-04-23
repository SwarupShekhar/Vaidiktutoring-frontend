import { Metadata } from "next";
import OLevelPageClient from "./OLevelPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "O-Level Tutors Online Singapore - Math, English & Biology",
  description:
    "Boost your O-Level scores with expert online tutors for Math, English & Biology. Personalized lessons, flexible schedules & exam-focused strategies.",
  alternates: {
    canonical: "https://studyhours.com/singapore/o-level-tutors-singapore",
  },
  openGraph: {
    title: "O-Level Tutors Online Singapore - Math, English & Biology",
    description:
      "Boost your O-Level scores with expert online tutors for Math, English & Biology. Personalized lessons, flexible schedules & exam-focused strategies.",
    url: "https://studyhours.com/singapore/o-level-tutors-singapore",
    images: [
      {
         url: "/hero_calm_education.png",
         width: 1200,
         height: 630,
         alt: "StudyHours O-Level Tutors Singapore",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "O-Level Tutors Online Singapore - Math, English & Biology",
    description:
      "Boost your O-Level scores with expert online tutors for Math, English & Biology. Personalized lessons, flexible schedules & exam-focused strategies.",
    images: ["/hero_calm_education.png"],
  },
  authors: [{ name: "StudyHours Academic Team" }],
};

export default function Page() {
  const faqs = [
    {
      q: "What is the GCE O-Level grading system in Singapore?",
      a: "Singapore O-Level subjects are graded A1 (best, 75–100%) to F9 (below 30%). A1 and A2 are distinction grades. B3 and B4 are merit grades. C5 and C6 are pass grades. D7, E8, and F9 are below credit level. For secondary school, your L1R5 or L1R4 aggregate: calculated from your best subjects: determines Junior College or Polytechnic entry.",
    },
    {
      q: "What is L1R5 and why does it matter for O-Level students?",
      a: "L1R5 is the aggregate used for Junior College (JC) admission. It combines your First Language grade (L1, usually English) with your five relevant subject grades (R5). The lower your L1R5, the better: most JCs require an L1R5 of 20 or below. StudyHours tutors help students target A1–B3 across all subjects to achieve a competitive L1R5.",
    },
    {
      q: "Which O-Level subjects are hardest in Singapore?",
      a: "Additional Mathematics (A-Math) and Pure Sciences (Physics, Chemistry, Biology) are widely considered the most demanding O-Level subjects. Combined Humanities (Social Studies + Elective) and English are also high-stakes due to their compulsory status. Our tutors specialise in all high-difficulty O-Level subjects.",
    },
    {
      q: "Should I take Pure Sciences or Combined Science for O-Level?",
      a: "Pure Sciences (separate Physics, Chemistry, Biology) are recommended for students targeting science-stream JC courses or medicine-related polytechnic diplomas. Combined Science (typically Physics/Chemistry or Biology/Chemistry) is lighter but limits some post-secondary pathways. Our tutors support both tracks at full depth.",
    },
    {
      q: "When should a Singapore student start O-Level tutoring?",
      a: "Secondary 3 is the optimal starting point: the year when most O-Level subjects begin in full. Starting Sec 3 gives two full years of structured preparation. Sec 4 students who start in Term 1 still have enough time for a complete syllabus review and past year paper practice before the October/November O-Level papers.",
    },
    {
      q: "What is the difference between the Express and Normal Academic stream for O-Level?",
      a: "Express stream students sit O-Level at the end of Secondary 4 (four years). Normal Academic (NA) stream students typically sit N-Level at the end of Sec 4 and may progress to O-Level at Sec 5. Some NA students are eligible for the SPERS-Sec scheme, which allows them to sit O-Level papers without completing Sec 5. StudyHours tutors support both streams.",
    },
    {
      q: "Do O-Level tutors cover Additional Mathematics (A-Math)?",
      a: "Yes. Additional Mathematics is one of the most requested O-Level subjects. It covers advanced algebra, trigonometry, calculus, coordinate geometry, and binomial theorem. Many students find A-Math significantly harder than E-Math. Our tutors are specialists in A-Math exam technique and question patterns.",
    },
    {
      q: "How does online O-Level tutoring compare to in-person tuition in Singapore?",
      a: "Online 1-on-1 O-Level tutoring is at least as effective as in-person tuition, with added advantages: sessions are recorded for revision, scheduling is flexible around CCA and school commitments, and students access subject specialists without travel. Our Singapore-based and internationally based tutors are all SEAB-syllabus aligned.",
    },
  ];

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "O-Level Online Tutoring Singapore: GCE O-Level All Subjects",
    provider: { "@type": "Organization", name: "StudyHours" },
    description:
      "1-on-1 online O-Level tutoring for Singapore Secondary 3 and Secondary 4 students. SEAB-aligned lessons targeting A1 grades across all GCE O-Level subjects including E-Math, A-Math, Physics, Chemistry, Biology, English, and Humanities.",
    educationalLevel: "Secondary School",
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
  };

  const educationalOrgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "StudyHours: O-Level Tutors Singapore",
    description:
      "Expert online O-Level tutors in Singapore for Express and Normal Academic stream students. SEAB GCE O-Level syllabus aligned. Secondary 3 and Secondary 4 specialists.",
    url: "https://studyhours.com/singapore/o-level-tutors-singapore",
    image: "https://studyhours.com/hero_calm_education.png",
    areaServed: { "@type": "Country", name: "Singapore" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: 980,
      bestRating: 5,
      worstRating: 1,
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
      { "@type": "ListItem", position: 3, name: "O-Level Tutors Singapore", item: "https://studyhours.com/singapore/o-level-tutors-singapore" },
    ],
  };

  const jsonLd = [courseSchema, educationalOrgSchema, faqSchema, breadcrumbSchema];

  const oLevelTestimonials = [
    {
      text: "My son was projected a C6 for O-Level A-Math. After six months of weekly sessions, he sat the paper and scored A1. The tutor's systematic approach to calculus and trigonometry, combined with full past year paper walkthroughs, completely changed how he tackled questions.",
      author: "Linda C.",
      role: "Parent of Sec 4 Student: Victoria School",
      rating: 5,
    },
    {
      text: "We started Pure Chemistry tutoring in Sec 3 which turned out to be the best timing decision. The tutor built up concepts properly: Organic Chemistry in Sec 4 was manageable because the foundational knowledge from Sec 3 was solid. A2 result in the O-Level.",
      author: "Harish P.",
      role: "Parent of Sec 4 Student: Dunman High School",
      rating: 5,
    },
    {
      text: "English was my daughter's weak link pulling her L1R5 up significantly. The O-Level English tutor focused entirely on her Paper 1 essay structure and Paper 2 comprehension inference technique. She moved from a C5 school preliminary grade to an A2 in the actual O-Level.",
      author: "Susan T.",
      role: "Parent of O-Level Graduate: CHIJ St. Theresa's Convent",
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
      <OLevelPageClient testimonials={oLevelTestimonials} faqs={faqs} />
    </>
  );
}
