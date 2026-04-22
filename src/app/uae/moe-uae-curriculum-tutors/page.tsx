import { Metadata } from "next";
import MOEUAEPageClient from "./MOEUAEPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "MOE UAE Tutors | Arabic, Maths & EmSAT Prep | Study Hours",
  description:
    "Expert online tutors for the UAE Ministry of Education curriculum. Arabic, Islamic Studies, Mathematics and Sciences for Cycle 1–3. EmSAT university entrance preparation.",
  alternates: {
    canonical: "https://studyhours.com/uae/moe-uae-curriculum-tutors",
  },
  openGraph: {
    title: "MOE UAE Curriculum Tutors Online | StudyHours",
    description: "Online tutors for the UAE Ministry of Education curriculum. Arabic, Islamic Studies, Mathematics and Sciences for Cycle 1-3. EmSAT preparation.",
    url: "https://studyhours.com/uae/moe-uae-curriculum-tutors",
    images: [{ url: "/hero_calm_education.png", width: 1200, height: 630, alt: "StudyHours MOE UAE Curriculum Tutors" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MOE UAE Curriculum Tutors Online | StudyHours",
    description: "Online tutors for UAE Ministry of Education curriculum. Arabic, Islamic Studies, Maths, Science. EmSAT prep.",
    images: ["/hero_calm_education.png"],
  },
  authors: [{ name: "StudyHours Academic Team" }],
};

export default function Page() {
  const faqs = [
    {
      q: "What is the UAE Ministry of Education (MOE UAE) curriculum?",
      a: "The UAE Ministry of Education curriculum is the national framework for government schools and many private schools across all seven emirates. It is structured in three cycles: Cycle 1 (Grades 1-4), Cycle 2 (Grades 5-8), and Cycle 3 (Grades 9-12). Core subjects include Arabic Language, Islamic Education, Mathematics, Science, Social Studies, and English as an Additional Language. The curriculum was significantly reformed under the National Agenda 2021 and UAE Vision 2031, with PISA-aligned improvements to Mathematics and Science content.",
    },
    {
      q: "How is the MOE UAE school system structured?",
      a: "UAE government schools follow a 12-year structure divided into three cycles. Cycle 1 (Grades 1-4) focuses on foundational Arabic literacy, numeracy, and Islamic values. Cycle 2 (Grades 5-8) expands into Sciences, Social Studies, and Computer Technology. Cycle 3 (Grades 9-12) offers both Arts and Sciences tracks, culminating in the UAE national secondary certificate assessed through school-based continuous assessment and the EmSAT university entrance examination. MOE UAE private schools (national schools accepting Emirati and Arab nationals) follow the same framework.",
    },
    {
      q: "What is EmSAT and which UAE students need to take it?",
      a: "EmSAT (Emirates Standardised Test) is the UAE national university entrance examination administered by the National Center for Assessment. It tests English, Mathematics, Physics, Chemistry, Biology, and Arabic. All UAE national secondary school graduates and many international school students need EmSAT scores for admission to UAE federal universities: UAE University (UAEU), Zayed University, and Higher Colleges of Technology (HCT), as well as most UAE private universities. Minimum EmSAT scores are set per faculty: Engineering requires higher Math and Physics scores than Humanities.",
    },
    {
      q: "What subjects are taught in MOE UAE government schools?",
      a: "MOE UAE core subjects include: Arabic Language (compulsory all cycles: reading, writing, grammar, literature), Islamic Education (compulsory for Muslim students: Quran, Hadith, Fiqh), Mathematics (bilingual delivery from Cycle 2 onward in many schools), Science (integrated in Cycle 1, then Physics, Chemistry, Biology from Cycle 2), Social Studies and Moral Education, English as an Additional Language, and Information and Communications Technology. Moral Education was added in 2017 as a standalone compulsory subject across all grade levels.",
    },
    {
      q: "How does Arabic Language instruction work in MOE UAE schools?",
      a: "Arabic Language is a compulsory subject in MOE UAE schools delivered in Modern Standard Arabic (Fusha). It includes four components: reading comprehension (Qiraah), grammar (Qawaid), writing and composition (Kitabah), and oral expression (Muhadatha). Emirati students are expected to read and write at a high standard from early Cycle 1. Non-native Arabic speakers in UAE national schools follow an Arabic as an Additional Language stream with modified expectations. StudyHours has Arabic Language specialists for both native Emirati students and non-native Arabic learners.",
    },
    {
      q: "What is Moral Education in the UAE MOE curriculum?",
      a: "Moral Education is a compulsory subject introduced across all UAE government schools from Grade 1 to Grade 12 by the Crown Prince Court of Abu Dhabi. It covers four pillars: Character and Morality, The Individual and the Community, Civic Studies, and Cultural Studies. The content introduces Emirati values, UAE national identity, global citizenship, and ethical reasoning. Moral Education is assessed by continuous assessment and contributes to overall grade averages. StudyHours tutors can support Moral Education essay and reflection components.",
    },
    {
      q: "Can StudyHours help non-Emirati students attending MOE UAE national schools?",
      a: "Yes. MOE UAE national schools (government schools) primarily serve Emirati nationals, but some non-Emirati Arab families also enrol their children in national schools. For these students, particularly those who have grown up abroad or speak Arabic as a second language, the Arabic Language and Islamic Studies demands can be very challenging. StudyHours tutors help non-native Arabic speakers build academic Arabic proficiency and support Islamic Studies content understanding.",
    },
    {
      q: "How are StudyHours tutors different from general private tutors for MOE UAE?",
      a: "MOE UAE has undergone significant curriculum reform since 2014 including the National Agenda parameters, TIMSS and PISA benchmark targets, and the Moral Education addition. A general tutor may not track these updates. StudyHours MOE UAE tutors keep current with syllabus documents, assessment rubrics, and the specific expectations of UAE government school continuous assessment formats. They also understand the specific Arabic Language text types and Islamic Studies topics tested at each cycle level.",
    },
  ];

  const educationalOrgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "StudyHours: MOE UAE Curriculum Tutors",
    description: "Expert online tutors for the full UAE Ministry of Education curriculum across Cycle 1, 2 and 3. Arabic Language, Islamic Education, Mathematics, Sciences, Moral Education. EmSAT university entrance preparation.",
    url: "https://studyhours.com/uae/moe-uae-curriculum-tutors",
    image: "https://studyhours.com/hero_calm_education.png",
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "348",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "MOE UAE National Curriculum Online Tutoring: Cycle 1, 2 and 3",
    provider: { "@type": "Organization", name: "StudyHours" },
    description: "Specialist online tutoring for UAE Ministry of Education curriculum students. Arabic Language, Islamic Education, Mathematics, Sciences and Moral Education across Cycle 1 to Cycle 3. EmSAT preparation for UAEU, Zayed University and HCT.",
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
      { "@type": "ListItem", position: 3, name: "MOE UAE Curriculum Tutors", item: "https://studyhours.com/uae/moe-uae-curriculum-tutors" },
    ],
  };

  const jsonLd = [educationalOrgSchema, courseSchema, faqSchema, breadcrumbSchema];

  const testimonials = [
    {
      text: "My son attends a government school in Abu Dhabi and was struggling with Grade 10 Arabic Language and Mathematics. The curriculum had changed significantly from when I was at school. His StudyHours tutor understood the current MOE UAE Cycle 3 Arabic Language requirements exactly: the text types, grammar marking criteria, and composition structure. His Arabic grade went from 72 to 91 over two terms.",
      author: "Mariam K.",
      role: "Emirati Parent: Grade 10, Government School, Abu Dhabi",
      rating: 5,
    },
    {
      text: "My daughter needed EmSAT Mathematics preparation for admission to an Engineering programme at UAEU. The EmSAT Math test is very different from her school-based continuous assessment. Her StudyHours tutor focused specifically on EmSAT question patterns and the timing strategy required for the test. She achieved 900 on EmSAT Math, exceeding the UAEU Engineering minimum requirement.",
      author: "Abdullah R.",
      role: "Emirati Parent: Grade 12, Dubai Government School",
      rating: 5,
    },
    {
      text: "We are an Arab expat family from Jordan and enrolled our daughter in a UAE national school for one year while my husband was posted here. The Moral Education subject and the UAE-specific Social Studies content were completely unfamiliar. Her StudyHours tutor helped her understand both the content and the Emirati cultural context she needed to write meaningfully about UAE National Identity topics.",
      author: "Dina S.",
      role: "Arab Expat Parent: Grade 8, UAE National School, Sharjah",
      rating: 5,
    },
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
         <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      ))}
      <MOEUAEPageClient testimonials={testimonials} faqs={faqs} />
    </>
  );
}
