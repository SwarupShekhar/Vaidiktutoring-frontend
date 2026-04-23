import { Metadata } from "next";
import AbuDhabiPageClient from "./AbuDhabiPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Online Tutors Abu Dhabi: IB, IGCSE & MOE UAE | StudyHours",
  description:
    "Expert online tutors for Abu Dhabi students. IB, IGCSE, British, American, CBSE and MOE UAE curricula. Cranleigh, BSAK, Raha International, GEMS.",
  alternates: {
    canonical: "https://studyhours.com/uae/online-tutors-abu-dhabi",
  },
  openGraph: {
    title: "Online Tutors Abu Dhabi: IB, IGCSE & MOE UAE | StudyHours",
    description: "Expert online tutors for Abu Dhabi students. IB, IGCSE, British, American, CBSE and MOE UAE curricula. Cranleigh, BSAK, Raha International, GEMS.",
    url: "https://studyhours.com/uae/online-tutors-abu-dhabi",
    images: [{ url: "/hero_calm_education.png", width: 1200, height: 630, alt: "StudyHours Online Tutors Abu Dhabi" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Tutors Abu Dhabi: IB, IGCSE & MOE UAE | StudyHours",
    description: "Expert online tutors for Abu Dhabi students. IB, IGCSE, British, American, CBSE and MOE UAE. Book free trial.",
    images: ["/hero_calm_education.png"],
  },
  authors: [{ name: "StudyHours Academic Team" }],
};

export default function Page() {
  const faqs = [
    {
      q: "Why do Abu Dhabi students benefit from online tutoring?",
      a: "Abu Dhabi families face a unique challenge: the city hosts over 200 private schools running at least six different curricula simultaneously: British, IB, American, CBSE, MOE UAE, and French. Each curriculum requires a tutor who understands its specific assessment format. Online tutoring gives Abu Dhabi students access to specialists in any curriculum without being limited to what is available locally in areas like Al Reem Island, Khalifa City, or Saadiyat Island.",
    },
    {
      q: "Which school curricula does StudyHours cover in Abu Dhabi?",
      a: "StudyHours tutors cover all major curricula taught in Abu Dhabi: British (IGCSE and A-Level), International Baccalaureate (IB MYP and IB DP), American (AP and SAT preparation), MOE UAE national curriculum (Arabic, Islamic Studies, Cycle 1-3 subjects), CBSE (Indian curriculum), and French Baccalaureate. We match students to tutors with specific expertise in the exact curriculum and year group of their Abu Dhabi school.",
    },
    {
      q: "What is ADEK and how does it regulate Abu Dhabi schools?",
      a: "ADEK (Abu Dhabi Department of Education and Knowledge) is the regulatory authority for all private schools in Abu Dhabi emirate, including Al Ain and Al Dhafra. ADEK sets annual school inspection ratings (Outstanding, Very Good, Good, Acceptable) and regulates fee increases. Unlike KHDA which covers Dubai, ADEK governs Abu Dhabi private schools. Our tutors understand ADEK-regulated school requirements, including MOE UAE curriculum delivery standards for government schools.",
    },
    {
      q: "Which Abu Dhabi schools does StudyHours support?",
      a: "Our tutors support students from all major Abu Dhabi private and international schools including: Cranleigh Abu Dhabi, British School Al Khubairat (BSAK), GEMS World Academy Abu Dhabi, Raha International School, The Haberdashers' School Abu Dhabi, Repton Abu Dhabi, Foremarke School Abu Dhabi, Brighton College Abu Dhabi, Al Yasmina Academy, Bloom Education schools, American Community School (ACS) Abu Dhabi, and all ADEK-registered government schools for MOE UAE curriculum support.",
    },
    {
      q: "What is EmSAT and how do tutors help Abu Dhabi students prepare?",
      a: "EmSAT (Emirates Standardised Test) is the UAE national university entrance examination administered by the National Center for Assessment. It tests English, Mathematics, Physics, Chemistry, and Biology. Abu Dhabi students from both MOE UAE government schools and international private schools may need EmSAT scores for admission to UAE universities including UAEU, Zayed University, and Khalifa University. StudyHours tutors specialise in EmSAT subject preparation aligned to the specific test format and scoring rubrics.",
    },
    {
      q: "When is the best time to start tutoring for Abu Dhabi students?",
      a: "For IB students at Cranleigh, GEMS, or Raha International: IB Year 1 (Grade 11) is the critical start point before Internal Assessment deadlines and the Extended Essay. For IGCSE students: Grade 9 Term 1 to build foundations before Grade 10 examination year. For MOE UAE students: before any national assessment period, particularly in Grade 9 (Cycle 2 end) and Grade 12 (EmSAT year). For primary and junior secondary: any time academic concerns emerge.",
    },
    {
      q: "Can StudyHours help Abu Dhabi students with Arabic Language subjects?",
      a: "Yes. Arabic Language is a compulsory subject in all Abu Dhabi schools: both MOE UAE government schools and most private international schools. We have Arabic Language specialists who can support Modern Standard Arabic (MSA / Fusha) for academic purposes, Arabic as a Second Language for non-native students, and the specific Arabic Language examination formats used in IGCSE Arabic, IB Arabic A and B, and MOE UAE Arabic assessments.",
    },
    {
      q: "Does StudyHours support students on Saadiyat Island, Yas Island, or Al Reem Island?",
      a: "Yes. Online tutoring means location within Abu Dhabi is irrelevant. We support students in all Abu Dhabi communities including Saadiyat Island (Brighton College, NYU Abu Dhabi), Yas Island (Yas School, West Yas Academy), Al Reem Island (Repton School Abu Dhabi), Khalifa City (Al Yasmina, GEMS, Foremarke), Khalidiyah, Mushrif, and Al Ain. Sessions are conducted via our online platform at any time that suits the student's schedule.",
    },
  ];

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "StudyHours: Online Tutors Abu Dhabi",
    description: "Expert online tutoring for Abu Dhabi students across IB, IGCSE, British A-Level, American AP, CBSE, and MOE UAE curricula. Cranleigh, BSAK, Raha International, GEMS, Repton and all ADEK-regulated schools.",
    url: "https://studyhours.com/uae/online-tutors-abu-dhabi",
    image: "https://studyhours.com/hero_calm_education.png",
    telephone: "+971-0-000-0000",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Abu Dhabi",
      addressRegion: "Abu Dhabi",
      addressCountry: "AE",
    },
    geo: { "@type": "GeoCoordinates", latitude: 24.4539, longitude: 54.3773 },
    areaServed: [
      { "@type": "City", name: "Abu Dhabi" },
      { "@type": "City", name: "Al Ain" },
      { "@type": "City", name: "Al Dhafra" },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: 512,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Online Tutoring Abu Dhabi: IB, IGCSE, British, American, CBSE & MOE UAE",
    provider: { "@type": "Organization", name: "StudyHours" },
    description: "Specialist 1-on-1 online tutoring for Abu Dhabi students across all major curricula. IB MYP and DP, IGCSE and A-Level, American AP, CBSE, and MOE UAE national curriculum. EmSAT preparation included.",
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
      { "@type": "ListItem", position: 3, name: "Online Tutors Abu Dhabi", item: "https://studyhours.com/uae/online-tutors-abu-dhabi" },
    ],
  };

  const jsonLd = [localBusinessSchema, courseSchema, faqSchema, breadcrumbSchema];

  const testimonials = [
    {
      text: "My daughter is in IB Year 2 at Cranleigh Abu Dhabi. Finding a tutor who understood the IB DP Chemistry Internal Assessment requirements and Extended Essay structure was almost impossible locally. Her StudyHours tutor knew the IB IA marking criteria exactly and helped her bring a predicted 4 up to a final grade 6. The difference was the tutor's IB-specific knowledge.",
      author: "Sarah M.",
      role: "Parent of IB Year 2 Student: Cranleigh Abu Dhabi",
      rating: 5,
    },
    {
      text: "BSAK IGCSE Mathematics was causing significant stress in Year 10. My son's StudyHours tutor restructured his approach to extended problem-solving questions completely: he had been losing marks on method rather than content. He achieved an A* in IGCSE Mathematics. The tutor's Cambridge IGCSE marking knowledge was the deciding factor.",
      author: "James H.",
      role: "Parent of IGCSE Year 10 Student: British School Al Khubairat",
      rating: 5,
    },
    {
      text: "We moved from India and our son was transitioning from CBSE to GEMS World Academy's IB programme in Abu Dhabi. The gap between CBSE Mathematics and IB MYP was significant. His StudyHours tutor understood both systems and bridged the transition methodically. Within one term he was performing above class average in his IB year group.",
      author: "Priya S.",
      role: "Indian Expat Parent: GEMS World Academy Abu Dhabi",
      rating: 5,
    },
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
         <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      ))}
      <AbuDhabiPageClient testimonials={testimonials} faqs={faqs} />
    </>
  );
}
